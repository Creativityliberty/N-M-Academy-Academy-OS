<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseAssignmentRubricItem extends Model
{
    protected $fillable = ['assignment_id','criterion','description','max_points','position'];
    protected function casts(): array { return ['max_points' => 'integer', 'position' => 'integer']; }
    public function assignment(): BelongsTo { return $this->belongsTo(CourseAssignment::class, 'assignment_id'); }
}
