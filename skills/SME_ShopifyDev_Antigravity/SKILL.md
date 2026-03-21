---
name: SME_ShopifyDev_Antigravity
description: Defines the standard operating procedure (SOP) for utilizing the StitchMCP server (Gemini Design + Vertex AI capabilities) to architect, design, and package dynamic, high-converting Shopify themes.
---

# SME ShopifyDev Skill

## Core Objective
Orchestrate a swarm of agents (Designer_Ang, Coder_Ang) to seamlessly generate `.zip` deployable Shopify themes rather than piecemeal patching. Leverage StitchMCP and Gemini Design models to synthesize UI/UX structures before applying Liquid. E-commerce sites must feel alive: integrate Remotion / Vertex AI macro-animations (glassmorphism, scroll parallax, hero video backgrounds).

## Rules of Engagement

1. **Never Patch Live via Theme Kit (Unless Instructed):**
   Always architect entirely new themes as a `.zip` artifact if doing an overhaul. The outcome must be a fully structured directory containing `/layout`, `/templates`, `/sections`, and `/assets` which can be compressed and uploaded cleanly by the human.

2. **Always Use StitchMCP for Ideation:**
   Before writing raw CSS or Liquid, you MUST spawn a Stitch project:
   - Use `mcp_StitchMCP_create_project` to initialize context.
   - Use `mcp_StitchMCP_generate_screen_from_text` to establish the Hero, Product, and Collection pages visually. Include exact descriptions of animations requested (e.g. "Glassmorphic hero banner with glowing neon `#00CECE` borders and floating 3D elements").

3. **High-Conversion Shopify Blueprints:**
   Research indicates top e-commerce funnels require:
   - **Above the Fold Core Value:** Hero sections must immediately establish trust (e.g. "ACHIEVEMOR x MindEdge" badges, 4.5/5 stars).
   - **Sticky Cart & Dynamic Checkout:** Ensure quick-buy functionality is easily injectable.
   - **Categorized Routing (MindEdge Gateway):** Do not render 300+ items directly unless using a sophisticated search endpoint. Route traffic linearly via Category buckets.
   - **Rich Media Assets:** Video backgrounds or subtle WebGL micro-interactions via Remotion.

4. **Directory Structure Standardization:**
   When writing the code for the theme `achievemor-premium-theme`, assert the following architecture:
   ```
   achievemor_shopify/
   ├── layout/
   │   └── theme.liquid
   ├── templates/
   │   ├── index.json
   │   ├── product.json
   │   └── page.mindedge.json
   ├── sections/
   │   ├── mindedge-hero.liquid
   │   ├── custom-grid.liquid
   │   └── header.liquid
   └── assets/
       ├── global.css
       └── animations.js
   ```

5. **Compression & Handoff:**
   Use native scripts (e.g., PowerShell `tar` or Bash `zip`) to compress the finalized `achievemor_shopify/` directory into `achievemor-premium-theme.zip`. Pass this file to the user for one-click ingestion.

## Execution Stepper

**Step 1:** Stitch Ideation -> Invoke `mcp_StitchMCP_create_project`, then generate the UI visually. Request human approval of the Stitch output concepts if they contain drastic layout changes.
**Step 2:** Scaffold Architecture -> Construct the core empty `.liquid` and `.json` files.
**Step 3:** Translate Design to Code -> Map Stitch concepts into native HTML/CSS/Liquid embedded logically.
**Step 4:** Asset Generation -> Use standard tools to fetch images or inject CSS micro-animations.
**Step 5:** Finalize Zip -> Package and provide the finalized artifact.
