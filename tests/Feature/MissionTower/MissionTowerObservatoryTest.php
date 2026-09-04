<?php

declare(strict_types=1);

use App\MissionTower\Contracts\AcademyGateway;
use App\MissionTower\Models\TowerInsight;
use App\MissionTower\Services\InsightMissionFactory;
use App\MissionTower\Services\ObservatoryService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('captures MCP metrics, deduplicates insights, preserves them on partial snapshots and creates a governed draft mission', function () {
    $owner = User::factory()->create();

    $fake = new class implements AcademyGateway {
        public bool $normal = false;
        public bool $communityFails = false;

        public function discover(): array { return []; }
        public function tools(): array
        {
            return [
                ['name' => 'sales.summary', 'title' => 'Sales summary', '_meta' => ['com.numtema.academy/risk' => 'read', 'com.numtema.academy/scope' => 'academy'], 'inputSchema' => []],
                ['name' => 'courses.list', 'title' => 'Courses', '_meta' => ['com.numtema.academy/risk' => 'read', 'com.numtema.academy/scope' => 'academy'], 'inputSchema' => []],
                ['name' => 'analytics.learning', 'title' => 'Learning analytics', '_meta' => ['com.numtema.academy/risk' => 'read', 'com.numtema.academy/scope' => 'academy'], 'inputSchema' => []],
                ['name' => 'students.risk.summary', 'title' => 'Student risk', '_meta' => ['com.numtema.academy/risk' => 'read', 'com.numtema.academy/scope' => 'academy'], 'inputSchema' => []],
                ['name' => 'community.posts.list', 'title' => 'Community posts', '_meta' => ['com.numtema.academy/risk' => 'read', 'com.numtema.academy/scope' => 'academy'], 'inputSchema' => []],
                ['name' => 'events.list', 'title' => 'Events', '_meta' => ['com.numtema.academy/risk' => 'read', 'com.numtema.academy/scope' => 'academy'], 'inputSchema' => []],
                ['name' => 'ai.usage.summary', 'title' => 'AI usage', '_meta' => ['com.numtema.academy/risk' => 'read', 'com.numtema.academy/scope' => 'academy'], 'inputSchema' => []],
            ];
        }

        public function call(string $tool, array $arguments = [], ?string $requestState = null, array $inputResponses = []): array
        {
            if ($tool === 'community.posts.list' && $this->communityFails) {
                throw new RuntimeException('Community source unavailable');
            }

            return match ($tool) {
                'academy.summary' => ['students' => 100],
                'sales.summary' => [
                    'conversionRate' => $this->normal ? 40 : 20,
                    'activeMemberships' => 50,
                    'monthlyChurnRate' => 4,
                    'revenueByCurrency' => [[
                        'currency' => 'EUR', 'gross' => 100000, 'refunds' => $this->normal ? 1000 : 10000, 'net' => $this->normal ? 99000 : 90000,
                    ]],
                ],
                'analytics.summary' => ['students' => 100, 'averageCompletion' => 60],
                'analytics.learning' => ['courses' => [['id' => 1, 'title' => 'Course', 'students' => 100, 'completionRate' => 60]]],
                'students.risk.summary' => ['students' => 100, 'riskStudents' => $this->normal ? 5 : 40, 'riskRate' => $this->normal ? 5 : 40, 'courses' => []],
                'community.posts.list' => ['items' => [['id' => 1, 'createdAt' => now()->toIso8601String(), 'comments' => 2, 'reactions' => 3]]],
                'events.list' => ['items' => []],
                'ai.usage.summary' => ['creatorRuns30d' => 10, 'tutorRuns30d' => 20, 'estimatedCostCents30d' => 500, 'estimatedCostCents24h' => 100, 'estimatedCostCentsPrevious24h' => 100, 'inputTokens30d' => 1000, 'outputTokens30d' => 500, 'providers' => []],
                default => [],
            };
        }
    };

    app()->instance(AcademyGateway::class, $fake);

    $first = app(ObservatoryService::class)->observe($owner);
    expect($first->status)->toBe('completed')
        ->and(TowerInsight::query()->where('owner_id', $owner->id)->where('rule', 'refund_rate')->where('status', 'open')->count())->toBe(1)
        ->and(TowerInsight::query()->where('owner_id', $owner->id)->where('rule', 'learning_risk')->where('status', 'open')->count())->toBe(1)
        ->and(data_get($first->sources, 'community'))->not->toHaveKey('items');

    app(ObservatoryService::class)->observe($owner);
    expect(TowerInsight::query()->where('owner_id', $owner->id)->where('rule', 'refund_rate')->count())->toBe(1);

    $refund = TowerInsight::query()->where('owner_id', $owner->id)->where('rule', 'refund_rate')->firstOrFail();
    $mission = app(InsightMissionFactory::class)->create($refund, $owner);
    expect($mission->source)->toBe('observatory')
        ->and($mission->status)->toBe('draft')
        ->and($refund->fresh()->mission_id)->toBe($mission->id);

    $fake->communityFails = true;
    $partial = app(ObservatoryService::class)->observe($owner);
    expect($partial->status)->toBe('partial')
        ->and(data_get($partial->sources, 'community.status'))->toBe('error');

    $fake->normal = true;
    $fake->communityFails = false;
    app(ObservatoryService::class)->observe($owner);
    expect(TowerInsight::query()->where('owner_id', $owner->id)->where('rule', 'learning_risk')->firstOrFail()->status)->toBe('resolved');
});
