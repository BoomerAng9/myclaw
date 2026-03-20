```text
 __  __   ___   __  __
|  \/  | |_ _| |  \/  |
| |\/| |  | |  | |\/| |
| |  | |  | |  | |  | |
|_|  |_| |___| |_|  |_|

M. I. M.
```

# M. I. M. — Official Adaptive Software Build Blueprint
## Universal, Agnostic, Project-Aware Template for Building, Cloning, Re-Engineering, and Deploying Software

---

## PURPOSE

This blueprint is a universal build-control document for:
- new software products
- cloned or forked projects
- re-engineered multi-repo systems
- SaaS platforms
- AI products
- APIs
- MCP systems
- Chrome extensions
- voice-enabled chat interfaces
- internal tools
- commercial reusable deployment products

This template is intentionally agnostic.

It must adapt to the active project at initiation time.

It must not assume the active project is any one product unless the project context explicitly says so.

---

## CORE LAW

The finished product must feel like this:

**Open app -> type or speak -> attach context if needed -> get a clear result -> continue.**

Everything else is secondary.

If a normal user cannot immediately tell what action to take, the product is too heavy.

---

# SECTION 0 — PROJECT INITIATION TRIGGER

This section makes the blueprint adaptive.

At the beginning of every project, the system must ask or detect:

## 0.1 Required Initiation Questions

Project Name:  
Internal Codename:  

What project are we working on right now?

Is this:
- [ ] a new build
- [ ] a clone / fork / customization
- [ ] a re-engineering effort
- [ ] an extension of an existing project
- [ ] a hybrid of existing and new systems

Primary product type:
- [ ] Web App
- [ ] SaaS
- [ ] API
- [ ] AI Product
- [ ] MCP
- [ ] Chrome Extension
- [ ] Internal Tool
- [ ] Multi-Repo Platform
- [ ] Voice-Enabled Product
- [ ] Other

What repo or codebase is active?  
What upstream product, repo, or framework is involved, if any?  
What parts are we keeping?  
What parts are we replacing?  
What parts are we adding?  
What deployment target are we aiming for?  
What is the main user-facing experience?

## 0.2 Auto-Detection Rule

If this information already exists in:
- repo name
- workspace config
- README
- package files
- deployment files
- manifest files
- environment structure
- fork metadata

the blueprint should detect and use that information automatically, then ask only for what remains missing.

## 0.3 Initiation Output

At the end of initiation, produce:
- active project name
- build mode
- primary product type
- active repo or repo set
- deployment target
- main user-facing experience
- initial build route
- modules that must be activated
- modules that are N/A

### Initiation Gate
- [ ] Project identified
- [ ] Build mode identified
- [ ] Product type identified
- [ ] Repo or codebase identified
- [ ] Deployment target identified
- [ ] Main user experience identified
- [ ] Active module list created

Evidence Required:
- initiation summary
- detected project context
- module activation list

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 1 — PROJECT CONTROL SHEET

Project Name:  
Internal Codename:  
Build Mode:
- [ ] New Build
- [ ] Clone + Customize
- [ ] Re-Engineer Existing Stack
- [ ] Hybrid

Primary Product Type:  

Owner Organization: ACHIEVEMOR  
Product Owner:  
Decision Owner:  
Implementation Owner:  
Security Owner:  
Operations Owner:  
Reviewer:  
Final Approver:  

Current Phase:
- [ ] Discovery
- [ ] Design
- [ ] Build
- [ ] Verify
- [ ] Deploy
- [ ] Operate
- [ ] Blocked

Overall Status:
- [ ] Green
- [ ] Yellow
- [ ] Red

---

# SECTION 2 — PROJECT INTENT

Problem Statement:  
Primary User:  
Core User Pain:  
Business Goal:  
User Goal:  
Core Promise:  
Launch Scope:  
Deferred Scope:  
Non-Goals:  
Known Risks:  
Assumptions:  
Failure Condition:  

### Gate 2
- [ ] Problem is clear
- [ ] User is clear
- [ ] Core promise is clear
- [ ] Launch scope is clear
- [ ] Failure condition is defined

Evidence Required:
- project summary
- scope definition
- launch promise

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 3 — BUILD ROUTE DECISION

Choose the correct path before building:

- [ ] Use existing tool as-is
- [ ] Wrap an existing system
- [ ] Clone and customize
- [ ] Rebuild from scratch
- [ ] Hybrid: keep some parts, replace others

