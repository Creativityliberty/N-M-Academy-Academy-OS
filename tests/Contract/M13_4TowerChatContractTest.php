<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$required = [
    'app/MissionTower/Models/TowerChatThread.php',
    'app/MissionTower/Models/TowerChatMessage.php',
    'app/MissionTower/Services/TowerChatService.php',
    'app/MissionTower/Services/TowerChatRouter.php',
    'app/MissionTower/Services/TowerChatContextBuilder.php',
    'app/MissionTower/Services/TowerChatResponseComposer.php',
    'app/MissionTower/Http/Controllers/TowerChatController.php',
    'resources/js/mission-tower/pages/chat.tsx',
];
foreach ($required as $path) {
    if (! is_file($root.'/'.$path)) {
        fwrite(STDERR, "Missing M13.4 file: {$path}\n");
        exit(1);
    }
}

$routes = file_get_contents($root.'/routes/mission-tower.php');
foreach (['/chat', 'chat.message', 'chat.approval'] as $needle) {
    if (! str_contains($routes, $needle)) {
        fwrite(STDERR, "Tower Chat route missing: {$needle}\n");
        exit(1);
    }
}

$service = file_get_contents($root.'/app/MissionTower/Services/TowerChatService.php');
foreach (['MissionCompiler', 'CompilationApplyService', 'MissionRunner', 'ApprovalDecisionService', 'TowerChatResponseComposer'] as $needle) {
    if (! str_contains($service, $needle)) {
        fwrite(STDERR, "Tower Chat orchestration primitive missing: {$needle}\n");
        exit(1);
    }
}
foreach (['awaiting_approval', 'approval_required', 'mission_result'] as $needle) {
    if (! str_contains($service, $needle)) {
        fwrite(STDERR, "Tower Chat governed flow missing: {$needle}\n");
        exit(1);
    }
}

$router = file_get_contents($root.'/app/MissionTower/Services/TowerChatRouter.php');
foreach (['structured(', 'conversation', 'academy_action', 'direct_answer', 'TOWER CONTEXT'] as $needle) {
    if (! str_contains($router, $needle)) {
        fwrite(STDERR, "Tower Chat router primitive missing: {$needle}\n");
        exit(1);
    }
}

$composer = file_get_contents($root.'/app/MissionTower/Services/TowerChatResponseComposer.php');
foreach (['sanitizeForProvider', '[REDACTED]', 'ONLY the supplied mission results/evidence'] as $needle) {
    if (! str_contains($composer, $needle)) {
        fwrite(STDERR, "Tower Chat grounded response safety missing: {$needle}\n");
        exit(1);
    }
}

$chatPage = file_get_contents($root.'/resources/js/mission-tower/pages/chat.tsx');
foreach (['approval_required', 'TowerApprovalCard', 'required_phrase', '/tower/chat/'] as $needle) {
    if (! str_contains($chatPage, $needle)) {
        fwrite(STDERR, "Inline approval UI missing: {$needle}\n");
        exit(1);
    }
}
$approvalCard = file_get_contents($root.'/resources/js/mission-tower/components/tower-approval-card.tsx');
foreach (['Approuver', 'Refuser', 'required_phrase', '/tower/chat/'] as $needle) {
    if (! str_contains($approvalCard, $needle)) {
        fwrite(STDERR, "Delegated inline approval UI missing: {$needle}\n");
        exit(1);
    }
}

$config = file_get_contents($root.'/config/mission-tower.php');
foreach (['chat', 'history_messages', 'auto_run_read'] as $needle) {
    if (! str_contains($config, $needle)) {
        fwrite(STDERR, "Tower Chat configuration missing: {$needle}\n");
        exit(1);
    }
}

echo "M13.4 Tower Chat contract PASS\n";
