<?php

declare(strict_types=1);

use App\Models\AcademyMcpCall;
use App\Models\AcademyMcpToken;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

function mcpTokenFor(User $user, array $abilities = ['*']): string
{
    $plain = 'num_mcp_test_'.str()->random(40);
    AcademyMcpToken::create([
        'user_id' => $user->id,
        'name' => 'Test token',
        'token_hash' => hash('sha256', $plain),
        'abilities' => $abilities,
    ]);

    return $plain;
}

function mcpHeaders(string $token, string $method, ?string $name = null): array
{
    $headers = [
        'Authorization' => 'Bearer '.$token,
        'MCP-Protocol-Version' => '2026-07-28',
        'Mcp-Method' => $method,
        'Accept' => 'application/json',
    ];
    if ($name !== null) {
        $headers['Mcp-Name'] = $name;
    }

    return $headers;
}

it('requires a valid MCP bearer token', function () {
    $this->postJson('/mcp', ['jsonrpc' => '2.0', 'id' => 1, 'method' => 'tools/list', 'params' => []], [
        'MCP-Protocol-Version' => '2026-07-28', 'Mcp-Method' => 'tools/list',
    ])->assertUnauthorized();
});

it('discovers the modern stateless server and lists allowed tools', function () {
    $trainer = User::factory()->create(['email_verified_at' => now()]);
    $trainer->assignRole('trainer');
    $token = mcpTokenFor($trainer, ['academy.summary']);

    $this->postJson('/mcp', ['jsonrpc' => '2.0', 'id' => 1, 'method' => 'server/discover', 'params' => []], mcpHeaders($token, 'server/discover'))
        ->assertOk()->assertJsonPath('result.supportedVersions.0', '2026-07-28');

    $response = $this->postJson('/mcp', ['jsonrpc' => '2.0', 'id' => 2, 'method' => 'tools/list', 'params' => []], mcpHeaders($token, 'tools/list'))
        ->assertOk();
    expect(collect($response->json('result.tools'))->pluck('name')->all())->toBe(['academy.summary']);
});

it('executes READ tools immediately and returns an execution receipt', function () {
    $trainer = User::factory()->create(['email_verified_at' => now()]);
    $trainer->assignRole('trainer');
    $token = mcpTokenFor($trainer);

    $response = $this->postJson('/mcp', [
        'jsonrpc' => '2.0', 'id' => 3, 'method' => 'tools/call',
        'params' => ['name' => 'academy.summary', 'arguments' => []],
    ], mcpHeaders($token, 'tools/call', 'academy.summary'))->assertOk();

    expect($response->json('result.resultType'))->toBe('complete');
    expect($response->json('result.isError'))->toBeFalse();
    expect($response->json('result.structuredContent.receipt.status'))->toBe('succeeded');
});

it('requires MRTR approval before a WRITE tool mutates', function () {
    $trainer = User::factory()->create(['email_verified_at' => now()]);
    $trainer->assignRole('trainer');
    $category = Category::factory()->create();
    $token = mcpTokenFor($trainer);
    $params = ['name' => 'courses.create', 'arguments' => [
        'category_id' => $category->id, 'title' => 'MCP Course', 'description' => 'Created after explicit approval.', 'price' => 99, 'duration' => 60,
    ]];

    $first = $this->postJson('/mcp', ['jsonrpc' => '2.0', 'id' => 4, 'method' => 'tools/call', 'params' => $params], mcpHeaders($token, 'tools/call', 'courses.create'))->assertOk();
    expect($first->json('result.resultType'))->toBe('input_required');
    expect(Course::where('title', 'MCP Course')->exists())->toBeFalse();

    $params['requestState'] = $first->json('result.requestState');
    $params['inputResponses'] = ['approval' => ['action' => 'accept', 'content' => ['confirm' => true]]];
    $second = $this->postJson('/mcp', ['jsonrpc' => '2.0', 'id' => 5, 'method' => 'tools/call', 'params' => $params], mcpHeaders($token, 'tools/call', 'courses.create'))->assertOk();

    expect($second->json('result.isError'))->toBeFalse();
    expect(Course::where('title', 'MCP Course')->where('trainer_id', $trainer->id)->exists())->toBeTrue();
});

it('requires the strong typed phrase before publishing an owned course', function () {
    $trainer = User::factory()->create(['email_verified_at' => now(), 'stripe_onboarding_completed' => true]);
    $trainer->assignRole('trainer');
    $course = Course::factory()->create([
        'trainer_id' => $trainer->id,
        'status' => 'draft',
        'stripe_product_id' => 'prod_test',
        'stripe_price_id' => 'price_test',
    ]);
    $token = mcpTokenFor($trainer);
    $params = ['name' => 'courses.publish', 'arguments' => ['course_id' => $course->id]];

    $first = $this->postJson('/mcp', ['jsonrpc' => '2.0', 'id' => 6, 'method' => 'tools/call', 'params' => $params], mcpHeaders($token, 'tools/call', 'courses.publish'))->assertOk();
    expect($first->json('result.resultType'))->toBe('input_required');
    expect($course->fresh()->status->value)->toBe('draft');

    $params['requestState'] = $first->json('result.requestState');
    $params['inputResponses'] = ['approval' => ['action' => 'accept', 'content' => ['phrase' => 'PUBLISH COURSE '.$course->id]]];
    $second = $this->postJson('/mcp', ['jsonrpc' => '2.0', 'id' => 7, 'method' => 'tools/call', 'params' => $params], mcpHeaders($token, 'tools/call', 'courses.publish'))->assertOk();

    expect($second->json('result.isError'))->toBeFalse();
    expect($course->fresh()->status->value)->toBe('published');
    expect($second->json('result.structuredContent.receipt.approvedAt'))->not->toBeNull();
});

