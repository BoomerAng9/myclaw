# GRAMMAR Operating Guidebook
### Version 4.1 — Final Master Runtime Edition

---

## GRAMMAR in One Sentence

**GRAMMAR is ACHIEVEMOR’s API-first, vision-first action runtime** — a governed orchestration platform that converts plain human intent into structured, multi-agent execution, routes each action by capability class, coordinates specialized services through explicit boundaries, and returns reviewed, package-ready outcomes through an embeddable API and a lite UI.

---

## Part 1: How to Use This Document

This document is the **Master Operating Guidebook** for GRAMMAR.

Use it as:
- `README.md` for repo-level orientation, or
- `ARCHITECTURE.md` for platform law and system boundaries

Keep code-level implementation details in a separate document such as:
- `/docs/IMPLEMENTATION_GUIDE.md`

### Document purpose
This guidebook defines:
- what GRAMMAR is
- what GRAMMAR is not
- which systems own which responsibilities
- how external tools work together without collapsing into one monolith
- how GRAMMAR relates to connected repos
- how engineering agents and human developers should build and extend it

### Document law
If there is ever a conflict between:
- a convenience shortcut, and
- the architectural boundaries in this guidebook

the guidebook wins.

---

## Part 2: Identity, Vision, Mission, and Objectives

### 2.1 What GRAMMAR Is

GRAMMAR is not:
- a generic chatbot
- a prompt wrapper
- a single-agent assistant
- a website-first product
- a provider-specific automation shell
- a loose collection of tools stitched together without boundaries

GRAMMAR is:
- an API-first orchestration runtime
- a context-governed action system
- a capability router
- a swarm coordination layer
- a review-driven delivery engine
- a lite UI over a deeper backend
- an embeddable runtime that can be integrated into other repos, IDEs, and product surfaces

Its purpose is to:
- understand the real user objective
- structure that into governed context
- decompose work into action graphs
- route each action to the right capability
- execute work across specialized services
- review and fix outputs
- package and return deliverables with traceability

### 2.2 Vision

Build a provider-agnostic, vision-first action runtime that can interpret human intent in plain language, coordinate the right swarm of roles and services, execute and review complex work, and return traceable outcomes across creative, technical, analytical, and operational domains.

### 2.3 Mission

Enable ACHIEVEMOR systems to behave like an always-on digital production organization that:
- understands what the user actually wants
- chooses the correct workflow
- chooses the best tools and models by capability
- runs work in parallel where dependencies allow
- catches and fixes issues before delivery
- packages every serious outcome with board state, evidence, and review traceability

### 2.4 Objectives

#### Core objectives
- convert layman language into technically usable intent
- preserve context, revisions, and memory across sessions
- route by capability class instead of provider lock-in
- use specialized execution roles instead of one general assistant
- support text, voice, image, video, web, code, and source-driven workflows
- produce outputs that are reviewable, correctable, and packageable
- keep the runtime modular and layer-replaceable
- preserve truthful implementation claims

#### Product objectives
- make the API the primary product surface
- provide a lite UI for users who want direct interaction and visibility
- support approvals, board state, evidence bundles, and delivery retrieval
- support IDE, MCP, extension, and embedded product use
- support reusable source attachment and persistent context

#### Technical objectives
- schema-first contracts
- durable workflow execution
- async execution for long-running work
- capability registry and routing policy
- model routing through a unified gateway
- explicit ownership boundaries across services
- review and fix loops before release
- production-grade observability, cost tracking, and release gates

---

## Part 3: Runtime Responsibilities That Must Be Implemented Explicitly

These names are part of the GRAMMAR operating model. They should not be treated as already-existing code services unless they are implemented in this repo or clearly provided by a connected repo.

### 3.1 NTNTN
**Runtime responsibility:** intention-framing layer

Purpose:
- interpret the request
- reduce ambiguity
- identify the real user outcome
- normalize intent into a structured object

