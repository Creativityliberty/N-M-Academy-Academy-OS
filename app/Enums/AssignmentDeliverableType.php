<?php

declare(strict_types=1);

namespace App\Enums;

enum AssignmentDeliverableType: string
{
    case Text = 'text';
    case Link = 'link';
    case File = 'file';
    case Mixed = 'mixed';
}
