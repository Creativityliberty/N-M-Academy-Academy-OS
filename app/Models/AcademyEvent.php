<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademyEvent extends Model
{
    protected $fillable = [
        'creator_id',
        'title',
        'description',
        'starts_at',
        'ends_at',
        'timezone',
        'meeting_url',
        'location',
        'capacity',
        'reminder_minutes',
        'is_published',
        'is_cancelled',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'capacity' => 'integer',
            'reminder_minutes' => 'integer',
            'is_published' => 'boolean',
            'is_cancelled' => 'boolean',
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegistration::class);
    }
}
