param (
    [string]$TargetHost = "root@app.myclaw.foai.cloud",
    [string]$RemoteDir = "/opt/openclaw"
)

Write-Host "🚀 Initializing OpenClaw Sync from MyClaw Workspace..." -ForegroundColor Cyan

# Ensure keys and connection
Write-Host "Verifying VPS connection..." -ForegroundColor Gray
# Note: Ensure ssh-agent is running or identity is loaded
$testConn = ping "app.myclaw.foai.cloud" -n 1
if (-not $?) {
    Write-Warning "Cannot ping app.myclaw.foai.cloud. Ensure DNS is resolved."
}

Write-Host "📦 Pushing Core Configuration (librechat.yaml)..." -ForegroundColor Yellow
scp .\librechat.yaml "${TargetHost}:${RemoteDir}/librechat.yaml"

Write-Host "⚙️ Pushing Internal ACHEEVY Actions Schema (openclaw-actions.yaml)..." -ForegroundColor Yellow
scp .\openclaw-actions.yaml "${TargetHost}:${RemoteDir}/plugins/openclaw-actions.yaml"

Write-Host "🔄 Restarting OpenClaw Docker Containers..." -ForegroundColor Blue
ssh $TargetHost "cd ${RemoteDir} && docker-compose restart api"

Write-Host "✅ OpenClaw successfully synchronized and managed from local MyClaw workspace." -ForegroundColor Green
