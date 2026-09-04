#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
need() { test -e "$ROOT/$1" || { echo "MISSING $1" >&2; exit 1; }; }
contains() { grep -Fq "$2" "$ROOT/$1" || { echo "MISSING '$2' in $1" >&2; exit 1; }; }
need app/Mcp/AcademyMcpToolRegistry.php
need app/Mcp/AcademyMcpToolExecutor.php
need app/Mcp/AcademyMcpGateway.php
need app/Mcp/AcademyMcpApprovalService.php
need app/Http/Controllers/Mcp/McpGatewayController.php
need app/Http/Middleware/AuthenticateAcademyMcpToken.php
need app/Models/AcademyMcpToken.php
need app/Models/AcademyMcpCall.php
need app/Console/Commands/CreateAcademyMcpToken.php
need app/Console/Commands/RevokeAcademyMcpToken.php
need database/migrations/2026_08_31_150000_create_academy_mcp_tables.php
need tests/Feature/Mcp/AcademyMcpGatewayTest.php
contains routes/web.php "require __DIR__.'/mcp.php';"
contains routes/mcp.php "Route::post('/mcp'"
contains app/Mcp/AcademyMcpToolRegistry.php "academy.summary"
contains app/Mcp/AcademyMcpToolRegistry.php "courses.publish"
contains app/Mcp/AcademyMcpToolRegistry.php "sales.summary"
contains app/Mcp/AcademyMcpToolRegistry.php "readOnlyHint"
contains app/Mcp/AcademyMcpToolRegistry.php "destructiveHint"
contains app/Mcp/AcademyMcpToolRegistry.php "idempotentHint' => \$idempotent ?? \$risk === self::READ"
contains app/Mcp/AcademyMcpToolRegistry.php "com.numtema.academy/dataClass"
contains app/Mcp/AcademyMcpApprovalService.php "input_required"
contains app/Mcp/AcademyMcpApprovalService.php "requestState"
contains app/Mcp/AcademyMcpApprovalService.php "where('status', 'approval_required')"
contains app/Mcp/AcademyMcpGateway.php "server/discover"
contains app/Mcp/AcademyMcpGateway.php "tools/list"
contains app/Mcp/AcademyMcpGateway.php "tools/call"
contains app/Mcp/AcademyMcpGateway.php "claimApprovedCall"
contains app/Mcp/AcademyMcpGateway.php "public const PROTOCOL = '2026-07-28'"
contains app/Http/Controllers/Mcp/McpGatewayController.php "MCP-Protocol-Version"
contains app/Http/Controllers/Mcp/McpGatewayController.php "Mcp-Method"
contains app/Http/Controllers/Mcp/McpGatewayController.php "Mcp-Name"
contains app/Http/Controllers/Mcp/McpGatewayController.php "Origin is not allowed"
contains app/Console/Commands/CreateAcademyMcpToken.php "token_hash"
contains app/Console/Commands/RevokeAcademyMcpToken.php "revoked_at"
contains tests/Feature/Mcp/AcademyMcpGatewayTest.php "protocol headers do not match"
contains tests/Feature/Mcp/AcademyMcpGatewayTest.php "browser origins"
contains bootstrap/app.php "mcp"
contains routes/mcp.php "withoutMiddleware"
contains routes/mcp.php "throttle:120,1"
COUNT=$(grep -cF '=> $this->tool' "$ROOT/app/Mcp/AcademyMcpToolRegistry.php")
[ "$COUNT" -ge 16 ] || { echo "EXPECTED at least 16 MCP tools, got $COUNT" >&2; exit 1; }
! grep -Eq "shell\.|sql\.|exec\.|filesystem\." "$ROOT/app/Mcp/AcademyMcpToolRegistry.php" || { echo "DANGEROUS generic tool exposed" >&2; exit 1; }
echo "M08 MCP CONTRACT PASS (core 16+ tools)"
