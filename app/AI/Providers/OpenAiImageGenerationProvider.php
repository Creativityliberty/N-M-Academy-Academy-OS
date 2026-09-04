<?php

declare(strict_types=1);

namespace App\AI\Providers;

use App\AI\Contracts\ImageGenerationProvider;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class OpenAiImageGenerationProvider implements ImageGenerationProvider
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $model,
        private readonly string $baseUrl,
        private readonly int $timeout,
    ) {}

    public function name(): string { return 'openai'; }
    public function model(): string { return $this->model; }

    public function generate(string $prompt, string $size): array
    {
        $response = Http::withToken($this->apiKey)
            ->acceptJson()->asJson()->timeout($this->timeout)->retry(2, 500)
            ->post($this->baseUrl.'/images/generations', [
                'model' => $this->model,
                'prompt' => trim($prompt),
                'size' => $size,
                'n' => 1,
            ]);
        $response->throw();
        $data = $response->json('data.0.b64_json');
        if (! is_string($data) || $data === '') {
            throw new RuntimeException('OpenAI image n’a renvoyé aucune image encodée exploitable.');
        }
        $bytes = base64_decode($data, true);
        if (! is_string($bytes) || $bytes === '') {
            throw new RuntimeException('OpenAI image a renvoyé une image base64 invalide.');
        }
        return ['bytes'=>$bytes,'extension'=>'png','mime'=>'image/png'];
    }
}
