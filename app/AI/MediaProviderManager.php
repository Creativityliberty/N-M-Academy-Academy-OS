<?php

declare(strict_types=1);

namespace App\AI;

use App\AI\Contracts\ImageGenerationProvider;
use App\AI\Contracts\SpeechGenerationProvider;
use App\AI\Providers\DisabledImageGenerationProvider;
use App\AI\Providers\DisabledSpeechGenerationProvider;
use App\AI\Providers\GeminiImageGenerationProvider;
use App\AI\Providers\OpenAiImageGenerationProvider;
use App\AI\Providers\OpenAiSpeechGenerationProvider;
use InvalidArgumentException;

class MediaProviderManager
{
    public function __construct(private readonly AcademyAiSettingsRepository $settings) {}

    public function image(): ImageGenerationProvider
    {
        $runtime = $this->settings->get();
        $provider = strtolower(trim((string) ($runtime['image_provider'] ?? config('academy-ai.image_provider', 'disabled'))));
        if ($provider === 'disabled') { return new DisabledImageGenerationProvider; }

        if ($provider === 'gemini') {
            $key = trim((string) config('academy-ai.gemini.api_key'));
            if ($key === '') { return new DisabledImageGenerationProvider; }
            return new GeminiImageGenerationProvider(
                apiKey: $key,
                model: (string) ($runtime['image_model'] ?: config('academy-ai.gemini.image_model', 'gemini-3.1-flash-lite-image')),
                baseUrl: rtrim((string) config('academy-ai.gemini.base_url', 'https://generativelanguage.googleapis.com'), '/'),
                timeout: (int) config('academy-ai.media_timeout', 180),
                imageSize: (string) ($runtime['image_size'] ?? '1K'),
            );
        }

        if ($provider !== 'openai') { throw new InvalidArgumentException("Provider image inconnu : {$provider}"); }
        $key = trim((string) config('academy-ai.openai.api_key'));
        if ($key === '') { return new DisabledImageGenerationProvider; }
        return new OpenAiImageGenerationProvider(
            apiKey: $key,
            model: (string) ($runtime['image_model'] ?: config('academy-ai.openai.image_model', 'gpt-image-2')),
            baseUrl: rtrim((string) config('academy-ai.openai.base_url', 'https://api.openai.com/v1'), '/'),
            timeout: (int) config('academy-ai.media_timeout', 180),
        );
    }

    public function speech(): SpeechGenerationProvider
    {
        $runtime = $this->settings->get();
        $provider = strtolower(trim((string) ($runtime['tts_provider'] ?? config('academy-ai.tts_provider', 'disabled'))));
        if ($provider === 'disabled') { return new DisabledSpeechGenerationProvider; }
        if ($provider !== 'openai') { throw new InvalidArgumentException("Provider TTS inconnu : {$provider}"); }
        $key = trim((string) config('academy-ai.openai.api_key'));
        if ($key === '') { return new DisabledSpeechGenerationProvider; }
        return new OpenAiSpeechGenerationProvider(
            apiKey: $key,
            model: (string) ($runtime['tts_model'] ?: config('academy-ai.openai.tts_model', 'gpt-4o-mini-tts')),
            defaultVoice: (string) config('academy-ai.openai.tts_voice', 'alloy'),
            baseUrl: rtrim((string) config('academy-ai.openai.base_url', 'https://api.openai.com/v1'), '/'),
            timeout: (int) config('academy-ai.media_timeout', 180),
        );
    }
}
