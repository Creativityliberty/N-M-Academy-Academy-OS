<?php

declare(strict_types=1);

use App\Enums\AssignmentSubmissionStatus;
use App\Models\Course;
use App\Models\CourseAssessment;
use App\Models\CourseAssignment;
use App\Models\CourseCertificate;
use App\Models\CourseCompletion;
use App\Models\CourseCompletionPolicy;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\User;
use App\Services\Completion\CourseCompletionService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('completes only accessible lessons and explicitly required learning primitives', function (): void {
    $trainer = User::factory()->create();
    $student = User::factory()->create();
    $course = Course::factory()->for($trainer, 'trainer')->published()->create();
    $basic = $course->modules()->create(['title' => 'Base', 'duration' => 10, 'order' => 1, 'minimum_access_rank' => 0]);
    $premium = $course->modules()->create(['title' => 'Premium', 'duration' => 10, 'order' => 2, 'minimum_access_rank' => 2]);
    $basicLesson = $basic->lessons()->create(['title' => 'L1', 'duration' => 5, 'order' => 1, 'type' => 'text']);
    $premium->lessons()->create(['title' => 'L2', 'duration' => 5, 'order' => 1, 'type' => 'text']);
    Enrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'access_rank' => 0, 'enrolled_at' => now()]);

    $assessment = CourseAssessment::create([
        'course_id' => $course->id,
        'module_id' => $basic->id,
        'title' => 'Quiz',
        'kind' => 'quiz',
        'passing_score_percent' => 70,
        'is_enabled' => true,
        'is_required_for_completion' => true,
    ]);
    $assignment = CourseAssignment::create([
        'course_id' => $course->id,
        'module_id' => $basic->id,
        'title' => 'Projet',
        'instructions' => 'Rendre le projet',
        'kind' => 'project',
        'deliverable_type' => 'text',
        'is_enabled' => true,
        'is_required_for_completion' => true,
    ]);

    LessonProgress::create(['user_id' => $student->id, 'lesson_id' => $basicLesson->id, 'completed_at' => now()]);
    $assessment->attempts()->create([
        'user_id' => $student->id,
        'attempt_number' => 1,
        'score_percent' => 80,
        'passed' => true,
        'completed_at' => now(),
    ]);
    $assignment->submissions()->create([
        'user_id' => $student->id,
        'version' => 1,
        'status' => AssignmentSubmissionStatus::Approved,
        'submitted_at' => now(),
        'reviewed_at' => now(),
    ]);

    $completion = app(CourseCompletionService::class)->evaluate($student, $course);

    expect($completion)->toBeInstanceOf(CourseCompletion::class);
    expect($completion->evidence_snapshot['counts']['requirements_total'])->toBe(3);
    expect($completion->evidence_snapshot['lessons']['required'])->toHaveCount(1);
    expect(CourseCertificate::query()->where('completion_id', $completion->id)->count())->toBe(1);
});

it('refuses completion when no pedagogical criterion is configured', function (): void {
    $student = User::factory()->create();
    $course = Course::factory()->published()->create();
    Enrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'access_rank' => 0, 'enrolled_at' => now()]);
    CourseCompletionPolicy::create([
        'course_id' => $course->id,
        'require_all_accessible_lessons' => false,
        'certificate_enabled' => true,
    ]);

    $completion = app(CourseCompletionService::class)->evaluate($student, $course);
    $status = app(CourseCompletionService::class)->status($student, $course);

    expect($completion)->toBeNull();
    expect($status->completed)->toBeFalse();
    expect($status->lessonsRequired + $status->assessmentsRequired + $status->assignmentsRequired)->toBe(0);
    expect(CourseCertificate::query()->count())->toBe(0);
});

