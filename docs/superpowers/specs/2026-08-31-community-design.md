# M05 Community Design

## Goal

Replace Liberty's hard-coded React forum demo with a real community engine while preserving the current academy core, visual language, public URL, and Coolify topology.

## Product boundary

M05 implements a discussion community, not a realtime chat product. It includes spaces/categories, posts, comments, reactions, post attachments, search, pin/lock/hide moderation, and a member-facing app experience. It explicitly excludes realtime chat, private DMs, voice/video rooms, nested comment threads, notification fan-out, gamification, and course-scoped private spaces.

## Access model

- `GET /communaute/forum` remains publicly readable so existing marketing links continue to work.
- Guests receive the public `home/community/forum` presentation backed by real data.
- Authenticated users receive the app-shell `community/index` presentation from the same URL.
- Creating posts/comments/reactions/attachments requires `auth` + `verified`.
- Students, trainers, admins, and super-admins may participate.
- Trainers, admins, and super-admins are community moderators.
- Moderators may pin/unpin, lock/unlock, hide/restore posts and comments, and create community spaces.
- Hidden content is not rendered to guests or normal members. Moderators can see hidden content with a visible moderation badge.

## Data model

### community_spaces

- `id`
- `name`
- `slug` unique
- `description` nullable
- `position` integer
- `is_active` boolean
- timestamps

The migration inserts a small default set so a Coolify deployment becomes usable immediately after `migrate --force` without a separate production seeding step.

### community_posts

- `id`
- `community_space_id`
- `user_id`
- `title`
- `body`
- `is_pinned`
- `is_locked`
- `is_hidden`
- `hidden_at` nullable
- `hidden_by` nullable user FK
- timestamps

### community_comments

- `id`
- `community_post_id`
- `user_id`
- `body`
- `is_hidden`
- `hidden_at` nullable
- `hidden_by` nullable user FK
- timestamps

Comments are intentionally flat in M05.

### community_reactions

Polymorphic reaction table:

- `id`
- `user_id`
- `reactionable_type`
- `reactionable_id`
- `type` (`like`, `celebrate`, `insightful`)
- timestamps

Unique key: user + target + type.

### community_attachments

Attachments belong to posts only in M05:

- `id`
- `community_post_id`
- `disk`
- `path`
- `original_name`
- `mime_type`
- `size`
- timestamps

Files use the existing Laravel `public` filesystem disk and therefore the existing Coolify `academy-storage` persistent volume. Allowed MIME families: images and PDF. Maximum size: 10 MB per attachment, maximum 4 attachments per post.

## Backend flow

`CommunityController@index` builds a single query for both public and authenticated presentations:

1. active spaces ordered by `position`;
2. visible posts, or visible + hidden for moderators;
3. optional `space` slug filter;
4. optional `q` search over title/body/author;
5. pinned first, then newest;
6. eager-load author, space, attachments, recent comments and their authors;
7. expose reaction counts and the authenticated viewer's reactions;
8. paginate 15 posts.

Write controllers remain small and validation-focused:

- `CommunityPostController@store`
- `CommunityCommentController@store`
- `CommunityReactionController@store` (toggle semantics)
- `CommunityModerationController@update`
- `CommunitySpaceController@store`

## Frontend flow

### Authenticated app page

`resources/js/pages/community/index.tsx` uses the existing M02-M04 app shell and theme tokens. It provides:

- header with search;
- horizontal/side space selector;
- create-post composer;
- feed of real posts;
- attachment chips/previews;
- reaction buttons;
- inline comment composer;
- latest comments;
- moderation menu for moderators;
- pagination.

### Guest public page

`resources/js/pages/home/community/forum.tsx` keeps the marketing layout but removes all hard-coded threads. It renders the same real spaces/posts in read-only form and prompts sign-in for participation.

## Error handling

- Validation failures return through normal Laravel/Inertia validation errors.
- Attempts to comment on locked posts return HTTP 403.
- Normal members cannot access moderation endpoints.
- Attachments are deleted from storage if post persistence fails after upload handling.
- Hidden post/comment state is enforced in backend queries, not only via UI.

## Testing

- A standalone M05 contract test verifies required files, routes, migrations, model fields, moderation guards, and removal of `initialThreads` from the public forum page.
- Pest feature tests cover public real-data rendering, authenticated creation, locked-post comment rejection, reaction toggling, moderator pin/hide, and attachment metadata/storage.
- Frontend verification: Prettier, ESLint on M05 files, TypeScript with Wayfinder-generated import failures classified separately as in previous releases.
- Release verification: PHP syntax, Coolify Compose structure unchanged, secret/font/dependency-directory scan, ZIP integrity, SHA-256, and retest from a fresh extraction.
