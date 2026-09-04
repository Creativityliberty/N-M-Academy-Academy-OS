<?php

declare(strict_types=1);

namespace App\Services\Assessments;

use App\Models\CourseAssessment;
use App\Models\CourseAssessmentAttempt;
use App\Models\CourseAssessmentQuestion;
use App\Models\User;
use App\Services\LearningAccess\LearningAccessService;
use App\Services\Completion\CourseCompletionService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AssessmentScoringService
{
    public function __construct(
        private readonly LearningAccessService $access,
        private readonly CourseCompletionService $completion,
    ) {}

    /** @param array<int|string,mixed> $answers */
    public function submit(User $student, CourseAssessment $assessment, array $answers): CourseAssessmentAttempt
    {
        $attempt = DB::transaction(function () use ($student, $assessment, $answers): CourseAssessmentAttempt {
            /** @var CourseAssessment $locked */
            $locked = CourseAssessment::query()
                ->with(['course:id,trainer_id', 'module:id,course_id,minimum_access_rank', 'lesson.module:id,course_id,minimum_access_rank', 'questions.options'])
                ->lockForUpdate()
                ->findOrFail($assessment->id);

            $this->authorize($student, $locked);

            $previousAttempts = CourseAssessmentAttempt::query()
                ->where('assessment_id', $locked->id)
                ->where('user_id', $student->id)
                ->lockForUpdate()
                ->count();

            if ($locked->max_attempts !== null && $previousAttempts >= (int) $locked->max_attempts) {
                throw ValidationException::withMessages(['assessment' => 'Maximum number of attempts reached.']); // max_attempts
            }

            $attempt = CourseAssessmentAttempt::create([
                'assessment_id' => $locked->id,
                'user_id' => $student->id,
                'attempt_number' => $previousAttempts + 1,
                'started_at' => now(),
            ]);

            $score = 0;
            $max = 0;

            foreach ($locked->questions as $question) {
                /** @var CourseAssessmentQuestion $question */
                $max += (int) $question->points;
                $selected = $this->selectedOptionIds($answers[$question->id] ?? $answers[(string) $question->id] ?? []);
                $allowed = $question->options->pluck('id')->map(fn ($id) => (int) $id)->all();

                if (array_diff($selected, $allowed) !== []) {
                    throw ValidationException::withMessages(["answers.{$question->id}" => 'One or more selected options do not belong to this question.']);
                }

                $correct = $question->options
                    ->where('is_correct', true)
                    ->pluck('id')
                    ->map(fn ($id) => (int) $id)
                    ->sort()
                    ->values()
                    ->all();

                sort($selected);
                $isCorrect = $selected === $correct;
                $awarded = $isCorrect ? (int) $question->points : 0;
                $score += $awarded;

                $attempt->answers()->create([
                    'question_id' => $question->id,
                    'selected_option_ids' => $selected, // selected_option_ids
                    'is_correct' => $isCorrect,
                    'awarded_points' => $awarded,
                    'feedback' => $locked->show_explanations ? $question->explanation : null,
                ]);
            }

            $scorePercent = $max > 0 ? round(($score / $max) * 100, 2) : 0.0;
            $attempt->update([
                'score_points' => $score,
                'max_points' => $max,
                'score_percent' => $scorePercent, // score_percent
                'passed' => $scorePercent >= (int) $locked->passing_score_percent, // passed
                'completed_at' => now(),
            ]);

            return $attempt->fresh('answers');
        });

        $assessment->loadMissing('course');
        if ($assessment->course) {
            $this->completion->evaluate($student, $assessment->course);
        }

        return $attempt;
    }

    private function authorize(User $student, CourseAssessment $assessment): void
    {
        if (! $assessment->is_enabled) {
            throw new AuthorizationException('Cette évaluation est désactivée.');
        }

        if (! $this->access->canAccessAssessment($student, $assessment)) {
            throw new AuthorizationException('Cette évaluation ne vous est pas accessible.');
        }
    }

    /** @return array<int,int> */
    private function selectedOptionIds(mixed $value): array
    {
        if (! is_array($value)) {
            $value = [$value];
        }

        return collect($value)
            ->filter(fn ($id) => is_numeric($id) && (int) $id > 0)
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->sort()
            ->values()
            ->all();
    }
}
