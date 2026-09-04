<?php

declare(strict_types=1);

namespace App\Enums;

enum AssignmentKind: string
{
    case Assignment = 'assignment';
    case Project = 'project';
}
