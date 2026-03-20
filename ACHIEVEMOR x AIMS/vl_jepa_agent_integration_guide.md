# VL-JEPA Embedding Integration Guide for Locale Agents & Agentic Workflows

## Executive Summary

This guide shows **how to integrate VL-JEPA semantic embeddings into your entire agent ecosystem**—including ACHEEVY, AI agents (Researcher, II-Agent, BoomerAng specialists), and all agentic tools and workflows—so that:

- **Agents perceive semantically** instead of processing raw pixels/tokens
- **Health monitoring works across modalities** (vision + text + voice)
- **Tag-team rotation** is powered by embedding consistency, not just token metrics
- **Hallucination detection** happens at the semantic level (embeddings), with per-user refund reserves
- **All agent types** (from simple classifiers to complex reasoners) can tap embeddings as a shared "semantic substrate"

This is **one unified embedding layer** that powers health scoring, refunds, agent communication, and real-time perception across the entire platform.

---

## Part 1: The Embedding Foundation

### 1.1 What VL-JEPA Embeddings Provide

VL-JEPA produces **1,536-dimensional semantic embeddings** that represent meaning, not tokens. Each embedding:

- Encodes visual content (images, video frames, documents)
- Encodes textual queries/instructions
- Encodes agent responses and reasoning states
- Is **directly comparable** via cosine similarity (unlike token logits)
- Is **stable over time** (small perturbations → nearby embeddings)

**Key property:** Embeddings are **agent-agnostic**. Whether a Gemini agent, Claude agent, or custom reasoning engine produces an output, VL-JEPA can embed it into the shared semantic space. This makes embeddings the **lingua franca** for agent communication and health monitoring.

### 1.2 Embedding Storage in Firestore

All embeddings are stored in a shared Firestore collection:

```typescript
// types/embeddings.ts
export interface SemanticEmbedding {
  id: string;
  taskId: string;
  userId: string;
  workspaceId: string;
  
  // Source of embedding
  sourceType: 'vision' | 'text' | 'agent_output' | 'voice_transcript';
  sourceId?: string; // Reference to original (imageUrl, responseId, etc)
  
  // The embedding (1536-dim vector)
  embedding: number[];
  
  // Metadata for querying
  query?: string; // What was asked (if text-based)
  modelTierId: 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5';
  agentId?: string; // Which agent produced this
  
  // Timestamps & markers
  createdAt: Timestamp;
  semanticShift?: number; // 0-1 variance from prior embeddings
  hallucinationFlag?: boolean; // Detected anomaly?
  refundedAmount?: number; // If refunded, how much?
  
  // For selective decoding
  shouldDecode?: boolean; // Was this decoded to text, or kept as embedding?
  decodedText?: string; // If decoded, what was the output?
}

// Firestore collection: semanticEmbeddings/{taskId}/frames/{embeddingId}
```

**Index strategy:**
- Composite index: `(taskId, createdAt)` for timeline queries
- Composite index: `(userId, createdAt)` for per-user analytics
- Composite index: `(workspaceId, modelTierId, hallucinationFlag)` for refund audits
- Vector index (future): For semantic search via similarity queries

---

## Part 2: Integration with ACHEEVY

ACHEEVY is your orchestrator for agent management. Here's how embeddings integrate:

### 2.1 ACHEEVY Health Monitoring Loop

**Current flow (token-based):**
```
Agent runs → Generate response → Count tokens, check coherence → Health score
```

**New flow (embedding-based):**
```
Agent runs → Generate response → Embed response via VL-JEPA → Compute embedding drift → Enhanced health score
```

**Implementation:**

```typescript
// lib/acheevy-embeddings.ts
import { VLJEPAClient } from './vl-jepa-client'; // Cloud Run service

export interface AchievyEmbeddingContext {
  taskId: string;
  agentId: string;
  modelTier: ModelTier;
  responseText: string;
  priorEmbeddings?: number[][]; // Previous responses in this task
}

export async function embedAgentResponse(
  context: AchievyEmbeddingContext
): Promise<SemanticEmbedding> {
  const vlJepa = new VLJEPAClient();
  
  // Step 1: Embed the agent's response
  const embedding = await vlJepa.embed({
    text: context.responseText,
    modelTier: context.modelTier,
  });
  
  // Step 2: Compute semantic drift (if prior responses exist)
  let semanticShift = 0;
  if (context.priorEmbeddings && context.priorEmbeddings.length > 0) {
    const similarities = context.priorEmbeddings.map(prior =>
      cosineSimilarity(embedding.embedding, prior)
    );
    const avgSimilarity = similarities.reduce((a, b) => a + b) / similarities.length;
    semanticShift = 1 - avgSimilarity; // 0 = identical, 1 = completely different
  }
  
  // Step 3: Store in Firestore
  const docRef = db
    .collection('semanticEmbeddings')
    .doc(context.taskId)
    .collection('frames')
    .doc();
  
  const semanticEmbedding: SemanticEmbedding = {
    id: docRef.id,
    taskId: context.taskId,
    userId: /* extracted from context */,
    workspaceId: /* extracted from context */,
    sourceType: 'agent_output',
    sourceId: context.agentId,
    embedding: embedding.embedding,
    modelTierId: context.modelTier,
    agentId: context.agentId,
    createdAt: Timestamp.now(),
    semanticShift,
    hallucinationFlag: false, // Will be set by health scorer
  };
  
  await docRef.set(semanticEmbedding);
  
  return semanticEmbedding;
}

// Helper: Cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, x, i) => sum + x * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, x) => sum + x * x, 0));
  const magB = Math.sqrt(b.reduce((sum, x) => sum + x * x, 0));
  return dotProduct / (magA * magB);
}
```

