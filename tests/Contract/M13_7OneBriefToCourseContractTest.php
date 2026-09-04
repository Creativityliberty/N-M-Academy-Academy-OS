<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$fail = static function (string $message): never { fwrite(STDERR, $message."\n"); exit(1); };
$read = static function (string $path) use ($root, $fail): string {
    $full = $root.'/'.$path;
    if (! is_file($full)) { $fail("Missing M13.7 file: {$path}"); }
    return (string) file_get_contents($full);
};

$migrations = glob($root.'/database/migrations/*_create_course_creation_runs_table.php') ?: [];
if (count($migrations) !== 1) { $fail('M13.7 course creation run migration missing or ambiguous.'); }
$migration = (string) file_get_contents($migrations[0]);
foreach (['course_creation_runs','current_step','step_status','options','state','academy_ai_run_id','course_id','page_id','offer_id','completed_at'] as $needle) {
    if (! str_contains($migration, $needle)) { $fail("Course creation migration missing {$needle}"); }
}

$model = $read('app/Models/CourseCreationRun.php');
foreach (['blueprint','materialize','cover','thumbnail','narrations','offer','landing','review'] as $step) {
    if (! str_contains($model, "'{$step}'")) { $fail("CourseCreationRun step list missing {$step}"); }
}
foreach (['belongsTo(User::class','belongsTo(Course::class','belongsTo(AcademyPage::class','belongsTo(CourseOffer::class'] as $needle) {
    if (! str_contains($model, $needle)) { $fail("CourseCreationRun relation missing {$needle}"); }
}

$engine = $read('app/Services/Courses/CourseCreationEngine.php');
foreach (['AcademyAiRunner','ApplyAcademyAiRunAction','CourseMediaGenerationService','CourseOffer','page.generate','IndexCourseKnowledge'] as $needle) {
    if (! str_contains($engine, $needle)) { $fail("CourseCreationEngine does not reuse existing subsystem: {$needle}"); }
}
foreach (['advanceBlueprint','advanceMaterialize','advanceCover','advanceThumbnail','advanceNarrations','advanceOffer','advanceLanding','advanceReview'] as $method) {
    if (! str_contains($engine, $method.'(')) { $fail("CourseCreationEngine missing {$method}"); }
}
if (str_contains($engine, 'PublishCourseAction') || str_contains($engine, 'courses.publish') || str_contains($engine, "status' => CourseStatus::Published")) {
    $fail('M13.7 must never publish a generated course automatically.');
}
if (! str_contains($engine, "'slug' => 'ai-default'")) {
    $fail('Default AI offer must use deterministic ai-default slug for resume/idempotency.');
}
if (! str_contains($engine, 'firstWhere') && ! str_contains($engine, 'first()')) {
    $fail('Narration stage must select one eligible lesson at a time.');
}
if (! str_contains($engine, 'generateLessonAudio(')) {
    $fail('Narration stage does not use CourseMediaGenerationService.');
}

$request = $read('app/Http/Requests/Trainer/StartCourseCreationRequest.php');
foreach (['brief','category_id','price_major','currency','generate_cover','generate_thumbnail','generate_audio','generate_landing','voice'] as $needle) {
    if (! str_contains($request, "'{$needle}'")) { $fail("StartCourseCreationRequest missing {$needle}"); }
}

$controller = $read('app/Http/Controllers/Trainer/CourseCreationController.php');
foreach (['index(','start(','retry(','advance(','serializeRun('] as $method) {
    if (! str_contains($controller, $method)) { $fail("CourseCreationController missing {$method}"); }
}
if (! str_contains($controller, "where('user_id', \$trainer->id)") && ! str_contains($controller, "user_id !== \$trainer->id")) {
    $fail('CourseCreationController does not enforce trainer ownership.');
}

$routes = $read('routes/trainer.php');
foreach (['academy-ai/course-creation','course-creation.start','course-creation.retry','course-creation.advance','CourseCreationController'] as $needle) {
    if (! str_contains($routes, $needle)) { $fail("Trainer routes missing M13.7 surface {$needle}"); }
}

$orb = $read('resources/js/components/academy-ai/thinking-orb.tsx');
foreach (['shaping','weaving','composing','listening','connecting','solving','breathing','ThinkingOrbVisual'] as $needle) {
    if (! str_contains($orb, $needle)) { $fail("Thinking Orb missing state/adapter marker {$needle}"); }
}
$orbVisual = $read('resources/js/components/ai/thinking-orb-visual.tsx');
foreach (["from 'thinking-orbs'", 'aria-label'] as $needle) {
    if (! str_contains($orbVisual, $needle)) { $fail("Thinking Orb shared accessibility/runtime marker missing {$needle}"); }
}

$ui = $read('resources/js/pages/trainer/academy-ai/course-creation.tsx');
foreach (['Créer ma formation avec l’IA','Générer la cover','Générer la thumbnail','Narration audio','Landing page','advanceUrl','retryUrl','ThinkingOrb','Reprendre cette génération','Revoir la formation','Ouvrir la landing'] as $needle) {
    if (! str_contains($ui, $needle)) { $fail("One-Brief UI missing {$needle}"); }
}
if (str_contains($ui, '>Publier<') || str_contains($ui, 'Publier maintenant')) {
    $fail('One-Brief review UI must not offer automatic publishing.');
}

$academyUi = $read('resources/js/pages/trainer/academy-ai/index.tsx');
if (! str_contains($academyUi, 'Créer une formation complète')) {
    $fail('Academy AI index does not surface One-Brief-to-Course entry point.');
}

$ci = $read('.github/workflows/tests.yml');
if (! str_contains($ci, 'M13_7OneBriefToCourseContractTest.php')) {
    $fail('CI does not run M13.7 contract.');
}

echo "M13.7 One-Brief-to-Course contract PASS\n";
