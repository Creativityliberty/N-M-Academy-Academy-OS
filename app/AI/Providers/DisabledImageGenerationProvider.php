<?php

declare(strict_types=1);

namespace App\AI\Providers;

use App\AI\Contracts\ImageGenerationProvider;
use App\AI\Exceptions\AiProviderNotConfigured;

class DisabledImageGenerationProvider implements ImageGenerationProvider
{
    public function name(): string { return 'disabled'; }
    public function model(): string { return 'none'; }
    public function generate(string $prompt, string $size): array
    {
        throw new AiProviderNotConfigured('La génération d’images Academy n’est pas configurée.');
    }
}
