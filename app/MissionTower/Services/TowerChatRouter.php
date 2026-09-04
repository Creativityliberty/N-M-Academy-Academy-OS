<?php

declare(strict_types=1);

namespace App\MissionTower\Services;

use App\MissionTower\Models\TowerChatThread;
use App\Models\User;

class TowerChatRouter
{
    public function __construct(
        private readonly TowerAiProviderResolver $providers,
        private readonly TowerChatContextBuilder $context,
    ) {}

    /** @return array{intent:string,answer:string,action_prompt:string,reason:string,memory_candidates:list<array<string,mixed>>} */
    public function route(User $user, TowerChatThread $thread): array
    {
        $provider = $this->providers->resolve();
        $historyLimit = max(2, min(20, (int) config('mission-tower.chat.history_messages', 8)));
        $conversation = $thread->messages()->latest('id')->limit($historyLimit)->get()->reverse()->map(
            fn ($message): array => [
                'role' => $message->role,
                'type' => $message->type,
                'content' => mb_substr((string) $message->content, 0, 8000),
            ],
        )->values()->all();

        $latestUserMessage = (string) ($thread->messages()->where('role', 'user')->latest('id')->value('content') ?? '');
        $towerContext = $this->context->build($user, $latestUserMessage, $thread);
        $thread_summary = trim((string) ($thread->summary ?? ''));

        $result = $provider->structured(
            <<<'PROMPT'
You are the conversation router for NÜM Mission Tower.
Classify the conversation into exactly one intent:
- direct_answer: greetings, explanations about how Tower works, general non-Academy knowledge, OR a question fully answerable from the supplied TOWER CONTEXT (open insights, pending approvals, recent missions, DURABLE MEMORY).
- academy_action: ANY request that needs current Academy data, Observatory data, a business calculation based on Academy state, or any mutation/action.

Rules:
- Langue par défaut : français. Réponds en français sauf si l'utilisateur demande explicitement une autre langue.
- Focus on the latest user message and answer that request specifically, using earlier turns only to resolve context.
- Do not repeat greetings, introductions, or generic welcome text after the conversation has started.
- If a required detail is missing, ask one concise targeted question in French instead of restarting the conversation.
- Never fabricate current Academy facts in direct_answer. Use TOWER CONTEXT and DURABLE MEMORY only when they directly support the answer. Durable memory is historical/contextual, never a substitute for current metrics.
- Extract at most five durable memory candidates from the newest user turn. Store only stable preferences, decisions, goals, constraints or reusable context that will still matter later.
- Do NOT store secrets, credentials, provider keys, MCP tokens, approval requestState, raw student PII, or transient Academy metrics.
- Use scope academy for information useful across conversations; use thread only for temporary context specific to this conversation.
- memory candidate keys must be short stable semantic identifiers such as preferred-launch-day or pricing-policy.
- If the user asks "what is happening", "how many", "who", "which course", "sales", "students", "events", "community", "AI cost", or similar current Academy information, choose academy_action.
- If there is any doubt, choose academy_action.
- Pour academy_action, action_prompt doit être une instruction autonome en français par défaut, en résolvant les pronoms depuis la conversation récente quand c'est possible, sans inventer d'ID ni de faits ; utilise une autre langue uniquement si l'utilisateur la demande explicitement.
- Pour direct_answer, réponds directement et avec concision en français par défaut ; utilise une autre langue uniquement si l'utilisateur la demande explicitement.
- direct_answer may use clean Markdown: short headings, **bold** emphasis, bullet lists and tables when they improve clarity.
- Do not output raw JSON in direct_answer unless the user explicitly requests JSON.
PROMPT,
            "TOWER CONTEXT (includes DURABLE MEMORY):\n".json_encode($towerContext, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)."\n\nTHREAD SUMMARY:\n".$thread_summary."\n\nCONVERSATION:\n".json_encode($conversation, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'tower_chat_route',
            [
                'type' => 'object',
                'additionalProperties' => false,
                'properties' => [
                    'intent' => ['type' => 'string', 'enum' => ['direct_answer', 'academy_action']],
                    'answer' => ['type' => 'string', 'maxLength' => 8000],
                    'action_prompt' => ['type' => 'string', 'maxLength' => 12000],
                    'reason' => ['type' => 'string', 'maxLength' => 1000],
                    'memory_candidates' => [
                        'type' => 'array', 'maxItems' => 5,
                        'items' => [
                            'type' => 'object', 'additionalProperties' => false,
                            'properties' => [
                                'key' => ['type' => 'string', 'maxLength' => 140],
                                'category' => ['type' => 'string', 'enum' => ['preference', 'decision', 'goal', 'constraint', 'context']],
                                'scope' => ['type' => 'string', 'enum' => ['academy', 'thread']],
                                'content' => ['type' => 'string', 'maxLength' => 4000],
                                'importance' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 5],
                            ],
                            'required' => ['key', 'category', 'scope', 'content', 'importance'],
                        ],
                    ],
                ],
                'required' => ['intent', 'answer', 'action_prompt', 'reason', 'memory_candidates'],
            ],
        );

        $intent = in_array($result['intent'] ?? null, ['direct_answer', 'academy_action'], true)
            ? (string) $result['intent']
            : 'academy_action';

        $memoryCandidates = is_array($result['memory_candidates'] ?? null) ? array_slice($result['memory_candidates'], 0, 5) : [];

        return [
            'intent' => $intent,
            'answer' => trim((string) ($result['answer'] ?? '')),
            'action_prompt' => trim((string) ($result['action_prompt'] ?? '')),
            'reason' => trim((string) ($result['reason'] ?? '')),
            'memory_candidates' => $memoryCandidates,
        ];
    }
}
