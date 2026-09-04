<?php

declare(strict_types=1);

namespace App\Services\Assessments;

use App\Models\Course;
use App\Models\CourseAssessment;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;

class AssessmentDefinitionService
{
    public function __construct(
        private readonly AssessmentDefinitionValidator $validator,
        private readonly AssessmentHistoryGuard $history,
    ) {}

    /** @param array<string,mixed> $payload */
    public function create(Course $course, array $payload): CourseAssessment
    {
        return DB::transaction(function () use ($course, $payload): CourseAssessment {
            [$moduleId, $lessonId] = $this->targetIds($course, $payload);
            $definition = $this->validator->validateAssessment($payload);
            $assessment = $course->assessments()->create([
                ...collect($definition)->except('questions')->all(),
                'module_id' => $moduleId,
                'lesson_id' => $lessonId,
                'position' => (int) ($payload['position'] ?? ($course->assessments()->max('position') ?? 0) + 1),
            ]);
            $this->replaceQuestions($assessment, $definition['questions']);
            return $assessment->fresh('questions.options');
        });
    }

    /** @param array<string,mixed> $payload */
    public function update(CourseAssessment $assessment, array $payload): CourseAssessment
    {
        return DB::transaction(function () use ($assessment, $payload): CourseAssessment {
            $assessment->loadMissing('course');
            [$moduleId, $lessonId] = $this->targetIds($assessment->course, $payload);
            $definition = $this->validator->validateAssessment($payload);
            $assessment->loadMissing('questions.options');
            $hasAttempts = $assessment->attempts()->exists();
            if ($hasAttempts && $this->questionDefinition($assessment) !== $definition['questions']) {
                $this->history->assertQuestionBankMutable($assessment);
            }

            $assessment->update([
                ...collect($definition)->except('questions')->all(),
                'module_id' => $moduleId,
                'lesson_id' => $lessonId,
            ]);
            if (! $hasAttempts) {
                $this->replaceQuestions($assessment, $definition['questions']);
            }
            return $assessment->fresh('questions.options');
        });
    }


    /** @return array<int,array<string,mixed>> */
    private function questionDefinition(CourseAssessment $assessment): array
    {
        return $assessment->questions->map(fn ($question): array => [
            'type' => $question->type->value,
            'prompt' => $question->prompt,
            'explanation' => $question->explanation,
            'points' => (int) $question->points,
            'options' => $question->options->map(fn ($option): array => [
                'text' => $option->text,
                'is_correct' => (bool) $option->is_correct,
                'position' => (int) $option->position,
            ])->values()->all(),
        ])->values()->all();
    }

    /** @param array<int,array<string,mixed>> $questions */
    private function replaceQuestions(CourseAssessment $assessment, array $questions): void
    {
        $assessment->questions()->delete();
        foreach ($questions as $questionPosition => $questionData) {
            $question = $assessment->questions()->create([
                'type' => $questionData['type'],
                'prompt' => $questionData['prompt'],
                'explanation' => $questionData['explanation'],
                'points' => $questionData['points'],
                'position' => $questionPosition + 1,
            ]);
            foreach ($questionData['options'] as $optionPosition => $optionData) {
                $question->options()->create([
                    'text' => $optionData['text'],
                    'is_correct' => $optionData['is_correct'],
                    'position' => $optionPosition + 1,
                ]);
            }
        }
    }

    /** @param array<string,mixed> $payload @return array{0:?int,1:?int} */
    private function targetIds(Course $course, array $payload): array
    {
        $moduleId = isset($payload['module_id']) && $payload['module_id'] !== '' ? (int) $payload['module_id'] : null;
        $lessonId = isset($payload['lesson_id']) && $payload['lesson_id'] !== '' ? (int) $payload['lesson_id'] : null;

        if ($lessonId) {
            $lesson = Lesson::query()->with('module:id,course_id')->find($lessonId);
            if (! $lesson || (int) $lesson->module?->course_id !== (int) $course->id) {
                throw new AuthorizationException('La leçon cible n’appartient pas à cette formation.');
            }
            $moduleId = (int) $lesson->module_id;
        } elseif ($moduleId && ! Module::query()->whereKey($moduleId)->where('course_id', $course->id)->exists()) {
            throw new AuthorizationException('Le module cible n’appartient pas à cette formation.');
        }

        return [$moduleId, $lessonId];
    }
}
