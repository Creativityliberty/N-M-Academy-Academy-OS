# M13.7 One-Brief-to-Course Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a resumable one-brief course creation workflow that composes the existing Academy AI, canonical Course Domain, media generation, Sales Engine, Page Builder, and RAG into one creator-facing flow.

**Architecture:** Persist orchestration state in `CourseCreationRun`; advance one real workflow step per HTTP request through `CourseCreationEngine`; keep all business mutations delegated to existing domain services. The React UI automatically advances the server run and renders real progress with a lightweight Thinking Orb.

**Tech Stack:** Laravel/PHP, Eloquent/PostgreSQL, React 19/Inertia 3, Tailwind 4, existing Academy AI/MCP/Page Builder/Sales services.

**Spec:** `docs/superpowers/specs/2026-09-01-m13-7-one-brief-to-course-design.md`

## Global Constraints

- Start from v1.1.7 M13.6.
- No automatic course/page publication.
- No new LessonBlock/quiz/assignment/certificate/drip subsystem.
- Reuse `AcademyAiRunner`, `ApplyAcademyAiRunAction`, `CourseMediaGenerationService`, `CourseOffer`, `AcademyPage`, and `IndexCourseKnowledge`.
- One narration per advance request.
- ZIP release must exclude vendor, node_modules, fonts, real .env, caches, and secrets.
- Final milestone requires cumulative ZIP + SHA-256 + fresh extraction retest.

---

### Task 1: Durable Course Creation Run

**Files:**
- Create: `database/migrations/2026_09_01_020000_create_course_creation_runs_table.php`
- Create: `app/Models/CourseCreationRun.php`
- Test: `tests/Contract/M13_7OneBriefToCourseContractTest.php`

**Interfaces:**
- Produces: `CourseCreationRun` with step/status/options/state/object IDs and ownership.

- [ ] Write RED contract requiring migration/model/step constants.
- [ ] Run contract and verify failure.
- [ ] Implement migration/model.
- [ ] Run contract and verify next missing behavior.

### Task 2: Orchestration Engine

**Files:**
- Create: `app/Services/Courses/CourseCreationEngine.php`
- Modify: `app/Actions/Trainer/AcademyAi/ApplyAcademyAiRunAction.php` only if a reusable output lookup is required.
- Test: `tests/Feature/Trainer/OneBriefCourseCreationTest.php`

**Interfaces:**
- Consumes: `CourseCreationRun`, `AcademyAiRunner`, `ApplyAcademyAiRunAction`, `CourseMediaGenerationService`.
- Produces: `start(User,array): CourseCreationRun`, `advance(User,CourseCreationRun): CourseCreationRun`.

- [ ] Contract requires exact step flow and forbids publish action.
- [ ] Implement blueprint and materialize steps.
- [ ] Implement idempotent cover/thumbnail stages.
- [ ] Implement one-lesson-per-call narration stage.
- [ ] Implement deterministic default offer.
- [ ] Implement landing draft using `page.generate` and existing apply action.
- [ ] Implement review completion and summary state.

### Task 3: HTTP Surface

**Files:**
- Create: `app/Http/Controllers/Trainer/CourseCreationController.php`
- Create: `app/Http/Requests/Trainer/StartCourseCreationRequest.php`
- Modify: `routes/trainer.php`

**Interfaces:**
- Produces: GET index, POST start, POST advance JSON.

- [ ] Add ownership/validation contract.
- [ ] Implement start and resume routes.
- [ ] Serialize only trainer-owned run/course/page information.

### Task 4: Creator UX + Thinking Orb

**Files:**
- Create: `resources/js/components/academy-ai/thinking-orb.tsx`
- Create: `resources/js/pages/trainer/academy-ai/course-creation.tsx`
- Modify: `resources/js/pages/trainer/academy-ai/index.tsx`

**Interfaces:**
- Consumes: serialized run + routes.
- Produces: setup, real-progress, failure/resume, review UI.

- [ ] Add RED source contract for Orb/state labels/review behavior.
- [ ] Implement local motion-safe Thinking Orb.
- [ ] Implement brief/options form.
- [ ] Implement sequential advance loop with CSRF and server state.
- [ ] Implement review links; no auto publish button.
- [ ] Add entry point from Academy AI.

### Task 5: CI, Docs, Version, Release

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `VERSION`, `PACKAGE_VERSION`, `package.json`
- Create: `docs/releases/M13.7-ONE-BRIEF-TO-COURSE.md`
- Create after verification: `docs/releases/M13.7-VERIFICATION.md`
- Modify: `RELEASE_MANIFEST.md`, `README.md` as needed.

**Interfaces:**
- Produces: v1.1.8 cumulative release.

- [ ] Add M13.7 contract to CI.
- [ ] Run cumulative source contracts M07→M13.7.
- [ ] Run PHP syntax and TS/TSX parse gates.
- [ ] Run YAML, migration-order, hygiene, font, `.env`, secret gates.
- [ ] Probe Pest/PostgreSQL/Vite/Docker and record PASS/BLOCKED honestly.
- [ ] Build pre-release ZIP and retest fresh extraction.
- [ ] Add verification doc.
- [ ] Build final ZIP + SHA-256.
- [ ] Extract final ZIP and rerun full available gate.
