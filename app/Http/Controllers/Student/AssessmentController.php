<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student;

use App\Enums\CourseStatus;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseAssessment;
use App\Models\CourseAssessmentAttempt;
use App\Models\User;
use App\Services\Assessments\AssessmentScoringService;
use App\Services\LearningAccess\LearningAccessService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssessmentController extends Controller
{
    public function show(Request $request, Course $course, CourseAssessment $assessment, LearningAccessService $access): Response
    {
        /** @var User $student */
        $student = $request->user();
        $assessment = $this->authorizedAssessment($student, $course, $assessment, $access);
        $assessment->load(['questions.options']);

        $attempts = CourseAssessmentAttempt::query()
            ->where('assessment_id', $assessment->id)
            ->where('user_id', $student->id)
            ->latest('attempt_number')
            ->with(['answers.question.options'])
            ->get();
        $lastAttempt = $attempts->first();
        $remainingAttempts = $assessment->max_attempts === null
            ? null
            : max(0, (int) $assessment->max_attempts - $attempts->count());

        $questions = $assessment->questions->map(function ($question) use ($assessment): array {
            $options = $question->options->map(fn ($option) => [
                'id' => $option->id,
                'text' => $option->text,
                // Intentionally no is_correct before submission.
            ])->values();
            if ($assessment->shuffle_options) { $options = $options->shuffle()->values(); }

            return [
                'id' => $question->id,
                'type' => $question->type->value,
                'prompt' => $question->prompt,
                'points' => (int) $question->points,
                'options' => $options,
            ];
        })->values();
        if ($assessment->shuffle_questions) { $questions = $questions->shuffle()->values(); }

        return Inertia::render('student/courses/assessment', [
            'course' => ['id' => $course->id, 'title' => $course->title],
            'assessment' => [
                'id' => $assessment->id,
                'title' => $assessment->title,
                'description' => $assessment->description,
                'kind' => $assessment->kind->value,
                'passingScorePercent' => (int) $assessment->passing_score_percent,
                'maxAttempts' => $assessment->max_attempts,
                'remainingAttempts' => $remainingAttempts, // remainingAttempts
                'questionCount' => $questions->count(),
                'questions' => $questions,
            ],
            'lastAttempt' => $lastAttempt ? $this->serializeAttempt($lastAttempt, $assessment->show_explanations) : null,
            'attemptHistory' => $attempts->map(fn (CourseAssessmentAttempt $attempt) => [
                'id' => $attempt->id,
                'attemptNumber' => $attempt->attempt_number,
                'scorePercent' => (float) $attempt->score_percent,
                'passed' => $attempt->passed,
                'completedAt' => $attempt->completed_at?->toIso8601String(),
            ])->values(),
        ]);
    }

    public function submit(Request $request, Course $course, CourseAssessment $assessment, AssessmentScoringService $scoring, LearningAccessService $access): RedirectResponse
    {
        /** @var User $student */
        $student = $request->user();
        $assessment = $this->authorizedAssessment($student, $course, $assessment, $access);
        $validated = $request->validate(['answers' => ['required','array']]);
        $scoring->submit($student, $assessment, (array) $validated['answers']);
        return back()->with('success', 'Évaluation corrigée.');
    }

    private function authorizedAssessment(User $student, Course $course, CourseAssessment $assessment, LearningAccessService $access): CourseAssessment
    {
        abort_unless($course->status === CourseStatus::Published, 404);
        abort_unless((int) $assessment->course_id === (int) $course->id && $assessment->is_enabled, 404);
        $assessment->loadMissing(['module', 'lesson.module']);
        abort_unless($access->canAccessAssessment($student, $assessment), 403);

        return $assessment;
    }

    /** @return array<string,mixed> */
    private function serializeAttempt(CourseAssessmentAttempt $attempt, bool $showExplanations): array
    {
        return [
            'id' => $attempt->id,
            'attemptNumber' => (int) $attempt->attempt_number,
            'scorePoints' => (int) $attempt->score_points,
            'maxPoints' => (int) $attempt->max_points,
            'scorePercent' => (float) $attempt->score_percent,
            'passed' => $attempt->passed,
            'completedAt' => $attempt->completed_at?->toIso8601String(),
            'answers' => $attempt->answers->map(function ($answer) use ($showExplanations): array {
                $question = $answer->question;
                return [
                    'questionId' => $answer->question_id,
                    'selectedOptionIds' => $answer->selected_option_ids, // selected_option_ids
                    'isCorrect' => $answer->is_correct,
                    'awardedPoints' => (int) $answer->awarded_points,
                    'correctOptionIds' => $question->options->where('is_correct', true)->pluck('id')->values(),
                    'explanation' => $showExplanations ? $question->explanation : null, // show_explanations
                ];
            })->values(),
        ];
    }
}
