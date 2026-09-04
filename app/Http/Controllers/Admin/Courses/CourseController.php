<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin\Courses;

use App\Actions\Admin\Courses\CreateCourseAction;
use App\Actions\Admin\Courses\DeleteCourseAction;
use App\Actions\Admin\Courses\UpdateCourseAction;
use App\Actions\Courses\PublishCourseAction;
use App\Actions\Courses\UnpublishCourseAction;
use App\Enums\CourseStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Courses\StoreCourseRequest;
use App\Http\Requests\Admin\Courses\UpdateCourseRequest;
use App\Http\Resources\Admin\CourseResource;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use App\Repositories\Admin\Courses\CourseRepository;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Attributes\Controllers\Authorize;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function __construct(
        private readonly CourseRepository $repository,
        private readonly CreateCourseAction $createAction,
        private readonly UpdateCourseAction $updateAction,
        private readonly DeleteCourseAction $deleteAction,
        private readonly PublishCourseAction $publishCourse,
        private readonly UnpublishCourseAction $unpublishCourse,
    ) {}

    #[Authorize('viewAny', Course::class)]
    public function index(): Response
    {
        return Inertia::render('admin/courses/index', [
            'courses' => $this->repository->paginate(10)->through(
                fn (Course $course) => CourseResource::make($course)->resolve(),
            ),
        ]);
    }

    #[Authorize('create', Course::class)]
    public function create(): Response
    {
        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('admin/courses/create', [
            'categories' => Category::query()->orderBy('order')->get(['id', 'name']),
            'trainers' => $user->isAdmin()
                ? User::trainers()->get(['id', 'name'])->map(fn ($u) => ['id' => $u->id, 'name' => $u->name])
                : [],
            'is_admin' => $user->isAdmin(),
            'trainer_id' => $user->isAdmin() ? null : $user->id,
        ]);
    }

    #[Authorize('create', Course::class)]
    public function store(StoreCourseRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $data = $request->validated();

        if (! $user->isAdmin()) {
            $data['trainer_id'] = $user->id;
        }

        $this->createAction->handle($data);

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Formation créée avec succès.');
    }

    #[Authorize('update', 'course')]
    public function edit(Course $course): Response
    {
        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('admin/courses/edit', [
            'course' => (new CourseResource($this->repository->find($course->id)))->resolve(),
            'categories' => Category::query()->orderBy('order')->get(['id', 'name']),
            'trainers' => $user->isAdmin()
                ? User::trainers()->get(['id', 'name'])->map(fn ($u) => ['id' => $u->id, 'name' => $u->name])
                : [],
            'is_admin' => $user->isAdmin(),
        ]);
    }

    #[Authorize('update', 'course')]
    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $data = $request->validated();

        if (! $user->isAdmin()) {
            $data['trainer_id'] = $user->id;
        }

        $this->updateAction->handle($course, $data);

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Formation mise à jour avec succès.');
    }

    #[Authorize('delete', 'course')]
    public function destroy(Course $course): RedirectResponse
    {
        $this->deleteAction->handle($course);

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Formation archivée avec succès.');
    }

    #[Authorize('update', 'course')]
    public function toggleStatus(Course $course): RedirectResponse
    {
        try {
            $updated = $course->status === CourseStatus::Published
                ? $this->unpublishCourse->handle($course)
                : $this->publishCourse->handle($course);
        } catch (\RuntimeException $error) {
            return back()->with('error', $error->getMessage());
        }

        return back()->with('success', "Formation passée en « {$updated->status->label()} ».");
    }
}