### 2.2 Enhanced Health Scoring (ACHEEVY Integration)

Now ACHEEVY's health scoring includes embeddings:

```typescript
// lib/agent-health.ts (UPDATED)
export interface AgentHealthScore {
  overall: number; // 0-1
  coherence: number; // Repeating patterns (token-based)
  factualAccuracy: number; // Claims verification
  contextRetention: number; // Memory across turns
  tokenEfficiency: number; // Value per token
  timeHealth: number; // Timeout proximity
  semanticStability: number; // NEW: Embedding drift
}

export async function calculateHealthScore(
  taskId: string,
  agentId: string
): Promise<AgentHealthScore> {
  // Fetch prior embeddings for this task
  const embeddings = await db
    .collection('semanticEmbeddings')
    .doc(taskId)
    .collection('frames')
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get();
  
  const embeddingList = embeddings.docs.map(doc => doc.data() as SemanticEmbedding);
  
  // Compute semantic stability (lower = more drift = worse)
  let semanticStability = 0.9; // Default: good
  if (embeddingList.length > 1) {
    const drifts = embeddingList
      .slice(0, -1) // All but last
      .map(e => e.semanticShift || 0);
    
    const avgDrift = drifts.reduce((a, b) => a + b, 0) / drifts.length;
    semanticStability = 1 - Math.min(avgDrift, 1); // Invert: high drift = low stability
  }
  
  // Existing metrics (unchanged)
  const coherence = measureCoherence(/* ... */);
  const factualAccuracy = measureFactualAccuracy(/* ... */);
  const contextRetention = measureContextRetention(/* ... */);
  const tokenEfficiency = measureTokenEfficiency(/* ... */);
  const timeHealth = measureTimeHealth(/* ... */);
  
  // Weighted average: embeddings are 20% of score (new signal)
  const weights = {
    coherence: 0.2,
    factualAccuracy: 0.2,
    contextRetention: 0.15,
    tokenEfficiency: 0.15,
    timeHealth: 0.15,
    semanticStability: 0.15, // NEW
  };
  
  const overall =
    weights.coherence * coherence +
    weights.factualAccuracy * factualAccuracy +
    weights.contextRetention * contextRetention +
    weights.tokenEfficiency * tokenEfficiency +
    weights.timeHealth * timeHealth +
    weights.semanticStability * semanticStability;
  
  return {
    overall,
    coherence,
    factualAccuracy,
    contextRetention,
    tokenEfficiency,
    timeHealth,
    semanticStability, // NEW
  };
}
```

### 2.3 ACHEEVY Voice Integration

ACHEEVY already handles Deepgram (STT) + ElevenLabs (TTS). Now add embeddings:

