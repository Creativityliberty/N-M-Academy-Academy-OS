<?php

declare(strict_types=1);

use App\MissionTower\Bridge\AcademyMcpHttpGateway;
use App\Models\AcademyMcpToken;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

it('uses TOWER_ACADEMY_MCP_IN_PROCESS for a local Academy MCP target without loopback HTTP', function () {
    $plain = 'num_mcp_local_'.str()->random(40);
    $trainer = User::factory()->create(['email_verified_at' => now()]);
    $trainer->assignRole('trainer');

    $token = AcademyMcpToken::create([
        'user_id' => $trainer->id,
        'name' => 'Tower local runtime test',
        'token_hash' => hash('sha256', $plain),
        'abilities' => ['academy.summary'],
    ]);

    config()->set('app.url', 'http://127.0.0.1:8000');
    config()->set('mission-tower.academy_mcp.url', 'http://127.0.0.1:8000/mcp');
    config()->set('mission-tower.academy_mcp.token', $plain);
    config()->set('mission-tower.academy_mcp.in_process', true);

    Http::fake();

    $result = app(AcademyMcpHttpGateway::class)->discover();

    expect($result['supportedVersions'][0])->toBe('2026-07-28');
    expect($token->fresh()->last_used_at)->not->toBeNull();
    Http::assertNothingSent();
});
