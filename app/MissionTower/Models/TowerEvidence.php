<?php

declare(strict_types=1);

namespace App\MissionTower\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TowerEvidence extends Model
{
    protected $table = 'tower_evidence';

    protected $fillable = [
        'evidence_uuid', 'mission_id', 'run_id', 'step_id', 'type', 'status', 'source', 'receipt_id', 'summary', 'payload', 'recorded_at',
    ];

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'recorded_at' => 'datetime',
        ];
    }

    public function mission(): BelongsTo
    {
        return $this->belongsTo(TowerMission::class, 'mission_id');
    }

    public function run(): BelongsTo
    {
        return $this->belongsTo(TowerRun::class, 'run_id');
    }

    public function step(): BelongsTo
    {
        return $this->belongsTo(TowerMissionStep::class, 'step_id');
    }
}
