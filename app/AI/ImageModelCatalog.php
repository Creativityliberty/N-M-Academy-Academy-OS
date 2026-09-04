<?php

declare(strict_types=1);

namespace App\AI;

final class ImageModelCatalog
{
    /** @return array<int,array{id:string,label:string,tier:string,max_size:string,description:string}> */
    public function gemini(): array
    {
        return [
            [
                'id' => 'gemini-3.1-flash-lite-image',
                'label' => 'Nano Banana 2 Lite',
                'tier' => 'default',
                'max_size' => '1K',
                'description' => 'Rapide et économique pour covers et thumbnails à fort volume.',
            ],
            [
                'id' => 'gemini-3.1-flash-image',
                'label' => 'Nano Banana 2',
                'tier' => 'premium',
                'max_size' => '4K',
                'description' => 'Modèle généraliste pour qualité, cohérence et rendu de texte plus fiable.',
            ],
            [
                'id' => 'gemini-3-pro-image',
                'label' => 'Nano Banana Pro',
                'tier' => 'ultra',
                'max_size' => '4K',
                'description' => 'Direction artistique complexe, précision et cohérence de marque avancée.',
            ],
        ];
    }

    /** @return array<int,array{id:string,label:string,tier:string,max_size:string,description:string}> */
    public function forProvider(string $provider): array
    {
        if (strtolower($provider) === 'gemini') {
            return $this->gemini();
        }

        if (strtolower($provider) === 'openai') {
            $model = trim((string) config('academy-ai.openai.image_model', 'gpt-image-2')) ?: 'gpt-image-2';
            return [[
                'id' => $model,
                'label' => $model,
                'tier' => 'configured',
                'max_size' => 'provider',
                'description' => 'Modèle image OpenAI configuré pour cette Academy.',
            ]];
        }

        return [];
    }

    public function isAllowed(string $provider, string $model): bool
    {
        return collect($this->forProvider($provider))->contains(fn (array $item): bool => $item['id'] === $model);
    }

    public function maxSize(string $provider, string $model): string
    {
        $item = collect($this->forProvider($provider))->first(fn (array $item): bool => $item['id'] === $model);
        return (string) ($item['max_size'] ?? '1K');
    }
}