### 3.2 MIM
**Runtime responsibility:** Methodology for Intent and Memory

Purpose:
- create and update Context Packs
- version context over time
- track change orders
- store approvals and rejections
- distribute governed context to all execution roles

Important:
**MIM is not an agent.**
It is a methodology and runtime discipline.

### 3.3 ACHEEVY
**Runtime responsibility:** orchestration role

Purpose:
- run the huddle
- create and update the Action Board
- sequence dependencies
- manage branch execution
- manage approval and review checkpoints

Important:
**ACHEEVY coordinates. It does not execute raw tasks directly.**

### 3.4 Boomer_Angs
**Runtime responsibility:** specialized execution roles

Purpose:
- perform domain-specific work
- act on MIM-governed context
- run in parallel where appropriate

Important:
Boomer_Angs are execution roles, not chat personas.

### 3.5 Picker_Ang
**Runtime responsibility:** capability router

Purpose:
- query the capability registry
- rank models, tools, and services
- define fallbacks
- select the best route for each action

Important:
**Route by capability first, provider second.**

### 3.6 BuildSmith
**Runtime responsibility:** assembly and packaging role

Purpose:
- assemble approved work into actual builds or deliverables
- coordinate artifact creation
- package outputs and evidence
- prepare final handoff bundles

### 3.7 Review / Hone
**Runtime responsibility:** validation and correction layer

Purpose:
- inspect outputs against the Context Pack
- detect issues
- apply safe auto-fixes
- escalate approval-required changes
- gate release and packaging

---

## Part 4: Four-Plane Architecture

### 4.1 Experience Plane
The light interface and integration surface.

Capabilities:
- Chat w/ACHEEVY
- source and asset attachment
- model selection
- voice selection
- board monitoring
- review findings
- approval actions
- artifact retrieval
- evidence visibility

Primary principle:
**The UI is present, but the product value is in the runtime API.**

### 4.2 Control Plane
The planning and coordination layer.

Responsibilities:
- NTNTN
- MIM runtime
- orchestration logic
- workflow graph state
- capability registry
- approval policy
- action board state

### 4.3 Execution Plane
The work layer.

Responsibilities:
- specialized execution roles
- research workflows
- isolated runtime jobs
- browser automation
- coding and tooling branches
- BuildSmith assembly
- review and packaging

### 4.4 Platform Plane
The infrastructure and governance layer.

Responsibilities:
- auth and RBAC
- subscriptions and billing integration
- observability
- queueing
- artifact storage
- evidence bundle storage
- evaluation harness
- deployment and release control

---

## Part 5: Ownership Matrix — What Each External System Owns and Does Not Own

The following systems must remain **separate but cohesive**. GRAMMAR coordinates them. It does not collapse them into one shared brain.

### 5.1 LangGraph
**Role in GRAMMAR:** workflow spine

LangGraph owns:
- workflow graph definitions
- durable execution state
- state transitions
- checkpointing
- pause / resume
- interrupt handling
- approval-aware workflow routing

LangGraph does not own:
- the lite UI
- workstation assistant memory ergonomics
- browser execution
- web research by itself
- final package rendering
- product identity

### 5.2 DeerFlow
**Role in GRAMMAR:** research and deep-task specialist service

DeerFlow owns:
- research-heavy branches
- search / crawl / synthesize flows
- report-style task branches
- evidence-gathering branches
- sub-agent style execution for retrieval-heavy work

DeerFlow does not own:
- the global orchestration identity
- the platform memory source of truth
- the whole execution board
- the entire UI
- every action type in the system

Important:
DeerFlow is integrated as a specialist service inside GRAMMAR.
It is not the whole GRAMMAR product.

### 5.3 CoPaw
**Role in GRAMMAR:** operator workstation and skill surface

CoPaw owns:
- operator-facing helper flows
- recurring and scheduled routines
- skills activation
- workstation-style assistant surfaces
- memory ergonomics for operator workflows

