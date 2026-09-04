# M07 Verification — Academy AI v1

Release: `0.7.1`

## Source gates

The following checks were executed against the M07 source workspace:

- `tests/contracts/m07_academy_ai_contract.sh` — PASS after an observed RED before implementation.
- PHP syntax across `app/`, `routes/`, `config/`, `database/migrations/`, and `tests/` — PASS.
- Prettier on all M07 React/TypeScript/docs files — PASS.
- ESLint on all M07 React/TypeScript files with only `import/order` disabled — PASS.
    - `import/order` cannot load the native `unrs-resolver` binding from the offline npm cache in this runtime.
- TypeScript (`tsc --noEmit`) — 85 total diagnostics, all 85 are missing generated Wayfinder modules under `@/routes` / `@/actions`; 0 non-Wayfinder diagnostics.
- Coolify topology — PASS: existing `app`, `postgres`, `redis` services and three persistent volumes remain unchanged.
- M07 invariants — PASS: proposal/apply separation, aggregate-only student analysis, paid lesson content/media redaction, provider abstraction, structured output contract, and MCP-ready capability registry.

## Dependency-backed gates blocked by this runtime

### Laravel / Pest

Command:

```bash
php artisan test --filter=AcademyAiTest
```

Status: **BLOCKED** before Laravel boots because this source release intentionally does not embed `vendor/` and Composer is unavailable in the current runtime.

Observed root cause:

```text
vendor/autoload.php: No such file or directory
```

Re-run on CI/Coolify after installing Composer dependencies:

```bash
composer install --no-interaction --prefer-dist
php artisan test --filter=AcademyAiTest
php artisan test --filter=StudentExperienceTest
```

### Vite SSR production build

Command:

```bash
npm run build:ssr
```

Status: **BLOCKED** before application bundling because the provided offline npm cache does not contain Rolldown's Linux optional native binding.

Observed root cause:

```text
Cannot find module '@rolldown/binding-linux-x64-gnu'
```

Re-run with normal registry access:

```bash
rm -rf node_modules
npm ci
npm run build:ssr
```

## OpenAI provider

M07 uses an internal `AiProvider` contract. The first adapter targets the OpenAI Responses API with JSON Schema Structured Outputs. No secret is embedded in the release. Runtime configuration is supplied through environment variables (`OPENAI_API_KEY`, `ACADEMY_AI_MODEL`, etc.).

## Release policy

The source ZIP must not contain `vendor/`, `node_modules/`, npm cache directories, font files, or real credentials. The final ZIP is re-extracted into a fresh directory and the source gates are repeated against that extracted artifact.


## M07.1 DeepSeek provider patch

Additional source checks:

- `DeepSeekResponsesProvider` exists and uses `/responses`;
- DeepSeek model/base URL defaults are provider-specific;
- `DEEPSEEK_REASONING_EFFORT` is normalized to `none|low|high|max`;
- DeepSeek structured output uses `text.format.type=json_schema`;
- Coolify env example includes OpenAI and DeepSeek without additional services.
