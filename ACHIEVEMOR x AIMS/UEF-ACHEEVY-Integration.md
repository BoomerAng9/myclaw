# UEF → ACHEEVY Orchestrator Integration Map
## How to Wire UEF Into ACHEEVY

**Date:** January 18, 2026  
**Target:** ACHEEVY Agent Framework  
**Scope:** Plugging UEF core into ACHEEVY's orchestration layer

---

## Quick Map: UEF Components → ACHEEVY Components

| UEF Layer | ACHEEVY Component | Integration Point |
|-----------|-------------------|-------------------|
| **Layer 1: Ingress** | `ControlPlane` + `EventBus` | Route all agent requests through `StandardizedRequest` |
| **Layer 2: Router** | `Orchestrator` (task distribution) | Replace task routing with UEF Router |
| **Layer 3: Engines** | Agent Pods (CodeGen, Architect, etc.) | Each pod becomes UEF execution engine (LUC/ORACLE/ACP) |
| **Layer 4: Egress** | `ResultFormatter` | Return UEF-standard response + cost breakdown |
| **ZTDC** | `VerificationPipeline` | Add ZTDC gates to post-execution verification |
| **KYB** | `AuditLog` | Enhance with Flight Recorder entries |
| **VL-JEPA** | `HealthMonitoring` | Use embeddings for semantic health scoring |

---

## Step 1: Wrap ACHEEVY Requests in UEF

### Before (Current ACHEEVY)

```typescript
// ACHEEVY receives task directly
const task = {
  id: "task-123",
  agentId: "CodeGenerator",
  payload: {
    spec: "Build a REST API",
    language: "TypeScript"
  }
};

// Directly dispatch to agent pod
await orchestrator.dispatch(task);
```

### After (UEF-Wrapped)

```typescript
// 1. Convert ACHEEVY task to UEF request
const uefRequest = {
  requestId: task.id,
  userId: task.userId,
  action: "execute_build",  // UEF action
  payload: task.payload,
  metadata: {
    source: "ACHEEVY",
    locale: task.locale,
    tier: task.tier
  }
};

// 2. Route through UEF ingress gateway
const response = await UEFGateway.handle(uefRequest);

// 3. ACHEEVY gets back enhanced result
console.log({
  artifacts: response.data.artifacts,
  cost: response.cost,
  audit: response.audit,  // NEW: audit proof
  gates_passed: response.verification?.gates_passed
});
```

---

## Step 2: Map ACHEEVY Agents to ACP Manifests

### Agent 1: CodeGenerator → ACP Manifest

```typescript
// Current ACHEEVY CodeGenerator
class CodeGeneratorPod {
  async execute(spec: string): Promise<string> {
    // ... generates code
  }
}

// Convert to ACP Manifest
const CodeGeneratorManifest: ACPManifest = {
  agentId: "acheevy-codegen",
  name: "CodeGenerator",
  version: "2.0",
  
  capabilities: [
    {
      name: "generate_typescript_api",
      input_schema: {
        type: "object",
        properties: {
          spec: { type: "string" },
          language: { type: "string" }
        }
      },
      output_schema: {
        type: "object",
        properties: {
          code: { type: "string" },
          tests: { type: "string" }
        }
      },
      estimated_tokens: 8000,
      estimated_latency_ms: 15000
    }
  ],
  
  metrics: {
    successRate: 0.92,
    avgCostPer1kTokens: 0.015,
    avgLatencyMs: 12000
  },
  
  authentication: {
    type: "service_account",
    location: "secret/acheevy-codegen"
  },
  
  kyb_charter: {
    serialId: "ANG-ACHEEVY-CODEGEN-001",
    verificationBadges: {
      technical: true,
      security: true,
      ethics: true
    }
  }
};

// Register in ACP Registry
await ACPRegistry.registerAgent(CodeGeneratorManifest);
```

### Agent 2: Architect → ACP Manifest

