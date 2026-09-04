<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin\Courses;

use App\Enums\CourseStatus;
use App\Enums\LessonType;
use App\Models\Course;
use App\Rules\VideoUrlRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Course::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'trainer_id' => [$this->user()?->isAdmin() ? 'required' : 'nullable', 'exists:users,id'],
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'duration' => ['required', 'integer', 'min:1'],
            'image' => ['nullable', 'file', 'image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'featured' => ['boolean'],
            'benefits' => ['nullable', 'array'],
            'benefits.*' => ['string', 'max:255'],
            'objectives' => ['nullable', 'array'],
            'objectives.*.title' => ['required', 'string', 'max:255'],
            'objectives.*.description' => ['required', 'string'],
            'prerequisites' => ['nullable', 'array'],
            'prerequisites.*' => ['string', 'max:255'],
            'status' => ['required', Rule::enum(CourseStatus::class)],
            'modules' => ['nullable', 'array'],
            'modules.*.title' => ['required', 'string', 'max:255'],
            'modules.*.duration' => ['required', 'integer', 'min:1'],
            'modules.*.lessons' => ['nullable', 'array'],
            'modules.*.lessons.*.title' => ['required', 'string', 'max:255'],
            'modules.*.lessons.*.duration' => ['required', 'integer', 'min:1'],
            'modules.*.lessons.*.is_free' => ['boolean'],
            'modules.*.lessons.*.type' => ['required', Rule::enum(LessonType::class)],
            'modules.*.lessons.*.video_url' => ['nullable', 'string', new VideoUrlRule],
            'modules.*.lessons.*.audio_file' => ['nullable', 'file', 'mimes:mp3,wav,ogg,aac,m4a,opus', 'max:102400'],
            'modules.*.lessons.*.pdf_file' => ['nullable', 'file', 'mimes:pdf', 'max:51200'],
        ];
    }
}
