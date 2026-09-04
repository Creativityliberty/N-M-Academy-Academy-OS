<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$failures = [];

$requiredFiles = [
    'app/Models/CommunitySpace.php',
    'app/Models/CommunityPost.php',
    'app/Models/CommunityComment.php',
    'app/Models/CommunityReaction.php',
    'app/Models/CommunityAttachment.php',
    'app/Http/Controllers/Community/CommunityController.php',
    'app/Http/Controllers/Community/CommunityPostController.php',
    'app/Http/Controllers/Community/CommunityCommentController.php',
    'app/Http/Controllers/Community/CommunityReactionController.php',
    'app/Http/Controllers/Community/CommunityModerationController.php',
    'app/Http/Controllers/Community/CommunitySpaceController.php',
    'database/migrations/2026_08_31_033000_create_community_tables.php',
    'resources/js/features/community/types.ts',
    'resources/js/features/community/community-post-card.tsx',
    'resources/js/pages/community/index.tsx',
];

foreach ($requiredFiles as $file) {
    if (! is_file($root.'/'.$file)) {
        $failures[] = "Missing file: {$file}";
    }
}

$routeSource = file_get_contents($root.'/routes/public.php');
$routeNeedles = [
    "CommunityController::class, 'index'",
    "name('community.forum')",
    "name('community.posts.store')",
    "name('community.comments.store')",
    "name('community.reactions.store')",
    "name('community.posts.moderate')",
    "name('community.comments.moderate')",
    "name('community.spaces.store')",
];

foreach ($routeNeedles as $needle) {
    if (! str_contains($routeSource, $needle)) {
        $failures[] = "Missing community route contract: {$needle}";
    }
}

$forumSource = file_get_contents($root.'/resources/js/pages/home/community/forum.tsx');
foreach (['initialThreads', 'Quel logiciel de montage vidéo choisir'] as $forbidden) {
    if (str_contains($forumSource, $forbidden)) {
        $failures[] = "Public forum still contains demo data: {$forbidden}";
    }
}

$sidebarSource = file_get_contents($root.'/resources/js/components/app-sidebar.tsx');
if (! str_contains($sidebarSource, "title: 'Communauté'")) {
    $failures[] = 'Authenticated sidebar is missing the Community entry';
}

if (is_file($root.'/app/Http/Controllers/Community/CommunityModerationController.php')) {
    $moderationSource = file_get_contents($root.'/app/Http/Controllers/Community/CommunityModerationController.php');
    foreach (['trainer', 'admin', 'super-admin'] as $role) {
        if (! str_contains($moderationSource, "'{$role}'")) {
            $failures[] = "Moderation guard is missing role: {$role}";
        }
    }
}

if (is_file($root.'/database/migrations/2026_08_31_033000_create_community_tables.php')) {
    $migrationSource = file_get_contents($root.'/database/migrations/2026_08_31_033000_create_community_tables.php');
    foreach (['community_spaces', 'community_posts', 'community_comments', 'community_reactions', 'community_attachments'] as $table) {
        if (! str_contains($migrationSource, "'{$table}'")) {
            $failures[] = "Migration is missing table: {$table}";
        }
    }
}

if ($failures !== []) {
    fwrite(STDERR, "M05 contract RED\n- ".implode("\n- ", $failures)."\n");
    exit(1);
}

echo "M05 community contract PASS\n";
