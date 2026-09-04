<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseAssessmentAttempt extends Model
{
    protected $fillable = ['assessment_id', 'user_id', 'attempt_number', 'score_points', 'max_points', 'score_percent', 'passed', 'started_at', 'completed_at'];
    protected function casts(): array
    {
        return ['attempt_number' => 'integer', 'score_points' => 'integer', 'max_points' => 'integer', 'score_percent' => 'decimal:2', 'passed' => 'boolean', 'started_at' => 'datetime', 'completed_at' => 'datetime'];
    }
    public function assessment(): BelongsTo { return $this->belongsTo(CourseAssessment::class, 'assessment_id'); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function answers(): HasMany { return $this->hasMany(CourseAssessmentAnswer::class, 'attempt_id'); }
}
