# GRAMMAR Operating Guidebook
### Version 4.0 — Integrated Runtime Edition

---

## GRAMMAR in One Sentence

**GRAMMAR is ACHIEVEMOR’s API-first, vision-first action runtime** — the system that turns plain human intent into governed, multi-agent execution, routes each action by capability class, coordinates specialized tools and model services, and returns reviewed, package-ready outcomes through a lite UI and an embeddable API.

---

## Part 1: What Changed in Version 4.0

This edition updates the guidebook to reflect the current direction of the platform and the tooling decisions made in recent planning.

### New in this version
- Clarifies that **ACHEEVY, Boomer_Angs, NTNTN, MIM, Picker_Ang, and BuildSmith are runtime responsibilities that GRAMMAR must implement explicitly**
- Adds the **integrated tool stack**:
  - LangGraph
  - DeerFlow
  - CoPaw
  - OpenSandbox
  - OpenRouter
  - Brave Search API
  - Firecrawl
  - Playwright MCP
  - E2B
  - OpenCode
  - Mercury 2
- Defines **who actually executes tasks**
- Adds a **service ownership matrix**
- Adds the **repo interaction map** for:
  - Agent-ACHEEVY-009
  - AIMS
  - acheevy-whisper-build
- Clarifies **API-first + lite UI**
- Adds **deployment defaults** for Hostinger VPS
- Clarifies **Docker Compose on the VPS only** unless local testing explicitly requires Docker
- Strengthens the **ASCII-first UI rule**
- Adds **phase-1 scope control** so the repo does not become overloaded

---

## Part 2: Identity, Vision, Mission, and Objectives

### 2.1 What GRAMMAR Is

GRAMMAR is not:
- a generic chatbot
- a prompt wrapper
- a provider-specific automation layer
- a single-agent assistant
- a website-first product

GRAMMAR is:
- an API-first orchestration runtime
- a capability router
- a context-governed action system
- a swarm coordination layer
- a review-driven delivery engine
- a lite UI over a deeper runtime

Its job is to:
- understand what the user wants
- structure that into controlled context
- break work into actions
- select the right capabilities
- execute work across specialized services
- review and fix outputs
- package and deliver outcomes

### 2.2 Vision

Build a provider-agnostic, vision-first action runtime that can interpret human intent in plain language, coordinate the right swarm of agents and tools, execute and review complex work, and return traceable outcomes across creative, technical, analytical, and operational domains.

### 2.3 Mission

Enable ACHIEVEMOR systems to behave like an always-on digital production organization that:
- understands the real objective behind the request
- chooses the correct workflow
- chooses the best tools and models by capability
- runs work in parallel where appropriate
- catches and fixes issues before delivery
- packages every serious outcome with traceability

### 2.4 Objectives

#### Core objectives
- convert layman language into technically usable intent
- preserve context, revisions, and memory across sessions
- route by capability class instead of provider lock-in
- use specialized agent roles instead of a single general agent
- support text, voice, image, video, and source-driven workflows
- produce outputs that are reviewable, correctable, and packageable
- keep the runtime modular and replaceable by layer
- preserve truthful implementation claims

#### Product objectives
- provide a light UI for users who want direct interaction
- keep the primary product API-first for embedding and IDE use
- support approvals, board visibility, and evidence bundles
- support a plugin / extension / MCP-friendly future model
- support source attachment and reusable context

#### Technical objectives
- schema-first contracts
- durable workflow execution
- async task execution
- capability registry
- model routing
- tool permissioning
- MIM-governed context and memory
- review and fix loops before release
- production-grade observability, cost tracking, and release gates

---

## Part 3: Explicit Runtime Responsibilities

These names are part of the GRAMMAR operating model. They should not be treated as already-existing services unless they are implemented in code or provided by another connected repo.

### 3.1 NTNTN
**Role:** Intention-framing layer

Purpose:
- interpret the request
- sharpen ambiguity
- identify the real objective
- produce a normalized intent object

### 3.2 MIM
**Role:** Methodology for Intent and Memory

