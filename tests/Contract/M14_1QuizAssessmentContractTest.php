<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$fail = static function (string $message): never { fwrite(STDERR, $message."\n"); exit(1); };
$requireFile = static function (string $path) use ($root, $fail): string {
    $full = $root.'/'.$path;
    if (! is_file($full)) { $fail("Missing M14.1 file: {$path}"); }
    return (string) file_get_contents($full);
};

foreach ([
    'database/migrations/2026_09_01_220000_create_course_assessments_tables.php',
    'app/Enums/AssessmentKind.php',
    'app/Enums/AssessmentQuestionType.php',
    'app/Models/CourseAssessment.php',
    'app/Models/CourseAssessmentQuestion.php',
    'app/Models/CourseAssessmentOption.php',
    'app/Models/CourseAssessmentAttempt.php',
    'app/Models/CourseAssessmentAnswer.php',
    'app/Services/Assessments/AssessmentDefinitionValidator.php',
    'app/Services/Assessments/AssessmentScoringService.php',
    'app/Services/Assessments/AssessmentHistoryGuard.php',
    'app/Http/Controllers/Trainer/AssessmentController.php',
    'app/Http/Controllers/Student/AssessmentController.php',
    'app/AI/Capabilities/GenerateAssessmentCapability.php',
    'resources/js/pages/trainer/courses/assessments/index.tsx',
    'resources/js/pages/student/courses/assessment.tsx',
] as $path) {
    $requireFile($path);
}

$reviewMigration = $requireFile('database/migrations/2026_09_01_030100_create_course_review_proposals_table.php');
if (! str_contains($reviewMigration, "LEGACY_MIGRATION")) { $fail('M13.9 review migration upgrade guard missing.'); }
if (is_file($root.'/database/migrations/2026_09_01_010200_create_course_review_proposals_table.php')) { $fail('M13.9 review migration still sorts before course_creation_runs.'); }

$migration = $requireFile('database/migrations/2026_09_01_220000_create_course_assessments_tables.php');
foreach (['course_assessments', 'course_assessment_questions', 'course_assessment_options', 'course_assessment_attempts', 'course_assessment_answers', 'passing_score_percent', 'max_attempts', 'selected_option_ids'] as $needle) {
    if (! str_contains($migration, $needle)) { $fail("Assessment schema invariant missing: {$needle}"); }
}

$validator = $requireFile('app/Services/Assessments/AssessmentDefinitionValidator.php');
foreach (['single_choice', 'multiple_choice', 'true_false', 'exactly one correct', 'at least one correct', 'exactly two options', 'at least one question'] as $needle) {
    if (! str_contains($validator, $needle)) { $fail("Assessment definition validation invariant missing: {$needle}"); }
}


$historyGuard = $requireFile('app/Services/Assessments/AssessmentHistoryGuard.php');
foreach (['attempts()->exists()', 'question bank', 'historical'] as $needle) {
    if (! str_contains($historyGuard, $needle)) { $fail("Assessment history guard invariant missing: {$needle}"); }
}
$definitionService = $requireFile('app/Services/Assessments/AssessmentDefinitionService.php');
if (! str_contains($definitionService, 'assertQuestionBankMutable')) { $fail('Assessment question bank is not guarded after attempts.'); }
$trainerAssessment = $requireFile('app/Http/Controllers/Trainer/AssessmentController.php');
if (! str_contains($trainerAssessment, 'assertDeletable')) { $fail('Trainer assessment delete does not preserve attempt history.'); }

$scoring = $requireFile('app/Services/Assessments/AssessmentScoringService.php');
if (! str_contains($scoring, 'CourseAccessService') && ! str_contains($scoring, 'LearningAccessService')) { $fail('Assessment scoring invariant missing: canonical access service'); }
foreach (['max_attempts', 'lockForUpdate', 'score_percent', 'passed', 'selected_option_ids'] as $needle) {
    if (! str_contains($scoring, $needle)) { $fail("Assessment scoring invariant missing: {$needle}"); }
}

$registry = $requireFile('app/AI/AcademyAiCapabilityRegistry.php');
if (! str_contains($registry, 'assessment.generate')) { $fail('Academy AI assessment.generate capability missing.'); }

$apply = $requireFile('app/Actions/Trainer/AcademyAi/ApplyAcademyAiRunAction.php');
foreach (['assessment.generate', 'materialized_assessment_id'] as $needle) {
    if (! str_contains($apply, $needle)) { $fail("Assessment AI apply invariant missing: {$needle}"); }
}

