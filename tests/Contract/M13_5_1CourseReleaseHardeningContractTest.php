<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);

$fail = static function (string $message): never {
    fwrite(STDERR, $message."\n");
    exit(1);
};

$requireFile = static function (string $path) use ($root, $fail): string {
    $full = $root.'/'.$path;
    if (! is_file($full)) {
        $fail("Missing M13.5.1 file: {$path}");
    }

    return (string) file_get_contents($full);
};

// Fresh-install migration order: missions must exist before compilations references them.
if (! is_file($root.'/database/migrations/2026_08_31_210005_create_tower_compilations_table.php')) {
    $fail('Tower compilations migration has not been moved after tower_missions.');
}
if (is_file($root.'/database/migrations/2026_08_31_210000_create_tower_compilations_table.php')) {
    $fail('Legacy same-timestamp Tower compilations migration is still present.');
}

$trainerCreate = $requireFile('app/Actions/Trainer/Courses/CreateCourseAction.php');
foreach (['Product::create(', 'Price::create(', 'Stripe::setApiKey'] as $needle) {
    if (str_contains($trainerCreate, $needle)) {
        $fail("Trainer draft course creation still provisions Stripe: {$needle}");
    }
}

$profileController = $requireFile('app/Http/Controllers/Settings/ProfileController.php');
foreach (['AcademyOrder', 'AcademyRefund', 'financial history'] as $needle) {
    if (! str_contains($profileController, $needle)) {
        $fail("Profile deletion does not protect the financial ledger: {$needle}");
    }
}

$status = $requireFile('app/Enums/CourseStatus.php');
if (! str_contains($status, "case Archived = 'archived'")) {
    $fail('CourseStatus::Archived is missing.');
}

foreach ([
    'app/Actions/Trainer/Courses/DeleteCourseAction.php',
    'app/Actions/Admin/Courses/DeleteCourseAction.php',
] as $path) {
    $source = $requireFile($path);
    if (! str_contains($source, 'ArchiveCourseAction')) {
        $fail("{$path} does not delegate to ArchiveCourseAction.");
    }
    if (str_contains($source, 'repository->delete($course)')) {
        $fail("{$path} can still physically delete a course.");
    }
}

foreach ([
    'app/Actions/Trainer/Courses/UpdateCourseAction.php',
    'app/Actions/Admin/Courses/UpdateCourseAction.php',
] as $path) {
    $source = $requireFile($path);
    foreach (["['audio_file'] = \$audioFile", "['pdf_file'] = \$pdfFile", 'removeUnusedMedia'] as $needle) {
        if (! str_contains($source, $needle)) {
            $fail("{$path} missing media hardening primitive: {$needle}");
        }
    }
}

foreach ([
    'app/Actions/Trainer/Courses/UploadLessonMediaAction.php',
    'app/Actions/Admin/Courses/UploadLessonMediaAction.php',
] as $path) {
    $source = $requireFile($path);
    if (! str_contains($source, 'public function remove(?string $url): void')) {
        $fail("{$path} cannot explicitly remove stale lesson media.");
    }
}

$request = $requireFile('app/Http/Requests/Trainer/AcademyAiRunRequest.php');
foreach (["'page.generate'", "'page.optimize'", "'page.optimize' => 'page_id'", "'input.page_id'"] as $needle) {
    if (! str_contains($request, $needle)) {
        $fail("Academy AI request validation missing {$needle}");
    }
}

$runner = $requireFile('app/MissionTower/Services/MissionRunner.php');
if (str_contains($runner, "data_get(\$result, '_meta.com.numtema.academy/receiptId')")) {
    $fail('MissionRunner still uses dotted data_get() for literal MCP receipt metadata.');
}
if (! str_contains($runner, "['com.numtema.academy/receiptId']")) {
    $fail('MissionRunner does not read literal MCP receipt metadata key.');
}

$requireFile('app/Actions/Courses/PublishCourseAction.php');
$requireFile('app/Actions/Courses/UnpublishCourseAction.php');
foreach ([
    'app/Http/Controllers/Trainer/Courses/CourseController.php',
    'app/Http/Controllers/Admin/Courses/CourseController.php',
    'app/Mcp/AcademyMcpToolExecutor.php',
] as $path) {
    $source = $requireFile($path);
    if (! str_contains($source, 'PublishCourseAction')) {
        $fail("{$path} does not use canonical PublishCourseAction.");
    }
}

$executor = $requireFile('app/Mcp/AcademyMcpToolExecutor.php');
if (! str_contains($executor, 'IndexCourseKnowledge')) {
    $fail('MCP lesson mutations do not trigger course knowledge indexing.');
}
if (substr_count($executor, 'IndexCourseKnowledge::dispatch') < 2) {
    $fail('Both MCP lesson create and update must queue knowledge re-indexing.');
}

$publicResource = $requireFile('app/Http/Resources/Public/CourseResource.php');
if (str_contains($publicResource, "'studentCount' => 0")) {
    $fail('Public CourseResource still hardcodes studentCount to zero.');
}

$detail = $requireFile('resources/js/pages/home/courses/partials/course-detail.tsx');
foreach (['Fallback to mock data', 'mockFallback'] as $needle) {
    if (str_contains($detail, $needle)) {
        $fail("Public course detail still contains runtime mock fallback: {$needle}");
    }
}


$ci = $requireFile('.github/workflows/tests.yml');
if (! str_contains($ci, 'M13_5_1CourseReleaseHardeningContractTest.php')) {
    $fail('Remote CI does not execute the M13.5.1 source contract.');
}

echo "M13.5.1 Course + Release Hardening contract PASS\n";
