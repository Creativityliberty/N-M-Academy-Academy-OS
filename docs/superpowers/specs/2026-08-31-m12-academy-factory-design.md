# M12 Academy Factory Design

## Goal
Turn the cumulative NÜM Academy OS master release into a repeatable single-tenant Academy provisioning factory for Coolify.

## Invariants
- Each client gets an isolated Coolify project/environment/application backed by the repository `docker-compose.coolify.yml`.
- Factory is disabled on child Academies by default.
- Provisioning is resumable and idempotent: retries reuse recorded Coolify UUIDs.
- Secrets are encrypted while pending in the Factory DB, injected into Coolify, then removed from the Factory record.
- The owner bootstrap password is cleared from Coolify after the first healthy deployment.
- Feature selections produce real runtime feature gates, not decorative metadata.
- Coolify Docker Compose domains are applied only after the first deployment has loaded the Compose source.
- No client deployment source code fork is created; all instances point to the master repository/branch.
- Child bootstrap is idempotent and creates only the owner roles/base spaces/page, never Liberty demo users/courses.

## Flow
Lead / Client -> Template -> Brand -> Theme -> Domain -> Features -> AI -> Stripe -> Email -> Blueprint -> Coolify project -> environment -> Docker Compose app -> env injection -> first deploy -> compose loaded -> domain -> second deploy -> healthcheck -> LIVE.
