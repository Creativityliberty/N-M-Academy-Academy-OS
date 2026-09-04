<?php

declare(strict_types=1);

namespace App\Services\Assessments;

use App\Enums\AssessmentKind;
use App\Enums\AssessmentQuestionType;
use Illuminate\Validation\ValidationException;

class AssessmentDefinitionValidator
{
    /** @param array<string,mixed> $payload @return array<string,mixed> */
    public function validateAssessment(array $payload): array
    {
        $kind = strtolower(trim((string) ($payload['kind'] ?? AssessmentKind::Quiz->value)));
        if (! in_array($kind, array_column(AssessmentKind::cases(), 'value'), true)) {
            throw ValidationException::withMessages(['kind' => 'Unsupported assessment kind.']);
        }

        $passing = (int) ($payload['passing_score_percent'] ?? 70);
        if ($passing < 0 || $passing > 100) {
            throw ValidationException::withMessages(['passing_score_percent' => 'Passing score must be between 0 and 100.']);
        }

        $maxAttempts = $payload['max_attempts'] ?? null;
        if ($maxAttempts !== null && ((int) $maxAttempts < 1 || (int) $maxAttempts > 100)) {
            throw ValidationException::withMessages(['max_attempts' => 'Max attempts must be between 1 and 100, or null.']);
        }

        $rawQuestions = array_values((array) ($payload['questions'] ?? []));
        if ($rawQuestions === []) {
            throw ValidationException::withMessages(['questions' => 'Assessment requires at least one question.']); // at least one question
        }

        $questions = [];
        foreach ($rawQuestions as $index => $question) {
            try {
                $questions[] = $this->validateQuestion((array) $question);
            } catch (ValidationException $error) {
                throw ValidationException::withMessages([
                    "questions.{$index}" => collect($error->errors())->flatten()->first() ?? 'Invalid question.',
                ]);
            }
        }

        return [
            'title' => mb_substr(trim((string) ($payload['title'] ?? 'Quiz')), 0, 255),
            'description' => $this->nullableText($payload['description'] ?? null, 12000),
            'kind' => $kind,
            'passing_score_percent' => $passing,
            'max_attempts' => $maxAttempts === null ? null : (int) $maxAttempts,
            'shuffle_questions' => (bool) ($payload['shuffle_questions'] ?? false),
            'shuffle_options' => (bool) ($payload['shuffle_options'] ?? false),
            'show_explanations' => (bool) ($payload['show_explanations'] ?? true),
            'is_enabled' => (bool) ($payload['is_enabled'] ?? true),
            'questions' => $questions,
        ];
    }

    /** @param array<string,mixed> $question @return array<string,mixed> */
    public function validateQuestion(array $question): array
    {
        $type = strtolower(trim((string) ($question['type'] ?? '')));
        if (! in_array($type, array_column(AssessmentQuestionType::cases(), 'value'), true)) {
            throw ValidationException::withMessages(['type' => 'Unsupported question type.']);
        }

        $prompt = trim((string) ($question['prompt'] ?? ''));
        if (mb_strlen($prompt) < 2 || mb_strlen($prompt) > 12000) {
            throw ValidationException::withMessages(['prompt' => 'Question prompt must contain between 2 and 12000 characters.']);
        }

        $points = (int) ($question['points'] ?? 1);
        if ($points < 1 || $points > 100) {
            throw ValidationException::withMessages(['points' => 'Question points must be between 1 and 100.']);
        }

        $options = collect(array_values((array) ($question['options'] ?? [])))
            ->map(function ($option, int $position): array {
                $option = (array) $option;
                $text = trim((string) ($option['text'] ?? ''));
                if ($text === '' || mb_strlen($text) > 4000) {
                    throw ValidationException::withMessages(['options' => 'Each option must contain text.']);
                }
                return [
                    'text' => $text,
                    'is_correct' => (bool) ($option['is_correct'] ?? false),
                    'position' => $position + 1,
                ];
            })
            ->values()
            ->all();

        $correctCount = count(array_filter($options, fn (array $option): bool => $option['is_correct']));

        if ($type === AssessmentQuestionType::SingleChoice->value && $correctCount !== 1) {
            throw ValidationException::withMessages(['options' => 'single_choice requires exactly one correct option.']); // exactly one correct
        }
        if ($type === AssessmentQuestionType::MultipleChoice->value && $correctCount < 1) {
            throw ValidationException::withMessages(['options' => 'multiple_choice requires at least one correct option.']); // at least one correct
        }
        if ($type === AssessmentQuestionType::TrueFalse->value) {
            if (count($options) !== 2) {
                throw ValidationException::withMessages(['options' => 'true_false requires exactly two options.']); // exactly two options
            }
            if ($correctCount !== 1) {
                throw ValidationException::withMessages(['options' => 'true_false requires exactly one correct option.']);
            }
        }
        if ($type !== AssessmentQuestionType::TrueFalse->value && count($options) < 2) {
            throw ValidationException::withMessages(['options' => 'Choice questions require at least two options.']);
        }

        return [
            'type' => $type,
            'prompt' => $prompt,
            'explanation' => $this->nullableText($question['explanation'] ?? null, 12000),
            'points' => $points,
            'options' => $options,
        ];
    }

    private function nullableText(mixed $value, int $max): ?string
    {
        $text = trim((string) ($value ?? ''));
        return $text === '' ? null : mb_substr($text, 0, $max);
    }
}
