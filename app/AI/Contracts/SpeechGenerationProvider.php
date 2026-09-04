<?php

declare(strict_types=1);

namespace App\AI\Contracts;

interface SpeechGenerationProvider
{
    public function name(): string;
    public function model(): string;

    /** @return array{bytes:string,extension:string,mime:string,voice:string} */
    public function synthesize(string $text, ?string $voice = null, ?string $instructions = null): array;
}