```typescript
// lib/acheevy-voice-embeddings.ts
export async function processVoiceWithEmbeddings(
  taskId: string,
  audioBuffer: Buffer
): Promise<{
  transcript: string;
  embedding: number[];
  semanticEmbedding: SemanticEmbedding;
}> {
  // Step 1: Transcribe via Deepgram (existing)
  const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);
  const { results } = await deepgram.transcription.preRecorded({
    buffer: audioBuffer,
    mimetype: 'audio/wav',
  });
  
  const transcript = results.channels[0].alternatives[0].transcript;
  
  // Step 2: Embed the transcript via VL-JEPA (NEW)
  const vlJepa = new VLJEPAClient();
  const embedding = await vlJepa.embed({
    text: transcript,
    modelTier: 'tier3', // Default for voice queries
  });
  
  // Step 3: Store embedding
  const semanticEmbedding = await embedAgentResponse({
    taskId,
    agentId: 'voice-input',
    modelTier: 'tier3',
    responseText: transcript,
  });
  
  return {
    transcript,
    embedding: embedding.embedding,
    semanticEmbedding,
  };
}

// When generating voice response (ElevenLabs TTS)
export async function generateVoiceWithEmbeddings(
  taskId: string,
  responseText: string,
  voiceId: string = 'ACHEEVY_DEFAULT'
): Promise<{
  audioUrl: string;
  embedding: number[];
}> {
  // Step 1: Generate audio via ElevenLabs (existing)
  const elevenlabs = new ElevenLabs(process.env.ELEVENLABS_API_KEY);
  const audio = await elevenlabs.generate({
    text: responseText,
    voice_id: voiceId,
  });
  
  // Step 2: Embed the response text via VL-JEPA (NEW)
  const vlJepa = new VLJEPAClient();
  const embedding = await vlJepa.embed({
    text: responseText,
    modelTier: 'tier3',
  });
  
  // Step 3: Store embedding for health monitoring
  await embedAgentResponse({
    taskId,
    agentId: 'voice-output',
    modelTier: 'tier3',
    responseText,
  });
  
  return {
    audioUrl: audio.url,
    embedding: embedding.embedding,
  };
}
```

---

## Part 3: Integration with AI Agents (Researcher, II-Agent, BoomerAng Specialists)

### 3.1 Agent Initialization with Embedding Context

When spawning an agent, pass embedding context:

```typescript
// lib/agent-factory.ts
export interface AgentInitConfig {
  taskId: string;
  userId: string;
  agentType: 'researcher' | 'ii-agent' | 'boomerang-specialist';
  modelTier: ModelTier;
  query: string;
  priorEmbeddings?: number[][]; // Semantic context from prior work
}

export async function initializeAgent(
  config: AgentInitConfig
): Promise<Agent> {
  const vlJepa = new VLJEPAClient();
  
  // Step 1: Embed the user query
  const queryEmbedding = await vlJepa.embed({
    text: config.query,
    modelTier: config.modelTier,
  });
  
  // Step 2: Compute semantic distance to prior work
  let semanticContext = '';
  if (config.priorEmbeddings && config.priorEmbeddings.length > 0) {
    const similarities = config.priorEmbeddings.map(prior =>
      cosineSimilarity(queryEmbedding.embedding, prior)
    );
    const avgSimilarity = similarities.reduce((a, b) => a + b) / similarities.length;
    
    if (avgSimilarity > 0.8) {
      semanticContext = '(SIMILAR to prior work—consider continuity)';
    } else if (avgSimilarity < 0.5) {
      semanticContext = '(DIVERGENT from prior work—fresh perspective needed)';
    }
  }
  
  // Step 3: Pass embedding + context to agent initialization
  const agent = await spawnAgent({
    type: config.agentType,
    modelTier: config.modelTier,
    systemPrompt: `You are a ${config.agentType} agent.\nQuery: ${config.query}\n${semanticContext}`,
    embeddingContext: {
      queryEmbedding: queryEmbedding.embedding,
      taskId: config.taskId,
      userId: config.userId,
    },
  });
  
  return agent;
}

async function spawnAgent(opts: {
  type: string;
  modelTier: ModelTier;
  systemPrompt: string;
  embeddingContext: any;
}): Promise<Agent> {
  // Call GCP Cloud Run service for agent (Researcher, II-Agent, etc)
  const response = await fetch(
    `${process.env.GCP_CLOUD_RUN_AGENT_URL}/init`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: opts.type,
        modelTier: opts.modelTier,
        systemPrompt: opts.systemPrompt,
        embeddingContext: opts.embeddingContext, // NEW: Pass embedding context
      }),
    }
  );
  
  const agentData = await response.json();
  return new Agent(agentData);
}
```

### 3.2 Agent Response Embedding & Streaming

Embed agent outputs in real-time:

