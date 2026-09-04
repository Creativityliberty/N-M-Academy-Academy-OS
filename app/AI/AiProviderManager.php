<?php

declare(strict_types=1);

namespace App\AI;

use App\AI\Contracts\AiProvider;
use App\AI\Providers\DeepSeekResponsesProvider;
use App\AI\Providers\DisabledAiProvider;
use App\AI\Providers\OpenAiResponsesProvider;
use InvalidArgumentException;

class AiProviderManager
{
    public function __construct(private readonly AcademyAiSettingsRepository $settings) {}

    public function provider(): AiProvider
    {
        $runtime = $this->settings->get();
        return $this->providerFor((string) ($runtime['text_provider'] ?? ''), (string) ($runtime['text_model'] ?? ''));
    }

    public function providerFor(?string $providerName = null, ?string $model = null): AiProvider
    {
        $runtime = $this->settings->get();
        $provider = strtolower(trim($providerName ?: (string) ($runtime['text_provider'] ?? config('academy-ai.provider', 'disabled'))));
        $selectedModel = trim((string) ($model ?: ($runtime['text_model'] ?? '')));

        return match ($provider) {
            'disabled' => new DisabledAiProvider,
            'openai' => $this->openAi($selectedModel ?: null),
            'deepseek' => $this->deepSeek($selectedModel ?: null),
            default => throw new InvalidArgumentException("Provider Academy AI inconnu : {$provider}"),
        };
    }

    /** @return array{configured: bool, provider: string, model: string} */
    public function status(): array
    {
        $provider = $this->provider();

        return [
            'configured' => $provider->name() !== 'disabled',
            'provider' => $provider->name(),
            'model' => $provider->model(),
        ];
    }

    private function openAi(?string $modelOverride = null): AiProvider
    {
        $key = trim((string) config('academy-ai.openai.api_key'));
        if ($key === '') { return new DisabledAiProvider; }

        return new OpenAiResponsesProvider(
            apiKey: $key,
            model: $modelOverride ?: $this->modelFor('openai'),
            baseUrl: $this->baseUrlFor('openai'),
            timeout: (int) config('academy-ai.timeout', 90),
        );
    }

    private function deepSeek(?string $modelOverride = null): AiProvider
    {
        $key = trim((string) config('academy-ai.deepseek.api_key'));
        if ($key === '') { return new DisabledAiProvider; }

        return new DeepSeekResponsesProvider(
            apiKey: $key,
            model: $modelOverride ?: $this->modelFor('deepseek'),
            baseUrl: $this->baseUrlFor('deepseek'),
            timeout: (int) config('academy-ai.timeout', 90),
            reasoningEffort: (string) config('academy-ai.deepseek.reasoning_effort', 'high'),
        );
    }

    private function modelFor(string $provider): string
    {
        $override = trim((string) config('academy-ai.model_override'));
        return $override !== '' ? $override : (string) config("academy-ai.{$provider}.model");
    }

    private function baseUrlFor(string $provider): string
    {
        $override = trim((string) config('academy-ai.base_url_override'));
        return rtrim($override !== '' ? $override : (string) config("academy-ai.{$provider}.base_url"), '/');
    }
}
