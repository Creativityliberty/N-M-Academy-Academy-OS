<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseCreationRun extends Model
{
    public const STEPS = [
        'blueprint',
        'materialize',
        'assessments',
        'assignments',
        'cover',
        'thumbnail',
        'narrations',
        'offer',
        'landing',
        'review',
    ];

    protected $fillable = [
        'user_id',
        'academy_ai_run_id',
        'course_id',
        'page_id',
        'offer_id',
        'brief',
        'options',
        'state',
        'status',
        'current_step',
        'step_status',
        'progress_percent',
        'error_message',
        'step_started_at',
        'started_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'options' => 'array',
            'state' => 'array',
            'progress_percent' => 'integer',
            'step_started_at' => 'datetime',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function academyAiRun(): BelongsTo
    {
        return $this->belongsTo(AcademyAiRun::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(AcademyPage::class, 'page_id');
    }

    public function offer(): BelongsTo
    {
        return $this->belongsTo(CourseOffer::class, 'offer_id');
    }

    public function isComplete(): bool
    {
        return $this->status === 'completed';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }
}
