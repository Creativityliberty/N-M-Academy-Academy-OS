<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public\Home;

use App\Http\Controllers\Controller;
use App\Http\Resources\Public\CourseResource;
use App\Repositories\Public\Courses\CourseRepository;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function __construct(
        private readonly CourseRepository $courses,
    ) {}

    public function index(): Response
    {
        return Inertia::render('home/index', [
            'canRegister' => Features::enabled(Features::registration()),
            'featuredCourses' => CourseResource::collection($this->courses->featuredPublished(4))->resolve(),
        ]);
    }
}
