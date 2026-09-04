<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $student = $request->user();

        $enrollments = Enrollment::with([
            'course' => fn ($query) => $query->with(['trainer', 'modules.lessons']),
        ])
            ->where('user_id', $student->id)
            ->latest('enrolled_at')
            ->get();

        $lessonIds = $enrollments
            ->flatMap(fn (Enrollment $enrollment) => $enrollment->course->modules->flatMap->lessons)
            ->pluck('id')
            ->values();

        $completedLessonIds = LessonProgress::where('user_id', $student->id)
            ->whereIn('lesson_id', $lessonIds)
            ->pluck('lesson_id');

        $completedLookup = $completedLessonIds->flip();
        $totalLessons = $lessonIds->count();
        $completedLessons = $completedLessonIds->count();

        $continueLearning = null;

        foreach ($enrollments as $enrollment) {
            $courseLessons = $enrollment->course->modules->flatMap->lessons;
            $nextLesson = $courseLessons->first(fn ($lesson) => ! $completedLookup->has($lesson->id));

            if ($nextLesson) {
                $courseTotal = $courseLessons->count();
                $courseCompleted = $courseLessons->filter(fn ($lesson) => $completedLookup->has($lesson->id))->count();

                $continueLearning = [
                    'courseId' => $enrollment->course->id,
                    'courseTitle' => $enrollment->course->title,
                    'courseImage' => $enrollment->course->image,
                    'trainer' => $enrollment->course->trainer->name,
                    'lessonId' => $nextLesson->id,
                    'lessonTitle' => $nextLesson->title,
                    'progressPercentage' => $courseTotal > 0
                        ? (int) round($courseCompleted / $courseTotal * 100)
                        : 0,
                ];

                break;
            }
        }

        return Inertia::render('student/dashboard', [
            'stats' => [
                'enrolledCourses' => $enrollments->count(),
                'completedLessons' => $completedLessons,
                'totalLessons' => $totalLessons,
                'progressPercentage' => $totalLessons > 0
                    ? (int) round($completedLessons / $totalLessons * 100)
                    : 0,
            ],
            'continueLearning' => $continueLearning,
        ]);
    }
}
