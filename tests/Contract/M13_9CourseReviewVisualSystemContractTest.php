<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$fail = static function (string $message): never { fwrite(STDERR, $message."\n"); exit(1); };
$requireFile = static function (string $path) use ($root, $fail): string {
    $full = $root.'/'.$path;
    if (! is_file($full)) { $fail("Missing M13.9 file: {$path}"); }
    return (string) file_get_contents($full);
};

foreach ([
    'app/AI/Providers/GeminiImageGenerationProvider.php',
    'app/AI/ImageModelCatalog.php',
    'app/AI/VisualPromptCompiler.php',
    'app/AI/AcademyAiSettingsRepository.php',
    'app/AI/GeminiModelDiscoveryService.php',
    'app/Models/AcademyAiSetting.php',
    'app/Models/CourseMediaGeneration.php',
    'app/Models/CourseReviewProposal.php',
    'app/Services/Courses/CourseReviewProposalService.php',
    'app/Http/Controllers/Settings/AiProvidersController.php',
    'app/Http/Controllers/Trainer/CourseReviewController.php',
    'resources/js/pages/settings/ai-providers.tsx',
    'resources/js/pages/trainer/academy-ai/course-review.tsx',
] as $path) {
    $requireFile($path);
}

$gemini = $requireFile('app/AI/Providers/GeminiImageGenerationProvider.php');
foreach (['/v1beta/interactions', 'x-goog-api-key', 'response_format', 'aspect_ratio', 'image_size', 'gemini-3.1-flash-lite-image'] as $needle) {
    if (! str_contains($gemini, $needle)) { $fail("Gemini adapter invariant missing: {$needle}"); }
}

$catalog = $requireFile('app/AI/ImageModelCatalog.php');
foreach (['gemini-3.1-flash-lite-image', 'gemini-3.1-flash-image', 'gemini-3-pro-image'] as $needle) {
    if (! str_contains($catalog, $needle)) { $fail("Gemini curated model missing: {$needle}"); }
}

$compiler = $requireFile('app/AI/VisualPromptCompiler.php');
foreach (['COURSE CONTEXT', 'ACADEMY BRAND', 'ART DIRECTION', 'OUTPUT RULES', 'AVOID', 'course_cover', 'course_thumbnail', 'academy-premium', 'editorial', 'cinematic', 'minimal'] as $needle) {
    if (! str_contains($compiler, $needle)) { $fail("Visual prompt compiler invariant missing: {$needle}"); }
}

$media = $requireFile('app/Services/Courses/CourseMediaGenerationService.php');
foreach (['generateCourseImageCandidate', 'generateLessonAudioCandidate', 'CourseMediaGeneration'] as $needle) {
    if (! str_contains($media, $needle)) { $fail("Media candidate invariant missing: {$needle}"); }
}

$registry = $requireFile('app/AI/AcademyAiCapabilityRegistry.php');
foreach (['course.positioning.rewrite', 'module.rewrite'] as $needle) {
    if (! str_contains($registry, $needle)) { $fail("Review AI capability missing: {$needle}"); }
}

$reviewController = $requireFile('app/Http/Controllers/Trainer/CourseReviewController.php');
foreach (['PublishCourseAction', 'CourseReviewProposalService', 'pending', 'visible section', 'trainer.course-review.show'] as $needle) {
    if (! str_contains($reviewController, $needle)) { $fail("Review/publish invariant missing: {$needle}"); }
}

$routes = $requireFile('routes/trainer.php');
foreach (['course-review.show', 'course-review.propose', 'course-review.accept', 'course-review.reject', 'course-review.publish'] as $needle) {
    if (! str_contains($routes, $needle)) { $fail("Review route missing: {$needle}"); }
}

$settingsRoutes = $requireFile('routes/settings.php');
if (! str_contains($settingsRoutes, 'settings/ai-providers')) { $fail('AI Providers settings route missing.'); }

$config = $requireFile('config/academy-ai.php');
foreach (['GEMINI_API_KEY', 'gemini-3.1-flash-lite-image', 'ACADEMY_IMAGE_PROVIDER'] as $needle) {
    if (! str_contains($config, $needle)) { $fail("Gemini config missing: {$needle}"); }
}

foreach (['.env.example', '.env.coolify.example'] as $path) {
    $env = $requireFile($path);
    foreach (['GEMINI_API_KEY=', 'GEMINI_IMAGE_MODEL=gemini-3.1-flash-lite-image'] as $needle) {
        if (! str_contains($env, $needle)) { $fail("Gemini env wiring missing {$needle} in {$path}"); }
    }
}


$factory = $requireFile('app/Factory/AcademyFactoryBlueprintBuilder.php');
foreach (['ACADEMY_IMAGE_PROVIDER', 'GEMINI_IMAGE_MODEL', 'GEMINI_API_KEY', 'ACADEMY_IMAGE_PROMPT_PRESET'] as $needle) {
    if (! str_contains($factory, $needle)) { $fail("Academy Factory Gemini provisioning missing: {$needle}"); }
}

$factoryController = $requireFile('app/Http/Controllers/Admin/AcademyFactoryController.php');
foreach (['ai.image_provider', 'ai.image_model', 'ai.gemini_api_key'] as $needle) {
    if (! str_contains($factoryController, $needle)) { $fail("Academy Factory Gemini validation missing: {$needle}"); }
}

$creation = $requireFile('app/Services/Courses/CourseCreationEngine.php');
if (str_contains($creation, 'private function imagePrompt')) { $fail('One-Brief still contains the old ad-hoc imagePrompt helper.'); }
if (! str_contains($media, 'VisualPromptCompiler')) { $fail('Course media service is not using VisualPromptCompiler.'); }

$workflow = $requireFile('.github/workflows/tests.yml');
if (! str_contains($workflow, 'M13_9CourseReviewVisualSystemContractTest.php')) { $fail('CI does not run M13.9 contract.'); }

foreach (['VERSION', 'PACKAGE_VERSION'] as $path) {
    if (version_compare(trim($requireFile($path)), '1.2.0', '<')) { $fail("M13.9 requires release version >= 1.2.0 in {$path}."); }
}

$academyConfig = $requireFile('config/academy.php');
if (! preg_match("/'version'\\s*=>\\s*env\\('ACADEMY_VERSION',\\s*'([^']+)'\\)/", $academyConfig, $versionMatch) || version_compare($versionMatch[1], '1.2.0', '<')) {
    $fail('Academy runtime version regressed below M13.9.');
}

$nav = $requireFile('resources/js/mission-tower/components/tower-nav.tsx');
foreach (['/tower/chat','/tower/missions','/tower/insights','/tower/approvals','/tower/runs','/tower/evidence','/tower/memory'] as $needle) {
    if (! str_contains($nav, $needle)) { $fail("M13.8 Tower navigation damaged by M13.9: {$needle}"); }
}

echo "M13.9 Course Review + Visual System contract PASS\n";
