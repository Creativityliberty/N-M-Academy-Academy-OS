<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public\BecomeTrainer;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Plan;
use App\Models\TrainerCommerceSetting;
use Symfony\Component\HttpFoundation\Response;

class WebhookController extends Controller
{
    public function handleCheckoutSessionCompleted(array $payload): Response
    {
        $session = $payload['data']['object'] ?? [];
        $customerId = $session['customer'] ?? null;

        if ($customerId) {
            $user = User::where('stripe_id', $customerId)->first();
            $user?->assignRole(RoleEnum::Trainer->value);
            $planSlug = $session['metadata']['plan_slug'] ?? null;
            $plan = $planSlug ? Plan::where('slug', $planSlug)->first() : null;
            if ($user && $plan && $plan->platform_fee_bps !== null) {
                TrainerCommerceSetting::updateOrCreate(
                    ['trainer_id' => $user->id],
                    ['platform_fee_bps' => (int) $plan->platform_fee_bps, 'default_affiliate_bps' => (int) config('commerce.default_affiliate_bps', 1000), 'currency' => strtoupper((string) config('commerce.currency', 'EUR'))],
                );
            }
        }

        return response('', 200);
    }
}
