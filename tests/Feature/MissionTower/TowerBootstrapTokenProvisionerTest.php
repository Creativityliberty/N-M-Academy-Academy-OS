<?php

declare(strict_types=1);

use App\MissionTower\Services\TowerBootstrapTokenProvisioner;
use App\Models\AcademyMcpToken;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

it('provisions a bounded non-sensitive Tower MCP identity idempotently and rotates safely', function () {
    $owner = User::factory()->create(['email_verified_at' => now()]);
    $owner->assignRole(['admin', 'trainer']);

    $firstPlain = 'num_mcp_'.str()->random(64);
    $service = app(TowerBootstrapTokenProvisioner::class);
    $first = $service->provision($owner, $firstPlain);

    expect($first->name)->toBe('Mission Tower Bootstrap');
    expect($first->abilities)->toContain('academy.summary', 'courses.create', 'assessments.list', 'assignments.list', 'certificates.list');
    expect($first->abilities)->not->toContain('courses.publish', 'sales.refund', 'certificates.revoke');
    expect(AcademyMcpToken::query()->count())->toBe(1);

    $same = $service->provision($owner, $firstPlain);
    expect($same->id)->toBe($first->id);
    expect(AcademyMcpToken::query()->count())->toBe(1);

    $secondPlain = 'num_mcp_'.str()->random(64);
    $second = $service->provision($owner, $secondPlain);

    expect($second->id)->not->toBe($first->id);
    expect($first->fresh()->revoked_at)->not->toBeNull();
    expect($second->revoked_at)->toBeNull();
});
