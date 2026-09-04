<?php

declare(strict_types=1);

namespace App\Actions\Courses;

use App\Enums\CourseStatus;
use App\Models\Course;
use Illuminate\Support\Facades\DB;
use Stripe\Price;
use Stripe\Product;
use Stripe\Stripe;
use Throwable;

class ArchiveCourseAction
{
    public function handle(Course $course): Course
    {
        $stripeProductId = $course->stripe_product_id;
        $stripePriceId = $course->stripe_price_id;

        DB::transaction(function () use ($course): void {
            $course->offers()->where('is_active', true)->update(['is_active' => false]);
            $course->update([
                'status' => CourseStatus::Archived->value,
                'published_at' => null,
                'featured' => false,
            ]);
        });

        if ($stripeProductId) {
            try {
                Stripe::setApiKey(config('cashier.secret'));

                if ($stripePriceId) {
                    Price::update($stripePriceId, ['active' => false]);
                }

                Product::update($stripeProductId, ['active' => false]);
            } catch (Throwable $error) {
                report($error);
            }
        }

        return $course->fresh(['offers']);
    }
}
