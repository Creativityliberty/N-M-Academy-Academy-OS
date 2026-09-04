<?php

declare(strict_types=1);
namespace App\Tutor;
class TextChunker
{
    /** @return list<string> */
    public function chunk(string $text, int $maxChars = 1600, int $overlap = 180): array
    {
        $text = trim(preg_replace('/\R{3,}/u', "\n\n", $text) ?? $text);
        if ($text === '') return [];
        $chunks=[]; $start=0; $length=mb_strlen($text);
        while ($start < $length) {
            $slice = mb_substr($text, $start, $maxChars);
            if ($start + $maxChars < $length) {
                $cut = max(mb_strrpos($slice, "\n\n") ?: 0, mb_strrpos($slice, '. ') ?: 0);
                if ($cut > (int) ($maxChars * .55)) $slice = mb_substr($slice, 0, $cut + 1);
            }
            $slice = trim($slice);
            if ($slice !== '') $chunks[]=$slice;
            $advance = max(1, mb_strlen($slice) - $overlap);
            $start += $advance;
        }
        return array_values(array_unique($chunks));
    }
}
