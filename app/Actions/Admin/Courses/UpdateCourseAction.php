<?php

declare(strict_types=1);

namespace App\Actions\Admin\Courses;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use App\Repositories\Admin\Courses\CourseRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class UpdateCourseAction
{
    public function __construct(
        private readonly CourseRepository $repository,
        private readonly UploadCourseImageAction $uploadImage,
        private readonly UploadLessonMediaAction $uploadMedia,
        private readonly CreateLessonAction $createLesson,
    ) {}

    public function handle(Course $course, array $data): Course
    {
        return DB::transaction(function () use ($course, $data) {
            if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
                $data['image'] = $this->uploadImage->handle($data['image'], $course->image ?? null);
            } else {
                unset($data['image']);
            }

            $modulesData = $data['modules'] ?? [];
            unset($data['modules']);

            $updated = $this->repository->update($course, $data);

            $this->syncModules($updated, $modulesData);

            return $updated->fresh(['category', 'trainer']);
        });
    }

    /** @param array<int, array<string, mixed>> $modulesData */
    private function syncModules(Course $course, array $modulesData): void
    {
        $existingIds = $course->modules()->pluck('id')->toArray();
        $submittedIds = collect($modulesData)->pluck('id')->filter()->map(fn ($id) => (int) $id)->toArray();
        $idsToDelete = array_diff($existingIds, $submittedIds);

        if (! empty($idsToDelete)) {
            $course->modules()->whereIn('id', $idsToDelete)->get()->each(function (Module $module) {
                $module->lessons->each->delete();
                $module->delete();
            });
        }

        foreach ($modulesData as $moduleData) {
            $moduleId = isset($moduleData['id']) ? (int) $moduleData['id'] : null;
            $lessons = $moduleData['lessons'] ?? [];
            unset($moduleData['id'], $moduleData['lessons']);

            if ($moduleId && in_array($moduleId, $existingIds, true)) {
                /** @var Module $module */
                $module = $course->modules()->find($moduleId);
                $module->update($moduleData);
            } else {
                $module = $course->modules()->create($moduleData);
            }

            $this->syncLessons($module, $lessons);
        }
    }

    /** @param array<int, array<string, mixed>> $lessonsData */
    private function syncLessons(Module $module, array $lessonsData): void
    {
        $existingIds = $module->lessons()->pluck('id')->toArray();
        $submittedIds = collect($lessonsData)->pluck('id')->filter()->map(fn ($id) => (int) $id)->toArray();
        $idsToDelete = array_diff($existingIds, $submittedIds);

        if (! empty($idsToDelete)) {
            $module->lessons()->whereIn('id', $idsToDelete)->get()->each->delete();
        }

        foreach ($lessonsData as $lessonData) {
            $lessonId = isset($lessonData['id']) ? (int) $lessonData['id'] : null;
            $audioFile = $lessonData['audio_file'] ?? null;
            $pdfFile = $lessonData['pdf_file'] ?? null;
            unset($lessonData['id'], $lessonData['audio_file'], $lessonData['pdf_file']);

            if ($lessonId && in_array($lessonId, $existingIds, true)) {
                /** @var Lesson $lesson */
                $lesson = $module->lessons()->find($lessonId);

                if ($audioFile instanceof UploadedFile) {
                    $lessonData['audio_url'] = $this->uploadMedia->handleAudio($audioFile, $lesson->audio_url);
                }

                if ($pdfFile instanceof UploadedFile) {
                    $lessonData['pdf_url'] = $this->uploadMedia->handlePdf($pdfFile, $lesson->pdf_url);
                }

                $this->removeUnusedMedia($lesson, $lessonData);
                $lesson->update($lessonData);
            } else {
                if ($audioFile instanceof UploadedFile) {
                    $lessonData['audio_file'] = $audioFile;
                }

                if ($pdfFile instanceof UploadedFile) {
                    $lessonData['pdf_file'] = $pdfFile;
                }

                $this->createLesson->handle($module, $lessonData);
            }
        }
    }

    /** @param array<string, mixed> $lessonData */
    private function removeUnusedMedia(Lesson $lesson, array &$lessonData): void
    {
        $type = (string) ($lessonData['type'] ?? $lesson->type?->value ?? 'video_url');

        if ($type !== 'audio') {
            $this->uploadMedia->remove($lesson->audio_url);
            $lessonData['audio_url'] = null;
        }

        if ($type !== 'pdf') {
            $this->uploadMedia->remove($lesson->pdf_url);
            $lessonData['pdf_url'] = null;
        }

        if ($type !== 'video_url') {
            $lessonData['video_url'] = null;
        }
    }
}