```typescript
const ArchitectManifest: ACPManifest = {
  agentId: "acheevy-architect",
  name: "Architect",
  version: "2.0",
  
  capabilities: [
    {
      name: "design_system_architecture",
      input_schema: { /* requirements */ },
      output_schema: { /* architecture doc */ },
      estimated_tokens: 6000,
      estimated_latency_ms: 10000
    },
    {
      name: "evaluate_code_design",
      input_schema: { /* code + spec */ },
      output_schema: { /* design review */ },
      estimated_tokens: 4000,
      estimated_latency_ms: 8000
    }
  ],
  
  metrics: {
    successRate: 0.95,
    avgCostPer1kTokens: 0.012,
    avgLatencyMs: 9000
  },
  
  authentication: {
    type: "service_account",
    location: "secret/acheevy-architect"
  },
  
  kyb_charter: {
    serialId: "ANG-ACHEEVY-ARCHITECT-001",
    verificationBadges: {
      technical: true,
      security: true,
      ethics: true
    }
  }
};

await ACPRegistry.registerAgent(ArchitectManifest);
```

### Agent 3: QA → ACP Manifest

```typescript
const QAManifest: ACPManifest = {
  agentId: "acheevy-qa",
  name: "QA Specialist",
  
  capabilities: [
    {
      name: "generate_test_suite",
      input_schema: { /* source code */ },
      output_schema: { /* tests */ },
      estimated_tokens: 5000,
      estimated_latency_ms: 8000
    },
    {
      name: "verify_code_quality",
      input_schema: { /* code */ },
      output_schema: { /* quality report */ },
      estimated_tokens: 3000,
      estimated_latency_ms: 5000
    }
  ],
  
  // ... metrics, auth, charter
};

await ACPRegistry.registerAgent(QAManifest);
```

---

## Step 3: Enhance ACHEEVY with UEF Cost Calculator

### Create ACHEEVY LUC Adapter

```typescript
const ACHEEVY_LUCAdapter: LUCAdapter = {
  domain: "code_generation",
  
  componentBreakdown: {
    code_generation: {
      baseTokens: 5000,
      featureMultipliers: {
        multi_file: 1.5,
        testing: 1.3,
        documentation: 1.1,
        security: 1.4,
        api_integration: 1.2
      },
      scaleAdjustments: {
        simple: 1.0,
        moderate: 1.3,
        complex: 1.8,
        enterprise: 2.2
      }
    },
    
    architecture_design: {
      baseTokens: 4000,
      featureMultipliers: {
        distributed_system: 1.5,
        microservices: 1.3,
        event_driven: 1.2
      },
      scaleAdjustments: {
        single_service: 1.0,
        multi_service: 1.4,
        enterprise_scale: 1.8
      }
    },
    
    testing: {
      baseTokens: 3000,
      featureMultipliers: {
        integration_tests: 1.3,
        e2e_tests: 1.5,
        performance_tests: 1.2
      },
      scaleAdjustments: {
        basic: 1.0,
        comprehensive: 1.4
      }
    }
  },
  
  async estimateCost(spec: ACHEEVYSpec): Promise<CostEstimate> {
    // Parse spec
    const isMultiFile = spec.files.length > 5;
    const hasTests = spec.requiresTests;
    const isSecuritySensitive = spec.tags.includes("security");
    const complexity = spec.complexity || "moderate";
    
    // Calculate base
    let tokens = this.componentBreakdown.code_generation.baseTokens;
    
    // Apply multipliers
    if (isMultiFile) tokens *= this.componentBreakdown.code_generation.featureMultipliers.multi_file;
    if (hasTests) tokens *= this.componentBreakdown.code_generation.featureMultipliers.testing;
    if (isSecuritySensitive) tokens *= this.componentBreakdown.code_generation.featureMultipliers.security;
    
    // Apply scale adjustment
    tokens *= this.componentBreakdown.code_generation.scaleAdjustments[complexity];
    
    // Add buffer
    tokens = Math.ceil(tokens * 1.1);
    
    return {
      components: [
        {
          name: "Code Generation",
          baseTokens: 5000,
          adjustedTokens: tokens,
          costPerModel: {
            "GLM-4.7": (tokens / 1000000) * 5,
            "GPT-4o": (tokens / 1000000) * 15,
            "Gemini-2.0": (tokens / 1000000) * 8
          }
        }
      ],
      totalTokens: tokens,
      recommendedModel: "GLM-4.7"
    };
  }
};
```

