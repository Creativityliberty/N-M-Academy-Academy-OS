<?php

declare(strict_types=1);

namespace App\AI\Providers;

use App\AI\Contracts\AiProvider;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class DeepSeekResponsesProvider implements AiProvider
{
    public function __construct(
        private readonly string $apiKey,
        private readonly string $model,
        private readonly string $baseUrl,
        private readonly int $timeout,
        private readonly string $reasoningEffort = 'high',
    ) {}

    public function name(): string
    {
        return 'deepseek';
    }

    public function model(): string
    {
        return $this->model;
    }

    public function text(string $system, string $prompt): string
    {
        $payload = [
            'model' => $this->model,
            'input' => [
                ['role' => 'system', 'content' => $system],
                ['role' => 'user', 'content' => $prompt],
            ],
            'reasoning' => [
                'effort' => $this->normalizedReasoningEffort(),
            ],
        ];

        return $this->extractOutputText($this->request($payload));
    }

    public function structured(string $system, string $prompt, string $schemaName, array $schema): array
    {
        $payload = [
            'model' => $this->model,
            'input' => [
                ['role' => 'system', 'content' => $system],
                ['role' => 'user', 'content' => $prompt],
            ],
            'reasoning' => [
                'effort' => $this->normalizedReasoningEffort(),
            ],
            'text' => [
                'format' => [
                    'type' => 'json_schema',
                    'name' => $schemaName,
                    'schema' => $schema,
                ],
            ],
        ];

        $text = $this->extractOutputText($this->request($payload));
        $decoded = json_decode($text, true);

        if (! is_array($decoded)) {
            throw new RuntimeException('DeepSeek a renvoyé une sortie structurée invalide.');
        }

        return $decoded;
    }

    /** @param array<string, mixed> $payload */
    private function request(array $payload): array
    {
        $response = Http::withToken($this->apiKey)
            ->acceptJson()
            ->asJson()
            ->timeout($this->timeout)
            ->retry(2, 350)
            ->post($this->baseUrl.'/responses', $payload);

        $response->throw();

        return $response->json();
    }

    private function normalizedReasoningEffort(): string
    {
        $effort = strtolower(trim($this->reasoningEffort));

        return in_array($effort, ['none', 'low', 'high', 'max'], true) ? $effort : 'high';
    }

    /** @param array<string, mixed> $response */
    private function extractOutputText(array $response): string
    {
        $parts = [];

        foreach (($response['output'] ?? []) as $item) {
            if (! is_array($item)) {
                continue;
            }

            foreach (($item['content'] ?? []) as $content) {
                if (! is_array($content) || ($content['type'] ?? null) !== 'output_text') {
                    continue;
                }

                if (isset($content['text']) && is_string($content['text'])) {
                    $parts[] = $content['text'];
                }
            }
        }

        $text = trim(implode("\n", $parts));

        if ($text === '') {
            throw new RuntimeException('DeepSeek n’a renvoyé aucun texte exploitable.');
        }

        return $text;
    }
}
