#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
need() { test -e "$1" || { echo "MISSING $1"; exit 1; }; }
contains() { grep -Fq "$2" "$1" || { echo "MISSING [$2] in $1"; exit 1; }; }
need app/Factory/AcademyFactoryTemplateRegistry.php
need app/Factory/AcademyFactoryBlueprintBuilder.php
need app/Factory/CoolifyClient.php
need app/Factory/AcademyFactoryProvisioner.php
need app/Jobs/ProvisionAcademyDeployment.php
need app/Jobs/VerifyAcademyDeployment.php
need app/Models/AcademyFactoryDeployment.php
need app/Console/Commands/BootstrapAcademyInstance.php
need app/Http/Controllers/Admin/AcademyFactoryController.php
need resources/js/pages/admin/factory/index.tsx
need database/migrations/2026_08_31_200000_create_academy_factory_deployments_table.php
contains config/academy.php "'features'"
contains bootstrap/app.php "'feature'"
contains docker/start.sh "academy:bootstrap-instance"
contains docker-compose.coolify.yml "ACADEMY_FACTORY_ENABLED"
contains app/Factory/CoolifyClient.php "/applications/public"
contains app/Factory/CoolifyClient.php "/applications/private-deploy-key"
contains app/Factory/CoolifyClient.php "/envs/bulk"
contains app/Factory/CoolifyClient.php "/deploy"
contains app/Factory/CoolifyClient.php "docker_compose_domains"
contains app/Jobs/VerifyAcademyDeployment.php "ACADEMY_BOOTSTRAP_OWNER_PASSWORD"
contains app/Factory/AcademyFactoryTemplateRegistry.php "premium-dark"
contains app/Factory/AcademyFactoryTemplateRegistry.php "editorial"
contains app/Models/AcademyFactoryDeployment.php "encrypted:array"
echo "M12 ACADEMY FACTORY CONTRACT PASS"
