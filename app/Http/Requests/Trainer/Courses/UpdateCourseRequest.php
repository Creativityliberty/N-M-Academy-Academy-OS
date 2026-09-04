<?php

declare(strict_types=1);

namespace App\Http\Requests\Trainer\Courses;

use App\Enums\LessonType;
use App\Rules\VideoUrlRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('course')) ?? false;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'target_audience' => ['nullable', 'string', 'max:12000'],
            'level' => ['nullable', Rule::in(['beginner', 'intermediate', 'advanced', 'all_levels'])],
            'language' => ['nullable', 'string', 'min:2', 'max:16'],
            'positioning' => ['nullable', 'array'],
            'positioning.main_problem' => ['nullable', 'string', 'max:12000'],
            'positioning.desired_transformation' => ['nullable', 'string', 'max:12000'],
            'positioning.main_promise' => ['nullable', 'string', 'max:12000'],
            'positioning.unique_angle' => ['nullable', 'string', 'max:12000'],
            'price' => ['required', 'numeric', 'min:0'],
            'duration' => ['required', 'integer', 'min:1'],
            'image' => ['nullable', 'file', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'benefits' => ['nullable', 'array'],
            'benefits.*' => ['string', 'max:255'],
            'objectives' => ['nullable', 'array'],
            'objectives.*.title' => ['required', 'string', 'max:255'],
            'objectives.*.description' => ['required', 'string'],
            'prerequisites' => ['nullable', 'array'],
            'prerequisites.*' => ['string', 'max:255'],
            'modules' => ['nullable', 'array'],
            'modules.*.title' => ['required', 'string', 'max:255'],
            'modules.*.description' => ['nullable', 'string', 'max:12000'],
            'modules.*.objectives' => ['nullable', 'array'],
            'modules.*.objectives.*' => ['string', 'max:500'],
            'modules.*.minimum_access_rank' => ['nullable', 'integer', 'min:0', 'max:1000'],
            'modules.*.duration' => ['required', 'integer', 'min:1'],
            'modules.*.id' => ['nullable', 'integer'],
            'modules.*.lessons' => ['nullable', 'array'],
            'modules.*.lessons.*.id' => ['nullable', 'integer'],
            'modules.*.lessons.*.title' => ['required', 'string', 'max:255'],
            'modules.*.lessons.*.content' => ['nullable', 'string', 'max:30000'],
            'modules.*.lessons.*.transcript' => ['nullable', 'string', 'max:200000'],
            'modules.*.lessons.*.duration' => ['required', 'integer', 'min:1'],
            'modules.*.lessons.*.is_free' => ['boolean'],
            'modules.*.lessons.*.type' => ['required', Rule::enum(LessonType::class)],
            'modules.*.lessons.*.video_url' => ['nullable', 'string', new VideoUrlRule],
            'modules.*.lessons.*.audio_file' => ['nullable', 'file', 'mimes:mp3,wav,ogg,aac,m4a,opus', 'max:102400'],
            'modules.*.lessons.*.pdf_file' => ['nullable', 'file', 'mimes:pdf', 'max:51200'],
        ];
    }
}