Why this route is best:  
What will be reused:  
What will be replaced:  
What will be newly built:  
Compatibility requirements:  

### Gate 3
- [ ] Route selected
- [ ] Reuse decisions documented
- [ ] Replacement decisions documented
- [ ] Compatibility constraints documented

Evidence Required:
- route decision summary

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 4 — BOOTSTRAP PACK

This section defines what must be created at project start so the build remains clean, neat, and repeatable.

## 4.1 Required Root Files
- README.md
- AGENTS.md
- CLAUDE.md
- docs/SOUL.md
- docs/BRAIN.md
- docs/ARCHITECTURE.md
- docs/ASCII_TREE.md
- docs/DEPLOYMENT.md
- docs/RUNBOOK.md
- docs/CHAT_FIRST_STANDARD.md

## 4.2 Required Folders
- docs/
- skills/
- app/
- api/
- runtime/
- data/
- integrations/
- deploy/
- scripts/

## 4.3 Required Scripts
- bootstrap_project.sh
- self_audit.py
- auto_fix.py
- apply_patches.sh

## 4.4 Required Startup Behaviors
- generate starter structure
- generate required docs
- generate required skill placeholders
- generate architecture tree
- separate user shell from admin shell
- prepare deployment profiles
- prepare self-audit structure
- prepare Mission Control placeholder if needed
- prepare orchestrator defaults

## 4.5 Bootstrap Runtime Defaults
- ACHEEVY configured as default orchestrator
- AutoResearch listed as default optional research subsystem
- heartbeat scaffold generated
- user shell defaults to chat-first
- admin shell separated from user shell

### Gate 4
- [ ] Starter structure created
- [ ] Required files created
- [ ] Required folders created
- [ ] Required scripts created
- [ ] ASCII tree created
- [ ] User/admin shell separation defined
- [ ] Runtime defaults scaffolded

Evidence Required:
- bootstrap log
- generated file tree
- starter manifest

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 5 — REQUIRED INSTRUCTION FILES

## SOUL.md
Defines:
- product identity
- product purpose
- what the system is for
- what it must not become
- default user-facing posture
- default assistant posture

## BRAIN.md
Defines:
- how the system thinks
- how it routes
- how it evaluates
- how it governs execution
- how it controls research and promotion
- what may not be bypassed

## AGENTS.md
Defines:
- repo-level working instructions for coding agents
- build rules
- naming rules
- execution rules
- review rules

## CLAUDE.md
Defines:
- Claude-specific rules if Claude-based agents are used

## ARCHITECTURE.md
Defines:
- structure
- services
- boundaries
- repo relationships
- dependency logic

## ASCII_TREE.md
Defines:
- department tree
- service tree
- repo tree
- deployment tree

## DEPLOYMENT.md
Defines:
- deployment profiles
- target environments
- setup flow
- rollback flow

## RUNBOOK.md
Defines:
- operational procedures
- restart steps
- backup / restore steps
- incident response notes

### Gate 5
- [ ] SOUL.md created
- [ ] BRAIN.md created
- [ ] AGENTS.md created
- [ ] ARCHITECTURE.md created
- [ ] ASCII_TREE.md created
- [ ] DEPLOYMENT.md created
- [ ] RUNBOOK.md created

Evidence Required:
- file list
- instruction file review

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 6 — DEFAULT ORCHESTRATOR

The official template ships with **ACHEEVY** as the default orchestration manager.

ACHEEVY is the default:
- onboarding chatbot
- project guide
- orchestration manager
- runtime governor
- approval coordinator
- evidence-aware promotion gatekeeper

ACHEEVY is responsible for:
- greeting and guiding the user
- interpreting high-level intent
- framing tasks for execution
- routing work to the proper systems or agents
- coordinating review and promotion
- enforcing runtime discipline
- maintaining alignment with the active project blueprint
- owning heartbeat cadence control by default

Default persona baseline:
- project management expert
- software development lifecycle expert
- Lean / Six Sigma improvement-oriented
- service management aware
- customer-service and operations aware
- big-data and AI-managed-solutions aware

Replaceability rule:
- ACHEEVY is the default orchestrator included with this template.
- Project owners may replace ACHEEVY with another orchestrator.
- Any replacement must still honor:
  - BRAIN.md contracts
  - safety gates
  - protected-zone rules
  - evidence requirements
  - promotion controls
  - heartbeat controls

Non-negotiable rule:
The orchestrator may be replaced.  
The orchestration control contracts may not be bypassed.

