<?php

declare(strict_types=1);

namespace App\Repositories\Public\Categories;

use Illuminate\Database\Eloquent\Collection;

interface CategoryRepository
{
    public function allOrdered(): Collection;
}
