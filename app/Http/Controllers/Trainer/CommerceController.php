<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Models\AcademyCoupon;
use App\Models\AcademyOrder;
use App\Models\AffiliatePartner;
use App\Models\Course;
use App\Models\CourseOffer;
use App\Models\TrainerCommerceSetting;
use App\Services\Commerce\RefundService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CommerceController extends Controller
{
    public function storeOffer(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => ['required', 'integer'],
            'name' => ['required', 'string', 'max:120'],
            'billing_type' => ['required', 'in:free,one_time,subscription'],
            'amount' => ['required', 'integer', 'min:0'],
            'currency' => ['required', 'string', 'size:3'],
            'interval' => ['nullable', 'in:month,year'],
            'access_rank' => ['required', 'integer', 'min:0', 'max:1000'],
            'trial_days' => ['nullable', 'integer', 'min:0', 'max:365'],
        ]);

        $course = Course::where('trainer_id', $request->user()->id)->findOrFail($validated['course_id']);

        if ($validated['billing_type'] === 'subscription') {
            abort_if(empty($validated['interval']), 422, 'Interval requis pour un abonnement.');
            abort_if((int) $validated['amount'] <= 0, 422, 'Un abonnement payant doit avoir un montant supérieur à zéro.');
        } else {
            $validated['interval'] = null;
        }

        if ($validated['billing_type'] === 'free') {
            $validated['amount'] = 0;
            $validated['trial_days'] = 0;
        }

        CourseOffer::create([
            ...$validated,
            'course_id' => $course->id,
            'currency' => strtoupper($validated['currency']),
            'slug' => Str::slug($validated['name']).'-'.Str::lower(Str::random(5)),
            'is_active' => true,
        ]);

        return back()->with('success', 'Offre créée.');
    }

    public function toggleOffer(Request $request, CourseOffer $offer): RedirectResponse
    {
        abort_unless((int) $offer->course()->value('trainer_id') === (int) $request->user()->id, 403);
        $offer->update(['is_active' => ! $offer->is_active]);

        return back()->with('success', $offer->is_active ? 'Offre activée.' : 'Offre désactivée.');
    }

    public function storeCoupon(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => ['nullable', 'integer'],
            'code' => ['required', 'string', 'max:64'],
            'discount_type' => ['required', 'in:percent,fixed'],
            'discount_value' => ['required', 'integer', 'min:1'],
            'currency' => ['nullable', 'string', 'size:3'],
            'max_redemptions' => ['nullable', 'integer', 'min:1'],
            'expires_at' => ['nullable', 'date'],
        ]);

        if (! empty($validated['course_id'])) {
            Course::where('trainer_id', $request->user()->id)->findOrFail($validated['course_id']);
        }

        if ($validated['discount_type'] === 'percent') {
            abort_if((int) $validated['discount_value'] > 10000, 422, 'Une remise en pourcentage ne peut pas dépasser 100 %.');
            $validated['currency'] = null;
        } else {
            $validated['currency'] = strtoupper(
                $validated['currency'] ?: TrainerCommerceSetting::forTrainer($request->user()->id)->currency,
            );
        }

        $code = mb_strtoupper(trim($validated['code']));
        abort_if(
            AcademyCoupon::query()->where('trainer_id', $request->user()->id)->where('code', $code)->exists(),
            422,
            'Ce code coupon existe déjà.',
        );

        AcademyCoupon::create([
            ...$validated,
            'trainer_id' => $request->user()->id,
            'code' => $code,
            'is_active' => true,
        ]);

        return back()->with('success', 'Coupon créé.');
    }

    public function toggleCoupon(Request $request, AcademyCoupon $coupon): RedirectResponse
    {
        abort_unless((int) $coupon->trainer_id === (int) $request->user()->id, 403);
        $coupon->update(['is_active' => ! $coupon->is_active]);

        return back()->with('success', $coupon->is_active ? 'Coupon activé.' : 'Coupon désactivé.');
    }

    public function storeAffiliate(Request $request): RedirectResponse
    {
        $settings = TrainerCommerceSetting::forTrainer($request->user()->id);
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['nullable', 'email', 'max:255'],
            'code' => ['nullable', 'string', 'max:64'],
            'commission_bps' => ['nullable', 'integer', 'min:0', 'max:10000'],
        ]);

        $code = Str::lower(trim((string) ($validated['code'] ?: Str::random(10))));
        abort_if(
            AffiliatePartner::query()->where('trainer_id', $request->user()->id)->where('code', $code)->exists(),
            422,
            'Ce code affilié existe déjà.',
        );

        AffiliatePartner::create([
            'trainer_id' => $request->user()->id,
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'code' => $code,
            'commission_bps' => $validated['commission_bps'] ?? $settings->default_affiliate_bps,
            'is_active' => true,
        ]);

        return back()->with('success', 'Affilié créé.');
    }

    public function toggleAffiliate(Request $request, AffiliatePartner $affiliate): RedirectResponse
    {
        abort_unless((int) $affiliate->trainer_id === (int) $request->user()->id, 403);
        $affiliate->update(['is_active' => ! $affiliate->is_active]);

        return back()->with('success', $affiliate->is_active ? 'Affilié activé.' : 'Affilié désactivé.');
    }

    public function refund(Request $request, AcademyOrder $order, RefundService $refunds): RedirectResponse
    {
        abort_unless((int) $order->trainer_id === (int) $request->user()->id, 403);

        $validated = $request->validate([
            'amount' => ['required', 'integer', 'min:1'],
            'phrase' => ['required', 'string'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $expected = 'REFUND ORDER '.$order->id.' AMOUNT '.(int) $validated['amount'];
        abort_unless(hash_equals($expected, trim((string) $validated['phrase'])), 422, 'Phrase de confirmation incorrecte.');

        $refunds->refund(
            $request->user(),
            $order,
            (int) $validated['amount'],
            $validated['reason'] ?? null,
        );

        return back()->with('success', 'Remboursement transmis à Stripe.');
    }
}
