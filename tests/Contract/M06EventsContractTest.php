<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$failures = [];

$requiredFiles = [
    'app/Models/AcademyEvent.php',
    'app/Models/EventRegistration.php',
    'app/Http/Controllers/Events/EventController.php',
    'app/Http/Controllers/Events/EventManagementController.php',
    'app/Http/Controllers/Events/EventRegistrationController.php',
    'app/Console/Commands/SendEventReminders.php',
    'app/Notifications/EventReminderNotification.php',
    'database/migrations/2026_08_31_043000_create_academy_events_tables.php',
    'resources/js/features/events/types.ts',
    'resources/js/features/events/event-card.tsx',
    'resources/js/features/events/month-calendar.tsx',
    'resources/js/pages/events/index.tsx',
];

foreach ($requiredFiles as $file) {
    if (! is_file($root.'/'.$file)) {
        $failures[] = "Missing file: {$file}";
    }
}

$routeSource = file_get_contents($root.'/routes/public.php');
foreach ([
    "EventController::class, 'index'",
    "name('community.events')",
    "name('events.store')",
    "name('events.cancel')",
    "name('events.registrations.store')",
    "name('events.registrations.destroy')",
] as $needle) {
    if (! str_contains($routeSource, $needle)) {
        $failures[] = "Missing Events route contract: {$needle}";
    }
}

$eventsPage = file_get_contents($root.'/resources/js/pages/home/community/events.tsx');
foreach (['const events = [', 'Charles Light', 'Kiran Mehta'] as $forbidden) {
    if (str_contains($eventsPage, $forbidden)) {
        $failures[] = "Public Events page still contains demo data: {$forbidden}";
    }
}

$sidebar = file_get_contents($root.'/resources/js/components/app-sidebar.tsx');
if (! str_contains($sidebar, "title: 'Événements'")) {
    $failures[] = 'Authenticated sidebar is missing the Events entry';
}

if (is_file($root.'/routes/console.php')) {
    $console = file_get_contents($root.'/routes/console.php');
    foreach (["events:send-reminders", 'everyMinute()', 'withoutOverlapping()'] as $needle) {
        if (! str_contains($console, $needle)) {
            $failures[] = "Scheduler contract missing: {$needle}";
        }
    }
}

if (is_file($root.'/app/Http/Controllers/Events/EventController.php')) {
    $controller = file_get_contents($root.'/app/Http/Controllers/Events/EventController.php');
    foreach (['meetingUrl', 'isRegistered', 'spotsRemaining', 'canManage'] as $needle) {
        if (! str_contains($controller, $needle)) {
            $failures[] = "Event serializer missing field/guard: {$needle}";
        }
    }
}

if ($failures !== []) {
    fwrite(STDERR, "M06 contract RED\n- ".implode("\n- ", $failures)."\n");
    exit(1);
}

echo "M06 events contract PASS\n";
