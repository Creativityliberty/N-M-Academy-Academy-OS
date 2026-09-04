<?php

declare(strict_types=1);

namespace App\Services\Commerce;

use App\Enums\RoleEnum;
use App\Models\AcademyMembership;
use App\Models\AcademyOrder;
use App\Models\AcademyRefund;
use App\Models\AffiliateCommission;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CommerceWebhookService
{
    public function __construct(
        private readonly CheckoutService $checkout,
        private readonly AccessProjectionService $accessProjection,
        private readonly RefundService $refunds,
    ) {}

    public function checkoutCompleted(array $session): void
    {
        $orderId = (int) ($session['metadata']['order_id'] ?? 0);
        $order = AcademyOrder::with(['offer', 'affiliate'])->find($orderId);

        if (! $order || $order->paid_at !== null || in_array($order->status, ['paid', 'partially_refunded', 'refunded'], true)) {
            return;
        }

        DB::transaction(function () use ($order, $session): void {
            $order->update([
                'status' => 'paid',
                'stripe_checkout_session_id' => $session['id'] ?? $order->stripe_checkout_session_id,
                'stripe_payment_intent_id' => $session['payment_intent'] ?? null,
                'stripe_subscription_id' => $session['subscription'] ?? null,
                'gross_amount' => isset($session['amount_total']) ? (int) $session['amount_total'] : $order->gross_amount,
                'paid_at' => now(),
            ]);

            $order = $order->fresh(['offer', 'affiliate']);
            $this->checkout->grantAccess($order);
            $this->checkout->consumeCoupon($order->coupon);

            $student = User::find($order->user_id);
            $student?->assignRole(RoleEnum::Student->value);

            if ($student && ! $student->stripe_id && ! empty($session['customer'])) {
                $student->update(['stripe_id' => (string) $session['customer']]);
            }

            $this->accrueAffiliateCommission($order);

            if ($order->kind === 'subscription' && $order->stripe_subscription_id && $order->offer_id) {
                AcademyMembership::updateOrCreate(
                    ['stripe_subscription_id' => $order->stripe_subscription_id],
                    [
                        'order_id' => $order->id,
                        'user_id' => $order->user_id,
                        'course_id' => $order->course_id,
                        'offer_id' => $order->offer_id,
                        'status' => 'active',
                        'recurring_amount' => $order->gross_amount,
                        'currency' => $order->currency,
                        'interval' => $order->offer?->interval,
                    ],
                );
            }
        });
    }

    public function subscriptionUpdated(array $subscription): void
    {
        $id = (string) ($subscription['id'] ?? '');

        if ($id === '') {
            return;
        }

        $membership = AcademyMembership::where('stripe_subscription_id', $id)->first();

        if (! $membership) {
            return;
        }

        $membership->update([
            'status' => (string) ($subscription['status'] ?? $membership->status),
            'current_period_start' => isset($subscription['current_period_start'])
                ? now()->setTimestamp((int) $subscription['current_period_start'])
                : $membership->current_period_start,
            'current_period_end' => isset($subscription['current_period_end'])
                ? now()->setTimestamp((int) $subscription['current_period_end'])
                : $membership->current_period_end,
            'canceled_at' => isset($subscription['canceled_at']) && $subscription['canceled_at']
                ? now()->setTimestamp((int) $subscription['canceled_at'])
                : null,
        ]);

        $this->accessProjection->refresh((int) $membership->user_id, (int) $membership->course_id);
    }

    public function subscriptionDeleted(array $subscription): void
    {
        $membership = AcademyMembership::where(
            'stripe_subscription_id',
            (string) ($subscription['id'] ?? ''),
        )->first();

        if (! $membership) {
            return;
        }

        DB::transaction(function () use ($membership): void {
            $membership->update([
                'status' => 'canceled',
                'canceled_at' => $membership->canceled_at ?? now(),
                'ended_at' => now(),
            ]);

            $this->accessProjection->refresh((int) $membership->user_id, (int) $membership->course_id);
        });
    }

    public function invoicePaid(array $invoice): void
    {
        $subscriptionId = (string) (
            $invoice['subscription']
            ?? data_get($invoice, 'parent.subscription_details.subscription')
            ?? ''
        );
        $orderId = (int) (data_get($invoice, 'parent.subscription_details.metadata.order_id') ?? 0);

        if ($subscriptionId === '') {
            return;
        }

        $membership = AcademyMembership::with(['offer', 'order.affiliate', 'course'])
            ->where('stripe_subscription_id', $subscriptionId)
            ->first();

        if (! $membership && $orderId > 0) {
            $seed = AcademyOrder::with(['offer', 'course', 'affiliate'])->find($orderId);

            if ($seed && $seed->offer_id) {
                $membership = AcademyMembership::updateOrCreate(
                    ['stripe_subscription_id' => $subscriptionId],
                    [
                        'order_id' => $seed->id,
                        'user_id' => $seed->user_id,
                        'course_id' => $seed->course_id,
                        'offer_id' => $seed->offer_id,
                        'status' => 'active',
                        'recurring_amount' => $seed->gross_amount,
                        'currency' => $seed->currency,
                        'interval' => $seed->offer?->interval,
                    ],
                );
                $membership->load(['offer', 'order.affiliate', 'course']);
            }
        }

        if (! $membership) {
            return;
        }

        $invoiceId = (string) ($invoice['id'] ?? '');

        if ($invoiceId === '') {
            return;
        }

        $paymentIntent = $invoice['payment_intent'] ?? data_get($invoice, 'payments.data.0.payment.payment_intent');
        $billingReason = (string) ($invoice['billing_reason'] ?? '');
        $amount = (int) ($invoice['amount_paid'] ?? 0);
        $currency = strtoupper((string) ($invoice['currency'] ?? $membership->currency ?? $membership->offer?->currency ?? 'EUR'));

        if ($billingReason === 'subscription_create' || ($membership->order && ! $membership->order->stripe_invoice_id)) {
            $membership->order?->update([
                'stripe_invoice_id' => $invoiceId,
                'stripe_payment_intent_id' => is_string($paymentIntent)
                    ? $paymentIntent
                    : $membership->order->stripe_payment_intent_id,
            ]);

            $membership->update([
                'status' => 'active',
                'recurring_amount' => $amount > 0 ? $amount : max(0, (int) ($membership->order?->gross_amount ?? $membership->recurring_amount)),
                'currency' => $currency,
                'interval' => $membership->offer?->interval ?? $membership->interval,
            ]);

            $this->accessProjection->refresh((int) $membership->user_id, (int) $membership->course_id);

            return;
        }

        if ($amount <= 0 || AcademyOrder::where('stripe_invoice_id', $invoiceId)->exists()) {
            return;
        }

        $original = $membership->order;
        $feeBps = $original && $original->gross_amount > 0
            ? (int) round($original->platform_fee_amount / $original->gross_amount * 10000)
            : (int) config('commerce.platform_fee_bps', 1500);
        $affiliateBps = (int) ($original?->affiliate?->commission_bps ?? 0);
        $affiliateCommission = $original?->affiliate_id
            ? min(max(0, $amount - (int) round($amount * $feeBps / 10000)), (int) round($amount * $affiliateBps / 10000))
            : 0;

        $renewal = AcademyOrder::create([
            'trainer_id' => $membership->course->trainer_id,
            'user_id' => $membership->user_id,
            'course_id' => $membership->course_id,
            'offer_id' => $membership->offer_id,
            'affiliate_id' => $original?->affiliate_id,
            'kind' => 'subscription_renewal',
            'status' => 'paid',
            'currency' => $currency,
            'subtotal_amount' => $amount,
            'gross_amount' => $amount,
            'platform_fee_amount' => (int) round($amount * $feeBps / 10000),
            'affiliate_commission_amount' => $affiliateCommission,
            'stripe_subscription_id' => $subscriptionId,
            'stripe_invoice_id' => $invoiceId,
            'stripe_payment_intent_id' => is_string($paymentIntent) ? $paymentIntent : null,
            'paid_at' => now(),
        ]);

        $this->accrueAffiliateCommission($renewal);
        $membership->update([
            'status' => 'active',
            'recurring_amount' => $amount,
            'currency' => $currency,
        ]);
        $this->accessProjection->refresh((int) $membership->user_id, (int) $membership->course_id);
    }

    public function refundUpdated(array $refund): void
    {
        $record = AcademyRefund::where('stripe_refund_id', (string) ($refund['id'] ?? ''))->first();

        if (! $record) {
            return;
        }

        DB::transaction(function () use ($record, $refund): void {
            $status = (string) ($refund['status'] ?? $record->status);
            $record->update([
                'status' => $status,
                'processed_at' => in_array($status, ['succeeded', 'failed', 'canceled'], true) ? now() : null,
            ]);

            $this->refunds->synchronizeOrder($record->order()->firstOrFail());
        });
    }

    private function accrueAffiliateCommission(AcademyOrder $order): void
    {
        if (! $order->affiliate_id || $order->affiliate_commission_amount <= 0) {
            return;
        }

        AffiliateCommission::firstOrCreate(
            ['affiliate_id' => $order->affiliate_id, 'order_id' => $order->id],
            [
                'amount' => $order->affiliate_commission_amount,
                'reversed_amount' => 0,
                'currency' => $order->currency,
                'status' => 'accrued',
            ],
        );
    }
}
