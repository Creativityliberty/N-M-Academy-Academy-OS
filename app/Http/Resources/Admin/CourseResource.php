<?php

declare(strict_types=1);

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'duration' => $this->duration,
            'image' => $this->image,
            'featured' => $this->featured,
            'status' => $this->status->value,
            'status_label' => $this->status->label(),
            'published_at' => $this->published_at?->toDateTimeString(),
            'category' => $this->whenLoaded('category', fn () => [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ]),
            'trainer' => $this->whenLoaded('trainer', fn () => [
                'id' => $this->trainer->id,
                'name' => $this->trainer->name,
            ]),
            'module_count' => $this->modules_count ?? 0,
            'modules' => $this->whenLoaded('modules', fn () => $this->modules->map(fn ($m) => [
                'id' => $m->id,
                'title' => $m->title,
                'duration' => $m->duration,
                'lessons' => $m->relationLoaded('lessons') ? $m->lessons->map(fn ($l) => [
                    'id' => $l->id,
                    'title' => $l->title,
                    'duration' => $l->duration,
                    'is_free' => $l->is_free,
                    'type' => $l->type?->value ?? 'video_url',
                    'video_url' => $l->video_url,
                    'audio_url' => $l->audio_url,
                    'pdf_url' => $l->pdf_url,
                ]) : [],
            ])),
            'benefits' => $this->benefits,
            'objectives' => $this->objectives,
            'prerequisites' => $this->prerequisites,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
