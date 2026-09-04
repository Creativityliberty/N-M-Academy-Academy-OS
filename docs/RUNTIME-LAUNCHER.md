# NÜM Academy OS — Runtime Launcher

**Version:** 1.5.2  
**Milestone:** M14.4.1

The Runtime Launcher is the simplest way to start the complete local Academy stack without manually starting Laravel, PostgreSQL, Redis, Inertia SSR, queues or the scheduler.

## What starts together

```text
./num-academy up
        ↓
Docker Compose
        ↓
├── app
│   ├── Nginx
│   ├── PHP-FPM
│   ├── Inertia SSR
│   ├── 2 Laravel queue workers
│   └── Laravel scheduler
├── PostgreSQL 17 + pgvector
└── Redis 7
```

The application entrypoint also runs:

```text
migrate --force
storage:link
academy:bootstrap-instance
config / route / view cache
academy:knowledge-reindex --missing
supervisord
```

Mission Tower is part of the Laravel application. It does not require a separate Tower container.

## macOS / Linux

From the extracted Academy folder:

```bash
chmod +x num-academy
./num-academy up
```

Other commands:

```bash
./num-academy down
./num-academy restart
./num-academy status
./num-academy logs
./num-academy doctor
./num-academy open
./num-academy help
```

Launching `./num-academy` without an argument opens the interactive terminal menu.

## Windows

Double-click:

```text
num-academy.bat
```

or use a terminal:

```bat
num-academy.bat up
num-academy.bat doctor
num-academy.bat logs
```

`num-academy.bat` delegates the runtime work to the included `num-academy.ps1` PowerShell launcher.

## First launch

If `.env.num-academy` does not exist, the launcher copies `.env.num-academy.example` and generates locally:

- Laravel `APP_KEY`;
- PostgreSQL password;
- initial Academy owner password;
- dedicated `TOWER_ACADEMY_MCP_TOKEN`.

The generated `.env.num-academy` is ignored by Git and must never be committed.

The local launcher defaults to the **Academy Pro** capability profile so the complete product can be inspected:

```env
ACADEMY_CAPABILITY_PROFILE=pro
ACADEMY_FEATURE_MCP=true
ACADEMY_FEATURE_TOWER=true
TOWER_ENABLED=true
TOWER_ACADEMY_MCP_IN_PROCESS=true
```

The initial owner defaults to `owner@numacademy.local` when no local owner email was supplied. A random password is generated into `.env.num-academy` on first initialization.

The Academy is exposed by `docker-compose.local.yml` on:

```text
http://localhost:8080
```

Change both `ACADEMY_PORT` and `APP_URL` in `.env.num-academy` when another local port is required.

## Tower provisioning

M14.4.1 closes the gap between the Academy capability flag and the Mission Tower runtime.

For an Academy Factory profile with `tower=true`, the generated deployment now carries:

```env
ACADEMY_FEATURE_MCP=true
ACADEMY_FEATURE_TOWER=true
TOWER_ENABLED=true
TOWER_ACADEMY_MCP_IN_PROCESS=true
```

Factory also creates `TOWER_ACADEMY_MCP_TOKEN` as a transient encrypted deployment secret. During `academy:bootstrap-instance`, `TowerBootstrapTokenProvisioner` hashes that token into `academy_mcp_tokens` and links it to the verified Academy owner.

The automatically provisioned Tower token receives the currently registered **READ + WRITE** Academy MCP abilities available to that owner. **SENSITIVE** tools are deliberately excluded. Therefore actions such as course publication, refunds or certificate revocation are not silently granted by a Factory Pro preset; they still require an intentionally scoped token if the owner wants Tower to propose them.

When the Factory/launcher Tower token is rotated, the previous active `Mission Tower Bootstrap` token for that owner is revoked. Reusing the same token is idempotent and does not create duplicates.

## External AI providers

The launcher can boot the complete infrastructure without an external AI key. In the supplied local example:

```env
ACADEMY_AI_PROVIDER=disabled
```

This means the Academy, MCP Gateway and Mission Tower runtime can start, but model-backed Tower Chat / Mission Compiler responses require a configured provider such as OpenAI or DeepSeek. `./num-academy doctor` reports this as a note rather than pretending an external provider exists.

## Doctor

Run:

```bash
./num-academy doctor
```

It checks:

- Docker executable;
- Docker Compose v2;
- Docker daemon connectivity;
- generated APP/DB credentials;
- Tower / MCP feature coherence;
- Tower MCP token presence;
- production + local Compose parsing.

A healthy configuration ends with:

```text
DOCTOR PASS
```

## Storage and shutdown

`down` does **not** delete persistent volumes. PostgreSQL, Redis, Academy public media and private assignment files survive a normal shutdown.

To deliberately remove data, use Docker Compose volume deletion manually and only when you explicitly intend to reset the Academy.
