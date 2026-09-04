<?php

declare(strict_types=1);

namespace App\Http\Requests\Trainer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssessmentRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->isTrainer() ?? false; }
    public function rules(): array
    {
        return [
            'title' => ['required','string','min:2','max:255'],
            'description' => ['nullable','string','max:12000'],
            'kind' => ['required', Rule::in(['quiz','assessment'])],
            'module_id' => ['nullable','integer'],
            'lesson_id' => ['nullable','integer'],
            'passing_score_percent' => ['required','integer','min:0','max:100'],
            'max_attempts' => ['nullable','integer','min:1','max:100'],
            'shuffle_questions' => ['required','boolean'],
            'shuffle_options' => ['required','boolean'],
            'show_explanations' => ['required','boolean'],
            'is_enabled' => ['required','boolean'],
            'questions' => ['required','array','min:1','max:100'],
            'questions.*.type' => ['required', Rule::in(['single_choice','multiple_choice','true_false'])],
            'questions.*.prompt' => ['required','string','min:2','max:12000'],
            'questions.*.explanation' => ['nullable','string','max:12000'],
            'questions.*.points' => ['required','integer','min:1','max:100'],
            'questions.*.options' => ['required','array','min:2','max:20'],
            'questions.*.options.*.text' => ['required','string','max:4000'],
            'questions.*.options.*.is_correct' => ['required','boolean'],
        ];
    }
}
