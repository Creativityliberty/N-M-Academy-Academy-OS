<?php

declare(strict_types=1);

namespace App\Services\Assignments;

use App\Enums\AssignmentSubmissionStatus;
use App\Models\CourseAssignmentSubmission;
use App\Models\User;
use App\Services\Completion\CourseCompletionService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AssignmentReviewService
{
    public function __construct(private readonly CourseCompletionService $completion) {}

    /** @param array<string,mixed> $payload */
    public function review(User $trainer, CourseAssignmentSubmission $submission, array $payload): CourseAssignmentSubmission
    {
        $reviewed = DB::transaction(function () use ($trainer, $submission, $payload): CourseAssignmentSubmission {
            $locked = CourseAssignmentSubmission::query()->lockForUpdate()->with(['assignment.course','assignment.rubricItems'])->findOrFail($submission->id);
            if ((int) $locked->assignment->course->trainer_id !== (int) $trainer->id && ! $trainer->isAdmin()) {
                throw new AuthorizationException('Ce rendu ne vous appartient pas.');
            }
            if ($locked->status !== AssignmentSubmissionStatus::Submitted) {
                throw ValidationException::withMessages(['submission' => 'Seul un rendu en attente peut être revu.']);
            }

            $decision = AssignmentSubmissionStatus::tryFrom((string) ($payload['decision'] ?? ''));
            if (! in_array($decision, [AssignmentSubmissionStatus::Approved, AssignmentSubmissionStatus::ChangesRequested], true)) {
                throw ValidationException::withMessages(['decision' => 'Décision invalide.']);
            }
            $feedback = trim((string) ($payload['feedback'] ?? ''));
            if ($decision === AssignmentSubmissionStatus::ChangesRequested && $feedback === '') {
                throw ValidationException::withMessages(['feedback' => 'Expliquez les corrections demandées.']);
            }

            $scores = (array) ($payload['rubric_scores'] ?? []);
            $normalized = [];
            $awarded = 0;
            $maximum = 0;
            foreach ($locked->assignment->rubricItems as $item) {
                $value = (int) ($scores[(string) $item->id] ?? $scores[$item->id] ?? 0);
                if ($value < 0 || $value > (int) $item->max_points) {
                    throw ValidationException::withMessages(['rubric_scores' => "Score invalide pour {$item->criterion}."]);
                }
                $normalized[(string) $item->id] = $value;
                $awarded += $value;
                $maximum += (int) $item->max_points;
            }
            $scorePercent = $maximum > 0 ? round(($awarded / $maximum) * 100, 2) : 0.0;

            $locked->update([
                'status' => $decision->value,
                'rubric_scores' => $normalized,
                'score_percent' => $scorePercent,
                'review_feedback' => $feedback !== '' ? $feedback : null,
                'reviewed_by' => $trainer->id,
                'reviewed_at' => now(),
            ]);

            return $locked->fresh(['files','assignment.rubricItems']);
        });

        if ($reviewed->status === AssignmentSubmissionStatus::Approved) {
            $reviewed->loadMissing(['user', 'assignment.course']);
            if ($reviewed->user && $reviewed->assignment?->course) {
                $this->completion->evaluate($reviewed->user, $reviewed->assignment->course);
            }
        }

        return $reviewed;
    }
}
