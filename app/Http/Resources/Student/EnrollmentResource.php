<?php

declare(strict_types=1);

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnrollmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'course_id' => $this->course->id,
            'title' => $this->course->title,
            'description' => $this->course->description,
            'image' => $this->course->image,
            'trainer' => $this->course->trainer->name,
            'trainer_initials' => $this->trainerInitials(),
            'category' => $this->course->category?->name,
            'module_count' => $this->course->modules_count ?? $this->course->modules->count(),
            'lesson_count' => $this->course->modules->sum(fn ($m) => $m->lessons_count ?? $m->lessons->count()),
            'enrolled_at' => $this->enrolled_at?->translatedFormat('d M Y'),
        ];
    }

    private function trainerInitials(): string
    {
        return collect(explode(' ', $this->course->trainer->name))
            ->map(fn (string $word) => mb_strtoupper(mb_substr($word, 0, 1)))
            ->take(2)
            ->implode('');
    }
}
