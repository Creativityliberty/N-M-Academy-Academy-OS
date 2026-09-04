<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);

$fail = static function (string $message): never {
    fwrite(STDERR, $message."\n");
    exit(1);
};

$requireFile = static function (string $path) use ($root, $fail): string {
    $full = $root.'/'.$path;
    if (! is_file($full)) {
        $fail("Missing M13.8 file: {$path}");
    }

    return (string) file_get_contents($full);
};

$rich = $requireFile('resources/js/mission-tower/components/rich-markdown.tsx');
foreach ([
    'sanitizeUrl',
    'parseInline',
    'renderTable',
    'renderCodeBlock',
    'blockquote',
    'line-through',
    'overflow-x-auto',
    'navigator.clipboard',
] as $needle) {
    if (! str_contains($rich, $needle)) {
        $fail("Rich Markdown primitive missing: {$needle}");
    }
}
if (str_contains($rich, 'dangerouslySetInnerHTML')) {
    $fail('Rich Markdown must not use dangerouslySetInnerHTML.');
}

foreach ([
    'resources/js/mission-tower/components/tower-activity-orb.tsx',
    'resources/js/mission-tower/components/tower-tool-card.tsx',
    'resources/js/mission-tower/components/tower-mission-card.tsx',
    'resources/js/mission-tower/components/tower-approval-card.tsx',
    'resources/js/mission-tower/components/tower-evidence-card.tsx',
    'resources/js/mission-tower/components/tower-composer.tsx',
] as $path) {
    $requireFile($path);
}

$chat = $requireFile('resources/js/mission-tower/pages/chat.tsx');
foreach ([
    'RichMarkdown',
    'TowerActivityOrb',
    'TowerToolCard',
    'TowerMissionCard',
    'TowerApprovalCard',
    'TowerEvidenceCard',
    'TowerComposer',
    'copyMessage',
    'retryMessage',
    'nearBottomRef',
] as $needle) {
    if (! str_contains($chat, $needle)) {
        $fail("Tower Chat rich UX wiring missing: {$needle}");
    }
}
if (str_contains($chat, '<p className="whitespace-pre-wrap">{message.content}</p>')) {
    $fail('Tower Chat still renders assistant content as raw pre-wrapped text.');
}

$controller = $requireFile('app/MissionTower/Http/Controllers/TowerChatController.php');
foreach (['mission.steps', 'run.evidence', "'tools' =>", "'evidence' =>", "'evidenceCount' =>"] as $needle) {
    if (! str_contains($controller, $needle)) {
        $fail("Tower Chat DTO missing structured execution context: {$needle}");
    }
}


$composer = $requireFile('app/MissionTower/Services/TowerChatResponseComposer.php');
foreach (['Markdown', 'tables', 'bullet lists', 'Do not wrap the whole answer in a code block'] as $needle) {
    if (! str_contains($composer, $needle)) {
        $fail("Tower mission response prompt does not request rich Markdown: {$needle}");
    }
}

$router = $requireFile('app/MissionTower/Services/TowerChatRouter.php');
foreach (['Markdown', 'tables when they improve clarity', 'Do not output raw JSON'] as $needle) {
    if (! str_contains($router, $needle)) {
        $fail("Tower direct-answer prompt does not request rich Markdown: {$needle}");
    }
}

$workflow = $requireFile('.github/workflows/tests.yml');
if (! str_contains($workflow, 'M13_8TowerChatRichUxContractTest.php')) {
    $fail('CI does not run the M13.8 contract.');
}

$nav = $requireFile('resources/js/mission-tower/components/tower-nav.tsx');
foreach (['/tower/chat', '/tower/missions', '/tower/insights', '/tower/approvals', '/tower/runs', '/tower/evidence', '/tower/memory'] as $needle) {
    if (! str_contains($nav, $needle)) {
        $fail("Existing Tower navigation was damaged: {$needle}");
    }
}


foreach (['VERSION', 'PACKAGE_VERSION'] as $path) {
    $version = trim($requireFile($path));
    if (! version_compare($version, '1.1.9', '>=')) {
        $fail("M13.8 requires release version >= 1.1.9 in {$path}.");
    }
}
foreach (['.env.example', '.env.coolify.example', 'config/academy.php', 'docker-compose.coolify.yml'] as $path) {
    if (! preg_match('/1\.(?:[2-9]|1[0-9])\.[0-9]+|1\.1\.(?:9|[1-9][0-9]+)/', $requireFile($path))) {
        $fail("M13.8 runtime version wiring is older than 1.1.9 in {$path}.");
    }
}

echo "M13.8 Tower Chat Rich UX contract PASS\n";
