param (
    [string]$TargetHost = "myclaw-vps",
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

# ── Voice-First: Inject STT/TTS Environment Variables ──────────
Write-Host "🎙️ Injecting Voice-First environment variables..." -ForegroundColor Magenta
$envUpdates = @(
    "# ── Chicken Hawk Voice-First Layer ──",
    "OPENAI_API_KEY=${env:OPENAI_API_KEY}",
    "ELEVENLABS_API_KEY=${env:ELEVENLABS_API_KEY}",
    "STT_API_KEY=${env:OPENAI_API_KEY}",
    "TTS_API_KEY=${env:OPENAI_API_KEY}"
)
$envContent = $envUpdates -join "`n"
# Append to the remote .env (idempotent: grep first)
ssh $TargetHost "grep -q 'Chicken Hawk Voice-First' ${RemoteDir}/.env 2>/dev/null || echo '$envContent' >> ${RemoteDir}/.env"
Write-Host "  ✓ Voice env vars injected." -ForegroundColor Green

Write-Host "🔄 Restarting OpenClaw Docker Stack..." -ForegroundColor Blue
ssh $TargetHost "cd ${RemoteDir} && docker-compose down && docker-compose up -d"

Write-Host "✅ OpenClaw (Chicken Hawk) synchronized with Voice-First config." -ForegroundColor Green