---

## Step 4: Wire Agent Negotiation (ACP Protocol)

### Scenario: CodeGen Needs Architect's Help

```typescript
// CodeGenerator identifies it needs architectural guidance
async function executeWithNegotiation(spec: ACHEEVYSpec): Promise<string> {
  // Self-awareness: "This is complex, I need an architect"
  const complexity = analyzeComplexity(spec);
  
  if (complexity > 0.7) {
    // Step 1: Discover architect
    const architects = await ACPRegistry.listAgentsByCapability("design_system_architecture");
    const architectId = architects[0].agentId;  // acheevy-architect
    
    // Step 2: Send negotiation request
    const negotiation: ACPNegotiationRequest = {
      fromAgent: "acheevy-codegen",
      toAgent: architectId,
      task: {
        type: "evaluate_design",
        spec: spec,
        timeLimit: 30  // seconds
      },
      requestedDeadline: new Date(Date.now() + 30000),
      budget: 5000  // tokens
    };
    
    const response = await ACPRegistry.sendNegotiation(negotiation);
    
    if (response.status === "accepted") {
      // Architect has agreed
      console.log(`Architect accepted. EST tokens: ${response.estimatedTokens}`);
      
      // Proceed with architecture input
      const architecture = await getArchitectureRecommendation(spec);
      
      // Now generate code WITH architectural guidance
      const code = await generateCodeWithGuidance(spec, architecture);
      
      return code;
    } else if (response.status === "counteroffer") {
      // Architect wants different terms
      console.log(`Counteroffer: ${response.reason}`);
      // Handle counteroffer
    } else {
      // Architect rejected
      console.log(`Architect unavailable. Proceeding with default architecture.`);
      return generateCodeWithDefaults(spec);
    }
  }
  
  // Proceed normally if not complex enough
  return generateCodeDirectly(spec);
}
```

---

## Step 5: Integrate ZTDC Verification

### Add to ACHEEVY Verification Pipeline

```typescript
class ACHEEVYVerificationPipeline {
  async runVerification(code: string, spec: ACHEEVYSpec): Promise<VerificationResult> {
    const results = {
      gates: {} as any,
      summary: ""
    };
    
    // Gate 1: Technical (existing)
    results.gates.technical = await runLinter(code) && await runTests(code);
    
    // Gate 2: ZTDC Hallucination Detection (NEW)
    const hallucination = await runZTDCDetection(spec, code);
    results.gates.hallucination = hallucination.likelihood < 0.1;
    
    if (!results.gates.hallucination) {
      console.warn(`Hallucination detected! Score: ${hallucination.likelihood}`);
      console.warn(`Signals: ${hallucination.signals.map(s => s.type).join(", ")}`);
      
      // Refund if serious hallucination
      if (hallucination.shouldRefund) {
        await applyRefund(spec.userId, spec.cost);
        results.summary = "HALLUCINATORY - USER REFUNDED";
      }
    }
    
    // Gate 3: Judge LLM (NEW)
    const judge = await runJudgeVerification(spec, code);
    results.gates.judge = judge.approved;
    
    // Gate 4: Semantic Consistency (VL-JEPA, NEW)
    const semantic = await verifySemanticConsistency(spec, code);
    results.gates.semantic = semantic.consistent;
    
    // Gate 5: Security (existing)
    results.gates.security = await runSecurityScan(code);
    
    // Summary
    const allPass = Object.values(results.gates).every(v => v);
    results.summary = allPass ? "ALL_GATES_PASSED" : "GATES_FAILED";
    
    return results;
  }
}

// Integrate into ACHEEVY's finalization
async function finalizeACHEEVYExecution(code: string, spec: ACHEEVYSpec): Promise<void> {
  const pipeline = new ACHEEVYVerificationPipeline();
  const verification = await pipeline.runVerification(code, spec);
  
  if (verification.summary === "ALL_GATES_PASSED") {
    // Log to KYB Flight Recorder
    await KYBFlightRecorder.logEntry({
      timestamp: new Date().toISOString(),
      eventId: generateId(),
      requestId: spec.requestId,
      userId: spec.userId,
      action: {
        type: "code_generation",
        agentId: "acheevy-codegen"
      },
      input: {
        hash: sha256(JSON.stringify(spec)),
        type: "spec",
        size: JSON.stringify(spec).length
      },
      output: {
        hash: sha256(code),
        type: "source",
        size: code.length
      },
      verification: {
        gates_passed: Object.values(verification.gates).filter(v => v).length,
        gates_failed: Object.values(verification.gates).filter(v => !v).length,
        hallucination_score: 0.02,  // example
        gates: verification.gates
      },
      cost: {
        tokens: spec.estimatedTokens,
        usdCost: spec.estimatedTokens * 0.000015,
        duration: spec.duration
      }
    });
    
    // Emit completion beacon
    await pubsub.publish("BUILD_COMPLETE", {
      requestId: spec.requestId,
      status: "SUCCESS",
      deliverables: [code]
    });
  }
}
```

