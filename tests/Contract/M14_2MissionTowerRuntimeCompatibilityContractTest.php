<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$fail = static function (string $message): never { fwrite(STDERR, $message."\n"); exit(1); };
$read = static function (string $path) use ($root, $fail): string {
    $full = $root.'/'.$path;
    if (! is_file($full)) { $fail("Missing runtime compatibility file: {$path}"); }
    return (string) file_get_contents($full);
};

foreach ([
    'resources/js/pages/mission-tower/overview.tsx',
    'resources/js/pages/mission-tower/chat.tsx',
    'resources/js/pages/mission-tower/compiler.tsx',
    'resources/js/pages/mission-tower/approvals.tsx',
    'resources/js/pages/mission-tower/evidence.tsx',
    'resources/js/pages/mission-tower/insights.tsx',
    'resources/js/pages/mission-tower/memory.tsx',
    'resources/js/pages/mission-tower/runs.tsx',
    'resources/js/pages/mission-tower/missions/index.tsx',
    'resources/js/pages/mission-tower/missions/show.tsx',
] as $path) {
    $page = $read($path);
    if (! str_contains($page, 'mission-tower/pages')) { $fail("Mission Tower Inertia adapter invalid: {$path}"); }
}

$mcp = $read('app/MissionTower/Bridge/AcademyMcpHttpGateway.php');
foreach (['AcademyMcpToken', 'token_hash', 'hash(\'sha256\'', 'AcademyMcpGateway', '->dispatch(', 'last_used_at', 'Local MCP token is invalid'] as $needle) {
    if (! str_contains($mcp, $needle)) { $fail("In-process MCP invariant missing: {$needle}"); }
}

$bootstrap = $read('bootstrap/app.php');
if (! str_contains($bootstrap, "'mcp'")) { $fail('MCP CSRF/session exclusion missing from bootstrap.'); }

$sidebar = $read('resources/js/components/app-sidebar.tsx');
foreach (['props.auth?.user', 'props.academy?.features ?? {}', 'props.academy?.factoryEnabled ?? false'] as $needle) {
    if (! str_contains($sidebar, $needle)) { $fail("SSR-safe sidebar invariant missing: {$needle}"); }
}
$hero = $read('resources/js/components/dashboard-hero.tsx');
foreach (['props.auth?.user?.name', "props.academy?.name ?? 'NÜM Academy'"] as $needle) {
    if (! str_contains($hero, $needle)) { $fail("SSR-safe dashboard hero invariant missing: {$needle}"); }
}

$controller = $read('app/MissionTower/Http/Controllers/TowerChatController.php');
foreach (['extendExecutionWindow', 'set_time_limit', 'sendNew', 'send(', 'decide('] as $needle) {
    if (! str_contains($controller, $needle)) { $fail("Tower request timeout invariant missing: {$needle}"); }
}
$config = $read('config/mission-tower.php');
if (! str_contains($config, 'request_timeout_seconds')) { $fail('Tower request timeout config missing.'); }

$router = $read('app/MissionTower/Services/TowerChatRouter.php');
foreach ([
    'Langue par défaut : français',
    'latest user message',
    'Do not repeat greetings',
    "sauf si l'utilisateur demande explicitement une autre langue",
] as $needle) {
    if (! str_contains($router, $needle)) { $fail("Tower French/conversation routing invariant missing: {$needle}"); }
}

$composer = $read('app/MissionTower/Services/TowerChatResponseComposer.php');
if (! str_contains($composer, 'Langue par défaut : français')) { $fail('Tower mission result composer is not French by default.'); }

$compiler = $read('app/MissionTower/Services/MissionCompiler.php');
foreach ([
    'Langue par défaut : français',
    'categories.list',
    'courses.create',
    'modules.create',
    'lessons.create',
    'target_audience',
    'positioning',
    'benefits',
    'prerequisites',
] as $needle) {
    if (! str_contains($compiler, $needle)) { $fail("Mission Compiler runtime invariant missing: {$needle}"); }
}

$package = json_decode($read('package.json'), true, 512, JSON_THROW_ON_ERROR);
if (($package['dependencies']['thinking-orbs'] ?? null) !== '^0.3.1') { $fail('thinking-orbs ^0.3.1 dependency missing.'); }
$lock = $read('package-lock.json');
if (! str_contains($lock, 'node_modules/thinking-orbs')) { $fail('thinking-orbs lockfile entry missing.'); }

$orb = $read('resources/js/components/ai/thinking-orb-visual.tsx');
foreach (["from 'thinking-orbs'", 'ThinkingOrb', 'theme="auto"'] as $needle) {
    if (! str_contains($orb, $needle)) { $fail("thinking-orbs adapter invariant missing: {$needle}"); }
}
if (! str_contains($orb, 'size={size}') && ! str_contains($orb, 'size={validSize}')) {
    $fail('thinking-orbs adapter must pass a bounded or direct size prop.');
}
$courseOrb = $read('resources/js/components/academy-ai/thinking-orb.tsx');
if (! str_contains($courseOrb, 'ThinkingOrbVisual')) { $fail('One-Brief does not use thinking-orbs adapter.'); }
$towerOrb = $read('resources/js/mission-tower/components/tower-activity-orb.tsx');
foreach (['ThinkingOrbVisual', "state = 'working'", 'Tower traite la demande'] as $needle) {
    if (! str_contains($towerOrb, $needle)) { $fail("Tower thinking-orbs integration missing: {$needle}"); }
}

foreach (['README.md', 'docs/MISSION-TOWER-SETUP.md'] as $path) {
    $doc = $read($path);
    foreach (['npm install thinking-orbs', 'français'] as $needle) {
        if (! str_contains(strtolower($doc), strtolower($needle))) { $fail("Setup documentation missing {$needle} in {$path}"); }
    }
}

$env = $read('.env.coolify.example');
foreach (['TOWER_CHAT_REQUEST_TIMEOUT=180', 'TOWER_ACADEMY_MCP_IN_PROCESS=true'] as $needle) {
    if (! str_contains($env, $needle)) { $fail("Coolify Tower runtime env missing: {$needle}"); }
}

$runtimeFeature = $read('tests/Feature/MissionTower/MissionTowerRuntimeCompatibilityTest.php');
foreach (['assertNothingSent', 'TOWER_ACADEMY_MCP_IN_PROCESS', 'AcademyMcpHttpGateway'] as $needle) {
    if (! str_contains($runtimeFeature, $needle)) { $fail("Tower runtime feature test missing: {$needle}"); }
}

$workflow = $read('.github/workflows/tests.yml');
if (! str_contains($workflow, 'M14_2MissionTowerRuntimeCompatibilityContractTest.php')) { $fail('CI does not run Tower runtime compatibility contract.'); }

echo "M14.2 Mission Tower runtime compatibility contract PASS\n";
