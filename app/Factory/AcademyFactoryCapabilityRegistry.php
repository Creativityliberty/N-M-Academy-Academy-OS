<?php

declare(strict_types=1);

namespace App\Factory;

use InvalidArgumentException;

class AcademyFactoryCapabilityRegistry
{
    private const PROFILES = [
        'essential' => [
            'label' => 'Academy Essential',
            'description' => 'Cours, vente, évaluations, complétion et certificats sans les briques avancées.',
            'features' => [
                'community' => false,
                'events' => false,
                'ai' => false,
                'tutor' => false,
                'sales' => true,
                'pages' => false,
                'mcp' => false,
                'tower' => false,
                'assessments' => true,
                'assignments' => false,
                'completion' => true,
                'certificates' => true,
                'drip' => true,
            ],
        ],
        'creator' => [
            'label' => 'Academy Creator',
            'description' => 'Expérience créateur complète avec communauté, IA, vente et Learning Primitives.',
            'features' => [
                'community' => true,
                'events' => true,
                'ai' => true,
                'tutor' => true,
                'sales' => true,
                'pages' => true,
                'mcp' => false,
                'tower' => false,
                'assessments' => true,
                'assignments' => true,
                'completion' => true,
                'certificates' => true,
                'drip' => true,
            ],
        ],
        'pro' => [
            'label' => 'Academy Pro',
            'description' => 'Toutes les capacités Academy OS, y compris MCP et Mission Tower.',
            'features' => [
                'community' => true,
                'events' => true,
                'ai' => true,
                'tutor' => true,
                'sales' => true,
                'pages' => true,
                'mcp' => true,
                'tower' => true,
                'assessments' => true,
                'assignments' => true,
                'completion' => true,
                'certificates' => true,
                'drip' => true,
            ],
        ],
    ];

    public function all(): array
    {
        return collect(self::PROFILES)
            ->map(fn (array $profile, string $key) => ['key' => $key, ...$profile])
            ->values()
            ->all();
    }

    public function get(string $key): array
    {
        if (! isset(self::PROFILES[$key])) {
            throw new InvalidArgumentException("Profil de capacités Academy inconnu : {$key}");
        }

        return ['key' => $key, ...self::PROFILES[$key]];
    }

    /** @param array<string,mixed> $overrides */
    public function resolveFeatures(string $profileKey, array $overrides = []): array
    {
        $features = array_merge($this->get($profileKey)['features'], $overrides);
        $features = array_map(static fn ($value): bool => (bool) $value, $features);

        if (! ($features['ai'] ?? false)) {
            $features['tutor'] = false;
        }
        if (! ($features['mcp'] ?? false)) {
            $features['tower'] = false;
        }
        if (! ($features['completion'] ?? false)) {
            $features['certificates'] = false;
        }

        return $features;
    }
}
