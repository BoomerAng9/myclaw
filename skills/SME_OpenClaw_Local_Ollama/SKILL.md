---
name: SME_OpenClaw_Local_Ollama
description: "Run OpenClaw 100% locally with Ollama for free. Model selection and configuration for local-first deployments. Extracted from (wQDL2uAi-yg)."
---

# SME_Ang Skill: OpenClaw Local Deployment with Ollama

## Source
- **Video**: "Stop Paying for AI APIs — Run OpenClaw 100% Locally with Ollama for free (Step-by-Step)"
- **URL**: https://youtu.be/wQDL2uAi-yg

---

## Why This Matters
This skill enables ACHEEVY to route tasks to **zero-cost local models** when:
- Budget is $0
- Privacy is critical (no data leaves the machine)
- Internet is unavailable
- Testing/development needs fast iteration without API costs

---

## Step-by-Step: Local Setup

### 1. Install Ollama
```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from https://ollama.com/download
```

### 2. Download Models
```bash
# Recommended models for different ACHEEVY roles:

# General purpose / NTNTN intent normalization
ollama pull qwen3:8b

# Code generation / Boomer_Ang execution
ollama pull qwen3.5:9b

# Heavy reasoning (if hardware allows 32GB+ RAM)
ollama pull qwen3.5:35b

# Fast chat / Guide_Ang responses
ollama pull llama3.2:3b

# Vision tasks (if needed)
ollama pull llava:13b
```

### 3. Verify Ollama Is Running
```bash
ollama list                    # Show downloaded models
ollama serve                   # Start the Ollama server (usually auto-starts)
curl http://localhost:11434   # Should return "Ollama is running"
```

### 4. Configure OpenClaw to Use Ollama
Set environment variables in your OpenClaw `.env` or config:
```env
# Point OpenClaw to local Ollama
OPENCLAW_LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3.5:9b
```

Or in `librechat.yaml` (if using LibreChat-based setup):
```yaml
endpoints:
  custom:
    - name: "Ollama Local"
      apiKey: "ollama"           # Ollama doesn't need a real key
      baseURL: "http://localhost:11434/v1"
      models:
        default:
          - qwen3:8b
          - qwen3.5:9b
          - qwen3.5:35b
          - llama3.2:3b
          - llava:13b
      titleConvo: true
      titleModel: "qwen3:8b"
      dropParams:
        - stop
        - user
        - frequency_penalty
        - presence_penalty
```

---

## Model Selection Guide for ACHEEVY Roles

### The ASCII Tree of Model Assignment

This is the critical routing logic for Picker_Ang when running locally:

```
Picker_Ang Local Routing Tree
│
├── NTNTN (Intent Normalization)
│   ├── Primary: qwen3:8b (fast, good reasoning)
│   └── Fallback: llama3.2:3b (ultra-fast, lighter reasoning)
│
├── MIM (Governance)
│   └── Primary: qwen3:8b (rule-following, structured output)
│
├── Boomer_Ang (Code Execution)
│   ├── Primary: qwen3.5:9b (best local coder)
│   ├── Heavy: qwen3.5:35b (if 32GB+ RAM available)
│   └── Fallback: codellama:13b (code-specific)
│
├── Review_Hone (Validation)
│   ├── Primary: qwen3.5:9b (can review code quality)
│   └── Fallback: qwen3:8b
│
├── Guide_Ang (User Chat)
│   ├── Primary: llama3.2:3b (ultra-fast responses)
│   └── Fallback: qwen3:8b (better quality, slightly slower)
│
└── Vision Tasks
    └── Primary: llava:13b (multimodal analysis)
```

---

## Hardware Requirements

| Model | RAM Required | Disk Space | Speed (tokens/sec) |
|---|---|---|---|
| llama3.2:3b | 4GB | ~2GB | 40-60 |
| qwen3:8b | 8GB | ~5GB | 20-35 |
| qwen3.5:9b | 16GB | ~10GB | 15-25 |
| qwen3.5:35b | 32GB+ | ~25GB | 5-12 |
| llava:13b | 16GB | ~8GB | 10-20 |

---

## Cloned OSS App Integration Pattern

This configuration pattern applies to **ALL cloned OSS apps**, not just OpenClaw:

```
ANY-OSS-APP/
├── .env                              # OLLAMA_BASE_URL=http://localhost:11434
├── config/
│   └── models.yaml                   # Model list and routing table
├── docker-compose.yml                # Include ollama service
│   services:
│     ollama:
│       image: ollama/ollama
│       ports: ["11434:11434"]
│       volumes: ["ollama-data:/root/.ollama"]
│     app:
│       depends_on: [ollama]
│       environment:
│         - OLLAMA_BASE_URL=http://ollama:11434
└── scripts/
    └── pull-models.sh                # Pre-download required models
```

### Docker Compose Template (Universal)
```yaml
version: "3.8"
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama-data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    restart: unless-stopped

  # Your cloned OSS app goes here
  app:
    build: .
    depends_on:
      - ollama
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - DEFAULT_MODEL=qwen3.5:9b
    ports:
      - "3000:3000"

volumes:
  ollama-data:
```

### Model Pre-Pull Script
```bash
#!/bin/bash
# scripts/pull-models.sh
# Run this after docker-compose up to pre-download models

MODELS=("qwen3:8b" "qwen3.5:9b" "llama3.2:3b")

for model in "${MODELS[@]}"; do
  echo "Pulling $model..."
  docker exec ollama ollama pull "$model"
done

echo "All models ready."
```

---

## ACHEEVY Picker_Ang Update

When `targetProvider` is set to `"ollama"` (local), the Picker_Ang should:
1. Check available models via `GET http://localhost:11434/api/tags`
2. Select model based on the capability routing tree above
3. Set `estimatedCostTokens` to `0` (all local = free)
4. Log the selection in `specialistLogs` for KYB audit