### Gate 6
- [ ] Default orchestrator declared
- [ ] Replacement rule documented
- [ ] Persona baseline defined

Evidence Required:
- orchestrator config summary

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 7 — SOUL LAYER DEFAULT

The project ships with ACHEEVY as the default assistant and orchestration guide.

ACHEEVY exists to:
- welcome the user
- help the user start correctly
- interpret what the user is trying to do
- organize the work at a high level
- keep the project aligned to its purpose
- prevent confusion between idea, scope, and execution

ACHEEVY is not the product itself unless the project explicitly defines it that way.

Default identity:
- strategic
- organized
- improvement-oriented
- technically aware
- operationally disciplined
- user-guiding
- evidence-aware

Default opening pattern:

**Welcome to [Product Name]**  
**I'm ACHEEVY. What would you like to do today?**

### Gate 7
- [ ] Identity layer defined
- [ ] Product vs assistant distinction defined
- [ ] Default opening pattern defined

Evidence Required:
- SOUL.md review

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 8 — BRAIN DEFAULTS

The Brain governs:
- routing
- evaluation
- experimentation
- verification
- promotion
- self-audit boundaries
- protected zones

## Default Runtime Values
- `orchestrator_name: ACHEEVY`
- `orchestrator_replaceable: true`
- `research_engine_name: AutoResearch`
- `research_engine_enabled: optional_by_project`
- `research_default_mode: advisory_or_sandbox`
- `heartbeat_required: true`
- `heartbeat_owner: ACHEEVY`
- `promotion_policy: gated`
- `self_modification_policy: sandbox_only`
- `protected_zone_policy: explicit_approval_required`
- `human_override: enabled`
- `evidence_bundle_required: true`
- `rollback_required: true`

### Gate 8
- [ ] Brain defaults declared
- [ ] Promotion policy declared
- [ ] Protected-zone policy declared
- [ ] Human override enabled

Evidence Required:
- BRAIN.md review

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 9 — RESEARCH AND EVOLUTION ENGINE

If enabled for the active project, the default research engine is **AutoResearch**.

Purpose:
AutoResearch helps keep the project fresh, efficient, and up to date by running bounded research and experimentation loops.

Default functions:
- bounded experimentation
- variant generation
- benchmark refresh
- dependency drift checks
- logic improvement proposals
- efficiency improvement proposals
- architecture alternative discovery
- freshness support for the technical knowledge index

AutoResearch may:
- inspect approved parts of the codebase
- inspect dependencies and linked repos
- propose parameter, architecture, prompt, or workflow variants
- run bounded experiments in approved environments
- compare results against declared success metrics
- recommend changes for review

AutoResearch may not:
- deploy directly to production
- override ACHEEVY
- bypass verification
- bypass promotion gates
- rewrite protected files without approval
- mutate protected runtime surfaces without approval
- self-promote experimental outputs into live product paths

Core rule:
**AutoResearch may propose. ACHEEVY decides.**

Enablement rule:
- AutoResearch is supported natively by the template.
- It is optional by project.
- If the project does not need autonomous research, it may remain disabled.

### Gate 9
- [ ] Research engine rule defined
- [ ] Allowed actions defined
- [ ] Forbidden actions defined
- [ ] Enablement rule defined

Evidence Required:
- research policy section

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 10 — HEARTBEAT AND CADENCE CONTROL

Heartbeats are required for autonomous or semi-autonomous systems.

Purpose:
Heartbeats prevent drift, runaway loops, silent failure, and uncontrolled autonomous behavior.

Default heartbeat owner:
- **ACHEEVY**

Heartbeats control:
- research intervals
- health checks
- dependency drift checks
- benchmark refresh timing
- retry timing
- escalation timing
- pause timing
- stop conditions
- freshness checks for evolving systems

Heartbeat rules:
- every autonomous loop must have a cadence
- every loop must have a clear owner
- every loop must have a stop condition
- every loop must log its state
- every loop must be interruptible
- every loop must respect time and cost limits
- every loop must support escalation to human review when thresholds are crossed

Minimum heartbeat fields:
- loop name
- owner
- purpose
- interval
- max runtime
- max retries
- max cost
- stop condition
- escalation rule
- logging destination

Examples:
- research heartbeat
- dependency drift heartbeat
- self-audit heartbeat
- benchmark refresh heartbeat
- model-routing freshness heartbeat
- deployment health heartbeat

