# Chicken Hawk Cloud — 100K User Commercial Framework

Date: 2026-03-23

## Executive Decision

NemoClaw should remain the secure runtime and policy gateway, but it is not the whole platform.

To support up to 100K active users commercially, the platform behind NemoClaw needs five things:

1. A multi-tenant control plane
2. A scalable execution plane
3. A queue-based orchestration layer
4. A durable tenant data and billing layer
5. An observability and policy layer

CoPaw should be incorporated, but not as the hot-path runtime for all user requests.
CoPaw belongs as the operator memory and reusable knowledge layer.

## What 100K Active Users Means

There are two very different meanings:

### 100K active accounts or monthly active users

This is realistic with a modest number of gateways and a properly scaled execution pool.

### 100K simultaneously active heavy agent sessions

This is a completely different architecture problem and requires a large worker fleet, strong queuing, multiple gateways, and strict workload classes.

For commercial planning, the right target is:

- 100K registered users
- thousands of daily active users
- hundreds to low-thousands of concurrent light tasks
- a much smaller pool of concurrent heavy autonomous executions

## Role of NemoClaw

NemoClaw should be treated as:

- the secure agent runtime
- the policy enforcement layer
- the inference routing and sandbox boundary
- the user-facing agent identity for public workloads

NemoClaw should not be treated as:

- the sole execution fleet
- the primary database
- the billing system
- the workflow queue
- the long-term analytics or memory warehouse

## What Else Is Needed Behind NemoClaw

## 1. Edge and API Layer

This sits in front of NemoClaw.

Responsibilities:

- CDN and DDoS protection
- API gateway
- rate limiting
- request authentication
- tenant resolution
- websocket/session routing
- static widget delivery

Recommended responsibilities by component:

- Edge CDN/WAF: global request shielding
- API gateway: route traffic to public agent APIs, voice APIs, and control plane APIs
- tenant router: map request to org, plan, region, and workload class

## 2. Identity and Tenant Control Plane

This is mandatory for a commercial product.

Responsibilities:

- signup and login
- organizations, users, roles, seats
- workspace creation
- subscription status
- plan entitlements
- API keys and channel credentials
- tenant policy templates

This control plane must exist outside NemoClaw.

## 3. Orchestration and Queue Layer

At 100K users, all serious work must be queued and scheduled.

Responsibilities:

- create jobs from user requests
- classify jobs into light, standard, heavy, voice
- assign priority by plan
- throttle per-tenant concurrency
- retry safely
- route jobs to worker pools

Recommended queue classes:

- `chat-light`
- `research-standard`
- `browser-heavy`
- `code-heavy`
- `voice-realtime`
- `scheduled-cron`

NemoClaw receives and approves work. The queue and workers execute it.

## 4. OpenSandbox Execution Plane

This is the real scaling surface.

Responsibilities:

- spin up isolated execution workers
- browser automation
- code execution
- document processing
- long-running tasks
- tenant-isolated files and secrets

For 100K users, OpenSandbox should be structured as:

- pooled worker clusters for low-cost tasks
- dedicated worker pools for premium plans
- burst workers for heavy jobs
- hard timeouts and cancellation support

This is where real scale happens. NemoClaw alone is not enough.

## 5. Data and State Layer

You need durable systems of record.

Required data domains:

- auth and user accounts
- organizations and plans
- job state and workflow history
- billing and usage events
- memory and artifacts
- audit logs
- prompt and response metadata
- channel integrations and secrets references

Suggested separation:

- relational DB for core business records
- object storage for artifacts, uploads, exports, logs
- cache for sessions, throttles, queue lookups
- analytics store for usage and product telemetry

## 6. Billing and LUC Layer

This is one of your main differentiators.

Responsibilities:

- subscription billing using the 3-6-9 model
- quota accounting
- preflight checks via `estimate()` and `canExecute()`
- live usage recording
- overage handling
- refund and adjustment flows
- enterprise invoicing later

This layer must sit outside NemoClaw and observe every billable action.

## 7. Observability Layer

At 100K users, this is non-negotiable.

Required telemetry:

- request metrics
- queue depth
- worker utilization
- sandbox lifecycle
- model latency and failure rate
- tenant spend and budget burn
- policy denials
- voice latency and audio failures
- incident and alert traces

Without this, commercial operations will fail before the runtime does.

## 8. Trust, Safety, and Policy Layer

NemoClaw gives runtime policy enforcement, but the commercial product needs broader controls.

Required controls:

- per-plan tool entitlements
- per-tenant allowlists and deny lists
- content and action risk scoring
- approval gates for high-risk actions
- regional data routing where needed
- tenant isolation checks
- secret-scoping and credential rotation

