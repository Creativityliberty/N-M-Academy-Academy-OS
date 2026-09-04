<?php

declare(strict_types=1);
namespace App\Tutor;
use App\Tutor\Contracts\EmbeddingProvider;
use App\Tutor\Providers\DisabledEmbeddingProvider;
use App\Tutor\Providers\OpenAiEmbeddingProvider;
class EmbeddingProviderManager
{
    public function provider(): EmbeddingProvider
    {
        $name = strtolower((string) config('academy-tutor.embedding.provider', 'disabled'));
        if ($name !== 'openai') return new DisabledEmbeddingProvider;
        $key = trim((string) config('academy-ai.openai.api_key'));
        if ($key === '') return new DisabledEmbeddingProvider;
        return new OpenAiEmbeddingProvider($key, (string) config('academy-tutor.embedding.model'), (string) config('academy-ai.openai.base_url'), (int) config('academy-tutor.embedding.dimensions',1536));
    }
}
