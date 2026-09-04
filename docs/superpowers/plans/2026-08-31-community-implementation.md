# M05 Community Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Replace the static Liberty forum with a real, persistent, searchable and moderated community engine while keeping the current URL, Academy OS design system, and Coolify topology.

**Architecture:** One Laravel community subsystem with five persistence models, small controllers for reads/writes, and two Inertia presentations selected by authentication state: public marketing read-only and authenticated app-shell interactive. Attachments reuse the existing public filesystem and persistent Coolify storage; no new service is introduced.

**Tech Stack:** Laravel 13, PHP 8.4, Eloquent, Inertia 3, React 19, Tailwind CSS 4, existing shadcn/Radix primitives, PostgreSQL/Redis on Coolify.

**Spec:** `docs/superpowers/specs/2026-08-31-community-design.md`

## Global Constraints

- Preserve `GET /communaute/forum`.
- Keep the existing Laravel/React/Inertia/Tailwind core; no rewrite and no new npm/composer dependency.
- Public can read; verified authenticated users can write.
- Moderators are trainer/admin/super-admin roles.
- Attachments: post-only, images/PDF, max 10 MB each, max 4, existing `public` disk.
- No realtime chat, DM, nested comments, notifications, gamification, or private spaces in M05.
- Keep Coolify services at app + PostgreSQL + Redis and reuse `academy-storage`.
- Release as v0.5.0 ZIP + SHA-256 and retest the extracted ZIP.

---

### Task 1: Community persistence contract

**Files:**

- Create: `tests/Contract/M05CommunityContractTest.php`
- Create: `database/migrations/2026_08_31_033000_create_community_tables.php`
- Create: `app/Models/CommunitySpace.php`
- Create: `app/Models/CommunityPost.php`
- Create: `app/Models/CommunityComment.php`
- Create: `app/Models/CommunityReaction.php`
- Create: `app/Models/CommunityAttachment.php`
- Modify: `app/Models/User.php`

**Interfaces:**

- Produces Eloquent relationships `CommunitySpace::posts()`, `CommunityPost::space()/author()/comments()/reactions()/attachments()`, `CommunityComment::post()/author()/reactions()`, polymorphic `CommunityReaction::reactionable()`, and `User::communityPosts()/communityComments()`.

- [x] Write the standalone contract test requiring the five models, migration, relationship method names and expected fillable/state fields.
- [x] Run `php tests/Contract/M05CommunityContractTest.php` and verify RED because the subsystem files do not exist.
- [x] Add the migration with five tables, indexes/FKs, and default spaces inserted in `up()`.
- [x] Add the five focused models and User relationships.
- [x] Run `php tests/Contract/M05CommunityContractTest.php` and verify the persistence portion is GREEN.

### Task 2: Community read/query surface

**Files:**

- Create: `app/Http/Controllers/Community/CommunityController.php`
- Modify: `routes/public.php`
- Modify: `tests/Contract/M05CommunityContractTest.php`
- Create: `tests/Feature/CommunityTest.php`

**Interfaces:**

- Produces `community.index` GET route at `/communaute/forum`.
- Controller returns `home/community/forum` for guests and `community/index` for authenticated users with props `spaces`, `posts`, `filters`, `canModerate`.

- [x] Extend the contract test to require the controller/route and fail against the old `Route::inertia` route.
- [x] Add Pest feature tests asserting a database post appears for a guest and that hidden posts do not.
- [x] Run the standalone contract test and verify RED on controller/route.
- [x] Implement the controller query: active spaces, optional space/search filters, moderator visibility, pinned/newest order, eager loads, reaction counts, 15-item pagination.
- [x] Replace the static Inertia route with the controller route using the same route name `community.forum`.
- [x] Run the standalone contract test and verify the read surface portion is GREEN.

### Task 3: Member writes and attachments

**Files:**

- Create: `app/Http/Controllers/Community/CommunityPostController.php`
- Create: `app/Http/Controllers/Community/CommunityCommentController.php`
- Create: `app/Http/Controllers/Community/CommunityReactionController.php`
- Modify: `routes/public.php`
- Modify: `tests/Contract/M05CommunityContractTest.php`
- Modify: `tests/Feature/CommunityTest.php`

**Interfaces:**

- `POST /communaute/forum/posts` route `community.posts.store`.
- `POST /communaute/forum/posts/{post}/comments` route `community.comments.store`.
- `POST /communaute/forum/reactions` route `community.reactions.store`, body `{ target_type: 'post'|'comment', target_id: int, type: 'like'|'celebrate'|'insightful' }`, toggle semantics.

