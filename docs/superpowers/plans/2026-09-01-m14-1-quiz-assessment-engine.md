# M14.1 Quiz & Assessment Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add durable authored quiz/assessment primitives, student attempts/scoring, Academy AI generation, One-Brief integration and MCP CRUD without changing existing Tutor quiz semantics.

**Architecture:** `CourseAssessment` is a new authored domain attached to Course/Module/Lesson. `AssessmentScoringService` owns attempt allocation and grading. Trainer, Student, Academy AI, One-Brief and MCP all call this domain; Tower remains separated behind MCP.

**Tech Stack:** Laravel/PHP, PostgreSQL, React 19/Inertia, existing Academy AI provider abstraction, existing MCP gateway, existing CourseAccessService.

**Spec:** `docs/superpowers/specs/2026-09-01-m14-1-quiz-assessment-engine-design.md`

## Global Constraints

- Preserve `Course → Module → Lesson` and `CourseOffer.access_rank → Enrollment.access_rank → Module.minimum_access_rank`.
- Do not modify M09 `TutorQuizSession` semantics.
- Do not introduce LessonBlock or completion/certificate gating.
- AI generation must remain Proposal → Apply.
- No new npm/composer package is required.
- Target version: `1.3.0`.
- Release ZIP excludes dependencies, fonts, real `.env` and secrets.

---

### Task 1: Domain schema and models

**Files:**
- Create: `database/migrations/2026_09_01_220000_create_course_assessments_tables.php`
- Create: `app/Enums/AssessmentKind.php`
- Create: `app/Enums/AssessmentQuestionType.php`
- Create: `app/Models/CourseAssessment.php`
- Create: `app/Models/CourseAssessmentQuestion.php`
- Create: `app/Models/CourseAssessmentOption.php`
- Create: `app/Models/CourseAssessmentAttempt.php`
- Create: `app/Models/CourseAssessmentAnswer.php`
- Modify: `app/Models/Course.php`, `app/Models/Module.php`, `app/Models/Lesson.php`
- Test: `tests/Contract/M14_1QuizAssessmentContractTest.php`

**Interfaces:**
- Produces Eloquent relations `Course::assessments()`, `Module::assessments()`, `Lesson::assessments()`.
- Produces supported enums `quiz|assessment` and `single_choice|multiple_choice|true_false`.

- [ ] Write contract assertions for migration, models, fields and relations.
- [ ] Run contract and observe RED on missing migration/model.
- [ ] Implement schema/enums/models/relations.
- [ ] Run contract and observe next RED target.

### Task 2: Validation and scoring boundary

**Files:**
- Create: `app/Services/Assessments/AssessmentDefinitionValidator.php`
- Create: `app/Services/Assessments/AssessmentScoringService.php`
- Test: `tests/Feature/AssessmentEngineTest.php`

**Interfaces:**
- `AssessmentDefinitionValidator::validateQuestion(array $question): array`
- `AssessmentScoringService::submit(User $student, CourseAssessment $assessment, array $answers): CourseAssessmentAttempt`

- [ ] Write failing tests for single/multiple/true-false validation and scoring.
- [ ] Run targeted Pest test; if runtime cannot boot, preserve as BLOCKED and add source contract assertions.
- [ ] Implement exact-set scoring, percent/pass calculation and transactional attempt numbering/limit.
- [ ] Re-run available gates.

### Task 3: Trainer authored assessment CRUD and UI

**Files:**
- Create: `app/Http/Controllers/Trainer/AssessmentController.php`
- Create: `app/Http/Requests/Trainer/StoreAssessmentRequest.php`
- Create: `app/Http/Requests/Trainer/UpdateAssessmentRequest.php`
- Modify: `routes/trainer.php`
- Create: `resources/js/pages/trainer/courses/assessments/index.tsx`
- Modify: `resources/js/pages/trainer/courses/edit.tsx`

**Interfaces:**
- Course-scoped routes for list/create/update/delete/toggle.
- Request payload contains assessment settings plus nested questions/options.

- [ ] Add RED contract checks for routes/controller/UI entry point.
- [ ] Implement ownership-gated CRUD using course policy.
- [ ] Implement assessment workspace and Course edit entry point with existing design system.
- [ ] Re-run contract and TS/TSX parse gates.

### Task 4: Student assessment player