$creationRun = $requireFile('app/Models/CourseCreationRun.php');
if (! str_contains($creationRun, "'assessments'")) { $fail('One-Brief assessments step missing.'); }
$creationEngine = $requireFile('app/Services/Courses/CourseCreationEngine.php');
foreach (['generate_assessments', 'advanceAssessments', 'assessment.generate', 'assessments'] as $needle) {
    if (! str_contains($creationEngine, $needle)) { $fail("One-Brief assessment integration missing: {$needle}"); }
}

$mcpRegistry = $requireFile('app/Mcp/AcademyMcpToolRegistry.php');
foreach (['assessments.list', 'assessments.get', 'assessments.create', 'assessments.update', 'assessments.delete', 'assessment.questions.create', 'assessment.questions.update', 'assessment.questions.delete', 'assessment.questions.reorder'] as $needle) {
    if (! str_contains($mcpRegistry, $needle)) { $fail("MCP assessment tool missing: {$needle}"); }
}
$mcpExecutor = $requireFile('app/Mcp/AcademyMcpToolExecutor.php');
foreach (['assessments.list', 'assessment.questions.reorder', 'AssessmentDefinitionValidator', 'assertQuestionBankMutable', 'assertDeletable'] as $needle) {
    if (! str_contains($mcpExecutor, $needle)) { $fail("MCP assessment execution invariant missing: {$needle}"); }
}

$trainerRoutes = $requireFile('routes/trainer.php');
foreach (['assessments.index', 'assessments.store', 'assessments.update', 'assessments.destroy'] as $needle) {
    if (! str_contains($trainerRoutes, $needle)) { $fail("Trainer assessment route missing: {$needle}"); }
}
$studentRoutes = $requireFile('routes/student.php');
foreach (['assessments.show', 'assessments.submit'] as $needle) {
    if (! str_contains($studentRoutes, $needle)) { $fail("Student assessment route missing: {$needle}"); }
}

$studentController = $requireFile('app/Http/Controllers/Student/AssessmentController.php');
if (! str_contains($studentController, 'CourseAccessService') && ! str_contains($studentController, 'LearningAccessService')) { $fail('Student assessment safety invariant missing: canonical access service'); }
foreach (['remainingAttempts', 'selected_option_ids', 'show_explanations'] as $needle) {
    if (! str_contains($studentController, $needle)) { $fail("Student assessment safety invariant missing: {$needle}"); }
}

$reviewController = $requireFile('app/Http/Controllers/Trainer/CourseReviewController.php');
if (! str_contains($reviewController, 'assessmentCount')) { $fail('Review Center assessment summary missing.'); }
$reviewUi = $requireFile('resources/js/pages/trainer/academy-ai/course-review.tsx');
if (! str_contains($reviewUi, 'Assessments')) { $fail('Review Center assessment UI missing.'); }

$workflow = $requireFile('.github/workflows/tests.yml');
if (! str_contains($workflow, 'M14_1QuizAssessmentContractTest.php')) { $fail('CI does not run M14.1 contract.'); }

foreach (['VERSION', 'PACKAGE_VERSION'] as $path) {
    if (version_compare(trim($requireFile($path)), '1.3.0', '<')) { $fail("M14.1 release version must be >= 1.3.0 in {$path}."); }
}

$academyConfig = $requireFile('config/academy.php');
if (! preg_match("/'version'\s*=>\s*env\('ACADEMY_VERSION',\s*'([0-9.]+)'\)/", $academyConfig, $versionMatch) || version_compare($versionMatch[1], '1.3.0', '<')) { $fail('Academy runtime version must be >= 1.3.0.'); }

$tutorMigration = $requireFile('database/migrations/2026_08_31_170000_create_academy_tutor_tables.php');
if (! str_contains($tutorMigration, 'tutor_quiz_sessions')) { $fail('M09 Tutor quiz schema regression detected.'); }

$nav = $requireFile('resources/js/mission-tower/components/tower-nav.tsx');
foreach (['/tower/chat','/tower/missions','/tower/insights','/tower/approvals','/tower/runs','/tower/evidence','/tower/memory'] as $needle) {
    if (! str_contains($nav, $needle)) { $fail("Tower navigation damaged by M14.1: {$needle}"); }
}

echo "M14.1 Quiz & Assessment Engine contract PASS\n";
