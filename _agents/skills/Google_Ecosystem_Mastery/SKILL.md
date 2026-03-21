---
name: Google_Ecosystem_Mastery
description: "Advanced utilization of the Gemini API (AI Studio), Google Maps, Google Workspace, Figma integrations, and accelerated CI/CD Deployments within the ACHEEVY runtime."
---

# Google Ecosystem Mastery & API Capabilities

This skill dictates how ACHEEVY (Antigravity) interacts with the Google-first architecture, leveraging maximum capabilities from the Gemini API, Google Maps, Figma, Workspace, and GitHub for accelerated deployment.

## 1. Gemini API (AI Studio) & Antigravity Upgrades
- **Vibe Coding via AI Studio:** ACHEEVY will utilize the Gemini API to stream deep context, reasoning tokens, and multimodal analysis (including images/audio) to govern other sub-agents.
- **Enhanced Design Control:** By integrating Gemini's multi-modal capabilities, we can analyze UI/UX mockups pixel-by-pixel, enforcing structural "Nothing" brand aesthetics or any customized design systems. 
- **Stitch Integration:** When deploying UI, the Gemini API drives Stitch to generate React/Liquid/HTML outputs that match strict prompt architectures perfectly. 

## 2. Google Maps API Integration
The Gemini API, when coupled with Google Maps, unlocks spacial reasoning:
- **Use Cases:** Dynamic location routing, geospatial database queries (Firestore GeoPoints), bounding-box limits for queries, and rich interactive map UI components in the front-end (e.g., store locators, dynamic regional filtering).
- **Execution:** ACHEEVY will structure the API calls (`Places API`, `Geocoding API`, `Maps JavaScript API`) into the backend services and expose them via clean GraphQL or REST interfaces.

## 3. Figma Prototyping Integration
- **Direct Translation:** Use the Gemini API to translate exported Figma JSON/CSS or visual screenshots directly into React components or Shopify Liquid structural code.
- **Iteration:** By treating Figma as the "Source of Truth," ACHEEVY can ingest Figma design tokens (colors, typography, spacing) and enforce them across the entire workspace universally.

## 4. workspace & GitHub (Multi-Chat Orchestration)
- **Google Workspace:** Connecting Docs/Drive to act as the "memory" or "knowledge base" (RAG) for the system. 
- **Controller UI:** We will construct a better UI for standardizing agent control, separating concerns (e.g., one chat for structural dev, one chat for marketing, one chat for backend ops) without convoluting the primary application. 
- **GitHub Flow:** ACHEEVY will strictly use a branching strategy. 
  1. **Branch:** `feature/...`
  2. **Build & Test:** Run local/live previews.
  3. **PR:** Automatically generate comprehensive PRs containing the context, evidence, and approvals from the `Validator_Ang`.

## 5. Deployment Flow (Publish, Test, PR)
When a section of code is finished:
1. **Publish/Deploy:** ACHEEVY initiates a staging deploy (e.g., Firebase Hosting Preview Channels or Vercel/Traefik).
2. **Test Live:** Provide the exact live URL to the human user for immediate visual verification.
3. **Push & PR:** Upon human approval, immediately commit, push, and open a PR into `main` with the testing evidence attached.

---
**Core Rule:** Always keep the ecosystem native. Prefer GCP, Firebase, Workspace, and Gemini over 3rd-party alternatives whenever possible.
