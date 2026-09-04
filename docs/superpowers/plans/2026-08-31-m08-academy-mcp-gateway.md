# M08 Academy MCP Gateway Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a stateless MCP 2026-07-28 gateway that safely exposes Academy business tools with deterministic approvals and receipts.

**Architecture:** Laravel owns the MCP endpoint and reuses existing Academy models/actions. A token authenticator resolves the Academy user, a registry declares tool schemas/risk, a dispatcher executes only allow-listed tools, and an approval service uses encrypted request state for stateless multi-round confirmation.

**Tech Stack:** PHP 8.4, Laravel 13, PostgreSQL, Redis, existing Stripe actions, MCP 2026-07-28 wire format.

**Spec:** `docs/superpowers/specs/2026-08-31-m08-academy-mcp-gateway-design.md`

## Global Constraints
- No new Coolify service.
- No arbitrary code/SQL tool.
- MCP calls are tied to a real Academy user.
- WRITE and SENSITIVE tools never mutate before approval.
- Every call creates an audit record and receipt.
- Existing OpenAI/DeepSeek Academy AI behavior remains unchanged.

---

### Task 1: Persistence and token authentication
**Files:** migrations for `academy_mcp_tokens` and `academy_mcp_calls`; models; middleware; token command.
- [ ] Write contract/test assertions first.
- [ ] Verify RED.
- [ ] Add hashed token persistence and bearer authentication.
- [ ] Add one-time token creation command and revocation-ready fields.
- [ ] Verify source contract.

### Task 2: Tool registry
**Files:** `app/Mcp/AcademyMcpToolRegistry.php` and value objects/enums.
- [ ] Define the 16 tools with schemas, risk, and MCP annotations.
- [ ] Expose deterministic metadata for `tools/list`.
- [ ] Verify READ/WRITE/SENSITIVE classification.

### Task 3: Tool executor
**Files:** `app/Mcp/AcademyMcpToolExecutor.php`.
- [ ] Reuse existing Academy models/actions.
- [ ] Enforce trainer ownership for course/module/lesson mutations.
- [ ] Return structured results only, never Eloquent models.
- [ ] Ensure `courses.publish` reuses Stripe provisioning and is idempotent.

### Task 4: Approval + receipts
**Files:** approval service, receipt factory, audit model lifecycle.
- [ ] READ executes immediately.
- [ ] WRITE returns boolean confirmation via `input_required`.
- [ ] SENSITIVE returns typed phrase confirmation.
- [ ] Encrypt requestState with user/token/tool/argument hash/expiry.
- [ ] Retry validates requestState and executes exactly once.

### Task 5: MCP HTTP protocol controller
**Files:** controller/routes/bootstrap CSRF exception.
- [ ] Implement `server/discover`, `tools/list`, `tools/call`.
- [ ] Validate 2026-07-28 standard headers against the JSON-RPC body.
- [ ] Validate Origin allowlist when Origin is present.
- [ ] Return JSON-RPC protocol errors for malformed/unsupported calls and tool errors as tool results.

### Task 6: Verification, docs, release
**Files:** feature tests, contract script, README/release docs/version.
- [ ] Add feature coverage for auth, list, read call, write approval, sensitive approval, ownership and replay protection.
- [ ] Run PHP syntax, contract, formatting/type checks available in runtime.
- [ ] Package source-only ZIP, SHA-256, extract and retest artifact.
