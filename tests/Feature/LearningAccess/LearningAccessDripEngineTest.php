<?php

declare(strict_types=1);

use App\Enums\AssignmentSubmissionStatus;
use App\Enums\UnlockRuleType;
use App\Enums\UnlockTargetType;
use App\Models\Course;
use App\Models\CourseAssessment;
use App\Models\CourseAssignment;
use App\Models\CourseCompletion;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\User;
use App\Services\Completion\CourseCompletionService;
use App\Services\LearningAccess\LearningAccessService;
use App\Services\LearningAccess\UnlockRuleDefinitionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Carbon;

uses(RefreshDatabase::class);

afterEach(function (): void {
    Carbon::setTestNow();
    config()->set('academy.features.drip', true);
});

function learningAccessFixture(): array
{
    $student = User::factory()->create();
    $course = Course::factory()->published()->create();
    $module = $course->modules()->create([
        'title' => 'Module 1',
        'duration' => 10,
        'order' => 1,
        'minimum_access_rank' => 0,
    ]);
    $lesson = $module->lessons()->create([
        'title' => 'Leçon 1',
        'duration' => 5,
        'order' => 1,
        'type' => 'text',
    ]);
    $enrollment = Enrollment::create([
        'user_id' => $student->id,
        'course_id' => $course->id,
        'access_rank' => 0,
        'enrolled_at' => now(),
    ]);

    return [$student, $course, $module, $lesson, $enrollment];
}

it('unlocks a lesson after its enrollment delay without changing tier entitlement', function (): void {
    Carbon::setTestNow('2026-09-03 10:00:00');
    [$student, $course, $module, $lesson] = learningAccessFixture();

    app(UnlockRuleDefinitionService::class)->create($course, [
        'target_type' => UnlockTargetType::Lesson->value,
        'target_id' => $lesson->id,
        'rule_type' => UnlockRuleType::EnrollmentDelayDays->value,
        'delay_days' => 7,
    ]);

    $access = app(LearningAccessService::class);
    $decision = $access->decisionForLesson($student, $lesson);

    expect($access->isEntitledLesson($student, $lesson))->toBeTrue()
        ->and($decision->allowed)->toBeFalse()
        ->and($decision->unlockAt)->not->toBeNull();

    Carbon::setTestNow('2026-09-10 10:00:00');

    expect($access->canAccessLesson($student, $lesson))->toBeTrue();
});

it('requires every enabled rule on a target', function (): void {
    Carbon::setTestNow('2026-09-03 10:00:00');
    [$student, $course, $module, $lesson1] = learningAccessFixture();
    $lesson2 = $module->lessons()->create([
        'title' => 'Leçon 2',
        'duration' => 5,
        'order' => 2,
        'type' => 'text',
    ]);

    $definitions = app(UnlockRuleDefinitionService::class);
    $definitions->create($course, [
        'target_type' => 'lesson',
        'target_id' => $lesson2->id,
        'rule_type' => 'lesson_completed',
        'source_id' => $lesson1->id,
    ]);
    $definitions->create($course, [
        'target_type' => 'lesson',
        'target_id' => $lesson2->id,
        'rule_type' => 'fixed_datetime',
        'available_at' => '2026-09-05T10:00:00+00:00',
    ]);

    $access = app(LearningAccessService::class);
    expect($access->canAccessLesson($student, $lesson2))->toBeFalse();

    LessonProgress::create([
        'user_id' => $student->id,
        'lesson_id' => $lesson1->id,
        'completed_at' => now(),
    ]);
    expect($access->canAccessLesson($student, $lesson2))->toBeFalse();

    Carbon::setTestNow('2026-09-05 10:00:00');
    expect($access->canAccessLesson($student, $lesson2))->toBeTrue();
});

