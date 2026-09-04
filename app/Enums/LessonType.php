<?php

declare(strict_types=1);

namespace App\Enums;

enum LessonType: string
{
    case Text = 'text';
    case VideoUrl = 'video_url';
    case Audio = 'audio';
    case Pdf = 'pdf';

    public function label(): string
    {
        return match ($this) {
            self::Text => 'Texte',
            self::VideoUrl => 'Vidéo (URL)',
            self::Audio => 'Audio',
            self::Pdf => 'PDF',
        };
    }
}