### Gate 10
- [ ] Heartbeat rules defined
- [ ] Heartbeat owner defined
- [ ] Loop fields defined
- [ ] Stop conditions required

Evidence Required:
- heartbeat policy
- cadence table

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 11 — SKILLS LAYER

This template supports a modular skills layer so the active project can load the capabilities it needs at initiation time.

Purpose:
The skills layer keeps the build clean, repeatable, and organized by assigning reusable capabilities to named skill packs.

Rules:
- skills must be project-adaptive
- skills must be categorized by role
- only required skills should be activated
- skill placeholders must be created during bootstrap
- skill names may be customized by project
- default skills may be replaced, but the skill categories must still be covered

## 11.1 Required Skill Categories

### Runtime Skills
Examples:
- intent-normalizer
- context-capture
- provider-router
- review-and-hone
- packaging-bundler

### Build Skills
Examples:
- landing-page-builder
- chat-shell-builder
- admin-shell-builder
- auth-rbac-integrator
- billing-metering-integrator
- voice-stt-integrator

### Re-engineering Skills
Examples:
- repo-inventory-scanner
- dependency-map-builder
- fork-replace-decider
- migration-planner
- patch-layer-manager

### Deployment Skills
Examples:
- deployment-profile-builder
- vps-deploy-runner
- reverse-proxy-builder
- backup-and-monitoring-configurator
- release-packet-builder

### Self-Audit Skills
Examples:
- self-audit-runner
- env-checker
- route-checker
- dependency-checker
- bootstrap-validator
- auto-fix-runner

## 11.2 Default Skill Inventory Template

| Skill Name | Category | Purpose | Required? | Active? | Notes |
|---|---|---|---|---|---|
| ACHEEVY-orchestrator | Runtime | Default orchestration manager | [ ] | [ ] |  |
|  |  |  | [ ] | [ ] |  |

### Gate 11
- [ ] Required skill categories selected
- [ ] Skill inventory completed
- [ ] Skill placeholders created
- [ ] Bootstrap skill files generated

Evidence Required:
- skills inventory
- skills folder structure
- activation summary

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 12 — CHAT-FIRST PRODUCT STANDARD

## User Shell
The visible user-facing app should default to:
- Chat
- History
- Files / Context
- Settings
- Billing

## Admin Shell
System complexity must be moved out of the normal user experience:
- Logs
- Policies
- Runtime
- Analytics
- Debugging
- Tenant Controls
- Research / Internal Tools

## Rules
- composer is the center of gravity
- voice is first-class if enabled
- attachments live near the composer
- no dashboard-first experience for normal users
- admin and internal tooling must not dominate the user shell

### Gate 12
- [ ] User shell defined
- [ ] Admin shell defined
- [ ] Chat-first rule encoded
- [ ] Main action obvious

Evidence Required:
- navigation model
- route map
- shell design summary

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 13 — EXPERIENCE DESIGN

Required Screens:
- [ ] Landing
- [ ] Main Chat
- [ ] History
- [ ] Settings
- [ ] Auth
- [ ] Onboarding
- [ ] Billing
- [ ] Error Pages
- [ ] Admin
- [ ] Extension UI if needed
- [ ] MCP UI if needed

Chat Shell Rules:
- [ ] full-screen conversation area
- [ ] minimal top bar
- [ ] composer visually dominant
- [ ] attachment chips near composer
- [ ] mic button visible if enabled
- [ ] no dashboard overload

Copy Approval:
- [ ] product naming approved
- [ ] landing-page copy approved
- [ ] in-app copy approved

### Gate 13
- [ ] screen inventory complete
- [ ] wireframes complete
- [ ] copy approved
- [ ] chat shell approved

Evidence Required:
- wireframes
- route list
- copy deck

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 14 — OPTIONAL VOICE-FIRST MODULE

Voice Fit:
- [ ] Essential
- [ ] Helpful
- [ ] Not Needed

Provider:  
Latency Target:  
Consent Flow:  
Transcript Policy:  
Storage Policy:  
Supported Browsers:  
Supported Devices:  
Fallback Plan:  

STT UX Requirements:
- [ ] visible mic button
- [ ] listening state
- [ ] transcribing state
- [ ] transcript preview
- [ ] edit before send
- [ ] retry on failure
- [ ] permission-aware behavior

### Gate 14
- [ ] Voice justified
- [ ] Voice flow works end-to-end

Evidence Required:
- demo recording
- transcript sample

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 15 — ARCHITECTURE INVENTORY

