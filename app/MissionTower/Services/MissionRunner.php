<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Contracts\AcademyGateway;
use App\MissionTower\Models\TowerApproval;
use App\MissionTower\Models\TowerMission;
use App\MissionTower\Models\TowerMissionStep;
use App\MissionTower\Models\TowerRun;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Throwable;

class MissionRunner
{
    public function __construct(
        private readonly AcademyGateway $academy,
        private readonly EvidenceRecorder $evidence,
    ) {}

    public function start(TowerMission $mission, User $actor): TowerRun
    {
        $run = DB::transaction(function () use ($mission, $actor): TowerRun {
            /** @var TowerMission $locked */
            $locked = TowerMission::query()->lockForUpdate()->findOrFail($mission->id);
            $active = $locked->runs()->whereIn('status', ['running', 'awaiting_approval'])->exists();
            if ($active) {
                throw new RuntimeException('This mission already has an active run.');
            }

            $attempt = ((int) $locked->runs()->max('attempt')) + 1;
            $locked->steps()->update([
                'status' => 'pending',
                'result' => null,
                'error_message' => null,
                'started_at' => null,
                'completed_at' => null,
            ]);
            $locked->update([
                'status' => 'running',
                'started_at' => now(),
                'completed_at' => null,
            ]);

            return $locked->runs()->create([
                'triggered_by' => $actor->id,
                'status' => 'running',
                'attempt' => $attempt,
                'started_at' => now(),
            ]);
        });

        return $this->resume($run);
    }

    public function resume(TowerRun $run): TowerRun
    {
        $run->refresh();
        $mission = $run->mission()->firstOrFail();
        $run->update(['status' => 'running', 'error_message' => null]);
        $mission->update(['status' => 'running']);

        $steps = $mission->steps()->orderBy('position')->get();
        foreach ($steps as $step) {
            if ($step->status === 'succeeded') {
                continue;
            }
            if (! in_array($step->status, ['pending', 'running'], true)) {
                break;
            }

            $step->update(['status' => 'running', 'started_at' => $step->started_at ?: now()]);

            try {
                $result = $this->academy->call($step->tool, (array) ($step->arguments ?? []));
            } catch (Throwable $error) {
                return $this->fail($mission, $run, $step, $error->getMessage());
            }

            $resultType = (string) ($result['resultType'] ?? 'complete');
            if ($resultType === 'input_required') {
                $this->createApproval($mission, $run, $step, $result);
                $step->update(['status' => 'awaiting_approval']);
                $run->update(['status' => 'awaiting_approval']);
                $mission->update(['status' => 'awaiting_approval']);

                return $run->fresh();
            }

            if (($result['isError'] ?? false) === true) {
                $message = (string) data_get($result, 'structuredContent.error', 'Academy MCP tool failed.');

                return $this->fail($mission, $run, $step, $message, $result);
            }

            $this->completeStep($mission, $run, $step, $result);
        }

        if ($mission->steps()->where('status', '!=', 'succeeded')->doesntExist()) {
            $run->update([
                'status' => 'completed',
                'summary' => 'Mission completed successfully.',
                'completed_at' => now(),
            ]);
            $mission->update(['status' => 'completed', 'completed_at' => now()]);
            $this->evidence->record($mission, $run, null, 'mission_completed', 'recorded', 'Mission completed successfully.', source: 'mission_tower');
        }

        return $run->fresh();
    }

    /** @param array<string, mixed> $result */
    public function completeApprovedStep(TowerRun $run, TowerMissionStep $step, array $result): TowerRun
    {
        $mission = $run->mission()->firstOrFail();
        if (($result['isError'] ?? false) === true) {
            $message = (string) data_get($result, 'structuredContent.error', 'Approved Academy MCP tool failed.');

            return $this->fail($mission, $run, $step, $message, $result);
        }

        $this->completeStep($mission, $run, $step, $result);
        $run->update(['status' => 'running']);
        $mission->update(['status' => 'running']);

        return $this->resume($run->fresh());
    }

    /** @param array<string, mixed> $result */
    private function createApproval(TowerMission $mission, TowerRun $run, TowerMissionStep $step, array $result): TowerApproval
    {
        $params = (array) data_get($result, 'inputRequests.approval.params', []);
        $schema = is_array($params['requestedSchema'] ?? null) ? $params['requestedSchema'] : [];
        $requiredPhrase = data_get($schema, 'properties.phrase.const');
        $meta = is_array($result['_meta'] ?? null) ? $result['_meta'] : [];
        $receiptId = is_string($meta['com.numtema.academy/receiptId'] ?? null)
            ? $meta['com.numtema.academy/receiptId']
            : null;

        return TowerApproval::query()->updateOrCreate(
            ['run_id' => $run->id, 'step_id' => $step->id],
            [
                'mission_id' => $mission->id,
                'requested_for_id' => $mission->owner_id,
                'tool' => $step->tool,
                'risk' => $step->risk,
                'status' => 'pending',
                'message' => (string) ($params['message'] ?? "Approve {$step->tool}?"),
                'request_state' => (string) ($result['requestState'] ?? ''),
                'required_phrase' => is_string($requiredPhrase) ? $requiredPhrase : null,
                'requested_schema' => $schema,
                'arguments' => $step->arguments ?? [],
                'receipt_id' => $receiptId,
                'expires_at' => now()->addMinutes(15),
                'decided_by_id' => null,
                'decided_at' => null,
            ],
        );
    }

    /** @param array<string, mixed> $result */
    private function completeStep(TowerMission $mission, TowerRun $run, TowerMissionStep $step, array $result): void
    {
        $structured = is_array($result['structuredContent'] ?? null) ? $result['structuredContent'] : [];
        $data = is_array($structured['data'] ?? null) ? $structured['data'] : $structured;
        $receipt = is_array($structured['receipt'] ?? null) ? $structured['receipt'] : [];
        $receiptId = is_string($receipt['id'] ?? null) ? $receipt['id'] : null;

        $step->update([
            'status' => 'succeeded',
            'result' => $data,
            'error_message' => null,
            'completed_at' => now(),
        ]);

        $this->evidence->record(
            $mission,
            $run,
            $step,
            'tool_receipt',
            'recorded',
            "{$step->tool} executed successfully.",
            $result,
            $receiptId,
        );
    }

    /** @param array<string, mixed> $payload */
    private function fail(TowerMission $mission, TowerRun $run, TowerMissionStep $step, string $message, array $payload = []): TowerRun
    {
        $step->update(['status' => 'failed', 'error_message' => mb_substr($message, 0, 4000), 'completed_at' => now()]);
        $run->update(['status' => 'failed', 'error_message' => mb_substr($message, 0, 4000), 'completed_at' => now()]);
        $mission->update(['status' => 'failed', 'completed_at' => now()]);
        $this->evidence->record($mission, $run, $step, 'tool_error', 'failed', $message, $payload);

        return $run->fresh();
    }
}
