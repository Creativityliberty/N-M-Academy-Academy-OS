<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$required = [
    'app/MissionTower/Models/TowerObservatorySnapshot.php',
    'app/MissionTower/Models/TowerInsight.php',
    'app/MissionTower/Services/ObservatoryCollector.php',
    'app/MissionTower/Services/ObservatorySignalEngine.php',
    'app/MissionTower/Services/InsightMissionFactory.php',
    'app/MissionTower/Http/Controllers/InsightsController.php',
    'app/Console/Commands/ObserveAcademy.php',
    'resources/js/mission-tower/pages/insights.tsx',
];
foreach ($required as $path) {
    if (! is_file($root.'/'.$path)) {
        fwrite(STDERR, "Missing M13.2 file: {$path}\n");
        exit(1);
    }
}

$registry = file_get_contents($root.'/app/Mcp/AcademyMcpToolRegistry.php');
foreach (['ai.usage.summary', 'students.risk.summary'] as $tool) {
    if (! str_contains($registry, "'{$tool}'")) {
        fwrite(STDERR, "Missing Observatory MCP tool: {$tool}\n");
        exit(1);
    }
}

$collector = file_get_contents($root.'/app/MissionTower/Services/ObservatoryCollector.php');
foreach (['sales.summary','analytics.summary','analytics.learning','students.risk.summary','community.posts.list','events.list','ai.usage.summary'] as $tool) {
    if (! str_contains($collector, $tool)) {
        fwrite(STDERR, "Observatory source missing: {$tool}\n");
        exit(1);
    }
}

$engine = file_get_contents($root.'/app/MissionTower/Services/ObservatorySignalEngine.php');
foreach (['refund_rate','conversion_drop','learning_risk','event_fill','community_silence','ai_cost_spike'] as $rule) {
    if (! str_contains($engine, $rule)) {
        fwrite(STDERR, "Signal rule missing: {$rule}\n");
        exit(1);
    }
}

$routes = file_get_contents($root.'/routes/mission-tower.php');
foreach (['/insights','insights.observe','insights.mission'] as $needle) {
    if (! str_contains($routes, $needle)) {
        fwrite(STDERR, "Insights route missing: {$needle}\n");
        exit(1);
    }
}

$console = file_get_contents($root.'/routes/console.php');
if (! str_contains($console, 'tower:observe') || ! str_contains($console, 'everyFifteenMinutes')) {
    fwrite(STDERR, "Observatory scheduler missing.\n");
    exit(1);
}


$signalEngine = file_get_contents($root.'/app/MissionTower/Services/ObservatorySignalEngine.php');
foreach (["whereIn('status', ['open', 'mission_created'])", "existing?->mission_id ? 'mission_created' : 'open'"] as $needle) {
    if (! str_contains($signalEngine, $needle)) {
        fwrite(STDERR, "Insight lifecycle protection missing: {$needle}\n");
        exit(1);
    }
}

$missionFactory = file_get_contents($root.'/app/MissionTower/Services/InsightMissionFactory.php');
if (! str_contains($missionFactory, 'lockForUpdate()')) {
    fwrite(STDERR, "Insight mission concurrency lock missing.\n");
    exit(1);
}

$executor = file_get_contents($root.'/app/Mcp/AcademyMcpToolExecutor.php');
foreach (['academyStudentIds', 'academyRiskStudentIds', 'unique()->count()'] as $needle) {
    if (! str_contains($executor, $needle)) {
        fwrite(STDERR, "Unique student risk aggregation missing: {$needle}\n");
        exit(1);
    }
}

echo "M13.2 Academy Observatory contract PASS\n";