- [x] Extend feature tests for post creation, attachment metadata/storage, comment creation, locked-post rejection, and reaction on/off toggle.
- [x] Extend contract test to require all three routes/controllers.
- [x] Run standalone contract test and verify RED on the write controllers/routes.
- [x] Implement post validation/storage with max 4 image/PDF files and 10 MB each on the `public` disk.
- [x] Implement comment creation with locked/hidden post authorization.
- [x] Implement reaction target resolution and toggle semantics for posts/comments.
- [x] Add authenticated+verified write routes.
- [x] Run standalone contract test and verify the write surface portion is GREEN.

### Task 4: Moderation and spaces

**Files:**

- Create: `app/Http/Controllers/Community/CommunityModerationController.php`
- Create: `app/Http/Controllers/Community/CommunitySpaceController.php`
- Modify: `routes/public.php`
- Modify: `tests/Contract/M05CommunityContractTest.php`
- Modify: `tests/Feature/CommunityTest.php`

**Interfaces:**

- `PATCH /communaute/forum/posts/{post}/moderation` route `community.posts.moderate`, body action one of `pin`, `unpin`, `lock`, `unlock`, `hide`, `restore`.
- `PATCH /communaute/forum/comments/{comment}/moderation` route `community.comments.moderate`, actions `hide|restore`.
- `POST /communaute/forum/spaces` route `community.spaces.store`.

- [x] Add tests that a student gets 403 on moderation, trainer can pin/hide, and moderator can create an active space.
- [x] Extend contract test to require moderation/space routes and explicit role checks.
- [x] Run standalone contract test and verify RED.
- [x] Implement a single moderator guard using `hasAnyRole(['trainer','admin','super-admin'])`.
- [x] Implement post/comment action allowlists and hidden audit fields.
- [x] Implement space creation with unique name/slug and next position.
- [x] Add authenticated+verified routes.
- [x] Run standalone contract test and verify GREEN.

### Task 5: Authenticated Community UI

**Files:**

- Create: `resources/js/features/community/types.ts`
- Create: `resources/js/features/community/community-post-card.tsx`
- Create: `resources/js/pages/community/index.tsx`
- Modify: `resources/js/components/app-sidebar.tsx`
- Modify: `tests/Contract/M05CommunityContractTest.php`

**Interfaces:**

- `community/index.tsx` consumes server props and submits directly to the named URL paths with Inertia router/form helpers.
- Shared card handles reactions/comments/attachments/moderation display.

- [x] Extend contract test to require the authenticated page, shared card/types, sidebar Community item, and absence of hard-coded demo threads in the new page.
- [x] Run contract test and verify RED.
- [x] Implement typed community props and reusable post card.
- [x] Implement search/space filtering, create-post composer, inline comments, reaction actions, attachment rendering and moderator controls using existing theme tokens/components.
- [x] Add Community to sidebar for admin/trainer/student users using `/communaute/forum`.
- [x] Run Prettier/ESLint on M05 frontend files and contract test.

### Task 6: Public real-data forum UI

**Files:**

- Modify: `resources/js/pages/home/community/forum.tsx`
- Modify: `tests/Contract/M05CommunityContractTest.php`

**Interfaces:**

- Public page consumes real `spaces`, `posts`, `filters` props and is read-only.

- [x] Extend contract test to fail if `initialThreads` or the old hard-coded sample title remains.
- [x] Run contract test and verify RED against the old page.
- [x] Replace local fake arrays/state filtering with server props, GET filter navigation and real post/comment/reaction metadata.
- [x] Add sign-in CTA for participation rather than inert “Créer un sujet”.
- [x] Run Prettier/ESLint and contract test until GREEN.

### Task 7: Versioning, docs and release verification

**Files:**

- Modify: `package.json` version to `0.5.0`.
- Modify: `README.md` M05 capabilities.
- Create: `docs/releases/M05-COMMUNITY.md`.
- Create: `docs/releases/M05-VERIFICATION.md`.

**Interfaces:**

- Produces `NUM_Academy_OS_v0.5.0_M05_2026-08-31.zip` and matching `.sha256`.

- [x] Run `php tests/Contract/M05CommunityContractTest.php` fresh.
- [x] Run `php -l` on every M05 PHP file.
- [x] Run Prettier check and ESLint on every M05 TS/TSX file.
- [x] Run `tsc --noEmit`, classify generated Wayfinder import failures separately, and require zero non-Wayfinder errors.
- [x] Probe Pest and Vite build; record environmental blockers exactly rather than marking them PASS.
- [x] Verify Coolify Compose still contains only app/postgres/redis and existing persistent volumes.
- [x] Scan release tree for font files, dependency directories and likely secrets.
- [x] Build the clean source ZIP excluding dependencies/caches/tool metadata, compute SHA-256, run `unzip -t`.
- [x] Extract the ZIP into a fresh directory and rerun contract, PHP syntax, frontend static checks, typecheck classification, Coolify and release hygiene checks against the extracted artifact.