```typescript
// lib/agent-stream-embeddings.ts
export async function streamAgentResponseWithEmbeddings(
  taskId: string,
  agent: Agent,
  onChunk?: (text: string) => void,
  onEmbedding?: (embedding: SemanticEmbedding) => void
) {
  const vlJepa = new VLJEPAClient();
  let fullResponse = '';
  const embeddingBuffer: SemanticEmbedding[] = [];
  
  // Stream response from agent
  const stream = await agent.execute();
  
  for await (const chunk of stream) {
    fullResponse += chunk.text;
    
    // Callback for streaming UI
    if (onChunk) onChunk(chunk.text);
    
    // Every 2-3 sentences, compute partial embedding (for streaming updates)
    if (fullResponse.split('\n').length % 3 === 0) {
      const partialEmbedding = await vlJepa.embed({
        text: fullResponse,
        modelTier: agent.modelTier,
      });
      
      const embedding: SemanticEmbedding = {
        id: generateId(),
        taskId,
        userId: agent.userId,
        workspaceId: agent.workspaceId,
        sourceType: 'agent_output',
        sourceId: agent.id,
        embedding: partialEmbedding.embedding,
        modelTierId: agent.modelTier,
        agentId: agent.id,
        createdAt: Timestamp.now(),
        shouldDecode: false, // Keep as embedding
      };
      
      embeddingBuffer.push(embedding);
      
      // Callback for real-time embedding updates
      if (onEmbedding) onEmbedding(embedding);
    }
  }
  
  // Final full response embedding
  const finalEmbedding = await vlJepa.embed({
    text: fullResponse,
    modelTier: agent.modelTier,
  });
  
  const finalSemanticEmbedding: SemanticEmbedding = {
    id: generateId(),
    taskId,
    userId: agent.userId,
    workspaceId: agent.workspaceId,
    sourceType: 'agent_output',
    sourceId: agent.id,
    embedding: finalEmbedding.embedding,
    modelTierId: agent.modelTier,
    agentId: agent.id,
    createdAt: Timestamp.now(),
    decodedText: fullResponse,
    shouldDecode: true,
  };
  
  // Batch store all embeddings
  await storeBatchEmbeddings([...embeddingBuffer, finalSemanticEmbedding]);
  
  return {
    response: fullResponse,
    finalEmbedding: finalSemanticEmbedding,
    streamingEmbeddings: embeddingBuffer,
  };
}
```

---

## Part 4: Tag-Team Rotation Powered by Embeddings

### 4.1 Embedding-Based Tap-Out Detection

Instead of just checking health score < 0.65, also check **embedding instability**:

```typescript
// lib/embedding-tap-out.ts
export async function detectTapOutViaEmbeddings(
  taskId: string,
  agentId: string,
  healthScore: AgentHealthScore
): Promise<{
  shouldTapOut: boolean;
  reason: string;
  confidence: number;
}> {
  // Fetch recent embeddings
  const embeddings = await db
    .collection('semanticEmbeddings')
    .doc(taskId)
    .collection('frames')
    .where('sourceId', '==', agentId)
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get();
  
  const embeddingList = embeddings.docs.map(doc => doc.data() as SemanticEmbedding);
  
  if (embeddingList.length < 2) {
    // Not enough data yet
    return { shouldTapOut: false, reason: 'Insufficient embeddings', confidence: 0 };
  }
  
  // Compute semantic instability
  const drifts = embeddingList
    .slice(0, -1)
    .map((e, i) =>
      1 - cosineSimilarity(e.embedding, embeddingList[i + 1].embedding)
    );
  
  const avgDrift = drifts.reduce((a, b) => a + b, 0) / drifts.length;
  const maxDrift = Math.max(...drifts);
  
  // Decision tree
  if (healthScore.overall < 0.65) {
    return {
      shouldTapOut: true,
      reason: `Health score low (${healthScore.overall.toFixed(2)})`,
      confidence: 0.95,
    };
  }
  
  if (maxDrift > 0.7) {
    // One huge semantic jump → likely hallucination or mode collapse
    return {
      shouldTapOut: true,
      reason: `Semantic instability detected (max drift: ${maxDrift.toFixed(2)})`,
      confidence: 0.8,
    };
  }
  
  if (avgDrift > 0.5 && healthScore.semanticStability < 0.6) {
    return {
      shouldTapOut: true,
      reason: `Sustained semantic drift + low stability`,
      confidence: 0.75,
    };
  }
  
  return { shouldTapOut: false, reason: 'Agent stable', confidence: 1.0 };
}
```

### 4.2 Smart Model Selection via Embeddings

When rotating to a new agent, pick one that **complements the semantic context**:

```typescript
// lib/smart-model-rotation.ts
export async function selectNextAgent(
  taskId: string,
  currentAgent: Agent,
  priorEmbeddings: SemanticEmbedding[]
): Promise<{ modelTier: ModelTier; agentType: string }> {
  const vlJepa = new VLJEPAClient();
  
  // Compute "semantic fingerprint" of prior work
  const avgEmbedding = averageEmbeddings(priorEmbeddings.map(e => e.embedding));
  
  // Query available agents by model tier
  const agents = [
    { tier: 'tier1', type: 'classifier' }, // Fast, cheap
    { tier: 'tier2', type: 'reasoner' }, // Medium, reasoning
    { tier: 'tier3', type: 'ii-agent' }, // Balanced, production
    { tier: 'tier4', type: 'researcher' }, // Premium, deep analysis
  ];
  
  // Score each agent's "semantic specialization"
  const scores = await Promise.all(
    agents.map(async agent => {
      const agentDescEmbed = await vlJepa.embed({
        text: `This agent is a ${agent.type} specialized in ${agent.tier} tasks`,
        modelTier: agent.tier as ModelTier,
      });
      
      const sim = cosineSimilarity(avgEmbedding, agentDescEmbed.embedding);
      return { agent, similarity: sim };
    })
  );
  
  // Pick the agent most dissimilar from current work (fresh perspective)
  // or most similar if we need continuity
  const bestAgent = scores.reduce((best, curr) =>
    curr.similarity < best.similarity ? curr : best // Lower sim = fresher
  );
  
  return {
    modelTier: bestAgent.agent.tier as ModelTier,
    agentType: bestAgent.agent.type,
  };
}

// Helper: Average embeddings
function averageEmbeddings(embeddings: number[][]): number[] {
  const dim = embeddings[0].length;
  const avg = new Array(dim).fill(0);
  
  for (const emb of embeddings) {
    for (let i = 0; i < dim; i++) {
      avg[i] += emb[i];
    }
  }
  
  return avg.map(v => v / embeddings.length);
}
```