CoPaw does not own:
- the platform-wide orchestration graph
- the primary relational system of record
- the execution board source of truth
- the isolated runtime substrate

Important:
CoPaw may interact with platform memory, but **Postgres + vector indexing remain the source of truth for platform state**.

### 5.4 OpenSandbox
**Role in GRAMMAR:** primary isolated execution runtime

OpenSandbox owns:
- isolated code execution
- isolated browser/tool execution
- sandbox lifecycle management
- runtime file operations
- safe collection of logs and artifacts from isolated jobs

OpenSandbox does not own:
- orchestration planning
- context management
- user-facing workflow logic
- model routing

Important:
OpenSandbox is the **primary production execution substrate** for isolated runtime work.

### 5.5 OpenRouter
**Role in GRAMMAR:** model gateway and model metadata layer

OpenRouter owns:
- model access
- model capability visibility
- routing compatibility information
- provider switching at the LLM layer

OpenRouter does not own:
- orchestration
- workflow state
- memory
- packaging
- board state

### 5.6 Brave Search API
**Role in GRAMMAR:** search grounding layer

Brave owns:
- live source discovery
- search-grounded query enrichment
- finding candidate pages and citations

Brave does not own:
- scraping
- deep extraction
- persistent memory
- synthesis by itself

### 5.7 Firecrawl
**Role in GRAMMAR:** scrape, crawl, and structured extraction layer

Firecrawl owns:
- scrape and extraction
- structured page conversion
- known-URL ingestion
- site crawling where needed
- LLM-ready content output

Firecrawl does not own:
- search discovery
- orchestration
- platform memory
- final synthesis by itself

### 5.8 Playwright MCP
**Role in GRAMMAR:** browser automation layer

Playwright MCP owns:
- deterministic browser interaction
- navigation
- click/fill/browse automation
- browser validation tasks

Playwright MCP does not own:
- orchestration
- UI design
- high-level intent interpretation
- memory

### 5.9 E2B
**Role in GRAMMAR:** dev/test and overflow cloud sandbox

E2B owns:
- cloud-based test execution
- development sandboxing
- portable code execution for testing and overflow cases

E2B does not own:
- the primary production execution path
- orchestration
- board state
- system memory

Important:
E2B is useful, but it is **secondary to OpenSandbox for phase 1 production execution**.

### 5.10 OpenCode
**Role in GRAMMAR:** IDE-side coding assistant

OpenCode owns:
- coding assistance inside the developer workflow
- repo exploration
- agent-assisted implementation support
- subagent help in the IDE

OpenCode does not own:
- the production runtime of GRAMMAR
- the execution board source of truth
- the platform memory system
- orchestration contracts

---

## Part 6: How the Tools Work Together

### 6.1 High-level flow

1. A client sends a request to GRAMMAR through API or the lite UI
2. NTNTN interprets the intention
3. The Technical Knowledge Index converts layman language into structured technical intent
4. MIM creates or updates the Context Pack
5. MIM Context Capture extracts governed information from attached assets and references
6. The orchestrator huddle decides plan shape and branch structure
7. LangGraph creates or resumes the Action Graph
8. Picker_Ang selects capability routes and ranked services
9. Specialized branches execute:
   - DeerFlow for research-heavy and synthesis-heavy branches
   - OpenSandbox for isolated code/tool/browser branches
   - Playwright MCP for deterministic browser flows
   - OpenRouter for model-driven reasoning and generation
   - Brave for search grounding
   - Firecrawl for extraction
10. BuildSmith assembles outputs
11. Review / Hone validates, fixes, or escalates
12. Packaging creates the delivery bundle
13. MIM stores revisions, findings, approvals, and evidence references

### 6.2 Execution law
The clean execution rule is:

