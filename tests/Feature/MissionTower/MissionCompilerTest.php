<?php

declare(strict_types=1);

use App\AI\Contracts\AiProvider;
use App\MissionTower\Contracts\AcademyGateway;
use App\MissionTower\Models\TowerCompilation;
use App\MissionTower\Models\TowerMission;
use App\MissionTower\Services\CompilationApplyService;
use App\MissionTower\Services\MissionCompiler;
use App\MissionTower\Services\TowerAiProviderResolver;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function bindMissionCompilerFakes(array $output): void
{
    $provider = new class($output) implements AiProvider {
        public function __construct(private array $output) {}
        public function name(): string { return 'deepseek'; }
        public function model(): string { return 'compiler-test-model'; }
        public function text(string $system, string $prompt): string { return ''; }
        public function structured(string $system, string $prompt, string $schemaName, array $schema): array
        {
            expect($schemaName)->toBe('mission_plan')
                ->and($system)->toContain('ONLY the MCP tools')
                ->and($prompt)->toContain('ACCESSIBLE MCP TOOLS');

            return $this->output;
        }
    };

    app()->instance(TowerAiProviderResolver::class, new class($provider) extends TowerAiProviderResolver {
        public function __construct(private readonly AiProvider $fake) {}
        public function resolve(): AiProvider { return $this->fake; }
    });

    app()->instance(AcademyGateway::class, new class implements AcademyGateway {
        public function discover(): array { return []; }
        public function call(string $tool, array $arguments = [], ?string $requestState = null, array $inputResponses = []): array { return []; }
        public function tools(): array
        {
            return [
                [
                    'name' => 'analytics.learning',
                    'title' => 'Learning analytics',
                    'description' => 'Read learning analytics.',
                    'inputSchema' => [
                        'type' => 'object',
                        'properties' => ['course_id' => ['type' => 'integer', 'minimum' => 1]],
                        'required' => [],
                        'additionalProperties' => false,
                    ],
                    'annotations' => ['readOnlyHint' => true, 'destructiveHint' => false, 'openWorldHint' => false],
                    '_meta' => ['com.numtema.academy/risk' => 'read', 'com.numtema.academy/scope' => 'academy'],
                ],
                [
                    'name' => 'courses.create',
                    'title' => 'Create course',
                    'description' => 'Create a draft course.',
                    'inputSchema' => [
                        'type' => 'object',
                        'properties' => [
                            'category_id' => ['type' => 'integer', 'minimum' => 1],
                            'title' => ['type' => 'string', 'minLength' => 3, 'maxLength' => 255],
                            'description' => ['type' => 'string', 'minLength' => 10],
                            'price' => ['type' => 'number', 'minimum' => 0],
                            'duration' => ['type' => 'integer', 'minimum' => 1],
                        ],
                        'required' => ['category_id', 'title', 'description', 'price', 'duration'],
                        'additionalProperties' => false,
                    ],
                    'annotations' => ['readOnlyHint' => false, 'destructiveHint' => false, 'openWorldHint' => false],
                    '_meta' => ['com.numtema.academy/risk' => 'write', 'com.numtema.academy/scope' => 'academy'],
                ],
                [
                    'name' => 'sales.refund',
                    'title' => 'Refund order',
                    'description' => 'Refund an order.',
                    'inputSchema' => [
                        'type' => 'object',
                        'properties' => [
                            'order_id' => ['type' => 'integer', 'minimum' => 1],
                            'amount' => ['type' => 'integer', 'minimum' => 1],
                        ],
                        'required' => ['order_id', 'amount'],
                        'additionalProperties' => false,
                    ],
                    'annotations' => ['readOnlyHint' => false, 'destructiveHint' => true, 'openWorldHint' => true],
                    '_meta' => ['com.numtema.academy/risk' => 'sensitive', 'com.numtema.academy/scope' => 'academy'],
                ],
            ];
        }
    });
}

it('compiles only live MCP tools, recomputes risk and applies once as a draft mission', function () {
    $owner = User::factory()->create();
    bindMissionCompilerFakes([
        'title' => 'Créer un cours test',
        'objective' => 'Créer un nouveau cours en brouillon après validation humaine.',
        'priority' => 'normal',
        'summary' => 'Une mutation contrôlée.',
        'assumptions' => ['La catégorie 2 existe dans Academy.'],
        'steps' => [[
            'tool' => 'courses.create',
            'arguments_json' => json_encode([
                'category_id' => 2,
                'title' => 'Cours test',
                'description' => 'Description suffisamment longue.',
                'price' => 99,
                'duration' => 60,
            ], JSON_THROW_ON_ERROR),
            'reason' => 'Créer le brouillon demandé.',
            'risk' => 'read', // ignored even if a fake provider tries to smuggle it.
        ]],
    ]);

    $compilation = app(MissionCompiler::class)->compile($owner, 'Crée un cours test à 99 euros dans la catégorie 2 et laisse-le en brouillon.');

    expect($compilation->status)->toBe('proposal')
        ->and(data_get($compilation->proposal, 'steps.0.risk'))->toBe('write')
        ->and(data_get($compilation->proposal, 'approvalCount'))->toBe(1)
        ->and($compilation->provider)->toBe('deepseek');

    $first = app(CompilationApplyService::class)->apply($compilation, $owner);
    $second = app(CompilationApplyService::class)->apply($compilation->fresh(), $owner);

    expect($first->id)->toBe($second->id)
        ->and($first->source)->toBe('compiler')
        ->and($first->status)->toBe('draft')
        ->and($first->steps()->firstOrFail()->risk)->toBe('write')
        ->and(TowerMission::query()->where('source', 'compiler')->count())->toBe(1)
        ->and($compilation->fresh()->status)->toBe('applied')
        ->and($compilation->fresh()->mission_id)->toBe($first->id)
        ->and($compilation->fresh()->applied_at)->not->toBeNull();
});

it('rejects invented MCP tools and invalid tool arguments before creating a proposal', function () {
    $owner = User::factory()->create();
    bindMissionCompilerFakes([
        'title' => 'Mission invalide',
        'objective' => 'Essayer une capacité qui ne doit jamais être acceptée.',
        'priority' => 'normal',
        'summary' => '',
        'assumptions' => [],
        'steps' => [[
            'tool' => 'stripe.delete_everything',
            'arguments_json' => '{}',
            'reason' => 'Tool inventé.',
        ]],
    ]);

    expect(fn () => app(MissionCompiler::class)->compile($owner, 'Utilise une capacité inventée pour modifier toute mon académie.'))
        ->toThrow(InvalidArgumentException::class);
    expect(TowerCompilation::query()->latest()->firstOrFail()->status)->toBe('failed');

    bindMissionCompilerFakes([
        'title' => 'Créer un cours incomplet',
        'objective' => 'Créer un cours avec des arguments invalides pour vérifier le schema.',
        'priority' => 'normal',
        'summary' => '',
        'assumptions' => [],
        'steps' => [[
            'tool' => 'courses.create',
            'arguments_json' => '{"title":"X","unknown":true}',
            'reason' => 'Arguments invalides.',
        ]],
    ]);

    expect(fn () => app(MissionCompiler::class)->compile($owner, 'Crée un cours incomplet afin de tester la validation des arguments MCP.'))
        ->toThrow(InvalidArgumentException::class);
    expect(TowerCompilation::query()->latest()->firstOrFail()->status)->toBe('failed');
});
