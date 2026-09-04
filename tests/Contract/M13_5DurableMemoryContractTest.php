<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$required = [
    'app/MissionTower/Models/TowerMemory.php',
    'app/MissionTower/Services/TowerMemoryPolicy.php',
    'app/MissionTower/Services/TowerMemoryStore.php',
    'app/MissionTower/Services/TowerMemoryRetriever.php',
    'app/MissionTower/Services/TowerThreadSummarizer.php',
    'app/MissionTower/Http/Controllers/MemoryController.php',
    'resources/js/mission-tower/pages/memory.tsx',
    'database/migrations/2026_08_31_234000_create_tower_memories_table.php',
    'database/migrations/2026_08_31_234010_add_summary_to_tower_chat_threads.php',
];
foreach ($required as $path) {
    if (! is_file($root.'/'.$path)) {
        fwrite(STDERR, "Missing M13.5 file: {$path}\n");
        exit(1);
    }
}

$model = file_get_contents($root.'/app/MissionTower/Models/TowerMemory.php');
foreach (['memory_key', 'category', 'scope', 'importance', 'pinned', 'supersedes_id', 'embedding', 'last_accessed_at'] as $needle) {
    if (! str_contains($model, $needle)) {
        fwrite(STDERR, "Tower memory field missing: {$needle}\n");
        exit(1);
    }
}

$policy = file_get_contents($root.'/app/MissionTower/Services/TowerMemoryPolicy.php');
foreach (['preference', 'decision', 'goal', 'constraint', 'result', 'context', 'requestState', 'OPENAI_API_KEY', 'MCP'] as $needle) {
    if (! str_contains($policy, $needle)) {
        fwrite(STDERR, "Tower memory safety primitive missing: {$needle}\n");
        exit(1);
    }
}

$store = file_get_contents($root.'/app/MissionTower/Services/TowerMemoryStore.php');
foreach (['lockForUpdate()', 'superseded', 'rememberMissionResult', 'EmbeddingProviderManager'] as $needle) {
    if (! str_contains($store, $needle)) {
        fwrite(STDERR, "Tower memory store primitive missing: {$needle}\n");
        exit(1);
    }
}

$retriever = file_get_contents($root.'/app/MissionTower/Services/TowerMemoryRetriever.php');
foreach (['vector', 'lexical', 'max_context', 'last_accessed_at', 'pinned'] as $needle) {
    if (! str_contains($retriever, $needle)) {
        fwrite(STDERR, "Tower memory retrieval primitive missing: {$needle}\n");
        exit(1);
    }
}

$router = file_get_contents($root.'/app/MissionTower/Services/TowerChatRouter.php');
foreach (['memory_candidates', 'thread_summary', 'DURABLE MEMORY', 'raw student PII'] as $needle) {
    if (! str_contains($router, $needle)) {
        fwrite(STDERR, "Tower Chat memory routing missing: {$needle}\n");
        exit(1);
    }
}

$service = file_get_contents($root.'/app/MissionTower/Services/TowerChatService.php');
foreach (['TowerMemoryStore', 'TowerThreadSummarizer', 'rememberCandidates', 'rememberMissionResult'] as $needle) {
    if (! str_contains($service, $needle)) {
        fwrite(STDERR, "Tower Chat memory lifecycle missing: {$needle}\n");
        exit(1);
    }
}

$routes = file_get_contents($root.'/routes/mission-tower.php');
foreach (['/memory', 'memory.pin', 'memory.forget'] as $needle) {
    if (! str_contains($routes, $needle)) {
        fwrite(STDERR, "Tower Memory route missing: {$needle}\n");
        exit(1);
    }
}

$config = file_get_contents($root.'/config/mission-tower.php');
foreach (['memory', 'max_context', 'semantic', 'retention_days', 'summary_trigger_messages'] as $needle) {
    if (! str_contains($config, $needle)) {
        fwrite(STDERR, "Tower memory configuration missing: {$needle}\n");
        exit(1);
    }
}


$compose = file_get_contents($root.'/docker-compose.coolify.yml');
foreach (['TOWER_MEMORY_ENABLED', 'TOWER_CHAT_SUMMARY_TRIGGER_MESSAGES', 'pgvector/pgvector:0.8.6-pg17'] as $needle) {
    if (! str_contains($compose, $needle)) {
        fwrite(STDERR, "M13.5 Coolify memory/runtime wiring missing: {$needle}\n");
        exit(1);
    }
}

$ci = file_get_contents($root.'/.github/workflows/tests.yml');
foreach (['pgvector/pgvector:0.8.6-pg17', 'redis:7-alpine', 'migrate:fresh --force', 'npm run build:ssr', 'docker build --tag num-academy-os:ci .'] as $needle) {
    if (! str_contains($ci, $needle)) {
        fwrite(STDERR, "M13.5 real CI gate missing: {$needle}\n");
        exit(1);
    }
}

echo "M13.5 Durable Memory contract PASS\n";
