<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Trainer\StoreAssessmentRequest;
use App\Http\Requests\Trainer\UpdateAssessmentRequest;
use App\Models\AcademyAiRun;
use App\Models\Course;
use App\Models\CourseAssessment;
use App\Services\Assessments\AssessmentDefinitionService;
use App\Services\Assessments\AssessmentHistoryGuard;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AssessmentController extends Controller
{
    public function __construct(
        private readonly AssessmentDefinitionService $definitions,
        private readonly AssessmentHistoryGuard $history,
    ) {}

    public function index(Request $request, Course $course): Response
    {
        Gate::authorize('update', $course);
        $course->load(['modules.lessons', 'assessments.questions.options']);
        $recentRuns = AcademyAiRun::query()
            ->where('user_id', $request->user()->id)
            ->where('capability', 'assessment.generate')
            ->where('input->course_id', $course->id)
            ->latest()->limit(8)->get();

        return Inertia::render('trainer/courses/assessments/index', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'modules' => $course->modules->map(fn ($module) => [
                    'id' => $module->id,
                    'title' => $module->title,
                    'lessons' => $module->lessons->map(fn ($lesson) => ['id' => $lesson->id, 'title' => $lesson->title])->values(),
                ])->values(),
            ],
            'assessments' => $course->assessments->map(fn (CourseAssessment $assessment) => $this->serialize($assessment))->values(),
            'recentAiRuns' => $recentRuns->map(fn (AcademyAiRun $run) => [
                'id' => $run->id,
                'status' => $run->status,
                'prompt' => $run->prompt,
                'output' => $run->output,
                'appliedAt' => $run->applied_at?->toIso8601String(),
            ])->values(),
        ]);
    }

    public function store(StoreAssessmentRequest $request, Course $course): RedirectResponse
    {
        Gate::authorize('update', $course);
        $this->definitions->create($course, $request->validated());
        return back()->with('success', 'Quiz / évaluation créé.');
    }

    public function update(UpdateAssessmentRequest $request, Course $course, CourseAssessment $assessment): RedirectResponse
    {
        Gate::authorize('update', $course);
        $this->assertCourse($course, $assessment);
        $this->definitions->update($assessment, $request->validated());
        return back()->with('success', 'Quiz / évaluation mis à jour.');
    }

    public function destroy(Course $course, CourseAssessment $assessment): RedirectResponse
    {
        Gate::authorize('update', $course);
        $this->assertCourse($course, $assessment);
        $this->history->assertDeletable($assessment);
        $assessment->delete();
        return back()->with('success', 'Quiz / évaluation supprimé.');
    }

    public function toggle(Course $course, CourseAssessment $assessment): RedirectResponse
    {
        Gate::authorize('update', $course);
        $this->assertCourse($course, $assessment);
        $assessment->update(['is_enabled' => ! $assessment->is_enabled]);
        return back()->with('success', $assessment->is_enabled ? 'Évaluation activée.' : 'Évaluation désactivée.');
    }

    private function assertCourse(Course $course, CourseAssessment $assessment): void
    {
        if ((int) $assessment->course_id !== (int) $course->id) {
            throw new AuthorizationException('Cette évaluation n’appartient pas à cette formation.');
        }
    }

    /** @return array<string,mixed> */
    private function serialize(CourseAssessment $assessment): array
    {
        return [
            'id' => $assessment->id,
            'title' => $assessment->title,
            'description' => $assessment->description,
            'kind' => $assessment->kind->value,
            'moduleId' => $assessment->module_id,
            'lessonId' => $assessment->lesson_id,
            'passingScorePercent' => (int) $assessment->passing_score_percent,
            'maxAttempts' => $assessment->max_attempts,
            'shuffleQuestions' => $assessment->shuffle_questions,
            'shuffleOptions' => $assessment->shuffle_options,
            'showExplanations' => $assessment->show_explanations,
            'isEnabled' => $assessment->is_enabled,
            'attemptCount' => $assessment->attempts()->count(),
            'questions' => $assessment->questions->map(fn ($question) => [
                'id' => $question->id,
                'type' => $question->type->value,
                'prompt' => $question->prompt,
                'explanation' => $question->explanation,
                'points' => (int) $question->points,
                'options' => $question->options->map(fn ($option) => [
                    'id' => $option->id,
                    'text' => $option->text,
                    'isCorrect' => $option->is_correct,
                ])->values(),
            ])->values(),
        ];
    }
}
