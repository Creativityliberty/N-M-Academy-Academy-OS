<?php

namespace App\Models;

use App\Enums\PlanCurrencyEnum;
use App\Enums\PlanIntervalEnum;
use Database\Factories\PlanFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Plan extends Model implements Sortable
{
    /** @use HasFactory<PlanFactory> */
    use HasFactory, HasSlug, SortableTrait;

    protected $fillable = [
        'name',
        'slug',
        'stripe_product_id',
        'stripe_price_id',
        'price',
        'platform_fee_bps',
        'currency',
        'interval',
        'features',
        'highlight',
        'is_active',
        'order',
    ];

    protected $attributes = [
        'features' => '[]',
    ];

    public array $sortable = [
        'sort_when_creating' => true,
        'order_column_name' => 'order',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'highlight' => 'boolean',
            'is_active' => 'boolean',
            'price' => 'integer',
            'platform_fee_bps' => 'integer',
            'currency' => PlanCurrencyEnum::class,
            'interval' => PlanIntervalEnum::class,
        ];
    }

    public function formattedPrice(): string
    {
        return number_format($this->price / 100, 0, ',', ' ').' '.$this->currency->symbol();
    }
}
