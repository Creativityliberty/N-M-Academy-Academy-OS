<?php

declare(strict_types=1);

namespace App\MissionTower\Http\Controllers;

use App\Http\Controllers\Controller;
use App\MissionTower\Models\TowerApproval;
use App\MissionTower\Models\TowerChatMessage;
use App\MissionTower\Models\TowerChatThread;
use App\MissionTower\Services\TowerAccess;
use App\MissionTower\Services\TowerChatService;
use App\MissionTower\Services\TowerReadiness;
use App\MissionTower\Services\TowerToolCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TowerChatController extends Controller
{
    public function __construct(
        private readonly TowerAccess $access,
        private readonly TowerChatService $chat,
        private readonly TowerReadiness $readiness,
        private readonly TowerToolCatalog $tools,
    ) {}

    public function index(Request $request): Response
    {
        $this->ensureEnabled();
        $thread = $this->access->chatThreadQuery($request->user())->latest('last_message_at')->first();

        return $this->render($request, $thread);
    }

    public function show(Request $request, TowerChatThread $thread): Response
    {
        $this->ensureEnabled();
        $this->access->assertChatThread($request->user(), $thread);

        return $this->render($request, $thread);
    }

    public function sendNew(Request $request): RedirectResponse
    {
        $this->extendExecutionWindow();
        $this->ensureEnabled();
        $data = $request->validate(['message' => ['required', 'string', 'max:12000']]);
        $thread = $this->chat->createThread($request->user());
        $this->chat->send($request->user(), $thread, $data['message']);

        return redirect()->route('tower.chat.show', $thread);
    }

    public function send(Request $request, TowerChatThread $thread): RedirectResponse
    {
        $this->extendExecutionWindow();
        $this->ensureEnabled();
        $this->access->assertChatThread($request->user(), $thread);
        $data = $request->validate(['message' => ['required', 'string', 'max:12000']]);
        $this->chat->send($request->user(), $thread, $data['message']);

        return redirect()->route('tower.chat.show', $thread);
    }

    public function decide(Request $request, TowerChatThread $thread, TowerApproval $approval): RedirectResponse
    {
        $this->extendExecutionWindow();
        $this->ensureEnabled();
        $this->access->assertChatThread($request->user(), $thread);
        $this->access->assertApproval($request->user(), $approval);
        $data = $request->validate([
            'decision' => ['required', 'in:approve,reject'],
            'phrase' => ['nullable', 'string', 'max:500'],
        ]);
        $this->chat->decide($request->user(), $thread, $approval, $data['decision'], $data['phrase'] ?? null);

        return redirect()->route('tower.chat.show', $thread);
    }


    private function extendExecutionWindow(): void
    {
        if (function_exists('set_time_limit')) {
            @set_time_limit(max(30, (int) config('mission-tower.chat.request_timeout_seconds', 180)));
        }
    }

    private function ensureEnabled(): void
    {
        abort_unless((bool) config('mission-tower.chat.enabled', true), 404);
    }

    private function render(Request $request, ?TowerChatThread $thread): Response
    {
        $threads = $this->access->chatThreadQuery($request->user())
            ->latest('last_message_at')
            ->limit(40)
            ->get()
            ->map(fn (TowerChatThread $item): array => [
                'id' => $item->id,
                'title' => $item->title,
                'status' => $item->status,
                'lastMessageAt' => $item->last_message_at?->toIso8601String(),
            ]);

        $messages = $thread?->messages()->with([
            'approval:id,status,tool,risk,required_phrase,expires_at',
            'mission:id,title,status',
            'mission.steps:id,mission_id,title,tool,risk,status,position',
            'run:id,status',
            'run.evidence:id,run_id,type,status,receipt_id,summary,recorded_at',
        ])->get()
            ->map(fn (TowerChatMessage $message): array => $this->messageDto($message)) ?? collect();
        $catalog = $this->tools->keyed();
        $read = $write = $sensitive = 0;
        foreach ($catalog as $tool) {
            match ($tool['risk'] ?? 'read') {
                'sensitive' => $sensitive++,
                'write' => $write++,
                default => $read++,
            };
        }

        return Inertia::render('mission-tower/chat', [
            'thread' => $thread ? ['id' => $thread->id, 'title' => $thread->title, 'status' => $thread->status] : null,
            'threads' => $threads,
            'messages' => $messages,
            'connection' => [
                'ready' => $this->readiness->snapshot(false)['ready'] ?? false,
                'tools' => count($catalog),
                'read' => $read,
                'write' => $write,
                'sensitive' => $sensitive,
            ],
            'maxMessageLength' => (int) config('mission-tower.chat.max_message_length', 12000),
        ]);
    }

    /** @return array<string, mixed> */
    private function messageDto(TowerChatMessage $message): array
    {
        return [
            'id' => $message->id,
            'role' => $message->role,
            'type' => $message->type,
            'status' => $message->status,
            'content' => $message->content,
            'metadata' => $message->metadata ?? [],
            'mission' => $message->mission ? ['id' => $message->mission->id, 'title' => $message->mission->title, 'status' => $message->mission->status] : null,
            'run' => $message->run ? ['id' => $message->run->id, 'status' => $message->run->status] : null,
            'approval' => $message->approval ? [
                'id' => $message->approval->id,
                'status' => $message->approval->status,
                'tool' => $message->approval->tool,
                'risk' => $message->approval->risk,
                'required_phrase' => $message->approval->required_phrase,
                'expires_at' => $message->approval->expires_at?->toIso8601String(),
            ] : null,
            'tools' => $message->mission?->steps?->map(fn ($step): array => [
                'id' => $step->id,
                'title' => $step->title,
                'tool' => $step->tool,
                'risk' => $step->risk,
                'status' => $step->status,
                'position' => $step->position,
            ])->values()->all() ?? [],
            'evidence' => $message->run?->evidence?->take(4)->map(fn ($item): array => [
                'id' => $item->id,
                'type' => $item->type,
                'status' => $item->status,
                'receiptId' => $item->receipt_id,
                'summary' => $item->summary,
                'recordedAt' => $item->recorded_at?->toIso8601String(),
            ])->values()->all() ?? [],
            'evidenceCount' => $message->run?->evidence?->count() ?? 0,
            'createdAt' => $message->created_at?->toIso8601String(),
        ];
    }
}