Purpose:
- create Context Packs
- version context
- track change orders
- store approvals / rejections
- distribute governed context to all execution roles

Important:
**MIM is not an agent.**

### 3.3 ACHEEVY
**Role:** Orchestrator responsibility

Purpose:
- run the huddle
- create the action board
- dispatch specialized roles
- manage parallel execution
- manage review and approval checkpoints

Important:
**ACHEEVY coordinates. It does not execute raw tasks directly.**

### 3.4 Boomer_Angs
**Role:** Specialized execution roles

Purpose:
- perform domain-specific work
- act on MIM-governed context
- run in parallel where dependencies allow

### 3.5 Picker_Ang
**Role:** Capability router

Purpose:
- query the capability registry
- rank models / tools / providers
- define fallbacks
- select the best route for each action

Important:
**Route by capability first, provider second.**

### 3.6 BuildSmith
**Role:** Assembly and implementation responsibility

Purpose:
- assemble approved work into actual builds or deliverables
- coordinate artifact creation
- coordinate packaging and handoff

### 3.7 Review / Hone
**Role:** Validation and correction layer

Purpose:
- inspect outputs against the context pack
- detect issues
- apply safe auto-fixes
- escalate approval-required changes
- gate release and packaging

---

## Part 4: Four-Plane Architecture

### 4.1 Experience Plane
The light interface layer.

Capabilities:
- Chat w/ACHEEVY
- source and asset attachment
- model selection
- voice selection
- board monitor
- approval gates
- review findings
- delivery bundle retrieval
- artifact browsing

### 4.2 Control Plane
The planning and coordination layer.

Responsibilities:
- NTNTN
- MIM runtime
- ACHEEVY orchestration
- LangGraph graph execution
- capability registry
- approval policy
- board state

### 4.3 Execution Plane
The work layer.

Responsibilities:
- Boomer_Ang execution roles
- DeerFlow workflows
- OpenSandbox runtime jobs
- Playwright browser actions
- research and synthesis branches
- BuildSmith assembly
- review and packaging

### 4.4 Platform Plane
The infrastructure and governance layer.

Responsibilities:
- auth and RBAC
- subscriptions and billing hooks
- observability
- queueing
- artifact storage
- evidence bundles
- evaluation harness
- deployment and release control

---

## Part 5: Tool Stack and How the Tools Work Together

The following tools should remain **separate but cohesive**. GRAMMAR should not collapse them into one monolith.

### 5.1 LangGraph
**Use case in GRAMMAR:** workflow spine

Why it belongs:
- durable execution
- graph-based orchestration
- pause / resume
- approvals and interrupts
- stateful long-running workflows
- checkpointed board execution

LangGraph owns:
- workflow graph definitions
- thread / state persistence
- approval checkpoints
- resume-after-interrupt logic
- execution history

LangGraph does not own:
- the UI
- long-term workstation memory UX
- browser execution
- raw research tasks
- final package rendering

### 5.2 DeerFlow
**Use case in GRAMMAR:** research and deep task specialist

Why it belongs:
- planner / researcher / reporter patterns
- built-in retrieval-heavy workflows
- search, crawling, code execution, and reporting
- MCP compatibility
- private knowledge options
- strong fit for source-grounded and evidence-heavy jobs

DeerFlow owns:
- research plans
- search / crawl / synthesize flows
- long-form evidence gathering
- report-style task branches
- retrieval-heavy agent operations

DeerFlow does not own:
- the global orchestration identity
- the platform memory source of truth
- the entire GRAMMAR UI
- all action types by default

### 5.3 CoPaw
**Use case in GRAMMAR:** operator workstation and skill surface

Why it belongs:
- skills system
- scheduled / cron-style execution
- persistent assistant memory ergonomics
- multi-channel support
- operator console
- workstation assistant patterns

CoPaw owns:
- operator-facing helper flows
- recurring routines
- skills activation
- workstation-style memory patterns
- console-level agent assistance

CoPaw does not own:
- the platform-wide orchestration graph
- the execution board source of truth
- the primary runtime execution substrate

### 5.4 OpenSandbox
**Use case in GRAMMAR:** isolated execution runtime

