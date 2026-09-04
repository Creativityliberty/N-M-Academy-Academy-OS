<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\Enums\AssignmentSubmissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\CourseAssignmentSubmission;
use App\Models\CourseAssignmentSubmissionFile;
use App\Services\Assignments\AssignmentDefinitionService;
use App\Services\Assignments\AssignmentReviewService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AssignmentController extends Controller
{
    public function index(Course $course): Response
    {
        Gate::authorize('update', $course);
        $course->load(['modules.lessons','assignments.rubricItems','assignments.submissions.files','assignments.submissions.user']);

        return Inertia::render('trainer/courses/assignments/index', [
            'course' => ['id' => $course->id, 'title' => $course->title],
            'modules' => $course->modules->map(fn ($module) => [
                'id' => $module->id,
                'title' => $module->title,
                'lessons' => $module->lessons->map(fn ($lesson) => ['id' => $lesson->id, 'title' => $lesson->title])->values(),
            ])->values(),
            'assignments' => $course->assignments->map(fn (CourseAssignment $assignment) => $this->serialize($assignment))->values(),
        ]);
    }

    public function store(Request $request, Course $course, AssignmentDefinitionService $definitions): RedirectResponse
    {
        Gate::authorize('update', $course);
        $definitions->create($course, $this->definitionPayload($request));
        return back()->with('success', 'Assignment créé.');
    }

    public function update(Request $request, Course $course, CourseAssignment $assignment, AssignmentDefinitionService $definitions): RedirectResponse
    {
        Gate::authorize('update', $course);
        $this->assertCourse($course, $assignment);
        $definitions->update($assignment, $this->definitionPayload($request));
        return back()->with('success', 'Assignment mis à jour.');
    }

    public function destroy(Course $course, CourseAssignment $assignment, AssignmentDefinitionService $definitions): RedirectResponse
    {
        Gate::authorize('update', $course);
        $this->assertCourse($course, $assignment);
        $definitions->delete($assignment);
        return back()->with('success', 'Assignment supprimé.');
    }

    public function toggle(Course $course, CourseAssignment $assignment): RedirectResponse
    {
        Gate::authorize('update', $course);
        $this->assertCourse($course, $assignment);
        $assignment->update(['is_enabled' => ! $assignment->is_enabled]);
        return back()->with('success', $assignment->is_enabled ? 'Assignment activé.' : 'Assignment désactivé.');
    }

    public function review(Request $request, Course $course, CourseAssignment $assignment, CourseAssignmentSubmission $submission, AssignmentReviewService $reviews): RedirectResponse
    {
        Gate::authorize('update', $course);
        $this->assertCourse($course, $assignment);
        abort_unless((int) $submission->assignment_id === (int) $assignment->id, 404);
        $validated = $request->validate([
            'decision' => ['required', Rule::in([AssignmentSubmissionStatus::Approved->value, AssignmentSubmissionStatus::ChangesRequested->value])],
            'feedback' => ['nullable','string','max:20000'],
            'rubric_scores' => ['required','array'],
        ]);
        $reviews->review($request->user(), $submission, $validated);
        return back()->with('success', 'Rendu revu.');
    }

    public function download(Course $course, CourseAssignment $assignment, CourseAssignmentSubmissionFile $file): StreamedResponse
    {
        Gate::authorize('update', $course);
        $this->assertCourse($course, $assignment);
        $file->loadMissing('submission');
        abort_unless((int) $file->submission?->assignment_id === (int) $assignment->id, 404);
        abort_unless(Storage::disk('assignments')->exists($file->path), 404);
        return Storage::disk('assignments')->download($file->path, $file->original_name);
    }

    /** @return array<string,mixed> */
    private function definitionPayload(Request $request): array
    {
        return $request->validate([
            'title' => ['required','string','max:255'],
            'instructions' => ['required','string','max:60000'],
            'kind' => ['required', Rule::in(['assignment','project'])],
            'deliverable_type' => ['required', Rule::in(['text','link','file','mixed'])],
            'module_id' => ['nullable','integer'],
            'lesson_id' => ['nullable','integer'],
            'is_enabled' => ['sometimes','boolean'],
            'rubric' => ['required','array','min:1','max:20'],
            'rubric.*.criterion' => ['required','string','max:255'],
            'rubric.*.description' => ['nullable','string','max:5000'],
            'rubric.*.max_points' => ['required','integer','min:1','max:1000'],
        ]);
    }

    private function assertCourse(Course $course, CourseAssignment $assignment): void
    {
        if ((int) $assignment->course_id !== (int) $course->id) {
            throw new AuthorizationException('Cet assignment n’appartient pas à cette formation.');
        }
    }

    /** @return array<string,mixed> */
    private function serialize(CourseAssignment $assignment): array
    {
        return [
            'id' => $assignment->id,
            'title' => $assignment->title,
            'instructions' => $assignment->instructions,
            'kind' => $assignment->kind->value,
            'deliverableType' => $assignment->deliverable_type->value,
            'moduleId' => $assignment->module_id,
            'lessonId' => $assignment->lesson_id,
            'isEnabled' => $assignment->is_enabled,
            'rubric' => $assignment->rubricItems->map(fn ($item) => [
                'id' => $item->id, 'criterion' => $item->criterion, 'description' => $item->description, 'maxPoints' => (int) $item->max_points,
            ])->values(),
            'submissions' => $assignment->submissions->map(fn ($submission) => [
                'id' => $submission->id,
                'student' => ['id' => $submission->user_id, 'name' => $submission->user?->name],
                'version' => (int) $submission->version,
                'status' => $submission->status->value,
                'textContent' => $submission->text_content,
                'linkUrl' => $submission->link_url,
                'rubricScores' => $submission->rubric_scores ?? [],
                'scorePercent' => $submission->score_percent !== null ? (float) $submission->score_percent : null,
                'feedback' => $submission->review_feedback,
                'files' => $submission->files->map(fn ($file) => [
                    'id' => $file->id,
                    'name' => $file->original_name,
                    'url' => route('trainer.assignments.files.download', [$assignment->course_id, $assignment, $file]),
                ])->values(),
            ])->values(),
        ];
    }
}
