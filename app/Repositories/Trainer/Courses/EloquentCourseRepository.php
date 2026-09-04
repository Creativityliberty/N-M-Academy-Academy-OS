<?php

namespace App\Repositories\Trainer\Courses;

use App\Models\Course;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EloquentCourseRepository implements CourseRepository
{
    public function paginate(User $trainer, int $perPage = 10): LengthAwarePaginator
    {
        return Course::query()
            ->where('trainer_id', $trainer->id)
            ->with(['category'])
            ->withCount('modules')
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }

    public function find(User $trainer, int $id): Course
    {
        return Course::query()
            ->where('trainer_id', $trainer->id)
            ->with(['category', 'modules.lessons'])
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

        return $course->fresh(['category']);
    }

    public function delete(Course $course): void
    {
        $course->delete();
    }
}
