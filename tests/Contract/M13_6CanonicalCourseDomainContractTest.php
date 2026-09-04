<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$fail = static function (string $message): never { fwrite(STDERR, $message."\n"); exit(1); };
$read = static function (string $path) use ($root, $fail): string {
    $full = $root.'/'.$path;
    if (! is_file($full)) { $fail("Missing M13.6 file: {$path}"); }
    return (string) file_get_contents($full);
};

$migrationMatches = glob($root.'/database/migrations/*_extend_course_creation_domain.php') ?: [];
if (count($migrationMatches) !== 1) { $fail('M13.6 canonical course migration is missing or ambiguous.'); }
$migration = (string) file_get_contents($migrationMatches[0]);
foreach (['target_audience','level','language','positioning','thumbnail','description','objectives'] as $needle) {
    if (! str_contains($migration, $needle)) { $fail("Canonical migration missing {$needle}"); }
}

$course = $read('app/Models/Course.php');
foreach (['target_audience','level','language','positioning','thumbnail'] as $needle) {
    if (! str_contains($course, "'{$needle}'")) { $fail("Course model missing {$needle}"); }
}
$module = $read('app/Models/Module.php');
foreach (['description','objectives'] as $needle) {
    if (! str_contains($module, "'{$needle}'")) { $fail("Module model missing {$needle}"); }
}
$lessonType = $read('app/Enums/LessonType.php');
if (! str_contains($lessonType, "case Text = 'text'")) { $fail('LessonType::Text is missing.'); }

$generate = $read('app/AI/Capabilities/GenerateCourseCapability.php');
foreach (['level','language','positioning','main_problem','desired_transformation','main_promise','unique_angle'] as $needle) {
    if (! str_contains($generate, "'{$needle}'")) { $fail("course.generate schema missing {$needle}"); }
}
$apply = $read('app/Actions/Trainer/AcademyAi/ApplyAcademyAiRunAction.php');
foreach (['target_audience','level','language','positioning',"LessonType::Text"] as $needle) {
    if (! str_contains($apply, $needle)) { $fail("Academy AI apply missing {$needle}"); }
}

$registry = $read('app/Mcp/AcademyMcpToolRegistry.php');
foreach ([
    'categories.list','courses.get','courses.unpublish','courses.archive',
    'modules.list','modules.update','modules.delete','modules.reorder',
    'lessons.list','lessons.delete','lessons.reorder',
    'offers.list','offers.update','offers.deactivate','pages.list','pages.create',
    'course.cover.generate','course.thumbnail.generate','lesson.audio.generate',
] as $tool) {
    if (! str_contains($registry, "'{$tool}'")) { $fail("MCP registry missing {$tool}"); }
}
$registryMeta = $registry;
$offerUpdatePos = strpos($registry, "'offers.update'");
$offerUpdateSlice = $offerUpdatePos === false ? '' : substr($registry, $offerUpdatePos, 1000);
if (! str_contains($offerUpdateSlice, 'self::SENSITIVE')) {
    $fail('offers.update must require SENSITIVE approval because it can change or activate live pricing.');
}

foreach (['offers.list','offers.update','offers.deactivate'] as $financialTool) {
    $financialSection = strstr($registryMeta, "'com.numtema.academy/dataClass'");
    if ($financialSection === false || ! str_contains($financialSection, "'{$financialTool}'")) {
        $fail("MCP financial dataClass missing {$financialTool}");
    }
}

$executor = $read('app/Mcp/AcademyMcpToolExecutor.php');
foreach (['categoriesList','coursesGet','modulesList','modulesUpdate','modulesDelete','modulesReorder','lessonsList','lessonsDelete','lessonsReorder','offersList','offersUpdate','offersDeactivate','pagesList','pagesCreate','courseCoverGenerate','courseThumbnailGenerate','lessonAudioGenerate'] as $method) {
    if (! str_contains($executor, "{$method}(") ) { $fail("MCP executor missing {$method}"); }
}
if (substr_count($executor, 'IndexCourseKnowledge::dispatch') < 6) {
    $fail('Curriculum mutations do not consistently queue knowledge reindexing.');
}
if (! str_contains($executor, 'normalizeLessonMediaInput(') || substr_count($executor, 'normalizeLessonMediaInput(') < 3) {
    $fail('MCP lesson mutations do not normalize mutually exclusive media references.');
}

foreach ([
    'app/AI/Contracts/ImageGenerationProvider.php',
    'app/AI/Contracts/SpeechGenerationProvider.php',
    'app/AI/Providers/OpenAiImageGenerationProvider.php',
    'app/AI/Providers/OpenAiSpeechGenerationProvider.php',
    'app/AI/MediaProviderManager.php',
    'app/Services/Courses/CourseMediaGenerationService.php',
] as $file) { $read($file); }

