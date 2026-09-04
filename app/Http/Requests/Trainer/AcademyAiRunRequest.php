<?php

declare(strict_types=1);

namespace App\Http\Requests\Trainer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class AcademyAiRunRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isTrainer() ?? false;
    }

    public function rules(): array
    {
        return [
            'capability' => [
                'required',
                'string',
                Rule::in([
                    'academy.ask',
                    'course.generate',
                    'assessment.generate',
                    'curriculum.generate',
                    'lessons.generate',
                    'lesson.rewrite',
                    'students.analyze',
                    'page.generate',
                    'page.optimize',
                ]),
            ],
            'prompt' => ['required', 'string', 'min:3', 'max:12000'],
            'input' => ['nullable', 'array'],
            'input.category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'input.course_id' => ['nullable', 'integer'],
            'input.module_id' => ['nullable', 'integer'],
            'input.lesson_id' => ['nullable', 'integer'],
            'input.page_id' => ['nullable', 'integer'],
            'input.audience' => ['nullable', 'string', 'max:500'],
            'input.outcome' => ['nullable', 'string', 'max:1000'],
            'input.weeks' => ['nullable', 'integer', 'min:1', 'max:52'],
            'input.question_count' => ['nullable', 'integer', 'min:3', 'max:20'],
            'input.kind' => ['nullable', 'string', Rule::in(['quiz','assessment'])],
            'input.passing_score_percent' => ['nullable', 'integer', 'min:0', 'max:100'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $capability = (string) $this->input('capability');
                $input = (array) $this->input('input', []);

                $requiredKey = match ($capability) {
                    'course.generate' => 'category_id',
                    'assessment.generate' => 'course_id',
                    'curriculum.generate' => 'course_id',
                    'lessons.generate' => 'module_id',
                    'lesson.rewrite' => 'lesson_id',
                    'page.optimize' => 'page_id',
                    default => null,
                };

                if ($requiredKey && empty($input[$requiredKey])) {
                    $validator->errors()->add("input.{$requiredKey}", 'Cette cible est requise pour la capability sélectionnée.');
                }
            },
        ];
    }
}
