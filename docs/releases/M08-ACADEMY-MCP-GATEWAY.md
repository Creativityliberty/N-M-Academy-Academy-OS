# M08 — Academy MCP Gateway

## Goal

M08 turns NÜM Academy OS domain capabilities into a private, governed MCP tool surface. The gateway is implemented directly in Laravel and keeps the current single-tenant Coolify topology unchanged.

The production endpoint is distinct from the repository `.mcp.json` / Laravel Boost MCP integration:

- `.mcp.json` + `php artisan boost:mcp` is development tooling for coding agents working on the Laravel repository.
- `POST /mcp` is the Academy product gateway for authenticated business actions against a deployed Academy instance.

## Protocol profile

M08 targets MCP protocol revision `2026-07-28` and implements the stateless HTTP subset required by Academy tools:

- `server/discover`
- `tools/list`
- `tools/call`
- JSON Schema 2020-12 tool input schemas
- `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`
- multi-round input approval using `resultType: input_required`, `requestState` and `inputResponses`
- complete tool results with structured content and execution receipt metadata

M08 intentionally does not add resources, prompts, tasks, OAuth/DCR or legacy MCP session initialization. The endpoint is private and bearer-token authenticated.

## Authentication

Create a token for a verified trainer/admin:

```bash
php artisan academy:mcp-token creator@example.com --name="Codex"
```

Create a time-limited token:

```bash
php artisan academy:mcp-token creator@example.com --name="Claude" --days=30
```

Create a least-privilege token:

```bash
php artisan academy:mcp-token creator@example.com \
  --name="Analytics Agent" \
  --ability=academy.summary \
  --ability=analytics.summary \
  --ability=analytics.learning \
  --ability=sales.summary
```

Only the SHA-256 token hash is stored. The plaintext token is displayed once. Revoke it with:

```bash
php artisan academy:mcp-token-revoke <token-id>
```

## Endpoint

```text
POST https://academy.example.com/mcp
Authorization: Bearer num_mcp_...
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/list
Content-Type: application/json
```

`server/discover` is also private and therefore requires the bearer token.

For `tools/call`, clients additionally send:

```text
Mcp-Method: tools/call
Mcp-Name: courses.create
```

The endpoint is removed from Laravel cookie/session/Inertia/CSRF middleware and is rate-limited independently. Browser requests with an `Origin` header are rejected unless the origin appears in `ACADEMY_MCP_ALLOWED_ORIGINS`.

## Tool catalog

| Tool | Risk | Behavior |
| --- | --- | --- |
| `academy.summary` | READ | Academy-level business summary |
| `courses.list` | READ | Creator-owned courses |
| `students.search` | READ | Search students enrolled in owned courses |
| `students.segment` | READ | Progress segments for an owned course |
| `analytics.summary` | READ | Creator-level learning metrics |
| `analytics.learning` | READ | Per-course completion metrics |
| `events.list` | READ | Upcoming Academy events |
| `community.posts.list` | READ | Visible community posts |
| `sales.summary` | READ | Recorded sales grouped by currency |
| `courses.create` | WRITE | Create a draft course |
| `courses.update` | WRITE | Update mutable owned-course fields |
| `modules.create` | WRITE | Create a module in an owned course |
| `lessons.create` | WRITE | Create a lesson in an owned module |
| `lessons.update` | WRITE | Update an owned lesson |
| `events.create` | WRITE | Create/publish an Academy event |
| `courses.publish` | SENSITIVE | Publish an owned course and provision Stripe catalog if required |

No generic SQL, shell, filesystem or arbitrary-code tools are exposed.

## Governance

The MCP annotations help clients present the right UX, but Laravel remains the enforcement boundary.

### READ

READ tools execute immediately after token, scope, input and ownership checks.

### WRITE

WRITE tools return an MCP multi-round input request before any mutation:

```json
{
  "resultType": "input_required",
  "inputRequests": {
    "approval": {
      "method": "elicitation/create",
      "params": {
        "mode": "form",
        "requestedSchema": {
          "type": "object",
          "properties": {
            "confirm": { "type": "boolean", "const": true }
          },
          "required": ["confirm"],
          "additionalProperties": false
        }
      }
    }
  },
  "requestState": "<opaque-encrypted-state>"
}
```

The client retries the same tool call with the opaque `requestState` and accepted `inputResponses`. Arguments are canonicalized and hashed into the state, so changing the proposed action invalidates the approval.

### SENSITIVE

Sensitive actions require a typed phrase. For example:

```text
PUBLISH COURSE 42
```

The approval state expires after 15 minutes.

## Execution receipts

Every tool call has an `academy_mcp_calls` record and UUID `receipt_id`. Successful results include:

```json
{
  "data": {},
  "receipt": {
    "id": "uuid",
    "tool": "courses.create",
    "risk": "write",
    "status": "succeeded",
    "approvedAt": "2026-08-31T15:00:00Z",
    "executedAt": "2026-08-31T15:00:01Z",
    "replayed": false
  }
}
```

Retrying an already completed approved request returns the persisted result with `replayed: true` instead of executing the mutation again.

## Data classification

Tool metadata currently classifies:

- `students.search` as `personal`
- `sales.summary` as `financial`
- other M08 tools as `internal`

These labels prepare future NÜM policy/Harness integrations without making M08 depend on a separate runtime.

## Coolify

M08 adds no service and no Node MCP server. The deployment remains:

```text
Coolify
├── app (Laravel + React + SSR)
├── postgres
├── redis
├── queue workers
├── scheduler
└── persistent storage
```

Environment additions:

```env
ACADEMY_VERSION=0.8.0
ACADEMY_MCP_ALLOWED_ORIGINS=
ACADEMY_MCP_MAX_BODY_BYTES=1048576
```

An empty origin allow-list is appropriate for CLI/desktop agents that do not send browser `Origin` headers. Add explicit browser origins only when needed.

## Security/non-goals

M08 deliberately excludes refunds because the governed refund lifecycle belongs to M10 Sales Engine. It also excludes arbitrary database access, arbitrary HTTP tools, shell execution and filesystem access.

The official PHP MCP SDK can be adopted later if the Academy needs the broader protocol surface. M08 avoids a new Composer dependency and implements only the modern tool subset the product actually needs today.
