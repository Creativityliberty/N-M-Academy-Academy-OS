<?php

declare(strict_types=1);

namespace App\MissionTower\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TowerCompilation extends Model
{
    protected $table = 'tower_compilations';

    protected $fillable = [
        'owner_id', 'mission_id', 'status', 'provider', 'model', 'prompt', 'proposal', 'warnings', 'error_message', 'applied_at',
    ];

    protected function casts(): array
    {
        return [
            'proposal' => 'array',
            'warnings' => 'array',
            'applied_at' => 'datetime',
        ];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function mission(): BelongsTo
    {
        return $this->belongsTo(TowerMission::class, 'mission_id');
    }
}
