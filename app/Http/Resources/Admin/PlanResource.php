<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'stripe_product_id' => $this->stripe_product_id,
            'stripe_price_id' => $this->stripe_price_id,
            'price' => $this->price,
            'formatted_price' => $this->formattedPrice(),
            'currency' => $this->currency->value,
            'currency_label' => $this->currency->label(),
            'interval' => $this->interval->value,
            'interval_label' => $this->interval->label(),
            'features' => $this->features,
            'highlight' => $this->highlight,
            'is_active' => $this->is_active,
            'order' => $this->order,
        ];
    }
}
