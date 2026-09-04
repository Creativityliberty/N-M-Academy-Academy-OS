# M11 Verification

Release target: `0.11.0`.

Required source gates:

```bash
bash tests/contracts/m07_academy_ai_contract.sh
bash tests/contracts/m08_mcp_gateway_contract.sh
bash tests/contracts/m09_tutor_contract.sh
bash tests/contracts/m10_sales_engine_contract.sh
bash tests/contracts/m11_page_builder_contract.sh
find app routes config database/migrations tests -type f -name '*.php' -print0 | xargs -0 -n1 php -l
npm run format:check
npm run types:check
php artisan test --filter=PageBuilder
npm run build:ssr
```

In the packaging runtime, Laravel/Pest remains blocked when `vendor/autoload.php` is unavailable and Vite SSR remains blocked when the native Rolldown binding is unavailable. These probes must be rerun in CI/Coolify after normal dependency installation.
