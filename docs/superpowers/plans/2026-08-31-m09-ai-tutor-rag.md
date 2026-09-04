# M09 AI Tutor + RAG Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build an access-aware, grounded student AI Tutor with pgvector knowledge indexing, quizzes, study plans, creator controls, quotas, and release gates.

**Architecture:** Course content is normalized into knowledge documents/chunks, embedded when possible, and searched through an enrollment-aware retriever. Tutor capabilities share the existing provider architecture, write audit rows, and render inside the M03 Course Player. Creator controls live in a dedicated Tutor settings page.

**Tech Stack:** Laravel 13, PHP 8.4, React 19, Inertia 3, PostgreSQL 17 + pgvector, Redis queues, OpenAI/DeepSeek Responses API.

**Spec:** `docs/superpowers/specs/2026-08-31-m09-ai-tutor-rag-design.md`

## Global Constraints

- Preserve M01–M08 behavior.
- Add no new app container.
- Enforce enrollment before retrieval.
- Support lexical fallback without embeddings.
- No PII in prompts.
- Every externally generated answer is audited.
- Package v0.9.0 with SHA-256 and extracted-release retest.

---

### Task 1: Knowledge Store + pgvector

**Files:** migration, knowledge models, `docker-compose.coolify.yml`.

- [x] RED: M09 contract requires knowledge models and pgvector image.
- [x] GREEN: add documents/chunks schema, vector extension and HNSW index for PostgreSQL, text fallback for SQLite.
- [x] Verify PHP syntax and contract progression.

### Task 2: Indexing Pipeline

**Files:** `KnowledgeIndexer`, chunker, PDF extractor, `IndexCourseKnowledge` job.

- [x] Normalize lesson text and local PDF text when available.
- [x] Chunk deterministically with checksums.
- [x] Embed through provider abstraction when configured.
- [x] Queue reindex after course updates and expose manual reindex.

### Task 3: Secure Retrieval

**Files:** `KnowledgeRetriever`, embedding manager.

- [x] Require enrollment.
- [x] Search pgvector cosine similarity when available.
- [x] Fall back to lexical ranking.
- [x] Return only authorized source metadata and chunks.

### Task 4: Tutor Core

**Files:** tutor models, settings, provider manager, `AcademyTutor`.

- [x] Add Ask / Explain / Summarize / Quiz / Study Plan.
- [x] Add source-grounding policy and no-result behavior.
- [x] Add threads/messages/runs and estimated usage/cost.
- [x] Enforce daily and monthly limits.

### Task 5: Student + Creator UX

**Files:** Tutor controllers/routes, Course Player, trainer Tutor settings page.

- [x] Add Tutor panel to Course Player.
- [x] Add quiz submission/local scoring.
- [x] Add creator enable/provider/model/personality/course access/quotas settings.
- [x] Add knowledge status and manual reindex.

### Task 6: Verification + Release

**Files:** tests, docs, README/package version.

- [x] Contract PASS.
- [x] PHP syntax / Prettier / ESLint / TypeScript classification.
- [x] Coolify pgvector/scheduler/queue structure.
- [x] Probe Pest/Vite separately.
- [x] Build ZIP + SHA-256.
- [x] Extract ZIP into fresh directory and rerun source gate.
