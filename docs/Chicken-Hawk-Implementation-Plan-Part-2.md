# Chicken Hawk Implementation Plan
## Step-by-Step Build Instructions for Intern
**Date:** March 20, 2026
**Owner:** ACHIEVEMOR
**Goal:** Build Chicken Hawk on top of existing OpenClaw + already-implemented Nemo Claw. Deployed agents = Lil_Hawks.

**STEP 1 – Environment Setup (Hostinger VPS)**
1. Log into Hostinger Docker Manager.
2. Create new isolated project named “chicken-hawk”.
3. Deploy base OpenClaw via Compose from URL (use latest 2026.2.15 docker-compose.yml).
4. Confirm Nemo Claw is already running in its own project and note its internal URL.

**STEP 2 – Core OpenClaw Base Integration**
1. In chicken-hawk project, edit .env with OpenRouter key.
2. Set default models: Claude Opus default → Grok fallback.
3. Verify Gateway runs on ws://127.0.0.1:18789 and Web UI loads at http://your-vps-ip:18789.

**STEP 3 – Voice-First + Vision-First Layer**
1. Add voice-layer Docker service (NVIDIA PersonaPlex + ElevenLabs bridge).
2. Wire STT/TTS into OpenClaw composer.
3. Add delta-screenshot vision loop with spoken descriptions.
4. Test: “Book my flight and read the confirmation aloud” (hands-free).

**STEP 4 – Make It Mine Cloning Engine**
1. Deploy Coolify in separate Docker project.
2. Connect to Hostinger DNS for auto subdomains.
3. Test: Voice command “Clone [any repo] and deploy to mydomain.com”.

**STEP 5 – Ledger Usage Calculator (LUC) Integration**
1. Add LUC tool module to chicken-hawk project.
2. Define service keys (llm_tokens_in, voice_minutes, container_hours, etc.).
3. Wire estimate/canExecute/recordUsage around every billable action (including Nemo Claw calls).
4. Test: Attempt action when over quota — must be blocked with warning.

**STEP 6 – Security & Nemo Claw Integration**
1. Enable Kata microVMs in OpenSandbox.
2. Connect existing Nemo Claw as Lil_Hawk orchestration layer (via MCP bridge).
3. Apply all 12 Real App Forever pillars.
4. Test: High-risk action requires human approval gate.

**STEP 7 – Backend & Services Wiring**
1. Connect SimStudio, InsForge, OpenSandbox.
2. Add AIMS micro-services (mim-orchestrator, boomerang-scout, oracle-verifier).
3. Confirm Nemo Claw is fully accessible from Chicken Hawk.

**STEP 8 – Deploy & Test Lil_Hawks**
1. Deploy Chicken Hawk via Coolify to custom domain.
2. Create first Lil_Hawk (deployed agent instance).
3. Test end-to-end: Voice command deploys a Lil_Hawk that completes a task autonomously.

**STEP 9 – Final Verification**
- Run all gates from Part 1.
- Create proof bundle (screenshots, LUC logs, test transcripts).
- Handover: Chicken Hawk live with Lil_Hawks ready to deploy.

**SWAP NOTES**
- Voice provider: swap Grok/ElevenLabs as needed.
- Metering: add/remove LUC service keys for new features.
- Base: any MCP-compatible agent can replace OpenClaw.
