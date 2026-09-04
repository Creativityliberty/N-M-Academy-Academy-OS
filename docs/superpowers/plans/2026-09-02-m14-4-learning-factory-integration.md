# M14.4 Learning Experience + Factory Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close M14 across Student, Trainer, Factory and Coolify with capability profiles and white-label certificate defaults.

**Architecture:** Extend the existing Academy feature/config layer and M12 Factory blueprint rather than adding a parallel LMS. Reuse the M14 completion/certificate engine and expose the missing UX/deployment integration through feature-gated surfaces.

**Tech Stack:** Laravel 13 / PHP 8.4, React 19 / Inertia 3, Tailwind 4, PostgreSQL 17, Redis, Docker Compose / Coolify.

**Spec:** `docs/superpowers/specs/2026-09-02-m14-4-learning-factory-integration-design.md`

## Global Constraints

- Target version `1.5.1`.
- No new Composer or npm dependency.
- Keep existing M14 tables and M10/M11/M09/Tower boundaries.
- Feature disabling never deletes learning history.
- `certificates` requires `completion` in Factory normalization.
- Student PDF access is ownership checked.

---

### Task 1: M14.4 contract

**Files:**
- Create: `tests/Contract/M14_4LearningFactoryIntegrationContractTest.php`
- Modify: `.github/workflows/tests.yml`

**Interfaces:**
- Consumes: v1.5.0 M14.3 source.
- Produces: standalone source contract covering M14.4 invariants.

- [ ] Write the contract requiring learning feature config, Factory capability registry/profile support, Student certificate sidebar/PDF route, Trainer workspace links, Coolify envs and version >=1.5.1.
- [ ] Run `php tests/Contract/M14_4LearningFactoryIntegrationContractTest.php` and verify RED on missing M14.4 capability integration.
- [ ] Add the contract to CI after M14.3.

### Task 2: Capability config and Factory backend

**Files:**
- Create: `app/Factory/AcademyFactoryCapabilityRegistry.php`
- Modify: `app/Factory/AcademyFactoryTemplateRegistry.php`
- Modify: `app/Factory/AcademyFactoryBlueprintBuilder.php`
- Modify: `app/Http/Controllers/Admin/AcademyFactoryController.php`
- Modify: `config/academy.php`
- Test: `tests/Feature/AcademyFactoryTest.php`

**Interfaces:**
- Produces: `AcademyFactoryCapabilityRegistry::all()`, `get()`, `resolveFeatures()` and blueprint keys `capability_profile`, `learning`.

- [ ] Add feature-test expectations for essential/creator/pro profiles and M14 environment values.
- [ ] Implement registry and template default profile mapping.
- [ ] Extend controller validation and blueprint construction with M14 flags/defaults and Tower.
- [ ] Run standalone M14.4 contract until the backend portion advances GREEN.

### Task 3: Factory UI

**Files:**
- Modify: `resources/js/pages/admin/factory/index.tsx`

**Interfaces:**
- Consumes: `capabilityProfiles` and each template `capabilityProfile`.
- Produces: `capability_profile`, feature overrides and `learning` form payload.

- [ ] Add capability profile selector distinct from visual Template.
- [ ] Group Platform and Learning capabilities; switching profile replaces capability defaults.
- [ ] Add Learning & Certification white-label controls.
- [ ] Preserve current secret inputs and deployment list behavior.

### Task 4: Student M14 experience

**Files:**
- Create: `resources/js/components/student/course-completion-card.tsx`
- Modify: `resources/js/components/app-sidebar.tsx`
- Modify: `resources/js/pages/student/courses/show.tsx`
- Modify: `resources/js/pages/student/certificates/index.tsx`
- Modify: `app/Data/CompletionStatus.php`
- Modify: `app/Services/Completion/CourseCompletionService.php`
- Modify: `app/Http/Controllers/Student/CertificateController.php`
- Modify: `routes/student.php`
- Modify: `app/Http/Controllers/Public/CertificateVerificationController.php`

**Interfaces:**
- Produces completion fields `certificatePdfUrl`, `certificateShareEnabled` in addition to existing verification data.

- [ ] Add `Mes certificats` sidebar item gated by `features.certificates`.
- [ ] Add authenticated Student PDF route with certificate ownership check.
- [ ] Make public verification/PDF honor Academy certificate defaults.
- [ ] Make completion evaluation/status honor Academy learning feature flags without deleting history.
- [ ] Render the focused completion card with counts, remaining categories and certificate actions.

### Task 5: Trainer M14 workspace coherence

**Files:**
- Modify: `resources/js/pages/trainer/courses/edit.tsx`
- Modify: `routes/trainer.php`

**Interfaces:**
- Consumes shared `academy.features` Inertia props.

- [ ] Add Quiz, Assignments and Completion/Certificates buttons together in Course Builder.
- [ ] Gate M14 trainer/student routes by capability feature middleware.
- [ ] Keep public historical verification separately controlled by certificate policy config.

### Task 6: Deployment defaults and release metadata

**Files:**
- Modify: `.env.example`
- Modify: `.env.coolify.example`
- Modify: `docker-compose.coolify.yml`
- Modify: `VERSION`
- Modify: `PACKAGE_VERSION`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `config/academy.php`

**Interfaces:**
- Produces runtime defaults for all Factory learning capabilities.

- [ ] Add four learning feature envs and certificate/completion defaults.
- [ ] Preserve `academy-assignments` persistent volume.
- [ ] Set all release version surfaces to `1.5.1`.

### Task 7: Regression, docs and packaging

**Files:**
- Create: `docs/releases/M14.4-LEARNING-FACTORY-INTEGRATION.md`
- Create: `docs/releases/M14.4-VERIFICATION.md`
- Modify: `README.md` if milestone/version table exists.

**Interfaces:**
- Produces cumulative v1.5.1 ZIP and SHA-256.

- [ ] Run M04→M14.4 standalone contracts.
- [ ] Run PHP syntax, TS/TSX parse, migration ordering, YAML/JSON and secret/dependency/font scans.
- [ ] Record dependency-bound runtime probes honestly.
- [ ] Build control ZIP, fresh-extract and rerun available gates.
- [ ] Build final ZIP with embedded verification, compute SHA-256, fresh-extract again and rerun gates.
