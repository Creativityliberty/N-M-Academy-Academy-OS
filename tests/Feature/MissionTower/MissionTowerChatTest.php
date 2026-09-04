<?php

declare(strict_types=1);

use App\AI\Contracts\AiProvider;
use App\MissionTower\Contracts\AcademyGateway;
use App\MissionTower\Models\TowerApproval;
use App\MissionTower\Models\TowerChatThread;
use App\MissionTower\Services\TowerAiProviderResolver;
use App\MissionTower\Services\TowerChatService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function bindTowerChatAi(string $tool, array $arguments): void
{
    $provider = new class($tool, $arguments) implements AiProvider {
        public function __construct(private string $tool, private array $arguments) {}
        public function name(): string { return 'deepseek'; }
        public function model(): string { return 'tower-chat-test'; }
        public function text(string $system, string $prompt): string
        {
            expect($system)->toContain('ONLY the supplied mission results/evidence');
            return 'Résultat confirmé depuis les receipts de la mission.';
        }
        public function structured(string $system, string $prompt, string $schemaName, array $schema): array
        {
            if ($schemaName === 'tower_chat_route') {
                return [
                    'intent' => 'academy_action',
                    'answer' => '',
                    'action_prompt' => 'Exécute la demande Academy avec les tools autorisés.',
                    'reason' => 'La demande requiert les données ou capacités Academy.',
                ];
            }

            expect($schemaName)->toBe('mission_plan');
            return [
                'title' => 'Mission depuis le chat',
                'objective' => 'Exécuter la demande du chat avec gouvernance et preuves.',
                'priority' => 'normal',
                'summary' => 'Plan minimal.',
                'assumptions' => [],
                'steps' => [[
                    'tool' => $this->tool,
                    'arguments_json' => json_encode($this->arguments, JSON_THROW_ON_ERROR),
                    'reason' => 'Répondre à la demande utilisateur.',
                ]],
            ];
        }
    };

    app()->instance(TowerAiProviderResolver::class, new class($provider) extends TowerAiProviderResolver {
        public function __construct(private readonly AiProvider $fake) {}
        public function resolve(): AiProvider { return $this->fake; }
    });
}

function bindTowerChatGateway(): object
{
    $gateway = new class implements AcademyGateway {
        public int $writeCalls = 0;
        public ?string $resumedState = null;

        public function discover(): array { return []; }
        public function tools(): array
        {
            return [
                [
                    'name' => 'academy.summary', 'title' => 'Academy summary', 'description' => 'Read summary.',
                    'inputSchema' => ['type' => 'object', 'properties' => [], 'required' => [], 'additionalProperties' => false],
                    'annotations' => ['readOnlyHint' => true, 'destructiveHint' => false, 'openWorldHint' => false],
                    '_meta' => ['com.numtema.academy/risk' => 'read', 'com.numtema.academy/scope' => 'academy'],
                ],
                [
                    'name' => 'events.create', 'title' => 'Create event', 'description' => 'Create an Academy event.',
                    'inputSchema' => [
                        'type' => 'object',
                        'properties' => ['title' => ['type' => 'string', 'minLength' => 3]],
                        'required' => ['title'],
                        'additionalProperties' => false,
                    ],
                    'annotations' => ['readOnlyHint' => false, 'destructiveHint' => false, 'openWorldHint' => false],
                    '_meta' => ['com.numtema.academy/risk' => 'write', 'com.numtema.academy/scope' => 'academy'],
                ],
            ];
        }
        public function call(string $tool, array $arguments = [], ?string $requestState = null, array $inputResponses = []): array
        {
            if ($tool === 'academy.summary') {
                return [
                    'resultType' => 'complete', 'isError' => false,
                    'structuredContent' => ['data' => ['students' => 42], 'receipt' => ['id' => 'chat-read-receipt']],
                ];
            }

            $this->writeCalls++;
            if ($requestState === null) {
                return [
                    'resultType' => 'input_required',
                    'requestState' => 'chat-governed-state',
                    'inputRequests' => ['approval' => ['params' => ['message' => 'Créer cet événement ?', 'requestedSchema' => [
                        'type' => 'object', 'properties' => ['confirm' => ['type' => 'boolean']], 'required' => ['confirm'],
                    ]]]],
                    '_meta' => ['com.numtema.academy/receiptId' => 'chat-write-receipt'],
                ];
            }

            $this->resumedState = $requestState;
            expect(data_get($inputResponses, 'approval.action'))->toBe('accept');
            return [
                'resultType' => 'complete', 'isError' => false,
                'structuredContent' => ['data' => ['event' => ['id' => 77]], 'receipt' => ['id' => 'chat-write-receipt']],
            ];
        }
    };

    app()->instance(AcademyGateway::class, $gateway);
    return $gateway;
}

it('uses chat as a conversational control plane and auto-executes read missions', function () {
    $user = User::factory()->create();
    bindTowerChatAi('academy.summary', []);
    bindTowerChatGateway();

    $thread = app(TowerChatService::class)->createThread($user);
    $message = app(TowerChatService::class)->send($user, $thread, 'Combien d’étudiants avons-nous ?');

    expect($message->type)->toBe('mission_result')
        ->and($message->status)->toBe('complete')
        ->and($message->content)->toContain('receipts')
        ->and($message->mission_id)->not->toBeNull()
        ->and($message->run_id)->not->toBeNull()
        ->and(TowerApproval::query()->count())->toBe(0)
        ->and(TowerChatThread::query()->firstOrFail()->title)->not->toBe('Nouvelle conversation');
});

it('surfaces governed write approval inline and resumes the exact MCP requestState after approval', function () {
    $user = User::factory()->create();
    bindTowerChatAi('events.create', ['title' => 'Live jeudi']);
    $gateway = bindTowerChatGateway();

    $thread = app(TowerChatService::class)->createThread($user);
    $pending = app(TowerChatService::class)->send($user, $thread, 'Crée un live jeudi.');

    expect($pending->type)->toBe('approval_required')
        ->and($pending->approval_id)->not->toBeNull()
        ->and($pending->status)->toBe('waiting')
        ->and($gateway->writeCalls)->toBe(1);

    $approval = TowerApproval::query()->findOrFail($pending->approval_id);
    $result = app(TowerChatService::class)->decide($user, $thread, $approval, 'approve');

    expect($result->type)->toBe('mission_result')
        ->and($result->status)->toBe('complete')
        ->and($gateway->resumedState)->toBe('chat-governed-state')
        ->and($gateway->writeCalls)->toBe(2)
        ->and($approval->fresh()->status)->toBe('approved');
});
