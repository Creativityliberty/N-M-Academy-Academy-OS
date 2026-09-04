<?php

declare(strict_types=1);
namespace App\Tutor\Providers;
use App\Tutor\Contracts\EmbeddingProvider;
use Illuminate\Support\Facades\Http;
use RuntimeException;
class OpenAiEmbeddingProvider implements EmbeddingProvider
{
    public function __construct(private readonly string $apiKey, private readonly string $model, private readonly string $baseUrl, private readonly int $dimensions) {}
    public function name(): string { return 'openai'; }
    public function model(): string { return $this->model; }
    public function configured(): bool { return trim($this->apiKey) !== ''; }
    public function embed(string $text): array
    {
        $response = Http::withToken($this->apiKey)->acceptJson()->asJson()->timeout(60)->retry(2, 300)->post(rtrim($this->baseUrl,'/').'/embeddings', [
            'model'=>$this->model,
            'input'=>$text,
            'dimensions'=>$this->dimensions,
            'encoding_format'=>'float',
        ]);
        $response->throw();
        $embedding = $response->json('data.0.embedding');
        if (! is_array($embedding) || count($embedding) !== $this->dimensions) {
            throw new RuntimeException('Embedding OpenAI invalide ou dimension inattendue.');
        }
        return array_map('floatval', array_values($embedding));
    }
}
