<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseCompletionPolicy extends Model
{
    protected $fillable = [
        'course_id',
        'require_all_accessible_lessons',
        'certificate_enabled',
        'certificate_title',
        'issuer_name',
    ];

    protected function casts(): array
    {
        return [
            'require_all_accessible_lessons' => 'boolean',
            'certificate_enabled' => 'boolean',
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
