<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\AI\AiProviderManager;
use App\AI\Contracts\AiProvider;
use RuntimeException;

class TowerAiProviderResolver
{
    public function __construct(private readonly AiProviderManager $providers) {}

    public function resolve(): AiProvider
    {
        $providerName = strtolower(trim((string) config('mission-tower.ai.provider', 'inherit')));
        if ($providerName === 'inherit') {
            $providerName = strtolower(trim((string) config('academy-ai.provider', 'disabled')));
        }

        if (! in_array($providerName, ['openai', 'deepseek'], true)) {
            throw new RuntimeException('Mission Tower nécessite un provider IA OpenAI ou DeepSeek configuré.');
        }

        $model = trim((string) config('mission-tower.ai.model', ''));
        $provider = $this->providers->providerFor($providerName, $model !== '' ? $model : null);
        if ($provider->name() === 'disabled') {
            throw new RuntimeException("Le provider IA {$providerName} n'est pas configuré pour Mission Tower.");
        }

        return $provider;
    }
}
