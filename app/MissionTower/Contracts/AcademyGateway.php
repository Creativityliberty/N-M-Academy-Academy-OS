<?php

declare(strict_types=1);

namespace App\MissionTower\Contracts;

interface AcademyGateway
{
    /** @return array<string, mixed> */
    public function discover(): array;

    /** @return array<int, array<string, mixed>> */
    public function tools(): array;

    /** @param array<string, mixed> $arguments @return array<string, mixed> */
    public function call(string $tool, array $arguments = [], ?string $requestState = null, array $inputResponses = []): array;
}
