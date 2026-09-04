<?php

declare(strict_types=1);

namespace App\Actions\Admin\Courses;

use App\Actions\Courses\ArchiveCourseAction;
use App\Models\Course;

class DeleteCourseAction
{
    public function __construct(
        private readonly ArchiveCourseAction $archiveCourse,
    ) {}

    public function handle(Course $course): void
    {
        $this->archiveCourse->handle($course);
    }
}
