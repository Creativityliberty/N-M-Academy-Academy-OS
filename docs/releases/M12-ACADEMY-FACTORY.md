# M12 — Academy Factory

M12 turns the cumulative NÜM Academy OS release into a delivery factory for isolated Coolify deployments.

## Control-plane safety

`ACADEMY_FACTORY_ENABLED=false` by default. Enable it only on the private Factory/control-plane Academy. Child deployments always receive `ACADEMY_FACTORY_ENABLED=false`.

Pending integration credentials are stored with Laravel's encrypted cast only until they are successfully sent to Coolify. The Factory then clears its local encrypted secret payload. The temporary owner bootstrap password is also cleared from the child Coolify environment after the Academy returns HTTP 200 from `/up`.

## Official Coolify API lifecycle

1. `POST /api/v1/projects`
2. `POST /api/v1/projects/{project}/environments`
3. `POST /api/v1/applications/public` or `/applications/private-deploy-key` with `build_pack=dockercompose`
4. `GET /api/v1/applications/{uuid}/envs`, then `POST /envs` for missing keys and `PATCH /envs/bulk` for existing keys
5. `POST /api/v1/deploy`
6. Wait for the Git Compose source to be loaded (`docker_compose_raw`)
7. `PATCH /api/v1/applications/{uuid}` with `docker_compose_domains=[{"name":"app","domain":"https://academy.client.tld"}]`
8. Redeploy and verify `https://academy.client.tld/up`

The two-stage domain operation is intentional for Git-sourced Docker Compose applications: Coolify only knows the Compose service names after loading the repository Compose source.

## Source modes

- `public`: public Git repository.
- `private_deploy_key`: private repository through a Coolify private key UUID.

## Template packs

Creator, Coaching, Business, Wellness, Fitness, Corporate, Premium Dark, Editorial. They are theme/feature blueprints over the same master product; they are not forks.

## Child bootstrap

`php artisan academy:bootstrap-instance` is idempotent and runs at container start after migrations. It creates the owner as `admin + trainer`, generic course categories, optional Community starter spaces and a draft starter landing page. It never executes Liberty demo seeders.

## Retry behavior

Coolify project/environment/application UUIDs are persisted as they are created. Re-running provisioning resumes from the first incomplete step instead of blindly creating duplicates.

## Release boundary

The source release verifies the Coolify API contract through Laravel HTTP fakes and static/contract gates. A real end-to-end client deployment is intentionally not marked PASS without a real Coolify API token, server UUID, destination and Git source.
