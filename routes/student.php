<?php

use App\Http\Controllers\Student\MembershipController;

use App\Http\Controllers\Student\Courses\CourseController;
use App\Http\Controllers\Student\Courses\LessonNoteController;
use App\Http\Controllers\Student\Courses\LessonProgressController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\TutorController;
use App\Http\Controllers\Student\AssessmentController;
use App\Http\Controllers\Student\AssignmentController;
use App\Http\Controllers\Student\CertificateController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:student'])->prefix('student')->name('student.')->group(function () {
    Route::get('dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
    Route::get('courses', [CourseController::class, 'index'])->name('courses.index');
    Route::get('certificates', [CertificateController::class, 'index'])->middleware('feature:certificates')->name('certificates.index');
    Route::get('certificates/{certificate}/pdf', [CertificateController::class, 'pdf'])->middleware('feature:certificates')->name('certificates.pdf');
    Route::get('courses/{courseId}', [CourseController::class, 'show'])->name('courses.show');
    Route::post('lessons/{lesson}/progress', [LessonProgressController::class, 'store'])->name('lessons.progress.store');
    Route::delete('lessons/{lesson}/progress', [LessonProgressController::class, 'destroy'])->name('lessons.progress.destroy');
    Route::post('lessons/{lesson}/notes', [LessonNoteController::class, 'store'])->name('lessons.notes.store');
    Route::delete('lessons/{lesson}/notes', [LessonNoteController::class, 'destroy'])->name('lessons.notes.destroy');
    Route::get('courses/{course}/assessments/{assessment}', [AssessmentController::class, 'show'])->middleware('feature:assessments')->name('assessments.show');
    Route::post('courses/{course}/assessments/{assessment}', [AssessmentController::class, 'submit'])->middleware('feature:assessments')->name('assessments.submit');

    Route::get('courses/{course}/assignments/{assignment}', [AssignmentController::class, 'show'])->middleware('feature:assignments')->name('assignments.show');
    Route::post('courses/{course}/assignments/{assignment}', [AssignmentController::class, 'submit'])->middleware('feature:assignments')->name('assignments.submit');
    Route::get('courses/{course}/assignments/{assignment}/files/{file}', [AssignmentController::class, 'download'])->middleware('feature:assignments')->name('assignments.files.download');
    Route::post('courses/{course}/tutor', [TutorController::class, 'run'])->middleware('feature:tutor')->name('tutor.run');
    Route::get('memberships', [MembershipController::class, 'index'])->middleware('feature:sales')->name('memberships.index');
    Route::post('memberships/{membership}/portal', [MembershipController::class, 'portal'])->middleware('feature:sales')->name('memberships.portal');
    Route::post('tutor/quizzes/{session}/submit', [TutorController::class, 'submitQuiz'])->middleware('feature:tutor')->name('tutor.quizzes.submit');
});

