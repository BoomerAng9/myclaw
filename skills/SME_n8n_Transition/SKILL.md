---
name: SME_n8n_Transition
description: Use when Chicken Hawk needs to inventory, replace, or refuse legacy n8n workflows and route the automation to SimStudio, OpenClaw cron, or another runtime instead
---

# n8n Transition

## Mission
Make n8n a migration problem, not a default deployment choice. Chicken Hawk should inventory any legacy automation, decide the correct replacement surface, and only restore n8n when there is a documented gap SimStudio or the existing runtimes cannot fill.

## Current Policy
- n8n is not the default workflow engine
- SimStudio is the preferred visual automation surface
- OpenClaw cron + skills is preferred for scheduled operator routines
- OpenSandbox or NemoClaw is preferred for isolated execution-heavy tasks

## Migration Checklist
For each legacy n8n workflow, capture:

1. Trigger type: webhook, cron, manual, queue, or external app event
2. Inputs and outputs: APIs, databases, files, chat channels
3. Secrets and credentials involved
4. Failure handling and retry expectations
5. Human approval points
6. Best replacement target

## Replacement Rules

### Move To SimStudio
- Multi-step business automation
- SaaS integrations
- Visual workflows other operators may need to inspect
- Event-driven flows with webhooks or external services

### Move To OpenClaw Cron + Skills
- Scheduled housekeeping
- Recurrent reports and status checks
- ByteRover indexing and operator support routines

### Move To NemoClaw Or OpenSandbox
- Flows requiring secure isolation
- Commands, scripts, or toolchains that need policy enforcement
- Workloads that should not run in a general-purpose workflow UI

## Lil_Hawk Dispatch Pattern
1. **ACHEEVY**: frame the migration and dependency graph
2. **Researcher_Ang**: inventory the legacy flow and its integrations
3. **Ops_Ang**: inspect existing running services, ports, and secrets handling
4. **Coder_Ang**: implement the target workflow or supporting code
5. **Validator_Ang**: prove the replacement flow works and the old one can be retired

## Restore n8n Only If
All of the following are true:

1. SimStudio cannot cover the required trigger or integration pattern
2. OpenClaw cron + skills is insufficient
3. The owner explicitly approves a temporary or permanent n8n return
4. The workflow is documented so it can later be migrated away again

## Deliverable After Each Migration
- Source workflow inventoried
- Replacement target chosen and justified
- Verification steps captured
- ByteRover pattern stored for reuse