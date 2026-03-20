# Project Chicken Hawk: Technical Documentation

## 1. Introduction

This document provides a comprehensive technical overview of **Project Chicken Hawk**, an autonomous super agent designed for complex, long-running tasks with a strong emphasis on command-line interaction. The architecture synthesizes the robust, persistent execution model of **Clawdbot** (formerly Moltbot) [1] with the sophisticated, hierarchical planning capabilities of **OpenManus** [2] [3], creating a powerful and extensible agent framework.

### 1.1. Design Philosophy

The core philosophy of Project Chicken Hawk is **"CLI-first."** Every action, capability, and piece of internal state is designed to be accessible and controllable through a command-line interface. This approach ensures maximum transparency, auditability, and interoperability with existing developer workflows and automation scripts.

The architecture is built on a **Daemon-Agent Hybrid** model, where a persistent background service (the Daemon) manages the agent's core logic, while a lightweight CLI client provides the primary user interface. This decoupling ensures that the agent can operate continuously and maintain state independently of any single user session.

## 2. Core Concepts

Four primary concepts underpin the Chicken Hawk architecture:

*   **Daemon-Agent Hybrid**: The agent is not a transient script but a continuously running service. This allows it to manage long-term tasks, maintain memory, and be accessible on demand without re-initialization.
*   **Hierarchical Planning**: Complex tasks are decomposed and managed by a hierarchy of specialized agents. A high-level **Master Agent** defines the overall goal, a **Planning Agent** creates the step-by-step execution plan, and a **ToolCall Agent** handles the execution of individual commands.
*   **Tool-as-a-CLI**: Every internal and external capability is abstracted into a discrete CLI command. This unified interface simplifies the agent's decision-making process and makes the system highly extensible.
*   **Self-Evolving Skills**: The agent possesses the ability to autonomously write, test, and integrate new CLI tools, allowing it to expand its own capabilities over time in response to new challenges.

## 3. Architectural Layers

The Chicken Hawk architecture is organized into five distinct layers, each with a specific set of responsibilities.