it('can gate a later lesson on both assessment success and assignment approval', function (): void {
    [$student, $course, $module, $lesson1] = learningAccessFixture();
    $lesson2 = $module->lessons()->create([
        'title' => 'Leçon finale',
        'duration' => 5,
        'order' => 2,
        'type' => 'text',
    ]);
    $assessment = CourseAssessment::create([
        'course_id' => $course->id,
        'lesson_id' => $lesson1->id,
        'title' => 'Quiz 1',
        'kind' => 'quiz',
        'passing_score_percent' => 70,
        'is_enabled' => true,
        'position' => 1,
    ]);
    $assignment = CourseAssignment::create([
        'course_id' => $course->id,
        'lesson_id' => $lesson1->id,
        'title' => 'Projet 1',
        'instructions' => 'Livrer le projet',
        'kind' => 'project',
        'deliverable_type' => 'text',
        'is_enabled' => true,
        'position' => 1,
    ]);

    $definitions = app(UnlockRuleDefinitionService::class);
    foreach ([
        ['rule_type' => 'assessment_passed', 'source_id' => $assessment->id],
        ['rule_type' => 'assignment_approved', 'source_id' => $assignment->id],
    ] as $rule) {
        $definitions->create($course, [
            'target_type' => 'lesson',
            'target_id' => $lesson2->id,
            ...$rule,
        ]);
    }

    $access = app(LearningAccessService::class);
    expect($access->canAccessLesson($student, $lesson2))->toBeFalse();

    $assessment->attempts()->create([
        'user_id' => $student->id,
        'attempt_number' => 1,
        'score_percent' => 100,
        'passed' => true,
        'completed_at' => now(),
    ]);
    expect($access->canAccessLesson($student, $lesson2))->toBeFalse();

    $assignment->submissions()->create([
        'user_id' => $student->id,
        'version' => 1,
        'status' => AssignmentSubmissionStatus::Approved,
        'submitted_at' => now(),
        'reviewed_at' => now(),
    ]);
    expect($access->canAccessLesson($student, $lesson2))->toBeTrue();
});

it('keeps tier restrictions when drip is disabled', function (): void {
    [$student, $course] = learningAccessFixture();
    $premium = $course->modules()->create([
        'title' => 'Premium',
        'duration' => 10,
        'order' => 2,
        'minimum_access_rank' => 10,
    ]);
    $premiumLesson = $premium->lessons()->create([
        'title' => 'Premium lesson',
        'duration' => 5,
        'order' => 1,
        'type' => 'text',
    ]);

    config()->set('academy.features.drip', false);

    expect(app(LearningAccessService::class)->canAccessLesson($student, $premiumLesson))->toBeFalse();
});

it('prevents completion and certificate issuance while entitled course content is still drip locked', function (): void {
    Carbon::setTestNow('2026-09-03 10:00:00');
    [$student, $course, $module, $lesson1] = learningAccessFixture();
    $lesson2 = $module->lessons()->create([
        'title' => 'Leçon future',
        'duration' => 5,
        'order' => 2,
        'type' => 'text',
    ]);
    app(UnlockRuleDefinitionService::class)->create($course, [
        'target_type' => 'lesson',
        'target_id' => $lesson2->id,
        'rule_type' => 'enrollment_delay_days',
        'delay_days' => 7,
    ]);
    LessonProgress::create([
        'user_id' => $student->id,
        'lesson_id' => $lesson1->id,
        'completed_at' => now(),
    ]);

    expect(app(CourseCompletionService::class)->evaluate($student, $course))->toBeNull()
        ->and(CourseCompletion::query()->count())->toBe(0);

    Carbon::setTestNow('2026-09-10 10:00:00');
    LessonProgress::create([
        'user_id' => $student->id,
        'lesson_id' => $lesson2->id,
        'completed_at' => now(),
    ]);

    expect(app(CourseCompletionService::class)->evaluate($student, $course))->not->toBeNull();
});

it('rejects forward prerequisite dependencies and auto increments rule positions', function (): void {
    [$student, $course, $module, $lesson1] = learningAccessFixture();
    $lesson2 = $module->lessons()->create([
        'title' => 'Leçon 2',
        'duration' => 5,
        'order' => 2,
        'type' => 'text',
    ]);
    $definitions = app(UnlockRuleDefinitionService::class);

    expect(fn () => $definitions->create($course, [
        'target_type' => 'lesson',
        'target_id' => $lesson1->id,
        'rule_type' => 'lesson_completed',
        'source_id' => $lesson2->id,
    ]))->toThrow(ValidationException::class);

    $first = $definitions->create($course, [
        'target_type' => 'lesson',
        'target_id' => $lesson2->id,
        'rule_type' => 'lesson_completed',
        'source_id' => $lesson1->id,
    ]);
    $second = $definitions->create($course, [
        'target_type' => 'lesson',
        'target_id' => $lesson2->id,
        'rule_type' => 'enrollment_delay_days',
        'delay_days' => 1,
    ]);

    expect($first->position)->toBe(1)
        ->and($second->position)->toBe(2);
});
