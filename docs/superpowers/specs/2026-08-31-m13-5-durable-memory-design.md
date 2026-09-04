# M13.5 — Durable Memory Design

## Goal

Give Mission Tower a durable, inspectable memory layer so Tower can reuse stable decisions, preferences, constraints, goals and mission outcomes across conversations without replaying the full chat transcript to the AI provider.

## Boundaries

- Chat history remains an audit transcript; durable memory is a separate structured store.
- Memory is scoped to the authenticated Tower owner in the current Academy instance.
- Memory never bypasses Academy MCP, RBAC, approvals or Evidence.
- Current/volatile Academy facts still come from Academy MCP or Observatory, not memory.
- Secrets, approval requestState, provider credentials and raw student PII must not be persisted as memories.
- No new container or external database is introduced. PostgreSQL/pgvector already shipped by M09 is reused when embeddings are configured; deterministic lexical retrieval is the fallback.

## Data model

`tower_memories` stores immutable memory versions with:

- owner, optional thread/mission/run/source-message links;
- stable `memory_key` used to supersede an older active value;
- category: `preference`, `decision`, `goal`, `constraint`, `result`, `context`;
- scope: `academy` or `thread`;
- status: `active`, `superseded`, `forgotten`;
- content, importance (1–5), pinned flag;
- source type, metadata, optional expiry;
- access counters and optional 1536-dimension embedding.

When a new value arrives for the same key, the previous active row is marked `superseded`; exact duplicates are refreshed rather than duplicated. This preserves history while keeping retrieval deterministic.

`tower_chat_threads` gains a bounded rolling summary and the message id through which the summary is valid.

## Capture

The existing Tower Chat router already makes one structured AI call per user turn. M13.5 extends that response with up to five `memory_candidates`, avoiding a second extraction call. The router is instructed to capture only durable operational information explicitly stated or clearly decided in the conversation.

Completed governed missions are stored deterministically as `result` memories linked to mission/run/evidence. Failed/cancelled runs are not promoted to durable result memory.

## Retrieval

Before routing a new message, `TowerMemoryRetriever` selects a bounded set of relevant active memories:

1. pinned memories first;
2. vector similarity when an embedding provider and PostgreSQL vector are available;
3. deterministic lexical/importance/recency scoring fallback.

The default context budget is eight memories. Retrieval marks access timestamps/counters but never mutates business state.

The router receives:

- rolling thread summary;
- last few unsummarized chat messages;
- relevant durable memories;
- existing Tower operational context (insights, approvals, recent missions).

This means provider context stays bounded even for long-lived threads.

## Rolling conversation summary

`TowerThreadSummarizer` periodically compresses older messages into a summary while leaving the recent message window verbatim. It merges the previous summary with only the next unsummarized batch. Summarization is best-effort and must never make chat unavailable.

## Memory Center

`/tower/memory` provides an inspectable Memory Center using the existing Academy/Tower design system. Owners can:

- view active/superseded/forgotten memories;
- filter by category/status;
- pin/unpin active memories;
- forget a memory.

Forgetting changes status; it does not rewrite historical chat/evidence.

## Safety

Memory candidates are rejected if they contain common secret material or unsupported categories/scopes. The extraction prompt explicitly forbids provider keys, MCP tokens, Stripe secrets, approval requestState and raw student PII. Current business metrics should not be stored unless they are the explicit outcome of a completed mission and useful as a historical result.

## Configuration

Defaults:

- `TOWER_MEMORY_ENABLED=true`
- `TOWER_MEMORY_MAX_CONTEXT=8`
- `TOWER_MEMORY_SEMANTIC=true`
- `TOWER_MEMORY_RETENTION_DAYS=365`
- `TOWER_MEMORY_THREAD_RETENTION_DAYS=30`
- `TOWER_CHAT_HISTORY_MESSAGES=8`
- `TOWER_CHAT_SUMMARY_TRIGGER_MESSAGES=16`
- `TOWER_CHAT_SUMMARY_BATCH_MESSAGES=16`
- `TOWER_CHAT_MAX_SUMMARY_LENGTH=6000`

## Release acceptance

- M07→M13.5 source contracts pass.
- M13.5 contract proves the model, migration, retrieval, capture, summary, UI/routes and config exist.
- PHP syntax passes.
- Tower frontend Prettier/ESLint pass.
- TypeScript introduces zero new non-Wayfinder diagnostics.
- Coolify topology remains app + PostgreSQL 17/pgvector + Redis.
- ZIP is integrity-tested, hashed, freshly extracted and re-gated.
