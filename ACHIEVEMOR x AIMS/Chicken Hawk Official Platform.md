 Chicken Hawk: Official Platform Documentation

**Version:** 2.1 (Production)  
**Date:** January 28, 2026  
**Classification:** Official Enterprise Standard  
**Status:** Complete Implementation Guide

---

## EXECUTIVE SUMMARY

**Chicken Hawk** is a production-ready, autonomous execution platform built on GCP Cloud Run, Firebase, and Gemini 3 Flash Thinking. It operates on a **workload-first model**: execution is governed by tokens consumed, tasks completed, and verification gates passed—not calendar time.

**Core Promise:** Deliver complex multi-channel tasks (voice, API, Slack) to completion with deterministic, auditable reasoning and no human intervention required.

**Deployment Target:** Enterprise SaaS on GCP with per-user subscription model via Stripe.

---

## Part 1: Architecture Overview

### 1.1 Design Philosophy: Workload-Determined Execution

Unlike traditional timelines, Chicken Hawk measures progress **in real time** via:

- **Tokens Consumed** (from LUC and Flight Recorder)
- **Tasks Executed** (count of completed workload items)
- **Verification Gates Passed** (7 ORACLE gates per task)
- **Context Health** (70% context rule enforced by RLM distillation)

**Result:** Time becomes a *derived projection*, never a commitment. Users see real-time workload status, not countdown timers.

### 1.2 Layered Architecture

┌────────────────────────────────────────────┐
│  INGRESS LAYER (Multi-Channel)             │
│  Voice | API | Slack | Webhooks            │
└─────────────────┬──────────────────────────┘
                  ↓
┌────────────────────────────────────────────┐
│  GATEWAY LAYER (Flask + Cloud Run)         │
│  Speech-to-Text | Auth | Task Dispatch     │
└─────────────────┬──────────────────────────┘
                  ↓
┌────────────────────────────────────────────┐
│  ORCHESTRATION LAYER (Firebase + LUC)      │
│  SmelterOS | ZTDC | KYB | LUC Estimates    │
└─────────────────┬──────────────────────────┘
                  ↓
┌────────────────────────────────────────────┐
│  REASONING LAYER (Gemini 3 Flash Thinking) │
│  Agent Hierarchy: Master → Plan → ToolCall │
└─────────────────┬──────────────────────────┘
                  ↓
┌────────────────────────────────────────────┐
│  EXECUTION LAYER (Cloud Run Jobs + Skills) │
│  ORACLE Verification | Skill Dispatch      │
└─────────────────┬──────────────────────────┘
                  ↓
┌────────────────────────────────────────────┐
│  PERSISTENCE LAYER (Firestore + Cloud SQL)│
│  Flight Recorder | ByteRover Context Tree  │
└────────────────────────────────────────────┘

### 1.3 The Chicken Hawk Loop (Ralph Wiggum Pattern)

Load Task (PRD/RFP)
    ↓
Loop Until Complete:
    ├─ Pick Next Work Unit
    ├─ Check Context Health (70% rule)
    ├─ RLM Distillation if needed
    ├─ Apply Effort (FOSTER → DEVELOP → HONE)
    ├─ Query ByteRover for project patterns
    ├─ Verify Against 7 ORACLE Gates
    ├─ Pass? → Commit + Log + Evolve Visual
    ├─ Fail? → Retry (max 10 turns)
    └─ Task Complete? → Next task
Deploy & Settle

Each iteration is **workload-aware**: token cost is tracked in real time, and the Flight Recorder captures every decision, error, and verification result for audit and learning.

---

## Part 2: LUC Integration (Cost Estimation Engine)

### 2.1 What LUC Does

**LUC (Luke)** is the industry-agnostic cost estimator that sits at the threshold between user intent and execution. It:

1. **Parses requirements** (RFPs, prompts, voice inputs)
2. **Breaks scope into components** (backend, frontend, database, AI, integration, etc.)
3. **Estimates tokens per component** (with complexity and scale multipliers)
4. **Calculates multi-model cost** (Gemini 3 Flash, Claude, GPT-4, DeepSeek options)
5. **Generates itemized quotes** (professional, branded, with model options)
6. **Integrates ByteRover discount** (if patterns exist, 30–50% token reduction)

### 2.2 Platform Flow (ACHEEVY → LUC → Quote → BAMARAM → BuildSmith)

User Submits RFP
    ↓
ACHEEVY Analyzes & Refines Scope
    ├─ Asks clarifying questions
    ├─ Extracts industry, features, scale, constraints
    └─ Passes refined spec to LUC
    ↓