Use this when the system includes multiple repos, services, packages, or external integrations.

| # | Component / Repo / Service | Role | Department | Keep | Replace | Fork | New Build | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 |  |  |  | [ ] | [ ] | [ ] | [ ] |  |

Department examples:
- Frontend
- Backend
- Database
- Auth
- Jobs / Workers
- Billing
- Search / Retrieval
- AI / Prompt Layer
- Monitoring / Ops
- Extension
- MCP
- Docs
- Infra / Deployment

### Gate 15
- [ ] All known components inventoried
- [ ] Departments assigned
- [ ] Keep / replace / fork / build decisions made

Evidence Required:
- inventory table

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 16 — ASCII INTEGRATION TREE

Every project must maintain an ASCII department tree.

## Required Departments
- Identity
- Product
- Runtime
- Data
- Integrations
- Deployment
- Self-Audit

## Required Template
```text
[PROJECT NAME]
├─ Identity
│  ├─ SOUL.md
│  ├─ BRAIN.md
│  ├─ AGENTS.md
│  ├─ CLAUDE.md
│  └─ README.md
├─ Product
│  ├─ Landing
│  ├─ Chat
│  ├─ History
│  ├─ Settings
│  ├─ Billing
│  └─ Mission Control
├─ Runtime
│  ├─ Orchestrator
│  │  └─ ACHEEVY
│  ├─ Intent
│  ├─ Research
│  ├─ Execution
│  ├─ Review
│  ├─ Promotion
│  ├─ Heartbeats
│  └─ Skills
├─ Data
│  ├─ Primary DB
│  ├─ Cache / Queue
│  ├─ File Storage
│  ├─ Evidence Bundles
│  └─ Logs / Telemetry
├─ Integrations
│  ├─ Auth
│  ├─ Billing
│  ├─ STT / Voice
│  ├─ Email / Notifications
│  ├─ External APIs
│  └─ Upstream Repos
├─ Deployment
│  ├─ Local
│  ├─ VPS
│  ├─ Reverse Proxy
│  ├─ SSL
│  ├─ Backups
│  └─ Monitoring
└─ Self-Audit
   ├─ repo-check
   ├─ env-check
   ├─ route-check
   ├─ dependency-check
   ├─ heartbeat-check
   └─ auto-fix
```

Tree rules:
- every major system must appear in the tree
- every repo or service must map to one department
- the tree must be updated when architecture changes
- the tree must stay readable by both humans and AI editors

### Gate 16
- [ ] Tree created
- [ ] Departments complete
- [ ] Services and repos mapped
- [ ] Tree updated after architecture changes

Evidence Required:
- current ASCII_TREE.md

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 17 — REPO CLONING / FORKING / PATCHING

Checklist:
- [ ] fork required repos
- [ ] clone required repos
- [ ] add to workspace / package structure
- [ ] record upstream URLs
- [ ] record fork URLs
- [ ] pin versions / commits
- [ ] define patch strategy
- [ ] define upstream sync strategy

| Repo / Package | Upstream URL | Fork URL | Local Path | Version / Commit | Patch Strategy |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

### Gate 17
- [ ] all required repos available locally
- [ ] versions pinned
- [ ] patch strategy documented

Evidence Required:
- repo manifest
- workspace tree

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 18 — RE-ENGINEERING DECISIONS

| Original Component | Original Use | Keep / Replace / Remove | Replacement | Reason |
|---|---|---|---|---|
|  |  |  |  |  |

### Gate 18
- [ ] re-engineering decisions documented
- [ ] replacements selected
- [ ] compatibility risks recorded

Evidence Required:
- replacement matrix

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 19 — MISSION CONTROL / CIRCUIT BOX

If the project includes operational controls, a separate admin-facing control surface must be defined.

Purpose:
Mission Control is the secure control layer for managing the running system without exposing system complexity to normal users.

Circuit Box concept:
The control surface should behave like a breaker box:
- view what is active
- turn features on or off
- inspect system health
- control tenants or workspaces
- manage branding and theme
- manage runtime behavior
- monitor operations and tasks

Minimum required capabilities:
- [ ] secure login
- [ ] role-based admin access
- [ ] browser-accessible on real domain
- [ ] tenant selector if multi-tenant
- [ ] branding and theme controls
- [ ] feature toggles / breaker switches
- [ ] task monitor
- [ ] logs view
- [ ] usage / metering view
- [ ] service health checks
- [ ] restart / pause / disable controls where allowed

