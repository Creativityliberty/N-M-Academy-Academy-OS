<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerApproval;
use App\MissionTower\Models\TowerChatMessage;
use App\MissionTower\Models\TowerChatThread;
use App\MissionTower\Models\TowerMission;
use App\MissionTower\Models\TowerRun;
use App\Models\User;
use RuntimeException;
use Throwable;

class TowerChatService
{
    public function __construct(
        private readonly TowerChatRouter $router,
        private readonly MissionCompiler $compiler,
        private readonly CompilationApplyService $apply,
        private readonly MissionRunner $runner,
        private readonly ApprovalDecisionService $approvals,
        private readonly TowerChatResponseComposer $responses,
        private readonly TowerMemoryStore $memory,
        private readonly TowerThreadSummarizer $summarizer,
    ) {}

    public function createThread(User $user, ?string $title = null): TowerChatThread
    {
        return TowerChatThread::create([
            'owner_id' => $user->id,
            'title' => $title !== null && trim($title) !== '' ? mb_substr(trim($title), 0, 180) : 'Nouvelle conversation',
            'status' => 'active',
            'last_message_at' => now(),
        ]);
    }

    public function send(User $user, TowerChatThread $thread, string $content): TowerChatMessage
    {
        if (! (bool) config('mission-tower.chat.enabled', true)) {
            throw new RuntimeException('Tower Chat est désactivé.');
        }

        $content = trim($content);
        if ($content === '' || mb_strlen($content) > (int) config('mission-tower.chat.max_message_length', 12000)) {
            throw new \InvalidArgumentException('Le message Tower doit contenir entre 1 et 12000 caractères.');
        }

        $userMessage = $thread->messages()->create([
            'role' => 'user', 'type' => 'text', 'status' => 'complete', 'content' => $content,
        ]);
        $this->touchThread($thread, $content);

        try {
            $route = $this->router->route($user, $thread->fresh());
            $this->memory->rememberCandidates($user, $thread, $userMessage, (array) ($route['memory_candidates'] ?? []));
            if ($route['intent'] === 'direct_answer') {
                return $this->assistant($thread, 'text', $route['answer'] !== '' ? $route['answer'] : 'Je suis prêt. Que veux-tu piloter dans ton Academy ?');
            }

            $actionPrompt = $route['action_prompt'] !== '' ? $route['action_prompt'] : $content;
            $compilation = $this->compiler->compile($user, $actionPrompt);
            $mission = $this->apply->apply($compilation, $user);
            $metadata = (array) ($mission->metadata ?? []);
            $metadata['chat_thread_id'] = $thread->id;
            $metadata['chat_user_message_id'] = $userMessage->id;
            $metadata['chat_auto_compiled'] = true;
            $mission->update(['source' => 'tower_chat', 'metadata' => $metadata]);

            $risk = (array) data_get($compilation->proposal, 'riskSummary', []);
            $readOnly = ((int) ($risk['write'] ?? 0) + (int) ($risk['sensitive'] ?? 0)) === 0;
            if ($readOnly && ! (bool) config('mission-tower.chat.auto_run_read', true)) {
                return $this->assistant(
                    $thread,
                    'mission_draft',
                    'La mission READ a été compilée mais l’exécution automatique des lectures est désactivée.',
                    ['run_status' => 'draft'],
                    $compilation->id,
                    $mission,
                );
            }

            $run = $this->runner->start($mission->fresh(), $user);

            return $this->messageForRun($thread, $mission->fresh(), $run->fresh(), $compilation->id);
        } catch (Throwable $error) {
            return $this->assistant($thread, 'error', 'Je n’ai pas pu traiter cette demande : '.mb_substr($error->getMessage(), 0, 2000), [
                'error_class' => class_basename($error),
            ], status: 'failed');
        }
    }

