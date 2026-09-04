# NÜM Mission Tower — Setup & Launch (M13.1)

Mission Tower is an isolated module inside NÜM Academy OS. It shares the Academy Shell/Theme Engine but reaches Academy business capabilities through the Academy MCP gateway.

## 1. What is required?

### Required for Tower itself
- NÜM Academy OS running normally (`APP_URL` reachable).
- `ACADEMY_FEATURE_MCP=true`.
- `ACADEMY_FEATURE_TOWER=true`.
- `TOWER_ENABLED=true`.
- One Academy MCP bearer token dedicated to Mission Tower.
- One AI provider already configured in Academy AI: **OpenAI OR DeepSeek**. You do not need both.

### Optional
- NümFlow bridge: durable/resumable mission execution (later M13 slices).
- NÜM Harness bridge: strong approvals/evidence (later M13 slices).
- Coolify API: Fleet Mode / multi-Academy control only. Not required to operate Tower on a single Academy.

Tower does **not** add a new database, container, Redis instance, Node MCP server, or separate AI key store.

---

## 2. Minimal environment

```env
ACADEMY_FEATURE_MCP=true
ACADEMY_FEATURE_TOWER=true
TOWER_ENABLED=true

# Reuse Academy AI. No duplicate provider secret is needed.
TOWER_AI_PROVIDER=inherit
TOWER_AI_MODEL=

# Academy MCP
TOWER_ACADEMY_MCP_URL="${APP_URL}/mcp"
TOWER_ACADEMY_MCP_TOKEN=<generated-mcp-token>
TOWER_ACADEMY_MCP_TIMEOUT=10

# Keep these off for the first launch.
TOWER_NUMFLOW_ENABLED=false
TOWER_HARNESS_ENABLED=false
TOWER_FLEET_ENABLED=false
```

Then configure **one** AI provider already used by Academy AI.

### Option A — OpenAI

```env
ACADEMY_AI_PROVIDER=openai
OPENAI_API_KEY=your_secret_key
OPENAI_MODEL=your_enabled_model
OPENAI_BASE_URL=https://api.openai.com/v1
```

Official links:
- API platform: https://platform.openai.com/
- API keys: https://platform.openai.com/api-keys
- Models: https://platform.openai.com/docs/models

### Option B — DeepSeek

```env
ACADEMY_AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=your_secret_key
DEEPSEEK_MODEL=deepseek-v4-pro
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_REASONING_EFFORT=high
```

Official links:
- API docs: https://api-docs.deepseek.com/
- API keys: https://platform.deepseek.com/api_keys

DeepSeek's current docs expose an OpenAI-compatible base URL at `https://api.deepseek.com`.

---

## 3. Create Mission Tower's Academy MCP identity


> **M14.4.1 automatic provisioning:** new Academy Factory **Pro** deployments and the local Runtime Launcher now generate `TOWER_ACADEMY_MCP_TOKEN`, set `TOWER_ENABLED=true` / `TOWER_ACADEMY_MCP_IN_PROCESS=true`, and materialize a bounded non-SENSITIVE MCP identity during `academy:bootstrap-instance`. The manual token commands below remain useful for existing installs, custom scopes, or intentionally adding SENSITIVE abilities.

Tower should use its **own bearer token**. Do not use a user password and do not paste the token into source control.

### Recommended first token — observatory/read-only

Replace `owner@example.com` with the verified trainer/admin email:

```bash
php artisan academy:mcp-token owner@example.com \
  --name="Mission Tower Read" \
  --days=90 \
  --ability=academy.summary \
  --ability=courses.list \
  --ability=students.segment \
  --ability=analytics.summary \
  --ability=analytics.learning \
  --ability=events.list \
  --ability=community.posts.list \
  --ability=sales.summary
```

The command prints the token **once**. Copy it into:

```env
TOWER_ACADEMY_MCP_TOKEN=num_mcp_...
```

M13.1 can now execute real missions. Keep the read-only token above for observability-only Tower, or create a second **operations token** with only the mutation abilities you actually want Tower to orchestrate.

Example bounded operations token:

```bash
php artisan academy:mcp-token owner@example.com \
  --name="Mission Tower Operations" \
  --days=30 \
  --ability=academy.summary \
  --ability=courses.list \
  --ability=analytics.summary \
  --ability=events.list \
  --ability=courses.create \
  --ability=modules.create \
  --ability=lessons.create \
  --ability=events.create
```

Do **not** add `sales.refund` or `courses.publish` unless you intentionally want Tower to expose those SENSITIVE actions in the Approval Center. Even when present, M08 still requires the exact strong approval phrase before execution.

Tower derives READ / WRITE / SENSITIVE from the MCP tool metadata returned by Academy MCP; the browser cannot downgrade a tool's risk.

To revoke a token, use the existing Academy MCP revocation command:

```bash
php artisan academy:mcp-token-revoke <TOKEN_ID>
```

If your installed command uses a different signature, list the available commands with:

```bash
php artisan list | grep mcp
```

