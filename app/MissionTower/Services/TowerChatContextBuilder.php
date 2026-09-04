<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerApproval;
use App\MissionTower\Models\TowerInsight;
use App\MissionTower\Models\TowerMission;
use App\Models\User;

class TowerChatContextBuilder
{
    public function __construct(private readonly TowerMemoryRetriever $memory) {}

    /** @return array<string, mixed> */
    public function build(User $user, string $query = '', ?\App\MissionTower\Models\TowerChatThread $thread = null): array
    {
        return [
            'durable_memory' => $this->memory->retrieve($user, $query, $thread),
            'open_insights' => TowerInsight::query()
                ->where('owner_id', $user->id)
                ->whereIn('status', ['open', 'mission_created'])
                ->orderByRaw("CASE severity WHEN 'critical' THEN 1 WHEN 'warning' THEN 2 ELSE 3 END")
                ->latest('last_seen_at')
                ->limit(8)
                ->get(['id', 'title', 'summary', 'severity', 'domain', 'mission_id'])
                ->map(fn (TowerInsight $item): array => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'summary' => $item->summary,
                    'severity' => $item->severity,
                    'domain' => $item->domain,
                    'mission_id' => $item->mission_id,
                ])->all(),
            'pending_approvals' => TowerApproval::query()
                ->where('requested_for_id', $user->id)
                ->where('status', 'pending')
                ->latest()
                ->limit(8)
                ->get(['id', 'mission_id', 'tool', 'risk', 'message', 'expires_at'])
                ->map(fn (TowerApproval $item): array => [
                    'id' => $item->id,
                    'mission_id' => $item->mission_id,
                    'tool' => $item->tool,
                    'risk' => $item->risk,
                    'message' => $item->message,
                    'expires_at' => $item->expires_at?->toIso8601String(),
                ])->all(),
            'recent_missions' => TowerMission::query()
                ->where('owner_id', $user->id)
                ->latest()
                ->limit(6)
                ->get(['id', 'title', 'status', 'priority', 'source'])
                ->map(fn (TowerMission $item): array => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'status' => $item->status,
                    'priority' => $item->priority,
                    'source' => $item->source,
                ])->all(),
        ];
    }
}
