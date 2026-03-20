# UEF Quick Start: Deploy in 4 Hours
## The Accelerated Path from Zero to Production

**Date:** January 18, 2026  
**Duration:** 4 hours  
**Scope:** Get UEF running with your first project  
**Outcome:** Production-ready AI orchestration

---

## Prerequisites

- Node.js 18+
- Claude API key (or Gemini/OpenAI)
- GCP project (or Firebase) for datastore
- Basic TypeScript knowledge

---

## Hour 1: Core Infrastructure (60 min)

### Step 1a: Clone UEF Starter Template (10 min)

```bash
# Clone the framework
git clone https://github.com/smelter-os/uef-framework.git
cd uef-framework

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Fill in your API keys
# ANTHROPIC_API_KEY=sk-ant-...
# FIREBASE_PROJECT_ID=your-project
# GEMINI_API_KEY=...
```

### Step 1b: Set Up Firestore (10 min)

```bash
# Initialize Firebase
npm run firebase:init

# Create collections
npm run firebase:collections:init

# This creates:
# - quotes/
# - contracts/
# - kyb_flight_recorder/
# - acp_manifests/
# - semantic_embeddings/
```

### Step 1c: Deploy UEF Gateway (20 min)

```bash
# Create deployment config
cat > uef-deployment.yaml << 'EOF'
name: UEF Gateway
region: us-central1
memory: 2GB
timeout: 30s
environment:
  ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
  FIREBASE_PROJECT_ID: ${FIREBASE_PROJECT_ID}
  NODE_ENV: production
entrypoint: src/gateway.ts
EOF

# Deploy to Cloud Run
npm run deploy:gateway

# Output: https://uef-gateway-xxxxx.cloudfun.net
```

### Step 1d: Verify Installation (20 min)

```bash
# Test the gateway
curl -X POST https://uef-gateway-xxxxx.cloudfun.net/health \
  -H "Content-Type: application/json" \
  -d '{
    "test": true
  }'

# Expected response: { "status": "healthy", "version": "2.0" }

# If 200: ✅ Continue
# If error: Check logs with:
# gcloud functions logs read uef-gateway --limit=50
```

**Time Check: 60 min ✅**

---

## Hour 2: Configure Your First Engine (60 min)

Choose ONE engine to start. (Recommendation: Start with LUC if you want cost estimation, or ORACLE if you want code generation.)

### Option A: LUC Engine (Cost Estimation)

```typescript
// src/engines/luc-adapter.ts

export const YOUR_PROJECT_LUCAdapter = {
  domain: "your_domain",  // "code_generation", "real_estate", etc
  
  componentBreakdown: {
    primary_work: {
      baseTokens: 5000,
      featureMultipliers: {
        feature_1: 1.2,
        feature_2: 1.5
      },
      scaleAdjustments: {
        simple: 1.0,
        moderate: 1.3,
        complex: 1.8
      }
    }
  }
};

// That's it! The rest of LUC is universal.
```

**Implementation (15 min):**

```bash
# 1. Define your components
# Edit src/engines/luc-adapter.ts and add your component breakdown

# 2. Test LUC
npm run test:luc -- --adapter YOUR_PROJECT

# 3. Deploy
npm run deploy:luc
```

### Option B: ORACLE Engine (Code/Content Generation)

```typescript
// src/engines/oracle-adapter.ts

export const ORACLE_CLAUDEConfig = {
  model: "claude-3-5-sonnet-20241022",
  fosterMaxTokens: 8000,
  developMaxTokens: 16000,
  honeMaxTokens: 12000,
  maxIterations: 10
};

// That's it! Claude is now your execution engine.
```

**Implementation (15 min):**

```bash
# 1. Wire Claude
# Edit src/engines/oracle-adapter.ts and set your model

# 2. Define verification gates
# Copy src/gates/template.ts to src/gates/your-project.ts
# Customize technical, ethics, judge gates

# 3. Test ORACLE
npm run test:oracle -- --spec "Build a REST API"

# 4. Deploy
npm run deploy:oracle
```

### Option C: Agent Negotiation (ACP)

```typescript
// src/agents/manifest.ts

export const YourAgentManifest: ACPManifest = {
  agentId: "your-agent",
  name: "Your Agent Name",
  
  capabilities: [
    {
      name: "your_capability",
      input_schema: { /* describe input */ },
      output_schema: { /* describe output */ },
      estimated_tokens: 5000
    }
  ],
  
  metrics: {
    successRate: 0.90,
    avgCostPer1kTokens: 0.015,
    avgLatencyMs: 10000
  }
};

// Register it
await ACPRegistry.registerAgent(YourAgentManifest);
```

**Implementation (15 min):**

```bash
# 1. Define agent manifest
# Edit src/agents/your-agent-manifest.ts

# 2. Register in ACP
npm run register:agent

# 3. Test negotiation
npm run test:acp -- --from agent-1 --to your-agent

# 4. Deploy
npm run deploy:acp
```

### Step 2d: Wire Verification Tool (15 min)

```bash
# Copy template
cp src/verification/template.ts src/verification/your-project.ts

# Edit to match YOUR build system
# - Add your linter
# - Add your test runner
# - Add your formatter

# Test it
npm run test:verify -- --language typescript --code "..."

# Deploy
npm run deploy:verify
```

**Time Check: 60 min ✅**

---

## Hour 3: Connect Hallucination Detection (40 min) + Audit (20 min)

### Part 3a: VL-JEPA Integration (20 min)

```bash
# 1. Download VL-JEPA model (one-time)
npm run download:vl-jepa

# 2. Start embedding service
npm run start:embedding-service

# 3. Test hallucination detection
npm run test:ztdc -- \
  --query "Build a REST API" \
  --output "Here's some code..."

# Expected output:
# {
#   "likelihood": 0.05,  # 0-1, low = good
#   "signals": [],
#   "passed": true
# }
```

