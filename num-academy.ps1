param(
    [Parameter(Position=0)]
    [ValidateSet('menu','up','down','restart','status','logs','doctor','open','help')]
    [string]$Command = 'menu'
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvFile = if ($env:NUM_ACADEMY_ENV_FILE) { $env:NUM_ACADEMY_ENV_FILE } else { Join-Path $Root '.env.num-academy' }
$EnvExample = Join-Path $Root '.env.num-academy.example'
$ComposeProd = Join-Path $Root 'docker-compose.coolify.yml'
$ComposeLocal = Join-Path $Root 'docker-compose.local.yml'

function Get-EnvValueFromPath([string]$Path, [string]$Key) {
    if (-not (Test-Path $Path)) { return '' }
    $line = Get-Content $Path | Where-Object { $_ -like "$Key=*" } | Select-Object -Last 1
    if (-not $line) { return '' }
    return (($line -split '=', 2)[1]).Trim('"')
}

function Get-EnvValue([string]$Key) {
    return Get-EnvValueFromPath $EnvFile $Key
}

$AcademyVersion = (Get-EnvValueFromPath $EnvExample 'ACADEMY_VERSION').Trim()
if ([string]::IsNullOrWhiteSpace($AcademyVersion)) {
    $AcademyVersion = '1.6.1'
}

function Set-EnvValue([string]$Key, [string]$Value) {
    $lines = [System.Collections.Generic.List[string]]::new()
    if (Test-Path $EnvFile) { Get-Content $EnvFile | ForEach-Object { [void]$lines.Add($_) } }
    $found = $false
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -like "$Key=*") {
            if (-not $found) { $lines[$i] = "$Key=$Value"; $found = $true } else { $lines.RemoveAt($i); $i-- }
        }
    }
    if (-not $found) { $lines.Add("$Key=$Value") }
    [IO.File]::WriteAllLines($EnvFile, $lines, (New-Object Text.UTF8Encoding($false)))
}

function New-RandomText([int]$Length) {
    $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    $bytes = New-Object byte[] $Length
    $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($bytes) } finally { $rng.Dispose() }
    -join ($bytes | ForEach-Object { $alphabet[$_ % $alphabet.Length] })
}

function New-AppKey {
    $bytes = New-Object byte[] 32
    $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($bytes) } finally { $rng.Dispose() }
    'base64:' + [Convert]::ToBase64String($bytes)
}

function Normalize-Tower {
    if ((Get-EnvValue 'ACADEMY_FEATURE_TOWER') -eq 'true') {
        Set-EnvValue 'ACADEMY_FEATURE_MCP' 'true'
        Set-EnvValue 'TOWER_ENABLED' 'true'
        Set-EnvValue 'TOWER_ACADEMY_MCP_IN_PROCESS' 'true'
    } else {
        Set-EnvValue 'TOWER_ENABLED' 'false'
    }
}

function Ensure-Env {
    $created = $false
    if (-not (Test-Path $EnvFile)) { Copy-Item $EnvExample $EnvFile; $created = $true }
    if (-not (Get-EnvValue 'APP_KEY')) { Set-EnvValue 'APP_KEY' (New-AppKey) }
    if (-not (Get-EnvValue 'DB_PASSWORD')) { Set-EnvValue 'DB_PASSWORD' (New-RandomText 40) }
    if (-not (Get-EnvValue 'ACADEMY_BOOTSTRAP_OWNER_EMAIL')) { Set-EnvValue 'ACADEMY_BOOTSTRAP_OWNER_EMAIL' 'owner@numacademy.local' }
    if (-not (Get-EnvValue 'ACADEMY_BOOTSTRAP_OWNER_PASSWORD')) { Set-EnvValue 'ACADEMY_BOOTSTRAP_OWNER_PASSWORD' (New-RandomText 24) }
    if (-not (Get-EnvValue 'TOWER_ACADEMY_MCP_TOKEN')) { Set-EnvValue 'TOWER_ACADEMY_MCP_TOKEN' ('num_mcp_' + (New-RandomText 64)) }
    $port = Get-EnvValue 'ACADEMY_PORT'; if (-not $port) { $port = '8080'; Set-EnvValue 'ACADEMY_PORT' $port }
    Set-EnvValue 'APP_URL' "http://localhost:$port"
    Set-EnvValue 'ACADEMY_VERSION' $AcademyVersion
    Normalize-Tower
    if ($created) {
        Write-Host "Configuration locale créée: $EnvFile"
        Write-Host "Compte initial: $(Get-EnvValue 'ACADEMY_BOOTSTRAP_OWNER_EMAIL')"
        Write-Host "Mot de passe initial: $(Get-EnvValue 'ACADEMY_BOOTSTRAP_OWNER_PASSWORD')"
        Write-Host 'Conservez ce fichier localement; il est ignoré par Git.'
    }
}

