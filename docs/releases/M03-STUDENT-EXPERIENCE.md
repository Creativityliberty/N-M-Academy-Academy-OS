# M03 — Student Experience

NÜM Academy OS v0.3.0 turns the existing Liberty student flow into a focused learning workspace without rewriting the LMS core.

## Scope

- Student learning dashboard with real enrollment and completion metrics.
- “Continue learning” card resolving the next incomplete lesson.
- Premium learning library with per-course progress and direct resume links.
- Responsive course player with desktop curriculum rail and mobile collapsible curriculum.
- Lesson progress controls preserved.
- Private per-lesson student notes persisted in `lesson_notes`.
- Resources panel built from existing lesson PDF, audio and video URLs.
- Course preview security: media URLs for paid lessons are redacted server-side for non-enrolled students.
- Existing preview purchase flow remains available.

## Data changes

New table: `lesson_notes`

- `user_id`
- `lesson_id`
- `content`
- unique `(user_id, lesson_id)`

Notes are only writable when the current user is enrolled in the lesson's course.

## Routes

- `POST /student/lessons/{lesson}/notes`
- `DELETE /student/lessons/{lesson}/notes`

Existing course and progress routes are unchanged.

## UX flow

`Student Home → My Learning → Continue Course → Lesson → Progress / Notes / Resources`

The next lesson can be deep-linked with `?lesson=<id>`.

## Deployment

No new runtime service is required. The M03 migration runs through the existing Laravel migration flow, so the current Coolify app + PostgreSQL + Redis topology remains unchanged.
