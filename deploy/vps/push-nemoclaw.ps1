param (
    [string]$TargetHost = "myclaw-vps",
    [string]$RemoteDir = "/opt/openclaw"
)

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host " 🦅 Chicken Hawk — NemoClaw Remote Deployment" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan

# ── 1. Upload the deployment script ───────────────────────────
Write-Host ""
Write-Host "[1/3] Uploading deploy-nemoclaw.sh to VPS..." -ForegroundColor Yellow
scp .\deploy-nemoclaw.sh "${TargetHost}:${RemoteDir}/deploy-nemoclaw.sh"
ssh $TargetHost "chmod +x ${RemoteDir}/deploy-nemoclaw.sh"
Write-Host "  ✓ Script uploaded." -ForegroundColor Green

# ── 2. Execute the deployment ─────────────────────────────────
Write-Host ""
Write-Host "[2/3] Executing NemoClaw deployment on VPS..." -ForegroundColor Yellow
Write-Host "  This will install NemoClaw and create the Chicken Hawk agent." -ForegroundColor Gray
Write-Host "  The onboard wizard may require interactive input." -ForegroundColor Gray
Write-Host ""
ssh -t $TargetHost "cd ${RemoteDir} && ./deploy-nemoclaw.sh"

# ── 3. Verify ─────────────────────────────────────────────────
Write-Host ""
Write-Host "[3/3] Verifying NemoClaw status..." -ForegroundColor Yellow
ssh $TargetHost "nemoclaw chicken-hawk status 2>/dev/null || echo 'Agent not yet configured — run nemoclaw onboard on VPS.'"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host " ✅ NemoClaw deployment sequence complete." -ForegroundColor Green
Write-Host "    Connect:  ssh $TargetHost 'nemoclaw chicken-hawk connect'" -ForegroundColor Gray
Write-Host "    Logs:     ssh $TargetHost 'nemoclaw chicken-hawk logs --follow'" -ForegroundColor Gray
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