it('rejects cross-owner mutations before asking for approval', function () {
    $trainer = User::factory()->create(['email_verified_at' => now(), 'stripe_onboarding_completed' => true]);
    $trainer->assignRole('trainer');
    $other = User::factory()->create(['email_verified_at' => now()]);
    $other->assignRole('trainer');
    $course = Course::factory()->create(['trainer_id' => $other->id, 'status' => 'draft']);
    $token = mcpTokenFor($trainer);

    $response = $this->postJson('/mcp', [
        'jsonrpc' => '2.0', 'id' => 11, 'method' => 'tools/call',
        'params' => ['name' => 'courses.publish', 'arguments' => ['course_id' => $course->id]],
    ], mcpHeaders($token, 'tools/call', 'courses.publish'))->assertOk();

    expect($response->json('result.resultType'))->toBe('complete');
    expect($response->json('result.isError'))->toBeTrue();
    expect($course->fresh()->status->value)->toBe('draft');
});

it('prevents approval state replay from executing the same call twice', function () {
    $trainer = User::factory()->create(['email_verified_at' => now()]);
    $trainer->assignRole('trainer');
    $category = Category::factory()->create();
    $token = mcpTokenFor($trainer);
    $params = ['name' => 'courses.create', 'arguments' => [
        'category_id' => $category->id, 'title' => 'Replay Safe', 'description' => 'Only one course can be created.', 'price' => 10, 'duration' => 10,
    ]];
    $first = $this->postJson('/mcp', ['jsonrpc' => '2.0', 'id' => 8, 'method' => 'tools/call', 'params' => $params], mcpHeaders($token, 'tools/call', 'courses.create'));
    $params['requestState'] = $first->json('result.requestState');
    $params['inputResponses'] = ['approval' => ['action' => 'accept', 'content' => ['confirm' => true]]];

    $this->postJson('/mcp', ['jsonrpc' => '2.0', 'id' => 9, 'method' => 'tools/call', 'params' => $params], mcpHeaders($token, 'tools/call', 'courses.create'))->assertOk();
    $replay = $this->postJson('/mcp', ['jsonrpc' => '2.0', 'id' => 10, 'method' => 'tools/call', 'params' => $params], mcpHeaders($token, 'tools/call', 'courses.create'))->assertOk();

    expect(Course::where('title', 'Replay Safe')->count())->toBe(1);
    expect($replay->json('result.structuredContent.receipt.replayed'))->toBeTrue();
    expect(AcademyMcpCall::where('tool', 'courses.create')->count())->toBe(1);
});

it('rejects MCP requests when protocol headers do not match the JSON-RPC request', function () {
    $trainer = User::factory()->create(['email_verified_at' => now()]);
    $trainer->assignRole('trainer');
    $token = mcpTokenFor($trainer);

    $this->postJson('/mcp', [
        'jsonrpc' => '2.0', 'id' => 12, 'method' => 'tools/list', 'params' => [],
    ], [
        'Authorization' => 'Bearer '.$token,
        'MCP-Protocol-Version' => '2026-07-28',
        'Mcp-Method' => 'tools/call',
    ])->assertStatus(400)->assertJsonPath('error.code', -32020);
});

it('rejects browser origins unless they are explicitly allowed', function () {
    config()->set('academy.mcp.allowed_origins', []);

    $trainer = User::factory()->create(['email_verified_at' => now()]);
    $trainer->assignRole('trainer');
    $token = mcpTokenFor($trainer);

    $this->postJson('/mcp', [
        'jsonrpc' => '2.0', 'id' => 13, 'method' => 'tools/list', 'params' => [],
    ], array_merge(mcpHeaders($token, 'tools/list'), [
        'Origin' => 'https://untrusted.example',
    ]))->assertForbidden()->assertJsonPath('error.code', -32001);

    config()->set('academy.mcp.allowed_origins', ['https://trusted.example']);

    $this->postJson('/mcp', [
        'jsonrpc' => '2.0', 'id' => 14, 'method' => 'tools/list', 'params' => [],
    ], array_merge(mcpHeaders($token, 'tools/list'), [
        'Origin' => 'https://trusted.example',
    ]))->assertOk();
});

it('does not execute an approved mutation when the same receipt is already running', function () {
    $trainer = User::factory()->create(['email_verified_at' => now()]);
    $trainer->assignRole('trainer');
    $category = Category::factory()->create();
    $token = mcpTokenFor($trainer);
    $params = ['name' => 'courses.create', 'arguments' => [
        'category_id' => $category->id, 'title' => 'Concurrent Safe', 'description' => 'A concurrent retry cannot execute twice.', 'price' => 15, 'duration' => 20,
    ]];

    $first = $this->postJson('/mcp', ['jsonrpc' => '2.0', 'id' => 15, 'method' => 'tools/call', 'params' => $params], mcpHeaders($token, 'tools/call', 'courses.create'))->assertOk();
    $receiptId = $first->json('result._meta.com.numtema.academy/receiptId');
    AcademyMcpCall::where('receipt_id', $receiptId)->update(['status' => 'running']);

    $params['requestState'] = $first->json('result.requestState');
    $params['inputResponses'] = ['approval' => ['action' => 'accept', 'content' => ['confirm' => true]]];
    $retry = $this->postJson('/mcp', ['jsonrpc' => '2.0', 'id' => 16, 'method' => 'tools/call', 'params' => $params], mcpHeaders($token, 'tools/call', 'courses.create'))->assertOk();

    expect($retry->json('result.isError'))->toBeTrue();
    expect(Course::where('title', 'Concurrent Safe')->exists())->toBeFalse();
    expect(AcademyMcpCall::where('receipt_id', $receiptId)->value('status'))->toBe('running');
});
