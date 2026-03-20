# AGENTS.md
# Rules and instructions for managing the 'lil_hawks' minion agents serving within the Chicken Hawk infrastructure.

## Chain of Command
```
Chicken Hawk (OpenClaw Master AI)
  ├── ACHEEVY 009 (Digital CEO / Frontend Orchestrator)
  ├── AVVA NOON (Agent Zero — Escalation Failover)
  └── lil_hawks (Narrow Execution Minions)
       ├── Coder_Ang         — code-producer
       ├── Validator_Ang     — review & security gate
       ├── Researcher_Ang    — intelligence
       ├── Designer_Ang      — visual-producer
       ├── Scripter_Ang      — narrative-producer
       ├── Ops_Ang           — bulk notifications
       ├── SME_Stepper_Ang   — stepper skill manager
       ├── SME_Paperform_Ang — form schema architect
       ├── SME_NotebookLM    — audio intelligence
       ├── Betty_Anne_Ang    — HR / TEP oversight
       ├── CFO_Ang           — finance gate
       ├── Picker_Ang        — capability router
       ├── Cinematic_Ang     — video rendering
       └── AutoResearch      — autonomous deep research (Karpathy)
```

## Non-Negotiable Rules
1. **Chicken Hawk is the Master AI.** It spawns, commands, and terminates all `lil_hawks`. No minion acts without Chicken Hawk's dispatched context.
2. **lil_hawks are stateless and narrow.** Each minion handles exactly one capability class. They do not make routing decisions, approve work, or communicate with each other directly.
3. **LUC gates are mandatory.** Before any `lil_hawk` executes a billable action, it must pass through the LUC `canExecute()` hard gate. No exceptions.
4. **AVVA NOON is the last resort.** If a `lil_hawk` fails critically and `Validator_Ang` cannot resolve it, Chicken Hawk escalates to AVVA NOON (Agent Zero) which mounts its OODA loop. If Agent Zero fails twice, it pages the human operator.
5. **Voice-First is default.** All user-facing interactions route through the Voice/Vision bridge (STT → LLM → TTS). Dashboard UIs are hidden from normal users.
6. **Parallel execution cap: 6 agents.** The swarm registry enforces a maximum of 6 concurrent `lil_hawks` to prevent resource exhaustion.
7. **Evidence is required.** Every completed task must produce a traceable evidence bundle before Chicken Hawk marks it as `delivered`.

## Available Skill Libraries
All agents have access to the merged skill pool:

| Skill | Source | Purpose |
|-------|--------|---------|
| `systematic-debugging` | superpowers | Methodical root-cause analysis |
| `dispatching-parallel-agents` | superpowers | Coordinating multi-agent workloads |
| `test-driven-development` | superpowers | TDD workflows |
| `brainstorming` | superpowers | Structured ideation |
| `subagent-driven-development` | superpowers | Delegated implementation |
| `verification-before-completion` | superpowers | Pre-ship validation |
| `writing-plans` | superpowers | Structured plan documents |
| `requesting-code-review` | superpowers | Formal review requests |
| `mcp-telegram-bridge` | AIMS | Remote Telegram control + MCP |
| `mcp-web3-bridge` | AIMS | Blockwise AI / Web3 execution |
| `SME_OpenClaw_Skill_Development` | AIMS | Dynamic app skilling via MCP |

## Adding New lil_hawks
1. Create a JSON config in `ACHIEVEMOR x AIMS/src/Runtime/Orchestrator/agents/`.
2. Register the agent in `swarm-registry.json` with `canDelegate: false`.
3. Set `priority` (0 = top, 5 = low).
4. Add the agent's capability to the `pipelineOrder` array.
5. Chicken Hawk will automatically discover and spawn it.
