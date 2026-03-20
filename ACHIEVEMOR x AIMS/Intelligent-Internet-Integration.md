# Intelligent Internet Integration Guide
## Connecting ii-agent, codex, and Intelligent Internet Repos to Your Platform

**Version:** 1.0  
**Date:** January 26, 2026  
**Purpose:** Add specialized agents to your voice-first platform

---

## 🎯 SELECTED REPOS & WHY

From Intelligent-Internet GitHub organization, these are the most relevant:

### **Tier 1: Core (MUST USE)**

| Repo | Purpose | Integration |
|------|---------|-------------|
| **ii-agent** | Agent orchestration engine | Primary agent framework |
| **codex** | Lightweight coding agent | Code generation tasks |
| **Common_Chronicle** | Context management | Agent memory & timeline |

### **Tier 2: Important (SHOULD USE)**

| Repo | Purpose | Integration |
|------|---------|-------------|
| **ii-researcher** | Research/analysis agent | Research tasks |
| **CommonGround** | Multi-agent collaboration | Agent coordination |
| **litellm-debugger** | LLM gateway (100+ providers) | Provider switching |

### **Tier 3: Optional (NICE TO HAVE)**

| Repo | Purpose | Integration |
|------|---------|-------------|
| **II-Commons** | Dataset management | Data processing |
| **ii-thought** | RL dataset for reasoning | Advanced reasoning |
| **ii_verl** | Reinforcement learning | Model optimization |

### **NOT FOR THIS PROJECT**

- Symbioism-Nextra (documentation/philosophy)
- Symbioism-TLE (philosophy)
- reveal.js (presentation framework - use Remotion instead)
- PPTist (PowerPoint clone - not needed)
- ghost-gcp-storage (Ghost adapter - Firebase instead)

---

## 📦 INSTALLATION & SETUP

### **1. ii-agent (Core Framework)**

**GitHub:** https://github.com/Intelligent-Internet/ii-agent

```bash
# Clone repository
git clone https://github.com/Intelligent-Internet/ii-agent.git integrations/ii-agent
cd integrations/ii-agent

# Install dependencies
pip install -r requirements.txt
pip install pydantic fastapi uvicorn

# Or install as package
npm install ii-agent
pip install ii-agent
```

**Integration in your platform:**
```typescript
// lib/agents/ii-agent-wrapper.ts
import { IIAgent, AgentConfig } from "ii-agent";

export class IIAgentWrapper {
  private agent: IIAgent;

  constructor(config: AgentConfig) {
    this.agent = new IIAgent(config);
  }

  async execute(task: string, protocol: "ACP" | "MCP" = "ACP") {
    return this.agent.execute({
      task,
      protocol,
      streaming: true,
    });
  }

  async getStatus() {
    return this.agent.getStatus();
  }

  async getCapabilities() {
    return this.agent.getCapabilities();
  }
}
```

---

### **2. codex (Coding Agent)**

**GitHub:** https://github.com/Intelligent-Internet/codex

```bash
# Install from source
git clone https://github.com/Intelligent-Internet/codex.git integrations/codex
cd integrations/codex

# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Build codex
cargo build --release

# Or install binary
cargo install --path .
```

**Integration in your platform:**
```typescript
// lib/agents/codex-wrapper.ts
import { spawn } from "child_process";

export class CodexAgent {
  async generateCode(specification: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Codex runs as CLI, execute as subprocess
      const codex = spawn("codex", ["generate"], {
        cwd: process.cwd(),
      });

      let output = "";

      codex.stdout.on("data", (data) => {
        output += data.toString();
      });

      codex.on("close", (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`Codex failed with code ${code}`));
        }
      });

      // Send spec as stdin
      codex.stdin.write(specification);
      codex.stdin.end();
    });
  }

  async analyzeCode(code: string): Promise<{
    quality: number;
    issues: string[];
    suggestions: string[];
  }> {
    // Codex can analyze code and provide feedback
    return new Promise((resolve, reject) => {
      const codex = spawn("codex", ["analyze"]);

      let output = "";

      codex.stdout.on("data", (data) => {
        output += data.toString();
      });

      codex.on("close", (code) => {
        if (code === 0) {
          resolve(JSON.parse(output));
        } else {
          reject(new Error("Analysis failed"));
        }
      });

      codex.stdin.write(code);
      codex.stdin.end();
    });
  }
}
```

---

### **3. Common_Chronicle (Context Management)**

**GitHub:** https://github.com/Intelligent-Internet/Common_Chronicle

```bash
# Clone and install
git clone https://github.com/Intelligent-Internet/Common_Chronicle.git integrations/common-chronicle
cd integrations/common-chronicle

pip install -r requirements.txt
pip install common-chronicle
```