- **OpenRouter models execute reasoning**
- **LangGraph executes workflow state transitions**
- **DeerFlow executes research and retrieval-heavy branches**
- **OpenSandbox executes primary isolated runtime tasks**
- **Playwright MCP executes deterministic browser tasks**
- **CoPaw executes operator-side skills and recurring assistant routines**
- **OpenCode supports developer-side coding workflows**
- **E2B supports dev/test and overflow cloud execution**
- **BuildSmith assembles deliverables and evidence bundles**

---

## Part 7: Multi-Repo Interaction Map

GRAMMAR will connect to other repos, but GRAMMAR remains the system of record for orchestration contracts, context packs, capability routing, board state, and delivery governance.

### 7.1 Agent-ACHEEVY-009
Treat as:
- a runtime reference repo
- a source of execution and deployment patterns
- a likely source for websocket, sandbox, and multi-model runtime ideas

Use for:
- backend topology reference
- infra and deployment reference
- runtime event and execution patterns

Authority boundary:
Agent-ACHEEVY-009 may influence patterns, but it does **not** redefine GRAMMAR’s orchestration contracts.

### 7.2 AIMS
Treat as:
- the commercial integration repo
- the billing, API key, and subscription management surface
- the commercial system that GRAMMAR integrates with, not the system that defines GRAMMAR internals

Authority boundary:
AIMS may manage customer/account context, but it does **not** redefine GRAMMAR runtime contracts.

### 7.3 acheevy-whisper-build
Treat as:
- a voice/audio ingress reference
- a UI donor repo
- a source of shell and component patterns

Use for:
- front-end shell ideas
- voice ingress patterns
- interaction borrowing where appropriate

Authority boundary:
It may donate UI or ingress patterns, but it does **not** define GRAMMAR backend architecture.

### 7.4 Direction of authority
Connected repos may provide:
- runtime references
- UI patterns
- business/product context
- client surfaces

GRAMMAR provides:
- Context Packs
- Action Boards
- capability routing
- review gates
- evidence bundles
- delivery contracts
- orchestration boundaries

---

## Part 8: API-First, Embeddable First, Lite UI Second

### 8.1 Product priority
Primary product surfaces:
- API
- MCP-friendly integration surfaces
- IDE/plugin embedding
- project-level integration

Secondary product surfaces:
- lite UI
- approval console
- review surface
- board monitor
- artifact retrieval

### 8.2 Why this matters
GRAMMAR should behave more like an embeddable runtime than a standalone website.
The UI is important, but it must remain subordinate to:
- API contracts
- runtime execution
- board state
- reviewability
- packaging

### 8.3 Core shell
**Chat w/ACHEEVY**

Required controls:
- prompt input
- file/source attachment
- model switcher
- voice selector
- data source selector
- send / run
- stop / interrupt
- board monitor access
- approval actions
- evidence bundle access

---

## Part 9: MAP — Mandatory Alignment Prototype

MAP is now a formal execution gate.

### 9.1 Rule
No heavy compute or major generation starts until the user approves a prototype-alignment artifact.

### 9.2 MAP outputs by task type
- **Software / UI intent** → ASCII wireframe or Mermaid diagram
- **Creative / brand intent** → mood board or visual direction board
- **Video / film intent** → storyboard and shot list
- **Video analysis intent** → timeline map and segment board

### 9.3 Workflow law
LangGraph must treat MAP approval as a checkpoint node.
No downstream heavy execution begins until the checkpoint is approved or explicitly bypassed under policy.

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

### Minimum artifact
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

## Part 11: Data, Memory, and Persistence Law

### 11.1 Source of truth
Use:
- **Postgres** as the primary system of record
- **vector indexing** for retrieval and memory search
- **Redis** for queues, events, and ephemeral live state
- **object storage** for artifacts and evidence bundles

### 11.2 Why Postgres is mandatory
This platform needs:
- durable workflow state
- relational board data
- approvals
- revisions
- action lineage
- evidence tracking
- joins across actions, artifacts, review findings, and subscriptions

That makes Postgres the correct source of truth.

