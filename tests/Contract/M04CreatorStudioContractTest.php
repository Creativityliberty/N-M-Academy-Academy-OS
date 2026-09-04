<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$failures = [];

$requiredFiles = [
    'app/Http/Controllers/Trainer/StudentsController.php',
    'app/Http/Controllers/Trainer/SalesController.php',
    'app/Http/Controllers/Trainer/AnalyticsController.php',
    'resources/js/pages/trainer/students/index.tsx',
    'resources/js/pages/trainer/sales/index.tsx',
    'resources/js/pages/trainer/analytics/index.tsx',
    'database/migrations/2026_08_31_031500_add_payment_snapshot_to_enrollments_table.php',
];

foreach ($requiredFiles as $file) {
    if (! is_file($root.'/'.$file)) {
        $failures[] = "Missing file: {$file}";
    }
}

$routeSource = file_get_contents($root.'/routes/trainer.php');
foreach (["name('students.index')", "name('sales.index')", "name('analytics.index')"] as $needle) {
    if (! str_contains($routeSource, $needle)) {
        $failures[] = "Missing trainer route: {$needle}";
    }
}

$enrollmentSource = file_get_contents($root.'/app/Models/Enrollment.php');
foreach (['amount_paid', 'currency', 'paid_at'] as $field) {
    if (! str_contains($enrollmentSource, "'{$field}'")) {
        $failures[] = "Enrollment is missing {$field}";
    }
}

$webhookSource = file_get_contents($root.'/app/Http/Controllers/Public/Courses/WebhookController.php');
foreach (['amount_total', 'currency', 'paid_at'] as $needle) {
    if (! str_contains($webhookSource, $needle)) {
        $failures[] = "Course purchase webhook is missing {$needle}";
    }
}

if ($failures !== []) {
    fwrite(STDERR, "M04 contract RED\n- ".implode("\n- ", $failures)."\n");
    exit(1);
}

echo "M04 creator studio contract PASS\n";
