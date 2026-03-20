Chicken Hawk Full Specification Document |03/20/[04:20]
# Chicken Hawk Specification & Technology Stack
## ACHIEVEMOR Voice-First + Vision-First Autonomous AI Agent
**Version:** 1.0  
**Date:** March 20, 2026  
**Owner:** ACHIEVEMOR  
**Purpose:** This is the complete, copy-paste-ready blueprint for building Chicken Hawk — our Make It Mine customized version of the OpenClaw agent. It can be used as-is or adapted for any other application we clone and customize.

**What “Make It Mine” means**  
Make It Mine is our standard process for taking any existing open-source or third-party application (or GitHub repo), cloning it, and then adding our own customizations — voice-first interaction, vision accessibility, Ledger Usage Calculator metering, security hardening, real-time automation, and deployment to a custom domain. You simply replace “[TARGET_APPLICATION]” with the name of the app you are cloning (example: “OpenClaw”).

**What the Ledger Usage Calculator (LUC) is**  
LUC is a reusable, headless framework that estimates cost/usage, gates (blocks if over limit), and records every billable action. You customize the service keys to match whatever you are metering in your application (tokens, voice minutes, container hours, storage, etc.). It is never UI math — it is always wired directly into the code.

**CORE RULE (never break this)**  
The finished product must feel like this:  
Open the app → speak or type → attach context if needed → get a clear result → continue the conversation.  
Dashboards and admin panels stay completely hidden from normal users.

================================================================================
CHICKEN HAWK STACK ARCHITECTURE (ASCII DIAGRAM)
================================================================================

                  +-------------------------------------+
                  |          USER INTERFACE LAYER       |
                  |  Chat/Voice-First (No Dashboard)    |
                  |  Speak/Type → Attach → Result       |
                  +-------------------+-----------------+
                                      |
                                      v
                  +-------------------------------------+
                  |         CORE ENGINE LAYER           |
                  |  OpenClaw Base + MCP Native         |
                  |  Browser + Terminal + Desktop Ctrl  |
                  +-------------------+-----------------+
                                      |
             +------------------------+-------------------------+
             |                                                  |
             v                                                  v
+--------------------------------+                    +-------------------------+
|     VOICE + VISION LAYER       |                    |   MAKE IT MINE ENGINE   |
|  • Grok Voice / PersonaPlex    |                    |  • Clone any repo       |
|    / ElevenLabs (selectable)   |                    |  • Add voice/vision/LUC |
|  • Delta Screenshots + Spoken  |                    |  • Coolify auto-deploy  |
|    Descriptions                |                    |  • Custom domain + CDN  |
+--------------------------------+                    +-------------------------+
             |                                                  |
             +------------------------+-------------------------+
                                      |
                                      v
                  +-------------------------------------+
                  |         METERING & BILLING LAYER    |
                  |  LUC (Ledger Usage Calculator)      |
                  |  estimate() • canExecute() • recordUsage() |
                  |  Custom service keys for your app   |
                  +-------------------+-----------------+
                                      |
                                      v
                  +-------------------------------------+
                  |       SECURITY & DURABILITY LAYER   |
                  |  Real App Forever 12 Pillars        |
                  |  Kata MicroVMs • Tenancy Isolation  |
                  |  Secrets Outside Code • SBOM Scans  |
                  +-------------------+-----------------+
                                      |
                                      v
                  +-------------------------------------+
                  |        BACKEND & SERVICES LAYER     |
                  |  SimStudio (workflows)              |
                  |  InsForge (DB/auth/storage)         |
                  |  OpenSandbox (safe execution)       |
                  |  AIMS micro-services                |
                  +-------------------+-----------------+
                                      |
                                      v
                  +-------------------------------------+
                  |        DEPLOYMENT LAYER             |
                  |  Hostinger VPS + Docker Manager     |
                  |  Isolated Projects • Auto-SSL       |
                  |  Traefik + Custom Domain + CDN      |
                  +-------------------------------------+

================================================================================
DETAILED COMPONENT BREAKDOWN
================================================================================

1. INFRASTRUCTURE BASE  
   - Hostinger KVM VPS (recommended: 8 vCPU / 32 GB RAM)  
   - Docker Manager with isolated projects (never mix with existing apps)  
   - Auto-SSL + custom domain + CDN enabled  
   - Traefik for routing between services

2. CORE ENGINE (OpenClaw Base)  
   - WebSocket Gateway at ws://127.0.0.1:18789  
   - Native browser agent, terminal control, desktop control  
   - 100+ pre-built AgentSkills (shell, files, web automation)  
   - Full MCP (Model Context Protocol) support

3. VOICE-FIRST + VISION-FIRST LAYER  
   - User-selectable voice providers: Grok Voice, NVIDIA PersonaPlex, ElevenLabs  
   - STT → LLM reasoning → TTS loop  
   - Delta screenshots sent to vision model with spoken screen descriptions  
   - Full hands-free operation for users with eyesight or hand-mobility disabilities

4. MAKE IT MINE CLONING ENGINE  
   - Clone any GitHub repo  
   - Scan for gaps  
   - Automatically add our customizations (voice, LUC metering, accessibility)  
   - Containerize and deploy via Coolify to custom subdomain

5. LEDGER USAGE CALCULATOR (LUC) METERING LAYER  
   - Headless engine only  
   - estimate() → shows projected cost  
   - canExecute() → hard gate before any billable action  
   - recordUsage() → logs actual usage  
   - Service keys are customized to your app (llm_tokens_in, voice_minutes, container_hours, storage_gb, etc.)  
   - Soft warning at 80%, hard block at 110%

6. SECURITY & DURABILITY LAYER  
   - Enforces all 12 Real App Forever pillars  
   - Kata/Firecracker microVMs for isolated execution  
   - Tenancy isolation via InsForge  
   - Secrets never in code  
   - SBOM generation + vulnerability scans  
   - Reproducible builds + one-click rollback

7. BACKEND & SERVICES LAYER  
   - SimStudio: drag-and-drop workflows and multi-agent orchestration  
   - InsForge: database, auth, realtime, storage, edge functions  
   - OpenSandbox: safe Chrome/desktop execution environment  
   - AIMS micro-services (mim-orchestrator, boomerang-scout, oracle-verifier)

8. DEPLOYMENT & OPERATIONS  
   - Blue-green or canary releases  
   - Full monitoring via Docker Manager + InsForge logs  
   - LUC cost dashboards  
   - Daily backups and monthly restore drills

================================================================================
GATES & EVIDENCE (MUST PASS BEFORE MOVING FORWARD)
================================================================================
• Discovery Gate          → Problem + promise documented  
• Design Gate             → User shell vs admin shell separated  
• Make It Mine Gate       → Cloned version runs with customizations  
• LUC Gate                → Metering wired to every billable action  
• Security Gate           → All 12 pillars confirmed  
• Verify Gate             → Tests + scans clean  
• Deploy Gate             → Live on custom domain with monitoring  
• Final Launch Gate       → Full proof bundle (screenshots, tests, LUC logs, rollback plan)

This document is the single source of truth for Chicken Hawk.  
Think it. Prompt it. Let ACHEEVY Manage it.
