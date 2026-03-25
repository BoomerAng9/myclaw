# BoomerAng9 Ecosystem Network

This directory contains the shared contracts and utilities that connect all repositories in the ecosystem.

## Network Topology

```
                    +------------------+
                    |     myclaw       |
                    |   (Hub/Registry) |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
     +--------v---------+         +---------v--------+
     |      AIMS        |         |   Chicken-Hawk   |
     | (Main Platform)  |         |   (API Gateway)  |
     +----+----+----+---+         +--+--+--+--+--+---+
          |    |    |                |  |  |  |  |
     +----+  +-+  +-+----+     +----+  |  |  |  +----+
     |       |       |         |       |  |  |       |
+----v--+ +--v---+ +-v------+  |   +---v--v--v---+   |
|Grammar| |Agent | |Whisper |  |   |  Verticals  |   |
| (Chat)| | 009  | | Build  |  |   +--+-------+--+   |
+-------+ +------+ +--------+  |      |       |      |
                               |  +---v---+ +-v------+
                               |  |Dest AI| |Estate  |
                               |  +-------+ |Mind AI |
                               |            +--------+
                               |
                        +------v--------+
                        |acheevy.digital|
                        | (Marketing)   |
                        +---------------+
```

## Repo Roles

| Repo | Role | Key Responsibility |
|------|------|-------------------|
| `myclaw` | Hub | Central registry, Docker orchestration, shared assets |
| `AIMS` | Platform | Main app — frontend, backend, Firebase, AI plugs |
| `Chicken-Hawk` | Gateway | API routing, rate limiting, auth proxy |
| `Agent-ACHEEVY-009` | Agent | Python AI agent, chat server, sandbox |
| `GRAMMAR` | Service | Chat UI, LibreChat, Remotion video engine |
| `acheevy-whisper-build` | App | Voice-first Whisper UI |
| `acheevy.digital` | Marketing | Public landing pages |
| `destinations-ai` | Vertical | Travel AI vertical |
| `estatemind-ai` | Vertical | Real estate AI vertical |

## Shared Contracts

- **Auth**: Firebase Auth JWT tokens (provider: AIMS)
- **Agent Protocol**: REST + WebSocket at `/api/v1/chat`, `/ws/v1/stream` (provider: Agent-009)
- **Gateway Routing**: All traffic routes through Chicken-Hawk
- **Event Bus**: Firebase PubSub for cross-service events

## How It Works

Each repo contains a `.ecosystem.json` file that declares:
- What the repo **provides** (APIs, components, data)
- What it **consumes** from other repos
- Its **connections** and the protocols used

The master manifest at `myclaw/ecosystem-network.json` aggregates all nodes and edges into a single network graph.

## Adding a New Repo

1. Create `.ecosystem.json` in the new repo root
2. Add the node to `myclaw/ecosystem-network.json`
3. Define edges (connections) to existing nodes
4. Update gateway routes in Chicken-Hawk if the service needs public API access