function Invoke-Compose([string[]]$ComposeArguments) {
    & docker compose --env-file $EnvFile -f $ComposeProd -f $ComposeLocal @ComposeArguments
    if ($LASTEXITCODE -ne 0) { throw "docker compose a échoué ($LASTEXITCODE)" }
}

function Check-Docker {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { throw "Docker n'est pas installé ou absent du PATH." }
    & docker compose version *> $null; if ($LASTEXITCODE -ne 0) { throw 'Docker Compose v2 est requis.' }
    & docker info *> $null; if ($LASTEXITCODE -ne 0) { throw "Docker est installé mais le daemon n'est pas accessible." }
}

function Wait-Health {
    $url = (Get-EnvValue 'APP_URL') + '/up'
    for ($i=0; $i -lt 90; $i++) {
        try { Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3 | Out-Null; Write-Host "READY — $url"; return } catch { Start-Sleep -Seconds 2 }
    }
    throw 'Le healthcheck ne répond pas. Utilisez num-academy.bat logs.'
}

function Invoke-Doctor {
    $failures = 0
    Write-Host 'NÜM Academy OS — Doctor'
    Write-Host "Version: $AcademyVersion"
    try { Check-Docker; Write-Host 'Docker / Compose: OK' } catch { Write-Host "ERREUR: $_"; $failures++ }
    Ensure-Env
    if (-not (Get-EnvValue 'APP_KEY')) { Write-Host 'ERREUR: APP_KEY manquante'; $failures++ }
    if (-not (Get-EnvValue 'DB_PASSWORD')) { Write-Host 'ERREUR: DB_PASSWORD manquant'; $failures++ }
    if ((Get-EnvValue 'ACADEMY_FEATURE_TOWER') -eq 'true') {
        if ((Get-EnvValue 'TOWER_ENABLED') -eq 'true' -and (Get-EnvValue 'ACADEMY_FEATURE_MCP') -eq 'true' -and (Get-EnvValue 'TOWER_ACADEMY_MCP_TOKEN')) { Write-Host 'Mission Tower + MCP: OK' }
        else { Write-Host 'ERREUR: Mission Tower / MCP incohérents'; $failures++ }
    }
    if ((Get-EnvValue 'ACADEMY_AI_PROVIDER') -eq 'disabled' -and (Get-EnvValue 'TOWER_ENABLED') -eq 'true') { Write-Host 'NOTE: Tower est lancée; Chat/Compiler nécessiteront un provider IA.' }
    if ($failures -eq 0) { try { Invoke-Compose @('config') *> $null; Write-Host 'Docker Compose config: OK' } catch { Write-Host "ERREUR: $_"; $failures++ } }
    if ($failures -eq 0) { Write-Host 'DOCTOR PASS'; return }
    throw "DOCTOR FAIL ($failures problème(s))"
}

function Show-Menu {
    while ($true) {
        Write-Host ''
        Write-Host 'NÜM Academy OS'
        Write-Host '──────────────────────────'
        Write-Host '1) Lancer Academy'
        Write-Host '2) Arrêter Academy'
        Write-Host '3) Redémarrer'
        Write-Host '4) Voir le statut'
        Write-Host '5) Voir les logs'
        Write-Host '6) Diagnostic'
        Write-Host '7) Ouvrir dans le navigateur'
        Write-Host '0) Quitter'
        switch (Read-Host '>') {
            '1' { Invoke-CommandName 'up' }
            '2' { Invoke-CommandName 'down' }
            '3' { Invoke-CommandName 'restart' }
            '4' { Invoke-CommandName 'status' }
            '5' { Invoke-CommandName 'logs' }
            '6' { Invoke-CommandName 'doctor' }
            '7' { Invoke-CommandName 'open' }
            '0' { return }
        }
    }
}

function Invoke-CommandName([string]$Name) {
    switch ($Name) {
        'up' { Check-Docker; Ensure-Env; Normalize-Tower; Write-Host 'Démarrage de NÜM Academy OS...'; Invoke-Compose @('up','-d','--build'); Wait-Health; Write-Host "Academy: $(Get-EnvValue 'APP_URL')"; if ((Get-EnvValue 'TOWER_ENABLED') -eq 'true') { Write-Host "Mission Tower: $(Get-EnvValue 'APP_URL')/tower" } }
        'down' { Check-Docker; Ensure-Env; Invoke-Compose @('down') }
        'restart' { Check-Docker; Ensure-Env; Invoke-Compose @('restart'); Wait-Health }
        'status' { Check-Docker; Ensure-Env; Invoke-Compose @('ps') }
        'logs' { Check-Docker; Ensure-Env; Invoke-Compose @('logs','-f','--tail=200','app','postgres','redis') }
        'doctor' { Invoke-Doctor }
        'open' { Ensure-Env; Start-Process (Get-EnvValue 'APP_URL') }
        'help' { Write-Host 'num-academy.bat [up|down|restart|status|logs|doctor|open|help]' }
        'menu' { Show-Menu }
    }
}

Invoke-CommandName $Command
