<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use DateTimeImmutable;
use InvalidArgumentException;

class CompiledMissionValidator
{
    public function __construct(private readonly TowerToolCatalog $tools) {}

    /** @param array<string, mixed> $raw @return array<string, mixed> */
    public function normalizeModelOutput(array $raw): array
    {
        $steps = [];
        foreach ((array) ($raw['steps'] ?? []) as $index => $step) {
            if (! is_array($step)) {
                throw new InvalidArgumentException('Le compilateur IA a renvoyé une étape invalide.');
            }

            $argumentsJson = (string) ($step['arguments_json'] ?? '{}');
            $arguments = json_decode($argumentsJson, true);
            if (! is_array($arguments)) {
                throw new InvalidArgumentException('Les arguments de l’étape '.($index + 1).' ne sont pas un objet JSON valide.');
            }

            $steps[] = [
                'tool' => (string) ($step['tool'] ?? ''),
                'arguments' => $arguments,
                'reason' => trim((string) ($step['reason'] ?? '')),
            ];
        }

        return $this->validateCanonical([
            'title' => trim((string) ($raw['title'] ?? '')),
            'objective' => trim((string) ($raw['objective'] ?? '')),
            'priority' => (string) ($raw['priority'] ?? 'normal'),
            'summary' => trim((string) ($raw['summary'] ?? '')),
            'assumptions' => array_values(array_filter((array) ($raw['assumptions'] ?? []), 'is_string')),
            'steps' => $steps,
        ]);
    }

    /** @param array<string, mixed> $proposal @return array<string, mixed> */
    public function validateCanonical(array $proposal): array
    {
        $title = trim((string) ($proposal['title'] ?? ''));
        $objective = trim((string) ($proposal['objective'] ?? ''));
        if (mb_strlen($title) < 3 || mb_strlen($title) > 180) {
            throw new InvalidArgumentException('Le titre compilé doit contenir entre 3 et 180 caractères.');
        }
        if (mb_strlen($objective) < 10 || mb_strlen($objective) > 10000) {
            throw new InvalidArgumentException('L’objectif compilé doit contenir entre 10 et 10000 caractères.');
        }

        $priority = (string) ($proposal['priority'] ?? 'normal');
        if (! in_array($priority, ['low', 'normal', 'high'], true)) {
            throw new InvalidArgumentException('Priorité de mission invalide.');
        }

        $catalog = array_filter(
            $this->tools->keyed(),
            fn (array $tool): bool => ($tool['scope'] ?? 'academy') === 'academy',
        );
        $steps = array_values(array_filter((array) ($proposal['steps'] ?? []), 'is_array'));
        $maxSteps = max(1, (int) config('mission-tower.limits.max_mission_steps', 24));
        if ($steps === [] || count($steps) > $maxSteps) {
            throw new InvalidArgumentException("Une mission compilée doit contenir entre 1 et {$maxSteps} étapes.");
        }

        $riskCounts = ['read' => 0, 'write' => 0, 'sensitive' => 0];
        $normalizedSteps = [];
        foreach ($steps as $index => $step) {
            $toolName = (string) ($step['tool'] ?? '');
            if ($toolName === '' || ! isset($catalog[$toolName])) {
                throw new InvalidArgumentException("Le tool MCP '{$toolName}' proposé à l’étape ".($index + 1).' n’est pas accessible au token Tower.');
            }

            $definition = $catalog[$toolName];
            $arguments = is_array($step['arguments'] ?? null) ? $step['arguments'] : [];
            $this->validateValue($arguments, (array) ($definition['inputSchema'] ?? []), "steps.{$index}.arguments");

            // Risk is always re-derived from the live MCP catalog, never trusted from AI output.
            $risk = (string) ($definition['risk'] ?? 'read');
            if (! array_key_exists($risk, $riskCounts)) {
                throw new InvalidArgumentException("Niveau de risque MCP inconnu pour {$toolName}.");
            }
            $riskCounts[$risk]++;

            $normalizedSteps[] = [
                'position' => $index + 1,
                'title' => (string) ($definition['title'] ?? $toolName),
                'tool' => $toolName,
                'risk' => $risk,
                'arguments' => $arguments,
                'reason' => mb_substr(trim((string) ($step['reason'] ?? '')), 0, 1000),
                'requiresApproval' => $risk !== 'read',
                'destructive' => (bool) (($definition['annotations']['destructiveHint'] ?? false)),
                'openWorld' => (bool) (($definition['annotations']['openWorldHint'] ?? false)),
            ];
        }

        $assumptions = [];
        foreach ((array) ($proposal['assumptions'] ?? []) as $assumption) {
            if (is_string($assumption) && trim($assumption) !== '') {
                $assumptions[] = mb_substr(trim($assumption), 0, 500);
            }
            if (count($assumptions) >= 12) {
                break;
            }
        }

        return [
            'title' => $title,
            'objective' => $objective,
            'priority' => $priority,
            'summary' => mb_substr(trim((string) ($proposal['summary'] ?? '')), 0, 4000),
            'assumptions' => $assumptions,
            'steps' => $normalizedSteps,
            'riskSummary' => $riskCounts,
            'approvalCount' => $riskCounts['write'] + $riskCounts['sensitive'],
        ];
    }

