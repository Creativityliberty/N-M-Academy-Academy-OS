<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\CourseStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Course extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'trainer_id',
        'category_id',
        'title',
        'slug',
        'stripe_product_id',
        'stripe_price_id',
        'description',
        'target_audience',
        'level',
        'language',
        'positioning',
        'price',
        'duration',
        'image',
        'thumbnail',
        'featured',
        'benefits',
        'objectives',
        'prerequisites',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'featured' => 'boolean',
            'benefits' => 'array',
            'objectives' => 'array',
            'prerequisites' => 'array',
            'positioning' => 'array',
            'status' => CourseStatus::class,
            'published_at' => 'datetime',
        ];
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function scopePublished(Builder $query): void
    {
        $query->where('status', CourseStatus::Published);
    }

    public function scopeFeatured(Builder $query): void
    {
        $query->where('featured', true);
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function modules(): HasMany
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(CourseAssignment::class)->orderBy('position')->orderBy('id');
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(CourseAssessment::class)->orderBy('position')->orderBy('id');
    }

    public function offers(): HasMany
    {
        return $this->hasMany(CourseOffer::class)->orderByDesc('is_default')->orderBy('amount');
    }

    public function completionPolicy(): HasOne
    {
        return $this->hasOne(CourseCompletionPolicy::class);
    }

    public function completions(): HasMany
    {
        return $this->hasMany(CourseCompletion::class);
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(CourseCertificate::class);
    }
}
