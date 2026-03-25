---
name: SME_Agent_ACHEEVY_009_Config
description: "Configuration reference from Agent-ACHEEVY-009 (II-Agent fork). MCP settings, deployment patterns, WebSocket server, and AIMS bridge configs."
---

# SME_Ang Skill: Agent-ACHEEVY-009 Configuration Reference

## Source
- **Repository**: https://github.com/BoomerAng9/Agent-ACHEEVY-009
- **Base**: II-Agent (Intelligent Internet) fork
- **License**: Apache-2.0

---

## Architecture

Agent-ACHEEVY-009 is a Python-based WebSocket server wrapping II-Agent with:
- FastAPI backend (`ws_server.py` → `ii_agent.server.app.create_app()`)
- Xvfb virtual framebuffer for headless browser actions
- E2B sandbox integration for code execution
- MCP server support (Figma + Playwright)
- AIMS bridge mode for gateway federation

### Entry Point
```python
# ws_server.py
app = create_app()  # FastAPI app
# Runs on port 8000 by default
uvicorn.run("ws_server:app", host="0.0.0.0", port=8000)
```

### Start Script
```bash
#!/bin/sh
Xvfb :99 -screen 0 1280x720x16 &  # Virtual display for Playwright
export DISPLAY=:99
exec python ws_server.py
```

---

## MCP Server Configuration

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:FIGMA_ACCESS_TOKEN}"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--isolated"]
    }
  }
}
```

### Integration Notes
- Figma MCP enables direct design-to-code workflows
- Playwright MCP runs in `--isolated` mode (safe sandbox)
- Additional MCP servers can be added for other tools

---

## Production Deployment (Docker Compose)

### Required Environment Variables
```env
# docker/.stack.env
OPENROUTER_API_KEY=sk-or-v1-XXXX
DATABASE_URL=postgresql://user:pass@db:5432/ii_agent
SANDBOX_DATABASE_URL=postgresql://user:pass@db:5432/ii_sandbox
PUBLIC_TOOL_SERVER_URL=http://tool-server:1236

# Optional: AIMS Bridge
AIMS_BRIDGE_ENABLED=true
AIMS_GATEWAY_URL=https://gateway.aimanagedsolutions.cloud
AIMS_BRIDGE_SHARED_SECRET=your-shared-secret
```

### Deploy Commands
```bash
# Linux/Mac
./scripts/publish_stack.sh --build

# Windows PowerShell
./scripts/publish_stack.ps1 -Build

# With ngrok tunnel
./scripts/publish_stack.sh --build --with-tunnel
```

### Health Check
```bash
curl http://localhost:8000/bridge/health
```

---

## Key Dependencies (from pyproject.toml)

### Core Runtime
| Package | Purpose |
|---|---|
| `fastapi` | HTTP/WebSocket server |
| `uvicorn` | ASGI server |
| `openai` | OpenRouter / LLM access |
| ~~`litellm`~~ | **BLOCKED** — see SECURITY-LITELLM-BLOCKED.md. Use Gemini API + direct provider SDKs instead. |
| `anthropic[vertex]` | Claude via Vertex |
| `google-genai` | Gemini API |
| `google-cloud-aiplatform` | Vertex AI |

### Agent Tools
| Package | Purpose |
|---|---|
| `playwright` | Browser automation |
| `e2b-code-interpreter` | Sandbox code execution |
| `ii-researcher` | Deep research agent |
| `tavily-python` | Search API |
| `duckduckgo-search` | Fallback search |
| `fastmcp` | MCP server framework |

### Data Processing
| Package | Purpose |
|---|---|
| `pdfminer-six` / `pymupdf` / `pypdf` | PDF extraction |
| `mammoth` | DOCX conversion |
| `python-pptx` | PowerPoint generation |
| `pillow` | Image processing |
| `speechrecognition` / `pydub` | Audio processing |
| `youtube-transcript-api` | Video transcript extraction |

### Infrastructure
| Package | Purpose |
|---|---|
| `asyncpg` / `psycopg2-binary` | PostgreSQL |
| `redis` | Caching/queuing |
| `stripe` | Billing |
| `alembic` | DB migrations |
| `gcloud-aio-storage` | GCS object storage |

---

## ACHEEVY Studio Integration Points

| Agent-009 Component | ACHEEVY Studio Mapping |
|---|---|
| `ws_server.py` (port 8000) | Live data source for Mission Control |
| MCP servers | Tool availability status on nodes |
| `ii-researcher` | DeerFlow / Research_Ang status |
| E2B sandbox | OpenSandbox execution status |
| AIMS Bridge | Gateway federation health |
| `DATABASE_URL` | TEP log persistence |

### WebSocket Events for Live Monitoring
The `ws_server.py` exposes WebSocket endpoints. ACHEEVY Studio should connect to:
```
ws://localhost:8000/ws/agent/{session_id}
```
To receive real-time:
- Agent state changes
- Task progress updates
- Error events (trigger AVVA NOON escalation)
- Tool execution results
