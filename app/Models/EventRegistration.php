<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventRegistration extends Model
{
    protected $fillable = [
        'academy_event_id',
        'user_id',
        'registered_at',
        'reminder_sent_at',
    ];

    protected function casts(): array
    {
        return [
            'registered_at' => 'datetime',
            'reminder_sent_at' => 'datetime',
        ];
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(AcademyEvent::class, 'academy_event_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
