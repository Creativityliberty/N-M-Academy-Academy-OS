<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModuleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'duration' => $this->duration,
            'minimum_access_rank' => (int) ($this->minimum_access_rank ?? 0),
            'order' => $this->order,
            'lessons' => $this->whenLoaded('lessons', fn () => LessonResource::collection($this->lessons)->resolve()),
        ];
    }
}
