<?php

declare(strict_types=1);

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\CourseAssignmentSubmissionFile;
use App\Models\User;
use App\Services\Assignments\AssignmentSubmissionService;
use App\Services\LearningAccess\LearningAccessService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AssignmentController extends Controller
{
    public function show(Request $request, Course $course, CourseAssignment $assignment, AssignmentSubmissionService $submissions): Response
    {
        /** @var User $student */
        $student = $request->user();
        $this->assertCourse($course, $assignment);
        $submissions->assertAccess($student, $assignment);
        $assignment->load(['rubricItems']);
        $history = $assignment->submissions()->where('user_id', $student->id)->with('files')->latest('version')->get();
        $latest = $history->first();

        return Inertia::render('student/courses/assignment', [
            'course' => ['id' => $course->id, 'title' => $course->title],
            'assignment' => [
                'id' => $assignment->id,
                'title' => $assignment->title,
                'instructions' => $assignment->instructions,
                'kind' => $assignment->kind->value,
                'deliverableType' => $assignment->deliverable_type->value,
                'rubric' => $assignment->rubricItems->map(fn ($item) => [
                    'id' => $item->id, 'criterion' => $item->criterion, 'description' => $item->description, 'maxPoints' => (int) $item->max_points,
                ])->values(),
            ],
            'latestSubmission' => $latest ? $this->submissionPayload($course, $assignment, $latest) : null,
            'history' => $history->map(fn ($submission) => $this->submissionPayload($course, $assignment, $submission))->values(),
        ]);
    }

    public function submit(Request $request, Course $course, CourseAssignment $assignment, AssignmentSubmissionService $submissions): RedirectResponse
    {
        /** @var User $student */
        $student = $request->user();
        $this->assertCourse($course, $assignment);
        $validated = $request->validate([
            'text_content' => ['nullable','string','max:100000'],
            'link_url' => ['nullable','url','max:2048'],
            'files' => ['nullable','array','max:5'],
            'files.*' => ['file','max:51200','mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,csv,jpg,jpeg,png,webp,zip'],
        ]);
        $submissions->submit($student, $assignment, $validated, $request->file('files', []));
        return back()->with('success', 'Rendu envoyé.');
    }

    public function download(Request $request, Course $course, CourseAssignment $assignment, CourseAssignmentSubmissionFile $file, LearningAccessService $access): StreamedResponse
    {
        /** @var User $student */
        $student = $request->user();
        $this->assertCourse($course, $assignment);
        $assignment->loadMissing(['module','lesson.module']);
        $file->loadMissing('submission');
        abort_unless((int) $file->submission?->assignment_id === (int) $assignment->id && (int) $file->submission?->user_id === (int) $student->id, 404);
        abort_unless($access->canAccessAssignment($student, $assignment), 403);
        abort_unless(Storage::disk('assignments')->exists($file->path), 404);
        return Storage::disk('assignments')->download($file->path, $file->original_name);
    }

    private function assertCourse(Course $course, CourseAssignment $assignment): void
    {
        abort_unless((int) $assignment->course_id === (int) $course->id, 404);
    }

    /** @return array<string,mixed> */
    private function submissionPayload(Course $course, CourseAssignment $assignment, $submission): array
    {
        return [
            'id' => $submission->id,
            'version' => (int) $submission->version,
            'status' => $submission->status->value,
            'textContent' => $submission->text_content,
            'linkUrl' => $submission->link_url,
            'scorePercent' => $submission->score_percent !== null ? (float) $submission->score_percent : null,
            'feedback' => $submission->review_feedback,
            'submittedAt' => $submission->submitted_at?->toIso8601String(),
            'reviewedAt' => $submission->reviewed_at?->toIso8601String(),
            'files' => $submission->files->map(fn ($file) => [
                'id' => $file->id, 'name' => $file->original_name,
                'url' => route('student.assignments.files.download', [$course, $assignment, $file]),
            ])->values(),
        ];
    }
}
