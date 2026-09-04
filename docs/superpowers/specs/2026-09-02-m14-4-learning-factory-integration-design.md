# M14.4 Learning Experience + Factory Integration — Design

**Status:** approved from the preceding product discussion and resumed by the user on 2026-09-02.

## Goal

Close M14 end-to-end so Assessments, Assignments, Completion and Certificates are coherent across Student, Trainer, Academy Factory and Coolify, without introducing a second learning engine.

## Constraints

- Keep the existing M14.1–M14.3 domain, tables, completion engine and certificate verification model.
- Keep Course → Module → Lesson, M10 Sales, M11 Pages, M09 Tutor/RAG and Mission Tower boundaries unchanged.
- Factory capability selection must be independent from visual/business templates.
- Existing issued certificates remain durable evidence; feature flags must not delete history.
- Public certificate verification, student PDF download and sharing are configurable Academy defaults.
- No new Composer or npm dependency.
- French remains the default UI language.
- Target release: `1.5.1`.

## Architecture

### 1. Academy capability layer

Extend `config/academy.php` with four learning flags:

- `assessments`
- `assignments`
- `completion`
- `certificates`

Add global learning defaults under `academy.learning` for completion and certificate white-label behavior. Route/UI surfaces are gated by these flags. Completion evaluation becomes a no-op when completion is disabled; assessments/assignments disabled at Academy level do not become hidden blockers. Certificate issuance requires both the course policy and the Academy certificate capability.

### 2. Factory capability profiles

Create `AcademyFactoryCapabilityRegistry` with three product profiles separate from the eight existing design templates:

- `essential`
- `creator`
- `pro`

Templates keep theme/descriptor and nominate a default capability profile. The blueprint builder resolves the profile, merges explicit overrides, normalizes dependencies (`certificates => completion`) and emits all feature environment variables including Tower and M14.

### 3. Factory learning defaults

The Factory form adds a Learning & Certification block with:

- certificate issuer name;
- certificate title;
- require all accessible lessons default;
- public verification;
- PDF download;
- student sharing.

The blueprint emits corresponding environment values. Secrets remain in the existing encrypted secret path only.

### 4. Student experience

- Add `Mes certificats` to the Student sidebar when certificates are enabled.
- Keep `/student/certificates` as the certificate library with clear empty state and actions.
- Replace the inline Course Player completion block with a focused component showing lessons / quiz / projects, remaining requirement categories, and direct certificate actions.
- Student PDF downloads use an authenticated ownership-checked route. Public verification remains separately configurable.
- Sharing is only offered when the Academy enables it and a public verification URL exists.

### 5. Trainer experience

Course Builder exposes three clear M14 workspaces together:

- Quiz & évaluations
- Assignments & projets
- Complétion & certificats

Buttons respect Academy feature flags. Existing dedicated workspaces remain the owners of their domains.

### 6. Deployment / Coolify

Update `.env.example`, `.env.coolify.example` and `docker-compose.coolify.yml` with all M14 feature/default environment variables. Keep `academy-assignments` private persistent volume and `php artisan migrate --force` bootstrap behavior.

## Safety / history rules

- Disabling a capability never deletes DB content.
- Existing public certificates remain persisted; endpoint visibility follows Academy settings.
- Certificate issuance is never exposed as a Tower/MCP direct tool.
- Trainer revocation governance remains unchanged.

## Verification

A new standalone M14.4 contract must fail against v1.5.0 and pass after implementation. CI runs it after M14.3. Existing M04→M14.3 contracts must continue to pass. Static release gates cover PHP syntax, TS/TSX parse, migrations, YAML/JSON, env/secret hygiene, ZIP integrity and SHA-256. Runtime-only probes remain explicitly BLOCKED when dependencies are unavailable.
