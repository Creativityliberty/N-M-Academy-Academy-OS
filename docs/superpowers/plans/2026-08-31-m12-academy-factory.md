# M12 Academy Factory Implementation Plan

> **For agentic workers:** Execute task-by-task with TDD/contract checks and verification before release.

**Goal:** Build the Academy Factory control plane and instance bootstrap needed to deploy isolated branded Academy OS installations on Coolify.

**Architecture:** An admin-only Factory stores a non-secret deployment blueprint plus encrypted ephemeral secrets. Queue jobs call the official Coolify API through a dedicated client and advance an idempotent deployment state machine. Spawned Academies use environment-driven feature gates and an idempotent bootstrap command.

**Tech Stack:** Laravel 13, React/Inertia, PostgreSQL, Redis queues, Coolify REST API, Docker Compose.

**Spec:** `docs/superpowers/specs/2026-08-31-m12-academy-factory-design.md`

## Global Constraints
- Keep existing M01-M11 features intact.
- No new runtime container.
- One isolated client deployment per Coolify application.
- Do not persist plaintext credentials.
- Child Factory is disabled by default.
- Release target is 1.0.0.

---

### Task 1: Factory domain and template registry
- Create deployment migration/model, template registry, feature registry and blueprint builder.
- RED/GREEN contract for eight templates and environment generation.

### Task 2: Coolify API client and resumable provisioning
- Implement project/environment/application/env/deploy/update operations.
- Implement provision + verify jobs with two-stage Compose domain setup.
- Record receipt, step state, UUIDs and errors.

### Task 3: Child instance bootstrap
- Add idempotent owner bootstrap command and template seeding.
- Run it from `docker/start.sh` after migrations.
- Never run demo `DatabaseSeeder` in production bootstrap.

### Task 4: Runtime feature gates
- Add `feature:` middleware and shared Inertia feature flags.
- Gate community/events/pages/AI/Tutor/Sales/MCP routes and navigation.

### Task 5: Factory admin UX
- Add admin Factory page for template, brand, theme, domain, features, providers, Stripe, mail and owner inputs.
- Add provision/retry/verify actions and deployment status timeline.

### Task 6: CLI, tests and documentation
- Add Factory console command and HTTP-fake feature tests.
- Document Coolify variables, source modes, lifecycle and recovery.

### Task 7: v1.0.0 release gate
- Run cumulative contracts M07-M12, PHP/Prettier/ESLint/TypeScript classification, Coolify structure, secret/font/dependency scans.
- Create versioned ZIP + SHA-256, extract fresh, retest the delivered artifact.
