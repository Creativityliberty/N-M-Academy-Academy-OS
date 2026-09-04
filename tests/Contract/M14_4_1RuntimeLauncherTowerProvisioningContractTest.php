<?php

declare(strict_types=1);

$root = dirname(__DIR__, 2);
$fail = static function (string $message): never { fwrite(STDERR, $message."\n"); exit(1); };
$requireFile = static function (string $path) use ($root, $fail): string {
    $full = $root.'/'.$path;
    if (! is_file($full)) { $fail("Missing M14.4.1 file: {$path}"); }
    return (string) file_get_contents($full);
};
$containsAll = static function (string $source, array $needles, string $message) use ($fail): void {
    foreach ($needles as $needle) {
        if (! str_contains($source, $needle)) { $fail("{$message}: {$needle}"); }
    }
};

$builder = $requireFile('app/Factory/AcademyFactoryBlueprintBuilder.php');
$containsAll($builder, [
    "'TOWER_ENABLED' => \$features['tower'] ? 'true' : 'false'",
    "'TOWER_ACADEMY_MCP_IN_PROCESS' => \$features['tower'] ? 'true' : 'false'",
    "'TOWER_ACADEMY_MCP_TOKEN'",
], 'Factory must provision the Tower runtime switch together with the Tower capability');


$provisioner = $requireFile('app/MissionTower/Services/TowerBootstrapTokenProvisioner.php');
$containsAll($provisioner, ['AcademyMcpToolRegistry', 'AcademyMcpToken', 'SENSITIVE', 'token_hash', 'Mission Tower Bootstrap'], 'Tower bootstrap token provisioner invariant missing');
$bootstrap = $requireFile('app/Console/Commands/BootstrapAcademyInstance.php');
$containsAll($bootstrap, ['TowerBootstrapTokenProvisioner', 'TOWER_ACADEMY_MCP_TOKEN', "config('mission-tower.enabled')"], 'Academy bootstrap must provision the Tower MCP identity when Tower is enabled');

$localCompose = $requireFile('docker-compose.local.yml');
$containsAll($localCompose, ['ACADEMY_PORT', '80', 'APP_URL'], 'Local compose override must expose the app predictably');

$launcher = $requireFile('num-academy');
$containsAll($launcher, [
    'up)', 'down)', 'restart)', 'status)', 'logs)', 'doctor)', 'open)', 'help)',
    '.env.num-academy', 'docker-compose.coolify.yml', 'docker-compose.local.yml',
    'ACADEMY_FEATURE_TOWER', 'TOWER_ENABLED', 'ACADEMY_FEATURE_MCP',
    '/up', 'NÜM Academy OS',
], 'Unix launcher invariant missing');

$powershell = $requireFile('num-academy.ps1');
$containsAll($powershell, [
    'up', 'down', 'restart', 'status', 'logs', 'doctor', 'open',
    '.env.num-academy', 'docker-compose.coolify.yml', 'docker-compose.local.yml',
    'ACADEMY_FEATURE_TOWER', 'TOWER_ENABLED', 'ACADEMY_FEATURE_MCP', '/up',
], 'PowerShell launcher invariant missing');

$windows = $requireFile('num-academy.bat');
$containsAll($windows, [
    ':up', ':down', ':restart', ':status', ':logs', ':doctor', ':open',
    'num-academy.ps1', 'NÜM Academy OS',
], 'Windows launcher wrapper invariant missing');

$gitignore = $requireFile('.gitignore');
if (! str_contains($gitignore, '.env.num-academy')) { $fail('Generated launcher environment must be gitignored.'); }

$envExample = $requireFile('.env.num-academy.example');
$containsAll($envExample, [
    'ACADEMY_CAPABILITY_PROFILE=pro',
    'ACADEMY_FEATURE_MCP=true',
    'ACADEMY_FEATURE_TOWER=true',
    'TOWER_ENABLED=true',
    'TOWER_ACADEMY_MCP_IN_PROCESS=true',
    'ACADEMY_PORT=8080',
], 'Local Pro launcher env example must boot Tower coherently');

$workflow = $requireFile('.github/workflows/tests.yml');
if (! str_contains($workflow, 'M14_4_1RuntimeLauncherTowerProvisioningContractTest.php')) { $fail('CI does not run M14.4.1 contract.'); }

$readme = $requireFile('README.md');
$containsAll($readme, ['./num-academy up', 'num-academy.bat', 'Runtime Launcher', 'TOWER_ENABLED'], 'README launcher documentation missing');

foreach (['VERSION', 'PACKAGE_VERSION'] as $path) {
    if (version_compare(trim($requireFile($path)), '1.5.2', '<')) { $fail("M14.4.1 release version must be >= 1.5.2 in {$path}."); }
}
$package = json_decode($requireFile('package.json'), true);
if (version_compare((string) ($package['version'] ?? '0.0.0'), '1.5.2', '<')) { $fail('package.json version must be >= 1.5.2.'); }
$lock = json_decode($requireFile('package-lock.json'), true);
if (version_compare((string) ($lock['version'] ?? '0.0.0'), '1.5.2', '<')) { $fail('package-lock.json root version must be >= 1.5.2.'); }
if (version_compare((string) ($lock['packages']['']['version'] ?? '0.0.0'), '1.5.2', '<')) { $fail('package-lock.json package root version must be >= 1.5.2.'); }

if (($package['dependencies']['thinking-orbs'] ?? null) !== '^0.3.1') { $fail('Thinking Orbs dependency was lost in M14.4.1.'); }
if (! str_contains($requireFile('app/MissionTower/Services/TowerChatRouter.php'), 'français')) { $fail('Tower French-by-default invariant was lost in M14.4.1.'); }

$compose = $requireFile('docker-compose.coolify.yml');
$containsAll($compose, ['TOWER_ENABLED', 'TOWER_ACADEMY_MCP_IN_PROCESS'], 'Production compose Tower runtime settings missing');

$start = $requireFile('docker/start.sh');
$containsAll($start, ['migrate --force', 'academy:bootstrap-instance', 'academy:knowledge-reindex', 'supervisord'], 'One-container application bootstrap invariant missing');

foreach ([
    'docker/supervisor/conf.d/10-php-fpm.conf',
    'docker/supervisor/conf.d/20-nginx.conf',
    'docker/supervisor/conf.d/30-ssr.conf',
    'docker/supervisor/conf.d/40-queue.conf',
    'docker/supervisor/conf.d/50-scheduler.conf',
] as $path) {
    $requireFile($path);
}

echo "M14.4.1 Runtime Launcher + Tower Provisioning contract PASS\n";