$config = $read('config/academy-ai.php');
foreach (['image_provider','tts_provider','gpt-image-2','gpt-4o-mini-tts','OPENAI_TTS_VOICE'] as $needle) {
    if (! str_contains($config, $needle)) { $fail("academy-ai config missing {$needle}"); }
}
foreach (['.env.example','.env.coolify.example'] as $envFile) {
    $env = $read($envFile);
    foreach (['ACADEMY_IMAGE_PROVIDER','OPENAI_IMAGE_MODEL','ACADEMY_TTS_PROVIDER','OPENAI_TTS_MODEL','OPENAI_TTS_VOICE'] as $needle) {
        if (! str_contains($env, $needle)) { $fail("{$envFile} missing {$needle}"); }
    }
}




$mediaService = $read('app/Services/Courses/CourseMediaGenerationService.php');
if (str_contains($mediaService, "'type'=>LessonType::Audio->value") || str_contains($mediaService, "'type' => LessonType::Audio->value")) {
    $fail('AI narration must attach audio_url without replacing a text lesson type.');
}
$studentLessonMedia = $read('resources/js/pages/student/courses/partials/lesson-media.tsx');
if (! str_contains($studentLessonMedia, "type === 'text'") || ! str_contains($studentLessonMedia, 'lesson.audio_url')) {
    $fail('Text lessons do not render optional generated narration audio.');
}

$read('app/Http/Controllers/Trainer/Courses/CourseMediaController.php');
$trainerRoutes = $read('routes/trainer.php');
foreach (['generate-image','generate-audio','CourseMediaController'] as $needle) {
    if (! str_contains($trainerRoutes, $needle)) { $fail("Trainer media routes missing {$needle}"); }
}
$editUi = $read('resources/js/pages/trainer/courses/edit.tsx');
foreach (['Générer la cover','Générer la thumbnail','generate-audio'] as $needle) {
    if (! str_contains($editUi, $needle)) { $fail("Course Studio media UI missing {$needle}"); }
}

$publicRepo = $read('app/Repositories/Public/Courses/EloquentCourseRepository.php');
if (substr_count($publicRepo, "'offers'") < 4) { $fail('Public course repository does not consistently eager-load CourseOffer pricing.'); }
$publicCourseResource = $read('app/Http/Resources/Public/CourseResource.php');
foreach (['displayOffer','amount / 100'] as $needle) {
    if (! str_contains($publicCourseResource, $needle)) { $fail("Public CourseResource is not CourseOffer-price canonical: {$needle}"); }
}

$trainerUpdate = $read('app/Actions/Trainer/Courses/UpdateCourseAction.php');
foreach (['Stripe::setApiKey', 'Product::update(', 'Price::create(', 'Price::update('] as $needle) {
    if (str_contains($trainerUpdate, $needle)) { $fail("Trainer course update still mutates Stripe legacy catalog: {$needle}"); }
}


foreach (['app/Http/Requests/Trainer/Courses/StoreCourseRequest.php','app/Http/Requests/Trainer/Courses/UpdateCourseRequest.php'] as $path) {
    $request = $read($path);
    foreach (['target_audience','level','language','positioning','modules.*.description','modules.*.minimum_access_rank'] as $needle) {
        if (! str_contains($request, $needle)) { $fail("{$path} missing canonical validation {$needle}"); }
    }
}
$trainerResource = $read('app/Http/Resources/Trainer/CourseResource.php');
foreach (['target_audience','level','language','positioning','thumbnail','minimum_access_rank'] as $needle) {
    if (! str_contains($trainerResource, $needle)) { $fail("Trainer CourseResource missing {$needle}"); }
}
foreach (['resources/js/pages/trainer/courses/create.tsx','resources/js/pages/trainer/courses/edit.tsx'] as $path) {
    $form = $read($path);
    foreach (['target_audience','positioning[main_problem]','modules[${mi}][description]','lessons][${li}][content]','lessons][${li}][transcript]'] as $needle) {
        if (! str_contains($form, $needle)) { $fail("{$path} missing form serialization {$needle}"); }
    }
}

$lessonTypes = $read('resources/js/types/lesson.ts');
if (! str_contains($lessonTypes, "'text'")) { $fail('Frontend LessonType does not expose text lessons.'); }

$ci = $read('.github/workflows/tests.yml');
if (! str_contains($ci, 'M13_6CanonicalCourseDomainContractTest.php')) { $fail('CI does not run M13.6 contract.'); }

echo "M13.6 Canonical Course Domain + AI/Tower CRUD contract PASS\n";
