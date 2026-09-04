# M13.5.1 Course + Release Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove release-critical and course-mutation inconsistencies found by the second deep audit before M13.6 expands AI/Tower course creation.

**Architecture:** Keep the existing Laravel/React domain intact. Introduce only narrow shared course lifecycle primitives where multiple mutation paths currently disagree, then make trainer/admin/MCP reuse them. Add a source contract runnable without vendor plus Pest regression tests for CI/Coolify.

**Tech Stack:** Laravel 13, PHP 8.4+, React/Inertia, PostgreSQL 17 + pgvector, Redis, Stripe, existing Academy MCP/Tutor jobs.

**Spec:** `docs/releases/M13.5.1-COURSE-RELEASE-HARDENING.md`

## Global Constraints
- No rewrite of Course → Module → Lesson.
- No new runtime container or datastore.
- No vendor/node_modules/fonts/real .env/secrets in release.
- Course financial history must not be deleted by normal course lifecycle actions.
- External Stripe effects remain governed and publication stays explicit.
- M13.6 features are deferred.

---

### Task 1: Add hardening contract and migration-order regression

**Files:**
- Create: `tests/Contract/M13_5_1CourseReleaseHardeningContractTest.php`
- Rename/Modify: `database/migrations/2026_08_31_210000_create_tower_compilations_table.php` → `database/migrations/2026_08_31_210005_create_tower_compilations_table.php`

**Interfaces:**
- Consumes: current Tower missions/compilations migrations.
- Produces: deterministic fresh-install order with missions before compilations.

- [ ] Write the source contract asserting the corrected migration filename/order and all M13.5.1 invariants.
- [ ] Run the contract before production edits and verify RED.
- [ ] Rename the compilation migration and make it safe if the table already exists in an upgraded environment.
- [ ] Run the contract slice and verify migration-order checks GREEN.

### Task 2: Preserve commerce history through course lifecycle

**Files:**
- Modify: `app/Enums/CourseStatus.php`
- Create: `app/Actions/Courses/ArchiveCourseAction.php`
- Modify: `app/Actions/Trainer/Courses/DeleteCourseAction.php`
- Modify: `app/Actions/Admin/Courses/DeleteCourseAction.php`
- Modify: trainer/admin course controllers copy for archive wording.
- Test: `tests/Feature/Trainer/CourseHardeningTest.php`

**Interfaces:**
- Produces: `ArchiveCourseAction::handle(Course $course): Course`; status `archived` and published_at null while Course/Orders remain.

- [ ] Add failing source/feature assertions that delete actions no longer physically delete courses.
- [ ] Add `CourseStatus::Archived` and shared archive action that deactivates active offers and Stripe catalog where present, then marks the course archived.
- [ ] Delegate trainer/admin delete actions to the archive action.
- [ ] Verify contract checks GREEN; leave Pest execution for dependency-backed gate when vendor is available.

### Task 3: Make lesson media update lossless

**Files:**
- Modify: trainer/admin `UpdateCourseAction.php`
- Modify: trainer/admin `UploadLessonMediaAction.php`
- Test: `tests/Feature/Trainer/CourseHardeningTest.php`

**Interfaces:**
- `UploadLessonMediaAction::remove(?string $url): void`
- New lesson update path preserves `audio_file`/`pdf_file` when calling `CreateLessonAction`.

- [ ] Add failing contract assertions for preserving new media files and explicit stale-media cleanup.
- [ ] Restore uploaded file objects for the create-lesson branch.
- [ ] Add `remove()` and normalize mutually exclusive media when type switches.
- [ ] Verify source contract GREEN.

### Task 4: Centralize publishing semantics

**Files:**
- Create: `app/Actions/Courses/PublishCourseAction.php`
- Create: `app/Actions/Courses/UnpublishCourseAction.php`
- Modify: trainer/admin course controllers.
- Modify: `app/Mcp/AcademyMcpToolExecutor.php`
- Test: `tests/Feature/Trainer/CourseHardeningTest.php`

**Interfaces:**
- `PublishCourseAction::handle(User $actor, Course $course): Course`
- `UnpublishCourseAction::handle(Course $course): Course`

- [ ] Add failing source assertions that all course publication entry points delegate to shared actions.
- [ ] Move Stripe onboarding/catalog provisioning + `status/published_at` update into `PublishCourseAction`.
- [ ] Make unpublish always clear `published_at`.
- [ ] Switch Trainer/Admin/MCP entry points to shared actions.
- [ ] Verify contract GREEN.

### Task 5: Align AI page validation and Tower approval metadata

**Files:**
- Modify: `app/Http/Requests/Trainer/AcademyAiRunRequest.php`
- Modify: `app/MissionTower/Services/MissionRunner.php` or exact approval creation site found by search.
- Test: source contract + existing feature test extension.

**Interfaces:**
- Request whitelist includes `page.generate`, `page.optimize`.
- `page.optimize` requires `input.page_id`.
- Dotted `_meta` keys are read literally.

- [ ] Add failing source assertions.
- [ ] Expand request validation and page target requirement.
- [ ] Replace dotted `data_get` receipt lookup with exact-key access.
- [ ] Verify contract GREEN.

### Task 6: Keep Tutor knowledge consistent after MCP lesson mutations

**Files:**
- Modify: `app/Mcp/AcademyMcpToolExecutor.php`
- Test: `tests/Feature/Mcp/AcademyMcpGatewayTest.php` and source contract.

**Interfaces:**
- MCP lesson create/update dispatches `IndexCourseKnowledge` after DB commit for the owning course.

- [ ] Add failing source assertion for `IndexCourseKnowledge` in MCP lesson mutation paths.
- [ ] Dispatch indexing after successful create/update.
- [ ] Verify contract GREEN.

### Task 7: Remove public course mock fallbacks

**Files:**
- Modify: `app/Http/Resources/Public/CourseResource.php`
- Modify: `resources/js/pages/home/courses/partials/course-detail.tsx`
- Modify repository eager-counts if necessary for real `studentCount`.
- Test: source contract and TypeScript parse gate.

**Interfaces:**
- Missing data renders as empty/zero, never fabricated testimonials/objectives/prerequisites/stats.

- [ ] Add failing source assertion that the mock fallback comment/data are absent.
- [ ] Use API values directly with safe empty states.
- [ ] Populate real enrollment count when available.
- [ ] Verify contract + TS syntax GREEN.

### Task 8: Release gate and packaging

**Files:**
- Modify: `PACKAGE_VERSION`, `VERSION`, `README.md` release references as needed.
- Create: `docs/releases/M13.5.1-VERIFICATION.md`
- Create artifact: cumulative `NUM_Academy_OS_v1.1.6_M13.5.1_Course_Release_Hardening_2026-09-01.zip`
- Create artifact: matching `.sha256`

**Interfaces:**
- Produces reproducible cumulative release from v1.1.5 plus M13.5.1 only.

- [ ] Run M07→M13.5 source contracts plus M13.5.1 contract.
- [ ] Run PHP syntax across app/routes/config/database/tests.
- [ ] Run TS/TSX syntax parse and YAML validation.
- [ ] Probe Composer/Pest, npm/Vite and PostgreSQL migrate:fresh; report BLOCKED rather than fake PASS when dependencies/services are unavailable.
- [ ] Scan dependency dirs, fonts, real `.env`, secrets.
- [ ] Package ZIP + SHA, extract into a fresh directory and rerun the full available gate.
