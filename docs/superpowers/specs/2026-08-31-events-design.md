# M06 Events Design

## Goal

Replace the hard-coded public events mockup with a small persistent events engine supporting an agenda/calendar, live links, registrations, capacity and scheduled email reminders while reusing the existing Laravel scheduler, queue and Coolify stack.

## Scope

M06 implements:

- public upcoming-events page backed by database records;
- authenticated Academy events workspace;
- trainer/admin event creation and cancellation;
- optional meeting URL and/or physical location;
- optional registration capacity;
- member registration/cancellation;
- live-link disclosure only to registered attendees or event managers;
- per-event reminder lead time;
- scheduled email reminders using the existing Laravel scheduler;
- a lightweight month calendar generated client-side from event dates.

## Data model

### academy_events

- `id`
- `creator_id` -> users
- `title`
- `description`
- `starts_at`
- `ends_at`
- `timezone`
- `meeting_url` nullable
- `location` nullable
- `capacity` nullable
- `reminder_minutes` default 60
- `is_published` default true
- `is_cancelled` default false
- timestamps

### event_registrations

- `id`
- `academy_event_id`
- `user_id`
- `registered_at`
- `reminder_sent_at` nullable
- timestamps
- unique `(academy_event_id, user_id)`

## Access rules

- Guests can view only published, non-cancelled upcoming events.
- Verified authenticated members can register/cancel their own registrations.
- Trainers, admins and super-admins can create events.
- An event creator, admin or super-admin can cancel an event.
- Meeting URLs are serialized only to a registered member or an authorized event manager.
- Registration rejects cancelled, unpublished or already-started events.
- Capacity is enforced server-side inside a database transaction.

## Reminder flow

`events:send-reminders` scans registrations whose event starts in the future and has entered its reminder window. It sends `EventReminderNotification` and sets `reminder_sent_at`. `routes/console.php` schedules the command every minute with overlap prevention. This reuses the scheduler already running in the production Supervisor configuration.

## Explicit non-goals

M06 does not implement Zoom/Meet creation, paid event tickets, recurring events, attendance tracking, external calendar sync, webinar hosting, event chat, or realtime presence.
