---
name: SME_OpenClaw_Free_APIs
description: "Free API integrations for OpenClaw/NemoClaw using GLM-5, Kimi K2.5, MiniMax, NVIDIA API Catalog, and Kilo CLI. Extracted from AI Code King tutorial (bdNf-KieKTY)."
---

# SME_Ang Skill: Free API Integrations for OpenClaw

## Source
- **Video**: "Unlimited Free APIs (GLM-5, Kimi-K2.5, MiniMax) + OpenCode, OpenClaw: This FULLY FREE Coder is CRAZY!"
- **Channel**: AI Code King
- **URL**: https://www.youtube.com/watch?v=bdNf-KieKTY

---

## Key Integrations Extracted

### 1. NVIDIA API Catalog (build.nvidia.com)
- **What**: Free tier access to NVIDIA NIM microservices — hosted models like Llama, Mixtral, Nemotron, etc.
- **How to Get API Key**:
  1. Go to https://build.nvidia.com
  2. Sign in with NVIDIA Developer account
  3. Browse models → Click "Get API Key"
  4. Copy the `nvapi-XXXX` key
- **Integration Point**: Use inside OpenClaw or Kilo CLI as a provider endpoint
- **Config Pattern** (OpenClaw `librechat.yaml` or env):
  ```yaml
  providers:
    nvidia:
      apiKey: "nvapi-XXXX"
      baseURL: "https://integrate.api.nvidia.com/v1"
      models:
        - meta/llama-3.1-70b-instruct
        - nvidia/nemotron-70b-instruct
        - mistralai/mixtral-8x22b-instruct-v0.1
  ```

### 2. GLM-5 (Zhipu AI) — Free Tier
- **What**: 744B total params (40B active), MoE architecture, 137k context window
- **Strengths**: Agentic engineering, coding, real-world SWE tasks, high Vals Index scores
- **Free Access**: Via Zhipu AI API (chatglm.cn) — free tier available
- **Best For In ACHEEVY**: `Boomer_Ang` specialist execution (code generation tasks)
- **API Endpoint Pattern**:
  ```
  Base URL: https://open.bigmodel.cn/api/paas/v4
  Model: glm-5
  ```
- **Picker_Ang Routing Note**: Route coding/SWE tasks here when cost = $0 is required

### 3. Kimi K2.5 (Moonshot AI) — Free Tier
- **What**: 1T total params (32B active), MoE, 256k context window
- **Strengths**: Math, reasoning, writing, tool calling, orchestration, multimodal (images + text)
- **Free Access**: Via Moonshot Platform (platform.moonshot.cn)
- **Best For In ACHEEVY**: `NTNTN` intent normalization (strong reasoning), `Review_Hone` validation
- **API Endpoint Pattern**:
  ```
  Base URL: https://api.moonshot.cn/v1
  Model: kimi-k2.5
  ```
- **Picker_Ang Routing Note**: Route reasoning-heavy and multimodal tasks here

### 4. MiniMax M2.5 — Free Tier
- **What**: 230B total params (10B active), MoE, 197k context window
- **Strengths**: Speed and cost-effectiveness, good for general tasks
- **Free Access**: MiniMax offers free tier for M2 model
- **Best For In ACHEEVY**: Fast, low-stakes `Guide_Ang` responses, simple chat completions
- **API Endpoint Pattern**:
  ```
  Base URL: https://api.minimax.chat/v1
  Model: MiniMax-M2.5
  ```
- **Picker_Ang Routing Note**: Route simple/fast tasks, not for complex coding

### 5. Kilo CLI (OpenCode-based)
- **What**: Agentic CLI tool for AI-powered development — based on OpenCode
- **Install**:
  ```bash
  npm install -g @kilocode/cli
  ```
- **Setup**:
  ```bash
  kilo
  /connect   # Configure AI provider credentials
  ```
- **Agent Modes**: Architect, Ask, Debug, Orchestrator
- **Integration Point**: Can be used as a `Boomer_Ang` execution backend for code tasks
- **Key Features**:
  - Terminal User Interface (TUI)
  - Language Server Protocol (LSP) integration
  - Model Context Protocol (MCP) support
  - Switch between LLMs mid-session

### 6. OpenCode
- **What**: Open-source AI coding agent — autonomous AI pair programmer
- **Key Properties**:
  - Local-first architecture for enterprise privacy
  - No user code/context stored externally
  - Built on Go
  - Integrates with LSP and MCP
- **Platforms**: Terminal, VS Code, Desktop
- **Integration Point**: Alternative to Kilo CLI for code generation tasks inside `Boomer_Ang`

---

## ACHEEVY Integration Map

| Free Provider | Best ACHEEVY Role | Task Type | Context Window |
|---|---|---|---|
| NVIDIA NIM (Llama/Nemotron) | Boomer_Ang | Code gen, general | 128k |
| GLM-5 (Zhipu) | Boomer_Ang | Agentic SWE, coding | 137k |
| Kimi K2.5 (Moonshot) | NTNTN, Review_Hone | Reasoning, multimodal | 256k |
| MiniMax M2.5 | Guide_Ang | Fast chat, simple tasks | 197k |
| Kilo CLI | Boomer_Ang (code backend) | Code execution | Per-model |
| OpenCode | Boomer_Ang (code backend) | Code execution | Per-model |

---

## Picker_Ang Routing Policy Update

When `estimatedCostTokens` needs to be $0 (free tier):
1. **Code generation** → Route to GLM-5 or NVIDIA NIM
2. **Reasoning/analysis** → Route to Kimi K2.5
3. **Fast simple response** → Route to MiniMax M2.5
4. **Code execution with tools** → Route to Kilo CLI or OpenCode

When cost budget exists:
- Default to Vertex AI Gemini (Ultra tier) for maximum capability
- Fall back to free providers as secondary options
