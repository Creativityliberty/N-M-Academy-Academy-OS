<?php

declare(strict_types=1);

namespace App\MissionTower\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TowerChatThread extends Model
{
    protected $table = 'tower_chat_threads';

    protected $fillable = ['owner_id', 'title', 'status', 'summary', 'summary_message_id', 'last_message_at'];

    protected function casts(): array
    {
        return ['last_message_at' => 'datetime'];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(TowerChatMessage::class, 'thread_id')->orderBy('id');
    }
}
