# Real App Forever SOP (Infrastructure-Agnostic) v2.0 |02/08/26/02:27

## To-Do
Revise the infrastructure-agnostic “Real App Forever” SOP to include end-to-end security hardening for the Vibe Coding era, plus explicit UI requirements and configuration contracts so teams can build durable, production-grade applications safely.

---

## 0) What this SOP is
This SOP defines the **capabilities, contracts, gates, evidence, UI surfaces, and configuration controls** required to build applications that:
- remain reliable over time,
- resist malicious automation and supply-chain tampering,
- can be safely changed and operated.

This SOP is **infrastructure-agnostic**:
- It does not require any specific cloud, VPS, orchestrator, CI vendor, database vendor, or security product.
- It describes what must exist and how to prove it exists.

---

## 1) Plain-language definition: “Real App Forever”
An app “lasts forever” when it can:
1) **Keep working as dependencies change** (patches, browser updates, API updates).
2) **Prevent and contain security failures** (least privilege, secrets protection, isolation).
3) **Recover from failures** (rollback + backups + restore drills).
4) **Be safely changed** (tests, verification gates, reproducible builds).
5) **Be operated like a system** (monitoring, alerts, incident runbooks, patch cadence).

If any item is missing, the app may still work today, but it will fail over time.

---

## 2) Minimal glossary (novice-friendly)
- **Artifact**: a build output that can be deployed (image/bundle/package).
- **Release**: a specific artifact promoted to an environment.
- **Environment**: where the app runs (dev/staging/prod or equivalent).
- **Gate**: a required check that blocks progress when it fails.
- **Evidence**: proof that a gate ran and passed (reports/logs/records).
- **Policy**: rules for permissions, approvals, limits, and tool execution.
- **Secrets**: sensitive values (API keys, tokens, signing keys, wallet keys).
- **Tenancy**: how customers/users are isolated (single-tenant or multi-tenant).
- **Runner**: isolated execution environment that builds/tests/deploys.

---

## 3) The 12 non-negotiable pillars (must exist)
These pillars stop “vibe-coded, low-security, broken apps.”

### Pillar 1 — Requirements that machines can build from
Required:
- user stories + acceptance criteria (pass/fail)
- non-functional requirements (availability, latency targets, security level)

### Pillar 2 — Identity + session security
Required:
- authentication (SSO/OAuth/OIDC or equivalent)
- secure sessions (expiry/rotation, secure cookies/tokens)
- account recovery

### Pillar 3 — Authorization + least privilege
Required:
- roles and permissions (RBAC/ABAC)
- server-side enforcement (not UI-only)

### Pillar 4 — Tenancy isolation (if multi-tenant)
Required:
- explicit tenancy model (row/schema/db/service isolation)
- cross-tenant access prevented by default
- rate limiting and resource limits per tenant

### Pillar 5 — Data persistence + migrations + lifecycle
Required:
- persistence layer and data model
- migrations with safe apply strategy
- retention/delete/export rules

### Pillar 6 — Secrets management (never in code)
Required:
- secrets stored outside code
- scoped access (only what needs it can read it)
- rotation support

### Pillar 7 — Supply chain security (dependencies and builds)
Required:
- pinned dependencies (lockfiles)
- vulnerability scanning
- reproducible builds

### Pillar 8 — Execution safety (sandbox + safe defaults)
Required:
- isolated runners (container/VM/jail—implementation flexible)
- restricted filesystem boundaries
- restricted egress where appropriate

### Pillar 9 — Testing (minimum viable test suite)
Required:
- unit tests
- integration tests (API + data layer)
- smoke tests (app starts, basic flows work)

### Pillar 10 — Security testing (minimum viable)
Required:
- static checks (baseline)
- dependency scan (CVEs)
- basic abuse checks (auth bypass attempts, input validation coverage)

### Pillar 11 — Release engineering (safe deploy + rollback)
Required:
- staging environment (or safe equivalent)
- artifact versioning
- rollback strategy

### Pillar 12 — Operations (observe, respond, recover)
Required:
- logs/metrics/alerts
- backups + restore drills
- incident runbooks
- patch cadence

---

## 4) End-to-end lifecycle SOP (A → B)
This is the full path from idea to “runs forever.”

