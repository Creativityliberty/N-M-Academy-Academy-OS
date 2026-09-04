<?php

declare(strict_types=1);

namespace App\PageBuilder;

use InvalidArgumentException;

class PageBlockRegistry
{
    public const BLOCKS = [
        'hero' => ['variants' => ['minimal','centered','split']],
        'features' => ['variants' => ['grid','list']],
        'instructor' => ['variants' => ['profile','split']],
        'course' => ['variants' => ['featured','compact']],
        'curriculum' => ['variants' => ['accordion','timeline']],
        'testimonials' => ['variants' => ['grid','quotes']],
        'pricing' => ['variants' => ['cards','focused']],
        'faq' => ['variants' => ['accordion','list']],
        'cta' => ['variants' => ['centered','split','focused']],
        'footer' => ['variants' => ['minimal','columns']],
    ];

    public function metadata(): array
    {
        return collect(self::BLOCKS)->map(fn (array $config, string $type) => [
            'type' => $type,
            'label' => match ($type) {
                'hero' => 'Hero', 'features' => 'Bénéfices', 'instructor' => 'Formateur', 'course' => 'Formation',
                'curriculum' => 'Programme', 'testimonials' => 'Témoignages', 'pricing' => 'Tarifs', 'faq' => 'FAQ',
                'cta' => 'Appel à l’action', 'footer' => 'Footer', default => ucfirst($type),
            },
            'variants' => $config['variants'],
        ])->values()->all();
    }

    public function assertAllowed(string $type, string $variant): void
    {
        if (!isset(self::BLOCKS[$type])) {
            throw new InvalidArgumentException("Type de bloc non autorisé : {$type}");
        }
        if (!in_array($variant, self::BLOCKS[$type]['variants'], true)) {
            throw new InvalidArgumentException("Variante non autorisée pour {$type} : {$variant}");
        }
    }

    public function defaultVariant(string $type): string
    {
        if (!isset(self::BLOCKS[$type])) {
            throw new InvalidArgumentException("Type de bloc non autorisé : {$type}");
        }
        return self::BLOCKS[$type]['variants'][0];
    }

    public function normalizeVariant(string $type, ?string $variant = null): string
    {
        if (!isset(self::BLOCKS[$type])) {
            return 'default';
        }
        if ($variant !== null && in_array($variant, self::BLOCKS[$type]['variants'], true)) {
            return $variant;
        }
        return self::BLOCKS[$type]['variants'][0];
    }

    public function sanitizeSettings(string $type, array $settings): array
    {
        $allowed = match ($type) {
            'hero' => ['headline','subheadline','primary_label','primary_url','secondary_label','secondary_url','course_id'],
            'features' => ['title','description','items'],
            'instructor' => ['title','course_id'],
            'course' => ['title','course_id','description'],
            'curriculum' => ['title','course_id','show_lessons'],
            'testimonials' => ['title','items'],
            'pricing' => ['title','description','course_id','offer_ids'],
            'faq' => ['title','items'],
            'cta' => ['title','description','button_label','button_url'],
            'footer' => ['tagline','links'],
            default => [],
        };
        $clean = array_intersect_key($settings, array_flip($allowed));
        array_walk_recursive($clean, function (&$value): void {
            if (is_string($value)) {
                $value = mb_substr(trim(strip_tags($value)), 0, 12000);
            }
        });

        foreach (['primary_url','secondary_url','button_url'] as $key) {
            if (isset($clean[$key])) {
                $clean[$key] = $this->safeUrl((string) $clean[$key]);
            }
        }

        foreach (['items','links'] as $listKey) {
            if (! isset($clean[$listKey]) || ! is_array($clean[$listKey])) {
                continue;
            }
            foreach ($clean[$listKey] as &$item) {
                if (is_array($item) && array_key_exists('url', $item)) {
                    $item['url'] = $this->safeUrl((string) $item['url']);
                }
            }
        }

        return $clean;
    }

    private function safeUrl(string $value): string
    {
        $value = trim($value);
        if ($value === '' || str_starts_with($value, '#') || str_starts_with($value, '/')) {
            return $value;
        }

        $scheme = strtolower((string) parse_url($value, PHP_URL_SCHEME));
        return in_array($scheme, ['http','https','mailto'], true) ? $value : '#';
    }
}
