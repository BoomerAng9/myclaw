#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# A.I.M.S. Hub — Deployment Script (aims-tools only)
# Syncs the governance engine to VPS without touching product spokes
# ═══════════════════════════════════════════════════════════════

set -e

VPS_HOST="aims-vps"
VPS_USER=""
SSH_TARGET="aims-vps"
REMOTE_DIR="/root/aims/aims-tools"
LOCAL_DIR="$(cd "$(dirname "$0")/../../aims-tools" && pwd)"

echo "═══════════════════════════════════════════════════"
echo "  A.I.M.S. Hub — Deploy aims-tools to VPS"
echo "  Target: ${SSH_TARGET}:${REMOTE_DIR}"
echo "═══════════════════════════════════════════════════"

# ── Step 1: Sync aims-tools ──────────────────────────────────
echo ""
echo "[1/2] Syncing aims-tools to VPS..."
rsync -avz --delete \
  --exclude='node_modules' \
  "${LOCAL_DIR}/" "${SSH_TARGET}:${REMOTE_DIR}/"

echo "  ✓ aims-tools synced."

# ── Step 2: Verify ───────────────────────────────────────────
echo ""
echo "[2/2] Verifying file structure on VPS..."
ssh ${SSH_TARGET} "ls -la ${REMOTE_DIR}/luc/"

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✓ A.I.M.S. Hub sync complete."
echo "  LUC engine deployed to: ${REMOTE_DIR}/luc/"
echo "═══════════════════════════════════════════════════"
