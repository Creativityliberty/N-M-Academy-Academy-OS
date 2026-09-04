<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalCourses' => Course::count(),
                'totalTrainers' => User::trainers()->count(),
                'totalStudents' => User::students()->count(),
                'totalEnrollments' => Enrollment::count(),
            ],
        ]);
    }
}
