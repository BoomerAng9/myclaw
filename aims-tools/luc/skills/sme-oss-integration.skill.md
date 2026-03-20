---
name: "SME_OSS_Integration_Skill_Config"
description: "Knowledgebase for mapping, integrating, and setting up LLM models for cloned OSS Apps in OpenClaw using ASCII Trees."
---

# SME_OSS_Integration Skill Knowledgebase

## Core Objective
SME_Ang utilizes this skill file to govern the integration of cloned Open Source Software (OSS) applications (like LibreChat, OpenClaw paradigms, etc.) into the A.I.M.S environment. The core focus is establishing a predictable mapping of LLM models to specific operational tasks and maintaining structural integrity through ASCII Trees.

## 1. ASCII Tree Structural Mapping
For every cloned OSS application integrated into A.I.M.S, SME_Ang MUST generate and maintain an ASCII Tree representation of the project's critical path configuration files, `.env` definitions, and API routes. 
- **Why ASCII Trees?** They provide `Picker_Ang` and `Coder_Ang` with a hallucination-free, token-efficient blueprint of the integration directory.
- **Protocol:** Before executing any patches to a cloned OSS repository, the agent must diff against the established ASCII Tree to ensure no architectural drift occurs.

### Example OSS App Integration ASCII Tree
```text
/cloned-oss-app
├── docker-compose.yml     # App deployment services
├── .env.example           # Target for A.I.M.S DB injection
├── /config
│   └── llm-endpoints.json # LLM Routing configurations
└── /src
    └── /routes            # API surfaces to expose to MyClaw
```

## 2. LLM Model Allocation & Task Routing
When configuring an OSS App within OpenClaw, SME_Ang must assign specific LLM capability classes based on the nature of the task:

| Task Type | Recommended Integrations / Models | Rationale / Focus |
| :--- | :--- | :--- |
| **Generative Video & Assets** | Remotion, Gemini 3 (Genie), Wan 2.5 | Use for high-fidelity rendering, timeline generation, and prompt-to-video capabilities. |
| **Live Logic Simulation** | Simstudio, DeepFlow | Use for executing real-time logic pipelines or sandbox visual rendering. |
| **Complex Reasoning & Planning** | DeepSeek R1, Claude 3.5 Sonnet | Used by ACHEEVY and Picker_Ang for task OODA loops and capability routing. |
| **Code Patches (OSS Apps)** | Qwen_Coder (or specialized coding models) | Used by Coder_Ang for executing the actual regex/file patches derived from the ASCII Tree. |

## 3. Standard Operating Procedure (SOP) for New Apps
1. **Clone & Scan**: Intake the new repository via OpenSandbox.
2. **ASCII Blueprint**: Generate the textual ASCII tree of the `/api`, `/config`, and `docker-compose` layers.
3. **Environment Injection**: Replace default OSS databases (MongoDB/Postgres) with the centralized **InsForge** endpoint credentials.
4. **Model Provisioning**: Update the OSS app's internal model registry to point to A.I.M.S OpenRouter or local proxies based on the *Task Routing Matrix* above.
5. **Circuit Box Exposure**: Expose the health-check and primary interactive endpoint to `ACHEEVY Mission Control` for live telemetry.
