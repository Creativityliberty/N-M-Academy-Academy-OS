<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerInsight;
use App\MissionTower\Models\TowerMission;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class InsightMissionFactory
{
    public function __construct(private readonly TowerToolCatalog $tools) {}

    public function create(TowerInsight $insight, User $user): TowerMission
    {
        return DB::transaction(function () use ($insight, $user): TowerMission {
            $lockedInsight = TowerInsight::query()->whereKey($insight->id)->lockForUpdate()->firstOrFail();
            if ($lockedInsight->mission_id) {
                return $lockedInsight->mission()->firstOrFail();
            }

            $blueprint = (array) $lockedInsight->mission_blueprint;
            $steps = array_values(array_filter((array) ($blueprint['steps'] ?? []), 'is_array'));
            if ($steps === []) {
                throw new RuntimeException('Cet insight ne contient pas de mission recommandée.');
            }

            $catalog = $this->tools->keyed();
            foreach ($steps as $step) {
                $tool = (string) ($step['tool'] ?? '');
                if ($tool === '' || ! isset($catalog[$tool]) || ($catalog[$tool]['scope'] ?? 'academy') !== 'academy') {
                    throw new RuntimeException("Le tool MCP {$tool} n'est pas disponible pour le token Mission Tower.");
                }
            }

            $mission = TowerMission::create([
                'owner_id' => $lockedInsight->owner_id,
                'title' => mb_substr((string) ($blueprint['title'] ?? $lockedInsight->title), 0, 180),
                'objective' => mb_substr((string) ($blueprint['objective'] ?? $lockedInsight->summary), 0, 10000),
                'priority' => in_array(($blueprint['priority'] ?? 'normal'), ['low', 'normal', 'high'], true) ? $blueprint['priority'] : 'normal',
                'status' => 'draft',
                'source' => 'observatory',
                'metadata' => ['insight_id' => $lockedInsight->id, 'created_by' => $user->id, 'rule' => $lockedInsight->rule],
            ]);

            foreach ($steps as $index => $step) {
                $definition = $catalog[$step['tool']];
                $mission->steps()->create([
                    'position' => $index + 1,
                    'title' => $definition['title'],
                    'tool' => $step['tool'],
                    'risk' => $definition['risk'],
                    'arguments' => (array) ($step['arguments'] ?? []),
                    'status' => 'pending',
                ]);
            }

            $lockedInsight->update(['mission_id' => $mission->id, 'status' => 'mission_created']);

            return $mission;
        });
    }
}
