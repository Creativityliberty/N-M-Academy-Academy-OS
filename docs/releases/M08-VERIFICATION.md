# M08 Verification

## Source gates

Run from the release root:

```bash
./tests/contracts/m08_mcp_gateway_contract.sh
find app routes config database/migrations tests -name '*.php' -print0 | xargs -0 -n1 php -l
```

Expected source contract:

```text
M08 MCP CONTRACT PASS (16 tools)
```

## Dependency-backed gates

When Composer dependencies are installed:

```bash
php artisan test --compact tests/Feature/Mcp/AcademyMcpGatewayTest.php
vendor/bin/pint --test
```

The MCP feature suite covers token authentication, discovery/tool scoping, READ receipts, WRITE approval, SENSITIVE typed approval, ownership denial, replay protection, protocol-header mismatch and Origin policy.

## Frontend

M08 does not modify React/TypeScript application code. Existing frontend dependency/build gates remain applicable to the cumulative release.

## Coolify smoke test

After deploy:

```bash
php artisan migrate --force
php artisan academy:mcp-token <verified-trainer-email> --name="Smoke Test" --days=1 --ability=academy.summary
```

Then call `server/discover`, `tools/list` and `academy.summary` using the generated bearer token and MCP 2026-07-28 headers.

## Expected environment caveats in the build workspace

The source release intentionally excludes `vendor/` and `node_modules/`. If the current build runtime cannot install Composer/npm dependencies from the network, Pest/Pint/Vite are reported as BLOCKED rather than as passing.
