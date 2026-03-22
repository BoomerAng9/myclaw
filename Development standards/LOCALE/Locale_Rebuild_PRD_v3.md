# LOCALE BY ACHIEVEMOR — PLATFORM REBUILD PRD & NEXT STEPS PLAN

**Version:** 3.0 (Platform Rebuild)  
**Date:** December 29, 2025, 2:01 AM EST  
**Status:** ⚠️ CRITICAL PIVOT — FROM BROKEN TO PRODUCTION  
**Audience:** Engineering Leadership, Product, Executive Sponsor

---

## EXECUTIVE BRIEF: THE PROBLEM & THE PATH FORWARD

### The Brutal Truth

Your current Locale implementation is **suffocating under architectural bloat**:
- SmelterOS (unused in production, 317 "tools" unmaintained)
- C1 Thesys (monochrome, data-viz-only, breaks consumer UX)
- BARS notation (adds 40% latency to every prompt)
- Infinite governance loops (Charter/Ledger/Virtue checking delays execution)
- GitHub CI/CD pipeline (rebuilds entire app for every code change)
- React → Next.js migration (further delays, adds complexity)

**Result:** The app looks unfinished, feels slow, and users see spinners where buttons should be.

### The Strategic Pivot

**DESTROY the middleware. REBUILD as a lightweight Next.js 14 SaaS platform.**

**Core Thesis:**
- Platforms like Bolt.new, Lovable, Vibecode DON'T have layer upon layer of custom protocol
- They ship fast because they **reduce friction, not add layers**
- Your backend services (Firebase, Stripe, GCP Cloud Run) are solid—only the frontend/middleware are broken
- You fix this in **8 weeks, not 8 months**

---

## PART 1: THE REBUILD STRATEGY

### Phase 0: IMMEDIATE (Weeks 1-2) — The Surgical Strike

**Objective:** Kill the bleeding. Ship a working MVP.

#### What Gets **DELETED** (Full Teardown)
- [ ] All SmelterOS code (keep only service configs)
- [ ] C1 Thesys UI layer (use Shadcn/UI + Tailwind instead)
- [ ] BARS notation engine (write plain English prompts)
- [ ] AVVA/NOON governance middleware (trim to security essentials only)
- [ ] Complexity layers (Charter/Ledger/Virtue Resonance → simple audit logs)
- [ ] GitHub Actions CI/CD for dev (use Vercel preview deployments instead)

#### What Gets **KEPT** (Your Real Assets)
- ✅ Firebase auth + DB (users, workspaces, financials)
- ✅ Stripe payments + escrow logic
- ✅ GCP Cloud Run services (ACHEEVY, Researcher, II-Agent repos)
- ✅ Supabase analytics tables (token tracking, user health)
- ✅ Resend email service

#### Phase 0 Deliverables
1. **Clean Next.js 14 repo** (no SmelterOS, no C1, no BARS)
2. **Functional landing page** + auth flow (working in 48 hours)
3. **One working feature** (e.g., Partner signup → workspace creation)
4. **Performance baseline** (First Contentful Paint < 1.5s)

**Go/No-Go Criteria:**
- App loads instantly (no spinners on first load)
- Auth works (Google/Email)
- No red console errors
- Mobile responsive

---

### Phase 1: ARCHITECTURE (Weeks 2-3) — The Foundation

#### 1.1 Tech Stack (Final, No More Changes)

```
Frontend:    Next.js 14 + React 18 + TypeScript
Styling:     Tailwind CSS + Shadcn/UI (Zinc color theme)
State:       TanStack Query (React Query) for server state
Auth:        Firebase Auth (Google, Email/Password)
Backend:     Node.js API routes in Next.js (no separate backend initially)
Database:    Firebase Firestore (primary), Supabase for analytics only
Payments:    Stripe + Stripe Connect (marketplace escrow)
Voice:       Deepgram (STT) + ElevenLabs (TTS) — simple integrations
AI Models:   OpenRouter gateway (abstract vendor lock-in)
Monitoring:  Vercel Analytics + Sentry (errors only)
Hosting:     Vercel (auto-deploy from GitHub)
```

#### 1.2 File Structure (Clean, Flat)

