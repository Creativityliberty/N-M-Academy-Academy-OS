# M09 Verification

## Source gates

```bash
./tests/contracts/m08_mcp_gateway_contract.sh
./tests/contracts/m09_tutor_contract.sh
find app routes config database/migrations tests -name '*.php' -print0 | xargs -0 -n1 php -l
npx prettier --check resources/js/pages/student/courses/show.tsx resources/js/pages/student/courses/partials/ai-tutor-panel.tsx resources/js/pages/trainer/tutor-settings/index.tsx resources/js/components/app-sidebar.tsx docs/releases/M09-AI-TUTOR-RAG.md docs/releases/M09-VERIFICATION.md
npx eslint resources/js/pages/student/courses/show.tsx resources/js/pages/student/courses/partials/ai-tutor-panel.tsx resources/js/pages/trainer/tutor-settings/index.tsx resources/js/components/app-sidebar.tsx --rule 'import/order: off'
npx tsc --noEmit
```

The local offline npm cache lacks the native resolver used by `import/order`, so the extracted-release gate disables only that rule while keeping the rest of ESLint active. TypeScript diagnostics are classified separately: Wayfinder-generated imports are known to be unavailable until Composer/Artisan runs.

## Runtime gates when Composer/network dependencies are available

```bash
composer install
php artisan migrate --force
php artisan test --filter=AcademyTutorTest
php artisan test --filter=AcademyMcpGatewayTest
npm ci
npm run build:ssr
```

## M09 behavioral gates

- unenrolled students cannot retrieve course knowledge;
- paid course knowledge is unavailable before enrollment;
- Tutor threads and quizzes are student-isolated;
- Tutor settings are trainer-isolated;
- monthly Tutor budget is shared across the trainer's courses;
- unsupported grounded questions do not fabricate Academy sources;
- provider outages return a graceful 503 response while the Academy remains usable;
- remote PDF extraction only accepts the configured ImageKit endpoint;
- Student MCP tokens cannot call Creator tools;
- existing courses are queued once for initial knowledge indexing.

## Coolify

Coolify must use PostgreSQL with pgvector. Existing PostgreSQL volumes remain compatible because M09 stays on PostgreSQL major version 17 and enables the `vector` extension through the migration.
