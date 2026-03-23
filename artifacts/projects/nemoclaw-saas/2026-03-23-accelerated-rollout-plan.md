# Chicken Hawk Cloud — Accelerated Rollout Plan

Date: 2026-03-23

## Planning Assumption

This is not a 2-year enterprise transformation plan.
This is an AI-era deployment plan:

- ship usable public product in 7 days
- harden and monetize in 30 days
- operationalize in 90 days
- build 100K-user readiness over 6 months

## Core Product Decision

Launch with this stack:

- Public runtime: NemoClaw
- Private runtime: Original OpenClaw
- Execution plane: OpenSandbox
- Orchestration and governance: AIMS
- Memory and reuse: CoPaw
- Billing and quotas: LUC + Stripe 3-6-9
- Search grounding: Brave
- Voice lane: NVIDIA

## What Ships In 7 Days

The goal for week one is not full hyperscale.
The goal is a real paid product with correct architecture boundaries.

### Day 1: Public product boundary

Deliver:

- one public domain for Chicken Hawk Cloud
- one authenticated app shell
- one public NemoClaw gateway
- one private OpenClaw lane preserved for owner use

Non-negotiables:

- public and private lanes must be separated
- tenant identity must exist, even if simple
- LUC must gate billable actions

### Day 2: Account and billing surface

Deliver:

- signup and login
- Stripe plans for 3-month, 6-month, 9-month commitments
- plan-to-quota mapping in config
- basic workspace creation

Do not overbuild:

- skip enterprise invoicing
- skip advanced seat management
- skip complex org hierarchies

### Day 3: Execution boundary

Deliver:

- NemoClaw as public orchestrator
- OpenSandbox as job execution plane
- job classes defined:
  - chat-light
  - research-standard
  - browser-heavy
  - code-heavy
  - voice-realtime
  - scheduled-cron

Critical rule:

- heavy jobs must queue
- do not let raw user traffic hit unlimited sandbox execution

### Day 4: Beginner-first UX

Deliver:

- one workspace dashboard
- one automation board
- one template gallery
- one voice toggle for supported plans
- one clear usage dashboard

Templates should target:

- life admin
- research assistant
- content and lead follow-up
- intake and report generation
- simple internal copilots

### Day 5: CoPaw integration

Deliver:

- CoPaw as reusable memory layer
- store user templates and workflow patterns
- save reusable prompts and outcomes
- expose saved playbooks back into the product

Do not use CoPaw as:

- main DB
- queue
- billing source of truth

### Day 6: Safety and observability

Deliver:

- basic request logs
- usage events
- queue depth metrics
- policy denial logs
- error alerting
- voice session health metrics

This is enough for launch if it is visible and actionable.

### Day 7: Controlled launch

Deliver:

- paid beta launch
- capped concurrency
- support runbook
- rollback path
- manual ops checklist

The week-one product should be able to support:

- many light tasks
- a smaller number of standard tasks
- a hard-capped number of heavy code or browser tasks

## What Does Not Need To Wait

These things can exist immediately in simple form:

- Stripe billing
- tenant workspaces
- queued execution
- CoPaw memory recall
- voice lane as premium feature
- per-plan concurrency caps

You do not need to wait 6 months to ship those.

## 30-Day Hardening Plan

By day 30, the product should move from paid beta to stable revenue engine.

### Required upgrades

- move from one public gateway to gateway failover readiness
- enforce per-plan concurrency and sandbox minute caps
- improve admin panel for usage and incident visibility
- add better queue retry and dead-letter handling
- improve template onboarding and guided setup
- finalize voice lane quotas and pricing

### Product goal

By day 30, users should feel:

- this works reliably
- this saves time
- this feels safer than DIY automation

## 90-Day Operational Plan

By day 90, the platform should stop being a promising beta and become an operating system for customers.

Deliver:

- second public NemoClaw gateway
- dedicated worker pools by workload class
- stronger tenant admin model
- refined LUC controls and overage handling
- better memory and playbook sharing via CoPaw
- analytics on successful task outcomes, not just usage

At this point, the product should support:

- real teams
- agencies
- premium voice use cases
- branded external deployments

## 6-Month Scale Plan

Six months is the right horizon for 100K-user readiness.

Not because the product needs six months to exist.
Because the platform needs six months of measured iteration to support large-scale reliable usage.

### By month 2

- one stable paid product
- one public gateway
- one private lane
- pooled sandbox workers
- queue and metering functioning
- CoPaw memory reuse working

### By month 3

- second public gateway
- worker classes split by task type
- stronger onboarding and lifecycle emails
- better support operations

### By month 4

- premium voice lane isolated
- analytics and retention instrumentation
- better tenant-level controls
- faster workspace provisioning

### By month 5

- regional strategy defined
- dedicated premium workers or reserved capacity
- stronger incident response and SRE dashboards
- better partner deployment story

### By month 6

- 100K registered-user architecture path in place
- multi-gateway public runtime
- scaled worker fleet
- policy, billing, and observability stable enough for major growth

## What 100K Readiness Actually Means

By month 6, the system should be ready for:

- 100K registered users
- thousands of daily active users
- hundreds to low-thousands of concurrent light requests
- bounded heavy execution through queues and worker caps

It does not mean:

- 100K simultaneous heavy code agents
- unlimited browser sessions
- infinite autonomous code execution

## The Right Commercial Story

Do not market this as a giant AGI platform.

Market it as:

- a safe agent workspace
- a voice and automation operating layer
- a beginner-friendly way to launch useful AI workflows
- a commercial system that grows with the user

## What Else Is Needed Behind NemoClaw Right Now

Week-one minimum:

- auth and tenant identity
- Stripe and LUC integration
- queue layer
- OpenSandbox worker pool
- usage logging
- error alerting
- template onboarding

Month-one minimum:

- better observability
- better retries
- stronger quotas
- admin controls
- voice lane isolation

Month-six target:

- multi-gateway runtime
- segmented workers
- regional scaling path
- real SRE posture
- stronger memory and org knowledge workflows

## CoPaw Decision

Yes, incorporate CoPaw now.

But keep its role narrow and valuable.

### Add CoPaw now for

- saved patterns
- reusable playbooks
- organization memory
- operator productivity
- template reuse
- token and effort savings

### Do not use CoPaw for

- request routing
- main persistence
- execution orchestration
- billing and entitlements

That keeps the architecture clean.

## Final Recommendation

Ship in one week with:

- one public NemoClaw gateway
- one private OpenClaw lane
- OpenSandbox workers
- Stripe + LUC gating
- simple tenant workspaces
- CoPaw memory reuse
- NVIDIA voice as premium path

Then use the next six months to harden into a 100K-user commercial architecture.

That is the right AI-era posture:

- fast launch
- measured hardening
- ruthless scope control
- scale the execution plane, not just the runtime brand
