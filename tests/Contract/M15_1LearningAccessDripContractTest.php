<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$fail = static function (string $message): never { fwrite(STDERR, $message."\n"); exit(1); };
$requireFile = static function (string $path) use ($root, $fail): string {
    $full = $root.'/'.$path;
    if (! is_file($full)) { $fail("Missing M15.1 file: {$path}"); }
    return (string) file_get_contents($full);
};
$containsAll = static function (string $source, array $needles, string $message) use ($fail): void {
    foreach ($needles as $needle) {
        if (! str_contains($source, $needle)) { $fail("{$message}: {$needle}"); }
    }
};

$migration = $requireFile('database/migrations/2026_09_03_120000_create_course_unlock_rules_table.php');
$containsAll($migration, [
    'course_unlock_rules', 'target_type', 'target_id', 'rule_type', 'source_type', 'source_id',
    'delay_days', 'available_at', 'is_enabled', 'position',
], 'Unlock-rule migration invariant missing');

$model = $requireFile('app/Models/CourseUnlockRule.php');
$containsAll($model, ['target_type', 'rule_type', 'source_type', 'delay_days', 'available_at', 'is_enabled'], 'CourseUnlockRule model invariant missing');

$decision = $requireFile('app/Data/LearningAccessDecision.php');
$containsAll($decision, ['allowed', 'reasons', 'unlockAt'], 'LearningAccessDecision invariant missing');

$access = $requireFile('app/Services/LearningAccess/LearningAccessService.php');
$containsAll($access, [
    'canAccessModule', 'canAccessLesson', 'canAccessAssessment', 'canAccessAssignment',
    'entitledLessonIds', 'isEntitledAssessment', 'isEntitledAssignment',
    'enrollment_delay_days', 'fixed_datetime', 'module_completed', 'lesson_completed',
    'assessment_passed', 'assignment_approved', 'academy.features.drip',
    'minimum_access_rank', 'LessonProgress', 'CourseAssessmentAttempt', 'CourseAssignmentSubmission',
], 'Canonical LearningAccessService invariant missing');

$definition = $requireFile('app/Services/LearningAccess/UnlockRuleDefinitionService.php');
$containsAll($definition, ['create(', 'update(', 'delete(', 'listForCourse(', 'assertSameCourse', 'assertNoForwardDependency', 'nextPositionFor'], 'Unlock-rule definition service invariant missing');

$studentCourse = $requireFile('app/Http/Controllers/Student/Courses/CourseController.php');
$containsAll($studentCourse, ['LearningAccessService', 'locked_by_prerequisite', 'lock_reasons', 'unlock_at'], 'Course Player server-side lock serialization missing');

foreach ([
    'app/Http/Controllers/Student/Courses/LessonProgressController.php',
    'app/Http/Controllers/Student/Courses/LessonNoteController.php',
    'app/Http/Controllers/Student/AssessmentController.php',
    'app/Http/Controllers/Student/AssignmentController.php',
] as $path) {
    if (! str_contains($requireFile($path), 'LearningAccessService')) {
        $fail("Student security surface does not use LearningAccessService: {$path}");
    }
}

$retriever = $requireFile('app/Tutor/KnowledgeRetriever.php');
$containsAll($retriever, ['LearningAccessService', 'accessibleLessonIds', 'whereIn', 'lesson_id'], 'Tutor/RAG unlock filtering missing');

$tutor = $requireFile('app/Tutor/AcademyTutor.php');
$containsAll($tutor, ['LearningAccessService', 'canAccessLesson'], 'Tutor lesson-scope unlock authorization missing');

$completion = $requireFile('app/Services/Completion/CourseCompletionService.php');
$containsAll($completion, ['LearningAccessService', 'entitledLessonIds', 'isEntitledAssessment', 'isEntitledAssignment'], 'Completion engine must consume canonical unlocked access');

$trainerController = $requireFile('app/Http/Controllers/Trainer/LearningAccessController.php');
$containsAll($trainerController, ['UnlockRuleDefinitionService', 'index(', 'store(', 'update(', 'destroy('], 'Trainer unlock-rule controller invariant missing');

