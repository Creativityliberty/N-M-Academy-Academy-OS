<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$fail = static function (string $message): never { fwrite(STDERR, $message."\n"); exit(1); };
$requireFile = static function (string $path) use ($root, $fail): string {
    $full = $root.'/'.$path;
    if (! is_file($full)) { $fail("Missing M14.3 file: {$path}"); }
    return (string) file_get_contents($full);
};

foreach ([
    'database/migrations/2026_09_02_010000_create_course_completion_and_certificates_tables.php',
    'app/Models/CourseCompletionPolicy.php',
    'app/Models/CourseCompletion.php',
    'app/Models/CourseCertificate.php',
    'app/Data/CompletionStatus.php',
    'app/Services/Completion/CourseCompletionService.php',
    'tests/Feature/Completion/CompletionCertificateEngineTest.php',
] as $path) { $requireFile($path); }

$migration = $requireFile('database/migrations/2026_09_02_010000_create_course_completion_and_certificates_tables.php');
foreach (['course_completion_policies','course_completions','course_certificates','is_required_for_completion','verification_code','evidence_snapshot','revoked_at','document_hash'] as $needle) {
    if (! str_contains($migration, $needle)) { $fail("Completion schema invariant missing: {$needle}"); }
}
foreach (['course_assessments','course_assignments'] as $table) {
    if (! str_contains($migration, "Schema::table('{$table}'")) { $fail("Required-completion flag migration missing for {$table}"); }
}

$courseModel = $requireFile('app/Models/Course.php');
foreach (['completionPolicy','completions','certificates'] as $needle) {
    if (! str_contains($courseModel, $needle)) { $fail("Course completion relation missing: {$needle}"); }
}
foreach (['app/Models/CourseAssessment.php','app/Models/CourseAssignment.php'] as $path) {
    $source = $requireFile($path);
    if (! str_contains($source, 'is_required_for_completion')) { $fail("Required completion flag missing in {$path}"); }
}
$assignmentModel = $requireFile('app/Models/CourseAssignment.php');
if (! preg_match('/\$fillable\s*=\s*\[[^;]*is_required_for_completion/s', $assignmentModel)) {
    $fail('CourseAssignment must allow the required-for-completion flag through canonical mass assignment.');
}

$status = $requireFile('app/Data/CompletionStatus.php');
foreach (['lessonsRequired','lessonsCompleted','assessmentsRequired','assessmentsPassed','assignmentsRequired','assignmentsApproved','completed','certificateUrl'] as $needle) {
    if (! str_contains($status, $needle)) { $fail("CompletionStatus field missing: {$needle}"); }
}

$engine = $requireFile('app/Services/Completion/CourseCompletionService.php');
foreach (['access_rank','LearningAccessService','entitledLessonIds','isEntitledAssessment','isEntitledAssignment','LessonProgress','CourseAssessmentAttempt','passed','AssignmentSubmissionStatus::Approved','is_required_for_completion','firstOrCreate','evidence_snapshot','CourseCertificate'] as $needle) {
    if (! str_contains($engine, $needle)) { $fail("Completion engine invariant missing: {$needle}"); }
}
if (str_contains($engine, 'CourseCompletion::create(') && ! str_contains($engine, 'lockForUpdate')) {
    $fail('Completion creation must be concurrency guarded.');
}
if (! str_contains($engine, 'CourseStatus::Published')) { $fail('Completion must never be issued for an unpublished course.'); }
if (! str_contains($engine, "'requirements_total'")) { $fail('Completion evidence must record the total number of pedagogical requirements.'); }
if (! preg_match('/requirements_total[^;]*>[= ]*1|requirements_total[^;]*>[ ]*0/', $engine)) {
    $fail('Completion must require at least one pedagogical criterion before eligibility.');
}
if (substr_count($engine, "'counts' => \$counts") < 2) { $fail('Completion evidence snapshot must persist exact counts as well as IDs.'); }
if (! str_contains($engine, 'isEntitledAssessment') || ! str_contains($engine, 'isEntitledAssignment')) {
    $fail('Lesson/module scoped completion primitives must use canonical tier entitlement.');
}

$progress = $requireFile('app/Http/Controllers/Student/Courses/LessonProgressController.php');
$scoring = $requireFile('app/Services/Assessments/AssessmentScoringService.php');
$assignmentReview = $requireFile('app/Services/Assignments/AssignmentReviewService.php');
foreach ([[$progress, 'CourseCompletionService'],[$scoring, 'CourseCompletionService'],[$assignmentReview, 'CourseCompletionService']] as [$source,$needle]) {
    if (! str_contains($source, $needle)) { $fail('Canonical completion recalculation trigger missing.'); }
}

$trainerRoutes = $requireFile('routes/trainer.php');
foreach (['completion.show','completion.update','certificates.revoke'] as $needle) {
    if (! str_contains($trainerRoutes, $needle)) { $fail("Trainer completion route missing: {$needle}"); }
}
$trainerController = $requireFile('app/Http/Controllers/Trainer/CompletionController.php');
foreach (['require_all_accessible_lessons','certificate_enabled','certificate_title','issuer_name','assessment_required_ids','assignment_required_ids','revocation_reason'] as $needle) {
    if (! str_contains($trainerController, $needle)) { $fail("Trainer completion policy invariant missing: {$needle}"); }
}
$trainerUi = $requireFile('resources/js/pages/trainer/courses/completion/index.tsx');
foreach (['Complétion & certificats','Leçons accessibles','Évaluations obligatoires','Assignments obligatoires','Révoquer'] as $needle) {
    if (! str_contains($trainerUi, $needle)) { $fail("Trainer completion UI missing: {$needle}"); }
}

