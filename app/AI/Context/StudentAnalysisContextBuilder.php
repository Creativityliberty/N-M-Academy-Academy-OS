<?php

declare(strict_types=1);

namespace App\AI\Context;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\User;

class StudentAnalysisContextBuilder
{
    /** @return array<string, mixed> */
    public function build(User $trainer, ?int $courseId = null): array
    {
        $courses = $trainer->courses()
            ->when($courseId, fn ($query) => $query->whereKey($courseId))
            ->with('modules.lessons:id,module_id')
            ->get();

        return [
            'privacy' => 'Aggregate metrics only. No student names or emails are included.',
            'courses' => $courses->map(fn (Course $course) => $this->courseMetrics($course))->values()->all(),
        ];
    }

    /** @return array<string, mixed> */
    private function courseMetrics(Course $course): array
    {
        $lessonIds = $course->modules->flatMap(fn ($module) => $module->lessons)->pluck('id');
        $lessonCount = $lessonIds->count();
        $enrollments = Enrollment::query()->where('course_id', $course->id)->pluck('user_id');

        $completedByUser = LessonProgress::query()
            ->whereIn('user_id', $enrollments)
            ->whereIn('lesson_id', $lessonIds)
            ->selectRaw('user_id, COUNT(*) as completed_count')
            ->groupBy('user_id')
            ->pluck('completed_count', 'user_id');

        $segments = ['not_started' => 0, 'early' => 0, 'progressing' => 0, 'near_complete' => 0, 'complete' => 0];
        $percentages = [];

        foreach ($enrollments as $userId) {
            $completed = (int) ($completedByUser[$userId] ?? 0);
            $percentage = $lessonCount > 0 ? (int) round(($completed / $lessonCount) * 100) : 0;
            $percentages[] = $percentage;

            if ($percentage === 0) {
                $segments['not_started']++;
            } elseif ($percentage < 25) {
                $segments['early']++;
            } elseif ($percentage < 75) {
                $segments['progressing']++;
            } elseif ($percentage < 100) {
                $segments['near_complete']++;
            } else {
                $segments['complete']++;
            }
        }

        return [
            'course_id' => $course->id,
            'title' => $course->title,
            'enrollments' => $enrollments->count(),
            'lesson_count' => $lessonCount,
            'average_completion_percent' => count($percentages) > 0
                ? (int) round(array_sum($percentages) / count($percentages))
                : 0,
            'segments' => $segments,
        ];
    }
}
