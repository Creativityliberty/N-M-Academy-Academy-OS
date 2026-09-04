# M13.5 Durable Memory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add durable operational/conversational memory to Mission Tower without replaying unlimited chat history.

**Architecture:** Store versioned Tower memories in PostgreSQL, optionally embed them with the existing Tutor embedding provider, retrieve a small relevant set for each chat turn, and maintain a rolling thread summary. Expose an inspectable Memory Center while keeping all execution authority in MCP/approvals/Evidence.

**Tech Stack:** Laravel 13, Eloquent, PostgreSQL 17 + pgvector, React 19/Inertia 3, existing Academy AI and Tutor embedding providers.

**Spec:** `docs/superpowers/specs/2026-08-31-m13-5-durable-memory-design.md`

## Global Constraints

- No new container or external datastore.
- No execution or authorization path may be introduced outside Academy MCP / Mission Runner / ApprovalDecisionService.
- Never persist provider keys, MCP tokens, Stripe secrets, approval requestState or raw student PII as memory.
- Memory context must remain bounded.
- Existing M07→M13.4 contracts must remain green.

---

### Task 1: Memory persistence and safety

**Files:**
- Create: `database/migrations/2026_08_31_234000_create_tower_memories_table.php`
- Create: `database/migrations/2026_08_31_234010_add_summary_to_tower_chat_threads.php`
- Create: `app/MissionTower/Models/TowerMemory.php`
- Create: `app/MissionTower/Services/TowerMemoryPolicy.php`
- Create: `tests/Contract/M13_5DurableMemoryContractTest.php`

**Interfaces:**
- Produces: `TowerMemory`, `TowerMemoryPolicy::sanitizeCandidate(array): ?array`.

- [ ] Write the M13.5 source contract and verify it fails because memory files do not exist.
- [ ] Add migrations/model/policy with versioned memories, pgvector-compatible embedding and secret rejection.
- [ ] Re-run the source contract until persistence/safety assertions pass.

### Task 2: Memory store and retrieval

**Files:**
- Create: `app/MissionTower/Services/TowerMemoryStore.php`
- Create: `app/MissionTower/Services/TowerMemoryRetriever.php`
- Modify: `app/MissionTower/Services/TowerChatContextBuilder.php`

**Interfaces:**
- Consumes: `EmbeddingProviderManager`.
- Produces: `rememberCandidate`, `rememberMissionResult`, `retrieve`.

- [ ] Extend the contract with store/retriever/context requirements and observe RED.
- [ ] Implement versioned upsert, optional embeddings, pinned/vector/lexical retrieval and bounded context.
- [ ] Verify GREEN.

### Task 3: Router capture and rolling thread summaries

**Files:**
- Create: `app/MissionTower/Services/TowerThreadSummarizer.php`
- Modify: `app/MissionTower/Services/TowerChatRouter.php`
- Modify: `app/MissionTower/Services/TowerChatService.php`
- Modify: `app/MissionTower/Models/TowerChatThread.php`

**Interfaces:**
- Router produces `memory_candidates` together with intent/action routing.
- Summarizer produces bounded `summary` and `summary_message_id`.

- [ ] Extend the contract for candidate schema, summary use and mission-result memory; observe RED.
- [ ] Implement router candidate extraction, best-effort capture and periodic summaries.
- [ ] Verify GREEN and preserve M13.4 governed approval flow.

### Task 4: Memory Center

**Files:**
- Create: `app/MissionTower/Http/Controllers/MemoryController.php`
- Create: `resources/js/mission-tower/pages/memory.tsx`
- Modify: `routes/mission-tower.php`
- Modify: `resources/js/mission-tower/components/tower-nav.tsx`
- Modify: `app/MissionTower/Services/TowerAccess.php`

**Interfaces:**
- Produces: `/tower/memory`, pin/unpin and forget actions scoped to owner.

- [ ] Extend the contract for routes/UI/owner scoping; observe RED.
- [ ] Implement controller, access query, page and navigation.
- [ ] Verify GREEN.

### Task 5: Feature tests, configuration and release docs

**Files:**
- Create: `tests/Feature/MissionTower/MissionTowerMemoryTest.php`
- Modify: `config/mission-tower.php`
- Modify: `.env.example`
- Modify: `.env.coolify.example`
- Create: `docs/releases/M13.5-DURABLE-MEMORY.md`
- Create: `docs/releases/M13.5-VERIFICATION.md`
- Modify: `README.md`, `PACKAGE_VERSION`, `VERSION`, `package.json`

**Interfaces:**
- Produces: release v1.1.5 with documented environment knobs and CI feature tests.

- [ ] Add feature tests for supersession, secret rejection, retrieval, capture, summaries and owner-scoped Memory Center.
- [ ] Add config/env/docs/version changes.
- [ ] Run source contracts, PHP syntax, formatter/linter/typecheck and topology/hygiene gates.
- [ ] Package ZIP + SHA-256, extract into a fresh directory and repeat release gates.
