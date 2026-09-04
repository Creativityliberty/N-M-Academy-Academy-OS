<?php

declare(strict_types=1);
namespace App\Tutor;
class TutorUsageEstimator
{
    public function tokens(string $text): int { return max(1,(int)ceil(mb_strlen($text)/4)); }
    public function costCents(int $inputTokens,int $outputTokens): int
    {
        $in=(int)config('academy-tutor.cost.input_per_million_cents',0);
        $out=(int)config('academy-tutor.cost.output_per_million_cents',0);
        return (int)ceil(($inputTokens*$in + $outputTokens*$out)/1_000_000);
    }
}
