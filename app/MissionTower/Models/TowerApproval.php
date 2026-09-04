<?php

declare(strict_types=1);

namespace App\MissionTower\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TowerApproval extends Model
{
    protected $table = 'tower_approvals';

    protected $fillable = [
        'mission_id', 'step_id', 'run_id', 'requested_for_id', 'decided_by_id', 'tool', 'risk', 'status', 'message',
        'request_state', 'required_phrase', 'requested_schema', 'arguments', 'receipt_id', 'expires_at', 'decided_at',
    ];

    protected function casts(): array
    {
        return [
            'request_state' => 'encrypted',
            'requested_schema' => 'array',
            'arguments' => 'array',
            'expires_at' => 'datetime',
            'decided_at' => 'datetime',
        ];
    }

    public function mission(): BelongsTo
    {
        return $this->belongsTo(TowerMission::class, 'mission_id');
    }

    public function step(): BelongsTo
    {
        return $this->belongsTo(TowerMissionStep::class, 'step_id');
    }

    public function run(): BelongsTo
    {
        return $this->belongsTo(TowerRun::class, 'run_id');
    }

    public function requestedFor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_for_id');
    }

    public function decidedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'decided_by_id');
    }
}
