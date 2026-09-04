<?php

declare(strict_types=1);

namespace App\MissionTower\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TowerMissionStep extends Model
{
    protected $table = 'tower_mission_steps';

    protected $fillable = [
        'mission_id', 'position', 'title', 'tool', 'risk', 'arguments', 'status', 'result', 'error_message', 'started_at', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'arguments' => 'array',
            'result' => 'array',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function mission(): BelongsTo
    {
        return $this->belongsTo(TowerMission::class, 'mission_id');
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(TowerApproval::class, 'step_id');
    }

    public function evidence(): HasMany
    {
        return $this->hasMany(TowerEvidence::class, 'step_id');
    }
}