LUC Estimates Tokens + Cost
    ├─ Queries ByteRover for existing patterns
    ├─ If patterns exist: "Context cost: 50KB (90% reduction)"
    ├─ If new project: "Context cost: 500KB (worst-case)"
    ├─ Calculates per-model cost (Gemini, Claude, GPT, DeepSeek)
    └─ Returns itemized estimate
    ↓
UI Presents Quote Options
    ├─ Model A: $X (fastest)
    ├─ Model B: $Y (balanced)
    ├─ Model C: $Z (cheapest)
    └─ User selects or requests custom
    ↓
User Approves BAMARAM
    ├─ Confirms budget allocation
    ├─ Authorizes token spend
    └─ Triggers execution
    ↓
BuildSmith Executes (Chicken Hawk Loop Begins)
    ├─ Tokens consumed tracked in real time
    ├─ Flight Recorder logs all decisions
    ├─ ByteRover stores new patterns
    ├─ ORACLE gates verify quality
    └─ Delivery on completion (time irrelevant)
    ↓
Settlement & Learning
    ├─ Actual tokens vs. LUC estimate reconciled
    ├─ New contexts stored (for next project)
    ├─ KYB Charter updated with execution data
    └─ User sees final cost + workload summary

### 2.3 LUC Data Model

export interface LucEstimate {
  requestId: string;
  scope: {
    industry: string;                    // "real estate", "education", etc.
    features: string[];                  // ["user auth", "payment", "reporting"]
    scale: { users?: number; dataGB?: number; concurrency?: number };
    complexity: "simple" | "moderate" | "complex";
  };
  components: Array<{
    id: string;
    name: string;                        // "User Authentication"
    type: "backend" | "frontend" | "database" | "ai" | "integration" | "mobile";
    baseTokens: number;                  // 5000–100000 depending on type/complexity
    featureMultipliers: {
      ai?: 1.5;                          // AI integration: 50% more tokens
      realtime?: 1.3;
      compliance?: 1.2;
      security?: 1.2;
      i18n?: 1.15;
      accessibility?: 1.1;
    };
    adjustedTokens: number;              // After multipliers + scale
    estimatedCost: {
      gemini3Flash: number;              // $0.075 per 1M input / $0.30 per 1M output
      claude35Sonnet: number;
      gpt4Turbo: number;
      deepSeek: number;
    };
  }>;
  totals: {
    totalTokens: number;
    byteRoverSavings?: { contextReduction: string; tokenSavings: number };  // "90% reduction", 450000 tokens
    modelOptions: Array<{
      model: string;
      totalCost: number;
      runtimeProjection: { minSeconds: number; maxSeconds: number; basis: "real_time_throughput" };
    }>;
  };
  timestamp: string;
}

### 2.4 ByteRover Integration in LUC

When LUC runs, it first queries ByteRover's Context Tree:

// Inside LUC calculation
const byteRoverContext = await byterover.query({
  domain: "Backend",
  topic: "User Authentication",
  question: "What auth patterns have we implemented before?"
});

if (byteRoverContext.found) {
  // Patterns exist → reduce estimated context
  component.adjustedTokens *= 0.1;  // 90% reduction
  component.estimatedCost.gemini3Flash *= 0.1;
  // Log savings for transparency
  estimate.totals.byteRoverSavings = {
    contextReduction: "90%",
    tokenSavings: originalTokens - component.adjustedTokens
  };
}

Result: Users see accurate cost estimates, not worst-case padding.

---

## Part 3: ORACLE Verification Gates (7-Gate Checkpoint)

### 3.1 The Seven Gates (Defense-in-Depth)

Every task must pass all seven gates before delivery. Failure at any gate triggers a retry loop (max 10 iterations) with error details logged to Flight Recorder.

| Gate | Name | Verification | Failure Action |
|------|------|--------------|----------------|
| 1 | **Technical** | pytest pass ≥80% coverage, linter clean, type checks | Auto-fix loop, code review |
| 2 | **Virtue/Ethics** | Alignment score ≥0.995 (intent match) | Prompt refinement |
| 3 | **Charter Safety** | No internal cost leakage, data privacy checks | Content filter, audit log |
| 4 | **Judge Audit** | LLM compares code output vs. spec (>95% match required) | Spec clarification, regeneration |
| 5 | **Strategy** | Long-term value check (no tech debt hacks, architecture sound) | Architecture review, redesign |
| 6 | **Perception** | VL-JEPA visual check if UI component (pixel-perfect match to design) | UI tweak loop, designer review |
| 7 | **Effort** | Token budget audit (is this worth the cost?) | Budget expansion or scope reduction |

