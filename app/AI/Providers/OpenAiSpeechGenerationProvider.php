<?php

declare(strict_types=1);

namespace App\AI\Providers;

use App\AI\Contracts\SpeechGenerationProvider;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAiSpeechGenerationProvider implements SpeechGenerationProvider
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $model,
        private readonly string $defaultVoice,
        private readonly string $baseUrl,
        private readonly int $timeout,
    ) {}

    public function name(): string { return 'openai'; }
    public function model(): string { return $this->model; }

    public function synthesize(string $text, ?string $voice = null, ?string $instructions = null): array
    {
        $selectedVoice = trim((string) ($voice ?: $this->defaultVoice)) ?: 'alloy';
        $payload = [
            'model' => $this->model,
            'voice' => $selectedVoice,
            'input' => trim($text),
            'response_format' => 'mp3',
        ];
        if (is_string($instructions) && trim($instructions) !== '') {
            $payload['instructions'] = trim($instructions);
        }
        $response = Http::withToken($this->apiKey)
            ->accept('audio/mpeg')->asJson()->timeout($this->timeout)->retry(2, 500)
            ->post($this->baseUrl.'/audio/speech', $payload);
        $response->throw();
        $bytes = $response->body();
        if ($bytes === '') { throw new RuntimeException('OpenAI TTS n’a renvoyé aucun audio exploitable.'); }
        return ['bytes'=>$bytes,'extension'=>'mp3','mime'=>'audio/mpeg','voice'=>$selectedVoice];
    }
}