---

## 4. Launch locally / on a deployed Academy

After changing environment variables:

```bash
php artisan optimize:clear
php artisan config:cache
php artisan academy:tower-check
```

Then perform a real MCP probe:

```bash
php artisan academy:tower-check --probe
```

Expected core result:

```text
Tower enabled: YES
AI: [OK] openai|deepseek / <model>
Academy MCP: [OK] Academy MCP joignable.
Academy MCP tools: <count>
NümFlow: [OK] Optionnel et désactivé.
Harness: [OK] Optionnel et désactivé.
Fleet/Coolify: [OK] Fleet Mode optionnel et désactivé.
Overall: READY
```

Open in the browser:

```text
https://your-academy.example/tower
```

Use **Vérifier maintenant** to probe the MCP connection from the Tower setup surface.

---


## 4A. Langue française et Thinking Orbs

Mission Tower parle **français par défaut**. Le routeur conversationnel, le compilateur de missions et le compositeur de résultats ne changent de langue que si l'utilisateur le demande explicitement. Les identifiants techniques MCP (`courses.create`, `receipt_id`, etc.) restent inchangés pour préserver la traçabilité.

Les Orbs animés sont une dépendance frontend réelle. Sur cette release, le package est déjà déclaré dans `package.json` et verrouillé dans `package-lock.json`, donc le setup reproductible est :

```bash
npm ci
npm run build
```

Pour mettre à niveau un ancien checkout M13.8 qui ne contient pas encore cette dépendance :

```bash
npm install thinking-orbs@^0.3.1
```

Les états NÜM sont mappés sur les états du package (`working`, `searching`, `solving`, `listening`, `connecting`, `weaving`, `composing`, `breathing`, `shaping`). Le package respecte `prefers-reduced-motion` et le thème clair/sombre automatiquement.

Pour éviter un deadlock HTTP local lorsque Tower appelle le MCP de la même instance :

```env
TOWER_ACADEMY_MCP_IN_PROCESS=true
TOWER_CHAT_REQUEST_TIMEOUT=180
```

Le fast-path in-process ne s'active que lorsque `TOWER_ACADEMY_MCP_URL` correspond à `${APP_URL}/mcp`. Une URL MCP distante continue d'utiliser HTTP normalement.

## 5. Coolify configuration

For a single Academy, Coolify is only the host. Mission Tower needs no additional Coolify API token.

Add the minimum Tower env variables to the Academy application's environment and redeploy.

### Fleet Mode only

When Tower later controls multiple Academy instances:

```env
TOWER_FLEET_ENABLED=true
COOLIFY_API_URL=https://your-coolify.example/api/v1
COOLIFY_API_TOKEN=your_token
COOLIFY_SERVER_UUID=your_server_uuid
```

Recommended Coolify token permissions for Factory/Fleet automation are the smallest set needed, typically `read`, `write`, and `deploy`; avoid `root` unless an operation truly requires it.

Official Coolify links:
- API authorization: https://coolify.io/docs/api-reference/authorization
- Create public application: https://coolify.io/docs/api-reference/api/applications/create-public-application
- Deploy API: https://coolify.io/docs/api-reference/api/deployments/deploy-by-tag-or-uuid

---

## 6. NümFlow bridge — optional

Keep disabled until the NümFlow HTTP/API bridge is ready:

```env
TOWER_NUMFLOW_ENABLED=false
TOWER_NUMFLOW_URL=
TOWER_NUMFLOW_TOKEN=
```

When enabled, both URL and token become required by the Tower readiness gate.

NümFlow's future responsibility here is **durable mission execution / pause / resume / recovery**, not Academy CRUD.

---

## 7. Harness bridge — optional

Keep disabled for the first launch:

```env
TOWER_HARNESS_ENABLED=false
TOWER_HARNESS_URL=
TOWER_HARNESS_TOKEN=
```

Harness later owns stronger evidence/approval policies for sensitive and financial actions. M08 Academy MCP remains the Academy capability boundary.

---

## 8. Recommended first production setup

Use this first:

```env
ACADEMY_FEATURE_MCP=true
ACADEMY_FEATURE_TOWER=true
TOWER_ENABLED=true

TOWER_AI_PROVIDER=inherit
TOWER_ACADEMY_MCP_URL="${APP_URL}/mcp"
TOWER_ACADEMY_MCP_TOKEN=<READ-ONLY TOWER TOKEN>
TOWER_ACADEMY_MCP_TIMEOUT=10

TOWER_NUMFLOW_ENABLED=false
TOWER_HARNESS_ENABLED=false
TOWER_FLEET_ENABLED=false
```

This gives a safe observation-only Tower. For M13.1 operations, replace the token with a bounded operations token containing the exact WRITE/SENSITIVE abilities you want available.

M13.1 now includes Missions → Approval Center → Runs → Evidence while retaining the same module boundaries and Academy design system. NümFlow/Harness remain optional future bridges for durable pause/resume/recovery and stronger external evidence governance.

