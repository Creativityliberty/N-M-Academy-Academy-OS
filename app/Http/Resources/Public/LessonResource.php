<?php

namespace App\Http\Resources\Public;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LessonResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'transcript' => $this->transcript,
            'duration' => $this->formatDuration(),
            'free' => $this->is_free,
            'type' => $this->type?->value ?? 'video_url',
            'video_url' => $this->video_url,
            'audio_url' => $this->audio_url,
            'pdf_url' => $this->pdf_url,
        ];
    }

    private function formatDuration(): string
    {
        $m = $this->duration;
        if ($m < 60) {
            return "{$m} min";
        }
        $h = intdiv($m, 60);
        $rem = $m % 60;

        return $rem > 0 ? "{$h}h {$rem} min" : "{$h}h";
    }
}
