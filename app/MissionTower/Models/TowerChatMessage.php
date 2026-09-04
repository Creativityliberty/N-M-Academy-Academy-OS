<?php

declare(strict_types=1);

namespace App\MissionTower\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TowerChatMessage extends Model
{
    protected $table = 'tower_chat_messages';

    protected $fillable = [
        'thread_id', 'role', 'type', 'status', 'content', 'compilation_id', 'mission_id', 'run_id', 'approval_id', 'metadata',
    ];

    protected function casts(): array
    {
        return ['metadata' => 'array'];
    }

    public function thread(): BelongsTo
    {
        return $this->belongsTo(TowerChatThread::class, 'thread_id');
    }

    public function compilation(): BelongsTo
    {
        return $this->belongsTo(TowerCompilation::class, 'compilation_id');
    }

    public function mission(): BelongsTo
    {
        return $this->belongsTo(TowerMission::class, 'mission_id');
    }

    public function run(): BelongsTo
    {
        return $this->belongsTo(TowerRun::class, 'run_id');
    }

    public function approval(): BelongsTo
    {
        return $this->belongsTo(TowerApproval::class, 'approval_id');
    }
}
