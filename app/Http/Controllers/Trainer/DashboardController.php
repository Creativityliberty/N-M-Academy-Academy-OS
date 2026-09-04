<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $trainer = $request->user();
        $courseIds = $trainer->courses()->pluck('id');

        $enrollments = Enrollment::query()
            ->whereIn('course_id', $courseIds)
            ->with(['user:id,name,email', 'course:id,title'])
            ->latest('enrolled_at')
            ->get();

        $recordedSales = $enrollments->whereNotNull('amount_paid');
        $revenueByCurrency = $recordedSales
            ->groupBy(fn (Enrollment $sale) => $sale->currency ?: 'N/A')
            ->map(fn ($group, $currency) => [
                'currency' => $currency,
                'amount' => round((float) $group->sum(fn (Enrollment $sale) => (float) $sale->amount_paid), 2),
            ])
            ->values();

        $topCourses = $trainer->courses()
            ->withCount('enrollments')
            ->orderByDesc('enrollments_count')
            ->limit(4)
            ->get(['id', 'title', 'status'])
            ->map(fn ($course) => [
                'id' => $course->id,
                'title' => $course->title,
                'status' => $course->status->value,
                'students' => $course->enrollments_count,
            ]);

        return Inertia::render('trainer/dashboard', [
            'stats' => [
                'totalCourses' => $courseIds->count(),
                'totalStudents' => $enrollments->pluck('user_id')->unique()->count(),
                'publishedCourses' => $trainer->courses()->where('status', 'published')->count(),
                'totalEnrollments' => $enrollments->count(),
            ],
            'revenueByCurrency' => $revenueByCurrency,
            'recentEnrollments' => $enrollments->take(5)->map(fn (Enrollment $enrollment) => [
                'id' => $enrollment->id,
                'student' => $enrollment->user?->name,
                'course' => $enrollment->course?->title,
                'enrolledAt' => $enrollment->enrolled_at?->toIso8601String(),
            ])->values(),
            'topCourses' => $topCourses,
            'stripeReady' => (bool) $trainer->stripe_onboarding_completed,
        ]);
    }
}
