<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use Illuminate\Support\Str;

class TowerMemoryPolicy
{
    private const CATEGORIES = ['preference', 'decision', 'goal', 'constraint', 'result', 'context'];
    private const SCOPES = ['academy', 'thread'];

    /** @param array<string,mixed> $candidate @return array<string,mixed>|null */
    public function sanitizeCandidate(array $candidate): ?array
    {
        $category = strtolower(trim((string) ($candidate['category'] ?? '')));
        $scope = strtolower(trim((string) ($candidate['scope'] ?? 'academy')));
        $content = trim((string) ($candidate['content'] ?? ''));
        $rawKey = trim((string) ($candidate['key'] ?? ''));

        if (! in_array($category, self::CATEGORIES, true) || ! in_array($scope, self::SCOPES, true) || $content === '') {
            return null;
        }

        $content = mb_substr($content, 0, 4000);
        if ($this->containsSecretMaterial($content)) {
            return null;
        }

        $key = Str::slug(mb_substr($rawKey, 0, 140));
        if ($key === '') {
            $key = $category.'-'.substr(hash('sha256', mb_strtolower($content)), 0, 24);
        }

        return [
            'key' => $key,
            'category' => $category,
            'scope' => $scope,
            'content' => $content,
            'importance' => max(1, min(5, (int) ($candidate['importance'] ?? 3))),
        ];
    }

    public function redactForMemory(string $text): string
    {
        $patterns = [
            '/\bsk-[A-Za-z0-9_-]{16,}\b/u',
            '/\b(?:api[_-]?key|secret|password|bearer|authorization|requestState)\s*[:=]\s*[^\s,;]+/iu',
            '/\b(?:OPENAI_API_KEY|DEEPSEEK_API_KEY|MCP_TOKEN|TOWER_ACADEMY_MCP_TOKEN|STRIPE_SECRET)\s*[:=]\s*[^\s,;]+/iu',
        ];

        return preg_replace($patterns, '[REDACTED]', $text) ?? $text;
    }

    private function containsSecretMaterial(string $content): bool
    {
        if ($this->redactForMemory($content) !== $content) {
            return true;
        }

        return (bool) preg_match('/\b(?:MCP|Stripe|OpenAI|DeepSeek)\s+(?:token|secret|api\s*key)\b/iu', $content);
    }
}
