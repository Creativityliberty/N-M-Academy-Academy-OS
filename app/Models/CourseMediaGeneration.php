<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseMediaGeneration extends Model
{
    protected $fillable = [
        'course_id', 'user_id', 'lesson_id', 'purpose', 'provider', 'model',
        'compiled_prompt', 'user_prompt', 'aspect_ratio', 'image_size',
        'asset_url', 'mime_type', 'status', 'applied_at', 'rejected_at',
    ];

    protected function casts(): array
    {
        return ['applied_at' => 'datetime', 'rejected_at' => 'datetime'];
    }

    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function lesson(): BelongsTo { return $this->belongsTo(Lesson::class); }
}
