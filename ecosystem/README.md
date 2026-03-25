# AIMS Ecosystem Network

> The interconnected repository network powering the A.I.M.S. platform.

## Architecture

```
                        +-----------------+
                        |    MyClaw Hub    |
                        | (orchestration) |
                        +--------+--------+
                                 |
                    +------------+------------+
                    |                         |
           +--------v--------+      +---------v---------+
           |   A.I.M.S.      |      | ACHEEVY.digital   |
           | (platform core) |      | (public portal)   |
           +---+----+----+---+      +-------------------+
               |    |    |
    +----------+    |    +----------+
    |               |               |
+---v---+     +-----v-----+   +----v----+
|GRAMMAR|     |Agent-009   |   |Chicken  |
|(NLP)  |     |(Boomer_Ang)|   |Hawk     |
+-------+     +-----+------+  +---------+
                    |
         +----------+----------+
         |                     |
   +-----v------+      +------v-------+
   |   Whisper   |      | Destinations |
   |   (STT)     |      |     AI       |
   +-------------+      +------+-------+
                               |
                    +----------+----------+
                    |                     |
              +-----v------+      +------v--------+
              |    LUC      |      | PERFORM       |
              | (calculator)|      | (analytics)   |
              +-----+-------+      +--------------+
                    |
              +-----v---------+
              | Locale v2     |
              | (frontend)    |
              +---------------+

          +-------------------+
          |    CH-Docs        |
          | (documentation)   |
          +-------------------+
```

## Repos & Roles

| Repo | Role | What It Provides |
|------|------|------------------|
| **myclaw** | Hub | Docker orchestration, API gateway, ecosystem registry |
| **AIMS** | Platform Core | Frontend, backend, ACHEEVY chat, aiPLUGS, CRM |
| **Chicken-Hawk** | Intelligence | Market intel, competitive analysis |
| **acheevy-whisper-build** | Service | Speech-to-text via Whisper |
| **acheevy.digital** | Frontend | Public website, marketing portal |
| **destinations-ai** | Service | Location & travel AI intelligence |
| **Agent-ACHEEVY-009** | Agent | Boomer_Ang autonomous agent framework |
| **GRAMMAR** | Service | NLP, grammar analysis, text intelligence |
| **the-perform-platform** | Service | KPI analytics, business intelligence |
| **CH-Docs** | Documentation | Centralized ecosystem docs |
| **LUC-Locale-Universal-Calculator** | Service | Multi-locale financial calculator |
| **Locale-by-ACHIEVEMOR-2** | Frontend | Locale UI with ACHIEVEMOR integration |

## Branding

- **AIMS Logo**: Gold diagonal lines with "A.I.M.S." text
- **ACHEEVY Helmet**: The iconic green/gold helmet — used as the **chat interface icon** across all repos
- **Color Palette**: Gold (#C8A84E), Dark Gold (#8B7635), Navy Surface (#1A1A2E), Accent Gold (#FFD700)

## How It Works

Each repo contains an `ecosystem.node.json` that declares:
- What services it **provides** to the network
- What services it **consumes** from other repos
- Its **role** in the ecosystem (hub, platform-core, service, frontend, agent, documentation)

The hub (`myclaw/ecosystem.json`) is the master registry that maps all connections.