Why it belongs:
- sandbox lifecycle management
- command execution
- file operations
- browser and code runtime isolation
- safe execution for risky or long-running jobs

OpenSandbox owns:
- high-risk code execution
- browser or tool execution in isolation
- sandbox lifecycle APIs
- port exposure for runtime jobs
- artifact collection from isolated tasks

OpenSandbox does not own:
- orchestration planning
- context management
- user-facing workflow logic

### 5.5 OpenRouter
**Use case in GRAMMAR:** model gateway and model metadata layer

Why it belongs:
- single API for multiple models
- tool and structured-output metadata
- model switching without hard-coding vendors
- unified entry point for reasoning models

OpenRouter owns:
- model access
- model capability visibility
- routing compatibility data
- provider switching at the model layer

### 5.6 Mercury 2
**Use case in GRAMMAR:** fast orchestration reasoning

Mercury 2 should be used for:
- NTNTN intent interpretation
- ACHEEVY huddles
- fast branch planning
- low-latency routing loops
- quick repair reasoning

Mercury 2 should not automatically be used for every step.
It is best where orchestration speed matters most.

### 5.7 Brave Search API
**Use case in GRAMMAR:** search grounding

Brave belongs because:
- it is a live web search grounding layer
- it supports AI-oriented grounded answers
- it can provide citations and real-time context
- it is strong for finding, not scraping

Brave owns:
- finding sources
- grounding live web queries
- search-oriented enrichment

### 5.8 Firecrawl
**Use case in GRAMMAR:** scrape, extract, and structure

Firecrawl belongs because:
- it turns websites into LLM-ready data
- it supports scraping, crawling, extraction, and structured outputs
- it supports MCP usage
- it is useful after search or for direct URL extraction

Firecrawl owns:
- scrape and extraction
- structured page conversion
- site crawling
- LLM-ready content output
- extraction from known URLs

### 5.9 Playwright MCP
**Use case in GRAMMAR:** browser automation

Playwright MCP belongs because:
- it gives deterministic browser control
- it is stronger than asking a model to “guess the DOM”
- it enables repeatable flows for login, interaction, browsing, and validation

Playwright MCP owns:
- navigation
- click / fill / browse automation
- deterministic browser actions
- browser-based validation tasks

### 5.10 E2B
**Use case in GRAMMAR:** dev/test sandbox fallback

E2B belongs as:
- an experimentation layer
- a testing and prototyping sandbox
- a backup code-execution option during development

E2B should not be the primary production executor if OpenSandbox is already the chosen runtime substrate.

### 5.11 OpenCode
**Use case in GRAMMAR:** IDE coding assistant

OpenCode belongs because:
- it supports primary agents and subagents
- it has permission-controlled tool access
- it is strong for development workflows inside the IDE
- it helps with planning, exploration, and code execution

OpenCode should be used:
- in the developer workflow
- in AntiGravity / terminal coding sessions
- as a coding-side assistant

OpenCode should not become the production runtime of GRAMMAR itself.

---

## Part 6: Who Actually Executes Tasks

This is the clearest execution ownership map.

### 6.1 What executes reasoning
- LLMs accessed through **OpenRouter**
- Mercury 2 for fast orchestration passes
- other task-specific models selected by Picker_Ang

### 6.2 What executes workflows
- **LangGraph** executes durable workflow graphs and state transitions

### 6.3 What executes research-heavy branches
- **DeerFlow** executes planner / researcher / report-style workflows

### 6.4 What executes isolated code and browser work
- **OpenSandbox** executes shell, code, files, and isolated runtime jobs
- **Playwright MCP** executes browser automation within approved flows

### 6.5 What executes operator-side routines
- **CoPaw** executes workstation-style skills and scheduled helper tasks

### 6.6 What executes developer-side coding help
- **OpenCode** executes coding assistance and subagent work in the IDE

### 6.7 What executes packaging
- **BuildSmith workers** assemble delivery bundles, manifests, and output packages

---

## Part 7: How the Tools Work Together in a GRAMMAR Workflow

### 7.1 High-level flow

