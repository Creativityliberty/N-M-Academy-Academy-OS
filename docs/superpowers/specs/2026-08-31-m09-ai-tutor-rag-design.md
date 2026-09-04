# M09 — AI Tutor + RAG Design

## Goal

Deliver an access-aware student tutor grounded in Academy course knowledge, with source citations, quizzes, study plans, creator controls, quotas, OpenAI/DeepSeek LLM support, and pgvector-backed retrieval with lexical fallback.

## Constraints

- Build on M08; do not remove MCP, Academy AI, Community, Events, Student Experience, or Creator Studio.
- No new application service/container beyond replacing Postgres with the official pgvector Postgres image.
- Tutor answers must not retrieve content from courses the student is not enrolled in.
- No PII is required in tutor prompts.
- Grounded mode must refuse unsupported answers when configured to stay inside Academy content.
- DeepSeek and OpenAI remain supported as tutor LLMs.
- Embeddings are optional; OpenAI embeddings are supported first, with lexical fallback when embeddings are disabled/unavailable.
- All releases remain Coolify-first and single-tenant.

## Capabilities

`tutor.ask`, `tutor.explain`, `tutor.summarize`, `tutor.quiz`, `tutor.study_plan`.
