<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\Models\AcademyMcpToken;
use App\Models\User;
use RuntimeException;

class TowerTokenOwnerResolver
{
    public function resolve(): User
    {
        $plain = (string) config('mission-tower.academy_mcp.token');
        if ($plain === '') {
            throw new RuntimeException('Mission Tower MCP token is not configured.');
        }

        $token = AcademyMcpToken::query()->with('user')->where('token_hash', hash('sha256', $plain))->first();
        if (! $token || ! $token->isActive() || ! $token->user) {
            throw new RuntimeException('Mission Tower MCP token cannot be resolved to an active Academy user.');
        }

        return $token->user;
    }
}
