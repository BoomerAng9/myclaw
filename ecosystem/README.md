# AIMS Ecosystem — MyClaw Node

This repo is a **Tier 1 Infrastructure Satellite** in the A.I.M.S. ecosystem.

## Role
MyClaw is the runtime substrate for OpenClaw and Foai.cloud. It provides:
- Docker compositions and container templates
- Deployment scripts and infrastructure tooling
- ACHEEVY chat widget (acheevy-chat.js/css)
- Shopify theme assets

## Ecosystem Position
- **Hub**: [AIMS](https://github.com/BoomerAng9/AIMS) (source of truth)
- **Registry**: `ecosystem.json` lives in AIMS
- **This node**: `ecosystem.node.json` declares what MyClaw provides/consumes

## Rules
- AIMS defines the ecosystem; MyClaw serves it
- ACHEEVY Helmet is the chat interface icon everywhere
- All changes notify the hub via ecosystem sync workflow
