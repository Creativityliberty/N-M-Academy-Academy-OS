<?php

use App\Factory\AcademyFactoryBlueprintBuilder;
use App\Factory\AcademyFactoryCapabilityRegistry;
use App\Factory\AcademyFactoryTemplateRegistry;
use App\Factory\CoolifyClient;
use App\Models\AcademyFactoryDeployment;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('factory exposes eight deterministic template packs', function () {
    $registry = app(AcademyFactoryTemplateRegistry::class);
    expect($registry->all())->toHaveCount(8);
    expect(collect($registry->all())->pluck('key')->all())->toContain('creator', 'corporate', 'premium-dark', 'editorial');
});


test('factory exposes independent capability profiles for learning editions', function () {
    $registry = app(AcademyFactoryCapabilityRegistry::class);
    expect(collect($registry->all())->pluck('key')->all())->toBe(['essential', 'creator', 'pro']);
    expect(data_get($registry->get('essential'), 'features.assessments'))->toBeTrue();
    expect(data_get($registry->get('essential'), 'features.assignments'))->toBeFalse();
    expect(data_get($registry->get('pro'), 'features.tower'))->toBeTrue();
});

test('blueprint separates encrypted secrets from public environment', function () {
    $builder = app(AcademyFactoryBlueprintBuilder::class);
    $built = $builder->build([
        'client_name'=>'Acme Academy', 'domain'=>'academy.acme.test', 'template_key'=>'business', 'capability_profile'=>'pro',
        'owner'=>['name'=>'Owner','email'=>'owner@acme.test','password'=>'a-very-long-password'],
        'features'=>['community'=>false],
        'learning'=>[
            'issuer_name'=>'Acme Learning',
            'certificate_title'=>'Diplôme Acme',
            'public_verification'=>true,
            'pdf_download'=>true,
            'student_sharing'=>true,
            'require_all_accessible_lessons'=>true,
        ],
        'ai'=>[
            'provider'=>'deepseek',
            'deepseek_api_key'=>'ds-secret',
            'image_provider'=>'gemini',
            'image_model'=>'gemini-3.1-flash-lite-image',
            'image_size'=>'4K',
            'image_prompt_preset'=>'editorial',
            'gemini_api_key'=>'gemini-secret',
        ],
        'stripe'=>['secret'=>'sk_test_secret'],
    ]);
    expect(data_get($built, 'blueprint.environment.ACADEMY_FACTORY_ENABLED'))->toBe('false');
    expect(data_get($built, 'blueprint.environment.ACADEMY_FEATURE_COMMUNITY'))->toBe('false');
    expect(data_get($built, 'blueprint.environment.ACADEMY_FEATURE_ASSESSMENTS'))->toBe('true');
    expect(data_get($built, 'blueprint.environment.ACADEMY_FEATURE_ASSIGNMENTS'))->toBe('true');
    expect(data_get($built, 'blueprint.environment.ACADEMY_FEATURE_COMPLETION'))->toBe('true');
    expect(data_get($built, 'blueprint.environment.ACADEMY_FEATURE_CERTIFICATES'))->toBe('true');
    expect(data_get($built, 'blueprint.environment.ACADEMY_FEATURE_TOWER'))->toBe('true');
    expect(data_get($built, 'blueprint.environment.TOWER_ENABLED'))->toBe('true');
    expect(data_get($built, 'blueprint.environment.TOWER_ACADEMY_MCP_IN_PROCESS'))->toBe('true');
    expect($built['secrets']['TOWER_ACADEMY_MCP_TOKEN'])->toStartWith('num_mcp_');
    expect(data_get($built, 'blueprint.environment.ACADEMY_CERTIFICATE_ISSUER_NAME'))->toBe('Acme Learning');
    expect(data_get($built, 'blueprint.environment.ACADEMY_CERTIFICATE_TITLE'))->toBe('Diplôme Acme');
    expect(data_get($built, 'blueprint.environment.APP_KEY'))->toBeNull();
    expect($built['secrets']['APP_KEY'])->toStartWith('base64:');
    expect($built['secrets']['DEEPSEEK_API_KEY'])->toBe('ds-secret');
    expect($built['secrets']['GEMINI_API_KEY'])->toBe('gemini-secret');
    expect(data_get($built, 'blueprint.environment.ACADEMY_IMAGE_PROVIDER'))->toBe('gemini');
    expect(data_get($built, 'blueprint.environment.GEMINI_IMAGE_MODEL'))->toBe('gemini-3.1-flash-lite-image');
    expect(data_get($built, 'blueprint.environment.ACADEMY_IMAGE_SIZE'))->toBe('1K');
    expect(data_get($built, 'blueprint.environment.ACADEMY_IMAGE_PROMPT_PRESET'))->toBe('editorial');
});

