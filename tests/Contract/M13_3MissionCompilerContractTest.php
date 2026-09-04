<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$required = [
    'app/MissionTower/Models/TowerCompilation.php',
    'app/MissionTower/Services/TowerAiProviderResolver.php',
    'app/MissionTower/Services/MissionCompiler.php',
    'app/MissionTower/Services/CompiledMissionValidator.php',
    'app/MissionTower/Services/CompilationApplyService.php',
    'app/MissionTower/Http/Controllers/MissionCompilerController.php',
    'resources/js/mission-tower/pages/compiler.tsx',
];
foreach ($required as $path) {
    if (! is_file($root.'/'.$path)) {
        fwrite(STDERR, "Missing M13.3 file: {$path}\n");
        exit(1);
    }
}

$routes = file_get_contents($root.'/routes/mission-tower.php');
foreach (['/compiler', 'compiler.compile', 'compiler.apply'] as $needle) {
    if (! str_contains($routes, $needle)) {
        fwrite(STDERR, "Mission Compiler route missing: {$needle}\n");
        exit(1);
    }
}

$compiler = file_get_contents($root.'/app/MissionTower/Services/MissionCompiler.php');
foreach (['structured(', 'TowerToolCatalog', 'CompiledMissionValidator', 'mission_plan'] as $needle) {
    if (! str_contains($compiler, $needle)) {
        fwrite(STDERR, "MissionCompiler primitive missing: {$needle}\n");
        exit(1);
    }
}

$validator = file_get_contents($root.'/app/MissionTower/Services/CompiledMissionValidator.php');
foreach (['inputSchema', "['risk']", 'max_mission_steps', 'additionalProperties'] as $needle) {
    if (! str_contains($validator, $needle)) {
        fwrite(STDERR, "Compiled plan safety validation missing: {$needle}\n");
        exit(1);
    }
}

$apply = file_get_contents($root.'/app/MissionTower/Services/CompilationApplyService.php');
foreach (['lockForUpdate()', "'source' => 'compiler'", 'mission_id', 'applied_at'] as $needle) {
    if (! str_contains($apply, $needle)) {
        fwrite(STDERR, "Proposal apply protection missing: {$needle}\n");
        exit(1);
    }
}

$model = file_get_contents($root.'/app/MissionTower/Models/TowerCompilation.php');
foreach (['proposal', 'warnings', 'mission_id', 'applied_at'] as $needle) {
    if (! str_contains($model, $needle)) {
        fwrite(STDERR, "TowerCompilation audit field missing: {$needle}\n");
        exit(1);
    }
}

echo "M13.3 Mission Compiler contract PASS\n";
