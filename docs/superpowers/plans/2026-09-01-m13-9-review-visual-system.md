# M13.9 Course Review + Visual System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Gemini/Nano Banana visual generation plus a human review-and-publish center on top of the existing One-Brief course flow.

**Architecture:** Extend the existing provider interfaces rather than replacing them, store only non-secret model preferences in DB, compile course/brand-aware visual prompts, persist media-generation traces, and represent review changes as pending proposals that mutate existing Course/Module/Lesson/Page domains only after acceptance. Publishing continues through `PublishCourseAction`.

**Tech Stack:** Laravel 13/PHP 8.4, React 19/Inertia 3, PostgreSQL, existing HTTP client, existing Course/AI/M10/M11/M13.7 systems.

**Spec:** `docs/superpowers/specs/2026-09-01-m13-9-review-visual-system-design.md`

## Global Constraints
- Do not persist or package Gemini/OpenAI/DeepSeek API keys.
- Keep Tower M13.8 and its shell/sidebar/routes unchanged.
- Keep CourseOffer as commercial source of truth and PublishCourseAction as publication boundary.
- No new Composer/npm dependency.
- Default Gemini image model is `gemini-3.1-flash-lite-image`; Flash Lite image size is always `1K`.
- Course creation remains draft-only until explicit review-center publication.

---

### Task 1: RED contract and schema
**Files:**
- Create: `tests/Contract/M13_9CourseReviewVisualSystemContractTest.php`
- Create: `database/migrations/2026_09_01_010000_create_academy_ai_settings_table.php`
- Create: `database/migrations/2026_09_01_010100_create_course_media_generations_table.php`
- Create: `database/migrations/2026_09_01_010200_create_course_review_proposals_table.php`
- Create: `app/Models/AcademyAiSetting.php`
- Create: `app/Models/CourseMediaGeneration.php`
- Create: `app/Models/CourseReviewProposal.php`

**Interfaces:**
- Produces singleton AI settings model and proposal/media trace persistence used by all later tasks.

- [ ] Write contract assertions for Gemini provider, prompt compiler, settings route/page, review route/page, proposal service, version 1.2.0 and CI inclusion.
- [ ] Run contract and observe RED.
- [ ] Add migrations/models with casts/relations and uniqueness constraints.
- [ ] Run PHP syntax gate.

### Task 2: Runtime provider settings and Gemini catalog
**Files:**
- Create: `app/AI/AcademyAiSettingsRepository.php`
- Create: `app/AI/ImageModelCatalog.php`
- Create: `app/AI/GeminiModelDiscoveryService.php`
- Modify: `config/academy-ai.php`
- Modify: `.env.example`
- Modify: `.env.coolify.example`
- Modify: `app/AI/AiProviderManager.php`
- Modify: `app/AI/MediaProviderManager.php`

**Interfaces:**
- Produces `AcademyAiSettingsRepository::get()` merged settings and image catalog metadata.

- [ ] Add failing feature tests for config fallback and DB override.
- [ ] Implement repository and curated model catalog.
- [ ] Add Gemini config (`GEMINI_API_KEY`, base URL, image model).
- [ ] Wire provider managers to runtime settings while preserving env fallback.
- [ ] Implement optional Gemini model discovery with curated filtering.

### Task 3: Gemini image provider
**Files:**
- Create: `app/AI/Providers/GeminiImageGenerationProvider.php`
- Test: `tests/Feature/AI/GeminiImageGenerationProviderTest.php`

**Interfaces:**
- Implements existing `ImageGenerationProvider` contract.

- [ ] Write RED test asserting `POST /v1beta/interactions`, `x-goog-api-key`, model, `response_format`, aspect ratio and 1K coercion.
- [ ] Implement adapter and base64 extraction from `output_image.data` with defensive fallbacks.
- [ ] Run syntax/contract test.

### Task 4: Visual Prompt Compiler and media candidates
**Files:**
- Create: `app/AI/VisualPromptCompiler.php`
- Modify: `app/Services/Courses/CourseMediaGenerationService.php`
- Modify: `app/Services/Courses/CourseCreationEngine.php`
- Test: `tests/Feature/AI/VisualPromptCompilerTest.php`

**Interfaces:**
- Produces `compileCourseImage(Course $course, string $purpose, ?string $direction): string`.
- Adds candidate methods that generate files/traces without mutating Course/Lesson.

