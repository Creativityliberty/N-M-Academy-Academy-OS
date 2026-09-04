# M06 Events Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static Liberty events mockup with a persistent Academy events engine for calendar browsing, registrations, protected live links and scheduled reminders.

**Architecture:** Use two focused database tables, one Events domain controller for read serialization, small write controllers for create/register/cancel, and a Laravel notification plus Artisan command for reminders. Reuse the existing scheduler, queue workers, auth/roles, Inertia shell and Coolify topology.

**Tech Stack:** Laravel 13, PHP 8.4, Eloquent, Inertia 3, React 19, TypeScript, Tailwind 4, PostgreSQL, Redis, Laravel Notifications/Scheduler.

**Spec:** `docs/superpowers/specs/2026-08-31-events-design.md`

## Global Constraints

- No new Composer or npm dependency.
- No new Coolify service/container.
- Public `/communaute/evenements` remains canonical.
- Guests never receive meeting/live URLs.
- Capacity and role guards are server-side.
- Release is versioned, zipped, checksummed and retested after extraction.

---

### Task 1: Event persistence and relationships

**Files:**

- Create: `database/migrations/2026_08_31_043000_create_academy_events_tables.php`
- Create: `app/Models/AcademyEvent.php`
- Create: `app/Models/EventRegistration.php`
- Modify: `app/Models/User.php`
- Test: `tests/Feature/EventsTest.php`

**Interfaces:**

- Produces `AcademyEvent::registrations()` and `EventRegistration::event()` for all later tasks.

- [ ] Write failing persistence/relationship tests.
- [ ] Verify RED when Laravel dependencies are available; otherwise record environment blocker and use the source contract as executable RED.
- [ ] Add migration/models/relationships.
- [ ] Verify source contract becomes green for persistence files.

### Task 2: Read model and protected serialization

**Files:**

- Create: `app/Http/Controllers/Events/EventController.php`
- Modify: `routes/public.php`
- Test: `tests/Feature/EventsTest.php`

**Interfaces:**

- GET `/communaute/evenements` returns either `home/community/events` for guests or `events/index` for authenticated users.

- [ ] Add failing tests for real upcoming events and hidden live URLs.
- [ ] Replace the inertia-only route with controller route.
- [ ] Serialize capacity, registration state and manager permissions.
- [ ] Verify tests/contract.

### Task 3: Registration and event management

**Files:**

- Create: `app/Http/Controllers/Events/EventManagementController.php`
- Create: `app/Http/Controllers/Events/EventRegistrationController.php`
- Modify: `routes/public.php`
- Test: `tests/Feature/EventsTest.php`

**Interfaces:**

- `events.store`, `events.cancel`, `events.registrations.store`, `events.registrations.destroy`.

- [ ] Add failing role/capacity/cancel tests.
- [ ] Implement trainer/admin create and creator/admin cancel guards.
- [ ] Implement transactional capacity-aware registration and self-cancellation.
- [ ] Verify contract.

### Task 4: Scheduled reminders

**Files:**

- Create: `app/Notifications/EventReminderNotification.php`
- Create: `app/Console/Commands/SendEventReminders.php`
- Modify: `routes/console.php`
- Test: `tests/Feature/EventsTest.php`

**Interfaces:**

- `php artisan events:send-reminders`
- Scheduled every minute without overlap.

- [ ] Add failing reminder test.
- [ ] Implement mail notification and command.
- [ ] Schedule command through existing scheduler.
- [ ] Verify contract.

### Task 5: Public and authenticated Events UX

**Files:**

- Create: `resources/js/features/events/types.ts`
- Create: `resources/js/features/events/event-card.tsx`
- Create: `resources/js/features/events/month-calendar.tsx`
- Rewrite: `resources/js/pages/home/community/events.tsx`
- Create: `resources/js/pages/events/index.tsx`
- Modify: `resources/js/components/app-sidebar.tsx`

**Interfaces:**

- Both pages consume the same serialized event DTO.

- [ ] Remove hard-coded demo events.
- [ ] Build public upcoming-event cards.
- [ ] Build app-shell agenda/calendar, registration actions and trainer creation form.
- [ ] Add Events sidebar entry.
- [ ] Run Prettier/ESLint/typecheck classification.

### Task 6: Release gate and packaging

**Files:**

- Create: `tests/Contract/M06EventsContractTest.php`
- Create: `docs/releases/M06-EVENTS.md`
- Create: `docs/releases/M06-VERIFICATION.md`
- Modify: `package.json`
- Modify: `README.md`

- [ ] Run PHP syntax, contract, Prettier, ESLint, typecheck classification and Coolify topology checks.
- [ ] Probe Pest and Vite and record environment blockers rather than false PASS.
- [ ] Build clean ZIP without dependencies/caches/fonts/secrets.
- [ ] Generate SHA-256.
- [ ] Extract ZIP into a fresh directory and rerun the release gate.
