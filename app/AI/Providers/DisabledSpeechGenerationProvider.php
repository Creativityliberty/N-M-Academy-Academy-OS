<?php

declare(strict_types=1);

namespace App\AI\Providers;

use App\AI\Contracts\SpeechGenerationProvider;
use App\AI\Exceptions\AiProviderNotConfigured;

class DisabledSpeechGenerationProvider implements SpeechGenerationProvider
{
    public function name(): string { return 'disabled'; }
    public function model(): string { return 'none'; }
    public function synthesize(string $text, ?string $voice = null, ?string $instructions = null): array
    {
        throw new AiProviderNotConfigured('La génération audio Academy n’est pas configurée.');
    }
}
