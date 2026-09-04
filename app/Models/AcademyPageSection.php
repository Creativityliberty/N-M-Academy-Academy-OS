<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcademyPageSection extends Model
{
    protected $fillable = ['academy_page_id','type','variant','sort_order','settings','is_visible'];

    protected function casts(): array
    {
        return ['settings' => 'array', 'is_visible' => 'boolean', 'sort_order' => 'integer'];
    }

    public function page(): BelongsTo
    {
        return $this->belongsTo(AcademyPage::class, 'academy_page_id');
    }
}