### Phase 0 — Intake and scope
Inputs:
- goal + users
- data sensitivity level
- integrations needed
- acceptance criteria + DoD checklist

Outputs:
- Requirements Brief object (persisted)
- DoD checklist (persisted)
- risk rating (low/med/high)

Gate:
- acceptance criteria exists and is testable

Evidence:
- Requirements Brief + DoD record

### Phase 1 — Architecture and contracts
Outputs:
- data model
- API contract (schemas)
- tenancy model choice
- threat model summary (top threats + mitigations)

Gates:
- tenancy and auth are explicit
- data lifecycle is defined

Evidence:
- API schema + data schema + threat notes

### Phase 2 — Scaffold with secure defaults
Outputs:
- project skeleton (UI/API/data/tests)
- baseline security posture:
  - auth middleware
  - RBAC policy scaffold
  - input validation patterns
  - secure headers defaults

Gate:
- app starts in an isolated runner
- smoke test passes

Evidence:
- build log + smoke output

### Phase 3 — Build features in vertical slices
Rule:
- each slice includes UI + API + data + tests for one user-visible function

Gates per slice:
- lint/format
- unit tests
- integration tests
- dependency scan

Evidence:
- test reports + scan reports per slice

### Phase 4 — Pre-release verification
Outputs:
- release candidate artifact (versioned)

Gates:
- minimum security checks pass
- migration plan validated on staging
- rollback target ready

Evidence:
- staging validation report + release checklist

### Phase 5 — Release
Outputs:
- production deployment + release notes

Gates:
- monitoring enabled
- backups verified
- rollback confirmed

Evidence:
- deploy record + monitoring status + backup record

### Phase 6 — Operate forever
Recurring controls:
- patch releases (deps/base images/connectors)
- restore drills
- access reviews
- incident management

Evidence:
- patch logs + restore drill evidence + audit logs

---

## 5) Vibe Coding era hardening (assume hostile automation)
Treat any autonomous builder, external input, and integration callback as untrusted.

### 5.1 Required threat model (baseline)
For each project and the platform:
- assets (source, artifacts, secrets, tenant data, billing state)
- trust boundaries (UI → gateway → services → runners → stores)
- entry points (API, webhooks, uploads, admin actions, automations)
- top 10 threats + mitigations + required gates/evidence

### 5.2 Secure runners (anti-infiltration)
Required controls:
- isolation boundary per job (or per tenant with written justification)
- non-root execution by default
- read-only base filesystem where feasible
- resource limits (cpu/mem/disk/time)
- tool/command allowlist (no free-form shell from untrusted input)
- network egress controls:
  - deny by default for sensitive stages (build/test/sign)
  - explicit allowlist for required registries/APIs
- secrets injection:
  - only at runtime
  - scoped and never logged

### 5.3 Supply-chain integrity (chain of custody)
Required controls:
- dependency pinning + lockfile enforcement
- secret scanning (stop secrets in repo and logs)
- SBOM generated per release and stored as evidence
- build provenance per artifact (build id → source ref → builder identity)
- artifact signing (or equivalent integrity) and deploy-time verification
- immutable promotion (build once, promote that artifact)

### 5.4 Prompt/tool injection defenses
Required controls:
- tool execution requires server-side policy check (and approvals for high-risk actions)
- untrusted input cannot directly become tool parameters without validation
- outbound allowlists for connectors/domains when feasible (SSRF posture)
- explicit “dangerous action” list requiring step-up auth + approval record:
  - production deploy
  - secrets binding/rotation changes
  - data export/delete
  - policy changes

### 5.5 Runtime hardening
Required controls:
- edge protections (rate limits/WAF-equivalent)
- structured logging with redaction rules
- server-side RBAC + tenancy checks on every request
- backups + restore drills
- incident response runbooks
- patch cadence

---

## 6) Gates and evidence (non-bypassable)
### 6.1 Minimum required gates to ship
- lint/format
- unit tests
- integration tests (API + data)
- dependency vulnerability scan (SCA)
- secret scan
- smoke test (startup + core flows)

### 6.2 Higher-assurance gates (phase-in)
- spec-alignment verification for high-risk diffs
- drift detection (runtime differs from intended effective configuration)
- deeper security testing (as risk requires)

