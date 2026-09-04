<?php

declare(strict_types=1);

namespace App\Enums;

enum PlanIntervalEnum: string
{
    case Month = 'month';
    case Year = 'year';

    public function label(): string
    {
        return match ($this) {
            self::Month => 'Mensuel',
            self::Year => 'Annuel',
        };
    }
}
