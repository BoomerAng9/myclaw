#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# MyClaw Spoke — Deployment Script
# Deploys the MyClaw landing page + Guide_Ang chat to VPS
# ═══════════════════════════════════════════════════════════════

set -e

# ── Configuration ─────────────────────────────────────────────
VPS_HOST="myclaw-vps"
VPS_USER=""
SSH_TARGET="myclaw-vps"
REMOTE_DIR="/docker/myclaw"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "═══════════════════════════════════════════════════"
echo "  MyClaw Spoke — Deploy to VPS"
echo "  Target: ${SSH_TARGET}:${REMOTE_DIR}"
echo "═══════════════════════════════════════════════════"

# ── Step 1: Sync Files ────────────────────────────────────────
echo ""
echo "[1/4] Syncing files to VPS..."
rsync -avz --delete \
  --exclude='.git' \
  --exclude='.venv' \
  --exclude='node_modules' \
  --exclude='ACHIEVEMOR x AIMS' \
  --exclude='aims-tools' \
  --exclude='perform' \
  --exclude='blockwise' \
  --exclude='data' \
  --exclude='docs' \
  --exclude='*.py' \
  --exclude='*.txt' \
  --exclude='*.pdf' \
  --exclude='*.xlsx' \
  --exclude='*.pptx' \
  --exclude='*.webm' \
  "${LOCAL_DIR}/" "${SSH_TARGET}:${REMOTE_DIR}/"

echo "  ✓ Files synced."

# ── Step 2: Build Container ──────────────────────────────────
echo ""
echo "[2/4] Building Docker container on VPS..."
ssh ${SSH_TARGET} "cd ${REMOTE_DIR} && docker compose build --no-cache"
echo "  ✓ Container built."

# ── Step 3: Restart Service ──────────────────────────────────
echo ""
echo "[3/4] Restarting MyClaw service..."
ssh ${SSH_TARGET} "cd ${REMOTE_DIR} && docker compose down && docker compose up -d"
echo "  ✓ Service restarted."

# ── Step 4: Verify ───────────────────────────────────────────
echo ""
echo "[4/4] Verifying deployment..."
sleep 3
STATUS=$(ssh ${SSH_TARGET} "docker ps --filter name=myclaw --format '{{.Status}}'")
echo "  Container status: ${STATUS}"

if [[ "${STATUS}" == *"Up"* ]]; then
  echo ""
  echo "═══════════════════════════════════════════════════"
  echo "  ✓ DEPLOYMENT SUCCESSFUL"
  echo "  Live at: https://myclaw.foai.cloud"
  echo "═══════════════════════════════════════════════════"
else
  echo ""
  echo "  ✗ Container may not be running. Check with:"
  echo "    ssh ${SSH_TARGET} 'docker logs myclaw-myclaw-1'"
  exit 1
fi
