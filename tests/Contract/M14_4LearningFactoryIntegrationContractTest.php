<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$fail = static function (string $message): never { fwrite(STDERR, $message."\n"); exit(1); };
$requireFile = static function (string $path) use ($root, $fail): string {
    $full = $root.'/'.$path;
    if (! is_file($full)) { $fail("Missing M14.4 file: {$path}"); }
    return (string) file_get_contents($full);
};
$containsAll = static function (string $source, array $needles, string $message) use ($fail): void {
    foreach ($needles as $needle) {
        if (! str_contains($source, $needle)) { $fail("{$message}: {$needle}"); }
    }
};

$capabilities = $requireFile('app/Factory/AcademyFactoryCapabilityRegistry.php');
$containsAll($capabilities, ['essential', 'creator', 'pro', 'assessments', 'assignments', 'completion', 'certificates', 'tower'], 'Factory capability profile invariant missing');

$templates = $requireFile('app/Factory/AcademyFactoryTemplateRegistry.php');
if (! str_contains($templates, 'capability_profile')) { $fail('Factory templates must nominate a default capability profile independently from theme.'); }

$builder = $requireFile('app/Factory/AcademyFactoryBlueprintBuilder.php');
$containsAll($builder, [
    'ACADEMY_FEATURE_ASSESSMENTS',
    'ACADEMY_FEATURE_ASSIGNMENTS',
    'ACADEMY_FEATURE_COMPLETION',
    'ACADEMY_FEATURE_CERTIFICATES',
    'ACADEMY_FEATURE_TOWER',
    'ACADEMY_CERTIFICATE_ISSUER_NAME',
    'ACADEMY_CERTIFICATE_TITLE',
    'ACADEMY_CERTIFICATE_PUBLIC_VERIFICATION',
    'ACADEMY_CERTIFICATE_PDF_DOWNLOAD',
    'ACADEMY_CERTIFICATE_STUDENT_SHARING',
    'ACADEMY_COMPLETION_REQUIRE_ALL_ACCESSIBLE_LESSONS',
    'capability_profile',
], 'Factory blueprint M14.4 invariant missing');

$factoryController = $requireFile('app/Http/Controllers/Admin/AcademyFactoryController.php');
$containsAll($factoryController, ['capabilityProfiles', 'capability_profile', 'assessments', 'assignments', 'completion', 'certificates', 'issuer_name', 'certificate_title', 'public_verification', 'pdf_download', 'student_sharing'], 'Factory validation/UI payload invariant missing');

$factoryUi = $requireFile('resources/js/pages/admin/factory/index.tsx');
$containsAll($factoryUi, ['Capability profile', 'Learning & Certification', 'Quiz & assessments', 'Assignments & projects', 'Completion rules', 'Certificates', 'Émetteur du certificat', 'Titre du certificat'], 'Factory learning UI invariant missing');

$academyConfig = $requireFile('config/academy.php');
$containsAll($academyConfig, ["'assessments'", "'assignments'", "'completion'", "'certificates'", "'learning'", "'public_verification'", "'pdf_download'", "'student_sharing'"], 'Academy learning config invariant missing');

$sidebar = $requireFile('resources/js/components/app-sidebar.tsx');
$containsAll($sidebar, ['Mes certificats', 'features.certificates', 'Award'], 'Student certificate navigation missing');

$studentRoutes = $requireFile('routes/student.php');
$containsAll($studentRoutes, ['feature:certificates', 'certificates.pdf'], 'Student certificate capability/PDF route missing');

$certificateController = $requireFile('app/Http/Controllers/Student/CertificateController.php');
$containsAll($certificateController, ['pdf(', 'pdf_download', 'user_id'], 'Authenticated student certificate PDF authorization missing');

$publicController = $requireFile('app/Http/Controllers/Public/CertificateVerificationController.php');
$containsAll($publicController, ['public_verification', 'pdf_download'], 'Public certificate Academy defaults are not enforced');

$status = $requireFile('app/Data/CompletionStatus.php');
$containsAll($status, ['certificatePdfUrl', 'certificateShareEnabled'], 'Completion status certificate actions missing');

$completion = $requireFile('app/Services/Completion/CourseCompletionService.php');
$containsAll($completion, [
    'academy.features.completion',
    'academy.features.assessments',
    'academy.features.assignments',
    'academy.features.certificates',
    'academy.learning.completion.require_all_accessible_lessons',
    'academy.learning.certificates.issuer_name',
    'academy.learning.certificates.title',
], 'Completion engine Factory capability/default integration missing');

