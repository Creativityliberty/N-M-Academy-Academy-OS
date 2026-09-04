<?php

declare(strict_types=1);
namespace App\Tutor\Providers;
use App\Tutor\Contracts\EmbeddingProvider;
class DisabledEmbeddingProvider implements EmbeddingProvider
{
    public function name(): string { return 'disabled'; }
    public function model(): string { return 'none'; }
    public function configured(): bool { return false; }
    public function embed(string $text): array { return []; }
}