### Part 3b: KYB Flight Recorder (10 min)

```bash
# Already auto-configured!
# Every execution automatically logs to:
# - Firestore: kyb_flight_recorder/
# - Blockchain (optional): Polygon testnet

# Verify it's working:
npm run test:kyb -- --requestId "test-123"

# Expected: Event appears in Firestore within 1 second
```

### Part 3c: Create Dashboard (10 min)

```bash
# Deploy metrics dashboard
npm run deploy:dashboard

# Visit: https://your-domain/dashboard

# You'll see real-time:
# - Execution success rate
# - Token usage
# - Cost breakdown
# - Gate pass rate
# - Hallucination detection rate
```

**Time Check: 60 min ✅**

---

## Hour 4: End-to-End Test & Deploy (60 min)

### Step 4a: Build Test Scenario (15 min)

```typescript
// tests/e2e.test.ts

import { UEFGateway } from "../src/gateway";

describe("UEF End-to-End", () => {
  it("should complete full execution flow", async () => {
    const request: UEFRequest = {
      requestId: "e2e-test-001",
      userId: "test-user",
      action: "execute_build",  // or "cost_estimate", "verify_output"
      payload: {
        // Your test spec
        spec: "Build a REST API with user auth"
      },
      metadata: {
        source: "test",
        tier: "pro"
      }
    };
    
    const response = await UEFGateway.handle(request);
    
    // Assertions
    expect(response.success).toBe(true);
    expect(response.cost.usd).toBeLessThan(10);  // Should be cheap
    expect(response.audit.verification_status).toBe("PASSED");
    expect(response.data.artifacts).toBeDefined();
  });
});
```

### Step 4b: Run Tests (15 min)

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# End-to-end test
npm run test:e2e

# Expected: All tests pass ✅
```

### Step 4c: Load Test (10 min)

```bash
# Simulate 10 concurrent requests
npm run load-test -- --concurrency 10 --duration 30s

# Expected output:
# - Successful requests: 10/10
# - Avg latency: <2.5s
# - Cost per request: ~$0.10
```

### Step 4d: Production Deployment (20 min)

```bash
# Set production environment
export NODE_ENV=production

# Run final checks
npm run pre-deploy

# Deploy all services
npm run deploy:all

# Verify all endpoints
npm run verify:endpoints

# Expected: All 200 OK
```

### Step 4e: Monitor First Executions (monitoring dashboard opens automatically)

```bash
# Visit your dashboard
open https://your-domain/dashboard

# You should see:
# ✅ Your first execution in KYB Flight Recorder
# ✅ Cost breakdown displayed
# ✅ 7 gates showed PASSED
# ✅ Hallucination likelihood < 0.1
```

**Time Check: 60 min ✅**

---

## Total: 4 Hours ⏱️

```
Hour 1: Core Infrastructure (60 min)   ✅
Hour 2: Configure Engine (60 min)      ✅
Hour 3: Verification + Audit (60 min)  ✅
Hour 4: Test & Deploy (60 min)         ✅
────────────────────────────────
TOTAL: 4 hours to production 🚀
```

---

## What You Now Have

```
✅ UEF Gateway (Layers 1-4)
✅ One Execution Engine (LUC / ORACLE / ACP)
✅ Verification Tool (MCP-standardized)
✅ Hallucination Detection (VL-JEPA)
✅ KYB Flight Recorder (Audit trail)
✅ Metrics Dashboard (Real-time visibility)
✅ Production Deployment (Cloud Run / K8s ready)
✅ Full audit trail (Immutable proof)
```

---

## Next: Scale to Your Entire Ecosystem

Now that you have UEF running with ONE project/engine, you can:

1. **Add more projects** (Nurds Code, Locale, SmelterOS)
   - Copy project-specific adapter
   - Wire to UEF gateway
   - Done!

2. **Add more engines**
   - Clone existing engine
   - Customize for your use case
   - Register with UEF router
   - Done!

3. **Add more agents**
   - Create agent manifest
   - Register with ACP
   - Agents can now negotiate
   - Done!

4. **Scale execution**
   - UEF auto-scales with Cloud Run / K8s
   - Handle 1,000+ concurrent requests
   - Costs tracked in real-time

---

## Troubleshooting

### "Gateway returns 500 error"
```bash
gcloud functions logs read uef-gateway --limit=50
# Check for API key issues, Firestore connection, etc
```

### "Hallucination detection not working"
```bash
npm run test:ztdc -- --verbose
# Check if VL-JEPA embedding service is running
npm run start:embedding-service
```

### "KYB events not appearing"
```bash
npm run verify:firestore
# Confirm collections were created
npm run firebase:collections:init
```

### "Cost estimates way off"
```bash
# Review your LUC adapter component breakdown
# Compare estimated vs actual on dashboard
# Adjust multipliers based on feedback
npm run calibrate:luc
```

---

## Success Metrics to Monitor

After first 24 hours, check dashboard for:

| Metric | Target | Status |
| :--- | :--- | :--- |
| Execution success rate | >90% | — |
| Avg latency | <2.5s | — |
| Hallucination detection | >95% | — |
| Cost estimation accuracy | ±20% | — |
| 7-gate pass rate | >90% | — |
| User refund rate | <1% | — |

---

## You're Done! 🎉

You now have a **production-grade AI operating system** that:

✅ Never lets hallucinations escape  
✅ Tracks every penny spent  
✅ Proves everything was done correctly  
✅ Scales infinitely  
✅ Works with ANY LLM, ANY project, ANY agent  

**Next step:** Tell your team to start using it! 🚀

---

**UEF v2.0 — Deploy to Production in 4 Hours**
