<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AssignmentSubmissionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseAssignmentSubmission extends Model
{
    protected $fillable = ['assignment_id','user_id','version','status','text_content','link_url','rubric_scores','score_percent','review_feedback','reviewed_by','submitted_at','reviewed_at'];
    protected function casts(): array
    {
        return [
            'version' => 'integer',
            'status' => AssignmentSubmissionStatus::class,
            'rubric_scores' => 'array',
            'score_percent' => 'decimal:2',
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }
    public function assignment(): BelongsTo { return $this->belongsTo(CourseAssignment::class, 'assignment_id'); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function reviewer(): BelongsTo { return $this->belongsTo(User::class, 'reviewed_by'); }
    public function files(): HasMany { return $this->hasMany(CourseAssignmentSubmissionFile::class, 'submission_id'); }
}
