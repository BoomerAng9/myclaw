param (
    [string]$TargetHost = "myclaw-vps",
    [string]$RemoteRoot = "/docker/openclaw-sop5",
    [string]$LocalConfigPath = "$PSScriptRoot/openclaw.config.hostinger.json",
    [string]$LocalSnapshotDir = "$PSScriptRoot/snapshots",
    [switch]$PullCurrent,
    [switch]$PushConfig,
    [switch]$Restart
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not $PullCurrent -and -not $PushConfig) {
    $PullCurrent = $true
}

$remoteConfigPath = "$RemoteRoot/data/.openclaw/openclaw.json"
$remoteComposePath = "$RemoteRoot/docker-compose.yml"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$secretPlaceholderValues = @(
    "SET_IN_REMOTE_CONFIG_OR_ENV",
    "KEEP_REMOTE_SECRET"
)
$preservedSecretPaths = @(
    @("plugins", "entries", "telegram", "token"),
    @("hooks", "token"),
    @("gateway", "auth", "token"),
    @("gateway", "remote", "token")
)

function Assert-NoInlineProviderSecrets {
    param([hashtable]$Config)

    $modelsSection = $Config["models"]
    if ($null -eq $modelsSection) {
        return
    }

    $providerMap = $modelsSection["providers"]
    if ($null -eq $providerMap) {
        return
    }

    foreach ($providerName in $providerMap.Keys) {
        $provider = $providerMap[$providerName]
        if ($provider.ContainsKey("apiKey") -and -not [string]::IsNullOrWhiteSpace([string]$provider["apiKey"])) {
            throw "Provider '$providerName' contains an inline apiKey. Provider credentials are managed in Hostinger env, not openclaw.json. Remove models.providers.$providerName.apiKey before pushing."
        }
    }
}

function Get-NestedValue {
    param(
        [hashtable]$Data,
        [string[]]$Path
    )

    $current = $Data
    foreach ($segment in $Path) {
        if ($current -is [hashtable]) {
            if (-not $current.ContainsKey($segment)) {
                return $null
            }
            $current = $current[$segment]
            continue
        }

        return $null
    }

    return $current
}

function Set-NestedValue {
    param(
        [hashtable]$Data,
        [string[]]$Path,
        [object]$Value
    )

    $current = $Data
    for ($index = 0; $index -lt ($Path.Length - 1); $index++) {
        $segment = $Path[$index]
        if (-not $current.ContainsKey($segment) -or $null -eq $current[$segment]) {
            $current[$segment] = @{}
        }
        $current = $current[$segment]
    }

    $current[$Path[-1]] = $Value
}

function Merge-RemoteSecrets {
    param(
        [hashtable]$LocalConfig,
        [hashtable]$RemoteConfig
    )

    foreach ($secretPath in $preservedSecretPaths) {
        $localValue = Get-NestedValue -Data $LocalConfig -Path $secretPath
        $shouldPreserve = $null -eq $localValue -or $secretPlaceholderValues -contains [string]$localValue
        if (-not $shouldPreserve) {
            continue
        }

        $remoteValue = Get-NestedValue -Data $RemoteConfig -Path $secretPath
        if ([string]::IsNullOrWhiteSpace([string]$remoteValue)) {
            continue
        }

        Set-NestedValue -Data $LocalConfig -Path $secretPath -Value $remoteValue
    }
}

function Invoke-Remote {
    param([string]$Command)

    & ssh $TargetHost $Command
    if ($LASTEXITCODE -ne 0) {
        throw "Remote command failed: $Command"
    }
}

function Copy-FromRemote {
    param(
        [string]$RemotePath,
        [string]$LocalPath
    )

    & scp "${TargetHost}:${RemotePath}" $LocalPath
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to copy ${RemotePath} from ${TargetHost}"
    }
}

function Copy-ToRemote {
    param(
        [string]$LocalPath,
        [string]$RemotePath
    )

    & scp $LocalPath "${TargetHost}:${RemotePath}"
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to copy ${LocalPath} to ${TargetHost}:${RemotePath}"
    }
}

Write-Host "Inspecting live OpenClaw deployment on ${TargetHost}..." -ForegroundColor Cyan
Invoke-Remote "test -f '$remoteConfigPath' && test -f '$remoteComposePath'"

if ($PullCurrent) {
    $snapshotDir = Join-Path $LocalSnapshotDir $timestamp
    New-Item -ItemType Directory -Path $snapshotDir -Force | Out-Null

    Write-Host "Pulling current OpenClaw config snapshot..." -ForegroundColor Yellow
    Copy-FromRemote -RemotePath $remoteConfigPath -LocalPath (Join-Path $snapshotDir "openclaw.json")
    Copy-FromRemote -RemotePath $remoteComposePath -LocalPath (Join-Path $snapshotDir "docker-compose.yml")

    Write-Host "Snapshot written to $snapshotDir" -ForegroundColor Green
    Write-Host "Note: provider credentials remain in Hostinger env / remote .env and were not copied locally." -ForegroundColor DarkYellow
}

if ($PushConfig) {
    if (-not (Test-Path -LiteralPath $LocalConfigPath)) {
        throw "Local config file not found: $LocalConfigPath"
    }

    Write-Host "Validating local OpenClaw config JSON..." -ForegroundColor Yellow
    $localConfig = Get-Content -LiteralPath $LocalConfigPath -Raw | ConvertFrom-Json -AsHashtable
    Assert-NoInlineProviderSecrets -Config $localConfig
    Write-Host "Provider auth check passed. This push only updates openclaw.json; Hostinger env remains the source of truth for provider secrets." -ForegroundColor DarkYellow

    $temporaryRemoteConfig = Join-Path ([System.IO.Path]::GetTempPath()) "openclaw.remote.${timestamp}.json"
    $temporaryPushConfig = Join-Path ([System.IO.Path]::GetTempPath()) "openclaw.push.${timestamp}.json"
    Copy-FromRemote -RemotePath $remoteConfigPath -LocalPath $temporaryRemoteConfig
    $remoteConfig = Get-Content -LiteralPath $temporaryRemoteConfig -Raw | ConvertFrom-Json -AsHashtable
    Merge-RemoteSecrets -LocalConfig $localConfig -RemoteConfig $remoteConfig
    $localConfig | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $temporaryPushConfig -Encoding utf8

    $remoteBackupPath = "${remoteConfigPath}.bak.${timestamp}"
    Write-Host "Backing up remote OpenClaw config to $remoteBackupPath" -ForegroundColor Yellow
    Invoke-Remote "cp '$remoteConfigPath' '$remoteBackupPath'"

    Write-Host "Uploading local OpenClaw config..." -ForegroundColor Yellow
    Copy-ToRemote -LocalPath $temporaryPushConfig -RemotePath $remoteConfigPath

    if ($Restart) {
        Write-Host "Restarting OpenClaw stack..." -ForegroundColor Yellow
        Invoke-Remote "cd '$RemoteRoot' && docker compose up -d"
    }

    Remove-Item -LiteralPath $temporaryRemoteConfig -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $temporaryPushConfig -Force -ErrorAction SilentlyContinue

    Write-Host "OpenClaw config upload completed." -ForegroundColor Green
}
