<?php

declare(strict_types=1);
namespace App\Tutor\Contracts;
interface EmbeddingProvider
{
    public function name(): string;
    public function model(): string;
    public function configured(): bool;
    /** @return list<float> */
    public function embed(string $text): array;
}
