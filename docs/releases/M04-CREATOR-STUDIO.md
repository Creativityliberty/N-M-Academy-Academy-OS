# M04 — Creator Studio

Version: **0.4.0**

M04 turns the existing Liberty trainer area into a coherent creator cockpit without replacing the course creation workflow that already works.

## Delivered surfaces

- Creator Studio overview dashboard
- Courses / Course Builder entry point
- Student directory for the trainer's own courses
- Sales workspace using recorded Stripe payment snapshots
- Learning analytics per course
- Trainer navigation for Courses, Students, Sales, Analytics and Settings
- Premium Creator Studio treatment for create/edit course screens

## Payment snapshot

New course purchases now persist the checkout session snapshot on `enrollments`:

- `amount_paid`
- `currency`
- `paid_at`

Historical enrollments created before M04 remain valid and appear as legacy entries. The UI intentionally does not infer revenue from a course's current list price.

## Analytics semantics

Course completion is computed from actual lesson progress:

```text
completed lesson progress rows
────────────────────────────── × 100
students enrolled × lessons
```

The aggregate completion metric is weighted by the total possible lesson completions rather than averaging course percentages equally.

## Existing behavior preserved

- Laravel / React / Inertia architecture
- Course CRUD
- Modules and lessons builder
- Stripe Connect publishing gate
- Student M03 experience
- Runtime Theme Engine
- Coolify topology: app + PostgreSQL + Redis + persistent storage

## Release notes

Dependency-backed Pest tests and full Vite builds still require a complete Composer/npm installation. The source ZIP intentionally excludes `vendor`, `node_modules`, and caches.
