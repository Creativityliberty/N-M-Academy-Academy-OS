<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AssignmentDeliverableType;
use App\Enums\AssignmentKind;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseAssignment extends Model
{
    protected $fillable = ['course_id','module_id','lesson_id','title','instructions','kind','deliverable_type','is_enabled','is_required_for_completion','position'];

    protected function casts(): array
    {
        return [
            'kind' => AssignmentKind::class,
            'deliverable_type' => AssignmentDeliverableType::class,
            'is_enabled' => 'boolean',
            'is_required_for_completion' => 'boolean',
            'position' => 'integer',
        ];
    }

    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
    public function module(): BelongsTo { return $this->belongsTo(Module::class); }
    public function lesson(): BelongsTo { return $this->belongsTo(Lesson::class); }
    public function rubricItems(): HasMany { return $this->hasMany(CourseAssignmentRubricItem::class, 'assignment_id')->orderBy('position')->orderBy('id'); }
    public function submissions(): HasMany { return $this->hasMany(CourseAssignmentSubmission::class, 'assignment_id')->orderByDesc('version'); }
}