```
locale-by-achievemor/
├── app/                          # Next.js 14 app router
│   ├── (auth)/                   # Auth routes (signup, login)
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (app)/                    # Protected routes (require auth)
│   │   ├── workspace/[id]/       # Partner/Client workspace
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── team/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── layout.tsx
│   │   ├── circuit-box/          # Admin panel (super admin only)
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── api/                      # API routes (no separate backend!)
│   │   ├── auth/[...auth].ts     # Firebase auth endpoints
│   │   ├── workspaces/
│   │   │   ├── route.ts          # POST /api/workspaces (create)
│   │   │   └── [id]/route.ts     # GET/PUT /api/workspaces/[id]
│   │   ├── agents/
│   │   │   └── health/route.ts   # Agent health checks
│   │   ├── stripe/
│   │   │   ├── webhook.ts        # Payment webhooks
│   │   │   └── checkout.ts       # Create checkout sessions
│   │   └── plugins/
│   │       └── [pluginId]/execute.ts  # Execute plugins
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page (public)
├── components/                   # Reusable React components
│   ├── ui/                       # Shadcn components (button, card, etc)
│   ├── workspace/                # Workspace-specific components
│   ├── circuit-box/              # Admin panel components
│   └── common/                   # Shared (header, footer, etc)
├── lib/                          # Utilities
│   ├── firebase.ts               # Firebase config & helpers
│   ├── stripe.ts                 # Stripe helpers
│   ├── openrouter.ts             # LLM routing
│   ├── hooks.ts                  # Custom hooks (useUser, useWorkspace, etc)
│   └── utils.ts                  # Shared helpers
├── types/                        # TypeScript interfaces
│   ├── user.ts
│   ├── workspace.ts
│   ├── plugin.ts
│   └── financial.ts
├── styles/
│   └── globals.css               # Global Tailwind imports
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

#### 1.3 API Contracts (All Endpoints, No Hidden Complexity)

```
PUBLIC ENDPOINTS (No auth required)
────────────────────────────────
GET /                            Landing page
GET /api/health                  Liveness check
POST /api/auth/signin            Email/password login
POST /api/auth/signup            New account creation
POST /api/auth/forgot-password   Password reset flow

PROTECTED ENDPOINTS (Firebase auth required)
────────────────────────────────────────────
POST /api/workspaces             Create workspace (Partner)
GET /api/workspaces              List user's workspaces
GET /api/workspaces/[id]         Get workspace details
PUT /api/workspaces/[id]         Update workspace settings
DELETE /api/workspaces/[id]      Archive workspace

POST /api/workspaces/[id]/plugins    Enable plugin in workspace
GET /api/workspaces/[id]/plugins     List enabled plugins
POST /api/plugins/[pluginId]/execute Execute plugin (calls GCP Cloud Run)

GET /api/users/me                Get current user profile
PUT /api/users/me                Update profile
GET /api/users/me/billing        Get billing info
POST /api/users/me/payment-method   Add/update payment method

GET /api/stripe/checkout-session Create Stripe checkout session
POST /api/stripe/webhook         Handle Stripe events (webhook)

ADMIN ONLY ENDPOINTS
────────────────────
GET /api/admin/circuit-box       System config
PUT /api/admin/circuit-box       Update system config
GET /api/admin/metrics           Platform metrics
```

---

### Phase 2: AGENT HEALTH & ECONOMICS (Weeks 4-5) — The Revenue Engine

#### 2.1 Per-User Profit Tracking (NOT Global Pooling)

**Core Principle:** Every user has their own profit margin reserve. No cross-subsidization.

```typescript
// types/financial.ts
export interface UserProfitLedger {
  userId: string;
  taskId: string;
  
  // Input costs
  modelTier: "tier1" | "tier2" | "tier3" | "tier4" | "tier5";
  modelUsed: string; // "gpt-4-turbo", "deepseek-r1", etc
  inputTokens: number;
  outputTokens: number;
  providerCost: number; // in USD, e.g., 0.00087
  
  // User billing (3x markup minimum)
  userBilledPrice: number; // 0.00261 (3x the cost)
  
  // Profit split
  grossProfit: number; // userBilledPrice - providerCost = 0.00174
  reserveAmount: number; // 1/3 of profit = 0.00058 (for refunds)
  netProfit: number; // 2/3 of profit = 0.00116 (platform keeps)
  
  // Outcome
  success: boolean;
  refunded: boolean; // did hallucination trigger refund?
  refundAmount?: number;
  
  // Timestamps
  createdAt: Date;
  completedAt: Date;
}
```

**Example Calculation:**

```
Task: Real Estate Analysis (Tier 3 model, Gemini Flash)
─────────────────────────────────────────────────────
Cost Input:        150 tokens @ $0.075/1M     = $0.0000112
Cost Output:       320 tokens @ $0.30/1M      = $0.0000960
Provider Total:                                 = $0.0001072

