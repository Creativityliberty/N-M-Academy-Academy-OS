<?php

declare(strict_types=1);

namespace App\Services\Commerce;

use App\Models\AcademyMembership;
use App\Models\AcademyOrder;
use App\Models\AffiliateCommission;
use Illuminate\Support\Collection;

class CommerceAnalyticsService
{
    /** @return array<string, mixed> */
    public function forTrainer(int $trainerId): array
    {
        $orders = AcademyOrder::query()->where('trainer_id', $trainerId)->get();
        $paid = $orders->whereIn('status', ['paid', 'partially_refunded', 'refunded']);
        $attempts = $orders->whereIn('kind', ['one_time', 'subscription'])->count();
        $successful = $paid->whereIn('kind', ['one_time', 'subscription'])->count();

        $byCurrency = $paid->groupBy('currency')->map(function (Collection $rows, string $currency): array {
            $gross = (int) $rows->sum('gross_amount');
            $refunds = (int) $rows->sum('refunded_amount');
            $fees = (int) $rows->sum(fn (AcademyOrder $order) => max(0, (int) $order->platform_fee_amount - (int) $order->refunded_platform_fee_amount));
            $commissions = AffiliateCommission::query()->whereIn('order_id', $rows->pluck('id'))->where('status', 'accrued')->get();
            $affiliateNet = (int) $commissions->sum(fn (AffiliateCommission $commission) => max(0, (int) $commission->amount - (int) $commission->reversed_amount));
            $buyers = max(1, $rows->pluck('user_id')->unique()->count());

            return [
                'currency' => $currency,
                'gross' => $gross,
                'refunds' => $refunds,
                'net' => $gross - $refunds,
                'platformFees' => $fees,
                'affiliateCommissions' => $affiliateNet,
                'realizedLtv' => round(($gross - $refunds) / $buyers, 2),
            ];
        })->values()->all();

        $memberships = AcademyMembership::query()->with('offer')->whereHas('course', fn ($query) => $query->where('trainer_id', $trainerId))->get();
        $mrrByCurrency = $memberships->whereIn('status', ['active', 'trialing'])->groupBy(fn ($membership) => $membership->currency ?: ($membership->offer?->currency ?? 'EUR'))->map(function (Collection $rows, string $currency): array {
            $mrr = $rows->sum(function ($membership): float {
                $amount = (int) ($membership->recurring_amount ?: $membership->offer?->amount ?: 0);
                $interval = $membership->interval ?: $membership->offer?->interval;

                return $interval === 'year' ? $amount / 12 : $amount;
            });

            return ['currency' => $currency, 'mrr' => (int) round($mrr), 'active' => $rows->count()];
        })->values()->all();

        $monthStart = now()->startOfMonth();
        $canceledThisMonth = $memberships->filter(fn ($membership) => $membership->canceled_at && $membership->canceled_at->gte($monthStart))->count();
        $activeNow = $memberships->whereIn('status', ['active', 'trialing'])->count();
        $base = $activeNow + $canceledThisMonth;

        return [
            'checkoutAttempts' => $attempts,
            'successfulCheckouts' => $successful,
            'conversionRate' => $attempts > 0 ? round($successful / $attempts * 100, 2) : null,
            'revenueByCurrency' => $byCurrency,
            'mrrByCurrency' => $mrrByCurrency,
            'activeMemberships' => $activeNow,
            'canceledThisMonth' => $canceledThisMonth,
            'monthlyChurnRate' => $base > 0 ? round($canceledThisMonth / $base * 100, 2) : null,
        ];
    }
}