**Integration in your platform:**
```typescript
// lib/agents/context-manager.ts
import { Chronicle } from "common-chronicle";

export class ContextManager {
  private chronicle: Chronicle;

  constructor() {
    this.chronicle = new Chronicle({
      storage: "firestore", // Use your Firestore
      namespace: "platform-context",
    });
  }

  async recordEvent(event: {
    type: string;
    agent: string;
    task: string;
    result: any;
    timestamp?: number;
  }) {
    // Chronicle creates timeline of events
    await this.chronicle.addEvent({
      ...event,
      timestamp: event.timestamp || Date.now(),
    });
  }

  async getContextForTask(taskDescription: string) {
    // Retrieve relevant past context
    const context = await this.chronicle.query({
      type: "task",
      similar_to: taskDescription,
      limit: 5,
    });

    return context.events;
  }

  async getTimeline(agentId?: string) {
    // Get timeline of all events
    return this.chronicle.getTimeline({
      agent: agentId,
      limit: 100,
    });
  }
}
```

---

### **4. ii-researcher (Research Agent)**

**GitHub:** https://github.com/Intelligent-Internet/ii-researcher

```bash
# Install
git clone https://github.com/Intelligent-Internet/ii-researcher.git integrations/ii-researcher
pip install -r integrations/ii-researcher/requirements.txt
```

**Integration:**
```typescript
// lib/agents/researcher.ts
import { IIResearcher } from "ii-researcher";

export class ResearchAgent {
  private researcher: IIResearcher;

  constructor() {
    this.researcher = new IIResearcher({
      tools: ["web_search", "document_analysis", "summarization"],
    });
  }

  async research(topic: string) {
    const result = await this.researcher.execute({
      query: topic,
      depth: "comprehensive",
      sources: ["web", "academic", "arxiv"],
    });

    return {
      summary: result.summary,
      sources: result.sources,
      citations: result.citations,
    };
  }
}
```

---

### **5. litellm-debugger (LLM Gateway)**

**GitHub:** https://github.com/Intelligent-Internet/litellm-debugger

```bash
# Install LiteLLM
pip install litellm
pip install litellm-debugger

# Or npm
npm install litellm
```

**Integration:**
```typescript
// lib/llm/litellm-gateway.ts
import { LiteLLM } from "litellm";

export class LLMGateway {
  private gateway: LiteLLM;

  constructor() {
    this.gateway = new LiteLLM({
      debug: process.env.NODE_ENV === "development",
    });
  }

  async callLLM(
    provider: "claude" | "gpt-4" | "gemini" | "groq" | "mistral",
    prompt: string,
    options?: any
  ) {
    // LiteLLM abstracts all providers to same interface
    const response = await this.gateway.completion({
      model: provider,
      messages: [{ role: "user", content: prompt }],
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 2000,
    });

    return response.choices[0].message.content;
  }

  async compareProviders(prompt: string) {
    // Compare outputs across providers
    const providers = ["claude", "gpt-4", "gemini"];
    const results = await Promise.all(
      providers.map((provider) =>
        this.callLLM(provider as any, prompt)
      )
    );

    return providers.reduce(
      (acc, provider, idx) => ({
        ...acc,
        [provider]: results[idx],
      }),
      {}
    );
  }
}
```

---

### **6. CommonGround (Agent Collaboration)**

**GitHub:** https://github.com/Intelligent-Internet/CommonGround

```bash
# Install
git clone https://github.com/Intelligent-Internet/CommonGround.git integrations/common-ground
pip install -r integrations/common-ground/requirements.txt
```

**Integration:**
```typescript
// lib/agents/collaboration.ts
import { CommonGround } from "common-ground";

export class AgentCollaboration {
  private ground: CommonGround;

  constructor() {
    this.ground = new CommonGround({
      agents: ["codex", "researcher", "agent-zero"],
    });
  }

  async assignTaskWithCollaboration(task: {
    description: string;
    required_agents: string[];
    deadline?: number;
  }) {
    // CommonGround coordinates multiple agents
    const collaboration = await this.ground.coordinate({
      task: task.description,
      participants: task.required_agents,
      strategy: "consensus", // or "hierarchical", "distributed"
    });

    return {
      primary_agent: collaboration.primary,
      supporting_agents: collaboration.supporting,
      coordination_plan: collaboration.plan,
      estimated_time: collaboration.eta,
    };
  }

  async monitorCollaboration(taskId: string) {
    const status = await this.ground.getStatus(taskId);
    return {
      agents_active: status.active_agents,
      progress: status.progress,
      blockers: status.blockers,
      next_steps: status.next_steps,
    };
  }
}
```

---

### **7. II-Commons (Data Management)**

**GitHub:** https://github.com/Intelligent-Internet/II-Commons

```bash
# Install
git clone https://github.com/Intelligent-Internet/II-Commons.git integrations/ii-commons
pip install -r integrations/ii-commons/requirements.txt
```