    public function decide(User $user, TowerChatThread $thread, TowerApproval $approval, string $decision, ?string $phrase = null): TowerChatMessage
    {
        $mission = $approval->mission()->firstOrFail();
        if ((int) data_get($mission->metadata, 'chat_thread_id') !== $thread->id) {
            throw new RuntimeException('Cette approval n’appartient pas à cette conversation Tower.');
        }

        try {
            $run = $this->approvals->decide($approval, $user, $decision, $phrase);
            $thread->messages()->create([
                'role' => 'user',
                'type' => 'approval_decision',
                'status' => 'complete',
                'content' => $decision === 'approve' ? 'Action approuvée.' : 'Action refusée.',
                'mission_id' => $mission->id,
                'run_id' => $approval->run_id,
                'approval_id' => $approval->id,
                'metadata' => ['decision' => $decision],
            ]);
            $this->touchThread($thread);

            return $this->messageForRun($thread, $mission->fresh(), $run->fresh());
        } catch (Throwable $error) {
            return $this->assistant($thread, 'error', 'La décision n’a pas pu être appliquée : '.mb_substr($error->getMessage(), 0, 2000), [
                'approval_id' => $approval->id,
            ], mission: $mission, run: $approval->run, approval: $approval, status: 'failed');
        }
    }

    private function messageForRun(TowerChatThread $thread, TowerMission $mission, TowerRun $run, ?int $compilationId = null): TowerChatMessage
    {
        $run->refresh();
        if ($run->status === 'awaiting_approval') {
            $approval = $run->approvals()->where('status', 'pending')->oldest('id')->first();
            if (! $approval) {
                return $this->assistant($thread, 'error', 'La mission attend une validation mais aucune approval active n’a été trouvée.', mission: $mission, run: $run, status: 'failed');
            }

            return $this->assistant(
                $thread,
                'approval_required',
                $approval->message,
                [
                    'tool' => $approval->tool,
                    'risk' => $approval->risk,
                    'arguments' => $approval->arguments ?? [],
                    'required_phrase' => $approval->required_phrase,
                    'expires_at' => $approval->expires_at?->toIso8601String(),
                    'receipt_id' => $approval->receipt_id,
                ],
                $compilationId,
                $mission,
                $run,
                $approval,
                'waiting',
            );
        }

        if (in_array($run->status, ['completed', 'failed', 'cancelled'], true)) {
            $message = $this->assistant(
                $thread,
                'mission_result',
                $this->responses->compose($mission, $run),
                ['run_status' => $run->status],
                $compilationId,
                $mission,
                $run,
                status: $run->status === 'completed' ? 'complete' : 'failed',
            );
            if ($run->status === 'completed') {
                try { $this->memory->rememberMissionResult($mission, $run, $message); } catch (Throwable) {}
            }
            return $message;
        }

        return $this->assistant($thread, 'mission_result', 'Mission lancée. Tu peux suivre son exécution dans Runs.', [
            'run_status' => $run->status,
        ], $compilationId, $mission, $run, status: 'running');
    }

    /** @param array<string, mixed> $metadata */
    private function assistant(
        TowerChatThread $thread,
        string $type,
        string $content,
        array $metadata = [],
        ?int $compilationId = null,
        ?TowerMission $mission = null,
        ?TowerRun $run = null,
        ?TowerApproval $approval = null,
        string $status = 'complete',
    ): TowerChatMessage {
        $message = $thread->messages()->create([
            'role' => 'assistant',
            'type' => $type,
            'status' => $status,
            'content' => $content,
            'compilation_id' => $compilationId,
            'mission_id' => $mission?->id,
            'run_id' => $run?->id,
            'approval_id' => $approval?->id,
            'metadata' => $metadata,
        ]);
        $this->touchThread($thread);
        $this->summarizer->maybeSummarize($thread->fresh());

        return $message;
    }

    private function touchThread(TowerChatThread $thread, ?string $firstContent = null): void
    {
        $updates = ['last_message_at' => now()];
        if ($firstContent !== null && $thread->title === 'Nouvelle conversation') {
            $updates['title'] = mb_substr(preg_replace('/\s+/', ' ', trim($firstContent)) ?: 'Nouvelle conversation', 0, 72);
        }
        $thread->update($updates);
    }
}