$studentRoutes = $requireFile('routes/student.php');
if (! str_contains($studentRoutes, 'certificates.index')) { $fail('Student certificates route missing.'); }
$courseController = $requireFile('app/Http/Controllers/Student/Courses/CourseController.php');
foreach (['CourseCompletionService', "'completion' =>"] as $needle) {
    if (! str_contains($courseController, $needle)) { $fail("Course Player completion payload missing: {$needle}"); }
}
$coursePlayer = $requireFile('resources/js/pages/student/courses/show.tsx');
$completionUi = $coursePlayer;
$componentPath = $root.'/resources/js/components/student/course-completion-card.tsx';
if (is_file($componentPath)) { $completionUi .= (string) file_get_contents($componentPath); }
foreach (['Complétion de la formation','Évaluations','Projets'] as $needle) {
    if (! str_contains($completionUi, $needle)) { $fail("Course Player completion UI missing: {$needle}"); }
}
$studentCertificates = $requireFile('resources/js/pages/student/certificates/index.tsx');
foreach (['Mes certificats','Vérifier','Partager'] as $needle) {
    if (! str_contains($studentCertificates, $needle)) { $fail("Student certificate UI missing: {$needle}"); }
}

$publicRoutes = $requireFile('routes/public.php');
foreach (['certificates.verify','certificates.verify.pdf'] as $needle) {
    if (! str_contains($publicRoutes, $needle)) { $fail("Public certificate route missing: {$needle}"); }
}
$publicController = $requireFile('app/Http/Controllers/Public/CertificateVerificationController.php');
foreach (['verification_code','revoked_at','recipientName','courseTitle','issuerName'] as $needle) {
    if (! str_contains($publicController, $needle)) { $fail("Public verification invariant missing: {$needle}"); }
}
if (preg_match('/email|amount_paid|stripe|rubric_scores|text_content/i', $publicController)) {
    $fail('Public certificate verification must not expose private learning/payment data.');
}
if (str_contains($publicController, "'revocationReason'")) {
    $fail('Public certificate verification must not expose the internal revocation reason.');
}
$pdf = $requireFile('app/Services/Certificates/CertificatePdfService.php');
foreach (['%PDF-','Helvetica','Windows-1252','verification_code'] as $needle) {
    if (! str_contains($pdf, $needle)) { $fail("Certificate PDF invariant missing: {$needle}"); }
}

$reviewController = $requireFile('app/Http/Controllers/Trainer/CourseReviewController.php');
$reviewUi = $requireFile('resources/js/pages/trainer/academy-ai/course-review.tsx');
foreach ([[$reviewController,'completionUrl'],[$reviewUi,'Complétion & certificats']] as [$source,$needle]) {
    if (! str_contains($source, $needle)) { $fail("Review Center completion integration missing: {$needle}"); }
}

$mcpRegistry = $requireFile('app/Mcp/AcademyMcpToolRegistry.php');
foreach (['completion.policy.get','completion.policy.update','certificates.list','certificates.get','certificates.revoke'] as $needle) {
    if (! str_contains($mcpRegistry, $needle)) { $fail("MCP completion tool missing: {$needle}"); }
}
if (str_contains($mcpRegistry, 'certificates.issue')) { $fail('MCP must never expose direct certificate issuance.'); }
foreach (['certificates.revoke', 'sensitive', 'personal'] as $needle) {
    if (! str_contains(strtolower($mcpRegistry), strtolower($needle))) { $fail("Certificate revoke classification missing: {$needle}"); }
}
$mcpExecutor = $requireFile('app/Mcp/AcademyMcpToolExecutor.php');
foreach (['completion.policy.get','completion.policy.update','certificates.list','certificates.get','certificates.revoke'] as $needle) {
    if (! str_contains($mcpExecutor, $needle)) { $fail("MCP completion execution missing: {$needle}"); }
}

$workflow = $requireFile('.github/workflows/tests.yml');
if (! str_contains($workflow, 'M14_3CompletionCertificatesContractTest.php')) { $fail('CI does not run M14.3 contract.'); }

foreach (['VERSION','PACKAGE_VERSION'] as $path) {
    if (version_compare(trim($requireFile($path)), '1.5.0', '<')) { $fail("M14.3 release version must be >= 1.5.0 in {$path}."); }
}

$towerRouter = $requireFile('app/MissionTower/Services/TowerChatRouter.php');
if (! str_contains($towerRouter, 'français')) { $fail('Tower French-by-default invariant was lost in M14.3.'); }
$package = json_decode($requireFile('package.json'), true);
if (($package['dependencies']['thinking-orbs'] ?? null) !== '^0.3.1') { $fail('Thinking Orbs dependency was lost in M14.3.'); }

echo "M14.3 Completion Rules + Certificates contract PASS\n";
