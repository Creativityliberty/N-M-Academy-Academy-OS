<?php

declare(strict_types=1);

namespace App\AI\Providers;

use App\AI\Contracts\ImageGenerationProvider;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiImageGenerationProvider implements ImageGenerationProvider
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $model = 'gemini-3.1-flash-lite-image',
        private readonly string $baseUrl = 'https://generativelanguage.googleapis.com',
        private readonly int $timeout = 180,
        private readonly string $imageSize = '1K',
    ) {}

    public function name(): string { return 'gemini'; }
    public function model(): string { return $this->model; }

    public function generate(string $prompt, string $size): array
    {
        $aspectRatio = $this->aspectRatioFor($size);
        $imageSize = $this->normalizedImageSize();

        $response = Http::withHeaders(['x-goog-api-key' => $this->apiKey])
            ->acceptJson()
            ->asJson()
            ->timeout($this->timeout)
            ->retry(2, 500)
            ->post(rtrim($this->baseUrl, '/').'/v1beta/interactions', [
                'model' => $this->model,
                'input' => trim($prompt),
                'response_format' => [
                    'type' => 'image',
                    'mime_type' => 'image/jpeg',
                    'aspect_ratio' => $aspectRatio,
                    'image_size' => $imageSize,
                ],
            ]);

        $response->throw();
        $payload = $response->json();
        $encoded = data_get($payload, 'output_image.data');

        if (! is_string($encoded) || $encoded === '') {
            foreach ((array) ($payload['outputs'] ?? $payload['output'] ?? []) as $item) {
                if (! is_array($item)) { continue; }
                $candidate = data_get($item, 'image.data') ?? data_get($item, 'data');
                if (is_string($candidate) && $candidate !== '') {
                    $encoded = $candidate;
                    break;
                }
            }
        }

        if (! is_string($encoded) || $encoded === '') {
            throw new RuntimeException('Gemini image n’a renvoyé aucune image encodée exploitable.');
        }

        $bytes = base64_decode($encoded, true);
        if (! is_string($bytes) || $bytes === '') {
            throw new RuntimeException('Gemini image a renvoyé une image base64 invalide.');
        }

        return ['bytes' => $bytes, 'extension' => 'jpg', 'mime' => 'image/jpeg'];
    }

    private function normalizedImageSize(): string
    {
        if ($this->model === 'gemini-3.1-flash-lite-image') {
            return '1K';
        }

        $size = strtoupper(trim($this->imageSize));
        return in_array($size, ['1K', '2K', '4K'], true) ? $size : '1K';
    }

    private function aspectRatioFor(string $size): string
    {
        return match (trim($size)) {
            '1536x1024', '1792x1024', '16:9' => '16:9',
            '1024x1536', '1024x1792', '9:16' => '9:16',
            default => '1:1',
        };
    }
}
