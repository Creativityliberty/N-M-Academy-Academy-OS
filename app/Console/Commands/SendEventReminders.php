<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\EventRegistration;
use App\Notifications\EventReminderNotification;
use Illuminate\Console\Command;

class SendEventReminders extends Command
{
    protected $signature = 'events:send-reminders';

    protected $description = 'Send due Academy event reminders to registered members';

    public function handle(): int
    {
        $now = now();
        $sent = 0;

        EventRegistration::query()
            ->whereNull('reminder_sent_at')
            ->whereHas('event', fn ($events) => $events
                ->where('is_published', true)
                ->where('is_cancelled', false)
                ->where('starts_at', '>', $now)
                ->where('starts_at', '<=', $now->copy()->addDays(7)))
            ->with(['event', 'user'])
            ->chunkById(100, function ($registrations) use ($now, &$sent): void {
                foreach ($registrations as $registration) {
                    $event = $registration->event;

                    if ($event->reminder_minutes <= 0) {
                        continue;
                    }

                    $reminderAt = $event->starts_at->copy()->subMinutes($event->reminder_minutes);
                    if ($now->lt($reminderAt)) {
                        continue;
                    }

                    $registration->user->notify(new EventReminderNotification($event));
                    $registration->forceFill(['reminder_sent_at' => now()])->save();
                    $sent++;
                }
            });

        $this->info("{$sent} reminder(s) queued.");

        return self::SUCCESS;
    }
}
