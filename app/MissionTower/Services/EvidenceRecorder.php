<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerEvidence;
use App\MissionTower\Models\TowerMission;
use App\MissionTower\Models\TowerMissionStep;
use App\MissionTower\Models\TowerRun;
use Illuminate\Support\Str;

class EvidenceRecorder
{
    /** @param array<string, mixed> $payload */
    public function record(
        TowerMission $mission,
        ?TowerRun $run,
        ?TowerMissionStep $step,
        string $type,
        string $status,
        string $summary,
        array $payload = [],
        ?string $receiptId = null,
        string $source = 'academy_mcp',
    ): TowerEvidence {
        return TowerEvidence::create([
            'evidence_uuid' => (string) Str::uuid(),
            'mission_id' => $mission->id,
            'run_id' => $run?->id,
            'step_id' => $step?->id,
            'type' => $type,
            'status' => $status,
            'source' => $source,
            'receipt_id' => $receiptId,
            'summary' => mb_substr($summary, 0, 4000),
            'payload' => $payload,
            'recorded_at' => now(),
        ]);
    }
}
