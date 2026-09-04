<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Contracts\AcademyGateway;
use App\MissionTower\Models\TowerApproval;
use App\MissionTower\Models\TowerRun;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Throwable;

class ApprovalDecisionService
{
    public function __construct(
        private readonly AcademyGateway $academy,
        private readonly MissionRunner $runner,
        private readonly EvidenceRecorder $evidence,
    ) {}

    public function decide(TowerApproval $approval, User $actor, string $decision, ?string $phrase = null): TowerRun
    {
        $approval->refresh();
        if ($approval->status !== 'pending') {
            throw new RuntimeException('This approval has already been decided.');
        }
        if ($approval->expires_at?->isPast()) {
            $approval->update(['status' => 'expired', 'decided_at' => now(), 'decided_by_id' => $actor->id]);
            $approval->step->update(['status' => 'expired', 'completed_at' => now()]);
            $approval->run->update(['status' => 'failed', 'error_message' => 'Approval expired.', 'completed_at' => now()]);
            $approval->mission->update(['status' => 'failed', 'completed_at' => now()]);
            $this->evidence->record($approval->mission, $approval->run, $approval->step, 'approval_expired', 'failed', 'Approval expired before execution.', source: 'mission_tower');
            throw ValidationException::withMessages(['approval' => 'This approval request has expired. Run the mission again.']);
        }

        if ($decision === 'reject') {
            $approval->update(['status' => 'rejected', 'decided_at' => now(), 'decided_by_id' => $actor->id]);
            $approval->step->update(['status' => 'rejected', 'completed_at' => now()]);
            $approval->run->update(['status' => 'cancelled', 'summary' => 'Mission stopped because an action was rejected.', 'completed_at' => now()]);
            $approval->mission->update(['status' => 'cancelled', 'completed_at' => now()]);
            $this->evidence->record($approval->mission, $approval->run, $approval->step, 'approval_decision', 'rejected', "{$actor->name} rejected {$approval->tool}.", [
                'approval_id' => $approval->id,
                'decision' => 'reject',
            ], $approval->receipt_id, 'mission_tower');

            return $approval->run->fresh();
        }

        if ($decision !== 'approve') {
            throw ValidationException::withMessages(['decision' => 'Decision must be approve or reject.']);
        }
        if ($approval->required_phrase !== null && ! hash_equals($approval->required_phrase, (string) $phrase)) {
            throw ValidationException::withMessages(['phrase' => 'Type the exact approval phrase before executing this sensitive action.']);
        }

        $claimed = TowerApproval::query()
            ->whereKey($approval->id)
            ->where('status', 'pending')
            ->update(['status' => 'processing', 'decided_by_id' => $actor->id, 'decided_at' => now()]);
        if ($claimed !== 1) {
            throw new RuntimeException('This approval is already being processed.');
        }
        $approval->refresh();

        $inputResponses = [
            'approval' => [
                'action' => 'accept',
                'content' => $approval->required_phrase !== null
                    ? ['phrase' => $approval->required_phrase]
                    : ['confirm' => true],
            ],
        ];

        try {
            $result = $this->academy->call(
                $approval->tool,
                (array) ($approval->arguments ?? []),
                $approval->request_state,
                $inputResponses,
            );
        } catch (Throwable $error) {
            $approval->update(['status' => 'failed']);
            $approval->step->update(['status' => 'failed', 'error_message' => mb_substr($error->getMessage(), 0, 4000), 'completed_at' => now()]);
            $approval->run->update(['status' => 'failed', 'error_message' => mb_substr($error->getMessage(), 0, 4000), 'completed_at' => now()]);
            $approval->mission->update(['status' => 'failed', 'completed_at' => now()]);
            $this->evidence->record($approval->mission, $approval->run, $approval->step, 'approval_execution_error', 'failed', $error->getMessage(), source: 'mission_tower');

            return $approval->run->fresh();
        }

        if (($result['resultType'] ?? 'complete') === 'input_required') {
            $approval->update(['status' => 'failed']);
            $approval->step->update(['status' => 'failed', 'error_message' => 'Unexpected second approval round.', 'completed_at' => now()]);
            $approval->run->update(['status' => 'failed', 'error_message' => 'Unexpected second approval round.', 'completed_at' => now()]);
            $approval->mission->update(['status' => 'failed', 'completed_at' => now()]);
            throw new RuntimeException('Academy MCP requested a second approval round unexpectedly.');
        }

        $approval->update(['status' => 'approved']);
        $this->evidence->record($approval->mission, $approval->run, $approval->step, 'approval_decision', 'approved', "{$actor->name} approved {$approval->tool}.", [
            'approval_id' => $approval->id,
            'decision' => 'approve',
        ], $approval->receipt_id, 'mission_tower');

        // Resume the exact governed MCP call, then continue the remaining mission steps.
        return $this->runner->completeApprovedStep($approval->run, $approval->step, $result);
    }
}
