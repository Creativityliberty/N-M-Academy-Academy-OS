<?php

declare(strict_types=1);

namespace App\Actions\Trainer\Courses;

use App\Jobs\IndexCourseKnowledge;

use App\Models\Course;
use App\Models\User;
use App\Repositories\Trainer\Courses\CourseRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class CreateCourseAction
{
    public function __construct(
        private readonly CourseRepository $repository,
        private readonly UploadCourseImageAction $uploadImage,
        private readonly CreateLessonAction $createLesson,
    ) {}

    public function handle(User $trainer, array $data): Course
    {
        return DB::transaction(function () use ($trainer, $data) {
            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
                $data['image'] = $this->uploadImage->handle($data['image']);
            }

            $data['trainer_id'] = $trainer->id;

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

            IndexCourseKnowledge::dispatch($course->id)->afterCommit();

            return $course->fresh(['category']);
        });
    }
}
