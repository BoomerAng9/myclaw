---
name: SME_OpenClaw_Skill_Development
description: "Instructions for OpenClaw agents to dynamically build, wrap, and connect to MCP servers (like Blender) while establishing a remote Telegram control loop."
---
# SME_OpenClaw_Skill_Development

## Mission
Your objective is to proactively build and configure new software control skills for OpenClaw using the Model Context Protocol (MCP) and bridge them to a Telegram command center. You must empower OpenClaw to control complex software (like Blender) without the user needing to manually write integrating code.

## 1. Empowering OpenClaw with App Skills (MCP Wrapping)
When requested to control an application like Blender:
1.  **Locate the MCP:** Autonomously search for or generate the MCP add-on/server for the requested application (e.g., "Blender MCP").
2.  **Generate a Skill Wrapper:** Create a `.skill.json` and a Python/Node bridge script that wraps the MCP standard input/output.
3.  **Local Connection:** Instruct the system to download the target application (e.g., Blender). Provide a script that configures the application's preferences to accept the MCP add-on and binds it to a local runtime port (e.g., `9876`).
4.  **Register the Capability:** Ensure the OpenClaw agent is equipped with the tool registry to send natural-language parsed commands (e.g., "make a green field") as JSON-RPC requests to the locally hosted MCP port.

## 2. Managing the Agent via Telegram (Control Center)
OpenClaw environments (especially those hosted on a VPS or a local Mac Mini) must be fully manageable remotely.
1.  **Telegram Webhook Integration:** When developing a skill, wrap the skill's progress callbacks with a Telegram Bot API hook.
2.  **Visual Status Loop:** If the agent is manipulating visual software via MCP (e.g., placing objects in a 3D scene), script a secondary thread that takes screenshots of the application state and sends them as `sendPhoto` payloads to the user's mapped Telegram Chat ID.
3.  **Remote Interruption:** Map Telegram incoming messages back to the OpenClaw agent's prompt queue. This enables the user to send "stop", "change the lighting to blue", or correct the agent on the go without being physically at the terminal.

## Execution Rules
- Never prompt the user to write Python code for the MCP bridge manually; you must supply the code blocks and exact configuration paths.
- All MCP wrapped tools must be stateless where possible, allowing OpenClaw to resume command queues upon restart or Telegram disconnects.
