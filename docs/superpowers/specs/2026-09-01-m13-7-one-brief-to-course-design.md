# M13.7 One-Brief-to-Course Design

## Goal

Turn a single creator brief into a complete reviewable draft course by orchestrating existing NÜM Academy OS capabilities instead of creating a parallel course engine.

## Product promise

A trainer provides one brief plus a small set of options. Academy OS builds a draft course with positioning, curriculum, lesson content, optional cover and thumbnail, optional lesson narrations, a default commercial offer, and an optional landing page. The workflow stops at review and never publishes automatically.

## Non-goals

- No multi-agent runtime.
- No automatic publication.
- No new LessonBlock system.
- No quiz/assignment/certificate/drip subsystem in this milestone.
- No duplicate pricing, page-builder, or RAG implementation.
- No fake progress timer.

## Architecture

M13.7 adds a thin orchestration layer above M07/M10/M11/M13.6:

1. `CourseCreationRun` persists the user brief, options, current step, progress, generated object IDs, step state, and errors.
2. `CourseCreationEngine` advances exactly one durable step per request.
3. Existing `AcademyAiRunner` + `course.generate` create the structured course blueprint.
4. Existing `ApplyAcademyAiRunAction` materializes the blueprint as a draft `Course` with modules and lessons.
5. Existing `CourseMediaGenerationService` creates cover, thumbnail, and narrations.
6. Existing `CourseOffer` remains the commercial source of truth.
7. Existing `page.generate` + Page Builder create the landing page draft.
8. Existing `IndexCourseKnowledge` remains the RAG indexing path.
9. A dedicated Creator UI automatically calls the advance endpoint step-by-step and renders the real server state with a lightweight Thinking Orb.

## Durable workflow

`blueprint -> materialize -> cover -> thumbnail -> narrations -> offer -> landing -> review`

Optional stages are marked skipped rather than failing the entire run. Provider configuration failures for optional image/audio stages are recorded as skipped with a human-readable reason. Blueprint/materialization failures are fatal.

Narrations are processed one lesson per advance request so long courses do not require a single huge HTTP request. The run reports `Narration X/Y` using actual database state.

## Idempotency and resume

Every run step is resumable:

- blueprint reuses the stored `AcademyAiRun` when already created;
- materialize derives `course_id` from the already-applied AI run;
- cover/thumbnail skip generation if the course already has the corresponding URL;
- narration finds the next eligible text lesson without audio;
- the default offer uses deterministic slug `ai-default` per course;
- landing reuses the stored page AI run/page ID when present.

A step is claimed before external work. A stale running claim can be retried after ten minutes. Concurrent advance requests do not execute the same step twice.

## Run input

Required:
- `brief`
- `category_id`

Optional:
- `audience`
- `outcome`
- `weeks`
- `price_major`
- `currency`
- `generate_cover`
- `generate_thumbnail`
- `generate_audio`
- `generate_landing`
- `voice`

Defaults: EUR, cover on, thumbnail on, audio off, landing on.

## Review contract

Completed runs expose:
- course id/title/status;
- module count;
- lesson count;
- cover/thumbnail availability;
- narration generated/eligible count;
- offer id/name/amount/currency;
- landing page id/title/status;
- per-step status and skip reason.

The final screen links to the existing Course Builder and Page Builder. It does not expose an automatic publish button.

## UI

The Creator surface is `/trainer/academy-ai/course-creation`.

States:
- setup form;
- running screen with real progress;
- review screen;
- failed screen with retry/resume.

Thinking Orb states are mapped to real workflow stages:
- shaping: blueprint;
- weaving: materialize;
- composing: cover/thumbnail;
- listening: narrations;
- connecting: offer;
- solving: landing;
- breathing: review.

The orb is a local React component using the Academy design tokens and motion-safe CSS. It is secondary feedback only; workflow state remains textual and accessible.

## Security and governance

- trainer ownership is enforced on every run and generated object;
- all generated courses/pages remain draft;
- no Stripe provisioning happens until the existing publish lifecycle;
- generated offers are local `CourseOffer` records only;
- no student PII is sent to providers;
- optional provider failures never fabricate media;
- existing paid-content redaction and RAG rules remain unchanged.

## Verification

Required source contract checks:
- migration/model/run ownership;
- exact durable step list;
- orchestration reuses Academy AI, M10, M11, and M13.6 services;
- no publish call inside M13.7 engine;
- narration is one lesson per advance;
- deterministic offer idempotency;
- course/page remain draft;
- UI contains real step list and Thinking Orb;
- CI runs M13.7 contract.

Environment-dependent Laravel/Pest/PostgreSQL/Vite/Docker gates must remain honestly PASS/BLOCKED based on the runtime.