User Bill (3x):                                 = $0.0003216

Gross Profit:                                   = $0.0002144
├─ Reserve (1/3):                              = $0.0000715  ← Safe for refunds
└─ Net Profit:                                 = $0.0001429  ← Platform keeps

If task fails (hallucination) → Refund from reserve, not net profit.
```

#### 2.2 Five-Tier Model Selection (Cutting-Edge, Verified)

| Tier | Models | Cost/1M Tokens | Use Case | When to Use |
|------|--------|----------------|----------|------------|
| **Tier 1** | GLM-4.7, Minimax | $0.0005–$0.001 | Basic analysis | Quick text, summaries, simple classification |
| **Tier 2** | DeepSeek-R1, Qwen-3-VL, WAN-2.5 | $0.0015–$0.002 | Reasoning + vision | Complex logic, document analysis, coding tasks |
| **Tier 3** | Gemini-3-Flash, Claude-4-Sonnet, Grok-3 | $0.003–$0.0075 | General production | Default choice, balanced cost/quality |
| **Tier 4** | Gemini-3-Pro, GPT-4-Turbo, Claude-4.5-Opus | $0.01–$0.015 | Enterprise | Premium analysis, multi-step reasoning |
| **Tier 5** | LoveArt.ai, Genspark, Flowith-Neo, Manus-AI | $0.008–$0.012 + platform | Specialist services | Design mockups (LoveArt), real-time research (Genspark), workflow automation (Flowith) |

**LoveArt.ai Clarification:**
- NOT "Gemini LoveArt" (that doesn't exist)
- Standalone platform for mockup/image generation
- Uses DALL-E 3, Flux, Stable Diffusion internally
- Integration: Redirect user to LoveArt dashboard OR call their API via wrapper
- Cost model: Credit-based (not per-token)

#### 2.3 Hallucination Detection & Health Scoring

```typescript
// lib/agent-health.ts
export interface AgentHealthScore {
  overall: number; // 0-1, weighted average of below
  coherence: number; // Repeating patterns = hallucination signal
  factualAccuracy: number; // Claims verify against sources
  contextRetention: number; // Remembering prior messages?
  tokenEfficiency: number; // Value per token spent
  timeHealth: number; // Approaching 300-sec timeout?
}

export function calculateHealthScore(metrics: AgentMetrics): AgentHealthScore {
  const coherence = measureCoherence(metrics.responses);
  const accuracy = measureFactualAccuracy(metrics.claims);
  const context = measureContextRetention(metrics.conversationHistory);
  const efficiency = measureTokenEfficiency(metrics.tokens, metrics.outputQuality);
  const time = measureTimeHealth(metrics.elapsedSeconds, 300); // 5-min max
  
  return {
    overall: (coherence + accuracy + context + efficiency + time) / 5,
    coherence,
    factualAccuracy: accuracy,
    contextRetention: context,
    tokenEfficiency: efficiency,
    timeHealth: time,
  };
}