- [ ] Write RED prompt-structure test.
- [ ] Implement course/brand/purpose prompt compiler.
- [ ] Replace M13.7 private ad-hoc image prompt with compiler usage.
- [ ] Add `generateCourseImageCandidate()` and `generateLessonAudioCandidate()` plus trace persistence.
- [ ] Keep existing direct generation methods as thin generate+apply wrappers.

### Task 5: AI Providers Settings UI
**Files:**
- Create: `app/Http/Controllers/Settings/AiProvidersController.php`
- Create: `resources/js/pages/settings/ai-providers.tsx`
- Modify: `routes/settings.php`
- Modify: `resources/js/layouts/settings/layout.tsx`

**Interfaces:**
- GET returns current merged settings, curated models and secret-configured booleans.
- PATCH stores non-secret preferences only.
- POST discover returns filtered Gemini image models.

- [ ] Write ownership/validation feature test.
- [ ] Implement controller validation allowlists.
- [ ] Add settings page and sidebar item without changing other navigation.
- [ ] Ensure no secret value appears in Inertia props.

### Task 6: Focused review capabilities
**Files:**
- Create: `app/AI/Capabilities/RewriteCoursePositioningCapability.php`
- Create: `app/AI/Capabilities/RewriteModuleCapability.php`
- Modify: `app/AI/AcademyAiCapabilityRegistry.php`

**Interfaces:**
- `course.positioning.rewrite` returns positioning/target_audience/level/language proposal.
- `module.rewrite` returns module title/description/objectives proposal.
- Neither is applied by `ApplyAcademyAiRunAction`; ReviewProposalService owns acceptance.

- [ ] Write RED capability-schema tests.
- [ ] Implement strict structured-output capabilities with ownership checks.
- [ ] Register metadata.

### Task 7: Review proposal service
**Files:**
- Create: `app/Services/Courses/CourseReviewProposalService.php`
- Test: `tests/Feature/Trainer/CourseReviewProposalTest.php`

**Interfaces:**
- `propose(User, CourseCreationRun, targetType, targetId, instruction): CourseReviewProposal`
- `accept(User, CourseReviewProposal): CourseReviewProposal`
- `reject(User, CourseReviewProposal): CourseReviewProposal`

- [ ] Write RED tests for no-mutation-before-accept, ownership, single-pending-target, reject, RAG reindex.
- [ ] Implement positioning/module/lesson/page/media/audio proposal creation using existing AI/media services.
- [ ] Implement atomic accept/reject transitions and mutations.
- [ ] Queue `IndexCourseKnowledge` for accepted content changes.

### Task 8: Course Review Center and publish gate
**Files:**
- Create: `app/Http/Controllers/Trainer/CourseReviewController.php`
- Create: `resources/js/pages/trainer/academy-ai/course-review.tsx`
- Modify: `routes/trainer.php`
- Modify: `app/Http/Controllers/Trainer/CourseCreationController.php`
- Modify: `resources/js/pages/trainer/academy-ai/course-creation.tsx`
- Test: `tests/Feature/Trainer/CourseReviewPublishTest.php`

**Interfaces:**
- Review page serializes real course/module/lesson/media/offer/page state and proposals.
- Proposal endpoints create/accept/reject.
- Publish endpoint calls canonical `PublishCourseAction`, then publishes linked page only after course success.

- [ ] Write RED route/ownership/publish-gate tests.
- [ ] Implement review serializer and publish-readiness checks.
- [ ] Build review UI with section cards, before/after diff panels, accept/reject and regenerate controls.
- [ ] Link M13.7 completed run to Review Center.
- [ ] Keep course/page draft until explicit publish.

### Task 9: Release, CI and extraction gate
**Files:**
- Modify: `VERSION`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `config/academy.php`
- Modify: `.github/workflows/tests.yml`
- Create: `docs/releases/M13.9-COURSE-REVIEW-VISUAL-SYSTEM.md`
- Create: `docs/releases/M13.9-VERIFICATION.md`

**Interfaces:**
- Produces cumulative v1.2.0 ZIP + SHA-256.

- [ ] Set version 1.2.0 everywhere.
- [ ] Add M13.9 contract/feature tests to CI.
- [ ] Run all available M07→M13.9 source contracts, PHP syntax, TS/TSX parse, YAML/JSON, migration order, hygiene and secret scan.
- [ ] Record dependency-backed probes as PASS only if actually executed; otherwise BLOCKED with reason.
- [ ] Build control ZIP, fresh-extract and rerun available gate.
- [ ] Write verification evidence, rebuild final ZIP, compute SHA-256, fresh-extract again and rerun final gate.
