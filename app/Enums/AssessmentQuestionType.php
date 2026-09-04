<?php

declare(strict_types=1);

namespace App\Enums;

enum AssessmentQuestionType: string
{
    case SingleChoice = 'single_choice';
    case MultipleChoice = 'multiple_choice';
    case TrueFalse = 'true_false';

    public function label(): string
    {
        return match ($this) {
            self::SingleChoice => 'Choix unique',
            self::MultipleChoice => 'Choix multiples',
            self::TrueFalse => 'Vrai / Faux',
        };
    }
}
