<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Contracts\AcademyGateway;
use RuntimeException;

class TowerToolCatalog
{
    public function __construct(private readonly AcademyGateway $academy) {}

    /** @return array<string, array<string, mixed>> */
    public function keyed(): array
    {
        $catalog = [];
        foreach ($this->academy->tools() as $tool) {
            $name = (string) ($tool['name'] ?? '');
            if ($name === '') {
                continue;
            }
            $meta = is_array($tool['_meta'] ?? null) ? $tool['_meta'] : [];
            $catalog[$name] = [
                'name' => $name,
                'title' => (string) ($tool['title'] ?? $name),
                'description' => (string) ($tool['description'] ?? ''),
                'risk' => (string) ($meta['com.numtema.academy/risk'] ?? 'read'),
                'scope' => (string) ($meta['com.numtema.academy/scope'] ?? 'academy'),
                'inputSchema' => is_array($tool['inputSchema'] ?? null) ? $tool['inputSchema'] : [],
                'annotations' => is_array($tool['annotations'] ?? null) ? $tool['annotations'] : [],
            ];
        }

        return $catalog;
    }

    /** @return array<string, mixed> */
    public function get(string $name): array
    {
        $tool = $this->keyed()[$name] ?? null;
        if (! is_array($tool)) {
            throw new RuntimeException("Tower MCP token cannot access tool '{$name}'.");
        }

        return $tool;
    }
}