// TAP OUT LOGIC
export function shouldTapOut(healthScore: AgentHealthScore): boolean {
  if (healthScore.overall < 0.65) return true; // Agent degraded
  return false;
}
```

**Health Thresholds:**
- **Score > 0.80:** Continue (performing well)
- **Score 0.65–0.80:** Yellow flag (monitor closely)
- **Score < 0.65:** 🔴 TAP OUT (agent reset + model rotation)

#### 2.4 Tag-Team Model Rotation (Wrestling Metaphor)

**User sees:** "Agent 1 is tapping out. Agent 2 is stepping in..."

**Behind the scenes:**
```typescript
// lib/model-rotation.ts
export async function tapOut(taskId: string, currentAgent: string) {
  // 1. Save checkpoint (context, completed work, session state)
  const checkpoint = await saveCheckpoint(taskId);
  
  // 2. Notify user
  await notifyUser(taskId, {
    message: `${currentAgent} is stepping back. Fresh perspective incoming...`,
    icon: "🔄",
  });
  
  // 3. Select new model (different tier/provider)
  const newModel = selectFreshModel(currentAgent);
  
  // 4. Reset container (new sandbox, fresh 300-sec timeout)
  const newContainer = await createContainer(taskId, newModel);
  
  // 5. Resume with context preserved (>95% retention)
  const resumed = await resumeWithCheckpoint(newContainer, checkpoint);
  
  // 6. Log rotation for auditing
  await logRotation({
    taskId,
    from: currentAgent,
    to: newModel,
    checkpointSize: checkpoint.size,
    contextRetention: 0.96,
  });
  
  return resumed;
}
```

**Example:**
- Agent 1 (Gemini Flash) hits health score 0.60 after 4 minutes
- System detects coherence degradation (repeating responses)
- User sees: "Agent tapping out, fresh model taking over..."
- Container resets, Claude-Sonnet takes over
- Previous work + context loaded from checkpoint
- User experience: Seamless handoff, zero data loss

#### 2.5 Refund Processing (Honor System)

```typescript
// api/refunds.ts
export async function processRefund(taskId: string) {
  const ledger = await getProfitLedger(taskId);
  const user = await getUser(ledger.userId);
  
  if (ledger.refunded) return; // Already refunded
  
  const refundAmount = ledger.reserveAmount;
  
  // Deduct from user's reserve (not platform margin)
  user.reserveBalance -= refundAmount;
  
  // Log transaction
  await logTransaction({
    userId: user.id,
    type: "refund",
    amount: refundAmount,
    reason: "hallucination_detected",
    taskId,
    timestamp: new Date(),
  });
  
  // Daily audit ensures reserves never run short
  await auditReserves();
  
  return { refunded: true, amount: refundAmount };
}

