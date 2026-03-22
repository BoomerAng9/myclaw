---
name: SME_VPS_Project_Map
description: Use when Chicken Hawk needs the current map of VPS ownership, hosted services, local repositories, and the correct lil_hawk or SME skill to dispatch for infrastructure and project work
---

# VPS And Project Map

## Mission
Give Chicken Hawk a current, operational map of the three VPS nodes, the projects tied to them, and the dispatch rules that keep infra work separated from product work.

## Canonical Topology

### VPS1 — AIMS / Platform Node
- Public IP: `31.97.138.45`
- WireGuard: `10.0.0.2`
- Primary role: shared platform services and hosted static surfaces
- Key services: AIMS frontend, OpenSandbox, Plug Engine, Per|Form, Blockwise, Partners surfaces

### VPS2 — Compute / Business Ops Node
- Public IP: `76.13.96.107`
- WireGuard: `10.0.0.1`
- Primary role: business systems and secure execution
- Key services: Odoo, NemoClaw/OpenShell, ii-agent
- Optional service: LibreChat only when explicitly redeployed and validated

### VPS3 — Chicken Hawk / Control Node
- Public IP: `31.97.133.29`
- WireGuard: `10.0.0.3`
- Primary role: Chicken Hawk runtime and orchestration entrypoint
- Key services: OpenClaw/Chicken Hawk, Traefik, SimStudio, ByteRover-backed skills and memory

## Runtime Boundaries
- **Chicken Hawk / OpenClaw / MyClaw**: operator-facing runtime on VPS3
- **NemoClaw / OpenShell**: separate secure runtime on VPS2
- Do **not** collapse those two runtimes into one mental model
- Prefer WireGuard service URLs for private inter-node traffic and verification

## Local Repository Map

### `myclaw`
- Purpose: operations repo, skills library, deployment runbooks, FOAI surfaces, and multi-project glue code
- Important areas:
  - `skills/`: Chicken Hawk SME runbooks and operating skills
  - `deploy/vps/`: deployment references, configs, snapshots, workspace docs
  - `foai/`, `perform/`, `blockwise/`, `partners/`: hosted web surfaces
  - `okai/`, `acheevy-studio/`: product subprojects tied to FOAI and operator tooling

### `destinations-ai`
- Purpose: Next.js real-estate intelligence app
- Important areas:
  - `app/analyze/`, `app/flip/`, `app/k1/`: analysis workflows
  - `app/api/`: backend routes including media and AI endpoints
  - `lib/`: Gemini, VEO, NotebookLM, export, and neighborhood integration code

### `The-Perform-Platform`
- Purpose: separate Next.js sports/performance platform repo
- Treat as its own product surface even when hosted alongside FOAI properties

## Service Ownership Matrix
- WireGuard mesh: `SME_WireGuard`
- Traefik and external routes: `SME_Traefik`
- Chicken Hawk memory and reuse: `SME_CoPaw`
- SimStudio workflows: `SME_SimStudio`
- Odoo business ops: `SME_Odoo`
- NemoClaw secure runtime: `SME_NemoClaw`
- ii-agent research stack: `SME_iiAgent`
- LibreChat alt chat surface: `SME_LibreChat`

## Dispatch Rules
1. **Infra change across nodes**: spawn ACHEEVY first, then route to the matching SME skill
2. **Code change in a repo**: use CoPaw recall, then Coder_Ang, then Validator_Ang
3. **Workflow automation**: prefer `SME_SimStudio` or `SME_n8n_Transition` before discussing n8n
4. **Secure or policy-sensitive execution**: route to `SME_NemoClaw`
5. **Ops verification**: use WireGuard addresses first, public routes second

## Guardrails
- Snapshots, temporary exports, secret-bearing JSON, and one-off bootstrap scripts are not durable source artifacts
- Do not redeploy LibreChat or n8n by habit; verify the need and the replacement target first
- Do not expose a service publicly until the WireGuard-local health check passes
- After any successful infra task, store the pattern in ByteRover under the matching domain