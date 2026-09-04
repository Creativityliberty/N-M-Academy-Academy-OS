<?php

declare(strict_types=1);

namespace App\Actions\Admin\Plans;

use App\Models\Plan;
use App\Repositories\Admin\Plans\PlanRepository;
use Stripe\Price;
use Stripe\Product;
use Stripe\Stripe;

class UpdatePlanAction
{
    public function __construct(
        private readonly PlanRepository $repository,
    ) {}

    public function handle(Plan $plan, array $data): Plan
    {
        Stripe::setApiKey(config('cashier.secret'));

        if ($plan->stripe_product_id) {
            Product::update($plan->stripe_product_id, ['name' => $data['name']]);
        }

        $priceInCents = (int) round($data['price'] * 100);
        $data['price'] = $priceInCents;

        if ($priceInCents !== $plan->price || $data['currency'] !== $plan->currency->value || $data['interval'] !== $plan->interval->value) {
            if ($plan->stripe_price_id) {
                Price::update($plan->stripe_price_id, ['active' => false]);
            }

            $newPrice = Price::create([
                'product' => $plan->stripe_product_id,
                'unit_amount' => $priceInCents,
                'currency' => $data['currency'],
                'recurring' => ['interval' => $data['interval']],
            ]);

            $data['stripe_price_id'] = $newPrice->id;
        }

        return $this->repository->update($plan, $data);
    }
}