### 3.2 Gate Flow in Execution

Task Execution Completes
    ↓
Run Gate 1 (Technical)
  ├─ pytest → Coverage ≥80%? 
  ├─ Black/Pylint → Issues?
  ├─ Type check → mypy pass?
  ├─ PASS → Continue
  └─ FAIL → Auto-fix attempt (max 3 tries) → Gate 1 retry
    ↓
Run Gate 2 (Virtue/Ethics)
  ├─ Calculate f_virtue (intent alignment)
  ├─ Score ≥0.995?
  ├─ PASS → Continue
  └─ FAIL → Refine prompt → Regenerate → Gate 2 retry
    ↓
Run Gate 3 (Charter Safety)
  ├─ Scan for PII leakage
  ├─ Check data encryption flags
  ├─ Verify compliance policies
  ├─ PASS → Continue
  └─ FAIL → Apply content filter → Gate 3 retry
    ↓
Run Gate 4 (Judge Audit)
  ├─ LLM Judge receives: original_spec + final_diff
  ├─ Judge: "Did this implement EXACTLY what was specified?"
  ├─ Judge score >95%?
  ├─ PASS → Continue
  └─ FAIL → Return reason to agent → Clarify spec → Gate 4 retry
    ↓
Run Gate 5 (Strategy)
  ├─ Code review: "Is this a hack or a solution?"
  ├─ Architecture check: "Does it fit the system?"
  ├─ Tech debt risk: Low?
  ├─ PASS → Continue
  └─ FAIL → Architecture review, redesign → Gate 5 retry
    ↓
Run Gate 6 (Perception)
  ├─ If UI component: VL-JEPA visual compare
  ├─ Design match ≥99%?
  ├─ PASS → Continue
  └─ FAIL → UI tweaks, designer review → Gate 6 retry
    ↓
Run Gate 7 (Effort)
  ├─ Token cost audit: Tokens consumed vs. LUC estimate?
  ├─ Within 15% budget?
  ├─ PASS → Commit + Log
  └─ FAIL → Request budget expansion OR reduce scope → Gate 7 retry
    ↓
All Gates PASS
    ↓
Commit to Git
Record in Flight Recorder (with all gate results)
Mark task complete in Firestore
Increment visual evolution (Hatchling → Hunter → Powerhouse)
Trigger next task in queue

### 3.3 Retry Limit & Escalation

- **Max retries per gate:** 10 (defensive against infinite loops)
- **After 10 retries:** Escalate to human review with full context
- **Escalation captures:** Original spec, all 10 failed attempts, gate results, agent reasoning
- **Recovery:** Human clarifies intent → Agent re-attempts from task start

---

## Part 4: Context Engineering (The 70% Rule)

### 4.1 RLM Distillation Protocol

Chicken Hawk prevents "agent drift" by enforcing a strict context budget:

Monitor: Current context usage after every turn
Trigger: If usage > 70% of max window (e.g., 70% of 128K tokens)
Action:
  ├─ PAUSE execution
  ├─ DISTILL conversation history using MIT RLM logic
  │   └─ Compress 128K tokens → 20K summary (via semantic extraction)
  ├─ WIPE chat history from memory
  ├─ INJECT: Distilled summary + standards.md + current task spec
  ├─ RESUME execution with fresh context window
└─ Result: Agent stays "coherent" indefinitely

### 4.2 Source of Truth (File Structure)

project-root/
├── standards.md                    # [Layer 1] Global constraints (immutable)
├── product.md                      # [Layer 2] Scope & architecture
├── specs/
│   ├── prd.md                      # Definition of Done
│   ├── task-state.json             # Which tasks are closed (single source of truth)
│   └── task-001.yaml               # Current task atomic unit
├── .chicken-hawk/
│   ├── ledger.log                  # Effort audit trail (tokens, gates, timestamps)
│   ├── distilled-context.md        # RLM output (when 70% rule triggered)
│   └── config.yaml                 # Harness settings (retry limits, model config)
└── docs/
    ├── learned-patterns/           # ByteRover context tree (stored here too)
    └── flight-recorder/            # Timestamped execution logs

### 4.3 Real-Time Context Monitoring

