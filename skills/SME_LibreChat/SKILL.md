# LibreChat — Multi-Model Chat Interface Management
# Chicken Hawk Management Skill

## Mission
Manage the LibreChat instance on VPS2 (`76.13.96.107` / `vps2`). LibreChat provides a multi-model chat interface with RAG capabilities, supporting OpenAI, Anthropic, Google, and other providers.

## Target Services
- **API**: `librechat-1apu-api-1` (port 3080 → host 32769)
- **RAG API**: `librechat-1apu-rag_api-1` (port 8000)
- **MongoDB**: `librechat-1apu-mongodb-1` (port 27017, mongo:8.0.17)
- **Vector DB**: `librechat-1apu-vectordb-1` (pgvector 0.8.0)
- **Meilisearch**: `librechat-1apu-meilisearch-1` (port 7700)
- **VPS**: VPS2 (`10.0.0.1` via WireGuard)
- **Compose**: `/opt/LibreChat/docker-compose.yml`

## Commands

### Health Check
```bash
ssh vps2 "docker ps --filter name=librechat --format '{{.Names}} {{.Status}}'"
ssh vps2 "curl -so /dev/null -w '%{http_code}' http://localhost:32769/"
```

### View Logs
```bash
ssh vps2 "docker logs librechat-1apu-api-1 --tail 50 2>&1"
```

### Restart
```bash
ssh vps2 "cd /opt/LibreChat && docker compose restart"
```

### Clean Redeploy
```bash
ssh vps2 "mkdir -p /opt/LibreChat"
scp myclaw/deploy/vps/librechat.yaml vps2:/opt/LibreChat/librechat.yaml
ssh vps2 "cd /opt/LibreChat && docker compose up -d"
```

### Fix Common Issues
**Missing librechat.yaml (causes "unhealthy" status):**
```bash
scp myclaw/deploy/vps/librechat.yaml vps2:/opt/LibreChat/librechat.yaml
ssh vps2 "docker restart librechat-1apu-api-1"
```

**Meilisearch not configured:**
Add `MEILI_MASTER_KEY` env var to docker-compose or `.env`.

## Known State
- LibreChat was intentionally pruned from VPS2 during cleanup and is **not expected to be running**
- Any future deployment must be treated as a fresh install, not an in-place repair
- The previous unhealthy state was caused by missing `/app/librechat.yaml`
- Search and RAG features require explicit Meilisearch and vector configuration before exposure

## Redeploy Guardrails
Only redeploy LibreChat when the owner explicitly wants a second chat surface in addition to Chicken Hawk.

Before exposing LibreChat publicly:

1. Confirm `librechat.yaml` exists and matches the current provider plan
2. Confirm MongoDB, pgvector, Meilisearch, and API containers are all healthy
3. Verify auth, registration policy, and allowed providers
4. Validate local access over WireGuard first
5. Only then add or restore public routing

## When LibreChat Is The Right Tool
- Multi-provider chat UI for humans who do not need Chicken Hawk's runtime workflow model
- RAG-first conversational access with configurable provider switching

## When LibreChat Is Not The Right Tool
- Chicken Hawk runtime orchestration
- Lil_Hawk dispatch, ByteRover memory, or operator automation
- Workflow automation that belongs in SimStudio or OpenClaw cron

## Integration with Chicken Hawk
LibreChat can serve as an alternative chat frontend. The `librechat.yaml` in the repo (`myclaw/deploy/vps/librechat.yaml`) configures:
- Gemini/Vertex AI endpoints
- ACHEEVY internal swarm endpoint
- Speech (TTS via ElevenLabs + OpenAI, STT via Whisper)
- Registration restricted to `asg@achievemor.io`
