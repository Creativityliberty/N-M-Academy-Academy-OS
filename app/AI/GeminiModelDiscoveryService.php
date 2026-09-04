<?php

declare(strict_types=1);

namespace App\AI;

use Illuminate\Support\Facades\Http;

class GeminiModelDiscoveryService
{
    public function __construct(private readonly ImageModelCatalog $catalog) {}

    /** @return array<int,array{id:string,label:string,tier:string,max_size:string,description:string}> */
    public function discover(): array
    {
        $key = trim((string) config('academy-ai.gemini.api_key'));
        if ($key === '') {
            return $this->catalog->gemini();
        }

        $baseUrl = rtrim((string) config('academy-ai.gemini.base_url', 'https://generativelanguage.googleapis.com'), '/');

        try {
            $response = Http::withHeaders(['x-goog-api-key' => $key])
                ->acceptJson()
                ->timeout(20)
                ->get($baseUrl.'/v1beta/models');
            $response->throw();

            $available = collect((array) $response->json('models'))
                ->map(fn ($item) => is_array($item) ? (string) ($item['name'] ?? '') : '')
                ->map(fn (string $name) => str_starts_with($name, 'models/') ? substr($name, 7) : $name)
                ->filter()
                ->values();

            $filtered = collect($this->catalog->gemini())
                ->filter(fn (array $item): bool => $available->contains($item['id']))
                ->values()
                ->all();

            return $filtered !== [] ? $filtered : $this->catalog->gemini();
        } catch (\Throwable $error) {
            report($error);
            return $this->catalog->gemini();
        }
    }
}