// In Chicken Hawk loop
function monitorContextHealth(): void {
  const currentUsage = tokenCounter.getCurrentUsage();
  const maxWindow = 128000;  // Gemini context limit
  const threshold = maxWindow * 0.70;
  
  if (currentUsage > threshold) {
    logger.warn(`⚠️ Context usage at ${Math.round((currentUsage/maxWindow)*100)}%`);
    
    // Trigger distillation
    const distilled = performRLMDistillation(conversationHistory);
    
    // Write to disk
    fs.writeFileSync('.chicken-hawk/distilled-context.md', distilled);
    
    // Clear chat memory
    conversationHistory = [];
    
    // Inject fresh context
    const freshContext = `
# Chicken Hawk Execution Context (Distilled)

${distilled}

---

## Current Task
${fs.readFileSync('specs/task-001.yaml', 'utf-8')}

## Standards
${fs.readFileSync('standards.md', 'utf-8').slice(0, 10000)}  # First 10K chars only
    `;
    
    systemPrompt = freshContext;
    logger.info('✅ Context refreshed. Resuming execution.');
  }
}

---

## Part 5: ByteRover + ORACLE Integration

### 5.1 Persistent Memory for Multi-Agent Workflows

**ByteRover** solves the "learning problem": agents today waste tokens re-solving problems from yesterday. Chicken Hawk + ByteRover = agents that learn across executions.

**Flow:**

Agent 1 executes Task A
  ├─ Fixes bug X
  ├─ Learns pattern: "Always wrap DB calls in try-catch"
  └─ Stores in ByteRover: Domain: "Backend", Topic: "Error Handling"
         File: "db-error-patterns.md"
           ↓
Agent 2 executes Task B
  ├─ Queries ByteRover: "Error handling patterns?"
  ├─ Retrieves: "db-error-patterns.md" (exact match)
  ├─ Avoids bug X immediately
  └─ Result: 50% token savings on Task B

**Query Integration:**

// Inside ORACLE reasoner (before code generation)
async function generateCodeWithByteRover(spec: string): Promise<string> {
  // Query ByteRover for project patterns
  const patterns = await byterover.query({
    domain: inferDomain(spec),      // "Backend", "Frontend", etc.
    topic: inferTopic(spec),        // "Authentication", "Database", etc.
    question: spec                  // User's actual requirement
  });
  
  // Construct prompt with patterns
  const prompt = `
    User Requirement:
    ${spec}
    
    Project Patterns (from ByteRover):
    ${patterns.map(p => `- ${p.filename}: ${p.summary}`).join('\n')}
    
    Generate code that:
    1. Solves the requirement
    2. Follows these patterns exactly
    3. Passes ORACLE gates (technical, virtue, strategy, perception)
  `;
  
  // Generate with Gemini 3 Flash Thinking
  const code = await generateWithGemini(prompt);
  
  // Verify gates
  const gateResults = await verifyOracleGates(code, spec);
  
  return code;
}

### 5.2 Context Tree Structure

ByteRover organizes knowledge into a **Context Tree** (filesystem-based, no vector DB):

~/.byterover/context_tree/
├── Domains/
│   ├── Architecture/
│   │   ├── Topics/
│   │   │   ├── System-Design/
│   │   │   │   ├── microservices.md
│   │   │   │   ├── monolith-vs-micro.md
│   │   │   │   └── scaling-patterns.md
│   │   │   └── Database-Design/
│   │   │       ├── schema-patterns.md
│   │   │       ├── indexing-strategy.md
│   │   │       └── partitioning.md
│   ├── Frontend/
│   │   ├── Topics/
│   │   │   ├── React/
│   │   │   │   ├── component-patterns.md
│   │   │   │   └── state-management.md
│   │   │   └── UI-Accessibility/
│   │   │       └── wcag-compliance.md
│   ├── Backend/
│   │   ├── Topics/
│   │   │   ├── Error-Handling/
│   │   │   │   ├── db-error-patterns.md
│   │   │   │   └── api-error-responses.md
│   │   │   └── Authentication/
│   │   │       ├── oauth2-integration.md
│   │   │       └── jwt-patterns.md
│   ├── Database/
│   ├── Debugging/
│   └── Documentation/
└── Metadata/
    └── index.json  # Maps query → file location

---

## Part 6: KYB Standard (Know Your Boomer_Ang)

### 6.1 Three-Tier Identity for Agents

**KYB** provides transparent, auditable identity for Chicken Hawk agents:

#### Tier 1: Public Passport (User Trust)