Suggested route groups:
- `/mission-control`
- `/settings/circuit`
- `/settings/branding`
- `/operations/tasks`
- `/operations/logs`
- `/billing/usage`
- `/admin/tenants`

Design rule:
Mission Control must be separate from the normal user shell.

### Gate 19
- [ ] Mission Control requirement defined
- [ ] Control surface routes defined
- [ ] Role-based access rules defined
- [ ] Multi-tenant rules defined if needed

Evidence Required:
- control surface spec
- route list
- access model

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 20 — LUC / METERING

Core Functions:
- estimate()
- canExecute()
- recordUsage()

Service Keys:
- [ ] llm_tokens_in
- [ ] llm_tokens_out
- [ ] voice_minutes
- [ ] container_hours
- [ ] storage_gb
- [ ] api_calls
- [ ] other: ________

Truth Rules:
- estimates are advisory
- recorded usage is source of truth
- failed jobs support reversal / credit
- override policy documented

### Gate 20
- [ ] LUC wired to billable actions
- [ ] truth rules documented
- [ ] refund / reversal logic documented

Evidence Required:
- code samples
- flow diagram

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 21 — TECHNICAL DESIGN

Frontend Architecture:  
Backend Architecture:  
Database / Storage Design:  
Auth & Authorization:  
API Contracts:  
Realtime / Queue Design:  
Prompt / AI Layer:  
Voice / STT Architecture:  
Billing / Metering:  
Extension Design:  
MCP Design:  
Deployment Profile:  

### Gate 21
- [ ] technical design complete
- [ ] contracts documented
- [ ] data model documented

Evidence Required:
- diagrams
- schemas
- API examples

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 22 — BUILD

Priority Discipline:
1. critical path first
2. user-visible path first
3. high-priority features second
4. medium / low after core path works

Vertical Slices:
- [ ] chat path
- [ ] voice path if enabled
- [ ] auth path
- [ ] context / attachment path
- [ ] billing / LUC path
- [ ] mission control path
- [ ] multi-tenant path
- [ ] extension path if needed
- [ ] MCP path if needed

### Gate 22
- [ ] main user path works end-to-end
- [ ] chat is default
- [ ] voice works if promised
- [ ] admin complexity separated

Evidence Required:
- demo video
- screenshots

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 23 — VERIFY

Testing:
- [ ] unit tests
- [ ] integration tests
- [ ] end-to-end tests
- [ ] accessibility checks
- [ ] performance checks
- [ ] security scans
- [ ] voice tests
- [ ] billing / LUC tests
- [ ] migration tests
- [ ] multi-tenant tests

Pass Conditions:
- [ ] no critical user-flow defects
- [ ] no critical security issues
- [ ] no critical billing defects
- [ ] no critical data-loss risks
- [ ] no critical migration risks

Metrics:
- LCP:
- INP:
- CLS:
- API latency:
- STT latency:
- Error rate:

### Gate 23
- [ ] verify criteria met

Evidence Required:
- test summary
- scan results
- performance report

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 24 — DEPLOYMENT PROFILES

| Profile | Target | Notes |
|---|---|---|
| Local Dev |  |  |
| VPS |  |  |
| On-Prem |  |  |
| Customer Self-Hosted |  |  |

For each profile define:
- OS
- domain / DNS
- reverse proxy
- SSL
- Docker / Compose
- volumes
- secrets
- backup
- monitoring
- auto-start
- update method

### Gate 24
- [ ] profiles documented
- [ ] default deployment selected

Evidence Required:
- deploy manifests
- env examples

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 25 — DEPLOYMENT TARGET EXECUTION

Prerequisites:
- [ ] infrastructure selected
- [ ] SSH / access working
- [ ] domain pointed
- [ ] Docker installed
- [ ] reverse proxy selected
- [ ] SSL selected
- [ ] volumes selected
- [ ] backup selected
- [ ] monitoring selected

Deliverables:
- [ ] deployment stack
- [ ] reverse proxy config
- [ ] SSL config
- [ ] restart policy
- [ ] backup job
- [ ] health endpoint
- [ ] remote login / app access

### Gate 25
- [ ] stack deploys
- [ ] public domain works
- [ ] login works remotely
- [ ] services persist across reboot

Evidence Required:
- screenshots
- logs
- health checks

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 26 — MIGRATION / INJECTION PLAN

| Current Stack | Target Stack | Migration Type | Action | Downtime Plan |
|---|---|---|---|---|
|  |  |  |  |  |

