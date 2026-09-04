<?php

declare(strict_types=1);

namespace App\Repositories\Admin\Courses;

use App\Models\Course;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CourseRepository
{
    public function paginate(int $perPage = 10): LengthAwarePaginator;

    public function find(int $id): Course;

    public function create(array $data): Course;

    public function update(Course $course, array $data): Course;

    public function delete(Course $course): void;
}
