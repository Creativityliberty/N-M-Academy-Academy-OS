<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public\Courses;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\CourseResource;
use App\Repositories\Public\Categories\CategoryRepository;
use App\Repositories\Public\Courses\CourseRepository;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function __construct(
        private readonly CourseRepository $courses,
        private readonly CategoryRepository $categories,
    ) {}

    public function index(): Response
    {
        return Inertia::render('home/courses/index', [
            'courses' => CourseResource::collection($this->courses->allPublished())->resolve(),
            'categories' => $this->categories->allOrdered()->pluck('name'),
            'trainers' => $this->courses->allPublished()
                ->map(fn ($c) => $c->trainer?->name)
                ->filter()
                ->unique()
                ->values(),
        ]);
    }

    public function show(int $id): Response
    {
        $course = $this->courses->findPublishedWithRelations($id);

        return Inertia::render('home/courses/show', [
            'course' => (new CourseResource($course))->resolve(),
        ]);
    }
}
