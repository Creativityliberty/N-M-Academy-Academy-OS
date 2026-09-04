<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseAssignmentSubmissionFile extends Model
{
    protected $fillable = ['submission_id','disk','path','original_name','mime_type','size_bytes'];
    protected function casts(): array { return ['size_bytes' => 'integer']; }
    public function submission(): BelongsTo { return $this->belongsTo(CourseAssignmentSubmission::class, 'submission_id'); }
}