---

## Part 5: Hallucination Detection & Refunds via Embeddings

### 5.1 Embedding-Based Hallucination Scoring

Compare agent output embeddings to known-good references:

```typescript
// lib/embedding-hallucination-detection.ts
export interface HallucinationSignal {
  type: 'semantic_mismatch' | 'context_drift' | 'rephrasing_pattern';
  score: number; // 0-1
  evidence: string;
}

export async function detectHallucinationViaEmbeddings(
  taskId: string,
  agentResponse: string,
  agentEmbedding: number[],
  originalQuery: string,
  originalQueryEmbedding: number[]
): Promise<{
  hallucinationLikelihood: number;
  signals: HallucinationSignal[];
  shouldRefund: boolean;
}> {
  const signals: HallucinationSignal[] = [];
  
  // Signal 1: Semantic mismatch with query
  const queryResponseSim = cosineSimilarity(
    originalQueryEmbedding,
    agentEmbedding
  );
  
  if (queryResponseSim < 0.4) {
    signals.push({
      type: 'semantic_mismatch',
      score: 1 - queryResponseSim,
      evidence: `Response is semantically distant from query (similarity: ${queryResponseSim.toFixed(2)})`,
    });
  }
  
  // Signal 2: Context drift (comparison to prior valid responses)
  const priorValid = await db
    .collection('semanticEmbeddings')
    .doc(taskId)
    .collection('frames')
    .where('refundedAmount', '==', undefined) // Not refunded = valid
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get();
  
  if (priorValid.docs.length > 0) {
    const validEmbeddings = priorValid.docs.map(
      doc => (doc.data() as SemanticEmbedding).embedding
    );
    
    const avgValidEmbedding = averageEmbeddings(validEmbeddings);
    const validContextSim = cosineSimilarity(agentEmbedding, avgValidEmbedding);
    
    if (validContextSim < 0.3) {
      signals.push({
        type: 'context_drift',
        score: 1 - validContextSim,
        evidence: `Response diverges from established context (similarity: ${validContextSim.toFixed(2)})`,
      });
    }
  }
  
  // Signal 3: Repetition pattern (same embeddings appearing frequently)
  const taskEmbeddings = await db
    .collection('semanticEmbeddings')
    .doc(taskId)
    .collection('frames')
    .orderBy('createdAt', 'desc')
    .limit(3)
    .get();
  
  const recentEmbeddings = taskEmbeddings.docs.map(
    doc => (doc.data() as SemanticEmbedding).embedding
  );
  
  const selfSimilarities = recentEmbeddings.map(emb =>
    cosineSimilarity(agentEmbedding, emb)
  );
  
  const rephraseScore = selfSimilarities.filter(sim => sim > 0.95).length /
    selfSimilarities.length;
  
  if (rephraseScore > 0.5) {
    signals.push({
      type: 'rephrasing_pattern',
      score: rephraseScore,
      evidence: `Agent repeating similar content (${(rephraseScore * 100).toFixed(0)}% of recent responses)`,
    });
  }
  
  // Final score: weighted combination
  const hallucinationLikelihood =
    (signals[0]?.score || 0) * 0.4 +
    (signals[1]?.score || 0) * 0.3 +
    (signals[2]?.score || 0) * 0.3;
  
  return {
    hallucinationLikelihood,
    signals,
    shouldRefund: hallucinationLikelihood > 0.6,
  };
}
```

### 5.2 Embedding-Aware Refund Processing

Update refund logic to include embedding evidence:

