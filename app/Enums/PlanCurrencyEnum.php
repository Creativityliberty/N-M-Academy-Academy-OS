<?php

declare(strict_types=1);

namespace App\Enums;

enum PlanCurrencyEnum: string
{
    case Eur = 'eur';
    case Usd = 'usd';
    case Gbp = 'gbp';

    public function label(): string
    {
        return match ($this) {
            self::Eur => 'Euro (€)',
            self::Usd => 'Dollar ($)',
            self::Gbp => 'Livre (£)',
        };
    }

    public function symbol(): string
    {
        return match ($this) {
            self::Eur => '€',
            self::Usd => '$',
            self::Gbp => '£',
        };
    }
}
