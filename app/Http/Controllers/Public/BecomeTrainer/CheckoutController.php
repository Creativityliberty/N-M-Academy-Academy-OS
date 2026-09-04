<?php

namespace App\Http\Controllers\Public\BecomeTrainer;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckoutController extends Controller
{
    public function show(Request $request, string $planSlug): Response
    {
        $plan = Plan::where('slug', $planSlug)
            ->where('is_active', true)
            ->firstOrFail();

        return $this->createCheckoutSession($request, $plan);
    }

    public function store(Request $request): Response
    {
        $request->validate([
            'plan_slug' => ['required', 'string', 'exists:plans,slug'],
        ]);

        $plan = Plan::where('slug', $request->plan_slug)
            ->where('is_active', true)
            ->firstOrFail();

        return $this->createCheckoutSession($request, $plan);
    }

    private function createCheckoutSession(Request $request, Plan $plan): Response
    {
        $session = $request->user()->newSubscription('trainer', $plan->stripe_price_id)
            ->checkout([
                'success_url' => route('become-trainer.success'),
                'cancel_url' => route('become-trainer.index'),
                'metadata' => [
                    'type' => 'trainer_subscription',
                    'plan_slug' => $plan->slug,
                ],
            ]);

        return Inertia::location($session->url);
    }
}
