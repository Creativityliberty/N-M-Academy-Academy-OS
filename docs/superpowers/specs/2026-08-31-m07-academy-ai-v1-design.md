# M07 — Academy AI v1 Design

## Goal

Add the first creator-facing Academy AI layer without turning the platform into a multi-agent system. The AI must be provider-isolated, auditable, explicit before mutation, and structured so M08 can expose the same capabilities as governed MCP tools.

## Scope

M07 is trainer-facing only. It adds six capabilities:

- `academy.ask` — answer questions using aggregate academy context.
- `course.generate` — generate a full course blueprint including curriculum and lesson content.
- `curriculum.generate` — generate modules and lesson outlines for an existing course.
- `lessons.generate` — generate detailed lesson content for an existing module.
- `lesson.rewrite` — propose a rewritten lesson title/content.
- `students.analyze` — analyze aggregate learning progress without sending student PII.

Generated or rewritten content is stored in an `academy_ai_runs` audit record first. Database mutation happens only through an explicit Apply action by the trainer.

## Architecture

`AcademyAiRunner` is the single execution entry point. It resolves a named capability through `AcademyAiCapabilityRegistry`, resolves an `AiProvider` through `AiProviderManager`, creates an audit run, executes the capability, then stores provider/model/output/status.

Capabilities receive an `AiProvider` contract rather than a concrete vendor. M07 ships an OpenAI Responses API provider and a disabled provider. M08 can reuse the same registry as the MCP tool catalog.

## Provider contract

The provider exposes free-text and structured-output methods. OpenAI structured generation uses the Responses API `text.format` JSON Schema shape. No OpenAI SDK dependency is added; Laravel's existing HTTP client is used.

Runtime configuration:

- `ACADEMY_AI_PROVIDER=openai|disabled`
- `ACADEMY_AI_MODEL=gpt-5.6-terra`
- `ACADEMY_AI_BASE_URL=https://api.openai.com/v1`
- `ACADEMY_AI_TIMEOUT=90`
- `OPENAI_API_KEY=`

When no provider/key is configured, the UI remains available but generation endpoints fail with a clear configuration error. No fake AI output is shown.

## Audit model

`academy_ai_runs` stores:

- trainer/user id
- capability name
- mode (`ask`, `create`, `modify`, `analyze`)
- prompt
- structured input
- structured output
- provider/model
- status
- error
- applied timestamp

This table is the first evidence surface for future approvals and MCP receipts.

## Apply semantics

- `course.generate` → creates a new draft course with modules and lessons.
- `curriculum.generate` → appends generated modules/lesson outlines to the selected owned course.
- `lessons.generate` → appends generated lessons to the selected owned module.
- `lesson.rewrite` → updates the selected owned lesson's title/content.
- Read-only capabilities have no Apply action.

A run can only be applied by its owner and only once.

## Lesson content

M07 adds nullable `lessons.content` so AI-generated lesson copy has a first-class place in the domain. The trainer builder can edit it and the student player displays it. Locked preview lessons redact this field server-side together with media URLs.

## Privacy

`academy.ask` and `students.analyze` use aggregate context. Student names and emails are not included in AI prompts. Student analysis is based on counts and progress segments only.

## Safety / governance

M07 does not perform autonomous destructive or financial actions. AI-generated writes require a trainer's explicit Apply action. Publishing remains outside Academy AI. M08 adds stronger approval/evidence policy around tool execution.

## Coolify

No new service or container. AI configuration is environment-only. The app continues to use the existing `app + postgres + redis` topology.
