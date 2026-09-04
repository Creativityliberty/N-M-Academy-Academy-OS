<?php

declare(strict_types=1);

namespace App\Repositories\Public\Courses;

use App\Models\Course;
use Illuminate\Database\Eloquent\Collection;

interface CourseRepository
{
    public function allPublished(): Collection;

    public function allPublishedWithModules(): Collection;

    public function findPublishedWithRelations(int $id): Course;

    public function featuredPublished(int $limit = 4): Collection;
}
