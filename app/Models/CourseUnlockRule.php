<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\UnlockRuleType;
use App\Enums\UnlockTargetType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseUnlockRule extends Model
{
    protected $fillable = [
        'course_id',
        'target_type',
        'target_id',
        'rule_type',
        'source_type',
        'source_id',
        'delay_days',
        'available_at',
        'is_enabled',
        'position',
    ];

    protected function casts(): array
    {
        return [
            'target_type' => UnlockTargetType::class,
            'rule_type' => UnlockRuleType::class,
            'source_type' => UnlockTargetType::class,
            'target_id' => 'integer',
            'source_id' => 'integer',
            'delay_days' => 'integer',
            'available_at' => 'datetime',
            'is_enabled' => 'boolean',
            'position' => 'integer',
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
