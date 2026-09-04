<?php

declare(strict_types=1);

namespace App\Data;

final readonly class LearningAccessDecision
{
    /** @param list<string> $reasons */
    public function __construct(
        public bool $allowed,
        public array $reasons = [],
        public ?string $unlockAt = null,
    ) {}

    /** @return array{allowed:bool,reasons:list<string>,unlockAt:?string} */
    public function toArray(): array
    {
        return [
            'allowed' => $this->allowed,
            'reasons' => $this->reasons,
            'unlockAt' => $this->unlockAt,
        ];
    }
}
