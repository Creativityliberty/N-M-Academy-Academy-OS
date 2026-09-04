<?php

declare(strict_types=1);

use App\MissionTower\Bridge\AcademyMcpHttpGateway;
use Illuminate\Support\Facades\Http;

it('uses the Academy MCP 2026-07-28 stateless headers with the dedicated Tower token', function () {
    config()->set('mission-tower.academy_mcp.url', 'https://academy.example/mcp');
    config()->set('mission-tower.academy_mcp.token', 'num_mcp_tower_test');
    config()->set('mission-tower.academy_mcp.timeout', 5);

    Http::fake([
        'https://academy.example/mcp' => Http::response([
            'jsonrpc' => '2.0',
            'id' => 'test',
            'result' => [
                'resultType' => 'complete',
                'supportedVersions' => ['2026-07-28'],
            ],
        ]),
    ]);

    $result = app(AcademyMcpHttpGateway::class)->discover();
    expect($result['supportedVersions'][0])->toBe('2026-07-28');

    Http::assertSent(function ($request) {
        return $request->url() === 'https://academy.example/mcp'
            && $request->hasHeader('Authorization', 'Bearer num_mcp_tower_test')
            && $request->hasHeader('MCP-Protocol-Version', '2026-07-28')
            && $request->hasHeader('Mcp-Method', 'server/discover')
            && $request['method'] === 'server/discover';
    });
});

it('keeps NümFlow Harness and Fleet optional by default', function () {
    config()->set('mission-tower.enabled', true);
    config()->set('mission-tower.numflow.enabled', false);
    config()->set('mission-tower.harness.enabled', false);
    config()->set('mission-tower.fleet.enabled', false);

    $readiness = app(\App\MissionTower\Services\TowerReadiness::class)->snapshot(false);

    expect($readiness['numflow']['ready'])->toBeTrue();
    expect($readiness['harness']['ready'])->toBeTrue();
    expect($readiness['fleet']['ready'])->toBeTrue();
});
