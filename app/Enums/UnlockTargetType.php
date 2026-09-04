<?php

declare(strict_types=1);

namespace App\Enums;

enum UnlockTargetType: string
{
    case Module = 'module';
    case Lesson = 'lesson';
    case Assessment = 'assessment';
    case Assignment = 'assignment';
}
