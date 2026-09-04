<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademyAiSetting extends Model
{
    protected $fillable = [
        'scope',
        'text_provider',
        'text_model',
        'image_provider',
        'image_model',
        'image_size',
        'image_prompt_preset',
        'respect_branding',
        'avoid_embedded_text',
        'tts_provider',
        'tts_model',
    ];

    protected function casts(): array
    {
        return [
            'respect_branding' => 'boolean',
            'avoid_embedded_text' => 'boolean',
        ];
    }
}
