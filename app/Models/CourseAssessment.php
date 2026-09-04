<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AssessmentKind;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseAssessment extends Model
{
    protected $fillable = [
        'course_id', 'module_id', 'lesson_id', 'title', 'description', 'kind',
        'passing_score_percent', 'max_attempts', 'shuffle_questions', 'shuffle_options',
        'show_explanations', 'is_enabled', 'is_required_for_completion', 'position',
    ];

    protected function casts(): array
    {
        return [
            'kind' => AssessmentKind::class,
            'passing_score_percent' => 'integer',
            'max_attempts' => 'integer',
            'shuffle_questions' => 'boolean',
            'shuffle_options' => 'boolean',
            'show_explanations' => 'boolean',
            'is_enabled' => 'boolean',
            'is_required_for_completion' => 'boolean',
            'position' => 'integer',
        ];
    }

    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
    public function module(): BelongsTo { return $this->belongsTo(Module::class); }
    public function lesson(): BelongsTo { return $this->belongsTo(Lesson::class); }
    public function questions(): HasMany { return $this->hasMany(CourseAssessmentQuestion::class, 'assessment_id')->orderBy('position')->orderBy('id'); }
    public function attempts(): HasMany { return $this->hasMany(CourseAssessmentAttempt::class, 'assessment_id'); }
}
