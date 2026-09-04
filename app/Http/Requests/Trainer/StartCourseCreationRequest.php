<?php

declare(strict_types=1);

namespace App\Http\Requests\Trainer;

use Illuminate\Foundation\Http\FormRequest;

class StartCourseCreationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'brief' => ['required', 'string', 'min:20', 'max:12000'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'audience' => ['nullable', 'string', 'max:2000'],
            'outcome' => ['nullable', 'string', 'max:2000'],
            'weeks' => ['nullable', 'integer', 'min:1', 'max:52'],
            'price_major' => ['nullable', 'numeric', 'min:0', 'max:1000000'],
            'currency' => ['nullable', 'string', 'size:3'],
            'generate_assessments' => ['sometimes', 'boolean'],
            'generate_assignments' => ['sometimes', 'boolean'],
            'generate_cover' => ['sometimes', 'boolean'],
            'generate_thumbnail' => ['sometimes', 'boolean'],
            'generate_audio' => ['sometimes', 'boolean'],
            'generate_landing' => ['sometimes', 'boolean'],
            'voice' => ['nullable', 'string', 'max:80'],
        ];
    }
}
