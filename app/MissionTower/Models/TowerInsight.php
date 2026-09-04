<?php

declare(strict_types=1);

namespace App\MissionTower\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TowerInsight extends Model
{
    protected $table = 'tower_insights';

    protected $fillable = [
        'owner_id', 'snapshot_id', 'fingerprint', 'rule', 'domain', 'severity', 'status', 'title', 'summary',
        'metric_key', 'current_value', 'baseline_value', 'delta_percent', 'context', 'mission_blueprint',
        'mission_id', 'first_seen_at', 'last_seen_at', 'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'current_value' => 'float', 'baseline_value' => 'float', 'delta_percent' => 'float',
            'context' => 'array', 'mission_blueprint' => 'array', 'first_seen_at' => 'datetime',
            'last_seen_at' => 'datetime', 'resolved_at' => 'datetime',
        ];
    }

    public function owner(): BelongsTo { return $this->belongsTo(User::class, 'owner_id'); }
    public function snapshot(): BelongsTo { return $this->belongsTo(TowerObservatorySnapshot::class, 'snapshot_id'); }
    public function mission(): BelongsTo { return $this->belongsTo(TowerMission::class, 'mission_id'); }
}
