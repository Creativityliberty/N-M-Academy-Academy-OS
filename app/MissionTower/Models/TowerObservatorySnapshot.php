<?php

declare(strict_types=1);

namespace App\MissionTower\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TowerObservatorySnapshot extends Model
{
    protected $table = 'tower_observatory_snapshots';

    protected $fillable = ['owner_id', 'snapshot_uuid', 'status', 'sources', 'metrics', 'errors', 'captured_at'];

    protected function casts(): array
    {
        return ['sources' => 'array', 'metrics' => 'array', 'errors' => 'array', 'captured_at' => 'datetime'];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function insights(): HasMany
    {
        return $this->hasMany(TowerInsight::class, 'snapshot_id');
    }
}
