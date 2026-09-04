<?php

declare(strict_types=1);

use App\MissionTower\Contracts\AcademyGateway;
use App\MissionTower\Models\TowerMission;
use App\MissionTower\Services\ApprovalDecisionService;
use App\MissionTower\Services\MissionRunner;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('pauses a governed mission for approval then resumes the exact MCP action and records evidence', function () {
    $user = User::factory()->create();

    $fake = new class implements AcademyGateway {
        public int $writeCalls = 0;

        public function discover(): array { return ['supportedVersions' => ['2026-07-28']]; }
        public function tools(): array { return []; }

        public function call(string $tool, array $arguments = [], ?string $requestState = null, array $inputResponses = []): array
        {
            if ($tool === 'academy.summary') {
                return [
                    'resultType' => 'complete',
                    'structuredContent' => [
                        'data' => ['students' => 42],
                        'receipt' => ['id' => 'receipt-read', 'status' => 'succeeded'],
                    ],
                    'isError' => false,
                ];
            }

            $this->writeCalls++;
            if ($requestState === null) {
                return [
                    'resultType' => 'input_required',
                    'requestState' => 'encrypted-mcp-state',
                    'inputRequests' => [
                        'approval' => [
                            'params' => [
                                'message' => "Approve Academy action 'courses.create'?",
                                'requestedSchema' => [
                                    'type' => 'object',
                                    'properties' => ['confirm' => ['type' => 'boolean', 'const' => true]],
                                    'required' => ['confirm'],
                                ],
                            ],
                        ],
                    ],
                    '_meta' => ['com.numtema.academy/receiptId' => 'receipt-write'],
                ];
            }

            expect($requestState)->toBe('encrypted-mcp-state')
                ->and(data_get($inputResponses, 'approval.action'))->toBe('accept')
                ->and(data_get($inputResponses, 'approval.content.confirm'))->toBeTrue();

            return [
                'resultType' => 'complete',
                'structuredContent' => [
                    'data' => ['course' => ['id' => 99]],
                    'receipt' => ['id' => 'receipt-write', 'status' => 'succeeded'],
                ],
                'isError' => false,
            ];
        }
    };

    app()->instance(AcademyGateway::class, $fake);

    $mission = TowerMission::create([
        'owner_id' => $user->id,
        'title' => 'Audit puis création',
        'objective' => 'Lire les données puis créer un brouillon gouverné.',
        'status' => 'draft',
        'priority' => 'normal',
        'source' => 'manual',
    ]);
    $mission->steps()->createMany([
        ['position' => 1, 'title' => 'Résumé', 'tool' => 'academy.summary', 'risk' => 'read', 'arguments' => [], 'status' => 'pending'],
        ['position' => 2, 'title' => 'Créer cours', 'tool' => 'courses.create', 'risk' => 'write', 'arguments' => ['title' => 'X'], 'status' => 'pending'],
    ]);

    $run = app(MissionRunner::class)->start($mission, $user);
    expect($run->status)->toBe('awaiting_approval')
        ->and($mission->fresh()->status)->toBe('awaiting_approval')
        ->and($mission->steps()->where('position', 1)->first()->status)->toBe('succeeded')
        ->and($mission->steps()->where('position', 2)->first()->status)->toBe('awaiting_approval')
        ->and($mission->approvals()->where('status', 'pending')->count())->toBe(1)
        ->and($mission->evidence()->where('receipt_id', 'receipt-read')->count())->toBe(1);

    $approval = $mission->approvals()->firstOrFail();
    $finished = app(ApprovalDecisionService::class)->decide($approval, $user, 'approve');

    expect($finished->status)->toBe('completed')
        ->and($mission->fresh()->status)->toBe('completed')
        ->and($mission->steps()->where('position', 2)->first()->status)->toBe('succeeded')
        ->and($mission->evidence()->where('receipt_id', 'receipt-write')->count())->toBeGreaterThanOrEqual(1)
        ->and($mission->evidence()->where('type', 'approval_decision')->count())->toBe(1)
        ->and($fake->writeCalls)->toBe(2);
});