$trainerRoutes = $requireFile('routes/trainer.php');
$containsAll($trainerRoutes, ['feature:drip', 'learning-access', 'LearningAccessController'], 'Trainer drip routes missing');

$trainerUi = $requireFile('resources/js/pages/trainer/courses/learning-access/index.tsx');
$containsAll($trainerUi, ['Drip & prérequis', 'Après inscription', 'Date fixe', 'Leçon terminée', 'Évaluation réussie', 'Projet approuvé'], 'Trainer learning-access UI invariant missing');

$mcpRegistry = $requireFile('app/Mcp/AcademyMcpToolRegistry.php');
$containsAll($mcpRegistry, [
    'learning.access.rules.list', 'learning.access.rules.create', 'learning.access.rules.update', 'learning.access.rules.delete',
], 'MCP learning-access tool registry missing');

$mcpExecutor = $requireFile('app/Mcp/AcademyMcpToolExecutor.php');
$containsAll($mcpExecutor, ['UnlockRuleDefinitionService', 'learningAccessRulesList', 'learningAccessRulesCreate', 'learningAccessRulesUpdate', 'learningAccessRulesDelete'], 'MCP learning-access executor missing');

$capabilities = $requireFile('app/Factory/AcademyFactoryCapabilityRegistry.php');
$containsAll($capabilities, ["'drip' => true", 'essential', 'creator', 'pro'], 'Factory drip capability missing');

$builder = $requireFile('app/Factory/AcademyFactoryBlueprintBuilder.php');
if (! str_contains($builder, 'ACADEMY_FEATURE_DRIP')) { $fail('Factory blueprint does not emit ACADEMY_FEATURE_DRIP.'); }

$config = $requireFile('config/academy.php');
if (! str_contains($config, "'drip' => filter_var(env('ACADEMY_FEATURE_DRIP', true)")) { $fail('Academy drip feature config missing.'); }

$compose = $requireFile('docker-compose.coolify.yml');
if (! str_contains($compose, 'ACADEMY_FEATURE_DRIP')) { $fail('Coolify compose does not expose ACADEMY_FEATURE_DRIP.'); }

$factoryUi = $requireFile('resources/js/pages/admin/factory/index.tsx');
if (! str_contains($factoryUi, "drip: 'Drip & prérequis'")) { $fail('Factory UI drip capability label missing.'); }

$workflow = $requireFile('.github/workflows/tests.yml');
if (! str_contains($workflow, 'M15_1LearningAccessDripContractTest.php')) { $fail('CI does not run M15.1 contract.'); }

$currentVersion = trim($requireFile('VERSION'));
foreach (['VERSION', 'PACKAGE_VERSION'] as $path) {
    if (version_compare(trim($requireFile($path)), '1.6.0', '<')) { $fail("M15.1 release version must be >= 1.6.0 in {$path}."); }
}
$package = json_decode($requireFile('package.json'), true);
if (version_compare((string) ($package['version'] ?? '0.0.0'), '1.6.0', '<')) { $fail('package.json version must be >= 1.6.0.'); }
$lock = json_decode($requireFile('package-lock.json'), true);
if (! is_array($lock) || ($lock['lockfileVersion'] ?? 0) < 3) { $fail('package-lock.json must remain a valid npm lockfile v3+.'); }

foreach (['num-academy', 'num-academy.ps1'] as $launcherPath) {
    $launcher = $requireFile($launcherPath);
    if (! str_contains($launcher, $currentVersion) || str_contains($launcher, '1.5.2')) { $fail("Launcher version drift in {$launcherPath}."); }
}
if (($package['dependencies']['thinking-orbs'] ?? null) !== '^0.3.1') { $fail('Thinking Orbs dependency was lost in M15.1.'); }
if (! str_contains($requireFile('app/MissionTower/Services/TowerChatRouter.php'), 'français')) { $fail('Tower French-by-default invariant was lost in M15.1.'); }

echo "M15.1 Learning Access + Drip contract PASS\n";
