<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademyAiRun extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'capability',
        'mode',
        'prompt',
        'input',
        'output',
        'provider',
        'model',
        'status',
        'error_message',
        'applied_at',
    ];

    protected function casts(): array
    {
        return [
            'input' => 'array',
            'output' => 'array',
            'applied_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isSucceeded(): bool
    {
        return $this->status === 'succeeded';
    }

    public function isApplied(): bool
    {
        return $this->applied_at !== null;
    }
}
