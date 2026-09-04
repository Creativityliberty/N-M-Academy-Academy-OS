<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;

class Module extends Model implements Sortable
{
    use HasFactory, SortableTrait;

    protected $fillable = [
        'course_id',
        'title',
        'description',
        'objectives',
        'duration',
        'minimum_access_rank',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'objectives' => 'array',
            'minimum_access_rank' => 'integer',
        ];
    }

    public array $sortable = [
        'sort_when_creating' => true,
        'order_column_name' => 'order',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
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
