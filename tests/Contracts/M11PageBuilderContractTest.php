<?php
$root = dirname(__DIR__, 2);
$required = [
    'app/Models/AcademyPage.php',
    'app/Models/AcademyPageSection.php',
    'app/PageBuilder/PageBlockRegistry.php',
    'app/PageBuilder/PageSectionResolver.php',
    'app/Http/Controllers/Trainer/PageBuilderController.php',
    'app/Http/Controllers/Public/AcademyPageController.php',
    'resources/js/pages/trainer/pages/index.tsx',
    'resources/js/pages/trainer/pages/edit.tsx',
    'resources/js/pages/home/pages/show.tsx',
];
foreach ($required as $file) {
    if (!is_file($root.'/'.$file)) { fwrite(STDERR, "Missing: $file\n"); exit(1); }
}
$registry = file_get_contents($root.'/app/PageBuilder/PageBlockRegistry.php');
foreach (['hero','features','instructor','course','curriculum','testimonials','pricing','faq','cta','footer'] as $block) {
    if (!str_contains($registry, "'$block'")) { fwrite(STDERR, "Missing block $block\n"); exit(1); }
}
$routes = file_get_contents($root.'/routes/trainer.php').file_get_contents($root.'/routes/public.php');
foreach (['pages.index','pages.sections.reorder','academy-pages.show'] as $name) {
    if (!str_contains($routes, $name)) { fwrite(STDERR, "Missing route $name\n"); exit(1); }
}
$ai = file_get_contents($root.'/app/AI/AcademyAiCapabilityRegistry.php');
foreach (['page.generate','page.optimize'] as $cap) {
    if (!str_contains($ai, $cap)) { fwrite(STDERR, "Missing AI capability $cap\n"); exit(1); }
}
echo "M11 PAGE BUILDER CONTRACT PASS\n";
