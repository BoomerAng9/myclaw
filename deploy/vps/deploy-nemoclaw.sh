#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# deploy-nemoclaw.sh — Deploy NVIDIA NemoClaw on VPS
# Run this FROM the VPS (or via SSH from local)
# ═══════════════════════════════════════════════════════════════
set -euo pipefail

echo "═══════════════════════════════════════════════════════"
echo " 🦅 Chicken Hawk — NemoClaw Deployment"
echo " Installing NVIDIA NemoClaw Agent Runtime"
echo "═══════════════════════════════════════════════════════"

# ── 1. Pre-flight checks ─────────────────────────────────────
echo ""
echo "[1/5] Pre-flight checks..."

# Check OS
if ! grep -qi "ubuntu" /etc/os-release 2>/dev/null; then
    echo "⚠️  Warning: NemoClaw recommends Ubuntu 22.04+. Continuing anyway..."
fi

# Check Docker
if ! command -v docker &>/dev/null; then
    echo "❌ Docker is not installed. Installing..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker && systemctl start docker
    echo "✅ Docker installed."
else
    echo "✅ Docker: $(docker --version)"
fi

# Check Node.js v20+
if ! command -v node &>/dev/null; then
    echo "⚠️  Node.js not found. NemoClaw installer will handle it."
else
    NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VER" -lt 20 ]; then
        echo "⚠️  Node.js v${NODE_VER} detected. Need v20+. NemoClaw installer will upgrade."
    else
        echo "✅ Node.js: $(node -v)"
    fi
fi

# Check resources
VCPUS=$(nproc)
RAM_GB=$(free -g | awk '/Mem:/{print $2}')
DISK_GB=$(df -BG / | awk 'NR==2{print $4}' | tr -d 'G')
echo "   vCPUs: ${VCPUS} (min: 4)"
echo "   RAM:   ${RAM_GB}GB (min: 8)"
echo "   Disk:  ${DISK_GB}GB free (min: 20)"

if [ "$VCPUS" -lt 4 ] || [ "$RAM_GB" -lt 8 ] || [ "$DISK_GB" -lt 20 ]; then
    echo "⚠️  System may not meet minimum requirements. Proceeding anyway..."
fi

# ── 2. Install NemoClaw ───────────────────────────────────────
echo ""
echo "[2/5] Downloading and installing NemoClaw..."
curl -fsSL https://nvidia.com/nemoclaw.sh | bash

# ── 3. Onboard the Chicken Hawk Agent ─────────────────────────
echo ""
echo "[3/5] Running NemoClaw onboard wizard..."
echo "  This will create an isolated sandbox and configure inference models."
nemoclaw onboard

# ── 4. Create the Chicken Hawk agent ──────────────────────────
echo ""
echo "[4/5] Creating Chicken Hawk agent instance..."

# Check if agent already exists
if nemoclaw chicken-hawk status &>/dev/null 2>&1; then
    echo "  Agent 'chicken-hawk' already exists. Skipping creation."
else
    echo "  Creating agent 'chicken-hawk'..."
    nemoclaw create chicken-hawk \
        --model "gemini-3.1-pro" \
        --description "The Master AI — OpenClaw Make It Mine Edition" \
        --sandbox-type docker \
        2>/dev/null || echo "  ℹ️  Manual agent creation may be required via 'nemoclaw onboard'."
fi

# ── 5. Connect and verify ─────────────────────────────────────
echo ""
echo "[5/5] Verifying deployment..."
nemoclaw chicken-hawk status || echo "  ℹ️  Agent may need manual configuration."

echo ""
echo "═══════════════════════════════════════════════════════"
echo " ✅ NemoClaw deployment complete."
echo ""
echo " Connect:  nemoclaw chicken-hawk connect"
echo " Status:   nemoclaw chicken-hawk status"
echo " Logs:     nemoclaw chicken-hawk logs --follow"
echo "═══════════════════════════════════════════════════════"
