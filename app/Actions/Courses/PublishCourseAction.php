<?php

declare(strict_types=1);

namespace App\Actions\Courses;

use App\Enums\CourseStatus;
use App\Models\Course;
use RuntimeException;

class PublishCourseAction
{
    public function __construct(
        private readonly ProvisionCourseStripeCatalogAction $provisionStripeCatalog,
    ) {}

    public function handle(Course $course): Course
    {
        if ($course->status === CourseStatus::Archived) {
            throw new RuntimeException('An archived course must be restored before publication.');
        }

        $trainer = $course->trainer()->first();
        if (! $trainer || ! $trainer->stripe_onboarding_completed) {
            throw new RuntimeException('Stripe Connect onboarding must be completed before publication.');
        }

        if (! $course->stripe_product_id || ! $course->stripe_price_id) {
            $course = $this->provisionStripeCatalog->handle($course);
        }

        $course->update([
            'status' => CourseStatus::Published->value,
            'published_at' => $course->published_at ?? now(),
        ]);

        return $course->fresh(['trainer', 'offers']);
    }
}
