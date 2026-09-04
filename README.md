# NÜM Academy OS

AI-native private academy infrastructure built from the LibertySchool LMS core and progressively productized for white-label deployment on Coolify.

## M15.1 — Drip, Prérequis & Unlock Rules

NÜM Academy OS now has one canonical learning-access engine layered on top of the existing enrollment tier system. Trainers can sequence modules, lessons, assessments and assignments using enrollment delays, fixed dates, previous module/lesson completion, passed assessments and approved assignments. Multiple enabled rules on one target are combined with AND semantics and forward/circular prerequisite definitions are rejected by the authoring service.

The runtime deliberately separates **entitlement** from **current unlock state**: `Enrollment.access_rank → Module.minimum_access_rank` still defines what the student bought, while `LearningAccessService` decides what is available right now. Overall progress and certificate eligibility keep the full tier-entitled curriculum in scope, so future drip content cannot produce a false 100% or an early certificate. The Course Player, progress/notes, assessments, assignments, Tutor lesson scope, Tutor/RAG retrieval and student MCP tools all enforce the same server-side decision.

Course Studio now includes a dedicated **Drip & prérequis** workspace. Academy MCP/Tower exposes governed `learning.access.rules.*` CRUD over the same definition service, and Academy Factory/Coolify exposes `ACADEMY_FEATURE_DRIP` as a first-class Learning capability. Mission Tower remains French by default and keeps `thinking-orbs@^0.3.1`.

See `docs/releases/M15.1-LEARNING-ACCESS-DRIP.md`.

## M14.4 — Learning Experience + Factory Integration
## M14.4.1 — Runtime Launcher & Tower Provisioning Hardening

NÜM Academy OS can now be started locally as one stack without manually launching Laravel, SSR, workers or the scheduler. On macOS/Linux use:

```bash
./num-academy up
```

On Windows, double-click `num-academy.bat` for the interactive menu or run `num-academy.bat up`. The Runtime Launcher creates a gitignored `.env.num-academy`, generates `APP_KEY`, database/bootstrap credentials and a dedicated Tower MCP token, then starts the production Compose stack with the local port override. Useful commands are `up`, `down`, `restart`, `status`, `logs`, `doctor` and `open`.

The default local profile is **Academy Pro**, so `ACADEMY_FEATURE_MCP=true`, `ACADEMY_FEATURE_TOWER=true`, `TOWER_ENABLED=true` and `TOWER_ACADEMY_MCP_IN_PROCESS=true` stay coherent. The same rule is now enforced by Academy Factory: a Pro deployment gets the Tower runtime switch plus a transient `TOWER_ACADEMY_MCP_TOKEN`, and `academy:bootstrap-instance` materializes a bounded READ/WRITE MCP identity in the database. SENSITIVE tools such as course publication, refunds and certificate revocation are deliberately excluded from the automatically provisioned token.

`./num-academy doctor` verifies Docker/Compose, local secrets, Tower/MCP coherence and Compose parsing. External AI API keys remain opt-in; Tower can boot without them, but Chat/Compiler need a configured AI provider to produce model-backed responses.

Full setup: `docs/RUNTIME-LAUNCHER.md`.


M14 Learning Primitives are now integrated as first-class Academy capabilities instead of existing only in the master codebase. Student navigation exposes **Mes certificats**, the Course Player has a focused completion card with lesson/assessment/project evidence and governed Verify/PDF/Share actions, and Course Studio surfaces Quiz, Assignments and Completion workspaces according to the Academy feature profile. Academy Factory now separates visual templates from product capability profiles (`essential`, `creator`, `pro`), provisions Assessments/Assignments/Completion/Certificates/Tower explicitly, carries white-label certificate defaults into Coolify, and preserves the private `academy-assignments` volume. Disabling a learning capability also removes its student serialization and guarded routes rather than leaving a cosmetic-only toggle.

## M14.3 — Completion Rules + Certificates

