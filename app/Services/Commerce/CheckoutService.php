<?php

declare(strict_types=1);

namespace App\Services\Commerce;

use App\Models\AcademyCoupon;
use App\Models\AcademyOrder;
use App\Models\AffiliatePartner;
use App\Models\Course;
use App\Models\CourseOffer;
use App\Models\Enrollment;
use App\Models\TrainerCommerceSetting;
use App\Models\User;
use Illuminate\Support\Str;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class CheckoutService
{
    public function __construct(private readonly AccessProjectionService $accessProjection) {}
    public function defaultOffer(Course $course): CourseOffer
    {
        $existing = $course->offers()->where('is_active', true)->orderByDesc('is_default')->first();
        if ($existing) {
            return $existing;
        }

        return $course->offers()->create([
            'name' => 'Accès complet',
            'slug' => 'full-access',
            'billing_type' => ((float) $course->price) <= 0 ? 'free' : 'one_time',
            'amount' => max(0, (int) round(((float) $course->price) * 100)),
            'currency' => strtoupper((string) config('commerce.currency', 'EUR')),
            'access_rank' => 100,
            'is_default' => true,
            'is_active' => true,
        ]);
    }

    /** @return array{order: AcademyOrder, session: Session|null} */
    public function begin(User $student, Course $course, CourseOffer $offer, ?string $couponCode = null, ?string $affiliateCode = null): array
    {
        abort_unless($offer->course_id === $course->id && $offer->is_active, 404);
        abort_unless((bool) $course->trainer?->stripe_onboarding_completed || $offer->billing_type === 'free', 422, 'Le formateur doit terminer Stripe Connect.');

        $settings = TrainerCommerceSetting::forTrainer((int) $course->trainer_id);
        $coupon = $this->resolveCoupon($course, $couponCode);
        $affiliate = $this->resolveAffiliate($course, $affiliateCode);
        $subtotal = (int) $offer->amount;
        $discount = $this->discountAmount($coupon, $subtotal, $offer->currency);
        $gross = max(0, $subtotal - $discount);
        $platformFee = (int) round($gross * ((int) $settings->platform_fee_bps / 10000));
        $affiliateCommission = $affiliate
            ? min(max(0, $gross - $platformFee), (int) round($gross * ((int) $affiliate->commission_bps / 10000))): 0;

        $order = AcademyOrder::create([
            'trainer_id' => $course->trainer_id,
            'user_id' => $student->id,
            'course_id' => $course->id,
            'offer_id' => $offer->id,
            'coupon_id' => $coupon?->id,
            'affiliate_id' => $affiliate?->id,
            'kind' => $offer->billing_type,
            'status' => $offer->billing_type === 'free' ? 'paid' : 'pending',
            'currency' => strtoupper($offer->currency),
            'subtotal_amount' => $subtotal,
            'discount_amount' => $discount,
            'gross_amount' => $gross,
            'platform_fee_amount' => $platformFee,
            'affiliate_commission_amount' => $affiliateCommission,
            'paid_at' => $offer->billing_type === 'free' ? now() : null,
        ]);

        if ($offer->billing_type === 'free' || ($offer->billing_type === 'one_time' && $gross === 0)) {
            if ($order->status !== 'paid') {
                $order->update(['status' => 'paid', 'paid_at' => now()]);
            }
            $this->grantAccess($order->fresh());
            $this->consumeCoupon($coupon);

            return ['order' => $order->fresh(), 'session' => null];
        }

        Stripe::setApiKey((string) config('cashier.secret'));
        $priceData = [
            'currency' => strtolower($offer->currency),
            'unit_amount' => $gross,
            'product_data' => ['name' => $course->title.' — '.$offer->name],
        ];
        if ($offer->billing_type === 'subscription') {
            $priceData['recurring'] = ['interval' => $offer->interval ?: 'month'];
        }

        $metadata = [
            'type' => 'academy_course_checkout',
            'order_id' => (string) $order->id,
            'course_id' => (string) $course->id,
            'offer_id' => (string) $offer->id,
            'student_id' => (string) $student->id,
        ];

        $payload = [
            'mode' => $offer->billing_type === 'subscription' ? 'subscription' : 'payment',
            'customer_email' => $student->stripe_id ? null : $student->email,
            'line_items' => [['price_data' => $priceData, 'quantity' => 1]],
            'metadata' => $metadata,
            'success_url' => route('courses.purchase.success').'?order='.$order->id,
            'cancel_url' => route('courses.show', $course->id),
        ];
        if ($student->stripe_id) {
            $payload['customer'] = $student->stripe_id;
            unset($payload['customer_email']);
        }

        if ($offer->billing_type === 'subscription') {
            $payload['subscription_data'] = [
                'application_fee_percent' => round(((int) $settings->platform_fee_bps) / 100, 2),
                'transfer_data' => ['destination' => $course->trainer->stripe_account_id],
                'metadata' => $metadata,
                'trial_period_days' => $offer->trial_days > 0 ? $offer->trial_days : null,
            ];
            if ($payload['subscription_data']['trial_period_days'] === null) {
                unset($payload['subscription_data']['trial_period_days']);
            }
        } else {
            $payload['payment_intent_data'] = [
                'application_fee_amount' => $platformFee,
                'transfer_data' => ['destination' => $course->trainer->stripe_account_id],
                'metadata' => $metadata,
            ];
        }

        $session = Session::create($payload);
        $order->update(['stripe_checkout_session_id' => $session->id]);

        return ['order' => $order->fresh(), 'session' => $session];
    }

    public function grantAccess(AcademyOrder $order): Enrollment
    {
        $existing = Enrollment::query()->where('user_id',$order->user_id)->where('course_id',$order->course_id)->first();
        if ($existing) {
            $existing->update([
                'stripe_payment_intent_id'=>$order->stripe_payment_intent_id ?: $existing->stripe_payment_intent_id,
                'amount_paid'=>$order->status === 'paid' ? $order->gross_amount / 100 : $existing->amount_paid,
                'currency'=>$order->currency ?: $existing->currency,
                'paid_at'=>$order->paid_at ?: $existing->paid_at,
            ]);
        }
        return $this->accessProjection->refresh($order->user_id,$order->course_id)
            ?? throw new \RuntimeException('Unable to project course access.');
    }

    private function resolveCoupon(Course $course, ?string $code): ?AcademyCoupon
    {
        if (! $code) return null;
        $coupon = AcademyCoupon::query()->where('trainer_id', $course->trainer_id)->whereRaw('UPPER(code) = ?', [mb_strtoupper(trim($code))])->first();
        abort_unless($coupon && $coupon->usable() && (! $coupon->course_id || $coupon->course_id === $course->id), 422, 'Coupon invalide ou expiré.');
        return $coupon;
    }

    private function resolveAffiliate(Course $course, ?string $code): ?AffiliatePartner
    {
        if (! $code) return null;
        return AffiliatePartner::query()->where('trainer_id', $course->trainer_id)->where('is_active', true)->where('code', Str::lower(trim($code)))->first();
    }

    private function discountAmount(?AcademyCoupon $coupon, int $subtotal, string $currency): int
    {
        if (! $coupon) return 0;
        if ($coupon->discount_type === 'percent') return min($subtotal, (int) round($subtotal * ($coupon->discount_value / 10000)));
        abort_unless(! $coupon->currency || strtoupper($coupon->currency) === strtoupper($currency), 422, 'Devise du coupon incompatible.');
        return min($subtotal, (int) $coupon->discount_value);
    }

    public function consumeCoupon(?AcademyCoupon $coupon): void
    {
        if ($coupon) $coupon->increment('redemptions');
    }
}
