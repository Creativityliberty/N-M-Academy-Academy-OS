<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\LessonType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;

class Lesson extends Model implements Sortable
{
    use HasFactory, SortableTrait;

    protected $fillable = [
        'module_id',
        'title',
        'content',
        'transcript',
        'duration',
        'is_free',
        'order',
        'type',
        'video_url',
        'audio_url',
        'pdf_url',
    ];

    protected function casts(): array
    {
        return [
            'is_free' => 'boolean',
            'type' => LessonType::class,
        ];
    }

    public array $sortable = [
        'sort_when_creating' => true,
        'order_column_name' => 'order',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(LessonProgress::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(LessonNote::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(CourseAssignment::class)->orderBy('position')->orderBy('id');
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(CourseAssessment::class)->orderBy('position')->orderBy('id');
    }
}