it('does not let an inaccessible lesson scoped primitive block a lower tier student', function (): void {
    $student = User::factory()->create();
    $course = Course::factory()->published()->create();
    $basic = $course->modules()->create(['title' => 'Base', 'duration' => 10, 'order' => 1, 'minimum_access_rank' => 0]);
    $premium = $course->modules()->create(['title' => 'Premium', 'duration' => 10, 'order' => 2, 'minimum_access_rank' => 2]);
    $basicLesson = $basic->lessons()->create(['title' => 'Base lesson', 'duration' => 5, 'order' => 1, 'type' => 'text']);
    $premiumLesson = $premium->lessons()->create(['title' => 'Premium lesson', 'duration' => 5, 'order' => 1, 'type' => 'text']);
    Enrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'access_rank' => 0, 'enrolled_at' => now()]);

    CourseAssessment::create([
        'course_id' => $course->id,
        'module_id' => null,
        'lesson_id' => $premiumLesson->id,
        'title' => 'Premium quiz',
        'kind' => 'quiz',
        'is_enabled' => true,
        'is_required_for_completion' => true,
    ]);
    CourseAssignment::create([
        'course_id' => $course->id,
        'module_id' => null,
        'lesson_id' => $premiumLesson->id,
        'title' => 'Premium project',
        'instructions' => 'Premium only',
        'kind' => 'project',
        'deliverable_type' => 'text',
        'is_enabled' => true,
        'is_required_for_completion' => true,
    ]);
    LessonProgress::create(['user_id' => $student->id, 'lesson_id' => $basicLesson->id, 'completed_at' => now()]);

    $completion = app(CourseCompletionService::class)->evaluate($student, $course);

    expect($completion)->toBeInstanceOf(CourseCompletion::class);
    expect($completion->evidence_snapshot['counts']['requirements_total'])->toBe(1);
    expect($completion->evidence_snapshot['assessments']['required'])->toBe([]);
    expect($completion->evidence_snapshot['assignments']['required'])->toBe([]);
});

it('never completes an unpublished course', function (): void {
    $student = User::factory()->create();
    $course = Course::factory()->create();
    $module = $course->modules()->create(['title' => 'Module', 'duration' => 10, 'order' => 1, 'minimum_access_rank' => 0]);
    $lesson = $module->lessons()->create(['title' => 'Lesson', 'duration' => 5, 'order' => 1, 'type' => 'text']);
    Enrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'access_rank' => 0, 'enrolled_at' => now()]);
    LessonProgress::create(['user_id' => $student->id, 'lesson_id' => $lesson->id, 'completed_at' => now()]);

    expect(app(CourseCompletionService::class)->evaluate($student, $course))->toBeNull();
    expect(CourseCompletion::query()->count())->toBe(0);
    expect(CourseCertificate::query()->count())->toBe(0);
});

it('issues only one immutable completion and certificate across repeated evaluation', function (): void {
    $student = User::factory()->create();
    $course = Course::factory()->published()->create();
    $module = $course->modules()->create(['title' => 'Module', 'duration' => 10, 'order' => 1, 'minimum_access_rank' => 0]);
    $lesson = $module->lessons()->create(['title' => 'Lesson', 'duration' => 5, 'order' => 1, 'type' => 'text']);
    Enrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'access_rank' => 0, 'enrolled_at' => now()]);
    LessonProgress::create(['user_id' => $student->id, 'lesson_id' => $lesson->id, 'completed_at' => now()]);

    $first = app(CourseCompletionService::class)->evaluate($student, $course);
    $second = app(CourseCompletionService::class)->evaluate($student, $course);

    expect($first?->id)->toBe($second?->id);
    expect(CourseCompletion::query()->count())->toBe(1);
    expect(CourseCertificate::query()->count())->toBe(1);
});

it('can record course completion without issuing a certificate when certificates are disabled', function (): void {
    $student = User::factory()->create();
    $course = Course::factory()->published()->create();
    $module = $course->modules()->create(['title' => 'Module', 'duration' => 10, 'order' => 1, 'minimum_access_rank' => 0]);
    $lesson = $module->lessons()->create(['title' => 'Lesson', 'duration' => 5, 'order' => 1, 'type' => 'text']);
    Enrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'access_rank' => 0, 'enrolled_at' => now()]);
    CourseCompletionPolicy::create([
        'course_id' => $course->id,
        'require_all_accessible_lessons' => true,
        'certificate_enabled' => false,
    ]);
    LessonProgress::create(['user_id' => $student->id, 'lesson_id' => $lesson->id, 'completed_at' => now()]);

    $completion = app(CourseCompletionService::class)->evaluate($student, $course);

    expect($completion)->toBeInstanceOf(CourseCompletion::class);
    expect(CourseCertificate::query()->count())->toBe(0);
});