{
  "serialId": "ANG-2026-CH-0001",
  "displayName": "Chicken Hawk v2.1",
  "version": "2.1",
  "category": "Autonomous Execution",
  "capabilities": {
    "primarySkills": ["Code Generation", "Task Decomposition", "Multi-Channel Input"],
    "supportedChannels": ["Voice", "API", "Slack", "Webhooks"],
    "limitations": ["No production database access", "Isolated sandbox execution"]
  },
  "verificationBadges": {
    "technical": true,       // Passed unit tests
    "security": true,        // Passed vulnerability scan
    "ethics": true,          // Passed alignment checks
    "oracle": true           // Passed 7-gate verification
  },
  "status": "Active",
  "lastAuditDate": "2026-01-28"
}

**Endpoint:** `GET /.well-known/kyb/charter/ANG-2026-CH-0001`

#### Tier 2: Flight Recorder (Operational Audit)

{
  "timestamp": "2026-01-28T12:00:00Z",
  "eventId": "evt-abc123",
  "taskId": "task-001",
  "executionLog": {
    "phase": "DEVELOP",
    "inputHash": "sha256:a1b2...",
    "outputHash": "sha256:c3d4...",
    "iterations": 3,
    "retriesPerGate": [0, 1, 0, 2, 0, 0, 0]  // One retry on gate 2 and 4
  },
  "verificationResults": {
    "gate1_technical": { status: "PASS", coverage: 87 },
    "gate2_virtue": { status: "PASS", score: 0.998 },
    "gate3_charter": { status: "PASS" },
    "gate4_judge": { status: "PASS", accuracy: 0.97 },
    "gate5_strategy": { status: "PASS" },
    "gate6_perception": { status: "PASS" },
    "gate7_effort": { status: "PASS", tokenUsed: 12500, tokenBudget: 15000 }
  },
  "costMetrics": {
    "tokensUsed": 12500,
    "estimatedCost": 0.94,
    "actualCost": 0.88,
    "executionTimeMs": 2400,
    "byteRoverSavings": { reduction: "40%", tokensSaved: 8500 }
  },
  "safetyChecks": {
    "piiScrubbed": true,
    "vulnerabilitiesFound": 0
  }
}

**Storage:** Firestore collection `flight_recorder/{taskId}/{eventId}`

#### Tier 3: Anchor Chain (Immutable Proof)

{
  "batchId": "batch-2026-01-28-1200",
  "merkleRoot": "0xabc123...",
  "eventCount": 150,
  "blockchainTx": "0x987654...",  // Ethereum/Polygon hash
  "validations": {
    "proofOfAction": true,   // The task actually executed
    "proofOfQuality": true   // All gates passed
  }
}

**Storage:** Periodic anchoring to blockchain (optional, for compliance-heavy industries).

### 6.2 Health Scoring

Real-time agent health metric:

export function calculateHealthScore(flightRecorder: FlightRecord[]): number {
  const recent = flightRecorder.slice(-100);  // Last 100 executions
  
  const passRate = recent.filter(r => r.allGatesPassed).length / recent.length;
  const errorRate = recent.filter(r => r.tokensWastedOnRetries > 0).length / recent.length;
  const avgCostAccuracy = recent.reduce((sum, r) => sum + (1 - Math.abs(r.estimatedCost - r.actualCost) / r.estimatedCost), 0) / recent.length;
  
  const healthScore = (
    passRate * 0.5 +      // 50% weight on success rate
    (1 - errorRate) * 0.3 +  // 30% weight on low error rate
    avgCostAccuracy * 0.2    // 20% weight on cost accuracy
  );
  
  return Math.min(1.0, Math.max(0, healthScore));  // Clamp 0–1
}

// If healthScore < 0.85 for 10 consecutive executions → Auto-suspend & alert

---

## Part 7: Real-Time Workload Monitoring

### 7.1 Dashboard Metrics (No Countdown Timers)

Chicken Hawk dashboards show **real-time workload**, not estimated time:

📊 CHICKENHAWK LIVE DASHBOARD

Current Task: "Build LMS Platform"
Status: EXECUTING

Workload Progress:
├─ Tasks Completed: 12/45 (27%)
├─ Tokens Consumed: 145,320 / 200,000 budget (73%)
├─ Gates Passed: 78 / 315 (25%)
└─ ByteRover Contexts Used: 23 / 30 available

Current Phase: DEVELOP (Task 13)
├─ Phase Time: 4 min 22 sec elapsed
├─ Component: "User Authentication Backend"
├─ Model: Gemini 3 Flash Thinking
├─ Gate Status: ⏳ Running Gate 3 (Charter Safety)
└─ Next Phase: HONE (after Gate 7 passes)