NÜM Academy OS now has one canonical server-side completion engine built from the evidence already owned by the learning domain: completed accessible lessons, explicitly required M14.1 assessments passed, and explicitly required M14.2 assignments approved. Completion is tier-aware through `Enrollment.access_rank → Module.minimum_access_rank`, requires at least one real pedagogical criterion, and creates one immutable `CourseCompletion` evidence snapshot. When enabled, one idempotent certificate is issued with a public UUID verification code, snapshot identity/course/issuer fields, revocation support, and an on-demand dependency-free PDF. Tower/MCP can read/update completion policy and inspect/revoke certificates under governance, but it cannot forge a completion or directly issue a certificate.

## M14.2 — Assignment & Project Engine

NÜM Academy OS now includes durable trainer-authored assignments and projects with versioned student submissions, private file storage, human rubric review, AI-assisted assignment authoring through Proposal → Apply, One-Brief per-module generation, governed MCP definition CRUD, Course Player discovery and Review Center integration. Mission Tower runtime hardening from production is also folded into the current release: portable Inertia adapters, local in-process MCP, French-by-default responses, SSR-safe shared props, a longer request window and the official `thinking-orbs` frontend dependency. Student submission review remains human-only and Completion/Certificates stay deferred to M14.3.

## M14.1 — Quiz & Assessment Engine

NÜM Academy OS now includes durable trainer-authored quizzes and assessments attached to a Course, Module or Lesson. Supported auto-gradable question types are single choice, multiple choice and true/false; scoring, attempt limits and pass/fail decisions are server-side. Correct answers are not serialized to students before submission, historical question banks are locked once attempts exist, Academy AI can generate assessment proposals before explicit Apply, One-Brief can create one module assessment per advance step, and Academy MCP/Tower can manage the same authored primitives without bypassing governance.

## M13.9 — Course Review & Publish Center + Gemini/Nano Banana Visual System

Course creation now ends in a dedicated human Review Center instead of jumping directly from generated draft to publication. Trainers can inspect positioning, modules, lessons, cover/thumbnail, narrations, the canonical M10 offer and the M11 landing page; focused regenerations become before/after proposals and mutate the real course only after explicit acceptance. Image generation now supports Gemini behind the existing provider abstraction, with `gemini-3.1-flash-lite-image` as the default economical model, a brand-aware Visual Prompt Compiler, non-secret AI provider settings, and Factory/Coolify provisioning for Gemini secrets. `PublishCourseAction` remains the only course publication and Stripe provisioning boundary.

## M13.8 — Mission Tower Chat UX + Rich Response Renderer

Mission Tower keeps the existing Academy shell/sidebar/navigation but now renders assistant answers as safe rich Markdown with headings, emphasis, lists, responsive tables, blockquotes and copyable code. Execution context is surfaced as Tool, Mission, Approval and Evidence cards, while the composer becomes sticky and Tower shows a compact truthful activity Orb during the existing synchronous request lifecycle. No new Markdown dependency, no backend rewrite and no fake streaming/mission cancellation are introduced.

### Mission Tower runtime & Thinking Orbs