    /** @param mixed $value @param array<string, mixed> $schema */
    private function validateValue(mixed $value, array $schema, string $path): void
    {
        $type = $schema['type'] ?? null;
        if ($type === 'object') {
            if (! is_array($value) || ($value !== [] && array_is_list($value))) {
                throw new InvalidArgumentException("{$path} doit être un objet.");
            }
            $properties = is_array($schema['properties'] ?? null) ? $schema['properties'] : [];
            $required = is_array($schema['required'] ?? null) ? $schema['required'] : [];
            foreach ($required as $key) {
                if (! array_key_exists((string) $key, $value)) {
                    throw new InvalidArgumentException("{$path}.{$key} est obligatoire.");
                }
            }
            if (($schema['additionalProperties'] ?? true) === false) {
                foreach (array_keys($value) as $key) {
                    if (! array_key_exists((string) $key, $properties)) {
                        throw new InvalidArgumentException("{$path}.{$key} n'est pas autorisé par le schema MCP.");
                    }
                }
            }
            foreach ($value as $key => $child) {
                if (isset($properties[$key]) && is_array($properties[$key])) {
                    $this->validateValue($child, $properties[$key], "{$path}.{$key}");
                }
            }
            return;
        }

        if ($type === 'array') {
            if (! is_array($value) || ! array_is_list($value)) {
                throw new InvalidArgumentException("{$path} doit être une liste.");
            }
            $itemSchema = is_array($schema['items'] ?? null) ? $schema['items'] : [];
            foreach ($value as $index => $child) {
                $this->validateValue($child, $itemSchema, "{$path}.{$index}");
            }
            return;
        }

        $validType = match ($type) {
            'string' => is_string($value),
            'integer' => is_int($value),
            'number' => is_int($value) || is_float($value),
            'boolean' => is_bool($value),
            null => true,
            default => false,
        };
        if (! $validType) {
            throw new InvalidArgumentException("{$path} ne respecte pas le type MCP {$type}.");
        }

        if (isset($schema['enum']) && is_array($schema['enum']) && ! in_array($value, $schema['enum'], true)) {
            throw new InvalidArgumentException("{$path} contient une valeur hors enum MCP.");
        }
        if ((is_int($value) || is_float($value)) && isset($schema['minimum']) && $value < $schema['minimum']) {
            throw new InvalidArgumentException("{$path} est inférieur au minimum MCP.");
        }
        if ((is_int($value) || is_float($value)) && isset($schema['maximum']) && $value > $schema['maximum']) {
            throw new InvalidArgumentException("{$path} dépasse le maximum MCP.");
        }
        if (is_string($value)) {
            if (isset($schema['minLength']) && mb_strlen($value) < (int) $schema['minLength']) {
                throw new InvalidArgumentException("{$path} est trop court.");
            }
            if (isset($schema['maxLength']) && mb_strlen($value) > (int) $schema['maxLength']) {
                throw new InvalidArgumentException("{$path} est trop long.");
            }
            $format = $schema['format'] ?? null;
            if ($format === 'email' && filter_var($value, FILTER_VALIDATE_EMAIL) === false) {
                throw new InvalidArgumentException("{$path} doit être un email valide.");
            }
            if ($format === 'uri' && filter_var($value, FILTER_VALIDATE_URL) === false) {
                throw new InvalidArgumentException("{$path} doit être une URL valide.");
            }
            if ($format === 'date-time') {
                try {
                    new DateTimeImmutable($value);
                } catch (\Throwable) {
                    throw new InvalidArgumentException("{$path} doit être une date ISO valide.");
                }
            }
        }
    }
}
