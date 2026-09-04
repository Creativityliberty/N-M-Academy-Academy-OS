<?php

declare(strict_types=1);

namespace App\Actions\Courses;

use App\Models\Course;
use Stripe\Price;
use Stripe\Product;
use Stripe\Stripe;

class ProvisionCourseStripeCatalogAction
{
    public function handle(Course $course): Course
    {
        if ($course->stripe_product_id && $course->stripe_price_id) {
            return $course;
        }

        Stripe::setApiKey(config('cashier.secret'));

        $product = Product::create([
            'name' => $course->title,
            'metadata' => ['type' => 'course', 'trainer_id' => $course->trainer_id],
        ]);

        $price = Price::create([
            'product' => $product->id,
            'unit_amount' => (int) round((float) $course->price * 100),
            'currency' => 'eur',
        ]);

        $course->update([
            'stripe_product_id' => $product->id,
            'stripe_price_id' => $price->id,
        ]);

        return $course->fresh();
    }
}
