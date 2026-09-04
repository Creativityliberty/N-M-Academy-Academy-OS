<?php

declare(strict_types=1);

namespace App\Repositories\Public\Courses;

use App\Models\Course;
use Illuminate\Database\Eloquent\Collection;

class EloquentCourseRepository implements CourseRepository
{
    public function allPublished(): Collection
    {
        return Course::query()
            ->published()
            ->with(['category', 'trainer', 'offers'])
            ->withCount(['modules', 'enrollments'])
            ->orderByDesc('featured')
            ->orderBy('title')
            ->get();
    }

    public function allPublishedWithModules(): Collection
    {
        return Course::query()
            ->published()
            ->with(['category', 'trainer', 'modules.lessons', 'offers'])
            ->withCount(['modules', 'enrollments'])
            ->orderByDesc('featured')
            ->orderBy('title')
            ->get();
    }

    public function findPublishedWithRelations(int $id): Course
    {
        return Course::query()
            ->published()
            ->with(['category', 'trainer', 'modules.lessons', 'offers'])
            ->withCount(['modules', 'enrollments'])
            ->findOrFail($id);
    }

    public function featuredPublished(int $limit = 4): Collection
    {
        return Course::query()
            ->published()
            ->with(['category', 'trainer', 'offers'])
            ->withCount(['modules', 'enrollments'])
            ->orderByDesc('featured')
            ->limit($limit)
            ->get();
    }
}