Rules:
- preserve tenants if required
- preserve billing records if required
- preserve task history if required
- use maintenance page during cutover
- test rollback before production cutover

### Gate 26
- [ ] migration plan documented
- [ ] rollback plan documented
- [ ] preservation rules documented

Evidence Required:
- migration runbook

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 27 — SELF-AUDIT / AUTO-FIX

This template requires a self-audit layer so a project can assess whether it is correctly structured and operationally healthy.

Purpose:
- detect structural gaps early
- detect missing files and folders
- detect configuration drift
- detect broken routes or services
- detect missing required controls
- help keep builds commercial-grade and repeatable

Required self-audit checks:
- [ ] bootstrap completeness
- [ ] required file presence
- [ ] required folder presence
- [ ] AGENTS.md presence
- [ ] SOUL.md presence
- [ ] BRAIN.md presence
- [ ] ASCII_TREE.md presence
- [ ] skills folder completeness
- [ ] route integrity
- [ ] dependency integrity
- [ ] environment variable completeness
- [ ] deployment profile completeness
- [ ] SSL / reverse-proxy presence where applicable
- [ ] heartbeat presence for autonomous loops
- [ ] Mission Control separation from user shell
- [ ] chat-first shell enforcement

Required auto-fix behaviors:
- [ ] recreate missing placeholders
- [ ] restore required docs from template
- [ ] reapply approved patches
- [ ] rebuild broken services
- [ ] restart failed services
- [ ] flag protected-zone changes for review
- [ ] escalate unresolved issues to human owner

### Gate 27
- [ ] Self-audit rules defined
- [ ] Auto-fix rules defined
- [ ] Escalation rules defined
- [ ] Logging destination defined

Evidence Required:
- self-audit spec
- audit script
- auto-fix script or plan

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 28 — DISTRIBUTION / SDK

Goal:
Allow customers or operators to deploy the customized version without rebuilding from scratch.

Package Contents:
- [ ] CLI / launcher
- [ ] compose templates
- [ ] env templates
- [ ] branding patch system
- [ ] license / entitlement check
- [ ] docs / quickstart
- [ ] update path
- [ ] support path

### Gate 28
- [ ] deployment package defined
- [ ] quickstart documented

Evidence Required:
- SDK structure
- install flow

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 29 — SECURITY & DURABILITY

12 Pillars:
1. clear requirements
2. secure identity & sessions
3. least-privilege access
4. tenant isolation
5. safe persistence & migration
6. secrets never in code
7. dependency pinning & scans
8. isolated execution
9. unit + integration testing
10. security scans
11. safe release & rollback
12. monitoring, backups, incident response

Additional Rules:
- secret rotation defined
- restore testing required
- webhook verification required if used
- security headers configured
- mic consent / transcript rules enforced if voice enabled

### Gate 29
- [ ] security pillars confirmed

Evidence Required:
- checklist
- scan report

Gate Decision:
- [ ] Pass
- [ ] Blocked

---

# SECTION 30 — OPERATE

Ongoing Activities:
- monitor uptime
- review logs
- review LUC usage
- review incidents
- patch dependencies
- test backups
- review AI quality
- review STT quality
- review tenant health
- update technical knowledge index

Issue Types:
- [ ] Bug
- [ ] Incident
- [ ] Security Issue
- [ ] Feature Request
- [ ] Optimization
- [ ] Research Backlog

---

# SECTION 31 — CHANGE CONTROL

Change Request ID:  
Requested Change:  
Reason:  
Scope Impact:  
Cost Impact:  
Security Impact:  
UX Impact:  
Priority: Critical / High / Medium / Low / Deferred  
Approved By:  
Decision: Approved / Rejected / Deferred  

---

# SECTION 32 — WEEKLY TRACKER

Week Of:  
Current Phase:  
Goal:  
Top 3 Priorities:  
1.  
2.  
3.  

Completed:  
In Progress:  
Blocked:  
Risks:  
Decisions Made:  
What is working:  
What is broken:  
What still feels too heavy or dashboard-like:  
What must be simplified next:  
Status: Green / Yellow / Red  
Is chat default? Yes / No  
Is voice integrated? Yes / Partial / No  

---

# FINAL LAUNCH GATE

- [ ] chat-first promise delivered
- [ ] voice works if enabled
- [ ] LUC active
- [ ] security pillars pass
- [ ] Mission Control works if required
- [ ] deployment is stable
- [ ] proof bundle attached

