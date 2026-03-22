# SimStudio — Workflow Engine Management
# Chicken Hawk Management Skill

## Mission
Manage the SimStudio (Sim) visual workflow builder running on VPS3 (`31.97.133.29` / `myclaw-vps`). SimStudio is the workflow automation engine that replaces n8n — it orchestrates AI agent workflows, data pipelines, and business automation.

## Target Service
- **Container**: `sim-studio-9fks-simstudio-1`
- **Port**: 32769 (mapped to 3000 internal)
- **Realtime**: `sim-studio-9fks-realtime-1` on port 32768
- **Database**: `sim-studio-9fks-postgres-1` on port 5432
- **VPS**: VPS3 (`10.0.0.3` via WireGuard)

## Commands

### Health Check
```bash
ssh myclaw-vps "docker ps --filter name=sim-studio --format '{{.Names}} {{.Status}}'"
ssh myclaw-vps "curl -sf http://localhost:32769/health || echo 'SimStudio unhealthy'"
```

### View Logs
```bash
ssh myclaw-vps "docker logs sim-studio-9fks-simstudio-1 --tail 50"
```

### Restart
```bash
ssh myclaw-vps "docker restart sim-studio-9fks-simstudio-1"
```

### List Workflows
Access via SimStudio API or UI at the mapped port.

## Lil_Hawk Dispatch Pattern
Use ACHEEVY as the coordinator and keep each hawk narrow:

1. **ACHEEVY**: define the SimStudio objective, dependencies, and verification gates
2. **Ops_Ang**: inspect container health, ports, storage mounts, and restart behavior
3. **Researcher_Ang**: gather SimStudio docs or API details when the UI or workflow model is unclear
4. **Coder_Ang**: apply compose, env, or integration fixes after evidence is gathered
5. **Validator_Ang**: verify health endpoints, login/UI reachability, and workflow execution traces

## Correct Setup Checklist
Before declaring SimStudio healthy, verify all of the following:

1. `sim-studio-9fks-simstudio-1`, realtime, and Postgres containers are all running
2. `http://localhost:32769` serves the app and does not loop or error
3. Realtime connectivity is present and not failing due to missing env or CORS issues
4. Persistent data is mounted and survives container restart
5. Any external integrations or webhooks are documented in ByteRover after validation

## n8n Replacement Rule
- Do **not** introduce new n8n workloads by default
- Prefer SimStudio for visual multi-step automation and external integrations
- Prefer OpenClaw cron + skills for scheduled maintenance or operator routines
- Prefer OpenSandbox or NemoClaw when the workflow needs isolated execution or policy control

## Common Failure Modes
- **UI up, workflows broken**: inspect env vars, realtime service, and API credentials
- **Containers healthy, app unreachable**: verify port mapping, Traefik route, and local firewall
- **Workflows save but do not fire**: check trigger registration, webhook targets, and background worker logs
- **Postgres present but state lost**: inspect volume mounts before restarting anything

## Capabilities
- 160+ native integrations (AI models, communication, databases)
- Visual drag-and-drop workflow canvas
- MCP (Model Context Protocol) support for custom integrations
- Copilot for AI-assisted workflow building
- REST API, webhook, and cron triggers

## When to Use SimStudio vs Other Tools
- **Workflow orchestration**: SimStudio (replaces n8n)
- **Form intake / payments**: Paperform Stepper API
- **Scheduled routines**: OpenClaw cron + skills
- **Isolated code execution**: OpenSandbox
