# M10 Verification

## Source gates

Run from repository root:

```bash
bash tests/contracts/m07_academy_ai_contract.sh
bash tests/contracts/m08_mcp_gateway_contract.sh
bash tests/contracts/m09_tutor_contract.sh
bash tests/contracts/m10_sales_engine_contract.sh
find app routes config database/migrations tests -name '*.php' -print0 | xargs -0 -n1 php -l
npx prettier --check resources/js/components/app-sidebar.tsx resources/js/pages/home/courses/partials/course-detail.tsx resources/js/pages/home/courses/types.ts resources/js/pages/trainer/sales/index.tsx resources/js/pages/student/memberships/index.tsx docs/superpowers/plans/2026-08-31-m10-sales-engine.md
npx eslint --rule 'import/order: off' resources/js/components/app-sidebar.tsx resources/js/pages/home/courses/partials/course-detail.tsx resources/js/pages/home/courses/types.ts resources/js/pages/trainer/sales/index.tsx resources/js/pages/student/memberships/index.tsx
npx tsc --noEmit --pretty false
```

The current offline npm cache is missing the native `unrs-resolver` binding used by the TypeScript import resolver, so `import/order` is classified separately rather than reported as fully executable. All other ESLint rules remain enabled.

The generated Wayfinder `resources/js/routes` / `resources/js/actions` trees are not committed in the source ZIP. TypeScript diagnostics must therefore be classified: only missing generated Wayfinder imports are accepted.

## Dependency-backed probes

```bash
php artisan test --filter=SalesEngineTest
npm run build
```

If `vendor/autoload.php` is absent, Laravel/Pest is BLOCKED before application code. If the offline npm cache lacks the platform-specific Rolldown binding, Vite is BLOCKED before bundling application code. These must be replayed in CI/Coolify after normal dependency installation.

## Coolify check

`docker-compose.coolify.yml` must parse as YAML and contain exactly the expected application architecture (`app`, `postgres`, `redis`), three persistent volumes, and a pgvector PostgreSQL 17 image. Docker CLI execution should be replayed on a host where Docker is installed.

## Release hygiene

The delivered source archive must contain no `vendor`, `node_modules`, npm cache, font files, private environment files, or credential-like secrets. Retest from a fresh extraction of the final ZIP.

## Verification result in the packaging runtime

```text
M07 contract                 PASS
M08 MCP contract             PASS
M09 Tutor contract           PASS
M10 Sales Engine contract    PASS
PHP syntax                   PASS (278 files)
Prettier                     PASS
ESLint except import/order   PASS
TypeScript                   85 total / 85 Wayfinder / 0 non-Wayfinder
Coolify YAML                 PASS
pgvector PostgreSQL 17       PASS
Font scan                    0
High-signal secret scan      0
Pest                         BLOCKED: vendor/autoload.php absent
Vite production build        BLOCKED: native Rolldown binding absent from offline npm cache
Docker CLI execution         BLOCKED: docker command unavailable in packaging runtime
```