```typescript
// api/refunds.ts (UPDATED)
export async function processRefundWithEmbeddings(taskId: string) {
  const ledger = await getProfitLedger(taskId);
  const embedding = await getTaskEmbedding(taskId);
  
  if (ledger.refunded) return; // Already refunded
  
  // Get hallucination signals
  const hallucinationSignals = await detectHallucinationViaEmbeddings(
    taskId,
    ledger.lastResponse,
    embedding.embedding,
    ledger.originalQuery,
    ledger.queryEmbedding
  );
  
  // Only refund if strong evidence
  if (hallucinationSignals.hallucinationLikelihood < 0.6) {
    return { refunded: false, reason: 'Insufficient evidence' };
  }
  
  // Deduct from user's reserve
  const user = await getUser(ledger.userId);
  const refundAmount = ledger.reserveAmount;
  
  user.reserveBalance -= refundAmount;
  
  // Log with embedding evidence
  await logTransaction({
    userId: user.id,
    type: 'refund',
    amount: refundAmount,
    reason: 'hallucination_detected',
    taskId,
    embeddingEvidence: {
      hallucinationLikelihood: hallucinationSignals.hallucinationLikelihood,
      signals: hallucinationSignals.signals,
    },
    timestamp: new Date(),
  });
  
  // Daily audit
  await auditReserves();
  
  return { refunded: true, amount: refundAmount };
}
```

---

## Part 6: Real-Time Agent Communication via Embeddings

### 6.1 Inter-Agent Embedding Passing

When one agent needs to hand off to another, pass embeddings instead of raw text (faster, semantically cleaner):

```typescript
// lib/agent-communication.ts
export async function passContextBetweenAgents(
  sourceAgent: Agent,
  targetAgent: Agent,
  contextEmbedding: number[],
  contextText?: string
): Promise<void> {
  // Method 1: Pure embedding handoff (fast)
  const contextPayload = {
    embedding: contextEmbedding,
    embeddingDim: contextEmbedding.length,
    sourceAgentId: sourceAgent.id,
    timestamp: Date.now(),
  };
  
  // Store as Firestore document for async retrieval
  await db
    .collection('agentContext')
    .doc(sourceAgent.taskId)
    .update({
      contextEmbedding: contextPayload,
      lastUpdated: Timestamp.now(),
    });
  
  // Method 2: Hybrid (embedding + optional text for explainability)
  if (contextText) {
    const fullContext = {
      text: contextText,
      embedding: contextEmbedding,
      summary: await generateSummaryFromEmbedding(contextEmbedding),
    };
    
    await db
      .collection('agentContext')
      .doc(sourceAgent.taskId)
      .update({
        contextHybrid: fullContext,
        lastUpdated: Timestamp.now(),
      });
  }
  
  // Notify target agent
  targetAgent.onContextReceived(contextPayload);
}

async function generateSummaryFromEmbedding(
  embedding: number[]
): Promise<string> {
  // Use a lightweight decoder to convert embedding → summary
  const vlJepa = new VLJEPAClient();
  const summary = await vlJepa.decode({
    embedding,
    maxTokens: 50,
  });
  return summary;
}
```

### 6.2 Semantic Task Queuing

Agents query by semantic similarity (not just task type):

```typescript
// lib/semantic-task-queue.ts
export async function enqueueTaskWithSemantic(
  query: string,
  userId: string
): Promise<void> {
  const vlJepa = new VLJEPAClient();
  
  // Embed the query
  const queryEmbedding = await vlJepa.embed({
    text: query,
    modelTier: 'tier2',
  });
  
  // Find most semantically relevant agent
  const agents = await getAvailableAgents();
  
  const agentSpecializations = await Promise.all(
    agents.map(async agent => {
      const specEmbed = await vlJepa.embed({
        text: agent.specialization, // e.g., "Document analysis and OCR"
        modelTier: 'tier2',
      });
      
      const similarity = cosineSimilarity(
        queryEmbedding.embedding,
        specEmbed.embedding
      );
      
      return { agent, similarity };
    })
  );
  
  // Assign to most relevant agent
  const bestAgent = agentSpecializations.reduce((best, curr) =>
    curr.similarity > best.similarity ? curr : best
  );
  
  // Enqueue
  await db
    .collection('taskQueue')
    .add({
      query,
      queryEmbedding: queryEmbedding.embedding,
      assignedAgentId: bestAgent.agent.id,
      userId,
      semanticScore: bestAgent.similarity,
      createdAt: Timestamp.now(),
    });
}
```

---

## Part 7: Digital Transformation Vertical Integration

### 7.1 Document Embedding Pipeline

Documents are embedded on upload for instant semantic search:

