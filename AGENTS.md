# AGENTS.md
# Chicken Hawk lil_hawks Management Rules

## Identity (Non-Negotiable)
**Chicken Hawk = OpenClaw = NemoClaw = MyClaw.**
One product. One VPS deployment. One runtime container (`openshell-cluster-nemoclaw`).
These names are NOT separate systems. They all refer to the same deployed instance.

## Architecture
```
Chicken Hawk (The Single AI Runtime)
  │
  ├── VPS Container: openshell-cluster-nemoclaw (port 8080)
  ├── UI Container:  openclaw-sop5-openclaw-1 (behind Traefik)
  ├── Workflows:     sim-studio-9fks-simstudio-1 (port 32769)
  │
  └── lil_hawks (Sub-Agents spawned by Chicken Hawk)
       ├── ACHEEVY          — orchestrator / digital CEO
       ├── Picker_Ang       — capability router
       ├── CFO_Ang          — LUC quota gate
       ├── Coder_Ang        — code producer
       ├── Validator_Ang    — review & security gate
       ├── Researcher_Ang   — intelligence
       ├── Designer_Ang     — visual producer
       ├── Scripter_Ang     — narrative producer
       ├── Ops_Ang          — bulk notifications
       ├── SME_Stepper_Ang  — stepper skill manager
       ├── SME_Paperform_Ang— form schema architect
       ├── SME_NotebookLM   — audio intelligence
       ├── Betty_Anne_Ang   — HR / TEP oversight
       ├── AutoResearch     — Karpathy deep research
       └── AVVA NOON        — Agent Zero failover (last resort)
```

## Rules
1. **Chicken Hawk is the runtime, not an agent.** It does not appear in the lil_hawks list.
2. **lil_hawks are stateless and narrow.** One capability per hawk. No routing or approval decisions.
3. **LUC gates are mandatory.** Every billable action passes `canExecute()` first.
4. **AVVA NOON is last resort.** Double failure pages the human.
5. **Voice-First is default.** Users talk, Chicken Hawk executes.
6. **Max 6 parallel lil_hawks.** Swarm registry enforces this cap.
7. **Evidence required.** Every task produces a traceable bundle before delivery.

## Skills (Merged Pool)
| Skill | Source |
|-------|--------|
| systematic-debugging | superpowers |
| dispatching-parallel-agents | superpowers |
| test-driven-development | superpowers |
| brainstorming | superpowers |
| subagent-driven-development | superpowers |
| verification-before-completion | superpowers |
| writing-plans | superpowers |
| requesting-code-review | superpowers |
| mcp-telegram-bridge | AIMS |
| mcp-web3-bridge | AIMS |
| SME_OpenClaw_Skill_Development | AIMS |
| SME_DesignTool_Antigravity | AIMS |
| SME_AutoResearch | AIMS |
