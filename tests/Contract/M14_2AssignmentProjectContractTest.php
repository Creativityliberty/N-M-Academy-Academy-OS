<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$fail = static function (string $message): never { fwrite(STDERR, $message."\n"); exit(1); };
$requireFile = static function (string $path) use ($root, $fail): string {
    $full = $root.'/'.$path;
    if (! is_file($full)) { $fail("Missing M14.2 file: {$path}"); }
    return (string) file_get_contents($full);
};

foreach ([
    'database/migrations/2026_09_01_230000_create_course_assignments_tables.php',
    'database/migrations/2026_09_01_231000_harden_learning_primitive_parent_foreign_keys.php',
    'app/Enums/AssignmentKind.php',
    'app/Enums/AssignmentDeliverableType.php',
    'app/Enums/AssignmentSubmissionStatus.php',
    'app/Models/CourseAssignment.php',
    'app/Models/CourseAssignmentRubricItem.php',
    'app/Models/CourseAssignmentSubmission.php',
    'app/Models/CourseAssignmentSubmissionFile.php',
    'app/Services/Assignments/AssignmentDefinitionService.php',
    'app/Services/Assignments/AssignmentSubmissionService.php',
    'app/Services/Assignments/AssignmentReviewService.php',
    'app/Http/Controllers/Trainer/AssignmentController.php',
    'app/Http/Controllers/Student/AssignmentController.php',
    'app/AI/Capabilities/GenerateAssignmentCapability.php',
    'resources/js/pages/trainer/courses/assignments/index.tsx',
    'resources/js/pages/student/courses/assignment.tsx',
    'tests/Feature/AssignmentProjectEngineTest.php',
] as $path) { $requireFile($path); }

$migration = $requireFile('database/migrations/2026_09_01_230000_create_course_assignments_tables.php');
foreach (['course_assignments','course_assignment_rubric_items','course_assignment_submissions','course_assignment_submission_files','deliverable_type','rubric_scores','score_percent','reviewed_by','version'] as $needle) {
    if (! str_contains($migration, $needle)) { $fail("Assignment schema invariant missing: {$needle}"); }
}

if (substr_count($migration, 'restrictOnDelete()') < 2) { $fail('Assignment parent FKs must restrict module/lesson deletion to preserve submissions.'); }
$parentFkHardening = $requireFile('database/migrations/2026_09_01_231000_harden_learning_primitive_parent_foreign_keys.php');
foreach (['course_assessments', "dropForeign(['module_id'])", "dropForeign(['lesson_id'])", 'restrictOnDelete()'] as $needle) {
    if (! str_contains($parentFkHardening, $needle)) { $fail("Learning primitive parent-FK hardening missing: {$needle}"); }
}

$filesystem = $requireFile('config/filesystems.php');
foreach (["'assignments'", "storage_path('app/private/assignments')"] as $needle) {
    if (! str_contains($filesystem, $needle)) { $fail("Private assignment filesystem missing: {$needle}"); }
}
$compose = $requireFile('docker-compose.coolify.yml');
foreach (['academy-assignments:/var/www/html/storage/app/private/assignments','academy-assignments:'] as $needle) {
    if (! str_contains($compose, $needle)) { $fail("Coolify private assignment volume missing: {$needle}"); }
}

$statusEnum = $requireFile('app/Enums/AssignmentSubmissionStatus.php');
foreach (['submitted','changes_requested','approved'] as $needle) { if (! str_contains($statusEnum, $needle)) { $fail("Assignment status enum missing: {$needle}"); } }
$submission = $requireFile('app/Services/Assignments/AssignmentSubmissionService.php');
if (! str_contains($submission, 'CourseAccessService') && ! str_contains($submission, 'LearningAccessService')) { $fail('Assignment submission invariant missing: canonical access service'); }
foreach (['AssignmentSubmissionStatus::Submitted','AssignmentSubmissionStatus::Approved','version',"disk('assignments')"] as $needle) {
    if (! str_contains($submission, $needle)) { $fail("Assignment submission invariant missing: {$needle}"); }
}
$review = $requireFile('app/Services/Assignments/AssignmentReviewService.php');
foreach (['rubric_scores','score_percent','AssignmentSubmissionStatus::ChangesRequested','AssignmentSubmissionStatus::Approved','lockForUpdate'] as $needle) {
    if (! str_contains($review, $needle)) { $fail("Assignment review invariant missing: {$needle}"); }
}

$registry = $requireFile('app/AI/AcademyAiCapabilityRegistry.php');
if (! str_contains($registry, 'assignment.generate')) { $fail('Academy AI assignment.generate capability missing.'); }
$apply = $requireFile('app/Actions/Trainer/AcademyAi/ApplyAcademyAiRunAction.php');
foreach (['assignment.generate','materialized_assignment_id'] as $needle) {
    if (! str_contains($apply, $needle)) { $fail("Assignment AI apply invariant missing: {$needle}"); }
}

