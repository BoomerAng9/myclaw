param (
    [string]$TargetHost = "aims-vps",
    [string]$RemoteDir = "/opt/myclaw",
    [string]$CommitMessage = "feat(phase6): deploy Okai, Perform, Blockwise, and Partners subdomains"
)

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🦅 Chicken Hawk — Phase 6 Verticals Push Sequence" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan

# ── 1. Commit and Push Local Changes ───────────────────────
Write-Host ""
Write-Host "[1/3] Committing and pushing local changes to GitHub..." -ForegroundColor Yellow
git add docker-compose.yml okai/ perform/ blockwise/ partners/
git commit -m $CommitMessage
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Local Git Push failed. Make sure you don't have pull conflicts before continuing."
    exit $LASTEXITCODE
}
Write-Host "  ✓ Changes pushed to repository." -ForegroundColor Green

# ── 2. Trigger VPS Pull ─────────────────────────────────────
Write-Host ""
Write-Host "[2/3] Triggering Git Pull on the VPS..." -ForegroundColor Yellow
ssh -t $TargetHost "cd ${RemoteDir} && git pull origin main"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "VPS Git Pull failed. Check SSH permissions."
    exit $LASTEXITCODE
}
Write-Host "  ✓ VPS repository updated." -ForegroundColor Green

# ── 3. Rebuild and Restart Docker Containers ─────────────────
Write-Host ""
Write-Host "[3/3] Rebuilding Docker Containers..." -ForegroundColor Yellow
ssh -t $TargetHost "cd ${RemoteDir} && docker compose up -d --build okai perform blockwise partners"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Docker rebuilding failed on the VPS."
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "[4/4] Applying Nginx Reverse Proxy Config for Verticals..." -ForegroundColor Yellow
scp deploy\vps\myclaw-nginx.conf "${TargetHost}:${RemoteDir}/myclaw-nginx.conf"
ssh -t $TargetHost "docker cp ${RemoteDir}/myclaw-nginx.conf aims-vps2-nginx:/etc/nginx/conf.d/myclaw.conf && docker exec aims-vps2-nginx nginx -s reload"
if ($LASTEXITCODE -ne 0) {
    Write-Warning "Nginx configuration reload failed on the VPS."
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host " ✅ Phase 6 Verticals deployed successfully." -ForegroundColor Green
Write-Host "    - https://ok.foai.cloud" -ForegroundColor Gray
Write-Host "    - https://perform.foai.cloud" -ForegroundColor Gray
Write-Host "    - https://blockwise.foai.cloud" -ForegroundColor Gray
Write-Host "    - https://partners.foai.cloud" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
