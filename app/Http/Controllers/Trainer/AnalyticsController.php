<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Models\LessonProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $courses = $request->user()->courses()
            ->with(['modules.lessons:id,module_id', 'enrollments:id,user_id,course_id'])
            ->orderByDesc('created_at')
            ->get();

        $courseAnalytics = $courses->map(function ($course) {
            $lessonIds = $course->modules->flatMap->lessons->pluck('id');
            $studentIds = $course->enrollments->pluck('user_id')->unique();
            $lessonCount = $lessonIds->count();
            $studentCount = $studentIds->count();
            $possibleCompletions = $lessonCount * $studentCount;

            $completed = $possibleCompletions > 0
                ? LessonProgress::query()->whereIn('user_id', $studentIds)->whereIn('lesson_id', $lessonIds)->count()
                : 0;

            return [
                'id' => $course->id,
                'title' => $course->title,
                'status' => $course->status->value,
                'students' => $studentCount,
                'lessons' => $lessonCount,
                'completedLessons' => $completed,
                'completionRate' => $possibleCompletions > 0
                    ? (int) round(($completed / $possibleCompletions) * 100)
                    : 0,
            ];
        });

        $totalStudents = $courses->flatMap(fn ($course) => $course->enrollments->pluck('user_id'))->unique()->count();
        $weightedPossible = $courseAnalytics->sum(fn ($course) => $course['students'] * $course['lessons']);
        $weightedCompleted = $courseAnalytics->sum('completedLessons');

        return Inertia::render('trainer/analytics/index', [
            'stats' => [
                'courses' => $courses->count(),
                'students' => $totalStudents,
                'averageCompletion' => $weightedPossible > 0
                    ? (int) round(($weightedCompleted / $weightedPossible) * 100)
                    : 0,
            ],
            'courses' => $courseAnalytics,
        ]);
    }
}
