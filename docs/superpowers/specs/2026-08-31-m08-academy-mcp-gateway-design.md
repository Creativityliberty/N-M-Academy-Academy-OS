# M08 Academy MCP Gateway Design

## Goal
Expose NÜM Academy OS business capabilities as a secure, stateless MCP 2026-07-28 HTTP endpoint without adding a second runtime or service.

## Protocol
- Endpoint: `POST /mcp`
- Protocol revision: `2026-07-28`
- Supported RPCs: `server/discover`, `tools/list`, `tools/call`
- Stateless: no MCP session id and no initialize handshake.
- Modern headers are validated: `MCP-Protocol-Version`, `Mcp-Method`, and `Mcp-Name` when applicable.
- Tool definitions use JSON Schema 2020-12-compatible object schemas and MCP annotations.

## Authentication
- Bearer token maps to `academy_mcp_tokens`.
- Only verified trainer/admin/super-admin users may receive active MCP tokens.
- Plaintext tokens are shown once; only SHA-256 hashes are stored.
- Tokens can be revoked and have abilities.

## Governance
Risk levels:
- READ: executes immediately.
- WRITE: returns `input_required` confirmation before execution.
- SENSITIVE: returns strong typed confirmation before execution.

Every call is recorded in `academy_mcp_calls` and successful/failed execution returns an execution receipt.

## Initial tools
READ:
- `academy.summary`
- `courses.list`
- `students.search`
- `students.segment`
- `analytics.summary`
- `analytics.learning`
- `events.list`
- `community.posts.list`
- `sales.summary`

WRITE:
- `courses.create`
- `courses.update`
- `modules.create`
- `lessons.create`
- `lessons.update`
- `events.create`

SENSITIVE:
- `courses.publish`

## Non-goals
- Refunds (M10 Sales Engine)
- arbitrary SQL or code execution
- unrestricted file access
- OAuth server/DCR in M08
- resources/prompts/tasks extensions