test('factory deployment encrypts pending secrets at rest', function () {
    $admin = User::factory()->create(['email_verified_at'=>now()]);
    $deployment = AcademyFactoryDeployment::create([
        'created_by'=>$admin->id, 'receipt_id'=>(string) str()->uuid(), 'client_name'=>'Secure Academy',
        'slug'=>'secure-academy', 'template_key'=>'creator', 'domain'=>'secure.example.com',
        'blueprint'=>['environment'=>[]], 'secrets'=>['STRIPE_SECRET'=>'sk_test_never_plain'],
    ]);
    expect($deployment->fresh()->secrets['STRIPE_SECRET'])->toBe('sk_test_never_plain');
    $raw = DB::table('academy_factory_deployments')->where('id',$deployment->id)->value('secrets');
    expect($raw)->not->toContain('sk_test_never_plain');
});

test('coolify client creates git compose app and updates environment through official endpoints', function () {
    config([
        'factory.coolify.base_url'=>'https://coolify.test', 'factory.coolify.api_token'=>'token',
        'factory.coolify.server_uuid'=>'server-1', 'factory.coolify.source_mode'=>'public',
        'factory.coolify.git_repository'=>'https://github.com/example/academy.git', 'factory.coolify.git_branch'=>'main',
        'factory.coolify.compose_location'=>'/docker-compose.coolify.yml',
    ]);
    Http::fake([
        'https://coolify.test/api/v1/projects' => Http::response(['uuid'=>'project-1'], 201),
        'https://coolify.test/api/v1/projects/project-1/environments' => Http::response(['uuid'=>'env-1'], 201),
        'https://coolify.test/api/v1/applications/public' => Http::response(['uuid'=>'app-1'], 201),
        'https://coolify.test/api/v1/applications/app-1/envs' => Http::sequence()
            ->push([['key'=>'APP_NAME']], 200)
            ->push(['uuid'=>'env-created'], 201),
        'https://coolify.test/api/v1/applications/app-1/envs/bulk' => Http::response([], 201),
    ]);
    $client = app(CoolifyClient::class);
    $project = $client->createProject('Academy Test');
    $env = $client->createEnvironment($project);
    $app = $client->createApplication($project, $env, 'Academy Test');
    $client->updateEnvironment($app, ['APP_NAME'=>'Academy Test', 'APP_URL'=>'https://academy.test']);
    expect([$project,$env,$app])->toBe(['project-1','env-1','app-1']);
    Http::assertSent(fn ($request) => $request->url() === 'https://coolify.test/api/v1/applications/public' && $request['build_pack'] === 'dockercompose' && $request['docker_compose_location'] === '/docker-compose.coolify.yml');
    Http::assertSent(fn ($request) => $request->method() === 'POST' && $request->url() === 'https://coolify.test/api/v1/applications/app-1/envs' && $request['key'] === 'APP_URL');
    Http::assertSent(fn ($request) => $request->method() === 'PATCH' && $request->url() === 'https://coolify.test/api/v1/applications/app-1/envs/bulk' && data_get($request->data(), 'data.0.key') === 'APP_NAME');
});

test('disabled feature returns not found instead of exposing the endpoint', function () {
    config(['academy.features.community'=>false]);
    $this->get(route('community.forum'))->assertNotFound();
});
