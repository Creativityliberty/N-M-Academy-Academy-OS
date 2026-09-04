<?php

declare(strict_types=1);

namespace App\Services\Completion;

use App\Data\CompletionStatus;
use App\Enums\AssignmentSubmissionStatus;
use App\Enums\CourseStatus;
use App\Models\Course;
use App\Models\CourseAssessmentAttempt;
use App\Models\CourseAssignmentSubmission;
use App\Models\CourseCertificate;
use App\Models\CourseCompletion;
use App\Models\CourseCompletionPolicy;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\User;
use App\Services\LearningAccess\LearningAccessService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CourseCompletionService
{
    public function __construct(private readonly LearningAccessService $access) {}

    public function status(User $student, Course $course): CompletionStatus
    {
        if (! (bool) config('academy.features.completion', true)) {
            return new CompletionStatus(0, 0, 0, 0, 0, 0, false);
        }

        $completion = CourseCompletion::query()
            ->where('course_id', $course->id)
            ->where('user_id', $student->id)
            ->with('certificate')
            ->first();

        if ($completion) {
            return $this->statusFromCompletion($completion);
        }

        $evidence = $this->collectEvidence($student, $course);

        return $this->statusFromEvidence($evidence, false, null, null);
    }

    public function evaluate(User $student, Course $course): ?CourseCompletion
    {
        if (! (bool) config('academy.features.completion', true) || $course->status !== CourseStatus::Published) {
            return null;
        }

        return DB::transaction(function () use ($student, $course): ?CourseCompletion {
            $enrollment = Enrollment::query()
                ->where('user_id', $student->id)
                ->where('course_id', $course->id)
                ->lockForUpdate()
                ->first();

            if (! $enrollment) {
                return null;
            }

            $existing = CourseCompletion::query()
                ->where('course_id', $course->id)
                ->where('user_id', $student->id)
                ->with('certificate')
                ->first();

            if ($existing) {
                return $existing;
            }

            $evidence = $this->collectEvidence($student, $course, $enrollment);
            if (! $evidence['eligible']) {
                return null;
            }

            $completion = CourseCompletion::query()->firstOrCreate(
                ['course_id' => $course->id, 'user_id' => $student->id],
                [
                    'enrollment_id' => $enrollment->id,
                    'evidence_snapshot' => $evidence['snapshot'],
                    'completed_at' => now(),
                ],
            );

            $policy = $this->policy($course);
            if ($policy->certificate_enabled && (bool) config('academy.features.certificates', true)) {
                $this->issueCertificate($student, $course, $completion, $policy);
            }

            return $completion->fresh('certificate');
        });
    }

    /** @return array{eligible:bool,snapshot:array<string,mixed>,counts:array<string,int>} */
    private function collectEvidence(User $student, Course $course, ?Enrollment $enrollment = null): array
    {
        $enrollment ??= Enrollment::query()
            ->where('user_id', $student->id)
            ->where('course_id', $course->id)
            ->first();

        if (! $enrollment) {
            return [
                'eligible' => false,
                'snapshot' => ['access_rank' => null, 'counts' => ['requirements_total' => 0, 'lessons_required' => 0, 'lessons_completed' => 0, 'assessments_required' => 0, 'assessments_passed' => 0, 'assignments_required' => 0, 'assignments_approved' => 0], 'lessons' => ['required' => [], 'completed' => []], 'assessments' => ['required' => [], 'passed' => []], 'assignments' => ['required' => [], 'approved' => []]],
                'counts' => ['requirements_total' => 0, 'lessons_required' => 0, 'lessons_completed' => 0, 'assessments_required' => 0, 'assessments_passed' => 0, 'assignments_required' => 0, 'assignments_approved' => 0],
            ];
        }

        $access_rank = (int) $enrollment->access_rank;
        $course->loadMissing(['modules.lessons']);
        $lessonIds = collect($this->access->entitledLessonIds($student, $course));

        $policy = $this->policy($course);
        $requiredLessonIds = $policy->require_all_accessible_lessons ? $lessonIds : collect();
        $completedLessonIds = LessonProgress::query()
            ->where('user_id', $student->id)
            ->whereIn('lesson_id', $requiredLessonIds)
            ->pluck('lesson_id')
            ->map(fn ($id) => (int) $id)
            ->values();

        $requiredAssessments = ! (bool) config('academy.features.assessments', true)
            ? collect()
            : $course->assessments()
                ->where('is_enabled', true)
                ->where('is_required_for_completion', true)
                ->with(['module', 'lesson.module'])
                ->get()
                ->filter(fn ($assessment) => $this->access->isEntitledAssessment($student, $assessment))
                ->pluck('id')->map(fn ($id) => (int) $id)->values();
        $passedAssessmentIds = CourseAssessmentAttempt::query()
            ->where('user_id', $student->id)
            ->where('passed', true)
            ->whereIn('assessment_id', $requiredAssessments)
            ->distinct()->pluck('assessment_id')->map(fn ($id) => (int) $id)->values();

        $requiredAssignments = ! (bool) config('academy.features.assignments', true)
            ? collect()
            : $course->assignments()
                ->where('is_enabled', true)
                ->where('is_required_for_completion', true)
                ->with(['module', 'lesson.module'])
                ->get()
                ->filter(fn ($assignment) => $this->access->isEntitledAssignment($student, $assignment))
                ->pluck('id')->map(fn ($id) => (int) $id)->values();
        $approvedAssignmentIds = CourseAssignmentSubmission::query()
            ->where('user_id', $student->id)
            ->where('status', AssignmentSubmissionStatus::Approved->value)
            ->whereIn('assignment_id', $requiredAssignments)
            ->distinct()->pluck('assignment_id')->map(fn ($id) => (int) $id)->values();

        $counts = [
            'requirements_total' => $requiredLessonIds->count() + $requiredAssessments->count() + $requiredAssignments->count(),
            'lessons_required' => $requiredLessonIds->count(),
            'lessons_completed' => $completedLessonIds->count(),
            'assessments_required' => $requiredAssessments->count(),
            'assessments_passed' => $passedAssessmentIds->count(),
            'assignments_required' => $requiredAssignments->count(),
            'assignments_approved' => $approvedAssignmentIds->count(),
        ];

        $eligible = $counts['requirements_total'] > 0
            && $counts['lessons_required'] === $counts['lessons_completed']
            && $counts['assessments_required'] === $counts['assessments_passed']
            && $counts['assignments_required'] === $counts['assignments_approved'];

        return [
            'eligible' => $eligible,
            'snapshot' => [
                'access_rank' => $access_rank,
                'counts' => $counts,
                'lessons' => ['required' => $requiredLessonIds->all(), 'completed' => $completedLessonIds->all()],
                'assessments' => ['required' => $requiredAssessments->all(), 'passed' => $passedAssessmentIds->all()],
                'assignments' => ['required' => $requiredAssignments->all(), 'approved' => $approvedAssignmentIds->all()],
            ],
            'counts' => $counts,
        ];
    }

    private function policy(Course $course): CourseCompletionPolicy
    {
        return CourseCompletionPolicy::query()->firstOrCreate(
            ['course_id' => $course->id],
            [
                'require_all_accessible_lessons' => (bool) config('academy.learning.completion.require_all_accessible_lessons', true),
                'certificate_enabled' => (bool) config('academy.features.certificates', true),
            ],
        );
    }

    private function issueCertificate(User $student, Course $course, CourseCompletion $completion, CourseCompletionPolicy $policy): CourseCertificate
    {
        $issuer = trim((string) ($policy->issuer_name ?: config('academy.learning.certificates.issuer_name') ?: config('academy.name', 'NÜM Academy')));
        $title = trim((string) ($policy->certificate_title ?: config('academy.learning.certificates.title', 'Certificat de réussite')));
        $issuedAt = now();
        $snapshot = [
            'completion_id' => $completion->id,
            'recipient_name' => $student->name,
            'course_title' => $course->title,
            'issuer_name' => $issuer,
            'certificate_title' => $title,
            'issued_at' => $issuedAt->toIso8601String(),
        ];

        return CourseCertificate::query()->firstOrCreate(
            ['completion_id' => $completion->id],
            [
                'user_id' => $student->id,
                'course_id' => $course->id,
                'verification_code' => (string) Str::uuid(),
                'recipient_name' => $student->name,
                'course_title' => $course->title,
                'issuer_name' => $issuer,
                'certificate_title' => $title,
                'document_hash' => hash('sha256', json_encode($snapshot, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: ''),
                'issued_at' => $issuedAt,
            ],
        );
    }

    private function certificateVerificationUrl(?CourseCertificate $certificate): ?string
    {
        if (! $certificate || ! (bool) config('academy.features.certificates', true) || ! (bool) config('academy.learning.certificates.public_verification', true)) {
            return null;
        }

        return route('certificates.verify', $certificate->verification_code);
    }

    private function certificatePdfUrl(?CourseCertificate $certificate): ?string
    {
        if (! $certificate || ! (bool) config('academy.features.certificates', true) || ! (bool) config('academy.learning.certificates.pdf_download', true)) {
            return null;
        }

        return route('student.certificates.pdf', $certificate);
    }

    private function certificateShareEnabled(?CourseCertificate $certificate): bool
    {
        return $certificate !== null
            && (bool) config('academy.features.certificates', true)
            && (bool) config('academy.learning.certificates.public_verification', true)
            && (bool) config('academy.learning.certificates.student_sharing', true);
    }

    private function statusFromCompletion(CourseCompletion $completion): CompletionStatus
    {
        $snapshot = $completion->evidence_snapshot;
        $certificate = $completion->certificate;

        return new CompletionStatus(
            lessonsRequired: count($snapshot['lessons']['required'] ?? []),
            lessonsCompleted: count($snapshot['lessons']['completed'] ?? []),
            assessmentsRequired: count($snapshot['assessments']['required'] ?? []),
            assessmentsPassed: count($snapshot['assessments']['passed'] ?? []),
            assignmentsRequired: count($snapshot['assignments']['required'] ?? []),
            assignmentsApproved: count($snapshot['assignments']['approved'] ?? []),
            completed: true,
            completedAt: $completion->completed_at?->toIso8601String(),
            certificateUrl: $this->certificateVerificationUrl($certificate),
            certificatePdfUrl: $this->certificatePdfUrl($certificate),
            certificateShareEnabled: $this->certificateShareEnabled($certificate),
            certificateVerificationCode: $certificate?->verification_code,
        );
    }

    /** @param array{eligible:bool,snapshot:array<string,mixed>,counts:array<string,int>} $evidence */
    private function statusFromEvidence(array $evidence, bool $completed, ?string $completedAt, ?CourseCertificate $certificate): CompletionStatus
    {
        $counts = $evidence['counts'];

        return new CompletionStatus(
            lessonsRequired: $counts['lessons_required'],
            lessonsCompleted: $counts['lessons_completed'],
            assessmentsRequired: $counts['assessments_required'],
            assessmentsPassed: $counts['assessments_passed'],
            assignmentsRequired: $counts['assignments_required'],
            assignmentsApproved: $counts['assignments_approved'],
            completed: $completed,
            completedAt: $completedAt,
            certificateUrl: $this->certificateVerificationUrl($certificate),
            certificatePdfUrl: $this->certificatePdfUrl($certificate),
            certificateShareEnabled: $this->certificateShareEnabled($certificate),
            certificateVerificationCode: $certificate?->verification_code,
        );
    }
}
