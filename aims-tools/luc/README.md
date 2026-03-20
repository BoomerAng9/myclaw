# LUC (Ledger Usage Calculator)

**Version 2.0** — Re-engineered Standalone Base

## Overview
LUC is the A.I.M.S. ledger and estimation tool that provides pre-flight cost analysis, live transaction routing limits, and policy gating. 

This engine is natively separated from external UI elements to enforce the rule: **Every capability call is gated and metered securely**. The UI is strictly a visual consumer of these API methods, not an execution space.

## Architecture

1. **LUC engine (`luc.engine.ts`)**: Headless pure functions mapping units to usage limits natively supporting the `ByteRover` discount rules.
2. **LUC Adapters (`luc.adapters.ts`)**: Integrations built strictly for external orchestration (like n8n, OpenClaw webhooks, ACHEEVY routines).
3. **LUC UI (`ui/*`)**: Next.js-ready Workspace Components. React hooks built natively for `/workspace/luc` representing Simulated Ledger Checks.
4. **LUC Storage (`luc.storage.ts`)**: Persistent JSON File store appending usage limits transparently.

## Installation / Mounting

The module can be mounted anywhere inside the ACHEEVY Port Authority.

```bash
# Typical React Usage:
import { LucPanel } from '@/aims-tools/luc/ui/LucPanel';

export default function Workspace() {
  return <LucPanel />;
}

# Backend Gateway Handlers:
// Pass requests to `handleSimulate` or `handleStatus` in api/luc.routes.ts
```

## Security

* No Provider API Keys are routed securely inside the UI client layer.
* Agents natively respect Quota state before calling outbound logic. 
* CFO_Ang strictly blocks access at > 110% Overages or flags warning layers.
