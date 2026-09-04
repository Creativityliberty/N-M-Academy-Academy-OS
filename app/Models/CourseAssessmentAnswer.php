<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseAssessmentAnswer extends Model
{
    protected $fillable = ['attempt_id', 'question_id', 'selected_option_ids', 'is_correct', 'awarded_points', 'feedback'];
    protected function casts(): array { return ['selected_option_ids' => 'array', 'is_correct' => 'boolean', 'awarded_points' => 'integer']; }
    public function attempt(): BelongsTo { return $this->belongsTo(CourseAssessmentAttempt::class, 'attempt_id'); }
    public function question(): BelongsTo { return $this->belongsTo(CourseAssessmentQuestion::class, 'question_id'); }
}
