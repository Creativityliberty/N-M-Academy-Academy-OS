# M14.3 Completion Rules + Certificates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build canonical tier-aware course completion and idempotent publicly verifiable certificates from existing lesson, assessment and assignment evidence.

**Architecture:** Add a thin completion policy plus immutable completion/certificate records. `CourseCompletionService` is the only authority that evaluates evidence and issues certificates; existing lesson/assessment/assignment actions merely trigger reevaluation. Public verification reads certificate snapshots and a dependency-free PDF service renders them on demand.

**Tech Stack:** Laravel 13/PHP 8.3+, React 19/Inertia 3, PostgreSQL, existing MCP/Tower architecture, no new Composer package.

**Spec:** `docs/superpowers/specs/2026-09-02-m14-3-completion-certificates-design.md`

## Global Constraints
- Keep `Course -> Module -> Lesson`; no LessonBlock rewrite.
- Access scope remains `Enrollment.access_rank -> Module.minimum_access_rank`.
- M14.1 assessment and M14.2 assignment history must not be mutated by completion evaluation.
- Server-side completion is canonical; React displays only returned state.
- Certificate issuance is derived only; no manual “issue certificate” endpoint/tool.
- Tower remains French by default and existing M14.2 Tower runtime fixes stay intact.
- No API keys, `.env`, `vendor`, `node_modules`, fonts or generated PDF files in release ZIP.
- Target version `1.5.0`.

---

### Task 1: Completion domain and migration
**Files:**
- Create `database/migrations/2026_09_02_010000_create_course_completion_and_certificates_tables.php`
- Create `app/Models/CourseCompletionPolicy.php`
- Create `app/Models/CourseCompletion.php`
- Create `app/Models/CourseCertificate.php`
- Modify `app/Models/Course.php`
- Modify `app/Models/CourseAssessment.php`
- Modify `app/Models/CourseAssignment.php`
- Test `tests/Contract/M14_3CompletionCertificatesContractTest.php`

**Interfaces:**
- Produces `Course::completionPolicy()`, `Course::completions()`, `Course::certificates()`.
- Produces boolean `is_required_for_completion` on assessment/assignment.

- [ ] Write contract assertions for tables/models/relations and required flags.
- [ ] Run contract and observe RED.
- [ ] Add migration/models/relations with unique constraints and safe FKs.
- [ ] Run contract and observe GREEN for domain section.

### Task 2: Canonical completion engine
**Files:**
- Create `app/Services/Completion/CourseCompletionService.php`
- Create `app/Data/CompletionStatus.php`
- Test `tests/Feature/Completion/CompletionCertificateEngineTest.php`
- Test contract file above.

**Interfaces:**
- `status(User $student, Course $course): CompletionStatus`.
- `evaluate(User $student, Course $course): ?CourseCompletion` atomically creates completion/certificate when eligible.

- [ ] Write failing tests for tier-aware lesson counts, required passed assessment, required approved assignment, optional primitives, and idempotency.
- [ ] Observe RED.
- [ ] Implement query/evidence evaluation and snapshot.
- [ ] Implement atomic completion/certificate creation.
- [ ] Re-run tests/contract.

### Task 3: Trigger completion from existing learning flows
**Files:**
- Modify `app/Http/Controllers/Student/Courses/LessonProgressController.php`
- Modify `app/Services/Assessments/AssessmentScoringService.php`
- Modify `app/Services/Assignments/AssignmentReviewService.php`
- Test feature engine test.

**Interfaces:**
- Existing mutation signatures unchanged.
- Calls `CourseCompletionService::evaluate()` after successful canonical evidence write.

- [ ] Add failing contract assertions for all three trigger sites.
- [ ] Observe RED.
- [ ] Inject/call completion service after complete/passed/approved events.
- [ ] Verify completion is not revoked by lesson unmark.

