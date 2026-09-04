# M13.6 Canonical Course Domain + AI/Tower CRUD Design

## Goal

Make course creation the primary Academy OS workflow: from a natural-language idea to a structured draft course whose positioning, curriculum, lessons, media, offers and landing page can be edited independently through the existing UI, Academy AI and governed MCP/Tower path.

## Constraints

- Extend the existing `Course -> Module -> Lesson` domain; do not rewrite the LMS.
- Preserve `CourseOffer.access_rank -> Enrollment.access_rank -> Module.minimum_access_rank`.
- Preserve Proposal -> Review -> Apply for Academy AI course/page generation.
- Tower must use Academy MCP capabilities; Tower must not query Academy tables directly for course mutations.
- Keep lessons simple in M13.6: `text`, `video_url`, `audio`, `pdf`. No LessonBlock subsystem.
- Reuse `Course.image` as the course cover and add one dedicated `thumbnail` slot.
- Reuse existing lesson `audio_url` / `pdf_url` / `video_url`; no generic Asset subsystem yet.
- Reuse M10 CourseOffer as the canonical commerce model; `Course.price` remains compatibility-only.
- Reuse M11 AcademyPage for landing pages; no second CMS.
- Media generation is provider-neutral at the Academy service boundary and may fail clearly when unconfigured.
- No multi-agent runtime work in this milestone.

## Canonical Domain Additions

### Course

Existing fields remain. Add:

- `target_audience` text nullable
- `level` string: `beginner|intermediate|advanced|all_levels`
- `language` string (BCP-47-ish short locale, default `fr`)
- `positioning` JSON nullable with allowed keys `main_problem`, `desired_transformation`, `main_promise`, `unique_angle`
- `thumbnail` string nullable

Existing `image` is explicitly the cover image.

### Module

Add:

- `description` text nullable
- `objectives` JSON nullable

Retain `minimum_access_rank` as the only tier gate in M13.6.

### Lesson

Add `text` to `LessonType`. Existing text lives in `content`; existing `transcript`, media URLs and preview flag remain canonical.

## AI Blueprint

`course.generate` gains `level`, `language`, and `positioning`, and its Apply path persists them. AI-created text-only lessons use `type=text` instead of pretending to be video lessons.

## MCP / Tower CRUD

Add granular tools instead of an all-purpose blob:

### Read

- `categories.list`
- `courses.get`
- `modules.list`
- `lessons.list`
- `offers.list`
- `pages.list`

### Course lifecycle / identity

- expand `courses.create`
- expand `courses.update`
- `courses.unpublish`
- `courses.archive`

### Curriculum

- `modules.create` expanded with description/objectives/access rank
- `modules.update`
- `modules.delete`
- `modules.reorder`
- `lessons.create` expanded with type/transcript/media URLs
- `lessons.update` expanded likewise
- `lessons.delete`
- `lessons.reorder`

### Commerce

- keep `offers.create`
- `offers.update`
- `offers.deactivate`

### Landing

- `pages.create` uses the existing M11 block registry and stores an AcademyPage draft.

### Media AI

- `course.cover.generate`
- `course.thumbnail.generate`
- `lesson.audio.generate`

These are WRITE/open-world tools because they invoke an external provider and persist generated files.

## Media Generation

Introduce independent provider contracts:

- `ImageGenerationProvider`
- `SpeechGenerationProvider`

M13.6 ships OpenAI adapters plus disabled adapters. Text generation remains independently selectable between OpenAI and DeepSeek. This allows DeepSeek for course reasoning while OpenAI handles image/TTS.

Default configuration:

- `ACADEMY_IMAGE_PROVIDER=openai|disabled`
- `OPENAI_IMAGE_MODEL=gpt-image-2`
- `ACADEMY_TTS_PROVIDER=openai|disabled`
- `OPENAI_TTS_MODEL=gpt-4o-mini-tts`
- `OPENAI_TTS_VOICE=alloy`

Generated media is stored under the existing public Academy storage disk and attached to the existing domain fields.

## Mutation Side Effects

- lesson create/update/delete/reorder queues `IndexCourseKnowledge` after commit.
- module create/update/delete/reorder also queues course re-indexing when curriculum context changes.
- publish/unpublish/archive continue to use the centralized lifecycle actions from M13.5.1.

## Compatibility

- Existing courses remain valid because all new DB fields are nullable/defaulted.
- Existing `video_url|audio|pdf` lessons remain valid.
- Existing Course Builder and student player continue to render old records.
- `Course.price` is not removed in this milestone.

## Verification

Required available gates:

- M07 -> M13.6 source contracts
- all PHP syntax
- TS/TSX parse gate
- YAML parse gate
- migration-order scan
- secret/font/dependency-dir scan
- ZIP integrity + SHA-256
- fresh extraction retest

Dependency-backed gates remain explicit PASS/BLOCKED based on actual runtime availability.
