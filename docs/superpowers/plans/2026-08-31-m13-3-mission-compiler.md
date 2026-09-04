# M13.3 Mission Compiler Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn a free-form creator request into a safe, reviewable Mission Tower draft composed only of MCP tools accessible to the current Tower token.

**Architecture:** Mission Compiler resolves the configured Tower AI provider, sends it a compact live MCP tool catalog, validates the structured proposal against the same live catalog and tool JSON Schemas, persists the proposal for audit, and materializes a TowerMission only after explicit Apply. Risk is always re-derived from MCP metadata; the model never controls authorization or risk classification.

**Tech Stack:** Laravel 13, existing AiProvider abstraction (OpenAI/DeepSeek), Academy MCP Gateway, React 19 + Inertia 3 + Tailwind 4.

**Spec:** `docs/releases/M13.3-MISSION-COMPILER.md`

## Global Constraints

- Same Academy Shell and Theme Engine; no parallel design system.
- No arbitrary HTML/JS/CSS/code execution.
- Compile is proposal-only; never auto-run or auto-publish.
- Use only tools visible through the configured Tower MCP token.
- Recompute risk and title from live MCP metadata.
- Reject unknown tools and invalid arguments before persistence/application.
- Maximum steps comes from `TOWER_MAX_MISSION_STEPS`.
- No new container, database service, npm dependency, or Composer dependency.

---

### Task 1: Compiler audit domain
- [ ] RED contract requires TowerCompilation model/migration and MissionCompiler services.
- [ ] Persist prompt/provider/model/proposal/status/warnings/error/applied mission.
- [ ] Ensure ownership isolation.

### Task 2: Provider resolver and strict compiler
- [ ] Reuse `TOWER_AI_PROVIDER=inherit|openai|deepseek` and optional `TOWER_AI_MODEL`.
- [ ] Build strict JSON schema for title/objective/priority/summary/assumptions/steps.
- [ ] Supply only live Academy-scope tools to the model.
- [ ] Never execute during compilation.

### Task 3: Tool plan validation
- [ ] Reject inaccessible/invented tools.
- [ ] Validate arguments against MCP input schemas.
- [ ] Recompute risk/title/schema from live catalog.
- [ ] Enforce max steps and sequential dependency semantics.

### Task 4: Proposal -> Apply
- [ ] Create TowerCompilation proposal.
- [ ] Explicit Apply transaction creates draft TowerMission + steps.
- [ ] Prevent double Apply using row lock and applied_at/mission_id.
- [ ] Keep mission source `compiler` and compiler audit metadata.

### Task 5: Tower UI
- [ ] Add `/tower/compiler` surface using Academy shell.
- [ ] Prompt composer, proposal preview, risk counts, assumptions, step list, Apply button.
- [ ] Link Compiler from Tower navigation and Missions page.

### Task 6: Tests/docs/release
- [ ] Contract RED -> GREEN.
- [ ] Add Laravel fake-provider tests for unknown tool, risk recomputation, invalid args, apply idempotency.
- [ ] Update env/docs/version to 1.1.3.
- [ ] Run cumulative gates, package ZIP + SHA-256, fresh extraction retest.