$creationRun = $requireFile('app/Models/CourseCreationRun.php');
if (! str_contains($creationRun, "'assignments'")) { $fail('One-Brief assignments step missing.'); }
$creationEngine = $requireFile('app/Services/Courses/CourseCreationEngine.php');
foreach (['generate_assignments','advanceAssignments','assignment.generate','assignments'] as $needle) {
    if (! str_contains($creationEngine, $needle)) { $fail("One-Brief assignment integration missing: {$needle}"); }
}
$creationUi = $requireFile('resources/js/pages/trainer/academy-ai/course-creation.tsx');
foreach (['generate_assignments','Assignments & projets',"key: 'assignments'"] as $needle) {
    if (! str_contains($creationUi, $needle)) { $fail("One-Brief assignment UI missing: {$needle}"); }
}

$mcpRegistry = $requireFile('app/Mcp/AcademyMcpToolRegistry.php');
foreach (['assignments.list','assignments.get','assignments.create','assignments.update','assignments.delete','assignment.rubric.create','assignment.rubric.update','assignment.rubric.delete','assignment.rubric.reorder'] as $needle) {
    if (! str_contains($mcpRegistry, $needle)) { $fail("MCP assignment tool missing: {$needle}"); }
}
if (str_contains($mcpRegistry, 'assignment.submissions.review')) { $fail('MCP must not expose student submission review.'); }
$mcpExecutor = $requireFile('app/Mcp/AcademyMcpToolExecutor.php');
foreach (['assignments.list','assignment.rubric.reorder','AssignmentDefinitionService'] as $needle) {
    if (! str_contains($mcpExecutor, $needle)) { $fail("MCP assignment execution invariant missing: {$needle}"); }
}

$trainerRoutes = $requireFile('routes/trainer.php');
foreach (['assignments.index','assignments.store','assignments.update','assignments.destroy','assignments.review'] as $needle) {
    if (! str_contains($trainerRoutes, $needle)) { $fail("Trainer assignment route missing: {$needle}"); }
}
$studentRoutes = $requireFile('routes/student.php');
foreach (['assignments.show','assignments.submit','assignments.files.download'] as $needle) {
    if (! str_contains($studentRoutes, $needle)) { $fail("Student assignment route missing: {$needle}"); }
}
$studentController = $requireFile('app/Http/Controllers/Student/AssignmentController.php');
if (! str_contains($studentController, 'CourseAccessService') && ! str_contains($studentController, 'LearningAccessService')) { $fail('Student assignment safety invariant missing: canonical access service'); }
foreach (["Storage::disk('assignments')",'download'] as $needle) {
    if (! str_contains($studentController, $needle)) { $fail("Student assignment safety invariant missing: {$needle}"); }
}
$courseController = $requireFile('app/Http/Controllers/Student/Courses/CourseController.php');
foreach (['CourseAssignment','assignmentItems',"'assignments' => \$assignmentItems"] as $needle) {
    if (! str_contains($courseController, $needle)) { $fail("Course Player assignment discovery missing: {$needle}"); }
}
$coursePlayer = $requireFile('resources/js/pages/student/courses/show.tsx');
foreach (['StudentAssignmentRef','activeAssignments','Assignments & projets'] as $needle) {
    if (! str_contains($coursePlayer, $needle)) { $fail("Course Player assignment UI missing: {$needle}"); }
}

$reviewController = $requireFile('app/Http/Controllers/Trainer/CourseReviewController.php');
if (! str_contains($reviewController, 'assignmentCount')) { $fail('Review Center assignment summary missing.'); }
$reviewUi = $requireFile('resources/js/pages/trainer/academy-ai/course-review.tsx');
if (! str_contains($reviewUi, 'Assignments & projets')) { $fail('Review Center assignment UI missing.'); }

$workflow = $requireFile('.github/workflows/tests.yml');
if (! str_contains($workflow, 'M14_2AssignmentProjectContractTest.php')) { $fail('CI does not run M14.2 contract.'); }

foreach (['VERSION','PACKAGE_VERSION'] as $path) {
    if (version_compare(trim($requireFile($path)), '1.4.0', '<')) { $fail("M14.2 release version must be >= 1.4.0 in {$path}."); }
}

$nav = $requireFile('resources/js/mission-tower/components/tower-nav.tsx');
foreach (['/tower/chat','/tower/missions','/tower/insights','/tower/approvals','/tower/runs','/tower/evidence','/tower/memory'] as $needle) {
    if (! str_contains($nav, $needle)) { $fail("Tower navigation damaged by M14.2: {$needle}"); }
}

echo "M14.2 Assignment & Project Engine contract PASS\n";
