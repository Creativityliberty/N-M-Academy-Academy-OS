<?php

declare(strict_types=1);

namespace App\Data;

final readonly class CompletionStatus
{
    public function __construct(
        public int $lessonsRequired,
        public int $lessonsCompleted,
        public int $assessmentsRequired,
        public int $assessmentsPassed,
        public int $assignmentsRequired,
        public int $assignmentsApproved,
        public bool $completed,
        public ?string $completedAt = null,
        public ?string $certificateUrl = null,
        public ?string $certificatePdfUrl = null,
        public bool $certificateShareEnabled = false,
        public ?string $certificateVerificationCode = null,
    ) {}

    /** @return array<string,mixed> */
    public function toArray(): array
    {
        return [
            'lessonsRequired' => $this->lessonsRequired,
            'lessonsCompleted' => $this->lessonsCompleted,
            'assessmentsRequired' => $this->assessmentsRequired,
            'assessmentsPassed' => $this->assessmentsPassed,
            'assignmentsRequired' => $this->assignmentsRequired,
            'assignmentsApproved' => $this->assignmentsApproved,
            'completed' => $this->completed,
            'completedAt' => $this->completedAt,
            'certificateUrl' => $this->certificateUrl,
            'certificatePdfUrl' => $this->certificatePdfUrl,
            'certificateShareEnabled' => $this->certificateShareEnabled,
            'certificateVerificationCode' => $this->certificateVerificationCode,
        ];
    }
}
