<?php

declare(strict_types=1);

namespace App\Enums;

enum AssessmentKind: string
{
    case Quiz = 'quiz';
    case Assessment = 'assessment';

    public function label(): string
    {
        return match ($this) {
            self::Quiz => 'Quiz',
            self::Assessment => 'Évaluation',
        };
    }
}