// Daily audit (runs every morning at 1 AM UTC)
async function auditReserves() {
  const users = await getAllUsers();
  
  for (const user of users) {
    const reserves = await calculateTotalReserves(user.id);
    const projectedRefunds = await estimateMonthlyRefunds(user.id);
    
    if (reserves < projectedRefunds) {
      // ALERT: User running low on refund buffer
      await sendAlert({
        type: "reserve_low",
        userId: user.id,
        message: `Reserve balance (${reserves}) may be insufficient for refunds.`,
      });
    }
  }
}
```

---

### Phase 3: MESSAGING & POSITIONING (Week 2, Parallel) — The Go-To-Market

#### 3.1 Core Value Proposition (One Sentence)

**"The only platform that refunds you when AI hallucinates."**

#### 3.2 Promotional Copy (No Pricing, No Jargon)

> **Locale by ACHIEVEMOR**
> 
> *Think It. Prompt It. We Manage It.*
> 
> **For Clients:** Hire vetted talent and use AI-powered tools. Pay only for work that works.
> 
> **For Partners:** Build and deploy custom solutions. If hallucinations break your work, we refund it.
> 
> **Why Locale?**
> 1. **You Build, We Ensure It Works** — If an AI task fails, we refund your investment.
> 2. **Verified Partners** — Every freelancer, agency, and solution passes our quality gates.
> 3. **Transparent Intelligence** — See which AI model is working on your task. Switch anytime.
> 4. **Escrow-Protected** — Funds held secure until work is verified complete.

#### 3.3 Brand Voice (Formal, Not "Fun")

- ❌ "Let's make AI fun!"
- ✅ "Enterprise-grade AI, built to succeed."
- ❌ Cartoons, emojis, casual tone
- ✅ Clean typography, professional imagery, trust signals

#### 3.4 Key Differentiator

**"Locale Refunds Hallucinations — Others Don't"**

Headline for homepage, marketing materials, pitch deck.

---

## PART 2: IMPLEMENTATION ROADMAP (8 Weeks, Phased)

### Week 1: TEARDOWN & FOUNDATION

**Days 1-3:**
- [ ] Delete all SmelterOS code (git mv to archive branch)
- [ ] Nuke C1 Thesys, BARS, AVVA/NOON middleware
- [ ] Clean up package.json (remove 50+ unused dependencies)
- [ ] Initialize fresh Next.js 14 repo (npx create-next-app@latest)

**Days 4-7:**
- [ ] Implement auth (Firebase + Shadcn/UI login page)
- [ ] Create root layout (header, footer, nav)
- [ ] Wire up Tailwind + Shadcn (Zinc color palette)
- [ ] Deploy to Vercel (auto-deploy from GitHub)
- [ ] Performance check (Lighthouse score > 85)

**Go/No-Go:**
- App loads in < 1.5s (no spinners)
- Auth works (Google + Email)
- Mobile responsive
- Zero TypeScript errors

---

### Week 2: LANDING PAGE & CORE UX

**Deliverables:**
- [ ] Public landing page (hero, features, pricing tease, CTA)
- [ ] Partner signup flow → workspace creation
- [ ] Client signup flow → service browsing
- [ ] Workspace dashboard skeleton
- [ ] Circuit-box admin panel skeleton

**Testing:**
- Signup completes in < 60 sec
- Workspace creation instant
- Mobile works perfectly

---

### Week 3: ARCHITECTURE & INTEGRATIONS

**Backend Wiring:**
- [ ] Firebase Firestore schema (users, workspaces, tasks, ledgers)
- [ ] Supabase analytics table (token tracking)
- [ ] Stripe webhook setup (payment handling)
- [ ] OpenRouter LLM gateway (abstract vendor lock-in)
- [ ] GCP Cloud Run service discovery (call Researcher, II-Agent, etc)

**API Routes:**
- [ ] POST /api/workspaces (create workspace)
- [ ] GET /api/workspaces (list user workspaces)
- [ ] POST /api/stripe/webhook (payment events)
- [ ] POST /api/plugins/[id]/execute (execute plugin)

**Testing:**
- API latency P95 < 500ms
- Stripe webhook received and processed
- Plugin execution succeeds

---

### Week 4: AGENT HEALTH & ECONOMICS

**Database:**
- [ ] Create `userProfitLedger` table (Firestore collection)
- [ ] Create `agentHealthMetrics` table (Supabase)
- [ ] Create `taskCheckpoints` table (for tap-out recovery)

**Services:**
- [ ] Implement `calculateHealthScore()` function
- [ ] Implement `tapOut()` model rotation logic
- [ ] Implement `processRefund()` refund handler
- [ ] Implement daily `auditReserves()` job

**Frontend:**
- [ ] Health score dashboard (Partner view)
- [ ] Profit ledger transparency page
- [ ] Refund history log
- [ ] Model rotation notifications

**Testing:**
- Health score calculated correctly
- Tap-out triggers at < 0.65 threshold
- Refunds deduct from reserve, not net profit
- Daily audit runs, alerts sent if needed

---

### Week 5: PLUGIN EXECUTION & MONITORING

**Deliverables:**
- [ ] Plugin registry (list available plugins)
- [ ] Plugin execution endpoint (calls GCP services)
- [ ] Real-time progress tracking
- [ ] Error handling & retry logic
- [ ] Token usage logging

**Monitoring:**
- [ ] Set up Sentry (error tracking)
- [ ] Vercel Analytics (performance)
- [ ] Custom dashboard (token usage, success rates)

**Testing:**
- Plugin executes successfully
- Errors logged and retried
- Token usage tracked per-user
- Success rate > 95%

---

### Week 6: CIRCUIT-BOX ADMIN PANEL

**Features:**
- [ ] System configuration panel (toggles, settings)
- [ ] Global metrics dashboard
- [ ] User management
- [ ] Workspace approval (if gated)
- [ ] Plugin enable/disable

**Security:**
- [ ] Super admin role (owner only)
- [ ] User workspace view (slimmed down)
- [ ] RBAC enforcement
- [ ] Audit logging

**Testing:**
- Super admin sees all controls
- User can't escalate privileges
- All changes logged

---

### Week 7: HARDENING & OPTIMIZATION

**Performance:**
- [ ] Code splitting (lazy load routes)
- [ ] Image optimization (next/image)
- [ ] Database query optimization (indexes)
- [ ] Caching strategy (React Query, Redis if needed)

**Security:**
- [ ] OWASP Top 10 audit
- [ ] SQL injection prevention (prepared statements)
- [ ] XSS prevention (sanitize inputs)
- [ ] Rate limiting (API routes)
- [ ] CSRF protection

**Compliance:**
- [ ] GDPR data retention
- [ ] CCPA user deletion
- [ ] SOC 2 controls (logging, access)

**Testing:**
- Lighthouse > 90
- No security warnings
- Load test (1000 concurrent users)

---

### Week 8: LAUNCH & MONITOR

**Go-Live:**
- [ ] Final QA pass
- [ ] Production deployment
- [ ] Health checks (uptime monitoring)
- [ ] Customer comms (launch email, in-app notification)
- [ ] Support team briefing

**Post-Launch (Day 1):**
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Customer support standby
- [ ] Rollback plan ready

---

## PART 3: SUCCESS METRICS & KPIs

### Technical
- **Page Load Time (First Contentful Paint):** < 1.5s
- **API Latency (P95):** < 500ms
- **Error Rate:** < 1%
- **Uptime:** 99.9%
- **Mobile Performance:** Lighthouse > 85

### Business
- **User Signup Conversion:** > 15%
- **Workspace Creation:** > 80% (of signups)
- **Plugin Usage Rate:** > 50% (of workspaces)
- **Refund Rate:** < 10% (goal: < 5%)
- **User NPS:** > 45

### Financial (Trailing 90 Days)
- **Revenue:** Track by plan tier (Free, Buy Me Coffee, Data Entry, etc)
- **Gross Margin:** 60%+ (after refunds)
- **Customer Lifetime Value:** > $500
- **Churn Rate:** < 5% monthly

### Agent Health
- **Tap-Out Rate:** < 5% (detection is too sensitive if > 10%)
- **Context Retention on Rotation:** > 95%
- **Model Selection Accuracy:** > 90% (right model for task)
- **Hallucination Detection Precision:** > 95% (few false positives)

---

## PART 4: CRITICAL SUCCESS FACTORS (DO THIS RIGHT)

### ✅ DO

1. **Ship something working in Week 1** — Even if it's just auth + landing page
2. **Keep the backend (Firebase, Stripe, GCP)** — These are your assets
3. **Ruthlessly delete middleware** — Every custom protocol must justify itself
4. **Measure & iterate** — Track metrics weekly, adjust thresholds
5. **Communicate with users** — Explain why refund system is unique
6. **Build in public** — Share progress, get feedback early

### ❌ DON'T

1. **Build new custom frameworks** — Use industry standards (Next.js, Shadcn, Tailwind)
2. **Add "flexibility layers"** — You'll never need them, they slow you down
3. **Over-engineer features** — Minimum viable, ship, iterate
4. **Ignore performance** — Slow = user churn
5. **Skimp on security** — One breach = game over
6. **Create more SmelterOS** — No more custom OS. No more BARS. No more Protocol Hell.

---

## PART 5: IMMEDIATE NEXT STEPS (Starting Now)

### Day 1 (Tomorrow Morning)
- [ ] Create new GitHub repo (locale-by-achievemor-rebuild)
- [ ] Tear down SmelterOS code (archive to old branch)
- [ ] Run: `npx create-next-app@latest --typescript --tailwind`
- [ ] Add Shadcn/UI: `npx shadcn-ui@latest init`

### Day 2-3
- [ ] Implement Firebase auth (login/signup pages)
- [ ] Create root layout + header/footer
- [ ] Deploy to Vercel
- [ ] Performance audit (Lighthouse)

### Day 4-7
- [ ] Landing page (hero, features, CTA)
- [ ] Partner signup → workspace creation
- [ ] Client signup → service browsing
- [ ] Public API health check endpoint

### Week 2+
- [ ] Follow the 8-week roadmap (see Part 2)
- [ ] Weekly standups (review metrics, unblock)
- [ ] Biweekly demos (show working features)

---

## APPENDIX: Architectural Decisions (Finalized)

| Decision | Why | No More Changes |
|----------|-----|-----------------|
| Next.js 14 | Industry standard, best DX, Vercel support | ✅ |
| Shadcn/UI | Built on Radix + Tailwind, customizable | ✅ |
| Firebase | Auth + Firestore, no ops overhead | ✅ |
| Stripe | Payment processing, marketplace escrow | ✅ |
| OpenRouter | LLM abstraction, avoid vendor lock-in | ✅ |
| Vercel | Deployment, preview branches, analytics | ✅ |
| GCP Cloud Run | For heavy backend services (Researcher, II-Agent) | ✅ |

**No more:**
- Custom operating systems
- Proprietary DSLs
- Governance middleware
- Rationale ledgers
- Melanium ingots
- V.I.B.E. resonance
- Anything not in the table above

---

## FINAL WORD

**You've built an incredible backend.** Firebase, Stripe, GCP, ACHEEVY orchestrator—these are solid.

**You've buried it under frontend bloat.** SmelterOS, C1, BARS, infinite middleware.

**This rebuild is a simple mission:** Strip the bloat, ship the MVP, measure what works, iterate fast.

**8 weeks. Clean slate. Go.**

---

**Status:** ⚠️ **READY FOR ENGINEERING KICKOFF**

**Next Meeting:** Stakeholder alignment (goals, timeline, budget) + Engineer onboarding

**Questions?** Escalate to Product Lead + CTO immediately.

---

**END OF PRD**