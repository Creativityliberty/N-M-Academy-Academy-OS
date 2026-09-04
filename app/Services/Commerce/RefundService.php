<?php

declare(strict_types=1);

namespace App\Services\Commerce;

use App\Models\AcademyOrder;
use App\Models\AcademyRefund;
use App\Models\AffiliateCommission;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Stripe\Refund;
use Stripe\Stripe;

class RefundService
{
    public function __construct(private readonly AccessProjectionService $accessProjection) {}

    public function refund(
        User $actor,
        AcademyOrder $order,
        int $amount,
        ?string $reason = null,
        ?string $receiptId = null,
    ): AcademyRefund {
        abort_unless(
            $actor->hasAnyRole(['admin', 'super-admin']) || (int) $order->trainer_id === (int) $actor->id,
            403,
        );
        abort_unless(
            in_array($order->status, ['paid', 'partially_refunded'], true),
            422,
            'Commande non remboursable.',
        );
        abort_unless($order->stripe_payment_intent_id, 422, 'Aucun PaymentIntent remboursable enregistré.');

        $remaining = max(0, (int) $order->gross_amount - (int) $order->refunded_amount);
        abort_unless($amount > 0 && $amount <= $remaining, 422, 'Montant de remboursement invalide.');

        $record = AcademyRefund::create([
            'order_id' => $order->id,
            'requested_by' => $actor->id,
            'amount' => $amount,
            'currency' => $order->currency,
            'reason' => $reason,
            'status' => 'pending',
            'receipt_id' => $receiptId,
        ]);

        Stripe::setApiKey((string) config('cashier.secret'));

        try {
            $stripeRefund = Refund::create([
                'payment_intent' => $order->stripe_payment_intent_id,
                'amount' => $amount,
                'reason' => in_array($reason, ['duplicate', 'fraudulent', 'requested_by_customer'], true)
                    ? $reason
                    : 'requested_by_customer',
                'reverse_transfer' => true,
                'refund_application_fee' => true,
                'metadata' => [
                    'academy_order_id' => (string) $order->id,
                    'academy_refund_id' => (string) $record->id,
                    'receipt_id' => (string) $receiptId,
                ],
            ]);
        } catch (\Throwable $exception) {
            $record->update(['status' => 'failed', 'processed_at' => now()]);
            throw $exception;
        }

        return DB::transaction(function () use ($record, $order, $stripeRefund): AcademyRefund {
            $status = (string) $stripeRefund->status;
            $record->update([
                'stripe_refund_id' => $stripeRefund->id,
                'status' => $status,
                'processed_at' => in_array($status, ['succeeded', 'failed', 'canceled'], true) ? now() : null,
            ]);

            $this->synchronizeOrder($order->fresh());

            return $record->fresh();
        });
    }

    public function synchronizeOrder(AcademyOrder $order): AcademyOrder
    {
        $effectiveRefund = (int) AcademyRefund::query()
            ->where('order_id', $order->id)
            ->whereIn('status', ['pending', 'requires_action', 'succeeded'])
            ->sum('amount');
        $effectiveRefund = min((int) $order->gross_amount, $effectiveRefund);

        $platformFeeRefund = 0;

        if ($effectiveRefund > 0 && (int) $order->gross_amount > 0) {
            $platformFeeRefund = min(
                (int) $order->platform_fee_amount,
                (int) round((int) $order->platform_fee_amount * ($effectiveRefund / (int) $order->gross_amount)),
            );
        }

        $status = match (true) {
            $effectiveRefund >= (int) $order->gross_amount && (int) $order->gross_amount > 0 => 'refunded',
            $effectiveRefund > 0 => 'partially_refunded',
            default => 'paid',
        };

        $order->update([
            'refunded_amount' => $effectiveRefund,
            'refunded_platform_fee_amount' => $platformFeeRefund,
            'status' => $status,
        ]);

        $commission = AffiliateCommission::query()->where('order_id', $order->id)->first();

        if ($commission) {
            $reversed = 0;

            if ($effectiveRefund > 0 && (int) $order->gross_amount > 0) {
                $reversed = min(
                    (int) $commission->amount,
                    (int) round((int) $commission->amount * ($effectiveRefund / (int) $order->gross_amount)),
                );
            }

            $commission->update([
                'reversed_amount' => $reversed,
                'status' => $reversed >= (int) $commission->amount ? 'void' : 'accrued',
            ]);
        }

        if ($status === 'refunded') {
            $this->accessProjection->refresh((int) $order->user_id, (int) $order->course_id);
        }

        return $order->fresh();
    }
}
