<?php

use App\Enums\AssessmentKind;
use App\Enums\AssessmentQuestionType;
use App\Enums\RoleEnum;
use App\Models\Course;
use App\Models\CourseAssessment;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use App\Services\Assessments\AssessmentDefinitionValidator;
use App\Services\Assessments\AssessmentScoringService;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Validation\ValidationException;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

function assessmentStudent(): User
{
    $student = User::factory()->create(['email_verified_at' => now()]);
    $student->assignRole(RoleEnum::Student->value);
    return $student;
}

function assessmentFixture(int $minimumRank = 0): array
{
    $course = Course::factory()->published()->create();
    $module = Module::factory()->create(['course_id' => $course->id, 'minimum_access_rank' => $minimumRank]);
    $lesson = Lesson::factory()->create(['module_id' => $module->id]);
    $assessment = CourseAssessment::create([
        'course_id' => $course->id,
        'module_id' => $module->id,
        'lesson_id' => $lesson->id,
        'title' => 'Quiz M14.1',
        'kind' => AssessmentKind::Quiz->value,
        'passing_score_percent' => 70,
        'max_attempts' => 2,
        'show_explanations' => true,
    ]);
    return [$course, $module, $lesson, $assessment];
}

test('assessment definition validator enforces supported auto gradable question shapes', function () {
    $validator = app(AssessmentDefinitionValidator::class);

    expect(fn () => $validator->validateQuestion([
        'type' => AssessmentQuestionType::SingleChoice->value,
        'prompt' => 'Une réponse ?',
        'options' => [
            ['text' => 'A', 'is_correct' => true],
            ['text' => 'B', 'is_correct' => true],
        ],
    ]))->toThrow(ValidationException::class);

    $question = $validator->validateQuestion([
        'type' => AssessmentQuestionType::MultipleChoice->value,
        'prompt' => 'Deux réponses ?',
        'points' => 2,
        'explanation' => 'A et C sont corrects.',
        'options' => [
            ['text' => 'A', 'is_correct' => true],
            ['text' => 'B', 'is_correct' => false],
            ['text' => 'C', 'is_correct' => true],
        ],
    ]);

    expect($question['type'])->toBe('multiple_choice')
        ->and($question['points'])->toBe(2)
        ->and($question['options'])->toHaveCount(3);
});

test('assessment scoring uses exact option sets and persists a passing attempt', function () {
    [$course, $module, $lesson, $assessment] = assessmentFixture();
    $student = assessmentStudent();
    Enrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'access_rank' => 0, 'enrolled_at' => now()]);

    $q1 = $assessment->questions()->create(['type' => 'single_choice', 'prompt' => 'Q1', 'explanation' => 'Parce que A.', 'points' => 1, 'position' => 1]);
    $q1a = $q1->options()->create(['text' => 'A', 'is_correct' => true, 'position' => 1]);
    $q1->options()->create(['text' => 'B', 'is_correct' => false, 'position' => 2]);

    $q2 = $assessment->questions()->create(['type' => 'multiple_choice', 'prompt' => 'Q2', 'points' => 2, 'position' => 2]);
    $q2a = $q2->options()->create(['text' => 'A', 'is_correct' => true, 'position' => 1]);
    $q2->options()->create(['text' => 'B', 'is_correct' => false, 'position' => 2]);
    $q2c = $q2->options()->create(['text' => 'C', 'is_correct' => true, 'position' => 3]);

    $attempt = app(AssessmentScoringService::class)->submit($student, $assessment, [
        $q1->id => [$q1a->id],
        $q2->id => [$q2a->id, $q2c->id],
    ]);

    expect($attempt->score_points)->toBe(3)
        ->and($attempt->max_points)->toBe(3)
        ->and((float) $attempt->score_percent)->toBe(100.0)
        ->and($attempt->passed)->toBeTrue()
        ->and($attempt->answers)->toHaveCount(2);
});

test('student cannot attempt an assessment above their enrollment access rank', function () {
    [$course, $module, $lesson, $assessment] = assessmentFixture(10);
    $student = assessmentStudent();
    Enrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'access_rank' => 0, 'enrolled_at' => now()]);

    expect(fn () => app(AssessmentScoringService::class)->submit($student, $assessment, []))
        ->toThrow(\Illuminate\Auth\Access\AuthorizationException::class);
});

test('assessment max attempts is enforced server side', function () {
    [$course, $module, $lesson, $assessment] = assessmentFixture();
    $assessment->update(['max_attempts' => 1]);
    $student = assessmentStudent();
    Enrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'access_rank' => 0, 'enrolled_at' => now()]);
    $question = $assessment->questions()->create(['type' => 'true_false', 'prompt' => 'Vrai ?', 'points' => 1, 'position' => 1]);
    $truth = $question->options()->create(['text' => 'Vrai', 'is_correct' => true, 'position' => 1]);
    $question->options()->create(['text' => 'Faux', 'is_correct' => false, 'position' => 2]);

    app(AssessmentScoringService::class)->submit($student, $assessment, [$question->id => [$truth->id]]);

    expect(fn () => app(AssessmentScoringService::class)->submit($student, $assessment, [$question->id => [$truth->id]]))
        ->toThrow(ValidationException::class);
});

test('assessment question bank and deletion are locked after student attempts exist', function () {
    [$course, $module, $lesson, $assessment] = assessmentFixture();
    $student = assessmentStudent();
    Enrollment::create(['user_id' => $student->id, 'course_id' => $course->id, 'access_rank' => 0, 'enrolled_at' => now()]);
    $question = $assessment->questions()->create(['type' => 'true_false', 'prompt' => 'Vrai ?', 'points' => 1, 'position' => 1]);
    $truth = $question->options()->create(['text' => 'Vrai', 'is_correct' => true, 'position' => 1]);
    $question->options()->create(['text' => 'Faux', 'is_correct' => false, 'position' => 2]);

    app(AssessmentScoringService::class)->submit($student, $assessment, [$question->id => [$truth->id]]);

    expect(fn () => app(\App\Services\Assessments\AssessmentHistoryGuard::class)->assertDeletable($assessment))
        ->toThrow(ValidationException::class)
        ->and(fn () => app(\App\Services\Assessments\AssessmentHistoryGuard::class)->assertQuestionBankMutable($assessment))
        ->toThrow(ValidationException::class);
});
