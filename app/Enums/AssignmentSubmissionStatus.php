<?php

declare(strict_types=1);

namespace App\Enums;

enum AssignmentSubmissionStatus: string
{
    case Submitted = 'submitted';
    case ChangesRequested = 'changes_requested';
    case Approved = 'approved';
}