1. User submits a request through API or the light UI
2. NTNTN interprets the intent
3. TKI converts layman language into structured technical intent
4. MIM creates or updates the Context Pack
5. MIM Context Capture extracts structured information from attached assets
6. ACHEEVY runs the huddle
7. LangGraph builds or resumes the Action Graph
8. Picker_Ang selects capabilities and candidate providers
9. Specialized branches execute:
   - DeerFlow for research / retrieval tasks
   - OpenSandbox for isolated execution
   - Playwright MCP for browser tasks
   - other model calls through OpenRouter
10. BuildSmith assembles outputs
11. Review / Hone checks, fixes, or escalates
12. Packaging creates the delivery bundle
13. MIM stores final revisions, findings, approvals, and evidence

### 7.2 Example: source video → analyzed segment package

1. User attaches a video
2. NTNTN identifies the request as a video-analysis + production workflow
3. MIM Context Capture extracts video-derived structure and missing constraints
4. DeerFlow runs research and synthesis branches
5. Brave finds supporting context if needed
6. Firecrawl extracts source pages or article context if needed
7. OpenRouter serves the selected models for script / planning / reasoning tasks
8. OpenSandbox runs any code or browser jobs needed
9. BuildSmith assembles the segment package
10. Review / Hone validates the output
11. Packaging creates the final delivery bundle

---

## Part 8: Repo Interaction Map

GRAMMAR will connect to other repos, but it must remain the system of record for orchestration contracts and runtime action logic.

### 8.1 Agent-ACHEEVY-009
Treat as:
- a runtime reference repo
- a source of deployment and execution patterns
- a likely source for websocket / sandbox / multi-model execution ideas

Use for:
- backend topology reference
- infra and deployment reference
- runtime event and execution patterns

### 8.2 AIMS
Treat as:
- a connected repo pending deeper alignment
- a candidate system for future integration

Until deeper analysis is finalized:
- do not let AIMS redefine GRAMMAR’s runtime contracts
- connect to it through explicit integration boundaries

### 8.3 acheevy-whisper-build
Treat as:
- a UI donor repo
- a source of shell and component patterns
- a reference for front-end structure

Use for:
- front-end shell ideas
- chat and route patterns
- visual or interaction borrowing

Do not use it as the source of truth for GRAMMAR backend architecture.

### 8.4 Boundary rule
Connected repos provide:
- UI patterns
- runtime patterns
- upstream business or product context

GRAMMAR provides:
- context packs
- action boards
- capability routing
- review gates
- evidence bundles
- packaging and runtime contracts

---

## Part 9: API-First + Lite UI

### 9.1 Product priority
Primary:
- API
- IDE / plugin / MCP friendliness
- embed-into-project usage

Secondary:
- light web UI
- operator interaction
- approval and review console

### 9.2 Why the UI still matters
Even with API-first delivery, the UI must exist because users expect:
- a shell to prompt the system
- visibility into what is running
- approvals and corrections
- access to artifacts
- review and audit surfaces

### 9.3 Core shell
**Chat w/ACHEEVY**

Required controls:
- prompt input
- file/source attachment
- model switcher
- voice selector
- data source selector
- send / run
- stop / interrupt
- evidence bundle access
- approval actions
- board monitor access

---

## Part 10: ASCII-First UI Law

Before any major UI work, create an ASCII prototype first.

### Required for:
- chat shell changes
- board monitor
- review console
- source builder
- admin console
- workflow-facing pages

### Minimum ASCII artifact
- title
- goal
- assumptions
- revision
- layout sketch
- editable notes

Example:

```text
+----------------------------------------------------------------------------------+
| Chat w/ACHEEVY                                                    [ Model v ]    |
|----------------------------------------------------------------------------------|
| [ + Attach ]   [ Voice v ]   [ Data Sources v ]   [ Build Source ]   [ Send ]   |
|----------------------------------------------------------------------------------|
| Selected Sources: [Source A x] [Source B x] [Source C x]                         |
|----------------------------------------------------------------------------------|
| Prompt / transcript / attached context zone                                      |
|----------------------------------------------------------------------------------|
| Response stream / board state / review findings                                  |
|----------------------------------------------------------------------------------|
| Status: planning | running | review | packaged                                   |
+----------------------------------------------------------------------------------+
```

