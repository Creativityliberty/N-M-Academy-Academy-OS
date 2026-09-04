# M05 Verification

Release: **NÜM Academy OS v0.5.0 / M05 Community**

## Source gate

Fresh verification on the M05 source tree produced:

- M05 standalone community contract: **PASS**
- PHP syntax for migration, models, controllers, routes and M05 tests: **PASS**
- Prettier for M05 frontend, package metadata and M05 docs: **PASS**
- ESLint for M05 frontend: **PASS** with `import/order` disabled because the offline resolver native binding is unavailable
- TypeScript: **85 errors total; 85/85 are missing generated Wayfinder route/action modules; 0 non-Wayfinder errors**
- Coolify Compose structure: **PASS** (`app`, `postgres`, `redis`, three persistent volumes)
- Community attachment persistence: existing `academy-storage:/var/www/html/storage/app/public` volume reused
- Font files: **0**
- Dependency/tool-cache directories in source tree: **0**
- Secret-pattern scan: **PASS**

## TDD / test coverage added

`tests/Feature/CommunityTest.php` covers the intended Laravel behavior for:

- guest rendering of persisted visible posts;
- hidden post exclusion;
- member post creation;
- PDF attachment persistence;
- locked post comment rejection;
- reaction toggle semantics;
- student moderation rejection;
- trainer pin/hide moderation;
- moderator space creation;
- reaction rejection for comments whose parent post is hidden.

The standalone `tests/Contract/M05CommunityContractTest.php` was observed RED before implementation and PASS after implementation.

## Dependency-backed gates

### Pest / Laravel feature tests — BLOCKED

Probe command:

```bash
php artisan test --filter=CommunityTest
```

Current runtime result:

```text
vendor/autoload.php: No such file or directory
```

The source ZIP intentionally contains no `vendor/`, and Composer is unavailable in the current runtime. The M05 Pest suite therefore cannot be claimed as passing here.

### Vite production build — BLOCKED

Probe command:

```bash
vite build
```

Current offline dependency cache result:

```text
Cannot find module '@rolldown/binding-linux-x64-gnu'
```

This is the same optional native Rolldown dependency blocker recorded in earlier releases. It must be rerun after a normal npm install in CI/Coolify.

## Required deployment follow-up

On a networked CI/Coolify environment, run:

```bash
composer install --no-dev --optimize-autoloader
npm ci
php artisan test
npm run build:ssr
php artisan migrate --force
```

Do not convert the two blocked local gates above into PASS until those commands run successfully in that dependency-complete environment.