---

## Step 6: Create ACHEEVY UEF Response Formatter

```typescript
async function formatACHEEVYResponse(
  execution: ExecutionResult,
  originalSpec: ACHEEVYSpec,
  verification: VerificationResult
): Promise<ACHEEVYResponse> {
  return {
    // Existing ACHEEVY fields
    requestId: originalSpec.requestId,
    status: verification.summary === "ALL_GATES_PASSED" ? "SUCCESS" : "FAILED",
    artifacts: execution.artifacts,
    executionTime: execution.duration,
    
    // NEW: UEF fields
    cost: {
      tokens: execution.cost.tokens,
      usd: execution.cost.usd,
      breakdown: {
        code_generation: execution.cost.usd * 0.7,
        verification: execution.cost.usd * 0.2,
        infrastructure: execution.cost.usd * 0.1
      }
    },
    
    audit: {
      requestId: execution.requestId,
      executionId: execution.executionId,
      timestamp: new Date().toISOString(),
      verification_status: verification.summary,
      gates_passed: verification.gates
    },
    
    gates: {
      technical: verification.gates.technical,
      hallucination: verification.gates.hallucination,
      judge: verification.gates.judge,
      semantic: verification.gates.semantic,
      security: verification.gates.security,
      all_passed: Object.values(verification.gates).every(v => v)
    },
    
    kyb_proof: {
      flightRecorderId: execution.kyb_proof,
      anchor: {
        batchId: execution.anchor?.batchId,
        merkleRoot: execution.anchor?.merkleRoot
      }
    }
  };
}
```

---

## Implementation Checklist

- [ ] **Week 1**: Wrap ACHEEVY requests in UEF format
- [ ] **Week 2**: Convert all agents to ACP manifests + register in ACPRegistry
- [ ] **Week 3**: Integrate LUC cost calculator for ACHEEVY specs
- [ ] **Week 4**: Add ACP negotiation between CodeGen & Architect
- [ ] **Week 5**: Wire ZTDC hallucination detection into verification pipeline
- [ ] **Week 6**: Integrate VL-JEPA semantic verification
- [ ] **Week 7**: Set up KYB Flight Recorder logging
- [ ] **Week 8**: Launch with A/B testing (50% UEF, 50% Legacy)
- [ ] **Week 9**: Full migration to UEF
- [ ] **Week 10**: Monitor KPIs (success rate, hallucination rate, cost accuracy)

---

## Success Metrics for ACHEEVY + UEF

| Metric | Target | Current (Pre-UEF) |
| :--- | :--- | :--- |
| Code generation success rate | >90% | 85% |
| Hallucination detection rate | >95% | N/A (no detection) |
| Cost estimation accuracy | ±15% | ±30% |
| End-to-end latency | <20s | 18s |
| Security vulnerability rate | 0/month | 2/month |
| User refund requests | <1% | 5% |

---

## Next Steps

1. **Clone this guide** and adapt for your ACHEEVY instance
2. **Start with Week 1**: Wrap requests
3. **Test with CodeGen agent** first (lowest risk)
4. **Gradually add other agents** (Architect, QA)
5. **Launch internal beta** before production

Good luck! 🚀
