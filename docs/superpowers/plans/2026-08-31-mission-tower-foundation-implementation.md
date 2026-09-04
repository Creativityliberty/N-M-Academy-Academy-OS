# Mission Tower Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an isolated Mission Tower foundation with MCP connectivity diagnostics and production setup documentation.

**Architecture:** Mission Tower is a separate Laravel/React domain that shares Academy UI primitives but reaches Academy business capabilities through the existing MCP gateway. M13.0 adds readiness/setup only; mission compilation/execution arrives in later M13 slices.

**Tech Stack:** Laravel 13, React 19, Inertia 3, Tailwind 4, existing Academy MCP, Laravel HTTP client.

**Spec:** `docs/superpowers/specs/2026-08-31-mission-tower-foundation-design.md`

## Global Constraints
- No new container.
- No new npm/composer dependency.
- No direct Tower-to-Academy Eloquent orchestration.
- Reuse Academy Shell/Theme Engine.
- NümFlow/Harness optional by default.

---

### Task 1: Tower configuration and feature gate
- [ ] Add `config/mission-tower.php`.
- [ ] Add Academy `tower` feature flag and environment variables.
- [ ] Add Tower route file and load it from `routes/web.php`.

### Task 2: Academy MCP bridge and readiness
- [ ] Add `AcademyGateway` contract.
- [ ] Add HTTP MCP client using bearer token and MCP 2026-07-28 headers.
- [ ] Add readiness diagnostics for AI, MCP, optional NümFlow/Harness/Fleet.
- [ ] Add `academy:tower-check` command.

### Task 3: Tower setup UI
- [ ] Add Tower controller and Inertia overview page.
- [ ] Add Mission Tower sidebar entry for creator/admin roles.
- [ ] Reuse shared dashboard components and Theme Engine.

### Task 4: Documentation and release gate
- [ ] Add setup guide with required/optional env and official API links.
- [ ] Update README/version.
- [ ] Run M07-M13 contracts, PHP, frontend/typecheck classification and package cumulative ZIP.
