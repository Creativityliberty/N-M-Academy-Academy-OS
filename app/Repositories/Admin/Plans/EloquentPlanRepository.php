<?php

declare(strict_types=1);

namespace App\Repositories\Admin\Plans;

use App\Models\Plan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentPlanRepository implements PlanRepository
{
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Plan::query()->orderBy('order')->paginate($perPage);
    }

    public function find(int $id): Plan
    {
        return Plan::findOrFail($id);
    }

    public function create(array $data): Plan
    {
        return Plan::query()->create($data);
    }

    public function update(Plan $plan, array $data): Plan
    {
        $plan->update($data);

        return $plan->fresh();
    }

    public function delete(Plan $plan): void
    {
        $plan->delete();
    }
}
