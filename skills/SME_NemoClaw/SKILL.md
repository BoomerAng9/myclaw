# NemoClaw — NVIDIA Agent Runtime Management
# Chicken Hawk Management Skill

## Mission
Manage the NemoClaw/OpenShell deployment on VPS2 (`76.13.96.107` / `vps2`). NemoClaw is NVIDIA's enterprise-grade secure agent runtime built on OpenShell. It provides sandboxed execution, policy enforcement, and inference routing — separate from the OpenClaw instance on VPS3.

## Target Service
- **CLI**: `nemoclaw` (installed at `/usr/bin/nemoclaw`)
- **Gateway**: `nemoclaw` at `https://127.0.0.1:8080`
- **OpenShell**: `openshell 0.0.13`
- **Sandbox**: `my-assistant`
- **Inference**: NVIDIA provider, model `nvidia/llama-3.3-nemotron-super-49b-v1`
- **VPS**: VPS2 (`10.0.0.1` via WireGuard)

## Commands

### Status
```bash
ssh vps2 "nemoclaw list"
ssh vps2 "nemoclaw my-assistant status"
ssh vps2 "nemoclaw status"
```

### Connect to Sandbox Shell
```bash
ssh -t vps2 "nemoclaw my-assistant connect"
```

### View Logs
```bash
ssh vps2 "nemoclaw my-assistant logs --follow"
```

### Gateway Health
```bash
ssh vps2 "openshell status"
ssh vps2 "openshell inference get"
ssh vps2 "openshell provider list"
```

### Policy Management
```bash
ssh vps2 "nemoclaw my-assistant policy-list"
ssh vps2 "nemoclaw my-assistant policy-add"
```

### Destroy and Recreate
```bash
ssh vps2 "nemoclaw my-assistant destroy --yes"
ssh vps2 "NEMOCLAW_NON_INTERACTIVE=1 NVIDIA_API_KEY=<key> nemoclaw onboard"
```

## Architecture Notes
- NemoClaw is SEPARATE from OpenClaw on VPS3 — different config, state, ports
- OpenShell gateway intercepts inference calls for policy enforcement
- k3s cluster manages the gateway pod internally
- Port 8080: OpenShell gateway (was remapped from ii-agent nginx to 8081)
- Port 18789: NemoClaw dashboard (forwarded to sandbox)
- No GPU — uses cloud inference via NVIDIA API

## Isolation from OpenClaw
| | OpenClaw (VPS3) | NemoClaw (VPS2) |
|---|---|---|
| Config | `/docker/openclaw-sop5/` | `/root/.nemoclaw/` |
| Gateway | Traefik on 443 | OpenShell on 8080 |
| Dashboard | `app.myclaw.foai.cloud` | `127.0.0.1:18789` |
| Channels | Telegram, Discord, WhatsApp | Internal only (for now) |
