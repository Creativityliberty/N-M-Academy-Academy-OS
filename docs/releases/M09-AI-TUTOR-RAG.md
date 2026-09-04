# M09 — AI Tutor + RAG

M09 adds a private, access-aware AI Tutor on top of the cumulative M08 MCP Gateway release.

## Student capabilities

- `tutor.ask`
- `tutor.explain`
- `tutor.summarize`
- `tutor.quiz`
- `tutor.study_plan`

The Tutor lives directly in the Student Course Player. Answers include real retrieved Academy sources; when the configured policy forbids outside knowledge and no relevant source exists, the Tutor refuses to invent course material.

## Knowledge architecture

Lesson text, transcripts and PDF text are normalized into `academy_knowledge_documents` and deterministic `academy_knowledge_chunks`. Standard Liberty PDFs hosted on the configured ImageKit endpoint are downloaded only from that trusted endpoint, size-limited, converted with `pdftotext`, and discarded after extraction. Local `/storage/...` PDFs remain supported.

PostgreSQL uses pgvector cosine search when OpenAI embeddings are configured. Retrieval applies a configurable minimum vector similarity before accepting Ask/Explain matches. If embeddings are disabled or temporarily unavailable, retrieval falls back to deterministic lexical ranking. Summarize, Quiz and Study Plan can deliberately use authorized lesson/course chunks even when no exact keyword match exists.

DeepSeek can therefore be used as the Tutor LLM with lexical retrieval even when no OpenAI embedding key is configured.

## Privacy and authorization

Retrieval requires a real enrollment before any vector or lexical search. Tutor prompts do not require student name, email, billing, Stripe, or other-student data. Threads and quizzes are scoped to the authenticated student.

Tutor settings are stored **per trainer**, not globally. One trainer cannot change another trainer's allowed Tutor courses.

## Creator controls

`/trainer/ai-tutor` controls:

- enabled state;
- LLM provider (`inherit`, OpenAI or DeepSeek);
- standard and premium model;
- personality;
- outside-content policy;
- per-student daily limit;
- trainer-wide estimated monthly Tutor budget;
- allowed courses;
- knowledge status and manual reindex.

The premium model is used for heavier Tutor operations such as quizzes and study plans when configured.

## Student MCP subset

M09 adds four role-restricted Student MCP tools:

- `learning.progress.get`
- `course.knowledge.search`
- `lesson.get`
- `tutor.quiz.generate`

Student tokens cannot list or call Creator MCP tools such as `sales.summary` or `courses.publish`. Creator tokens likewise do not gain the Student-only Tutor tools by accident.

## Operations

On first deployment from a pre-M09 release, `docker/start.sh` automatically queues only courses that do not yet have indexed knowledge:

```bash
php artisan academy:knowledge-reindex --missing
```

Reindex all course knowledge manually:

```bash
php artisan academy:knowledge-reindex
```

Synchronous one-course rebuild:

```bash
php artisan academy:knowledge-reindex --course=42 --sync
```

## Coolify

The service topology remains app + PostgreSQL + Redis. PostgreSQL changes from the base PostgreSQL 17 image to the pgvector PostgreSQL 17 image; the existing PostgreSQL data volume remains on the same major version. `poppler-utils` is included in the production app image for PDF text extraction.

No vector database container, separate Tutor service, or additional Node service is introduced.