## M13.2 — Academy Observatory

Enable periodic business observation:

```env
TOWER_OBSERVATORY_ENABLED=true
TOWER_OBSERVATORY_REFUND_RATE_WARN=5
TOWER_OBSERVATORY_CONVERSION_DROP_PCT=15
TOWER_OBSERVATORY_LEARNING_RISK_PCT=25
TOWER_OBSERVATORY_EVENT_FILL_WARN=30
TOWER_OBSERVATORY_COMMUNITY_SILENCE_HOURS=72
TOWER_OBSERVATORY_AI_COST_SPIKE_PCT=50
TOWER_OBSERVATORY_AI_COST_MIN_BASELINE_CENTS=100
```

The operations/read token should include:

```text
academy.summary
sales.summary
analytics.summary
analytics.learning
students.risk.summary
community.posts.list
events.list
ai.usage.summary
courses.list
```

Run one observation manually:

```bash
php artisan tower:observe
```

The scheduler executes the same command every 15 minutes with overlap protection. Open `/tower/insights` to inspect the latest normalized snapshot, active/resolved insights and create a governed draft mission from a recommendation.

A partial MCP failure does not fabricate missing metrics and does not auto-resolve signals from the unavailable domain. Current cost telemetry is explicitly Tutor-only until Creator AI runs persist equivalent token/cost estimates.

## M13.3 — Mission Compiler

Mission Compiler reuses the existing Tower AI configuration; there is no second API key:

```env
TOWER_AI_PROVIDER=inherit
TOWER_AI_MODEL=
```

With `inherit`, Tower uses the Academy AI provider configured by `ACADEMY_AI_PROVIDER` (`openai` or `deepseek`). The MCP token also determines which tools the compiler is allowed to propose.

Open `/tower/compiler`, describe the desired outcome, review the validated plan, then choose **Créer la mission brouillon**. This action does not execute the mission. Execution remains a separate action from the Mission detail screen and continues to use M13.1/M08 approvals.

M13.3 does not yet perform dynamic output binding between steps. If a later mutation needs an ID not already known in the prompt, the compiler is instructed not to invent it.

---

## M13.4 — Tower Chat

Tower Chat is the recommended daily interface for Mission Tower.

```text
/tower/chat
```

It uses the same Academy shell and Theme Engine as the rest of the product.

### Environment

```env
TOWER_CHAT_ENABLED=true
TOWER_CHAT_HISTORY_MESSAGES=8
TOWER_CHAT_MAX_MESSAGE_LENGTH=12000
TOWER_CHAT_AUTO_RUN_READ=true
```

No additional AI API key is required. Chat uses the same Tower provider configuration:

```env
TOWER_AI_PROVIDER=inherit
TOWER_AI_MODEL=
```

`inherit` means the configured Academy AI OpenAI/DeepSeek provider is reused.

### Recommended MCP token

The chat can only use tools exposed to `TOWER_ACADEMY_MCP_TOKEN`. Start with the minimum abilities needed by the Academy owner. Do not use wildcard abilities by default.

READ requests execute automatically when `TOWER_CHAT_AUTO_RUN_READ=true`. WRITE/SENSITIVE calls still follow Academy MCP approvals; Chat merely renders those approvals inline.

### Conversation history

The provider API is treated as stateless by Academy. Threads/messages are persisted locally and only the most recent `TOWER_CHAT_HISTORY_MESSAGES` are supplied as context to the router.

### Secrets

Never paste real provider/API keys into Tower Chat or commit them to the repository. Put secrets only in Coolify/runtime environment variables. If a key has been pasted into a conversation or document, rotate it before production use.


## M13.5 — Durable Memory

Tower Chat now uses three bounded context layers instead of replaying the full transcript:

```text
rolling thread summary
+ recent chat messages
+ relevant durable memories
+ live Tower context
```

Recommended Coolify variables:

```env
TOWER_MEMORY_ENABLED=true
TOWER_MEMORY_MAX_CONTEXT=8
TOWER_MEMORY_SEMANTIC=true
TOWER_MEMORY_RETENTION_DAYS=365
TOWER_MEMORY_THREAD_RETENTION_DAYS=30
TOWER_CHAT_HISTORY_MESSAGES=8
TOWER_CHAT_SUMMARY_TRIGGER_MESSAGES=16
TOWER_CHAT_SUMMARY_BATCH_MESSAGES=16
TOWER_CHAT_MAX_SUMMARY_LENGTH=6000
```

`TOWER_MEMORY_SEMANTIC=true` reuses the existing Academy embedding configuration (`ACADEMY_EMBEDDING_PROVIDER` / `ACADEMY_EMBEDDING_MODEL`) and PostgreSQL pgvector. If embeddings are disabled or unavailable, Tower automatically falls back to deterministic lexical retrieval; Chat and Memory remain functional.

Use `/tower/memory` to inspect active memories, pin durable rules that should remain high priority, and forget memories that should no longer enter provider context. Forgetting a memory never deletes the original Chat/Evidence audit trail.
