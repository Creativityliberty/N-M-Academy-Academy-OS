# M15.1 — Learning Access, Drip & Prerequisites Design

## Goal
Add deterministic drip scheduling and prerequisite-based unlock rules to the existing Academy learning model without creating a second progression engine.

## Existing sources of truth
- `Enrollment.enrolled_at` and `Enrollment.access_rank` remain the enrollment/tier source of truth.
- `Module.minimum_access_rank` remains the commercial access boundary.
- `LessonProgress` remains the lesson completion source of truth.
- `CourseAssessmentAttempt.passed` remains the assessment success source of truth.
- `CourseAssignmentSubmission.status=approved` remains the assignment approval source of truth.
- M14 completion/certificates remain the course completion system and must consume accessible/unlocked requirements rather than duplicate unlock logic.

## New domain primitive
One table: `course_unlock_rules`.

Each rule has:
- `course_id`
- `target_type`: `module|lesson|assessment|assignment`
- `target_id`
- `rule_type`: `enrollment_delay_days|fixed_datetime|module_completed|lesson_completed|assessment_passed|assignment_approved`
- `source_type` / `source_id` for prerequisite rules
- `delay_days` for enrollment-delay rules
- `available_at` for fixed datetime rules
- `is_enabled`
- `position`

All enabled rules attached to the same target are AND conditions. No extra progress table is added.

## Canonical runtime service
`App\Services\LearningAccess\LearningAccessService` is the only runtime access evaluator.

It combines:
1. enrollment existence;
2. `minimum_access_rank` tier access;
3. target-specific unlock rules;
4. prerequisite evidence from existing M14/M03 tables.

It returns a structured decision with `allowed`, human-readable French reasons, and the next known `unlockAt` when time-based.

If `academy.features.drip=false`, the service falls back to the historical tier-only behavior so Factory feature disabling is deterministic.

## Authoring service
`UnlockRuleDefinitionService` owns create/update/delete validation for trainer UI and MCP. It validates ownership, target/source course consistency, valid payloads, no self-dependency, and rejects obvious forward/circular prerequisite references by curriculum position.

## Student security
Unlock decisions are enforced server-side on:
- Course Player serialization and media redaction;
- lesson progress writes;
- lesson notes writes;
- assessment view/submit;
- assignment view/submit/download;
- Tutor lesson scope;
- Tutor/RAG retrieval, so future locked lesson chunks never enter model context.

The Course Player still shows locked modules/lessons with a French reason and optional unlock date, but never sends locked paid content/media.

## Trainer UX
Add a dedicated `Drip & prérequis` Course Studio page rather than expanding the already-large course editor. It lists modules, lessons, assessments and assignments and allows attaching/removing rules.

## MCP / Tower
Add governed tools using the same `UnlockRuleDefinitionService`:
- `learning.access.rules.list` — READ
- `learning.access.rules.create` — WRITE
- `learning.access.rules.update` — WRITE
- `learning.access.rules.delete` — WRITE/destructive

No Tower-specific rule engine is created.

## Factory / Coolify
Add `drip` capability and `ACADEMY_FEATURE_DRIP`. Essential, Creator and Pro default it to true because sequencing is a core course capability. Disabling it preserves tier access but ignores drip/prerequisite rules.

## Completion semantics
M14 completion must only require requirements that are both tier-accessible and currently unlocked. A student must never be blocked from completing by future content they cannot yet access.

## Release target
`v1.6.0 — M15.1 Drip, Prerequisites & Unlock Rules`.