Proof Bundle Should Include:
- screenshots
- test summaries
- scan reports
- health checks
- deployment logs
- LUC logs
- migration proof if applicable

Launch Decision:
- [ ] Go
- [ ] No-Go
- [ ] Go with Exceptions

---

# REQUIRED STARTUP TREE

```text
project-root/
├─ docs/
│  ├─ SOUL.md
│  ├─ BRAIN.md
│  ├─ ARCHITECTURE.md
│  ├─ ASCII_TREE.md
│  ├─ DEPLOYMENT.md
│  ├─ RUNBOOK.md
│  └─ CHAT_FIRST_STANDARD.md
├─ skills/
│  ├─ runtime/
│  ├─ build/
│  ├─ reengineering/
│  ├─ deployment/
│  └─ self_audit/
├─ app/
├─ api/
├─ runtime/
├─ data/
├─ integrations/
├─ deploy/
│  ├─ local/
│  ├─ vps/
│  ├─ onprem/
│  └─ customer/
├─ scripts/
│  ├─ bootstrap_project.sh
│  ├─ self_audit.py
│  ├─ auto_fix.py
│  └─ apply_patches.sh
├─ AGENTS.md
├─ CLAUDE.md
├─ README.md
└─ .vscode/
   └─ mcp.json
```

---

# TITLE STANDARD

Use this exact title block at the top of the file:

```text
 __  __   ___   __  __
|  \/  | |_ _| |  \/  |
| |\/| |  | |  | |\/| |
| |  | |  | |  | |  | |
|_|  |_| |___| |_|  |_|

M. I. M.
```

---

# IMPLEMENTATION INSTRUCTIONS

## 1. Project initiation
At the start of a project:
- place this file in the project root or `docs/`
- answer Section 0 first
- let the agent detect repo context before filling anything else
- mark unused modules as N/A only with justification

## 2. Bootstrap the project
Create the required startup tree immediately:
- required docs
- required scripts
- skills folders
- deployment profiles
- self-audit placeholders

Do not start coding before the bootstrap pack exists.

## 3. Generate core identity files
Create and complete:
- `docs/SOUL.md`
- `docs/BRAIN.md`
- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/ASCII_TREE.md`
- `docs/DEPLOYMENT.md`

These files must be present before architecture decisions are finalized.

## 4. Inventory the stack
If the project is cloned, forked, or multi-repo:
- fill the Architecture Inventory
- build the ASCII tree
- document keep/replace/build decisions
- pin repo versions
- define patch strategy

## 5. Enforce the shell split
Before UI work proceeds:
- define the user shell
- define the admin shell
- ensure chat is the default experience
- do not mix admin chrome into the standard user flow

## 6. Activate only needed modules
Examples:
- if no voice, mark Voice Module N/A
- if no extension, mark extension items N/A
- if no MCP, mark MCP items N/A
- if no migration, mark Migration section N/A

## 7. Use gates as control points
Do not move forward unless the current gate has:
- checkboxes completed
- evidence attached
- decision marked pass

## 8. Build in vertical slices
Recommended order:
- chat path
- auth path
- context / attachments
- billing / LUC
- Mission Control
- deployment
- self-audit

## 9. Run self-audit continuously
Use the self-audit section to verify:
- required files still exist
- structure is intact
- routes are intact
- deployment assumptions still hold
- admin/user shells remain separated

## 10. Prepare proof bundle before launch
Before the Final Launch Gate, gather:
- screenshots
- walkthrough video if needed
- test summaries
- scan reports
- health checks
- deployment logs
- LUC logs
- migration evidence if applicable

## 11. Keep this file live
This is not a one-time planning doc.
It should be updated as the project changes.
The current blueprint should always reflect the current state of the build.

## 12. Default behavioral rule
Unless the project explicitly overrides it:
- ACHEEVY is the default orchestrator
- AutoResearch is the default optional research subsystem
- heartbeats are required for autonomous loops
- promotion remains gated
- human override remains enabled

---

# HOW TO USE THIS TEMPLATE

1. Copy this markdown into the active project.
2. Run the Project Initiation Trigger first.
3. Let the blueprint detect or ask what project it is working on.
4. Fill the active sections based on the actual project.
5. Mark non-applicable sections as N/A only when justified.
6. Do not pass gates without evidence.
7. Keep the blueprint adaptive to the current repo, current stack, and current deployment target.

This is the official integrated, agnostic, project-aware M. I. M. template.