**Files:**
- Create: `app/Http/Controllers/Student/AssessmentController.php`
- Modify: `routes/student.php`
- Modify: `app/Http/Controllers/Student/Courses/CourseController.php`
- Create: `resources/js/pages/student/courses/assessment.tsx`
- Modify: `resources/js/pages/student/courses/show.tsx`

**Interfaces:**
- GET assessment never includes correctness before submission.
- POST submit returns persisted attempt result with score/pass and optional explanation feedback.

- [ ] Add failing authorization/payload/scoring tests.
- [ ] Implement access through `CourseAccessService` and target module/lesson rank.
- [ ] Implement attempt page and links from course player.
- [ ] Re-run available gates.

### Task 5: Academy AI assessment generation

**Files:**
- Create: `app/AI/Capabilities/GenerateAssessmentCapability.php`
- Modify: `app/AI/AcademyAiCapabilityRegistry.php`
- Modify: `app/Http/Requests/Trainer/AcademyAiRunRequest.php`
- Modify: `app/Actions/Trainer/AcademyAi/ApplyAcademyAiRunAction.php`
- Modify: `resources/js/pages/trainer/courses/assessments/index.tsx`

**Interfaces:**
- capability `assessment.generate`
- input requires `course_id`; optional module/lesson target
- Apply materializes one authored assessment only after successful proposal review.

- [ ] Add RED contract checks for capability, schema and apply handler.
- [ ] Implement grounded structured schema and target ownership checks.
- [ ] Implement apply materialization through validator.
- [ ] Add UI Generate → Preview → Apply.
- [ ] Re-run contracts.

### Task 6: One-Brief integration

**Files:**
- Modify: `app/Models/CourseCreationRun.php`
- Modify: `app/Services/Courses/CourseCreationEngine.php`
- Modify: `app/Http/Controllers/Trainer/CourseCreationController.php`
- Modify: `resources/js/pages/trainer/academy-ai/course-creation.tsx`
- Modify: `resources/js/components/academy-ai/thinking-orb.tsx` only if a real step-state mapping is required.
- Test: `tests/Feature/OneBriefCourseCreationTest.php`

**Interfaces:**
- option `generate_assessments`
- step `assessments` after `materialize`
- one module assessment generated per `advance()`

- [ ] Add RED checks for new step/option/state.
- [ ] Implement per-module generation and optional-step skip semantics.
- [ ] Extend real progress/orb label without fake timing.
- [ ] Re-run M13.7 regression contract.

### Task 7: MCP/Tower assessment CRUD

**Files:**
- Modify: `app/Mcp/AcademyMcpToolRegistry.php`
- Modify: `app/Mcp/AcademyMcpToolExecutor.php`
- Test: `tests/Feature/AcademyMcpTest.php`

**Interfaces:**
- READ: `assessments.list`, `assessments.get`
- WRITE: `assessments.create`, `assessments.update`, `assessments.delete`, `assessment.questions.create`, `assessment.questions.update`, `assessment.questions.delete`, `assessment.questions.reorder`

- [ ] Add RED registry/executor/risk checks.
- [ ] Implement creator ownership resolution and validation.
- [ ] Ensure no Tower direct model coupling is introduced.
- [ ] Re-run M08/M13 contracts.

### Task 8: Review Center and release integration

**Files:**
- Modify: `app/Http/Controllers/Trainer/CourseReviewController.php`
- Modify: `resources/js/pages/trainer/academy-ai/course-review.tsx`
- Modify: `.github/workflows/tests.yml`
- Modify: `VERSION`, `PACKAGE_VERSION`, `package.json`, `package-lock.json`, `README.md`, `RELEASE_MANIFEST.md`
- Create: `docs/releases/M14.1-QUIZ-ASSESSMENT-ENGINE.md`
- Create: `docs/releases/M14.1-VERIFICATION.md`

**Interfaces:**
- Review summary contains assessment count and trainer edit URL.
- Release version is 1.3.0.

- [ ] Add RED checks for Review/CI/version.
- [ ] Implement review assessment summary/link and CI contract execution.
- [ ] Run cumulative contracts M07→M14.1, PHP syntax, TS/TSX parser, YAML/JSON, migration-order, secret/font/dependency scans.
- [ ] Create control ZIP, fresh-extract and rerun gates.
- [ ] Write verification evidence, rebuild final ZIP, SHA-256, second fresh-extraction gate.