### 6.3 Evidence rules
- Every gate produces evidence (report/log/record).
- Every “PASS” must link to evidence.
- Evidence must link to:
  - work item
  - execution id
  - artifact id
  - release id

Overrides:
- no manual override without approval record + reason + time-bounded exception.

---

## 7) Stitch UI requirements (agnostic) — required, not cosmetic
UI is part of safety. It must allow a novice to answer:
- What is being built?
- What must happen next?
- What proof exists it is safe and working?
- What is deployed, and how do I roll back?
- What changed, who changed it, and why?

### 7.1 Required UI objects (backing models)
- Workspace/Tenant
- Project
- Environment
- Work Item
- Gate
- Evidence (pointer to reports/logs)
- Artifact
- Release
- Connector (integration)
- Secret Reference (pointer only)
- Policy (authz/tool/gate)
- Incident
- Usage Record (metering)

### 7.2 Required screens (minimum) and what they must show
1) Intake (chat or form)
   - saves Requirements Brief + DoD + risk rating

2) Workstream (Build/Verify/Release timeline)
   - current phase, next required gate, assigned owner(s)

3) Live Build Stream
   - executionId/requestId, step status, read-only logs, artifact links

4) Gates & Evidence Locker
   - every gate result links to evidence
   - failures show “why failed” and remediation pointer

5) Environments & Releases
   - active release version per environment
   - rollback target
   - last deploy actor/time/reason
   - migration status

6) Integrations
   - connector enablement
   - credential status via secret references (never raw)
   - webhook verification + replay protection status
   - last error and health

7) Security Center
   - roles/permissions summary
   - policies in effect
   - secret reference inventory + rotation schedule
   - vulnerability findings + patch status
   - audit log access

8) Operations
   - health/latency/errors
   - alerts
   - backups status + restore drill evidence
   - incidents + runbooks

9) Billing & Metering
   - usage by capability/tool
   - quota state
   - denials with reason codes

### 7.3 UI rules
- Every green check links to evidence.
- Every deploy shows rollback target.
- Every denial shows a reason (policy/quota/security gate).
- UI never bypasses the gateway to call internal services directly.

---

## 8) Configuration contracts (agnostic)
Configuration is a controlled system, not scattered toggles.

### 8.1 Config types that must exist
- authz policy config (roles/permissions/approvals)
- tool registry config (allowlist + limits + metering mapping)
- gate policy config (gates per risk level + thresholds)
- environment config sets (variables, feature flags, connector enablement)
- secret reference bindings + rotation schedules
- observability policy (redaction, retention, alert thresholds)
- backup/restore policy (frequency, retention, drill schedule)
- release policy (promotion rules, rollback rules, migration rules)

### 8.2 Config layering (effective config)
Effective configuration must be computed by layering:
1) platform defaults
2) tenant/workspace overrides
3) project overrides
4) environment overrides

UI must show:
- draft config
- effective config (enforced)
- version history

### 8.3 Config change control
Rules:
- schema validation before apply (hard fail)
- audit log for every change (who/what/when/reason)
- approval required for high-risk changes
- rollback to last known-good config

### 8.4 Drift detection
Detect and surface when runtime config differs from expected effective config:
- drift status
- last known-good restore option
- incident linkage if drift caused outage

---

## 9) “No-Guessing Contract” for autonomous building (task format)
Every work item must include:
- Objective (one sentence)
- Inputs (paths/contracts)
- Outputs (exact artifacts/files)
- Acceptance criteria (pass/fail)
- Required gates
- Required evidence (what to attach)

If the item cannot be written this way, it is not ready to execute.

---

## 10) Starter checklist (use this to self-audit)
Mark each as Present/Partial/Missing and attach evidence:
- Identity + session security
- RBAC/ABAC enforced server-side
- Tenancy model explicit and tested (if multi-tenant)
- Secrets stored outside code and never logged
- Isolated runners with egress controls and allowlisted tools
- Minimum gates enforced (lint/tests/scans/smoke)
- SBOM + provenance + artifact integrity checks per release
- Evidence locker exists (gate → evidence links)
- Rollback and restore drills exist and are proven
- Patch cadence exists and is proven
