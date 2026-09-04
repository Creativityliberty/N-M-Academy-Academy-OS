<?php

declare(strict_types=1);

namespace App\MissionTower\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TowerRun extends Model
{
    protected $table = 'tower_runs';

    protected $fillable = [
        'mission_id', 'triggered_by', 'status', 'attempt', 'summary', 'error_message', 'started_at', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function mission(): BelongsTo
    {
        return $this->belongsTo(TowerMission::class, 'mission_id');
    }

    public function trigger(): BelongsTo
    {
        return $this->belongsTo(User::class, 'triggered_by');
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(TowerApproval::class, 'run_id');
    }

    public function evidence(): HasMany
    {
        return $this->hasMany(TowerEvidence::class, 'run_id')->latest('recorded_at');
    }
}
