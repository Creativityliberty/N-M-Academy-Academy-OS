# M13.6 Canonical Course Domain + AI/Tower CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing Academy course domain and governed MCP surface so a creator can build and modify a complete sellable course from Tower/Academy AI without inventing IDs or bypassing existing Sales/Page/Tutor systems.

**Architecture:** Keep `Course -> Module -> Lesson` as the aggregate backbone. Add only positioning/media metadata needed now, expose granular MCP tools over existing domain models/services, reuse CourseOffer and AcademyPage, and add provider-neutral image/TTS services that write into existing media fields.

**Tech Stack:** Laravel 13, PHP 8.4+, PostgreSQL 17/pgvector, React 19/Inertia 3, Academy MCP, Academy AI providers, Redis queues.

**Spec:** `docs/superpowers/specs/2026-09-01-m13-6-canonical-course-domain-design.md`

## Global Constraints

- No LMS rewrite and no LessonBlock subsystem.
- Preserve M10 access-rank semantics and M11 Page Builder ownership.
- Proposal -> Apply remains mandatory for Academy AI course generation.
- Tower mutations only through Academy MCP.
- No real secrets or dependency directories in the release ZIP.

---

### Task 1: M13.6 RED contract
**Files:** Create `tests/Contract/M13_6CanonicalCourseDomainContractTest.php`
- [ ] Encode required migrations, new LessonType, AI schema/apply persistence, granular MCP tools, media provider contracts, reindexing and CI inclusion.
- [ ] Run with `php tests/Contract/M13_6CanonicalCourseDomainContractTest.php` and observe RED.

### Task 2: Canonical course schema
**Files:** Create one M13.6 migration; modify Course/Module/Lesson models and LessonType.
- [ ] Add backward-compatible course positioning/media fields.
- [ ] Add module description/objectives.
- [ ] Add `LessonType::Text`.
- [ ] Run contract until schema portion is GREEN.

### Task 3: Academy AI blueprint persistence
**Files:** Modify `GenerateCourseCapability`, `ApplyAcademyAiRunAction`, curriculum/lesson apply defaults.
- [ ] Extend structured schema with level/language/positioning.
- [ ] Persist generated positioning fields.
- [ ] Materialize text-only lessons with `type=text`.
- [ ] Run contract.

### Task 4: Granular MCP course CRUD
**Files:** Modify `AcademyMcpToolRegistry` and `AcademyMcpToolExecutor`.
- [ ] Add category/course/module/lesson read tools.
- [ ] Add module/lesson update/delete/reorder.
- [ ] Add unpublish/archive.
- [ ] Expand course/module/lesson schemas with canonical variables.
- [ ] Queue knowledge reindex after curriculum mutations.
- [ ] Run contract.

### Task 5: Offers and Page Builder MCP
**Files:** Modify MCP registry/executor.
- [ ] Add offers.list/update/deactivate.
- [ ] Add pages.list/create using AcademyPage and PageBlockRegistry.
- [ ] Preserve CourseOffer and AcademyPage as sources of truth.
- [ ] Run contract.

### Task 6: Image and TTS provider layer
**Files:** Create provider contracts/adapters/manager/services; update `config/academy-ai.php` and env examples.
- [ ] Add disabled + OpenAI image provider.
- [ ] Add disabled + OpenAI speech provider.
- [ ] Generate/store cover and thumbnail.
- [ ] Generate/store lesson narration into `audio_url`.
- [ ] Add MCP media tools.
- [ ] Run contract.

### Task 7: UI compatibility and canonical variables
**Files:** Modify Trainer Course requests/resources/forms only where existing patterns allow safely.
- [ ] Expose target audience, level, language and thumbnail in Course Builder/API props.
- [ ] Ensure text lesson type is selectable/renderable.
- [ ] Avoid redesigning Creator Studio.

### Task 8: Regression tests + release gate
**Files:** Add `CanonicalCourseDomainTest.php`, release docs, CI contract line, version files.
- [ ] Add Laravel tests for persistence and MCP ownership/CRUD.
- [ ] Run all source contracts and syntax/parse/YAML/hygiene gates.
- [ ] Probe Pest/Vite/Docker and report PASS/BLOCKED honestly.
- [ ] Package cumulative v1.1.7 ZIP + SHA-256.
- [ ] Extract final ZIP into a fresh directory and rerun the available gate.
