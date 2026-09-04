<?php

declare(strict_types=1);

namespace App\AI;

use App\AI\Contracts\AiProvider;
use App\Models\User;

interface AcademyAiCapability
{
    public function name(): string;

    public function label(): string;

    public function mode(): string;

    public function risk(): string;

    public function canApply(): bool;

    /** @return array<string, mixed> */
    public function execute(User $trainer, string $prompt, array $input, AiProvider $provider): array;
}
