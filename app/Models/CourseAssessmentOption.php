<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseAssessmentOption extends Model
{
    protected $fillable = ['question_id', 'text', 'is_correct', 'position'];
    protected function casts(): array { return ['is_correct' => 'boolean', 'position' => 'integer']; }
    public function question(): BelongsTo { return $this->belongsTo(CourseAssessmentQuestion::class, 'question_id'); }
}