### 11.3 Role of CoPaw memory
CoPaw may interact with memory and support operator-facing memory workflows, but it does not replace the platform database.

---

## Part 12: Deployment Law

### 12.1 Deployment default
Use:
- Hostinger VPS
- Docker Compose on the VPS
- reverse proxy
- Postgres
- Redis
- object storage
- background workers
- WebSocket event layer

### 12.2 Docker rule
- Do not assume Docker should run locally by default
- Use Docker Compose on the VPS as the production baseline
- Use local Docker only when explicit testing or integration debugging requires it

### 12.3 Local execution rule
Never run agent-generated code directly in the host application process.

Use:
- OpenSandbox for primary isolated runtime execution
- E2B for dev/test and overflow cloud execution

---

## Part 13: Standards That Must Not Be Relaxed

### 13.1 Truth in claims
No feature may be called:
- production-ready
- secure
- complete
- integrated

unless the code and evidence support it.

### 13.2 Capability-first routing
Always think in:
- capability class
- routing policy
- fallback chain
- cost / latency / quality

Never build platform logic around a brand name unless explicitly required.

### 13.3 Board state
Every workflow must maintain:
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

## Part 14: Engineering Build Law

When Codex, AntiGravity, OpenCode, Claude Code, or human developers work on GRAMMAR, they must follow these laws:

1. ACHEEVY, Boomer_Angs, Picker_Ang, NTNTN, MIM, and BuildSmith are **runtime responsibilities that must be implemented explicitly**.
2. LangGraph owns the global workflow spine.
3. DeerFlow owns research-heavy and retrieval-heavy specialist branches.
4. CoPaw owns operator-side skills and workstation assistant patterns.
5. OpenSandbox is the primary isolated execution runtime.
6. OpenRouter is mandatory for model access and model routing metadata.
7. E2B is secondary and should be kept to dev/test or overflow execution in phase 1.
8. GRAMMAR remains API-first and embeddable-first.
9. The UI remains light and subordinate to the runtime API.
10. Major UI work begins with a MAP artifact and an ASCII prototype.
11. Postgres remains the source of truth for workflow and platform state.
12. Connected repos do not override GRAMMAR runtime contracts.

---

## Part 15: Final Identity Summary

**GRAMMAR is ACHIEVEMOR’s API-first, vision-first action runtime.**

It uses:
- NTNTN to frame and normalize intent
- MIM to capture, version, govern, and distribute context
- explicit orchestration logic to coordinate execution
- Boomer_Ang execution roles to perform specialized work
- Picker_Ang to route by capability class
- BuildSmith to assemble approved work into deliverables
- LangGraph as the workflow spine
- DeerFlow as the research and deep-task specialist
- CoPaw as the operator workstation and skills surface
- OpenSandbox as the primary isolated execution runtime
- OpenRouter as the model gateway
- Brave for search grounding
- Firecrawl for extraction
- Playwright MCP for browser automation
- OpenCode for IDE-side coding assistance
- E2B as a secondary dev/test and overflow sandbox

All work follows:
- FDH
- Look / Listen / Learn
- MAP
- ASCII-first UI design
- capability-first routing
- review before release
- truthful implementation language
- evidence-bundle delivery

---

## Part 16: Save-Ready Short Version

```text
GRAMMAR is ACHIEVEMOR’s API-first, vision-first action runtime with a lite UI.
It turns layman intent into governed, multi-agent execution through NTNTN, MIM, orchestration logic, Boomer_Ang execution roles, Picker_Ang capability routing, BuildSmith assembly, LangGraph workflow state, DeerFlow specialist branches, CoPaw operator-side skills, OpenSandbox isolated execution, OpenRouter model access, Brave search grounding, Firecrawl extraction, Playwright browser automation, OpenCode IDE support, and E2B for dev/test or overflow cloud execution.
The platform stays embeddable-first, provider-agnostic, review-driven, evidence-based, and bounded by strict ownership rules.
```
