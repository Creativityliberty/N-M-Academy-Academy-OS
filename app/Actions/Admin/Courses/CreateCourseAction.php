<?php

declare(strict_types=1);

namespace App\Actions\Admin\Courses;

use App\Models\Course;
use App\Repositories\Admin\Courses\CourseRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CreateCourseAction
{
    public function __construct(
        private readonly CourseRepository $repository,
        private readonly UploadCourseImageAction $uploadImage,
        private readonly CreateLessonAction $createLesson,
    ) {}

    public function handle(array $data): Course
    {
        return DB::transaction(function () use ($data) {
            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
                $data['image'] = $this->uploadImage->handle($data['image']);
            }

            $modules = $data['modules'] ?? [];
            unset($data['modules']);

            $course = $this->repository->create($data);

            foreach ($modules as $moduleData) {
                $lessons = $moduleData['lessons'] ?? [];
                unset($moduleData['lessons']);

                $module = $course->modules()->create($moduleData);

                foreach ($lessons as $lessonData) {
                    $this->createLesson->handle($module, $lessonData);
                }
            }

            return $course->fresh(['category', 'trainer']);
        });
    }
}
