<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseReviewProposal extends Model
{
    protected $fillable = [
        'course_creation_run_id', 'user_id', 'course_id', 'target_type', 'target_id',
        'academy_ai_run_id', 'media_generation_id', 'instruction', 'before_payload',
        'after_payload', 'status', 'accepted_at', 'rejected_at',
    ];

    protected function casts(): array
    {
        return [
            'before_payload' => 'array',
            'after_payload' => 'array',
            'accepted_at' => 'datetime',
            'rejected_at' => 'datetime',
        ];
    }

    public function run(): BelongsTo { return $this->belongsTo(CourseCreationRun::class, 'course_creation_run_id'); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
    public function academyAiRun(): BelongsTo { return $this->belongsTo(AcademyAiRun::class); }
    public function mediaGeneration(): BelongsTo { return $this->belongsTo(CourseMediaGeneration::class); }

    public function isPending(): bool { return $this->status === 'pending'; }
}
