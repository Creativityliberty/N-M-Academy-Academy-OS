<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class VideoUrlRule implements ValidationRule
{
    /** @var string[] */
    private array $allowedDomains = [
        'youtube.com',
        'youtu.be',
        'vimeo.com',
        'dailymotion.com',
        'dai.ly',
        'loom.com',
        'wistia.com',
        'wi.st',
        'rumble.com',
        'streamable.com',
    ];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! filter_var($value, FILTER_VALIDATE_URL)) {
            $fail('L\'URL de la vidéo n\'est pas valide.');

            return;
        }

        $host = strtolower(parse_url($value, PHP_URL_HOST) ?? '');
        $host = ltrim($host, 'www.');

        foreach ($this->allowedDomains as $domain) {
            if ($host === $domain || str_ends_with($host, '.'.$domain)) {
                return;
            }
        }

        $fail('Cette plateforme vidéo n\'est pas supportée. Utilisez YouTube, Vimeo, DailyMotion, Loom, Wistia, Rumble ou Streamable.');
    }
}
