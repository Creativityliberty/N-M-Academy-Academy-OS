# M14.3 Completion Rules + Certificates — Design

## Status
Approved in conversation on 2026-09-02 by explicit “vasy chef”.

## Goal
Turn the existing learning evidence into one canonical, server-side completion decision and issue a durable, publicly verifiable course certificate without creating a second progress system.

## Existing evidence reused
- Lesson completion: `lesson_progress.completed_at`.
- Assessment success: at least one `course_assessment_attempts.passed = true`.
- Assignment success: at least one `course_assignment_submissions.status = approved`.
- Access scope: `Enrollment.access_rank -> Module.minimum_access_rank`.
- Course ownership and publication remain in the existing Course domain.

## Domain additions

### CourseCompletionPolicy
One record per course, lazily created when needed.
- `course_id` unique.
- `require_all_accessible_lessons` boolean, default `true`.
- `certificate_enabled` boolean, default `true`.
- `certificate_title` nullable string.
- `issuer_name` nullable string; falls back to Academy name.

### Required learning primitives
Add `is_required_for_completion` to:
- `course_assessments`, default `false` for backwards compatibility.
- `course_assignments`, default `false` for backwards compatibility.

Existing courses are therefore not suddenly blocked by historical quiz/project content. Trainers opt required primitives in explicitly. New AI-generated module assessments may opt in later without changing the domain.

### CourseCompletion
One immutable completion milestone per `(course_id, user_id)`.
- `user_id`, `course_id`, nullable `enrollment_id`.
- `completed_at`.
- `evidence_snapshot` JSON containing the exact counts and IDs that satisfied completion.
- Unique `(course_id, user_id)`.

After creation, this record is not automatically removed when progress is later changed. Completion is a historical milestone. An administrative correction can be introduced later as an explicit operation rather than silent recomputation.

### CourseCertificate
At most one certificate per completion.
- `completion_id` unique.
- `user_id`, `course_id`.
- `verification_code` random UUID/ULID style public identifier, unique and unguessable.
- `recipient_name`, `course_title`, `issuer_name`, `certificate_title` snapshots.
- `issued_at`.
- `revoked_at`, `revoked_by`, `revocation_reason` nullable.
- `document_hash` SHA-256 over the canonical certificate snapshot.

No PDF binary is persisted. PDF is generated deterministically on demand from the certificate snapshot, avoiding storage lifecycle and stale file problems.

## Completion algorithm
For a student with an enrollment:
1. Determine modules accessible to the enrollment's `access_rank`.
2. Determine lessons inside those modules.
3. If policy requires lessons, every accessible lesson must have `LessonProgress`.
4. Determine enabled assessments in the course whose module target is either null or accessible and whose `is_required_for_completion = true`.
5. Every required assessment must have at least one passed attempt by the student.
6. Determine enabled assignments in the same accessible scope whose `is_required_for_completion = true`.
7. Every required assignment must have at least one approved submission by the student.
8. If all configured criteria are satisfied, atomically `firstOrCreate` the `CourseCompletion`.
9. If certificates are enabled, atomically issue one `CourseCertificate`.

The server is the only authority. React never calculates completion or certificate eligibility.

## Recalculation triggers
Call the completion service after:
- lesson marked complete;
- assessment attempt submitted;
- assignment review becomes `approved`.

Unmarking a lesson does not revoke a previously issued completion/certificate.

## Trainer UX
New course-local workspace: `/trainer/courses/{course}/completion`.

It lets the trainer:
- require all accessible lessons or ignore lesson completion;
- enable/disable certificates;
- set certificate title and issuer display name;
- mark each enabled assessment required/not required;
- mark each enabled assignment required/not required;
- see counts of completions and certificates;
- revoke a certificate with a required reason.

Review Center gets a “Complétion & certificats” summary and link. Completion settings do not block course publication.

## Student UX
Course Player receives a server-computed completion checklist:
- lessons complete / required;
- required assessments passed / total;
- required assignments approved / total;
- completed boolean;
- certificate URL when issued.

New `/student/certificates` workspace lists the student's certificates and share/verification links.

## Public verification
Public route: `/certificates/verify/{verificationCode}`.

Shows only certificate-public data:
- recipient name;
- course title;
- issuer;
- issued date;
- valid/revoked status;
- verification code.

No email, enrollment/payment data, assessment answers, assignment content or private IDs are exposed.

A public PDF download route is available from the same unguessable verification code.

## PDF generation
Implement a dependency-free `CertificatePdfService` using the PDF core Helvetica/WinAnsi encoding. French/Western-European characters are converted to Windows-1252; unsupported characters fall back safely. No font binary is packaged.

The PDF contains:
- Academy/issuer name;
- certificate title;
- recipient name;
- course title;
- issued date;
- verification code;
- public verification URL.

## MCP / Tower
Expose only governed course/certificate administration:
- `completion.policy.get` READ.
- `completion.policy.update` WRITE.
- `certificates.list` READ, trainer-owned scope.
- `certificates.get` READ, trainer-owned scope.
- `certificates.revoke` SENSITIVE + PERSONAL, strong approval.

No tool can forge a completion or directly issue a certificate. Issuance is exclusively derived from canonical learning evidence.

## Security and invariants
- Certificate creation is idempotent and concurrency-safe.
- Verification code is generated server-side and unique.
- A user cannot download another private student dashboard, but public verification is intentionally shareable by code.
- Revocation is explicit and audited through normal controller/MCP governance.
- No public route reveals email or learning submissions.
- Existing M14.1/M14.2 history remains protected by RESTRICT FKs.
- Tower remains French by default and keeps its existing shell/sidebar/runtime fixes.
- No new container, datastore or font files.

## Version and release
Target: **NÜM Academy OS v1.5.0 — M14.3 Completion Rules + Certificates**.

Release follows the project policy: cumulative ZIP, SHA-256, fresh extraction gate, rebuilt final ZIP, second fresh extraction/retest; dependency-backed gates remain BLOCKED if Composer/npm/Docker are unavailable.