Real-Time Costs:
├─ Gemini 3 Flash: $67.42 (LUC est. $80)
├─ VL-JEPA embeddings: $2.15
├─ ByteRover queries: $0.45 (90% savings vs. no patterns)
└─ Total (live): $70.02 of $95 budget

ByteRover Learning:
├─ Contexts Stored This Session: 5
├─ Patterns Reused: 23 (40% of decisions)
├─ Token Savings Attribution: 40%
└─ Team Knowledge Base: 340 patterns (growing)

Context Health: 🟢 HEALTHY
├─ Current Usage: 45K / 128K (35%)
├─ 70% Rule Threshold: 89.6K
└─ Next Distillation: ~15 more tasks

Alerts: None 🟢

### 7.2 Runtime Projection (Calculated, Not Promised)

Only show time estimate *after* sufficient Flight Recorder data exists:

export function calculateRuntimeProjection(
  taskId: string,
  similarTaskHistory: FlightRecord[]
): { minSeconds: number; maxSeconds: number; confidence: number } | null {
  // Only project if we have ≥20 similar historical tasks
  if (similarTaskHistory.length < 20) {
    return null;  // Not enough data
  }
  
  const avgTime = similarTaskHistory.reduce((sum, r) => sum + r.executionTimeMs, 0) / similarTaskHistory.length;
  const stdDev = Math.sqrt(
    similarTaskHistory.reduce((sum, r) => sum + Math.pow(r.executionTimeMs - avgTime, 2), 0) / similarTaskHistory.length
  );
  
  return {
    minSeconds: Math.round((avgTime - stdDev) / 1000),
    maxSeconds: Math.round((avgTime + stdDev) / 1000),
    confidence: similarTaskHistory.length >= 50 ? 0.95 : 0.75,
    basis: "historical_flight_recorder"  // Be explicit about source
  };
}

**Display Logic:**

Runtime Estimate (Historical)
├─ Based on 47 similar past executions
├─ Confidence: 85%
└─ Projected: 8–12 minutes
   (Note: Real-time factors may vary. This is informational, not a commitment.)

---

## Part 8: Deployment Workflow

### 8.1 Week 1: Foundation (Workload-Focused Onboarding)

| Workload Item | Actions | Metrics |
|---|---|---|
| **GCP Infrastructure** | Create project, enable APIs, create service account | ✓ Cloud Run quota active, ✓ Firestore operational |
| **Firebase Schema** | Deploy security rules, create database | ✓ Real-time sync verified, ✓ Auth rules tested |
| **Gateway Container** | Build Dockerfile, push to GCR, deploy to Cloud Run | ✓ /health endpoint 200ms response, ✓ Cold start <3s |
| **Test Voice Channel** | Record test audio, hit /voice endpoint, verify transcription | ✓ Speech-to-Text latency <500ms, ✓ Transcript accuracy >95% |
| **Test API Channel** | POST to /api/task, verify task creation in Firestore | ✓ Task created in <100ms, ✓ Task state machine correct |

**Success Criteria (Week 1):**
- [ ] 5 tasks executed via API
- [ ] 3 tasks executed via voice
- [ ] All 7 ORACLE gates firing correctly
- [ ] Flight Recorder logging all events
- [ ] Zero critical errors in Cloud Logging
- [ ] Gateway response time <500ms (p50)

### 8.2 Week 2–3: Reasoning + Pattern Learning

| Workload Item | Actions | Metrics |
|---|---|---|
| **Gemini 3 Flash Thinking** | Integrate thinking mode, test reasoning accuracy | ✓ Thinking tokens captured, ✓ Judge gate accuracy >95% |
| **ByteRover Context Tree** | Initialize, store first 20 patterns from Week 1 tasks | ✓ 20 contexts curated, ✓ Query latency <100ms |
| **LUC Integration** | Connect LUC to ACHEEVY flow, test cost estimates | ✓ Estimates ±15% of actual cost, ✓ Quote generation <2s |
| **KYB Flight Recorder** | Capture all execution data, store in Firestore | ✓ 50+ events logged, ✓ Full audit trail readable |
| **Multi-Agent Handoff** | Test 2-agent sequential tasks with context passing | ✓ Context passed via Firestore, ✓ Agent 2 reuses learnings |

**Success Criteria (Week 2–3):**
- [ ] 50 tasks executed (mix of channels)
- [ ] 30% average token cost reduction vs. LUC estimate
- [ ] 200 contexts stored in ByteRover
- [ ] Gate retry rate <5% (most tasks pass on first attempt)
- [ ] ByteRover hit rate >70% on subsequent tasks

