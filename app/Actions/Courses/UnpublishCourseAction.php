<?php

declare(strict_types=1);

namespace App\Actions\Courses;

use App\Enums\CourseStatus;
use App\Models\Course;

class UnpublishCourseAction
{
    public function handle(Course $course): Course
    {
        $course->update([
            'status' => CourseStatus::Draft->value,
            'published_at' => null,
        ]);

        return $course->fresh(['trainer', 'offers']);
    }
}
