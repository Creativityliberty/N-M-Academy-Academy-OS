# M13.9 Course Review + Visual System Design

## Goal
Ship a single cumulative milestone that adds Gemini/Nano Banana as the default course-image provider and introduces a review-before-publish center for the draft produced by One-Brief-to-Course.

## Hard constraints
- Keep M13.8 Mission Tower shell/sidebar/routes and rich chat unchanged.
- Keep the existing Course/Module/Lesson, CourseOffer, AcademyPage, MCP, RAG, approval and evidence architectures.
- Do not create a second course model, second pricing system, second page builder, or second publication path.
- Gemini API credentials come only from `GEMINI_API_KEY` env/Coolify secret. Never persist or package API keys.
- The API key exposed in chat must not be reused.
- Image provider defaults to Gemini when a Gemini key is configured; `gemini-3.1-flash-lite-image` is the default image model.
- Curated Gemini image choices: `gemini-3.1-flash-lite-image`, `gemini-3.1-flash-image`, `gemini-3-pro-image`.
- Model discovery may enrich the curated list but must not replace it with an unfiltered provider catalog.
- Nano Banana 2 Lite requests remain 1K; cover uses 16:9 and thumbnail 1:1.
- One-Brief media generation must keep using `CourseMediaGenerationService` / `ImageGenerationProvider`.
- No automatic course publication from One-Brief. Publishing happens only in Review Center after an explicit human action.
- `PublishCourseAction` remains the canonical course publication action and therefore the Stripe provisioning boundary.

## Visual system
### Runtime provider settings
Persist non-secret Academy-wide AI runtime preferences in a singleton `academy_ai_settings` row:
- text_provider / text_model
- image_provider / image_model / image_size / image_prompt_preset
- respect_branding / avoid_embedded_text
- tts_provider / tts_model
Secrets remain config/env only.

`AcademyAiSettingsRepository` merges DB preferences over config defaults. `AiProviderManager` and `MediaProviderManager` read from this repository.

### Gemini adapter
`GeminiImageGenerationProvider` uses the Gemini Interactions API and returns binary image data through the existing `ImageGenerationProvider` contract.
- endpoint: `/v1beta/interactions`
- auth header: `x-goog-api-key`
- `response_format.type=image`
- maps cover to `aspect_ratio=16:9`
- maps thumbnail to `aspect_ratio=1:1`
- image size uses runtime setting, coerced to `1K` for Flash Lite

### Visual prompt compiler
`VisualPromptCompiler` creates stable, purpose-specific prompts from:
- Course title, target audience, level, language
- positioning main_problem / desired_transformation / main_promise / unique_angle
- Academy brand/theme colors/preset
- optional user direction
- purpose-specific art direction and composition rules
- output rules and avoidance rules

It must not ask the model to invent logos or rely on embedded text by default.

### Generation trace
Create `course_media_generations` records for generated cover/thumbnail candidates and applied images:
- course_id, user_id, purpose
- provider, model
- compiled_prompt, user_prompt
- aspect_ratio, image_size
- asset_url
- status: candidate/applied/rejected
- applied_at/rejected_at

This is intentionally smaller than a general DAM.

## Review Center
### Route and ownership
Add `/trainer/academy-ai/course-creation/{run}/review` for completed or review-stage One-Brief runs owned by the trainer.

### Review sections
Display real data from existing domains:
- Positioning: target audience, level, language, positioning
- Modules + lessons + lesson content
- Cover + thumbnail and generation trace
- Narrations presence/coverage
- CourseOffer
- AcademyPage landing draft

### Proposal model
Create `course_review_proposals` for reviewable AI changes:
- course_creation_run_id, user_id, course_id
- target_type: course_positioning/module/lesson/cover/thumbnail/landing/audio
- target_id
- academy_ai_run_id nullable
- media_generation_id nullable
- instruction
- before_payload, after_payload
- status: pending/accepted/rejected
- accepted_at/rejected_at

Only one pending proposal per exact target may exist at a time.

### Regeneration
- Positioning: new focused `course.positioning.rewrite` capability; proposal only, no mutation until accepted.
- Module: new focused `module.rewrite` capability; proposal only.
- Lesson text: reuse `lesson.rewrite`; proposal only.
- Cover/thumbnail: generate a candidate via Gemini/OpenAI without mutating the Course; accepting swaps the course field and marks generation applied.
- Landing: reuse `page.optimize`; do not Apply until proposal acceptance.
- Narration: generate an audio candidate without mutating `audio_url`; accepting swaps the lesson audio URL.
- Offer: review display only; edits continue through M10/`offers.update` governance rather than AI auto-edit.

### Accept/reject
`CourseReviewProposalService` owns all proposal state transitions and target mutations. Accepted text/content changes queue `IndexCourseKnowledge` after commit. Reject never mutates target data.

### Publish gate
Review page publishes only when:
- course exists and belongs to trainer
- One-Brief run has reached review/completed state
- no pending proposal remains
- course has at least one module and lesson
- active/default offer exists
- landing page, when present, has at least one visible section

Explicit Publish action:
1. call canonical `PublishCourseAction`
2. if linked landing exists, publish it after course succeeds
3. preserve current Stripe behavior inside `PublishCourseAction`
4. redirect to review page with success

No automatic publish is added to One-Brief.

## Settings UX
Add `Settings > AI Providers` without replacing existing Settings navigation.
- provider-specific model lists
- configured-secret indicator, never the secret value
- image provider defaults to Gemini when available
- curated image-model descriptions: Lite / general / Pro
- optional “Refresh Gemini models” action using Models API; only image-capable curated matches are shown

## Testing
- Contract test M13.9 fails before implementation and covers required files/routes/config/invariants.
- Feature test Gemini request shape and 1K coercion for Flash Lite.
- Feature test prompt compiler includes course/brand/purpose rules.
- Feature test review proposal accept/reject ownership and no mutation before accept.
- Feature test image candidate does not mutate course until accepted.
- Feature test publish gate calls canonical publish only after no pending proposals.
- Existing M07→M13.8 contracts remain green.