### 8.3 Week 4+: Scale & Hardening

| Workload Item | Actions | Metrics |
|---|---|---|
| **Multi-User Tenancy** | Add Stripe billing, per-user budget allocation | ✓ Stripe webhooks working, ✓ User token budgets enforced |
| **Advanced Monitoring** | Set up Datadog/Prometheus dashboards, alert on health <0.85 | ✓ Dashboards live, ✓ Alerts tested |
| **Skill Marketplace** | Allow agents to autonomously write new skills | ✓ 5 new skills auto-generated and integrated |
| **Visual Evolution** | Deploy Hatchling → Hunter → Powerhouse progression | ✓ UI shows progression, ✓ Logic tied to gates passed |

**Success Criteria (Week 4+):**
- [ ] 500+ tasks executed
- [ ] 99.5%+ gate pass rate (after first retry)
- [ ] 1000+ patterns in ByteRover
- [ ] <1% error rate in Flight Recorder
- [ ] Cost predictability: actual vs. LUC estimate ±10%

---

## Part 9: Governance & Safety

### 9.1 Automatic Suspension Triggers

Chicken Hawk **self-enforces guardrails**:

// Monitor health in real time
async function enforceGovernance(): Promise<void> {
  const healthScore = calculateHealthScore(flightRecorder);
  const errorRate = calculateErrorRate(flightRecorder);
  const costAccuracy = calculateCostAccuracy(flightRecorder);
  
  // Auto-suspend if metrics degrade
  if (healthScore < 0.80) {
    await suspendAgent('health_score_low', {
      reason: `Health score ${healthScore} below threshold 0.80`,
      lastNTasks: flightRecorder.slice(-50)
    });
  }
  
  if (errorRate > 0.15) {
    await suspendAgent('error_rate_high', {
      reason: `Error rate ${errorRate} above threshold 0.15`,
      recommendations: ["Review recent gate failures", "Increase retry limit"]
    });
  }
  
  if (Math.abs(costAccuracy) > 0.30) {
    await suspendAgent('cost_accuracy_poor', {
      reason: `Cost estimates off by ${costAccuracy}. Need LUC recalibration.`,
      nextSteps: ["Review LUC component estimates", "Run cost audit"]
    });
  }
}

### 9.2 Escalation Protocol

If suspension is triggered, a **human review task** is automatically created:

{
  "escalationType": "AGENT_SUSPENSION",
  "agentId": "ANG-2026-CH-0001",
  "reason": "Health score 0.78 < 0.80",
  "context": {
    "lastNFlightRecords": [...],
    "recommendedActions": [
      "Review latest 10 failed gate checks",
      "Check for model API issues",
      "Re-verify ORACLE gate thresholds"
    ],
    "timeline": "Human review required within 24 hours"
  },
  "createdAt": "2026-01-28T12:34:00Z",
  "status": "AWAITING_REVIEW"
}

---

## Part 10: Success Metrics (Workload-Based)

### 10.1 North Star Metrics (What We Measure)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Gate Pass Rate** | >95% on first attempt | Count: (tasks passing all 7 gates) / (total tasks) |
| **Token Cost Accuracy** | ±15% vs. LUC estimate | Reconcile: (actual tokens - estimated tokens) / estimated tokens |
| **ByteRover Hit Rate** | >70% after Week 3 | Count: (tasks reusing patterns) / (total tasks) |
| **Context Health** | <70% usage (RLM triggers at 70%) | Measure: current_tokens / max_tokens after each task |
| **Agent Health Score** | >0.90 sustained | Calculate: (passRate × 0.5 + (1-errorRate) × 0.3 + costAccuracy × 0.2) |
| **Execution Consistency** | <10% variance in token cost per task type | Measure: stdDev(tokensUsed) / mean(tokensUsed) per component type |

### 10.2 Business Metrics

| Metric | Target | Method |
|--------|--------|--------|
| **Cost Savings** | 30–50% via ByteRover patterns | Track: (tokens without patterns - tokens with patterns) / tokens without patterns |
| **Task Throughput** | Increase 40% post-deployment | Measure: tasks_completed per week (Week 1 baseline vs. Week 4+) |
| **User Satisfaction** | >4.5 / 5.0 | Survey: "Did the estimate match your actual cost?" |
| **Conversion Rate** | +30% (post-LUC integration) | Track: (users approving BAMARAM) / (users requesting quotes) |

---

