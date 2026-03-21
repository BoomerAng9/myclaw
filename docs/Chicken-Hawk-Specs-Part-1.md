# Chicken Hawk Specification & Technology Stack
## ACHIEVEMOR Voice-First + Vision-First Autonomous AI Agent
**Version:** 1.0 (built on OpenClaw 2026.2.15 base + existing Nemo Claw)
**Date:** March 20, 2026
**Owner:** ACHIEVEMOR
**Purpose:** This is the complete blueprint for building Chicken Hawk — our Make It Mine customized version of OpenClaw. Deployed agents are called Lil_Hawks.

**What “Make It Mine” means**
Make It Mine is our standard process for taking any existing open-source or third-party application (or GitHub repo), cloning it, and then adding our exact customizations — voice-first interaction, vision accessibility, Ledger Usage Calculator metering, security hardening, real-time automation, and deployment to a custom domain.

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
|    / ElevenLabs [SWAP]         |                    |  • Add voice/vision/LUC |
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
                  |  Nemo Claw (already implemented)    |
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
   - Docker Manager with isolated projects

2. CORE ENGINE (OpenClaw Base – 2026.2.15)
   - WebSocket Gateway at ws://127.0.0.1:18789
   - Channel Adapters, Agent Runtime, Memory System, Tool Execution, Canvas & A2UI, Plugin System, Multi-Agent Tools

3. VOICE-FIRST + VISION-FIRST LAYER
   - User-selectable providers: Grok Voice, NVIDIA PersonaPlex, ElevenLabs
   - Delta screenshots with spoken descriptions

4. MAKE IT MINE CLONING ENGINE
   - Clone any GitHub repo
   - Automatically add our customizations

5. LEDGER USAGE CALCULATOR (LUC) METERING LAYER
   - estimate() • canExecute() • recordUsage()

6. SECURITY & DURABILITY LAYER
   - Enforces all 12 Real App Forever pillars

7. BACKEND & SERVICES LAYER
   - SimStudio, InsForge, OpenSandbox, AIMS micro-services
   - Nemo Claw (already implemented — integrated as additional Lil_Hawk orchestration layer)

8. DEPLOYMENT & OPERATIONS
   - Blue-green releases, LUC cost dashboards

================================================================================
GATES & EVIDENCE (MUST PASS BEFORE MOVING FORWARD)
================================================================================
• Discovery Gate
• Design Gate
• Make It Mine Gate
• LUC Gate
• Security Gate
• Verify Gate
• Deploy Gate
• Final Launch Gate
