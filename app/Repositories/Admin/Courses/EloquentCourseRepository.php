<?php

declare(strict_types=1);

namespace App\Repositories\Admin\Courses;

use App\Models\Course;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentCourseRepository implements CourseRepository
{
    public function paginate(int $perPage = 10): LengthAwarePaginator
    {
        return Course::query()
            ->with(['category', 'trainer'])
            ->withCount('modules')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function find(int $id): Course
    {
        return Course::query()
            ->with(['category', 'trainer', 'modules.lessons'])
            ->withCount('modules')
            ->findOrFail($id);
    }

    public function create(array $data): Course
    {
        return Course::query()->create($data);
    }

    public function update(Course $course, array $data): Course
    {
        $course->update($data);

        return $course->fresh(['category', 'trainer']);
    }

    public function delete(Course $course): void
    {
        $course->delete();
    }
}
