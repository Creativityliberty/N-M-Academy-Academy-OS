<?php

declare(strict_types=1);

namespace App\Repositories\Public\Categories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class EloquentCategoryRepository implements CategoryRepository
{
    public function allOrdered(): Collection
    {
        return Category::query()->orderBy('order')->get();
    }
}