### Task 4: Trainer completion policy and certificate management
**Files:**
- Create `app/Http/Controllers/Trainer/CompletionController.php`
- Create `resources/js/pages/trainer/courses/completion/index.tsx`
- Modify `routes/trainer.php`
- Modify `app/Http/Controllers/Trainer/CourseReviewController.php`
- Modify `resources/js/pages/trainer/academy-ai/course-review.tsx`

**Interfaces:**
- GET `trainer.completion.show`.
- PUT `trainer.completion.update`.
- POST `trainer.certificates.revoke` with mandatory reason.

- [ ] Add contract RED for routes/controller/UI/review link.
- [ ] Implement owner/admin authorization and validated policy/required IDs.
- [ ] Implement certificate list/revocation and French UI.
- [ ] Add Review Center completion summary without making it a publish prerequisite.

### Task 5: Student completion checklist and certificate workspace
**Files:**
- Modify `app/Http/Controllers/Student/Courses/CourseController.php`
- Modify `resources/js/pages/student/courses/show.tsx`
- Create `app/Http/Controllers/Student/CertificateController.php`
- Create `resources/js/pages/student/certificates/index.tsx`
- Modify `routes/student.php`

**Interfaces:**
- Student course props add `completion` object from `CompletionStatus`.
- GET `student.certificates.index` lists owned certificates.

- [ ] Add contract RED for checklist props/routes/page.
- [ ] Serialize server-computed criteria only.
- [ ] Add course completion card and certificate CTA.
- [ ] Add certificates workspace with verification/share links.

### Task 6: Public verification and dependency-free PDF
**Files:**
- Create `app/Http/Controllers/Public/CertificateVerificationController.php`
- Create `app/Services/Certificates/CertificatePdfService.php`
- Create `resources/js/pages/public/certificates/verify.tsx`
- Modify `routes/public.php`
- Test feature engine test.

**Interfaces:**
- GET `certificates.verify` by verification code.
- GET `certificates.verify.pdf` returns `application/pdf`.
- `CertificatePdfService::render(CourseCertificate $certificate): string` returns PDF bytes.

- [ ] Write failing tests/contract for valid, revoked, missing certificate and PDF header `%PDF-`.
- [ ] Implement public sanitized payload and revocation status.
- [ ] Implement PDF renderer with WinAnsi-safe escaping and verification URL.
- [ ] Add copy/share UI.

### Task 7: MCP/Tower governed completion tools
**Files:**
- Modify `app/Mcp/AcademyMcpToolRegistry.php`
- Modify `app/Mcp/AcademyMcpToolExecutor.php`
- Test contract file.

**Interfaces:**
- `completion.policy.get` READ.
- `completion.policy.update` WRITE.
- `certificates.list` READ PERSONAL.
- `certificates.get` READ PERSONAL.
- `certificates.revoke` SENSITIVE PERSONAL.

- [ ] Add RED assertions for registry, schemas, risk/data classification and executor branches.
- [ ] Implement trainer-owned scope and strong revoke operation.
- [ ] Confirm there is no `certificates.issue` tool.

### Task 8: Version, CI, docs and cumulative release gate
**Files:**
- Modify `VERSION`, `PACKAGE_VERSION`, `config/academy.php`, `.env.example`, `.env.coolify.example` only if needed.
- Modify `.github/workflows/ci.yml` to run M14.3 contract.
- Modify `README.md`, `RELEASE_MANIFEST.md`.
- Create `docs/releases/M14.3-COMPLETION-CERTIFICATES.md`.
- Create `docs/releases/M14.3-VERIFICATION.md`.

**Interfaces:** release v1.5.0 cumulative ZIP.

- [ ] Set version 1.5.0 and make historical version contracts forward-compatible if necessary.
- [ ] Run M04->M14.3 contract suite.
- [ ] Run PHP syntax, TS/TSX parse, YAML/JSON, migration-order, hygiene and secret gates.
- [ ] Probe Pest/migrate/npm/Docker and record PASS/BLOCKED accurately.
- [ ] Build control ZIP, extract fresh and rerun available gates.
- [ ] Embed verification evidence, rebuild final ZIP, SHA-256, second fresh extraction/retest.