**Integration:**
```typescript
// lib/data/commons.ts
import { IICommons } from "ii-commons";

export class DataManager {
  private commons: IICommons;

  constructor() {
    this.commons = new IICommons({
      storage: "google-cloud-storage", // or "s3", "local"
      backend: "firestore", // metadata storage
    });
  }

  async processDataset(datasetId: string) {
    // Load dataset
    const dataset = await this.commons.load(datasetId);

    // Get embeddings for retrieval
    const embeddings = await this.commons.embed({
      data: dataset,
      model: "sentence-transformers",
    });

    // Index for fast retrieval
    await this.commons.index({
      embeddings,
      index_type: "faiss",
    });

    return { indexed: true, size: dataset.length };
  }

  async searchDataset(query: string, datasetId: string) {
    // Search with embeddings
    const results = await this.commons.search({
      query,
      dataset: datasetId,
      limit: 10,
    });

    return results;
  }
}
```

---

## 🔗 CONNECTING THEM ALL TOGETHER

**Master Orchestrator:**

```typescript
// lib/agents/master-orchestrator.ts
import { IIAgentWrapper } from "./ii-agent-wrapper";
import { CodexAgent } from "./codex-wrapper";
import { ContextManager } from "./context-manager";
import { ResearchAgent } from "./researcher";
import { LLMGateway } from "../llm/litellm-gateway";
import { AgentCollaboration } from "./collaboration";
import { DataManager } from "../data/commons";

export class MasterOrchestrator {
  private ii_agent: IIAgentWrapper;
  private codex: CodexAgent;
  private context: ContextManager;
  private researcher: ResearchAgent;
  private llm: LLMGateway;
  private collaboration: AgentCollaboration;
  private data: DataManager;

  constructor() {
    this.ii_agent = new IIAgentWrapper({});
    this.codex = new CodexAgent();
    this.context = new ContextManager();
    this.researcher = new ResearchAgent();
    this.llm = new LLMGateway();
    this.collaboration = new AgentCollaboration();
    this.data = new DataManager();
  }

  async executeComplexTask(request: {
    voiceInput?: string;
    taskDescription: string;
    requiredAgents?: string[];
  }) {
    // 1. Get context from past executions
    const relevantContext = await this.context.getContextForTask(
      request.taskDescription
    );

    // 2. Determine best agent combination
    const taskAgents = request.requiredAgents || [
      "codex",
      "researcher",
      "ii-agent",
    ];

    // 3. Coordinate multi-agent execution
    const collaboration = await this.collaboration.assignTaskWithCollaboration(
      {
        description: request.taskDescription,
        required_agents: taskAgents,
      }
    );

    // 4. Execute primary agent (with context)
    const result = await this.ii_agent.execute(
      `${request.taskDescription}\n\nRelevant context:\n${JSON.stringify(relevantContext)}`,
      "ACP"
    );

    // 5. Record execution in timeline
    await this.context.recordEvent({
      type: "execution",
      agent: collaboration.primary_agent,
      task: request.taskDescription,
      result,
    });

    // 6. Generate video from results
    const videoUrl = await this.generateVideoFromResult(result);

    // 7. Synthesize voice response
    const voiceUrl = await this.synthesizeVoiceResponse(result);

    return {
      executionId: result.id,
      primaryAgent: collaboration.primary_agent,
      supportingAgents: collaboration.supporting_agents,
      result: result.output,
      videoUrl,
      voiceUrl,
      context_used: relevantContext.length,
    };
  }

  private async generateVideoFromResult(result: any) {
    // Implement video generation (Remotion + Kie.ai)
    return "https://cdn.example.com/video-" + result.id + ".mp4";
  }

  private async synthesizeVoiceResponse(result: any) {
    // Implement voice synthesis
    return "https://cdn.example.com/audio-" + result.id + ".mp3";
  }
}
```

---

## 🚀 DEPLOYMENT STRUCTURE

```yaml
# docker-compose.yml additions
services:
  ii-agent-service:
    build:
      context: integrations/ii-agent
    ports:
      - "8080:8080"
    environment:
      - ACP_ENABLED=true
      - CODEX_PATH=/usr/local/bin/codex
      - RESEARCHER_ENABLED=true

  codex-service:
    build:
      context: integrations/codex
      dockerfile: Dockerfile
    ports:
      - "8081:8081"
    environment:
      - RUST_LOG=debug

  common-chronicle-service:
    image: python:3.11
    working_dir: /app
    volumes:
      - ./integrations/common-chronicle:/app
    ports:
      - "8082:8082"
    command: uvicorn api:app --host 0.0.0.0 --port 8082

  litellm-gateway:
    image: ghcr.io/berriai/litellm:latest
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
```

---

## ✅ CHECKLIST

- [ ] ii-agent cloned and running
- [ ] codex installed and accessible via CLI
- [ ] Common_Chronicle configured with Firestore
- [ ] ii-researcher installed
- [ ] litellm-gateway running
- [ ] CommonGround initialized
- [ ] II-Commons installed
- [ ] Master orchestrator created
- [ ] All integrations tested
- [ ] Docker Compose includes all services

---

**Status:** ✅ READY FOR INTEGRATION  
**Next:** Update docker-compose.yml and start all services

