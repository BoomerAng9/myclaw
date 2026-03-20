---
name: SME_OpenClaw_Fixes
description: "How to properly configure OpenClaw for production use. Extracted from Moritz Kremb agency builder walkthrough (fd4k16REDOU)."
---

# SME_Ang Skill: OpenClaw Production Configuration

## Source
- **Video**: "I fixed OpenClaw so it actually works (full setup)"
- **Host**: Moritz Kremb (OpenClaw power user, agency builder — Berlin)
- **URL**: https://youtu.be/fd4k16REDOU

---

## Core Problem Addressed
OpenClaw out-of-the-box has issues that make it unreliable for production use. This skill documents how an agency builder fixed it for real-world deployment.

---

## Key Configuration Fixes

### 1. Architecture Understanding
OpenClaw's architecture has 4 layers:
- **Gateway Layer**: Message orchestration (WhatsApp, Telegram, Discord, Slack, Signal, iMessage)
- **Reasoning Layer**: LLM interaction (Claude, DeepSeek, GPT, etc.)
- **Memory System**: Persistent context across conversations
- **Skills & Execution Layer**: Actions — file I/O, shell commands, web browsing, API calls

### 2. Skills System Configuration
- OpenClaw uses a "skills" system for tool usage
- Skills are modular — each skill is a folder with instructions
- **Security Warning**: Malicious plugins have been found in the OpenClaw marketplace
- **Rule**: Only install skills from verified sources or write your own
- **ACHEEVY Mapping**: Skills ≈ Boomer_Ang capabilities. Each skill should be registered and audited via KYB

### 3. LLM Provider Setup
- OpenClaw can connect to multiple LLM providers simultaneously
- Configure in the OpenClaw config file or environment variables:
  ```env
  OPENCLAW_LLM_PROVIDER=anthropic    # or openai, deepseek, ollama
  ANTHROPIC_API_KEY=sk-ant-XXXX
  OPENAI_API_KEY=sk-XXXX
  ```
- **Agency Pattern**: Use different models for different tasks:
  - Claude for complex reasoning and safety-critical tasks
  - DeepSeek for cost-effective code generation
  - GPT-4o for general-purpose tasks

### 4. Memory Configuration
- OpenClaw has persistent memory across sessions
- Configure memory storage location and retention policies
- **Critical Fix**: Memory can bloat — set up periodic pruning
- **ACHEEVY Mapping**: This maps to MIM's `history` field in the contextPack

### 5. Messaging Platform Integration
- OpenClaw's primary UI is messaging platforms (not a web dashboard)
- Each platform needs its own bot token/webhook configuration
- **Supported**: WhatsApp, Telegram, Discord, Slack, Signal, iMessage
- **Agency Use Case**: Deploy one OpenClaw instance per client, each with its own messaging channel

### 6. Security Hardening
- **Sandbox shell commands**: Don't give OpenClaw unrestricted shell access
- **Allowlist URLs**: Restrict web browsing to known-safe domains
- **Review skill marketplace**: Audit third-party skills before installation
- **API key isolation**: Use separate API keys per OpenClaw instance
- **ACHEEVY Mapping**: This aligns with MIM policy enforcement and KYB audit trails

---

## Production Deployment Checklist

```
[ ] Install OpenClaw from official source (github.com/openclaw)
[ ] Configure LLM provider(s) with API keys
[ ] Set up messaging platform bot tokens
[ ] Configure memory storage and pruning policies
[ ] Audit and install only verified skills
[ ] Set up shell command allowlist
[ ] Configure URL browsing restrictions
[ ] Test end-to-end messaging flow
[ ] Monitor token consumption and costs
[ ] Set up error alerting (hung agents, failed commands)
```

---

## ACHEEVY Integration Points

| OpenClaw Component | ACHEEVY Equivalent | Notes |
|---|---|---|
| Gateway Layer | API Server (`api/server.ts`) | Message routing |
| Reasoning Layer | NTNTN + Picker_Ang | Intent → Provider routing |
| Memory System | MIM contextPack.history | Persistent context |
| Skills System | Boomer_Ang capabilities | Modular execution |
| Security Controls | MIM policy enforcement | Governance gates |

---

## ASCII Tree: OpenClaw Instance Structure

```
openclaw-instance/
├── config/
│   ├── providers.yaml          # LLM provider configurations
│   ├── messaging.yaml          # Platform bot tokens
│   └── security.yaml           # Allowlists, sandboxing
├── skills/
│   ├── verified/               # Audited skills only
│   │   ├── web-search/
│   │   ├── file-manager/
│   │   ├── code-runner/
│   │   └── api-caller/
│   └── custom/                 # Agency-specific skills
├── memory/
│   ├── sessions/               # Per-conversation state
│   └── long-term/              # Cross-session knowledge
├── logs/
│   ├── execution.log
│   └── audit.log               # KYB-compatible trail
└── docker-compose.yml          # Container deployment
```
