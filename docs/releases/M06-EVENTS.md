# M06 — Events

Release: **NÜM Academy OS v0.6.0**

M06 replaces the former hard-coded Liberty events mockup with a small persistent events engine. It deliberately reuses the Academy scheduler, queue workers and Coolify topology instead of adding a calendar SaaS, webinar server or realtime stack.

## What changed

### Persistent events model

Two focused tables now back Events:

- `academy_events`
- `event_registrations`

An event stores its creator, schedule, timezone, optional live URL, optional physical location, optional capacity and reminder lead time. A registration stores the member, registration timestamp and whether the reminder has already been sent.

### One canonical Events URL

`GET /communaute/evenements` remains the canonical route.

- Guests receive the public upcoming-events page backed by real database records.
- Authenticated members receive the Academy app-shell Events workspace.
- The authenticated workspace adds the month calendar, registrations and organizer controls.

### Registration flow

Verified members can:

- browse upcoming events;
- register while capacity remains;
- cancel their own registration;
- see a protected meeting/live URL after registration.

Capacity is enforced server-side inside a database transaction with a locked event row. Duplicate registration is idempotent.

### Organizer flow

Trainer, admin and super-admin roles can create an event with:

- title and description;
- start/end date and local timezone;
- Meet/Zoom/external live URL and/or a physical location;
- optional capacity;
- reminder lead time of none, 30 minutes, one hour or 24 hours from the current UI.

An event creator can cancel their own event. Admin and super-admin roles can cancel any event.

### Protected live URLs

Meeting URLs are never serialized to public visitors or unregistered members.

The serializer only exposes the URL to:

- a registered member;
- the event creator;
- admin / super-admin.

The public page still receives a boolean indicating that a live component exists so it can describe the event type without leaking the secret URL.

### Scheduled reminders

M06 adds:

```text
events:send-reminders
```

The command finds registrations that have entered the event reminder window, queues `EventReminderNotification`, and marks the registration so the reminder is not sent twice.

`routes/console.php` schedules it every minute with overlap protection. This requires no new Coolify process because the production image already runs Laravel `schedule:run` every 60 seconds through Supervisor and already has queue workers.

## Coolify impact

None.

The topology remains:

```text
app
postgres
redis
academy-storage
academy-postgres
academy-redis
```

M06 adds database records and notification jobs only.

## Explicit non-goals

M06 does not implement:

- Zoom/Google Meet API provisioning;
- native video rooms;
- paid event tickets;
- recurring event rules;
- attendance tracking;
- Google/Apple/Outlook calendar sync;
- webinar replay ingestion;
- event chat or realtime presence.

These can be added later without changing the M06 persistence boundaries.
