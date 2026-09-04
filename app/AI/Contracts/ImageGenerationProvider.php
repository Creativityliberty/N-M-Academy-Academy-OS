<?php

declare(strict_types=1);

namespace App\AI\Contracts;

interface ImageGenerationProvider
{
    public function name(): string;
    public function model(): string;

    /** @return array{bytes:string,extension:string,mime:string} */
    public function generate(string $prompt, string $size): array;
}
