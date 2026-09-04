<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\Actions\Courses\PublishCourseAction;
use App\Enums\CourseStatus;
use App\Http\Controllers\Controller;
use App\Models\CourseCreationRun;
use App\Models\CourseReviewProposal;
use App\Models\User;
use App\Services\Courses\CourseReviewProposalService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class CourseReviewController extends Controller
{
    public function __construct(private readonly CourseReviewProposalService $proposals) {}

    public function show(Request $request, CourseCreationRun $run): Response
    {
        /** @var User $trainer */
        $trainer = $request->user();
        $run = $this->ownedRun($trainer, $run);
        $run->load(['course.modules.lessons','course.offers','course.assessments','course.assignments','page.sections','offer']);
        $course = $run->course;

        $proposals = CourseReviewProposal::query()
            ->where('course_creation_run_id', $run->id)
            ->with(['mediaGeneration','academyAiRun'])
            ->latest()
            ->get();

        $pendingCount = $proposals->whereIn('status', ['generating', 'pending'])->count();
        $moduleCount = $course->modules->count();
        $lessonCount = $course->modules->sum(fn ($module) => $module->lessons->count());
        $defaultOffer = $course->offers->first(fn ($offer) => $offer->is_active && $offer->is_default);
        $displayOffer = $defaultOffer ?? $course->offers->first(fn ($offer) => $offer->is_active);
        $visibleSections = $run->page ? $run->page->sections->where('is_visible', true)->count() : null;
        $assessmentCount = $course->assessments->count();
        $assignmentCount = $course->assignments->count();

        $readiness = [
            ['key'=>'course','label'=>'Formation en brouillon prête à publier','ready'=>$course->status === CourseStatus::Draft || $course->status === CourseStatus::Published],
            ['key'=>'structure','label'=>'Au moins un module et une leçon','ready'=>$moduleCount > 0 && $lessonCount > 0],
            ['key'=>'offer','label'=>'Offre active par défaut disponible','ready'=>$defaultOffer !== null],
            ['key'=>'proposals','label'=>'Aucune proposition en attente','ready'=>$pendingCount === 0],
            ['key'=>'landing','label'=>'Landing valide si elle existe','ready'=>$run->page === null || ($visibleSections ?? 0) > 0],
        ];
        $canPublish = collect($readiness)->every(fn (array $item): bool => (bool) $item['ready']);

        return Inertia::render('trainer/academy-ai/course-review', [
            'run' => [
                'id' => $run->id,
                'brief' => $run->brief,
                'status' => $run->status,
                'createdAt' => $run->created_at?->toIso8601String(),
                'creationUrl' => route('trainer.course-creation.index', ['run' => $run->id]),
            ],
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'status' => $course->status->value,
                'targetAudience' => $course->target_audience,
                'level' => $course->level,
                'language' => $course->language,
                'positioning' => $course->positioning ?? [],
                'image' => $course->image,
                'thumbnail' => $course->thumbnail,
                'editUrl' => route('trainer.courses.edit', $course),
                'assessmentCount' => $assessmentCount,
                'assessmentsUrl' => route('trainer.assessments.index', $course),
                'assignmentCount' => $assignmentCount,
                'assignmentsUrl' => route('trainer.assignments.index', $course),
                'completionUrl' => route('trainer.completion.show', $course),
                'completionCount' => $course->completions()->count(),
                'certificateCount' => $course->certificates()->count(),
                'modules' => $course->modules->map(fn ($module) => [
                    'id' => $module->id,
                    'title' => $module->title,
                    'description' => $module->description,
                    'objectives' => $module->objectives ?? [],
                    'duration' => $module->duration,
                    'minimumAccessRank' => $module->minimum_access_rank,
                    'lessons' => $module->lessons->map(fn ($lesson) => [
                        'id' => $lesson->id,
                        'title' => $lesson->title,
                        'content' => $lesson->content,
                        'duration' => $lesson->duration,
                        'type' => $lesson->type->value,
                        'audioUrl' => $lesson->audio_url,
                        'pdfUrl' => $lesson->pdf_url,
                        'videoUrl' => $lesson->video_url,
                    ])->values(),
                ])->values(),
            ],
            'offer' => $displayOffer ? [
                'id' => $displayOffer->id,
                'name' => $displayOffer->name,
                'amount' => $displayOffer->amount,
                'currency' => $displayOffer->currency,
                'billingType' => $displayOffer->billing_type,
                'isActive' => $displayOffer->is_active,
                'editUrl' => route('trainer.sales.index'),
            ] : null,
            'page' => $run->page ? [
                'id' => $run->page->id,
                'title' => $run->page->title,
                'status' => $run->page->status,
                'visibleSections' => $visibleSections,
                'editUrl' => route('trainer.pages.edit', $run->page),
                'previewUrl' => route('trainer.pages.preview', $run->page),
            ] : null,
            'proposals' => $proposals->map(fn (CourseReviewProposal $proposal) => [
                'id' => $proposal->id,
                'targetType' => $proposal->target_type,
                'targetId' => $proposal->target_id,
                'status' => $proposal->status,
                'instruction' => $proposal->instruction,
                'before' => $proposal->before_payload,
                'after' => $proposal->after_payload,
                'provider' => $proposal->mediaGeneration?->provider ?? $proposal->academyAiRun?->provider,
                'model' => $proposal->mediaGeneration?->model ?? $proposal->academyAiRun?->model,
                'createdAt' => $proposal->created_at?->toIso8601String(),
            ])->values(),
            'readiness' => $readiness,
            'canPublish' => $canPublish,
            'pendingCount' => $pendingCount,
        ]);
    }

    public function propose(Request $request, CourseCreationRun $run): RedirectResponse
    {
        /** @var User $trainer */
        $trainer = $request->user();
        $run = $this->ownedRun($trainer, $run);
        $validated = $request->validate([
            'target_type' => ['required', Rule::in(['course_positioning','module','lesson','cover','thumbnail','landing','audio'])],
            'target_id' => ['nullable','integer','min:1'],
            'instruction' => ['required','string','min:3','max:3000'],
        ]);

        try {
            $this->proposals->propose($trainer, $run, $validated['target_type'], isset($validated['target_id']) ? (int) $validated['target_id'] : null, $validated['instruction']);
        } catch (RuntimeException $error) {
            return back()->with('error', $error->getMessage());
        }

        return back()->with('success', 'Nouvelle proposition générée. Comparez avant et après avant de décider.');
    }

    public function accept(Request $request, CourseCreationRun $run, CourseReviewProposal $proposal): RedirectResponse
    {
        /** @var User $trainer */
        $trainer = $request->user();
        $run = $this->ownedRun($trainer, $run);
        abort_unless((int) $proposal->course_creation_run_id === (int) $run->id, 404);
        $this->proposals->accept($trainer, $proposal);
        return back()->with('success', 'Proposition acceptée et appliquée.');
    }

    public function reject(Request $request, CourseCreationRun $run, CourseReviewProposal $proposal): RedirectResponse
    {
        /** @var User $trainer */
        $trainer = $request->user();
        $run = $this->ownedRun($trainer, $run);
        abort_unless((int) $proposal->course_creation_run_id === (int) $run->id, 404);
        $this->proposals->reject($trainer, $proposal);
        return back()->with('success', 'Proposition refusée. La version actuelle est conservée.');
    }

    public function publish(Request $request, CourseCreationRun $run, PublishCourseAction $publishCourse): RedirectResponse
    {
        /** @var User $trainer */
        $trainer = $request->user();
        $run = $this->ownedRun($trainer, $run);
        $run->load(['course.modules.lessons','course.offers','page.sections']);
        $course = $run->course;

        if (CourseReviewProposal::where('course_creation_run_id', $run->id)->whereIn('status', ['generating', 'pending'])->exists()) {
            return back()->with('error', 'Traitez toutes les propositions en attente avant publication.');
        }
        if ($course->modules->isEmpty() || $course->modules->sum(fn ($module) => $module->lessons->count()) === 0) {
            return back()->with('error', 'Ajoutez au moins un module et une leçon avant publication.');
        }
        if (! $course->offers->contains(fn ($offer) => $offer->is_active && $offer->is_default)) {
            return back()->with('error', 'Une offre active par défaut est requise avant publication.');
        }
        if ($run->page && $run->page->sections->where('is_visible', true)->count() === 0) {
            return back()->with('error', 'La landing liée doit contenir au moins une visible section avant publication.');
        }

        try {
            $publishCourse->handle($course);
        } catch (RuntimeException $error) {
            return back()->with('error', $error->getMessage());
        }

        if ($run->page) {
            $run->page->update(['status' => 'published', 'published_at' => $run->page->published_at ?? now()]);
        }

        return redirect()->route('trainer.course-review.show', $run)->with('success', 'Formation publiée. Stripe a été provisionné uniquement via le lifecycle canonique.');
    }

    private function ownedRun(User $trainer, CourseCreationRun $run): CourseCreationRun
    {
        $owned = CourseCreationRun::query()->with('course')->where('user_id', $trainer->id)->findOrFail($run->id);
        if (! $owned->course || (int) $owned->course->trainer_id !== (int) $trainer->id) {
            throw new AuthorizationException('Cette génération de formation ne vous appartient pas.');
        }
        if ($owned->status !== 'completed' && $owned->current_step !== 'review') {
            throw new AuthorizationException('Cette formation n’a pas encore atteint la phase de review.');
        }
        return $owned;
    }
}
