<?php

use App\Models\AcademyEvent;
use App\Models\EventRegistration;
use App\Models\User;
use App\Notifications\EventReminderNotification;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

function m06Member(string $role = 'student'): User
{
    $user = User::factory()->create(['email_verified_at' => now()]);
    $user->assignRole($role);

    return $user;
}

function m06Event(User $creator, array $overrides = []): AcademyEvent
{
    return AcademyEvent::create(array_merge([
        'creator_id' => $creator->id,
        'title' => 'Masterclass Academy',
        'description' => 'Une session en direct pour progresser ensemble.',
        'starts_at' => now()->addDay(),
        'ends_at' => now()->addDay()->addHour(),
        'timezone' => 'Europe/Paris',
        'meeting_url' => 'https://meet.example.com/private-room',
        'capacity' => 20,
        'reminder_minutes' => 60,
        'is_published' => true,
        'is_cancelled' => false,
    ], $overrides));
}

test('guest sees persisted upcoming event without private meeting url', function () {
    $trainer = m06Member('trainer');
    m06Event($trainer);

    $this->get(route('community.events'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home/community/events')
            ->where('events.0.title', 'Masterclass Academy')
            ->where('events.0.meetingUrl', null)
            ->where('events.0.isRegistered', false)
        );
});

test('registered member receives the meeting url', function () {
    $trainer = m06Member('trainer');
    $student = m06Member();
    $event = m06Event($trainer);
    EventRegistration::create([
        'academy_event_id' => $event->id,
        'user_id' => $student->id,
        'registered_at' => now(),
    ]);

    $this->actingAs($student)
        ->get(route('community.events'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/index')
            ->where('events.0.isRegistered', true)
            ->where('events.0.meetingUrl', 'https://meet.example.com/private-room')
        );
});

test('student cannot create event but trainer can', function () {
    $student = m06Member();
    $trainer = m06Member('trainer');
    $payload = [
        'title' => 'Atelier live',
        'description' => 'Un atelier suffisamment détaillé pour être valide.',
        'starts_at' => now()->addDays(2)->format('Y-m-d H:i:s'),
        'ends_at' => now()->addDays(2)->addHour()->format('Y-m-d H:i:s'),
        'timezone' => 'Europe/Paris',
        'meeting_url' => 'https://meet.example.com/atelier',
        'location' => null,
        'capacity' => 30,
        'reminder_minutes' => 60,
    ];

    $this->actingAs($student)->post(route('events.store'), $payload)->assertForbidden();
    $this->actingAs($trainer)->post(route('events.store'), $payload)->assertRedirect();

    $this->assertDatabaseHas('academy_events', ['title' => 'Atelier live', 'creator_id' => $trainer->id]);
});

test('registration enforces capacity and member can cancel own registration', function () {
    $trainer = m06Member('trainer');
    $first = m06Member();
    $second = m06Member();
    $event = m06Event($trainer, ['capacity' => 1]);

    $this->actingAs($first)->post(route('events.registrations.store', $event))->assertRedirect();
    $this->actingAs($second)->post(route('events.registrations.store', $event))->assertSessionHasErrors('event');

    expect(EventRegistration::query()->count())->toBe(1);

    $this->actingAs($first)->delete(route('events.registrations.destroy', $event))->assertRedirect();
    expect(EventRegistration::query()->count())->toBe(0);
});

test('event creator can cancel event but another trainer cannot', function () {
    $creator = m06Member('trainer');
    $otherTrainer = m06Member('trainer');
    $event = m06Event($creator);

    $this->actingAs($otherTrainer)->patch(route('events.cancel', $event))->assertForbidden();
    $this->actingAs($creator)->patch(route('events.cancel', $event))->assertRedirect();

    expect($event->fresh()->is_cancelled)->toBeTrue();
});

test('due event reminder is queued once and registration is marked sent', function () {
    Notification::fake();

    $trainer = m06Member('trainer');
    $student = m06Member();
    $event = m06Event($trainer, [
        'starts_at' => now()->addMinutes(30),
        'ends_at' => now()->addMinutes(90),
        'reminder_minutes' => 60,
    ]);
    $registration = EventRegistration::create([
        'academy_event_id' => $event->id,
        'user_id' => $student->id,
        'registered_at' => now(),
    ]);

    $this->artisan('events:send-reminders')->assertExitCode(0);

    Notification::assertSentTo($student, EventReminderNotification::class);
    expect($registration->fresh()->reminder_sent_at)->not->toBeNull();
});
