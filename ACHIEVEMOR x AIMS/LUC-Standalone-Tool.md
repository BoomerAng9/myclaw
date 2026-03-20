# LUC Standalone Tool (A.I.M.S. Standard)
**Title:** LUC Standalone Tool (Ledger Usage Calculator) — A.I.M.S. Core Tool Spec  
**Date:** 2026-02-05  
**Status:** Paste-ready / Implementation Target  
**Owner (PMO):** Finance PMO (`CFO_Ang`)  
**Applies to:** A.I.M.S. Port + Longshoremen + Port Authority Gateway

---

## 1) Purpose

LUC is the A.I.M.S. **ledger + estimation** tool that provides:
- **Cost / usage estimation** (preflight)
- **Policy gating** (`canExecute`) before any billable action runs
- **Usage recording** (`recordUsage`) after execution (with metadata)
- **Quota visibility** (UI-safe summary objects for banners, warnings, and status strips)

LUC must be implemented as a **standalone tool** so it can be reused by:
- ACHEEVY orchestration loop
- Boomer_Ang execution flows
- n8n workflows (via Port Authority capability calls)
- Workspace UI (calculator + status strip)
- Admin/billing automation

---

## 2) Non‑negotiables

1. **No provider keys in the user’s hands.** Metering is per tenant/workspace.
2. **Every capability call is gated and metered through LUC.**
3. **Plans are policy.** Do not hardcode plan limits into services; load from policy sources.
4. **UI is a consumer, not a calculator.** All math lives in the headless engine.

---

## 3) Canonical Names

- Tool name: **LUC**
- Expansion: **Ledger Usage Calculator**
- Tool ID: `aims.luc`
- Owner Boomer_Ang: `CFO_Ang`

---

## 4) Filesystem Contract (Recommended)

Create a tool module that is brand-neutral and reusable:

```
/aims-tools/luc/
├─ tool.manifest.ts          // Tool registration + service catalog
├─ luc.engine.ts             // Pure functions: estimate/gate/record
├─ luc.schemas.ts            // Input/output schemas (ACP/MCP safe)
├─ luc.adapters.ts           // Bindings for orchestrator/UI/n8n/ORACLE
├─ luc.constants.ts          // Service keys, unit semantics, defaults
└─ README.md                 // Internal contract (not marketing)
```

### UI Surface (Optional but standard)
```
/app/workspace/luc/page.tsx      // Workspace page wrapper only
/components/luc/LucPanel.tsx     // UI that calls luc.adapters.ts
/components/shell/StatusStrip.tsx // Displays LUC + Active Boomer_Angs
```

Rule: `page.tsx` and UI components **must not** contain pricing math.

---

## 5) LUC Service Catalog (v1 minimum)

Service keys are stable identifiers used for metering and policy.

Minimum v1 catalog:
- `llm_tokens_in`
- `llm_tokens_out`
- `n8n_executions`
- `node_runtime_seconds`
- `swarm_cycles`
- `brave_queries`
- `voice_chars`
- `stt_minutes`
- `container_hours`
- `storage_gb_month`
- `bandwidth_gb`

> Add new keys only through the tool registry / manifest process.

---

## 6) Data Model

### 6.1 Identity
- `useramountid`: a stable ID per tenant/workspace used for allocation and metering.

### 6.2 Usage Record
Store usage as immutable events plus an aggregated quota state.

Recommended collections:
- `luc_accounts/{useramountid}` (current state)
- `luc_events/{useramountid}/events/{eventId}` (append-only)

### 6.3 Account State (example shape)
```json
{
  "useramountid": "ua_123",
  "plan_id": "starter",
  "period_start": "2026-02-01T00:00:00Z",
  "period_end": "2026-03-01T00:00:00Z",
  "quotas": {
    "brave_queries": { "limit": 100, "used": 34, "overage_units": 0 },
    "llm_tokens_in": { "limit": 200000, "used": 45000, "overage_units": 0 }
  },
  "overage_policy": {
    "soft_warn_pct": 0.80,
    "hard_block_pct": 1.10
  }
}
```

---

## 7) Core API (Headless Engine)

### 7.1 `estimate()`
Purpose: return a projection without mutating state.

Input:
- `useramountid`
- `service_key`
- `units_estimate`
- `context_factors` (complexity, expected context size, ByteRover delta, etc.)

Output:
- `units_estimate`
- `projected_used`
- `projected_overage_units`
- `projected_cost` (if overage applies)
- `confidence` (0–1)
- `ui_breakdown` (safe display object)

### 7.2 `canExecute()`
Purpose: hard gate before the tool runs.

Input:
- `useramountid`
- `service_key`
- `units_estimate`

Output:
- `allowed: boolean`
- `reason_code` (e.g., `OK`, `SOFT_WARN`, `HARD_BLOCK`)
- `remaining_units`
- `ui_banner` (optional)

### 7.3 `recordUsage()`
Purpose: append an event and update aggregates.

Input:
- `useramountid`
- `service_key`
- `units_actual`
- `metadata` (tool_id, route, Boomer_Ang owner, request_id, timestamps, etc.)

Output:
- updated quota state
- cost deltas (if any)
- reference to event id

### 7.4 `creditUsage()` (optional but recommended)
Purpose: rollback on partial failures or cancellations.

---

## 8) Mandatory Orchestration Wiring

Every billable capability call must follow:

1. `LUC.canExecute(useramountid, service_key, units_estimate)`
2. If allowed → execute capability through Port Authority
3. `LUC.recordUsage(useramountid, service_key, units_actual, metadata)`
4. Return: tool result + `luc_state` (for UI + logs)

This rule applies to:
- LLM calls
- search
- voice/STT
- container runs
- n8n executions
- swarm cycles
- storage/bandwidth tracked events

---

## 9) Boomer_Ang + Coding Agent Target Map

When implementing or modifying LUC, the coding agent must target only:

Backend / tool:
- `/aims-tools/luc/**`
- Orchestrator routes/services that expose `api/luc/*` via Port Authority

Frontend:
- `/app/workspace/luc/page.tsx`
- `/components/luc/*`
- `/components/shell/StatusStrip.tsx`

Must not:
- directly call Stripe/Square from LUC engine
- hardcode plan limits (treat as policy input)
- embed pricing logic in UI

---

## 10) UI Hooks

### 10.1 Status Strip (Global Shell)
Displays:
- Active Boomer_Angs (count + names if permitted)
- LUC state: % used, warning, projected overage
- Link to `/workspace/luc`

### 10.2 Standalone Calculator Tool
Route: `/workspace/luc`

Capabilities:
- pick `service_key`
- enter `units`
- show estimate + quota impact + warnings
- “simulate” mode (estimate only) vs “live” mode (reflect current state)

---

## 11) Acceptance Criteria

- A single headless LUC engine is callable from orchestration and UI.
- All billable actions are gated by `canExecute` and recorded by `recordUsage`.
- UI shows warnings at configured thresholds (default: 80% soft warn).
- Output always includes a UI-safe `luc_state` object for banners/status strip.
- Tool registry/manifest exists and includes stable service keys.

---

## 12) Implementation Notes (Do Not Brand)

- Do not include legacy product names or typography references in code comments or UI copy.
- Keep naming neutral and aligned to A.I.M.S. components only.
