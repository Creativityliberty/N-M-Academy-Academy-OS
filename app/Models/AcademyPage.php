<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AcademyPage extends Model
{
    protected $fillable = ['trainer_id','title','slug','page_type','status','meta_title','meta_description','published_at'];

    protected function casts(): array
    {
        return ['published_at' => 'datetime'];
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trainer_id');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(AcademyPageSection::class)->orderBy('sort_order');
    }

    public function isPublished(): bool
    {
        return $this->status === 'published' && $this->published_at !== null;
    }
}