## Part 11: FAQ

**Q: What if Chicken Hawk's reasoning is wrong?**  
A: All outputs pass the Judge gate, which compares code vs. spec with >95% accuracy. If Judge fails, the task retries with refinement feedback. After 10 retries, human review is escalated.

**Q: How long will my task take?**  
A: Time is determined by workload (tokens + verification gates), not calendar time. We show real-time progress (% of tokens used, gates passed, contexts queried) and only project time *after* we have sufficient historical data. See Part 7.2.

**Q: What if I run out of budget mid-task?**  
A: LUC estimates your full budget upfront, but if you exceed it, Chicken Hawk pauses after the current gate passes and requests budget expansion or scope reduction.

**Q: Can Chicken Hawk handle my specific industry?**  
A: Yes. LUC is industry-agnostic and uses component-based breakdown. ByteRover learns your industry patterns. ORACLE gates verify output regardless of domain.

**Q: What happens if tokens are wasted on retries?**  
A: All retries are logged in Flight Recorder with the reason (gate failure). If retry rate exceeds 5% over 50 tasks, health score drops and agent suspends for review.

---

## APPENDIX A: Environment Variables (Prod)

# GCP
GOOGLE_CLOUD_PROJECT=chickenhawk-agency-prod
FIREBASE_DATABASE_URL=https://chickenhawk-agency-prod-default-rtdb.firebaseio.com
GCP_SERVICE_ACCOUNT_KEY=/var/secrets/google/key.json

# AI Models (via Openrouter)
OPENROUTER_API_KEY=sk_live_XXXXX
GEMINI_MODEL=openrouter/google/gemini-3-flash-thinking
CLAUDE_FALLBACK=openrouter/anthropic/claude-3.5-sonnet

# Services
BYTEROVER_API_KEY=... (or self-hosted)
VL_JEPA_ENDPOINT=... (image embeddings)
ELEVENLABS_API_KEY=... (optional, voice output)

# Integrations
SLACK_BOT_TOKEN=xoxb-XXXXX
SLACK_SIGNING_SECRET=XXXXX

# Billing
STRIPE_SECRET_KEY=sk_live_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX

# Monitoring
DATADOG_API_KEY=... (optional)

---

## APPENDIX B: Glossary

| Term | Definition |
|------|-----------|
| **Chicken Hawk** | The autonomous execution platform (this system) |
| **Ralph Wiggum Loop** | Core execution pattern: pick task → apply effort → verify gates → commit → repeat |
| **Workload** | Tokens consumed + tasks completed + gates passed (not calendar time) |
| **Flight Recorder** | Immutable execution log (KYB Tier 2); captures all decisions, tokens, retries, gate results |
| **ByteRover** | Persistent context tree; prevents agents re-solving old problems |
| **ORACLE Gates** | 7-point verification checkpoint (technical, virtue, charter, judge, strategy, perception, effort) |
| **LUC Estimate** | Industry-agnostic cost prediction (tokens × model rate); input to BAMARAM decision |
| **RLM Distillation** | Compression of conversation history when context >70% full |
| **KYB Charter** | Public identity badge; proves agent trustworthiness |
| **Health Score** | Real-time metric (0–1) tracking agent reliability |

---

## APPENDIX C: Troubleshooting

### Issue: Gateway returns 503 (Service Unavailable)

**Cause:** Cloud Run is cold-starting or out of capacity.  
**Fix:** Increase memory/CPU in Cloud Run config; enable min instances (1–2).

### Issue: Firestore transactions timeout

**Cause:** High task volume causing contention on task-state.json writes.  
**Fix:** Implement sharded writes (split tasks across multiple docs by task ID hash).

### Issue: Gate 4 (Judge) always fails

**Cause:** Judge LLM's spec interpretation differs from agent's code generation.  
**Fix:** Clarify spec in task-001.yaml with concrete examples; add test cases Judge can evaluate.

### Issue: ByteRover queries return nothing (0% hit rate)

**Cause:** Context tree is empty or query topic doesn't match stored topics.  
**Fix:** Manually curate first 10–20 contexts using `brv curate`; verify domain/topic taxonomy matches your project.

---

**Documentation Version:** 2.1 (Production)  
**Last Updated:** January 28, 2026  
**Status:** Ready for Deployment

---

*Chicken Hawk: Workload-Determined Autonomous Execution*  
*Built on GCP. Verified by ORACLE. Remembered by ByteRover. Trusted by KYB.*

🐓 **No timelines. Only tokens, tasks, and gates passed.**