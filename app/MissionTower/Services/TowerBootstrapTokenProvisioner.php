<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\Mcp\AcademyMcpToolRegistry;
use App\Models\AcademyMcpToken;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TowerBootstrapTokenProvisioner
{
    public function __construct(private readonly AcademyMcpToolRegistry $tools) {}

    public function provision(User $owner, string $plain): AcademyMcpToken
    {
        $plain = trim($plain);
        if ($plain === '') {
            throw new \InvalidArgumentException('Tower MCP bootstrap token cannot be empty.');
        }

        $hash = hash('sha256', $plain);
        $existing = AcademyMcpToken::query()->where('token_hash', $hash)->first();
        if ($existing) {
            return $existing;
        }

        $abilities = [];
        foreach ($this->tools->all() as $name => $tool) {
            if (($tool['risk'] ?? AcademyMcpToolRegistry::SENSITIVE) === AcademyMcpToolRegistry::SENSITIVE) {
                continue;
            }
            if ($this->tools->allowedForUser($name, $owner)) {
                $abilities[] = $name;
            }
        }

        return DB::transaction(function () use ($owner, $hash, $abilities): AcademyMcpToken {
            AcademyMcpToken::query()
                ->where('user_id', $owner->id)
                ->where('name', 'Mission Tower Bootstrap')
                ->whereNull('revoked_at')
                ->update(['revoked_at' => now()]);

            return AcademyMcpToken::create([
                'user_id' => $owner->id,
                'name' => 'Mission Tower Bootstrap',
                'token_hash' => $hash,
                'abilities' => $abilities,
                'expires_at' => null,
            ]);
        });
    }
}
