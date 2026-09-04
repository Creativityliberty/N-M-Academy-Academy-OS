<?php

use App\Http\Controllers\Admin\Courses\CourseController as AdminCourseController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\Plans\PlanController as AdminPlanController;
use App\Http\Controllers\Admin\AcademyFactoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('courses', AdminCourseController::class)->except(['show']);
    Route::patch('courses/{course}/status', [AdminCourseController::class, 'toggleStatus'])->name('courses.toggle-status');
    Route::resource('plans', AdminPlanController::class)->except(['show']);
    Route::get('factory', [AcademyFactoryController::class, 'index'])->name('factory.index');
    Route::post('factory', [AcademyFactoryController::class, 'store'])->name('factory.store');
    Route::post('factory/{deployment}/provision', [AcademyFactoryController::class, 'provision'])->name('factory.provision');
    Route::post('factory/{deployment}/verify', [AcademyFactoryController::class, 'verify'])->name('factory.verify');
});
