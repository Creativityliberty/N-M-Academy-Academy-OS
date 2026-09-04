# M15.1 Learning Access & Drip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one canonical Learning Access engine for tier, drip, and prerequisite rules and enforce it across Student, Trainer, MCP/Tower, Factory, Completion, and Tutor/RAG.

**Architecture:** Preserve all existing progression and commerce tables. Add one `course_unlock_rules` definition table, one authoring service, one runtime access service, and make every affected surface call that service. Factory gates the behavior through `ACADEMY_FEATURE_DRIP`.

**Tech Stack:** Laravel 13 / PHP 8.4, React 19 / Inertia 3, PostgreSQL 17 + pgvector, Redis, Tailwind 4, MCP Gateway, Docker/Coolify.

**Spec:** `docs/superpowers/specs/2026-09-03-m15-1-learning-access-drip-design.md`

## Global Constraints
- No new progression table.
- Preserve `Enrollment.access_rank`, `Module.minimum_access_rank`, `LessonProgress`, assessment attempts, assignment submissions, M14 completion/certificates.
- Server-side enforcement is mandatory; frontend-only locks are forbidden.
- Tutor/RAG must not retrieve locked future lesson content.
- Tower uses the same domain service via MCP; no direct Tower CRUD implementation.
- Factory + Coolify integration is part of M15.1.
- Version target is `1.6.0`.

---

### Task 1: Contract RED
- [ ] Add `tests/Contract/M15_1LearningAccessDripContractTest.php` asserting domain, security surfaces, Trainer UX, MCP tools, Factory/Coolify, version and CI registration.
- [ ] Run it and verify RED because M15.1 files are missing.

### Task 2: Unlock domain and services
- [ ] Add enums/data/model/migration for unlock rules.
- [ ] Add `LearningAccessService` and `UnlockRuleDefinitionService`.
- [ ] Add feature tests covering time rules, prerequisite rules, AND semantics, tier behavior and disabled-feature fallback.
- [ ] Re-run contract and relevant static checks.

### Task 3: Student security integration
- [ ] Replace tier-only checks with `LearningAccessService` in Course Player, progress, notes, assessments, assignments and Tutor lesson authorization.
- [ ] Filter Tutor/RAG retrieval to unlocked lesson IDs.
- [ ] Add regression tests for direct URL/action denial and RAG exclusion.

### Task 4: Completion integration
- [ ] Make completion evidence require only currently unlocked accessible requirements.
- [ ] Add tests that future drip content does not block current completion evidence.

### Task 5: Trainer authoring UX
- [ ] Add Trainer controller/routes and `Drip & prérequis` page.
- [ ] Add navigation link from Course Studio surfaces.
- [ ] Keep rule editing separate from the main course edit form.

### Task 6: MCP/Tower integration
- [ ] Add four learning-access rule tools to registry/executor/preflight.
- [ ] Reuse `UnlockRuleDefinitionService`.
- [ ] Add feature/contract coverage.

### Task 7: Factory/Coolify/version/CI
- [ ] Add `drip` capability, config, Factory UI/controller validation and blueprint env.
- [ ] Add compose/example env entries.
- [ ] Register M15.1 contract in CI.
- [ ] Bump VERSION, PACKAGE_VERSION, package.json and package-lock root version to 1.6.0.

### Task 8: Release verification and packaging
- [ ] Run cumulative contracts, PHP lint, TS/TSX parse, structured-data validation, migration FK-order scan and hygiene scan.
- [ ] Run runtime probes and report unavailable dependencies as BLOCKED, never PASS.
- [ ] Write M15.1 release/verification docs and README entry.
- [ ] Build control ZIP, extract fresh and retest.
- [ ] Build final ZIP + SHA-256, extract independently and retest again.
