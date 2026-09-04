<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AssessmentQuestionType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseAssessmentQuestion extends Model
{
    protected $fillable = ['assessment_id', 'type', 'prompt', 'explanation', 'points', 'position'];

    protected function casts(): array
    {
        return ['type' => AssessmentQuestionType::class, 'points' => 'integer', 'position' => 'integer'];
    }

    public function assessment(): BelongsTo { return $this->belongsTo(CourseAssessment::class, 'assessment_id'); }
    public function options(): HasMany { return $this->hasMany(CourseAssessmentOption::class, 'question_id')->orderBy('position')->orderBy('id'); }
}
