<?php

declare(strict_types=1);

namespace App\AI\Providers;

use App\AI\Contracts\AiProvider;
use App\AI\Exceptions\AiProviderNotConfigured;

class DisabledAiProvider implements AiProvider
{
    public function name(): string
    {
        return 'disabled';
    }

    public function model(): string
    {
        return 'none';
    }

    public function text(string $system, string $prompt): string
    {
        throw new AiProviderNotConfigured('Academy AI n’est pas configuré. Ajoutez OPENAI_API_KEY ou configurez un provider compatible.');
    }

    public function structured(string $system, string $prompt, string $schemaName, array $schema): array
    {
        throw new AiProviderNotConfigured('Academy AI n’est pas configuré. Ajoutez OPENAI_API_KEY ou configurez un provider compatible.');
    }
}