![Architecture Diagram](https://private-us-east-1.manuscdn.com/sessionFile/vg3oE74qCUg7BKyAae9AgD/sandbox/TjRlJgAxVDrLGlTWBCeoDH-images_1769521544356_na1fn_L2hvbWUvdWJ1bnR1L2FyY2hpdGVjdHVyZV9kaWFncmFt.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdmczb0U3NHFDVWc3Qkt5QWFlOUFnRC9zYW5kYm94L1RqUmxKZ0F4VkRyTEdsVFdCQ2VvREgtaW1hZ2VzXzE3Njk1MjE1NDQzNTZfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyRnlZMmhwZEdWamRIVnlaVjlrYVdGbmNtRnQucG5nIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=P1gVa~i2gLGB55ypclVDiDHUTX2MuYWFM8trTXM0Z4pxyPKY9TF6xV8P-EjP19n66SKh5UGctlMG3bG4SrWWzhynBsU3A~31NP4iIb3RcivgthjXm~n8vEmB8CJOWmWsuCgTvz0xMacJJTJaw8F4kqKJ8F25ITpyzRV~iS-5o8zt9Zx-1W5t~i5PbCUrte~0pYF9hn81ObUz-VzSMofHC2vAKNafvQyj2LOSoLzvbTnD3Uai5Pdb8JEt~4JTBKe8EAXWFuZVYoUbatO9um-cjTKbFtRS2zwWvcPmufR69-LTPv3d1bBpkmL8g6NXjG~OyRc3hd64hBEGzXetQzNGHw__)

| Layer | Primary Components | Key Functionality |
| :--- | :--- | :--- |
| **Interface Layer** | CLI Client, Messaging Adapters, Local API | User interaction, non-blocking command submission, state control. |
| **Control Layer** | Master Agent, Planning Agent, ToolCall Agent | Task decomposition, state management, execution flow control (ODAR). |
| **Execution Layer** | Sandboxed OS, Unified Tool Interface (UTI) | Secure, isolated execution of all commands and scripts. |
| **Evolution Layer** | Skill Compiler, Dynamic Tool Discovery | Autonomous capability expansion and tool schema generation. |
| **Persistence Layer** | Persistent Database, Markdown Memory Logs | State, memory, and audit trail storage. |

### 3.1. Interface Layer
This layer is responsible for all communication with the external world. The primary component is the `Chicken Hawk` CLI, a thin client that sends commands to the Daemon via a local gRPC or REST API. The layer also includes **Adapters** for other input channels, such as webhooks or messaging platforms (e.g., Slack, Discord), allowing for flexible integration into various workflows.

### 3.2. Control Layer
This is the brain of the agent. It houses the agent hierarchy and the core execution loop. The **Master Agent** receives intent from the Interface Layer and initiates a task. The **Planning Agent** then generates a detailed plan, or "Flow," which is a sequence of steps to be executed. The **ToolCall Agent** is responsible for executing each step of the plan.

![Agent Hierarchy](https://private-us-east-1.manuscdn.com/sessionFile/vg3oE74qCUg7BKyAae9AgD/sandbox/TjRlJgAxVDrLGlTWBCeoDH-images_1769521544357_na1fn_L2hvbWUvdWJ1bnR1L2FnZW50X2hpZXJhcmNoeQ.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdmczb0U3NHFDVWc3Qkt5QWFlOUFnRC9zYW5kYm94L1RqUmxKZ0F4VkRyTEdsVFdCQ2VvREgtaW1hZ2VzXzE3Njk1MjE1NDQzNTdfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyRm5aVzUwWDJocFpYSmhjbU5vZVEucG5nIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=qwdIrsoK-ZVhkwTDNwRc1OPwtmqKIYVfiskQTN7kidXyni6OeJfilBBVClWf5BAa7laRTJsVvIt~-nqGymF3dsjRSNpjud6OXcLK0vdvEeGykf4ZnbhRnK8Rzsqw9He~9SODHjrhU86unj~0wzA3KBzs2URNpz8a9L4Fh~cWRzppZbtOw~hCibjvC0cIpr9yZrepWa7gbBRhmLkEbzKIfIq2baVuJX7YOFSzm8yh7UXdUfw1dzJcEpPEVWrr6X1QGW74RbqAPCAwvoZtGYia9kpqtiIGsTcWJeD3S1QqlfjTrzGzpik07bPil4DVeaBgH3Ic5mGA5SxnaIREs0gcXQ__)

### 3.3. Execution Layer
This layer provides a secure and consistent environment for all agent actions. It consists of a **Sandboxed OS** (typically a Docker container) and the **Unified Tool Interface (UTI)**. The sandbox ensures that any commands executed by the agent are isolated from the host system, preventing unintended side effects. The UTI provides a consistent abstraction for all tools, whether they are internal agent capabilities or external system binaries.

### 3.4. Evolution Layer
This layer gives the agent its ability to learn and grow. The **Skill Compiler** is a specialized module that can generate new CLI tools from a natural language description. When the Planning Agent identifies a missing capability, it can invoke the Skill Compiler to create a new tool, which is then automatically tested and integrated into the agent's toolset. The **Dynamic Tool Discovery** mechanism continuously scans for new tools and updates the agent's internal registry.

### 3.5. Persistence Layer
This layer is responsible for maintaining the agent's state and memory. A **Persistent Database** (e.g., PostgreSQL) stores the agent's task history, plans, and configuration. For enhanced transparency, the agent's long-term memory and key decisions are also written to **Markdown Memory Logs**, providing a human-readable audit trail of the agent's thought process.

## 4. The Execution Loop (ODAR)

The agent's autonomous behavior is driven by the **Observe-Decide-Act-Reflect (ODAR)** loop:

![ODAR Loop](https://private-us-east-1.manuscdn.com/sessionFile/vg3oE74qCUg7BKyAae9AgD/sandbox/TjRlJgAxVDrLGlTWBCeoDH-images_1769521544358_na1fn_L2hvbWUvdWJ1bnR1L29kYXJfbG9vcA.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvdmczb0U3NHFDVWc3Qkt5QWFlOUFnRC9zYW5kYm94L1RqUmxKZ0F4VkRyTEdsVFdCQ2VvREgtaW1hZ2VzXzE3Njk1MjE1NDQzNThfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyOWtZWEpmYkc5dmNBLnBuZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Hpc9CF7GaBbTw~50JVVTo8tzGln3z5iELQRmpHcX5VD4eM3cibYn7t13JJkrS19ZhVC87pTGIbwdFe7b1oK472uAByXJ7spXDdRirLJJWuSPyLHtXvKk9I0eNuf4nCtoG~ng01GLTwsI1pZxJWNsufGzGxmPyAJEgLLuKoCe0C-ijFQ-PRFc1jDVyvjJgEgwY0vLydoNtiG7MHPcQ-ZwWvBThbpYTyOQjpxMw6wjKqIgZUEVQFhH-y7mNhd4uO6pI3pPk2UCXwvHJfyETp775SSg26jai3hdaRUlAdqWn6uBtkT0whWX2hkz1Bl~0avh3W1K~~oN80G3~GJE-i6I-w__)

1.  **Observe**: The ToolCall Agent executes a command and captures the result (stdout, stderr, exit code).
2.  **Decide**: The Planning Agent compares the observed result with the expected outcome. Based on this comparison, it decides whether to proceed to the next step, re-plan the task, or invoke the Skill Compiler.
3.  **Act**: The Planning Agent executes its decision, either by advancing the plan or triggering a new action.
4.  **Reflect**: The Master Agent records the outcome of the action in the persistent memory, updating its understanding of the task and the environment.

## 5. Implementation Guidance

### 5.1. Technology Stack

*   **Language**: Python or Node.js for the core agent logic.
*   **Containerization**: Docker for the sandboxed execution environment.
*   **API**: gRPC for efficient, low-latency communication between the CLI client and the Daemon.
*   **Database**: PostgreSQL for robust, persistent state management.

### 5.2. Directory Structure

```
/Chicken Hawk
├── agent/            # Core agent logic (Master, Planning, ToolCall)
├── cli/              # CLI client implementation
├── tools/            # Internal CLI tools
├── skills/           # Autonomously generated skills
├── logs/             # Markdown memory logs
├── sandbox/          # Docker configuration for the execution environment
└── main.py           # Daemon entry point
```

## 6. References

[1] Clawdbot GitHub. *clawdbot/clawdbot: Your own personal AI assistant. Any OS...* [https://github.com/clawdbot/clawdbot]
[2] LLM Multi Agent. *OpenManus Technical Analysis: Architecture and Implementation of an Open-Source Agent Framework*. [https://llmmultiagents.com/en/blogs/OpenManus_Technical_Analysis]
[3] James Li. *OpenManus Architecture Deep Dive: Enterprise AI Agent Development with Real-World Case Studies*. [https://dev.to/jamesli/openmanus-architecture-deep-dive-enterprise-ai-agent-development-with-real-world-case-studies-5hi4]
