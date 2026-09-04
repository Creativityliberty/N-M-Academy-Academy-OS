# M12 Verification

Required source checks:

```bash
./tests/contracts/m07_academy_ai_contract.sh
./tests/contracts/m08_mcp_gateway_contract.sh
./tests/contracts/m09_tutor_contract.sh
./tests/contracts/m10_sales_engine_contract.sh
./tests/contracts/m11_page_builder_contract.sh
./tests/contracts/m12_academy_factory_contract.sh
find app routes config database/migrations tests -name '*.php' -print0 | xargs -0 -n1 php -l
npx prettier --check resources/js/pages/admin/factory/index.tsx resources/js/components/app-sidebar.tsx resources/js/types/ui.ts
npx eslint resources/js/pages/admin/factory/index.tsx resources/js/components/app-sidebar.tsx --rule 'import/order: off'
npx tsc --noEmit
```

Full integration tests requiring Composer/vendor:

```bash
php artisan test --filter=AcademyFactoryTest
```

A live Factory additionally requires a real Coolify API token/server and a Git repository containing this master release. Live provisioning cannot be declared PASS from an offline source packaging environment without those external credentials.

## Formatting baseline

The inherited Liberty codebase still contains pre-existing Prettier drift outside the M12 surfaces. M12 gates only the files changed by this milestone; a full-repository `npm run format:check` is therefore tracked as legacy cleanup rather than silently rewritten during the Factory release.
