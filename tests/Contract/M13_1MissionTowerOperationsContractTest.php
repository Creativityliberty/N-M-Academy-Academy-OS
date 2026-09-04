<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$required = [
    'app/MissionTower/Models/TowerMission.php',
    'app/MissionTower/Models/TowerMissionStep.php',
    'app/MissionTower/Models/TowerRun.php',
    'app/MissionTower/Models/TowerApproval.php',
    'app/MissionTower/Models/TowerEvidence.php',
    'app/MissionTower/Services/MissionRunner.php',
    'app/MissionTower/Services/ApprovalDecisionService.php',
    'app/MissionTower/Http/Controllers/MissionController.php',
    'app/MissionTower/Http/Controllers/ApprovalController.php',
    'app/MissionTower/Http/Controllers/RunController.php',
    'app/MissionTower/Http/Controllers/EvidenceController.php',
    'resources/js/mission-tower/pages/missions/index.tsx',
    'resources/js/mission-tower/pages/missions/show.tsx',
    'resources/js/mission-tower/pages/approvals.tsx',
    'resources/js/mission-tower/pages/runs.tsx',
    'resources/js/mission-tower/pages/evidence.tsx',
];

foreach ($required as $path) {
    if (! is_file($root.'/'.$path)) {
        fwrite(STDERR, "Missing M13.1 file: {$path}\n");
        exit(1);
    }
}

$migrations = glob($root.'/database/migrations/*tower_*');
if (! is_array($migrations) || count($migrations) < 5) {
    fwrite(STDERR, "Mission Tower operation migrations missing.\n");
    exit(1);
}

$routes = file_get_contents($root.'/routes/mission-tower.php');
foreach (['missions', 'approvals', 'runs', 'evidence'] as $needle) {
    if (! str_contains($routes, $needle)) {
        fwrite(STDERR, "Tower route surface missing: {$needle}\n");
        exit(1);
    }
}

$runner = file_get_contents($root.'/app/MissionTower/Services/MissionRunner.php');
foreach (['resultType', 'input_required', 'TowerApproval', 'EvidenceRecorder', 'AcademyGateway'] as $needle) {
    if (! str_contains($runner, $needle)) {
        fwrite(STDERR, "MissionRunner missing governed execution primitive: {$needle}\n");
        exit(1);
    }
}

$approval = file_get_contents($root.'/app/MissionTower/Services/ApprovalDecisionService.php');
foreach (['request_state', 'inputResponses', 'required_phrase', 'completeApprovedStep'] as $needle) {
    if (! str_contains($approval, $needle)) {
        fwrite(STDERR, "Approval continuation missing: {$needle}\n");
        exit(1);
    }
}

$sidebar = file_get_contents($root.'/resources/js/components/app-sidebar.tsx');
if (! str_contains($sidebar, 'Mission Tower')) {
    fwrite(STDERR, "Mission Tower navigation missing.\n");
    exit(1);
}


$catalog = file_get_contents($root.'/app/MissionTower/Services/TowerToolCatalog.php');
if (! str_contains($catalog, "['com.numtema.academy/risk']") || ! str_contains($catalog, "['com.numtema.academy/scope']")) {
    fwrite(STDERR, "Tower must read literal MCP risk/scope metadata keys.\n");
    exit(1);
}

echo "M13.1 Mission Tower operations contract PASS\n";
