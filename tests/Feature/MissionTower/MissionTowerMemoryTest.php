<?php

declare(strict_types=1);

use App\AI\Contracts\AiProvider;
use App\MissionTower\Models\TowerChatThread;
use App\MissionTower\Models\TowerMemory;
use App\MissionTower\Services\TowerAiProviderResolver;
use App\MissionTower\Services\TowerMemoryRetriever;
use App\MissionTower\Services\TowerMemoryStore;
use App\MissionTower\Services\TowerThreadSummarizer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    config([
        'mission-tower.memory.enabled' => true,
        'mission-tower.memory.semantic' => false,
        'mission-tower.memory.max_context' => 8,
        'mission-tower.memory.retention_days' => 365,
        'mission-tower.memory.thread_retention_days' => 30,
        'mission-tower.chat.history_messages' => 4,
        'mission-tower.chat.summary_trigger_messages' => 8,
        'mission-tower.chat.summary_batch_messages' => 8,
    ]);
});

it('stores durable candidates and supersedes an older value for the same memory key', function () {
    $user = User::factory()->create();
    $thread = TowerChatThread::create(['owner_id' => $user->id, 'title' => 'Memory test', 'status' => 'active']);
    $source = $thread->messages()->create(['role' => 'user', 'type' => 'text', 'status' => 'complete', 'content' => 'Je préfère lancer les lives le jeudi.']);

    app(TowerMemoryStore::class)->rememberCandidates($user, $thread, $source, [[
        'key' => 'preferred-live-day', 'category' => 'preference', 'scope' => 'academy',
        'content' => 'Les lives sont préférés le jeudi.', 'importance' => 4,
    ]]);

    $second = $thread->messages()->create(['role' => 'user', 'type' => 'text', 'status' => 'complete', 'content' => 'Finalement vendredi.']);
    app(TowerMemoryStore::class)->rememberCandidates($user, $thread, $second, [[
        'key' => 'preferred-live-day', 'category' => 'preference', 'scope' => 'academy',
        'content' => 'Les lives sont préférés le vendredi.', 'importance' => 5,
    ]]);

    expect(TowerMemory::query()->count())->toBe(2)
        ->and(TowerMemory::query()->where('status', 'superseded')->value('content'))->toContain('jeudi')
        ->and(TowerMemory::query()->where('status', 'active')->value('content'))->toContain('vendredi');
});

it('rejects secret-like content instead of promoting it to durable memory', function () {
    $user = User::factory()->create();
    $thread = TowerChatThread::create(['owner_id' => $user->id, 'title' => 'Secrets', 'status' => 'active']);
    $source = $thread->messages()->create(['role' => 'user', 'type' => 'text', 'status' => 'complete', 'content' => 'secret']);

    app(TowerMemoryStore::class)->rememberCandidates($user, $thread, $source, [[
        'key' => 'openai-key', 'category' => 'context', 'scope' => 'academy',
        'content' => 'OPENAI_API_KEY=TEST_ONLY_NEVER_REAL', 'importance' => 5,
    ]]);

    expect(TowerMemory::query()->count())->toBe(0);
});

it('retrieves relevant active memory without requiring embeddings', function () {
    $user = User::factory()->create();
    $thread = TowerChatThread::create(['owner_id' => $user->id, 'title' => 'Retrieval', 'status' => 'active']);
    $source = $thread->messages()->create(['role' => 'user', 'type' => 'text', 'status' => 'complete', 'content' => 'pricing']);

    app(TowerMemoryStore::class)->rememberCandidates($user, $thread, $source, [[
        'key' => 'pricing-policy', 'category' => 'decision', 'scope' => 'academy',
        'content' => 'Le plan Business doit rester à 499 euros par mois.', 'importance' => 5,
    ]]);

    $items = app(TowerMemoryRetriever::class)->retrieve($user, 'Quel prix avons-nous décidé pour le plan Business ?', $thread);

    expect($items)->not->toBeEmpty()
        ->and($items[0]['content'])->toContain('499');
});

it('compresses older chat messages into a rolling summary while leaving recent messages verbatim', function () {
    $user = User::factory()->create();
    $thread = TowerChatThread::create(['owner_id' => $user->id, 'title' => 'Long thread', 'status' => 'active']);
    foreach (range(1, 10) as $index) {
        $thread->messages()->create([
            'role' => $index % 2 ? 'user' : 'assistant',
            'type' => 'text', 'status' => 'complete', 'content' => "Message {$index}",
        ]);
    }

    $fake = new class implements AiProvider {
        public function name(): string { return 'fake'; }
        public function model(): string { return 'fake-memory'; }
        public function text(string $system, string $prompt): string { return 'summary'; }
        public function structured(string $system, string $prompt, string $schemaName, array $schema): array
        {
            expect($schemaName)->toBe('tower_chat_summary')->and($prompt)->toContain('Message 1');
            return ['summary' => 'Décisions et contexte ancien résumés.'];
        }
    };
    app()->instance(TowerAiProviderResolver::class, new class($fake) extends TowerAiProviderResolver {
        public function __construct(private readonly AiProvider $fake) {}
        public function resolve(): AiProvider { return $this->fake; }
    });

    app(TowerThreadSummarizer::class)->maybeSummarize($thread);

    $thread->refresh();
    expect($thread->summary)->toBe('Décisions et contexte ancien résumés.')
        ->and($thread->summary_message_id)->not->toBeNull()
        ->and($thread->messages()->count())->toBe(10);
});
