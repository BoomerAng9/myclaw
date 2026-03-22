# ii-agent — Autonomous Research Agent Management
# Chicken Hawk Management Skill

## Mission
Manage the ii-agent (Intelligent Internet Agent) deployment on VPS2 (`76.13.96.107` / `vps2`). ii-agent is an autonomous research agent with a browser sandbox, tool server, and web frontend for conducting deep internet research tasks.

## Target Services
- **Backend**: `docker-backend-1` (port 8000)
- **Frontend**: `docker-frontend-1` (port 1420)
- **Tool Server**: `docker-tool-server-1` (port 1236)
- **Sandbox**: `docker-sandbox-server-1` (port 8100)
- **Database**: `docker-postgres-1` (Postgres 15, port 5433)
- **Cache**: `docker-redis-1` (Redis 7, port 6380)
- **Static App**: `ii-agent-stack-app-1` (nginx, port 8081)
- **VPS**: VPS2 (`10.0.0.1` via WireGuard)
- **Compose**: `/root/ii-agent/docker/docker-compose.stack.yaml`

## Commands

### Health Check
```bash
ssh vps2 "docker ps --filter name=docker- --format '{{.Names}} {{.Status}}'"
ssh vps2 "curl -sf http://localhost:8000/health || echo 'Backend unhealthy'"
```

### View Logs
```bash
ssh vps2 "docker logs docker-backend-1 --tail 50 2>&1"
```

### Restart Stack
```bash
ssh vps2 "cd /root/ii-agent/docker && docker compose -f docker-compose.stack.yaml restart"
```

### Access Frontend
- Direct: `http://76.13.96.107:1420`
- Via WireGuard: `http://10.0.0.1:1420`

## Architecture
- Backend serves the agent API and orchestrates research tasks
- Tool server provides MCP-compatible tool endpoints
- Sandbox server runs browser automation in isolation
- Frontend provides the chat/research UI
- ngrok was removed (crash-looping) — use WireGuard for access

## Notes
- The `docker-compose.stack.yaml` is at `/root/ii-agent/docker/`
- ii-agent-stack-app (nginx on 8081) is a separate compose at `/docker/ii-agent-stack/`
- ngrok service was intentionally removed during VPS2 pruning
- Port 8080 was freed for NemoClaw by remapping nginx to 8081
