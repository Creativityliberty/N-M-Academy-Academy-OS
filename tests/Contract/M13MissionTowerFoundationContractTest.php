<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$required = [
    'config/mission-tower.php',
    'routes/mission-tower.php',
    'app/MissionTower/Contracts/AcademyGateway.php',
    'app/MissionTower/Bridge/AcademyMcpHttpGateway.php',
    'app/MissionTower/Services/TowerReadiness.php',
    'app/Console/Commands/CheckMissionTower.php',
    'app/Http/Controllers/MissionTower/OverviewController.php',
    'resources/js/mission-tower/pages/overview.tsx',
    'docs/MISSION-TOWER-SETUP.md',
];
foreach ($required as $path) {
    if (! is_file($root.'/'.$path)) {
        fwrite(STDERR, "Missing M13 foundation file: {$path}\n");
        exit(1);
    }
}
$config = file_get_contents($root.'/config/mission-tower.php');
$routes = file_get_contents($root.'/routes/mission-tower.php');
$env = file_get_contents($root.'/.env.coolify.example');
$sidebar = file_get_contents($root.'/resources/js/components/app-sidebar.tsx');
foreach (['TOWER_ENABLED', 'TOWER_ACADEMY_MCP_URL', 'TOWER_ACADEMY_MCP_TOKEN', 'TOWER_NUMFLOW_ENABLED', 'TOWER_HARNESS_ENABLED'] as $needle) {
    if (! str_contains($env, $needle)) {
        fwrite(STDERR, "Missing Tower env: {$needle}\n");
        exit(1);
    }
}
if (! str_contains($routes, "prefix('tower')") || ! str_contains($routes, "feature:tower")) {
    fwrite(STDERR, "Tower routes are not feature-gated.\n"); exit(1);
}
if (! str_contains($config, "academy_mcp") || ! str_contains($config, "numflow") || ! str_contains($config, "harness")) {
    fwrite(STDERR, "Tower config boundaries missing.\n"); exit(1);
}
if (! str_contains($sidebar, 'Mission Tower')) {
    fwrite(STDERR, "Mission Tower sidebar entry missing.\n"); exit(1);
}
echo "M13 Mission Tower foundation contract PASS\n";
