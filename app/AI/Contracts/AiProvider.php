<?php

declare(strict_types=1);

namespace App\AI\Contracts;

interface AiProvider
{
    public function name(): string;

    public function model(): string;

    public function text(string $system, string $prompt): string;

    /** @return array<string, mixed> */
    public function structured(string $system, string $prompt, string $schemaName, array $schema): array;
}
