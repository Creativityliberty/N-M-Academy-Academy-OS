# M05 — Community

Release: **NÜM Academy OS v0.5.0**

M05 replaces the former hard-coded Liberty forum mockup with a persistent community engine without introducing a realtime stack or a new infrastructure service.

## What changed

### Persistent community model

Five focused tables now back the community:

- `community_spaces`
- `community_posts`
- `community_comments`
- `community_reactions`
- `community_attachments`

The migration creates four usable default spaces during `migrate --force`, so a new Coolify instance does not require a production seeding step before the community can accept posts.

### Public + member experience on one URL

`GET /communaute/forum` remains the canonical URL.

- Guests receive the marketing-layout read-only community page backed by real database content.
- Authenticated users receive the Academy app-shell community workspace from the same URL.
- Writing endpoints require `auth` and `verified` middleware.

### Member capabilities

Verified members can:

- select a space;
- search discussions;
- create posts;
- attach up to four images/PDFs, 10 MB each;
- comment on open posts;
- react with `like`, `celebrate`, or `insightful`;
- browse all comments attached to each post in the feed.

### Moderation

Users with `trainer`, `admin`, or `super-admin` roles can:

- pin/unpin posts;
- lock/unlock replies;
- hide/restore posts;
- hide/restore comments;
- create additional spaces.

Hidden content is filtered server-side for guests and normal members. Moderators see hidden items with visible moderation state.

### Attachments and Coolify

M05 deliberately reuses Laravel's existing `public` filesystem disk. On the current Coolify stack this maps to the existing `academy-storage` persistent volume.

No S3 bucket, websocket server, search engine, message broker beyond the existing Redis service, or additional container is required by M05.

## Explicit non-goals

M05 does not implement:

- realtime chat;
- direct messages;
- nested comment threads;
- notification fan-out;
- community gamification;
- private/course-scoped spaces;
- voice/video rooms.

Those capabilities can be added later without changing the core M05 data boundaries.

## Security details

- Write operations require authenticated, verified users.
- Locked or hidden posts reject new comments server-side.
- Hidden posts/comments are excluded server-side for non-moderators.
- A reaction cannot target hidden content, including a comment whose parent post is hidden.
- Moderation is enforced server-side by role, not only by conditional UI.
- SVG uploads are not accepted; M05 allows common raster images and PDF files only.