---

## Part 11: Phase-1 Stack Control

To avoid overloading the repo, phase 1 should keep the stack tight.

### 11.1 Keep for phase 1
- LangGraph
- DeerFlow
- CoPaw
- OpenSandbox
- OpenRouter
- Mercury 2
- Brave
- Firecrawl
- Playwright MCP
- OpenCode
- Postgres
- Redis
- object storage
- light UI

### 11.2 Use only for dev/test
- E2B

### 11.3 Hold out of phase 1
- extra executor frameworks beyond the approved stack
- redundant coding agents that overlap OpenCode
- unverified tools without clear ownership

---

## Part 12: Backend and Deployment Defaults

### 12.1 Recommended backend
Use:
- **Hostinger VPS**
- **Docker Compose on the VPS**
- **Postgres**
- **Redis**
- **object storage**
- **reverse proxy**
- **background worker service**
- **WebSocket layer for board state**

### 12.2 Docker rule
- Do not assume Docker should run locally by default
- Use Docker Compose on the VPS as the production baseline
- Use local Docker only when explicit testing or integration debugging requires it

### 12.3 Why Postgres over Firebase as the core store
This project needs:
- durable workflow state
- relational board and approval data
- async jobs
- structured evidence
- complex joins across actions, approvals, artifacts, and revisions

That makes Postgres the right source of truth.
Firebase may still be used for a narrow layer like auth if desired, but it should not be the core orchestration store.

---

## Part 13: Standards That Must Stay

### 13.1 Truth in claims
No feature may be called:
- production-ready
- secure
- complete
- integrated

unless the code and evidence support it.

### 13.2 Provider neutrality
Always think in:
- capability class
- routing policy
- fallback chain
- cost/latency/quality

Never build the platform around a brand name unless explicitly required.

### 13.3 Board state
Every workflow should maintain:
- planning
- running
- review
- blocked
- approved
- packaged
- delivered

### 13.4 Evidence bundle
Every major delivery should include:
- context revision
- action log
- provider/model selections
- review findings
- approval state
- output manifest
- cost notes where applicable

---

## Part 14: Updated Master Identity Summary

**GRAMMAR is ACHIEVEMOR’s API-first, vision-first action runtime.**

It uses:
- NTNTN to frame and normalize intent
- MIM to capture, version, govern, and distribute context
- ACHEEVY to orchestrate
- Boomer_Angs as specialized execution roles
- Picker_Ang to route by capability class
- BuildSmith to assemble reviewed, approved work into deliverables
- LangGraph as the workflow spine
- DeerFlow as the research and deep-task specialist
- CoPaw as the operator workstation and skill surface
- OpenSandbox as the isolated execution runtime
- OpenRouter as the model gateway
- Brave for search grounding
- Firecrawl for scrape and structured extraction
- Playwright MCP for browser automation
- OpenCode for IDE-side coding assistance
- E2B as a dev/test sandbox only

All work follows:
- FDH
- Look / Listen / Learn
- ASCII-first UI design
- capability-first routing
- review before release
- truthful implementation language
- evidence-bundle delivery

---

## Part 15: Save-Ready Short Version

```text
GRAMMAR is ACHIEVEMOR’s API-first, vision-first action runtime with a lite UI.
It turns layman intent into governed, multi-agent execution through NTNTN, MIM, ACHEEVY, Boomer_Angs, Picker_Ang, BuildSmith, and a capability-first tool stack.
LangGraph is the workflow spine, DeerFlow handles research-heavy branches, CoPaw supports operator-side skills and memory, OpenSandbox runs isolated execution, OpenRouter provides model access, Brave grounds search, Firecrawl extracts live web content, Playwright MCP automates browsers, OpenCode supports IDE-side coding, and E2B remains dev/test only.
The platform stays provider-agnostic, review-driven, evidence-based, API-first, and UI-light.
```
