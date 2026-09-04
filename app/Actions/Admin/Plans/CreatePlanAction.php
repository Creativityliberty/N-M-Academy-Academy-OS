<?php

declare(strict_types=1);

namespace App\Actions\Admin\Plans;

use App\Models\Plan;
use App\Repositories\Admin\Plans\PlanRepository;
use Stripe\Price;
use Stripe\Product;
use Stripe\Stripe;

class CreatePlanAction
{
    public function __construct(
        private readonly PlanRepository $repository,
    ) {}

    public function handle(array $data): Plan
    {
        Stripe::setApiKey(config('cashier.secret'));

        $product = Product::create([
            'name' => $data['name'],
            'metadata' => ['type' => 'trainer_plan'],
        ]);

        $priceInCents = (int) round($data['price'] * 100);

        $price = Price::create([
            'product' => $product->id,
            'unit_amount' => $priceInCents,
            'currency' => $data['currency'],
            'recurring' => ['interval' => $data['interval']],
        ]);

        return $this->repository->create([
            ...$data,
            'price' => $priceInCents,
            'stripe_product_id' => $product->id,
            'stripe_price_id' => $price->id,
        ]);
    }
}
