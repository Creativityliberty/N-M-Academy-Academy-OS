<?php

declare(strict_types=1);

namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseCertificate;
use App\Models\CourseCompletionPolicy;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CompletionController extends Controller
{
    public function show(Request $request, Course $course): Response
    {
        $this->authorizeCourse($request->user(), $course);
        $policy = CourseCompletionPolicy::query()->firstOrCreate(
            ['course_id' => $course->id],
            ['require_all_accessible_lessons' => true, 'certificate_enabled' => true],
        );

        $course->load([
            'assessments' => fn ($query) => $query->where('is_enabled', true)->orderBy('position')->orderBy('id'),
            'assignments' => fn ($query) => $query->where('is_enabled', true)->orderBy('position')->orderBy('id'),
        ]);

        $certificates = $course->certificates()->with('user:id,name')->latest('issued_at')->limit(100)->get();

        return Inertia::render('trainer/courses/completion/index', [
            'course' => ['id' => $course->id, 'title' => $course->title],
            'policy' => [
                'requireAllAccessibleLessons' => $policy->require_all_accessible_lessons,
                'certificateEnabled' => $policy->certificate_enabled,
                'certificateTitle' => $policy->certificate_title,
                'issuerName' => $policy->issuer_name,
            ],
            'assessments' => $course->assessments->map(fn ($assessment) => [
                'id' => $assessment->id,
                'title' => $assessment->title,
                'required' => (bool) $assessment->is_required_for_completion,
            ])->values(),
            'assignments' => $course->assignments->map(fn ($assignment) => [
                'id' => $assignment->id,
                'title' => $assignment->title,
                'required' => (bool) $assignment->is_required_for_completion,
            ])->values(),
            'stats' => [
                'completionCount' => $course->completions()->count(),
                'certificateCount' => $course->certificates()->count(),
                'activeCertificateCount' => $course->certificates()->whereNull('revoked_at')->count(),
            ],
            'certificates' => $certificates->map(fn (CourseCertificate $certificate) => [
                'id' => $certificate->id,
                'recipientName' => $certificate->recipient_name,
                'verificationCode' => $certificate->verification_code,
                'issuedAt' => $certificate->issued_at?->toIso8601String(),
                'revokedAt' => $certificate->revoked_at?->toIso8601String(),
                'revocationReason' => $certificate->revocation_reason,
                'verifyUrl' => url('/certificates/verify/'.$certificate->verification_code),
            ])->values(),
        ]);
    }

    public function update(Request $request, Course $course): RedirectResponse
    {
        $this->authorizeCourse($request->user(), $course);
        $validated = $request->validate([
            'require_all_accessible_lessons' => ['required', 'boolean'],
            'certificate_enabled' => ['required', 'boolean'],
            'certificate_title' => ['nullable', 'string', 'max:160'],
            'issuer_name' => ['nullable', 'string', 'max:160'],
            'assessment_required_ids' => ['array'],
            'assessment_required_ids.*' => ['integer'],
            'assignment_required_ids' => ['array'],
            'assignment_required_ids.*' => ['integer'],
        ]);

        $assessmentIds = collect($validated['assessment_required_ids'] ?? [])->map(fn ($id) => (int) $id)->unique()->values();
        $assignmentIds = collect($validated['assignment_required_ids'] ?? [])->map(fn ($id) => (int) $id)->unique()->values();

        if ($assessmentIds->isNotEmpty() && $course->assessments()->whereIn('id', $assessmentIds)->count() !== $assessmentIds->count()) {
            throw ValidationException::withMessages(['assessment_required_ids' => 'Une évaluation sélectionnée n’appartient pas à cette formation.']);
        }
        if ($assignmentIds->isNotEmpty() && $course->assignments()->whereIn('id', $assignmentIds)->count() !== $assignmentIds->count()) {
            throw ValidationException::withMessages(['assignment_required_ids' => 'Un assignment sélectionné n’appartient pas à cette formation.']);
        }

        DB::transaction(function () use ($course, $validated, $assessmentIds, $assignmentIds): void {
            CourseCompletionPolicy::query()->updateOrCreate(
                ['course_id' => $course->id],
                [
                    'require_all_accessible_lessons' => (bool) $validated['require_all_accessible_lessons'],
                    'certificate_enabled' => (bool) $validated['certificate_enabled'],
                    'certificate_title' => filled($validated['certificate_title'] ?? null) ? trim((string) $validated['certificate_title']) : null,
                    'issuer_name' => filled($validated['issuer_name'] ?? null) ? trim((string) $validated['issuer_name']) : null,
                ],
            );

            $course->assessments()->update(['is_required_for_completion' => false]);
            if ($assessmentIds->isNotEmpty()) {
                $course->assessments()->whereIn('id', $assessmentIds)->update(['is_required_for_completion' => true]);
            }

            $course->assignments()->update(['is_required_for_completion' => false]);
            if ($assignmentIds->isNotEmpty()) {
                $course->assignments()->whereIn('id', $assignmentIds)->update(['is_required_for_completion' => true]);
            }
        });

        return back()->with('success', 'Règles de complétion enregistrées.');
    }

    public function revoke(Request $request, Course $course, CourseCertificate $certificate): RedirectResponse
    {
        $this->authorizeCourse($request->user(), $course);
        abort_unless((int) $certificate->course_id === (int) $course->id, 404);

        $validated = $request->validate([
            'revocation_reason' => ['required', 'string', 'min:5', 'max:500'],
        ]);

        if ($certificate->revoked_at) {
            throw ValidationException::withMessages(['certificate' => 'Ce certificat est déjà révoqué.']);
        }

        $certificate->update([
            'revoked_at' => now(),
            'revoked_by' => $request->user()->id,
            'revocation_reason' => trim($validated['revocation_reason']),
        ]);

        return back()->with('success', 'Certificat révoqué.');
    }

    private function authorizeCourse(?User $user, Course $course): void
    {
        abort_unless($user && (int) $course->trainer_id === (int) $user->id, 403);
    }
}
