<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentsController extends Controller
{
    public function index(Request $request): Response
    {
        $courseIds = $request->user()->courses()->pluck('id');

        $enrollments = Enrollment::query()
            ->whereIn('course_id', $courseIds)
            ->with(['user:id,name,email', 'course:id,title'])
            ->latest('enrolled_at')
            ->get();

        $students = $enrollments
            ->groupBy('user_id')
            ->map(function ($items) {
                $latest = $items->first();

                return [
                    'id' => $latest->user->id,
                    'name' => $latest->user->name,
                    'email' => $latest->user->email,
                    'courseCount' => $items->pluck('course_id')->unique()->count(),
                    'courses' => $items->pluck('course.title')->unique()->values()->all(),
                    'lastEnrolledAt' => $latest->enrolled_at?->toIso8601String(),
                ];
            })
            ->values();

        return Inertia::render('trainer/students/index', [
            'students' => $students,
            'stats' => [
                'uniqueStudents' => $students->count(),
                'totalEnrollments' => $enrollments->count(),
                'activeCourses' => $enrollments->pluck('course_id')->unique()->count(),
            ],
        ]);
    }
}