Think of this as product-level governance above runtime-level governance.

## 9. Voice Infrastructure Layer

Because NVIDIA is your preferred voice lane, voice should be a separate workload class.

Responsibilities:

- streaming ASR
- streaming TTS
- interruption handling
- low-latency routing
- per-session state
- voice-specific observability

Do not mix voice worker capacity with heavy code-execution workers.
They should scale separately.

## Where CoPaw Fits

Yes, incorporate CoPaw.

But incorporate it correctly.

### CoPaw should own

- reusable operator knowledge
- workflow memory ergonomics
- tenant-visible memory summaries
- recall/store for known patterns
- token-savings and reuse patterns
- admin and operator acceleration

### CoPaw should not own

- the main product database
- the runtime hot path for every request
- billing source of truth
- queue execution
- sandbox orchestration

### Best use of CoPaw in the commercial product

CoPaw becomes the knowledge reuse and memory layer that improves quality and lowers cost.

That means:

- users can save working patterns
- organizations can keep reusable playbooks
- the system can recall prior automations and templates
- repeated prompts become reusable operational assets

This is valuable commercially because it increases stickiness and lowers cost per useful outcome.

## Recommended Platform Layers

### Layer 1: Presentation

- web app
- embedded website widget
- mobile/responsive shell
- voice UI entry points

### Layer 2: Public API and Auth

- edge gateway
- auth service
- tenant router
- websocket gateway

### Layer 3: Agent Control Plane

- workspace manager
- plan entitlement service
- policy registry
- workflow registry
- billing hooks

### Layer 4: Agent Runtime Plane

- NemoClaw gateways
- OpenShell policies
- inference routing
- request admission control

### Layer 5: Execution Plane

- OpenSandbox workers
- browser workers
- code workers
- doc-processing workers
- voice workers

### Layer 6: Data Plane

- relational DB
- object storage
- cache
- analytics store
- audit log store
- CoPaw memory store

## Concurrency Model For 100K Active Users

A commercial system at this scale must separate workloads.

### Light requests

Examples:

- ask a question
- summarize a page
- create a draft
- run a small lookup

These can be handled at high scale.

### Standard tasks

Examples:

- multi-step research
- generate a short report
- update connected tools
- run scheduled personal automations

These need queueing and pooled workers.

### Heavy jobs

Examples:

- autonomous code generation
- long browser sessions
- app building
- batch processing

These must be limited, queued, and metered separately.

### Voice sessions

Examples:

- real-time voice concierge
- intake and triage
- conversational operators

These should use their own low-latency worker pool.

## Commercial Product Packaging

The 3-6-9 model should map to commitment and concurrency, not just price.

### 3-Month

Goal:

- learn and launch

Entitlement style:

- one workspace
- low concurrency
- template-first workflows
- limited sandbox minutes
- limited voice minutes

### 6-Month

Goal:

- operational workflow usage

Entitlement style:

- more concurrent jobs
- more execution minutes
- integrations and exports
- stronger memory reuse via CoPaw
- better queue priority

### 9-Month

Goal:

- productionize the agent

Entitlement style:

- team seats
- branded surfaces
- higher concurrency
- advanced workflow deployment
- premium worker class access

## Commercial Framework Recommendation

For your product, the right framing is:

- NemoClaw is the secure runtime
- OpenSandbox is the scalable execution engine
- CoPaw is the memory and reuse layer
- AIMS is the governance and orchestration shell
- LUC is the commercial control system

That stack is commercially strong because it gives you:

- beginner simplicity on the front end
- enterprise guardrails underneath
- extensible tenant architecture
- cost control as a core product feature

## Build Order

### Phase 1: SaaS foundation

- auth and tenants
- billing and LUC hooks
- public NemoClaw gateway
- pooled OpenSandbox workers
- basic CoPaw memory for template reuse

### Phase 2: product hardening

- queue service
- workload classes
- observability stack
- policy editor and admin controls
- voice lane isolation

### Phase 3: commercial scale

- multiple NemoClaw gateways
- autoscaled worker pools
- premium dedicated workers
- regional deployment controls
- advanced org memory and analytics

## Final Answer

To service up to 100K active users, you need much more behind NemoClaw than the runtime itself.

You need:

1. edge and auth
2. tenant control plane
3. queue orchestration
4. OpenSandbox execution fleet
5. data and billing systems
6. observability and policy systems
7. separate voice infrastructure

And yes, you should incorporate CoPaw.

But CoPaw should be incorporated as:

- the memory and reuse layer
- the operator acceleration layer
- the organizational knowledge layer

Not as:

- the main execution runtime
- the system of record
- the concurrency engine

That is the correct commercial architecture.
