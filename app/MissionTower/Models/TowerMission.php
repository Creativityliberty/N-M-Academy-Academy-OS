<?php

declare(strict_types=1);

namespace App\MissionTower\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TowerMission extends Model
{
    protected $table = 'tower_missions';

    protected $fillable = [
        'owner_id', 'title', 'objective', 'status', 'priority', 'source', 'metadata', 'started_at', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function steps(): HasMany
    {
        return $this->hasMany(TowerMissionStep::class, 'mission_id')->orderBy('position');
    }

    public function runs(): HasMany
    {
        return $this->hasMany(TowerRun::class, 'mission_id')->latest();
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(TowerApproval::class, 'mission_id')->latest();
    }

    public function evidence(): HasMany
    {
        return $this->hasMany(TowerEvidence::class, 'mission_id')->latest('recorded_at');
    }
}