```typescript
// lib/document-embeddings.ts
export async function processDocumentWithEmbeddings(
  file: File,
  workspaceId: string
): Promise<{
  documentId: string;
  pageEmbeddings: SemanticEmbedding[];
  searchUrl: string;
}> {
  const vlJepa = new VLJEPAClient();
  
  // Step 1: Upload to GCS
  const gcsPath = await uploadToGCS(file, workspaceId);
  
  // Step 2: Extract pages (if PDF)
  const pages = await extractPages(gcsPath);
  
  // Step 3: Embed each page
  const pageEmbeddings: SemanticEmbedding[] = [];
  
  for (let i = 0; i < pages.length; i++) {
    const pageImage = pages[i]; // Rendered page as image
    
    // Embed the page image
    const pageEmbed = await vlJepa.embed({
      image: pageImage,
      modelTier: 'tier3',
    });
    
    const semanticEmb: SemanticEmbedding = {
      id: generateId(),
      taskId: file.name, // Document name as task ID
      userId: /* from context */,
      workspaceId,
      sourceType: 'vision',
      sourceId: gcsPath,
      embedding: pageEmbed.embedding,
      modelTierId: 'tier3',
      createdAt: Timestamp.now(),
    };
    
    pageEmbeddings.push(semanticEmb);
    
    // Store in Firestore
    await db
      .collection('documentEmbeddings')
      .doc(workspaceId)
      .collection('documents')
      .doc(file.name)
      .collection('pages')
      .doc(`page-${i}`)
      .set(semanticEmb);
  }
  
  // Step 4: Create search index (Algolia + Firestore vector index)
  await indexDocumentForSearch(file.name, workspaceId, pageEmbeddings);
  
  return {
    documentId: file.name,
    pageEmbeddings,
    searchUrl: `${process.env.APP_URL}/search?doc=${file.name}`,
  };
}
```

### 7.2 Semantic Document Search

Search documents by meaning, not keywords:

```typescript
// lib/semantic-document-search.ts
export async function searchDocumentsBySemantic(
  query: string,
  workspaceId: string,
  limit: number = 5
): Promise<SearchResult[]> {
  const vlJepa = new VLJEPAClient();
  
  // Embed the search query
  const queryEmbed = await vlJepa.embed({
    text: query,
    modelTier: 'tier2',
  });
  
  // Fetch all document page embeddings for workspace
  const docs = await db
    .collection('documentEmbeddings')
    .doc(workspaceId)
    .collection('documents')
    .get();
  
  const allPages: Array<{
    docName: string;
    pageNum: number;
    embedding: SemanticEmbedding;
  }> = [];
  
  for (const docSnap of docs.docs) {
    const pages = await docSnap.ref.collection('pages').get();
    for (const pageSnap of pages.docs) {
      allPages.push({
        docName: docSnap.id,
        pageNum: parseInt(pageSnap.id.split('-')[1]),
        embedding: pageSnap.data() as SemanticEmbedding,
      });
    }
  }
  
  // Compute similarities
  const scored = allPages.map(page => ({
    ...page,
    similarity: cosineSimilarity(
      queryEmbed.embedding,
      page.embedding.embedding
    ),
  }));
  
  // Sort by similarity, return top-k
  return scored
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(result => ({
      documentName: result.docName,
      pageNumber: result.pageNum,
      similarity: result.similarity,
      url: `/workspace/${workspaceId}/document/${result.docName}/page/${result.pageNum}`,
    }));
}
```

---

## Part 8: Monitoring & Observability

### 8.1 Embedding Health Dashboard

Track embedding metrics across all agents:

```typescript
// api/admin/embedding-health.ts
export async function getEmbeddingHealthMetrics(
  workspaceId: string,
  timeWindow: '24h' | '7d' | '30d' = '24h'
): Promise<{
  totalEmbeddingsGenerated: number;
  avgEmbeddingLatency: number;
  hallucinationDetectionRate: number;
  semanticStabilityScore: number;
  agentMetrics: Record<string, any>;
}> {
  const cutoff = getCutoffDate(timeWindow);
  
  // Total embeddings
  const embeddings = await db
    .collectionGroup('frames')
    .where('workspaceId', '==', workspaceId)
    .where('createdAt', '>', cutoff)
    .get();
  
  // Latency (time between embedding creation and storage)
  const latencies = embeddings.docs.map(doc => {
    const data = doc.data() as SemanticEmbedding;
    return data.createdAt.toMillis() - data.createdAt.toMillis(); // Placeholder
  });
  
  const avgLatency = latencies.length > 0
    ? latencies.reduce((a, b) => a + b) / latencies.length
    : 0;
  
  // Hallucination rate
  const hallucinated = embeddings.docs.filter(
    doc => (doc.data() as SemanticEmbedding).hallucinationFlag
  ).length;
  
  const hallucinationRate = embeddings.size > 0
    ? hallucinated / embeddings.size
    : 0;
  
  // Semantic stability
  const stableEmbeddings = embeddings.docs.filter(
    doc => (doc.data() as SemanticEmbedding).semanticShift! < 0.3
  ).length;
  
  const semanticStability = embeddings.size > 0
    ? stableEmbeddings / embeddings.size
    : 0;
  
  // Agent-level breakdown
  const agentMetrics: Record<string, any> = {};
  
  for (const agentId of await getUniqueAgentIds(workspaceId)) {
    const agentEmbeds = embeddings.docs.filter(
      doc => (doc.data() as SemanticEmbedding).agentId === agentId
    );
    
    agentMetrics[agentId] = {
      embeddingsGenerated: agentEmbeds.length,
      hallucinationRate: agentEmbeds.filter(
        d => (d.data() as SemanticEmbedding).hallucinationFlag
      ).length / agentEmbeds.length,
      avgSemanticShift: agentEmbeds
        .map(d => (d.data() as SemanticEmbedding).semanticShift || 0)
        .reduce((a, b) => a + b, 0) / agentEmbeds.length,
    };
  }
  
  return {
    totalEmbeddingsGenerated: embeddings.size,
    avgEmbeddingLatency: avgLatency,
    hallucinationDetectionRate: hallucinationRate,
    semanticStabilityScore: semanticStability,
    agentMetrics,
  };
}
```