Tower répond **en français par défaut** (sauf demande explicite d'une autre langue). Les indicateurs d'activité utilisent le package officiel `thinking-orbs` via un adapter NÜM partagé par Tower et One-Brief-to-Course. Après clonage/extraction, l'installation frontend standard suffit :

Installation normale depuis cette release :

```bash
npm ci
npm run build
```

Pour mettre à niveau un ancien checkout ne contenant pas encore la dépendance :

```bash
npm install thinking-orbs@^0.3.1
```

En production/Coolify, `npm ci` installe automatiquement la dépendance déclarée dans `package.json`/`package-lock.json`. Le bridge MCP utilise un fast-path in-process lorsque `TOWER_ACADEMY_MCP_URL` cible l'instance locale afin d'éviter les deadlocks loopback d'un serveur PHP mono-processus.

## M13.7 — AI Course Creation Engine / One‑Brief‑to‑Course

Course Studio now exposes a single creator flow that turns one brief into a durable, reviewable draft: canonical course blueprint, curriculum and lesson content, optional cover/thumbnail, optional per-lesson narration, a real M10 `CourseOffer`, and an optional M11 landing page. Progress is persisted step by step and shown with a lightweight Thinking Orb tied to the real server state. The engine never publishes automatically and can resume a failed essential step.

## M13.6 — Canonical Course Domain + AI/Tower CRUD

Course Studio is now the central creation aggregate. The existing `Course → Module → Lesson` domain is extended rather than replaced: course positioning, audience, level, language and thumbnail are first-class; text lessons are real lesson types; optional AI narration can coexist with text; Creator Studio can generate covers, thumbnails and lesson narration; and Academy MCP exposes granular category/course/module/lesson/offer/page/media tools for Tower without inventing IDs or bypassing approvals.

## M13.5.1 — Course + Release Hardening

The course mutation paths are now consolidated before M13.6 expands AI/Tower course creation. Fresh installs order Tower migrations safely, normal course deletion archives instead of physically deleting commerce history, draft creation no longer provisions Stripe, publication/unpublication share one lifecycle, lesson media replacement is lossless, Academy AI page validation is aligned, Tower preserves MCP receipt IDs, MCP lesson writes re-index Tutor knowledge, and public course pages no longer fall back to demo content.

## M13.5 — Durable Memory

Mission Tower now separates the raw Chat transcript from durable operational memory. Stable decisions, preferences, goals, constraints, reusable context and completed mission outcomes can survive across threads, while long conversations are compressed into a rolling summary and only a bounded set of relevant memories is sent back to the AI provider.

## M13.4 — Tower Chat

Mission Tower has a persistent conversational control plane. Natural-language requests are routed through the validated Mission Compiler, READ missions can run automatically, and WRITE/SENSITIVE operations pause inline for the exact Academy MCP approval before resuming with Evidence receipts.

## M13.3 — Mission Compiler

Mission Tower can now turn a free-form creator intent into a reviewable MCP mission proposal. The compiler uses the configured Tower AI provider only to propose tools and arguments; the server then rejects unknown tools, validates arguments against live MCP input schemas, recomputes READ / WRITE / SENSITIVE risk from MCP metadata, persists the proposal for audit and creates a draft mission only after explicit Apply. Compilation never executes a tool automatically.

## Current release — v1.6.0 / M15.1

The project currently includes:

- M15.1 canonical `LearningAccessService` with separate tier entitlement and current unlock decisions
- Drip by enrollment delay or fixed date plus module/lesson/assessment/assignment prerequisites with AND semantics
- Server-side lock enforcement across Course Player, progress, notes, assessments, assignments, Tutor/RAG and student MCP
- Trainer **Drip & prérequis** workspace plus governed `learning.access.rules.list/create/update/delete` MCP tools
- Factory/Coolify `drip` capability and `ACADEMY_FEATURE_DRIP`, preserving Tower French defaults and Thinking Orbs
- M14.4 Learning Experience + Factory Integration with explicit Factory learning capabilities and separate capability profiles
- Student sidebar certificate access plus a focused completion card with governed Verify / PDF / Share actions
- Trainer Course Studio entry points for Quiz, Assignments and Completion governed by Academy feature flags
- Factory white-label completion/certificate defaults propagated into generated Coolify environment blueprints
- Capability dependency normalization (`certificates → completion`, `tower → mcp`, `tutor → ai`) and student payload suppression when Quiz/Assignments are disabled
- M14.3 Completion Rules + Certificates with tier-aware server-side evidence evaluation and immutable completion milestones
- Publicly verifiable, revocable certificates with UUID codes and dependency-free on-demand PDF rendering
- Trainer completion policy workspace plus student completion checklist and “Mes certificats” workspace
- Governed MCP/Tower completion policy and certificate inspection/revocation tools, with no direct certificate issuance capability
- M14.2 Assignment & Project Engine with private versioned submissions, human rubric review and preserved student history
- Academy AI `assignment.generate` Proposal → Apply plus resumable One-Brief per-module assignment generation
- Governed Assignment/Rubric MCP CRUD while student submission review remains human-only inside Academy OS
- Mission Tower production hardening with portable Inertia adapters, local MCP in-process dispatch, French-by-default conversation behavior and official `thinking-orbs` integration
- M14.1 Quiz & Assessment Engine with authored Course/Module/Lesson assessments, deterministic scoring, attempt limits and protected historical results
- Trainer assessment workspace plus student assessment player with hidden correct answers until submission
- Academy AI `assessment.generate` proposal → Apply flow, One-Brief optional per-module assessment generation, MCP/Tower CRUD and Review Center assessment summary
- M13.9 Course Review & Publish Center with before/after AI proposals, explicit Accept/Reject and publish readiness gates
- Gemini/Nano Banana course-image provider behind the existing media abstraction, defaulting to `gemini-3.1-flash-lite-image`
- Course/brand-aware Visual Prompt Compiler with purpose-specific 16:9 cover and 1:1 thumbnail direction
- Settings > AI Providers for non-secret text/image/TTS provider preferences and curated Gemini model choices
- M12 Academy Factory provisioning for Gemini image settings and `GEMINI_API_KEY` as a transient encrypted Coolify secret
- Mission Tower rich conversational UX with safe Markdown, Tool/Mission/Approval/Evidence cards, sticky composer, Copy/Retry and compact activity Orb
- Laravel + React + Inertia + Tailwind application core
- Admin, trainer and student roles
- Courses, modules, lessons and student progress
- Canonical Course Studio fields for target audience, level, language, positioning and dedicated thumbnail
- One‑Brief‑to‑Course creator flow with durable step state, real progress, review-only completion and resumable essential failures
- Optional AI cover, thumbnail and one-lesson-per-request narration stages with truthful skip states when media providers are unavailable
- Automatic local M10 default offer plus optional M11 landing draft bound to the generated course, without Stripe provisioning or auto-publication
- Lightweight accessible Thinking Orb UI mapped to real creation stages rather than fake timers
- Native text lesson type with optional generated narration audio alongside lesson content
- AI image generation for course cover/thumbnail and AI TTS narration through provider-neutral media contracts
- Granular Academy MCP/Tower CRUD for categories, courses, modules, lessons, offers, pages and course media
- Course lifecycle hardening with archive semantics, canonical publish/unpublish timestamps and retained finance records
- Lossless lesson audio/PDF updates with stale-media cleanup when lesson type changes
- Stripe / Stripe Connect foundations
- Runtime white-label branding and Theme Engine
- Coolify-ready app + PostgreSQL + Redis topology
- Premium student dashboard and learning library
- Responsive course player
- Private lesson notes
- Course resources workspace
- Server-side redaction of paid lesson media in preview mode
- Creator Studio cockpit for trainers
- Trainer Students, Sales and Analytics workspaces
- Stripe payment snapshots for truthful sales reporting
- Real Community engine with spaces, posts, comments, reactions and moderation
- Image/PDF community attachments on persistent storage
- Real Events engine replacing the former static events demo
- Upcoming agenda + authenticated month calendar
- Capacity-aware member registrations
- Protected Meet/Zoom/live links revealed only to registered members/managers
- Trainer/admin event creation and event cancellation guards
- Scheduled email reminders using the existing Laravel scheduler and queue workers
- Academy AI workspace with Ask / Create / Modify / Analyze modes
- Provider-isolated AI kernel using an `AiProvider` contract
- OpenAI Responses API adapter with strict structured outputs
- DeepSeek Responses API adapter with V4 Flash / V4 Pro and configurable reasoning effort
- Auditable `academy_ai_runs` with explicit proposal → Apply semantics
- AI-generated course, curriculum and lesson proposals
- AI lesson rewrite and aggregate student analysis
- First-class lesson text content editable by trainers and visible to students
- Public/preview redaction for paid lesson media and AI-generated content
- MCP-ready Academy AI capability registry with stable names and risk metadata
- Production Academy MCP Gateway at `POST /mcp` using the MCP 2026-07-28 stateless tool profile
- Mission Tower operations module with Missions, Runs, Approval Center and Evidence ledger
- Mission Tower Academy Observatory with scheduled MCP snapshots, deterministic anomaly rules, deduplicated insights and one-click governed mission creation
- Mission Tower Mission Compiler with natural-language intent → live MCP tool plan → strict schema validation → Review → Apply to draft mission
- Mission Tower durable memory with versioned decisions, preferences, goals, constraints, context and completed mission outcomes
- Bounded memory retrieval with pinned priorities, optional pgvector similarity and deterministic lexical fallback
- Rolling Tower Chat summaries that preserve the full audit transcript while reducing provider context growth
- Memory Center at `/tower/memory` with filter, pin/unpin and forget controls
- Real CI gate using PostgreSQL 17/pgvector + Redis, migrations, SSR build, TypeScript, Pest and a production Dockerfile build matching Coolify
- Compiler audit ledger storing prompt, provider/model, canonical proposal, warnings, failures and applied mission linkage
- Compiler safety gate that recomputes risk from live MCP metadata and rejects invented tools, unknown arguments and invalid required values
- Aggregated student-risk MCP telemetry without student PII and unique Academy-level student counting
- Aggregated AI/Tutor usage MCP telemetry with explicit Tutor-only cost coverage and 24h-vs-previous-24h cost-spike comparison
- Sequential MCP mission runner with automatic READ execution and governed WRITE/SENSITIVE suspension
- Exact MCP `requestState` continuation after approval, including typed phrase confirmation for sensitive actions
- Persistent Tower evidence linked to mission, run, step and Academy MCP receipt IDs
- 16 governed Academy MCP tools across courses, students, analytics, events, community and sales
- Hashed/revocable/scoped MCP bearer tokens tied to verified users, with role-scoped Creator and Student tool subsets
- READ / WRITE / SENSITIVE execution policies with multi-round approval before mutations
- UUID execution receipts, replay protection and persistent MCP audit trail
- Enrollment-aware AI Tutor embedded in the Student Course Player
- pgvector-backed course knowledge with safe lexical fallback
- Lesson text, transcripts and trusted ImageKit/local PDF knowledge ingestion
- Grounded Tutor answers with real retrieved source references
- Tutor Ask / Explain / Summarize / Quiz / Study Plan capabilities
- Per-trainer Tutor provider/model/personality/course controls and quotas
- Shared monthly Tutor budget per trainer Academy plus per-student daily limits
- Student-only MCP tools for progress, knowledge search, lesson reading and grounded quiz generation
- Automatic first-deploy indexing for pre-M09 courses via `academy:knowledge-reindex --missing`
- M10 Sales Engine with free, one-time and subscription course offers
- Access tiers projected from offer rank to module-level server-side gating
- Real Academy commerce ledger for orders, memberships, coupons, affiliates and refunds
- Stripe Connect platform commissions with destination charges for one-time and subscription checkout
- Proportional platform-fee and affiliate reversal projection on refunds
- Creator Sales controls for offer/coupon/affiliate lifecycle and governed refunds
- Student `Mes abonnements` workspace with Stripe Billing Portal handoff
- Truthful conversion, MRR, churn and realized LTV from recorded commerce only
- SENSITIVE MCP `sales.refund` plus governed commerce tools and receipt linkage
- Structured M11 Page Builder with Hero, Features, Instructor, Course, Curriculum, Testimonials, Pricing, FAQ, CTA and Footer blocks
- Three-pane Creator editor with native drag reorder, inspector, preview and publish/unpublish lifecycle
- Live M10 offer binding for pricing blocks, so page prices remain synchronized with the commerce ledger
- Academy AI `page.generate` and `page.optimize` structured capabilities with explicit Review → Apply semantics
- Safe page block allow-list: no arbitrary HTML/JavaScript/CSS and URL scheme filtering for CTA/footer links
- M12 Academy Factory control plane for isolated, reproducible Coolify client deployments
- Eight reusable Academy template packs over one master release: Creator, Coaching, Business, Wellness, Fitness, Corporate, Premium Dark and Editorial
- Factory blueprints spanning brand, theme, feature flags, domain, owner, AI provider, Stripe and email configuration
- Official Coolify API provisioning for project, environment, Git Docker Compose application, environment variables, deploy, domain and health verification
- Idempotent/resumable provisioning with persisted Coolify UUIDs and per-step status history
- Encrypted temporary Factory secret payloads cleared locally after Coolify injection
- Child owner bootstrap as verified `admin + trainer` without Liberty demo seed data
- Runtime feature gates that disable both navigation and protected routes on client instances
- Child Factory disabled by default so deployed Academies receive the product, not the internal provisioning control plane

See [`docs/releases/M14.2-ASSIGNMENT-PROJECT-ENGINE.md`](docs/releases/M14.2-ASSIGNMENT-PROJECT-ENGINE.md) for the current milestone. Previous releases remain documented under [`docs/releases`](docs/releases).

## Academy MCP flow

```text
Claude / Codex / OpenCode / Academy AI
                ↓ Bearer token
             POST /mcp
                ↓
         Academy MCP Gateway
                ↓
      Capability / tool registry
       ├── READ → execute
       ├── WRITE → approval
       └── SENSITIVE → typed approval
                ↓
       Laravel domain services
                ↓
          Execution receipt
```

The repository Laravel Boost MCP remains development tooling; `/mcp` is the private production Academy business gateway.

## Events flow

```text
Public visitor
    ↓
Upcoming events agenda
    ↓ login
Authenticated member
    ├── Month calendar
    ├── Register / unregister
    └── Protected live link after registration

Trainer / Admin
    ├── Create event
    ├── Capacity
    ├── Live URL / location
    ├── Reminder lead time
    └── Cancel authorized event

Laravel scheduler
    ↓ every minute
 events:send-reminders
    ↓
Queue worker
    ↓
Reminder email
```

## Community flow

```text
Public visitor
    ↓
Community read-only feed
    ↓ login
Authenticated member
    ├── Spaces
    ├── Search
    ├── Create post
    ├── Attach image / PDF
    ├── Comment
    └── React

Trainer / Admin
    └── Moderation
        ├── Pin / unpin
        ├── Lock / unlock
        ├── Hide / restore
        └── Create space
```

## Creator flow

```text
Creator Studio
    ├── Overview
    ├── Academy AI
    │   ├── Ask
    │   ├── Create
    │   ├── Modify
    │   └── Analyze
    ├── Courses / Course Builder
    ├── Students
    ├── Sales
    ├── Analytics
    ├── Community
    ├── Events
    └── Settings / Stripe Connect
```

## Student flow

```text
Student Home
    ├── Community
    ├── Events
    └── My Learning
        ↓
    Continue course
        ↓
    Course Player
        ├── Progress
        ├── Notes
        └── Resources
```

## Deployment model

NÜM Academy OS currently favors one isolated instance per client:

```text
Coolify Project
├── App (Laravel + React + SSR + queue workers + scheduler)
├── PostgreSQL
├── Redis
└── Persistent storage
    ├── Course resources
    └── Community attachments
```

M12 keeps the same three-service topology and turns that topology into the Factory deployment target. PostgreSQL now uses the pgvector-enabled PostgreSQL 17 image, while the production MCP Gateway, Academy AI, Tutor jobs, event reminders, queue workers and scheduler continue to run inside the existing application architecture.

Use `.env.coolify.example` and `docker-compose.coolify.yml` as the deployment baseline.

## Release discipline

Each milestone is shipped as a complete source ZIP with SHA-256 checksum and an extracted-release verification pass. Dependency-backed gates that cannot run in the current offline environment are reported as blocked rather than marked as passing.

## M09 — AI Tutor + RAG

NÜM Academy OS now includes an enrollment-aware AI Tutor grounded in indexed course knowledge, with pgvector retrieval, lexical fallback, source citations, quizzes, study plans, creator controls, quotas, OpenAI/DeepSeek LLM routing, and a student-only MCP tool subset. See `docs/releases/M09-AI-TUTOR-RAG.md`.

## M10 — Sales Engine

NÜM Academy OS now includes a real commerce ledger around course access: free/one-time/subscription offers, tiers, coupons, affiliate attribution, Stripe Connect platform fees, governed refunds, member billing management, financial analytics and finance-sensitive MCP tools. See `docs/releases/M10-SALES-ENGINE.md`.

## M11 — Page Builder

NÜM Academy OS includes a structured marketing Page Builder with live M10 pricing bindings and Academy AI page generation/optimization. See `docs/releases/M11-PAGE-BUILDER.md`.

## M12 — Academy Factory

The v1.1.0 milestone adds the private Academy Factory control plane: reusable template packs, deterministic blueprints, encrypted bootstrap secrets, feature flags and resumable Coolify provisioning for isolated client Academies. See `docs/releases/M12-ACADEMY-FACTORY.md`.


