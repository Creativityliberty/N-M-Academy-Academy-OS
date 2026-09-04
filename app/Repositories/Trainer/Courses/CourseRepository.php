<?php

namespace App\Repositories\Trainer\Courses;

use App\Models\Course;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CourseRepository
{
    public function paginate(User $trainer, int $perPage = 10): LengthAwarePaginator;

    public function find(User $trainer, int $id): Course;

    public function create(array $data): Course;

    public function update(Course $course, array $data): Course;

    public function delete(Course $course): void;
}