$completionCard = $requireFile('resources/js/components/student/course-completion-card.tsx');
$containsAll($completionCard, ['Complétion de la formation', 'Encore à faire', 'Télécharger PDF', 'Partager', 'Évaluations', 'Projets'], 'Student completion card invariant missing');

$studentCourseController = $requireFile('app/Http/Controllers/Student/Courses/CourseController.php');
$containsAll($studentCourseController, ['academy.features.assessments', 'academy.features.assignments'], 'Course Player backend must not serialize disabled learning primitives.');

$coursePlayer = $requireFile('resources/js/pages/student/courses/show.tsx');
if (! str_contains($coursePlayer, 'CourseCompletionCard')) { $fail('Course Player must use the focused M14.4 completion card.'); }

$certificatesUi = $requireFile('resources/js/pages/student/certificates/index.tsx');
$containsAll($certificatesUi, ['sharingEnabled', 'pdfDownloadEnabled'], 'Student certificate library must honor Academy action defaults.');

$trainerEdit = $requireFile('resources/js/pages/trainer/courses/edit.tsx');
$containsAll($trainerEdit, ['Quiz & évaluations', 'Assignments & projets', 'Complétion & certificats', 'features.assessments', 'features.assignments', 'features.completion'], 'Trainer M14 workspace integration missing');

$trainerRoutes = $requireFile('routes/trainer.php');
$containsAll($trainerRoutes, ['feature:assessments', 'feature:assignments', 'feature:completion', 'feature:certificates'], 'Trainer M14 capability route guards missing');

foreach (['.env.example', '.env.coolify.example', 'docker-compose.coolify.yml'] as $path) {
    $source = $requireFile($path);
    $containsAll($source, [
        'ACADEMY_FEATURE_ASSESSMENTS', 'ACADEMY_FEATURE_ASSIGNMENTS', 'ACADEMY_FEATURE_COMPLETION', 'ACADEMY_FEATURE_CERTIFICATES',
        'ACADEMY_CERTIFICATE_ISSUER_NAME', 'ACADEMY_CERTIFICATE_TITLE', 'ACADEMY_CERTIFICATE_PUBLIC_VERIFICATION',
        'ACADEMY_CERTIFICATE_PDF_DOWNLOAD', 'ACADEMY_CERTIFICATE_STUDENT_SHARING', 'ACADEMY_COMPLETION_REQUIRE_ALL_ACCESSIBLE_LESSONS',
    ], "Deployment M14.4 env missing in {$path}");
}

$compose = $requireFile('docker-compose.coolify.yml');
if (! str_contains($compose, 'academy-assignments:/var/www/html/storage/app/private/assignments')) { $fail('Private assignment volume was lost.'); }

$workflow = $requireFile('.github/workflows/tests.yml');
if (! str_contains($workflow, 'M14_4LearningFactoryIntegrationContractTest.php')) { $fail('CI does not run M14.4 contract.'); }

foreach (['VERSION', 'PACKAGE_VERSION'] as $path) {
    if (version_compare(trim($requireFile($path)), '1.5.1', '<')) { $fail("M14.4 release version must be >= 1.5.1 in {$path}."); }
}
$package = json_decode($requireFile('package.json'), true);
if (version_compare((string) ($package['version'] ?? '0.0.0'), '1.5.1', '<')) { $fail('package.json version must be >= 1.5.1.'); }
if (($package['dependencies']['thinking-orbs'] ?? null) !== '^0.3.1') { $fail('Thinking Orbs dependency was lost in M14.4.'); }
$packageLock = json_decode($requireFile('package-lock.json'), true);
if (version_compare((string) ($packageLock['version'] ?? '0.0.0'), '1.5.1', '<')) { $fail('package-lock.json root version must be >= 1.5.1.'); }
if (version_compare((string) ($packageLock['packages']['']['version'] ?? '0.0.0'), '1.5.1', '<')) { $fail('package-lock.json package root version must be >= 1.5.1.'); }

$towerRouter = $requireFile('app/MissionTower/Services/TowerChatRouter.php');
if (! str_contains($towerRouter, 'français')) { $fail('Tower French-by-default invariant was lost in M14.4.'); }

foreach (['assessments.list', 'assignments.list', 'completion.policy.get', 'certificates.list'] as $needle) {
    if (! str_contains($requireFile('app/Mcp/AcademyMcpToolRegistry.php'), $needle)) { $fail("M14 MCP capability was lost: {$needle}"); }
}
if (str_contains($requireFile('app/Mcp/AcademyMcpToolRegistry.php'), 'certificates.issue')) { $fail('MCP must still not expose direct certificate issuance.'); }

echo "M14.4 Learning Experience + Factory Integration contract PASS\n";
