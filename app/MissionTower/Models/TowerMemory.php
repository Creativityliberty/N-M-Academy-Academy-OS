<?php

declare(strict_types=1);

namespace App\MissionTower\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TowerMemory extends Model
{
    protected $table = 'tower_memories';

    protected $fillable = [
        'memory_uuid', 'owner_id', 'thread_id', 'mission_id', 'run_id', 'source_message_id', 'supersedes_id',
        'memory_key', 'category', 'scope', 'status', 'content', 'importance', 'pinned', 'source_type', 'metadata',
        'embedding', 'access_count', 'last_accessed_at', 'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
            'pinned' => 'boolean',
            'importance' => 'integer',
            'access_count' => 'integer',
            'last_accessed_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function owner(): BelongsTo { return $this->belongsTo(User::class, 'owner_id'); }
    public function thread(): BelongsTo { return $this->belongsTo(TowerChatThread::class, 'thread_id'); }
    public function mission(): BelongsTo { return $this->belongsTo(TowerMission::class, 'mission_id'); }
    public function run(): BelongsTo { return $this->belongsTo(TowerRun::class, 'run_id'); }
    public function sourceMessage(): BelongsTo { return $this->belongsTo(TowerChatMessage::class, 'source_message_id'); }
    public function supersedes(): BelongsTo { return $this->belongsTo(self::class, 'supersedes_id'); }
}