### 8.2 Alerting Rules

Trigger alerts when embeddings reveal problems:

```typescript
// lib/embedding-alerts.ts
export async function monitorEmbeddingHealth(
  workspaceId: string
): Promise<void> {
  const metrics = await getEmbeddingHealthMetrics(workspaceId, '24h');
  
  // Alert 1: High hallucination rate
  if (metrics.hallucinationDetectionRate > 0.15) {
    await sendAlert({
      type: 'HIGH_HALLUCINATION_RATE',
      workspaceId,
      message: `Hallucination rate: ${(metrics.hallucinationDetectionRate * 100).toFixed(1)}%`,
      severity: 'warning',
    });
  }
  
  // Alert 2: Degrading semantic stability
  if (metrics.semanticStabilityScore < 0.7) {
    await sendAlert({
      type: 'SEMANTIC_INSTABILITY',
      workspaceId,
      message: `Semantic stability: ${(metrics.semanticStabilityScore * 100).toFixed(1)}%`,
      severity: 'warning',
    });
  }
  
  // Alert 3: Agent-specific degradation
  for (const [agentId, agentMets] of Object.entries(metrics.agentMetrics)) {
    if (agentMets.hallucinationRate > 0.2) {
      await sendAlert({
        type: 'AGENT_HALLUCINATION',
        workspaceId,
        agentId,
        message: `Agent ${agentId} hallucination rate: ${(agentMets.hallucinationRate * 100).toFixed(1)}%`,
        severity: 'error',
      });
    }
  }
}
```

---

## Part 9: Implementation Roadmap

### Week 1-2: Foundation
- [ ] Set up VL-JEPA Cloud Run service
- [ ] Create `semanticEmbeddings` Firestore collection + indexes
- [ ] Implement `VLJEPAClient` wrapper
- [ ] Add embedding storage helpers

### Week 3-4: ACHEEVY Integration
- [ ] Wire embeddings into ACHEEVY health monitoring
- [ ] Add semantic stability metric
- [ ] Implement embedding-based tap-out detection
- [ ] Update voice integration with embeddings

### Week 5-6: Agent Integration
- [ ] Update agent factory to pass embedding context
- [ ] Implement response embedding streaming
- [ ] Add inter-agent embedding communication
- [ ] Implement semantic task queuing

### Week 7-8: Hallucination Detection & Refunds
- [ ] Implement hallucination scoring via embeddings
- [ ] Update refund logic with embedding evidence
- [ ] Build embedding-aware model rotation

### Week 9-10: Digital Transformation & Monitoring
- [ ] Document embedding pipeline
- [ ] Semantic document search
- [ ] Embedding health dashboard
- [ ] Alerting rules

---

## Conclusion

By integrating VL-JEPA embeddings throughout your agent ecosystem, you:

✅ **Enable semantic understanding** across all agent types (Researcher, II-Agent, BoomerAng, etc)  
✅ **Strengthen health monitoring** with embedding drift detection  
✅ **Improve hallucination detection** via semantic consistency checks  
✅ **Empower tag-team rotation** with embedding-aware model selection  
✅ **Support real-time perception** (vision, voice, text) via unified embeddings  
✅ **Enable semantic search** for Digital Transformation (documents, archives)  
✅ **Maintain transparency** with per-user, per-task embedding logs for audits and refunds  

Embeddings become the **semantic substrate** of your entire platform—allowing agents, workflows, and agentic tools to communicate and coordinate at the level of meaning, not tokens.

