<?php

declare(strict_types=1);

namespace App\AI\Context;

use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\User;

class AcademyContextBuilder
{
    /** @return array<string, mixed> */
    public function build(User $trainer): array
    {
        $courses = $trainer->courses()
            ->withCount(['enrollments', 'modules'])
            ->with('modules.lessons:id,module_id')
            ->orderBy('title')
            ->get();

        $courseIds = $courses->pluck('id');
        $enrollments = Enrollment::query()->whereIn('course_id', $courseIds)->get();
        $recordedSales = $enrollments->whereNotNull('amount_paid');

        $revenue = $recordedSales
            ->groupBy(fn (Enrollment $sale) => strtoupper($sale->currency ?: 'N/A'))
            ->map(fn ($group) => round((float) $group->sum(fn (Enrollment $sale) => (float) $sale->amount_paid), 2))
            ->all();

        return [
            'academy' => [
                'courses' => $courses->map(fn ($course) => [
                    'id' => $course->id,
                    'title' => $course->title,
                    'status' => $course->status->value,
                    'price' => (float) $course->price,
                    'enrollments' => $course->enrollments_count,
                    'modules' => $course->modules_count,
                    'lessons' => $course->modules->sum(fn ($module) => $module->lessons->count()),
                ])->values()->all(),
                'unique_students' => $enrollments->pluck('user_id')->unique()->count(),
                'total_enrollments' => $enrollments->count(),
                'recorded_revenue_by_currency' => $revenue,
                'completed_lessons' => LessonProgress::query()
                    ->whereHas('lesson.module.course', fn ($query) => $query->where('trainer_id', $trainer->id))
                    ->count(),
            ],
        ];
    }
}
