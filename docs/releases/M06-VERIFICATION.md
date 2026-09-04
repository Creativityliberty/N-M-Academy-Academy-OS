# M06 Verification

Release: **NÜM Academy OS v0.6.0 / M06 Events**

## Source gate

Fresh verification on the M06 source tree produced:

- M06 standalone Events contract: **PASS**
- PHP syntax for 13 M06-touched backend/test files: **PASS**
- Prettier for M06 frontend, package metadata and docs: **PASS**
- ESLint for M06 frontend: **PASS** with `import/order` disabled because the offline resolver native binding is unavailable
- TypeScript: **85 errors total; 85/85 are missing generated Wayfinder route/action modules; 0 non-Wayfinder errors**
- Coolify Compose structure: **PASS** (`app`, `postgres`, `redis`, three persistent volumes)
- Existing production scheduler loop: **PASS** (`schedule:run` every 60 seconds under Supervisor)
- Existing queue workers: **PASS** (`queue:work`, two processes under Supervisor)
- Package version: **0.6.0**
- Font files: **0**
- Dependency/tool-cache directories in release source: **0** after removing the temporary QA node_modules symlink
- Secret-pattern scan: **PASS**

## TDD / test coverage added

`tests/Feature/EventsTest.php` covers the intended Laravel behavior for:

- public rendering of persisted upcoming events;
- meeting URL redaction for guests;
- registered-member meeting URL disclosure;
- student event-creation rejection;
- trainer event creation;
- capacity enforcement;
- self-cancellation of registration;
- creator-only event cancellation;
- due reminder notification and `reminder_sent_at` persistence.

`tests/Contract/M06EventsContractTest.php` was observed RED before implementation and PASS after implementation.

## Dependency-backed gates

### Pest / Laravel feature tests — BLOCKED

Probe command:

```bash
php artisan test --filter=EventsTest
```

Observed result:

```text
vendor/autoload.php: No such file or directory
```

The source ZIP intentionally contains no `vendor/`, and Composer is unavailable in the current runtime. The M06 Pest suite therefore cannot be claimed as passing here.

### Vite production build — BLOCKED

Probe command:

```bash
npm run build:ssr
```

Observed result from the available offline node_modules cache:

```text
Cannot find module '@rolldown/binding-linux-x64-gnu'
```

This is the same optional native Rolldown dependency blocker recorded in earlier releases. A normal `npm ci` in CI/Coolify must run before the production build can be declared PASS.

## Required deployment follow-up

On a networked CI/Coolify environment, run:

```bash
composer install --no-dev --optimize-autoloader
npm ci
php artisan test
npm run build:ssr
php artisan migrate --force
php artisan schedule:list
```

Verify that `events:send-reminders` appears in `schedule:list`. Also configure a real production mailer instead of the default `log` mailer if reminder emails must reach members.
