<?php

declare(strict_types=1);

namespace App\Actions\Admin\Plans;

use App\Models\Plan;
use App\Repositories\Admin\Plans\PlanRepository;
use Stripe\Price;
use Stripe\Product;
use Stripe\Stripe;

class DeletePlanAction
{
    public function __construct(
        private readonly PlanRepository $repository,
    ) {}

    public function handle(Plan $plan): void
    {
        Stripe::setApiKey(config('cashier.secret'));

        if ($plan->stripe_price_id) {
            Price::update($plan->stripe_price_id, ['active' => false]);
        }

        if ($plan->stripe_product_id) {
            Product::update($plan->stripe_product_id, ['active' => false]);
        }

        $this->repository->delete($plan);
    }
}
