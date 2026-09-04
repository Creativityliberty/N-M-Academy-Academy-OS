<?php

declare(strict_types=1);

namespace App\Repositories\Admin\Plans;

use App\Models\Plan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface PlanRepository
{
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    public function find(int $id): Plan;

    public function create(array $data): Plan;

    public function update(Plan $plan, array $data): Plan;

    public function delete(Plan $plan): void;
}
