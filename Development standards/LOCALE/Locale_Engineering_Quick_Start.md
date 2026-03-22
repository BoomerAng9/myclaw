# LOCALE REBUILD — ENGINEERING QUICK START GUIDE

**For:** Engineering Team  
**When to Use:** After "GO" decision, starting Day 1  
**Duration:** 8 weeks to production

---

## WEEK 1: THE SURGICAL STRIKE (Teardown + MVP)

### Days 1-3: Teardown

```bash
# Archive old code (don't delete yet, just in case)
git checkout -b archive/smelter-os-era
git branch -D main  # keep main clean for new build

# Create fresh repo
git checkout -b main
rm -rf src/ components/ pages/ .vscode/settings.json
rm -rf node_modules/ .next/
rm tsconfig.json next.config.ts package.json

# Verify: repo is now basically empty (keep .git, public, static files)
git status  # should show mostly deletions
git commit -m "chore: archive legacy SmelterOS/C1 code"

# NEW: Initialize Next.js 14
npx create-next-app@latest . --typescript --tailwind --no-git
# Or from template: git clone https://github.com/vercel/next.js.git examples/app && cd examples/app

# Install Shadcn/UI
npx shadcn-ui@latest init --defaults

# Clean installs
npm install
npm run dev

# Verify: http://localhost:3000 works, no red console errors
```

### Days 4-7: MVP (Auth + Landing + Deploy)

**Day 4: Firebase Auth Setup**

```typescript
// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

**Day 5: Auth Pages**

```
app/
├── (auth)/
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   └── layout.tsx
```

Create minimal signup/signin flows (email + Google OAuth).

**Day 6: Landing Page**

```
app/
├── page.tsx (public landing)
├── layout.tsx (root layout)
```

Static content, hero, 3 CTAs (Partner signup, Client signup, Learn more).

**Day 7: Deploy to Vercel**

```bash
# Connect GitHub repo to Vercel
vercel link
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
# ... (all Firebase env vars)

# Deploy
git push origin main
# Vercel auto-deploys

# Check preview
https://locale-rebuild.vercel.app (or your domain)
```

### Week 1 Go/No-Go Checklist

- [ ] Repo is clean (no SmelterOS code)
- [ ] Next.js runs locally (npm run dev works)
- [ ] Landing page is live (public route)
- [ ] Signup/signin pages exist (can create account)
- [ ] Firebase auth is wired (accounts save to Firebase)
- [ ] App deployed to Vercel (auto-deploy on push)
- [ ] Lighthouse score > 85 (performance baseline)
- [ ] No red console errors (clean build)
- [ ] Mobile responsive (test on phone)

**If ANY of these fail, STOP. Debug before moving to Week 2.**

---

## WEEK 2: LANDING PAGE + CORE UX

### Deliverables

1. **Landing Page (Public)**
   - Hero section (headline, CTA)
   - Features section (5 key benefits)
   - Social proof (stats, testimonials)
   - Pricing tease (no actual pricing, just mention it exists)
   - Footer (links, legal)

2. **Partner Signup Flow**
   - Email/password signup
   - Profile setup (name, service, bio)
   - Workspace creation (auto-created on signup)
   - Redirect to partner dashboard

3. **Client Signup Flow**
   - Email/password signup
   - Profile setup (name, company, industry)
   - Browse professionals (stub, just shows placeholder)
   - Redirect to client dashboard

4. **Workspace Skeleton**
   - Partner view: dashboard (empty), team, settings
   - Client view: browse, orders, settings

### Code Organization

```
app/
├── (auth)/
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   └── layout.tsx
├── (app)/
│   ├── workspace/[id]/
│   │   ├── dashboard/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── landing/
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   └── footer.tsx
│   ├── workspace/
│   │   └── dashboard.tsx
│   └── common/
│       ├── header.tsx
│       └── nav.tsx
├── page.tsx (landing, public)
└── layout.tsx (root)
```

### Key Decisions

- **Workspace model:** Every user has ONE workspace (Partner or Client, not both)
- **Auth state:** Use Firebase auth hook (useAuth custom hook)
- **Styling:** Tailwind + Shadcn, Zinc color palette (not Slate, not neutral)
- **No backend complexity:** Just static pages + Firebase reads/writes

---

## WEEK 3: ARCHITECTURE & INTEGRATIONS

### API Contracts (Next.js API Routes)

```typescript
// app/api/auth/signin (POST)
// app/api/auth/signup (POST)
// app/api/auth/signout (POST)
// app/api/workspaces (GET, POST)
// app/api/workspaces/[id] (GET, PUT, DELETE)
// app/api/stripe/webhook (POST)
// app/api/plugins/[id]/execute (POST)
```

### Database Schema (Firestore)

```
collections/
├── users/
│   └── {userId}
│       ├── email: string
│       ├── name: string
│       ├── role: "partner" | "client"
│       ├── workspaceId: string
│       ├── stripeCustomerId: string (optional)
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── workspaces/
│   └── {workspaceId}
│       ├── name: string
│       ├── ownerId: string
│       ├── type: "partner" | "client"
│       ├── settings: { ... }
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── profitLedgers/ (for economics tracking)
│   └── {taskId}
│       ├── userId: string
│       ├── modelTier: string
│       ├── providerCost: number
│       ├── userBilledPrice: number
│       ├── reserveAmount: number
│       ├── netProfit: number
│       ├── success: boolean
│       ├── refunded: boolean
│       └── createdAt: timestamp
│
└── agentHealth/ (for health monitoring)
    └── {taskId}
        ├── userId: string
        ├── overallScore: number (0-1)
        ├── coherence: number
        ├── factualAccuracy: number
        ├── contextRetention: number
        ├── tokenEfficiency: number
        ├── timeHealth: number
        └── timestamp: timestamp
```

### Backend Services to Keep

- **Firebase:** Auth, Firestore, Storage (no changes)
- **Stripe:** Webhook ingestion (listen for payment events)
- **GCP Cloud Run:** Call existing ACHEEVY, Researcher, II-Agent services (via API)
- **Supabase:** Analytics table (token tracking)

### Integration Checklist

- [ ] Firebase Firestore schema created (no migrations needed, just define collections)
- [ ] Stripe webhook URL configured (https://locale.com/api/stripe/webhook)
- [ ] OpenRouter API key stored (env var OPENROUTER_API_KEY)
- [ ] GCP Cloud Run service endpoints verified (working, reachable from Next.js)
- [ ] Supabase connection tested (can read/write to analytics table)

---

## WEEK 4-5: AGENT HEALTH & ECONOMICS

### Core Functions to Implement

```typescript
// lib/agent-health.ts
export function calculateHealthScore(metrics: AgentMetrics): AgentHealthScore {
  const coherence = measureCoherence(metrics.responses);
  const accuracy = measureFactualAccuracy(metrics.claims);
  const context = measureContextRetention(metrics.conversationHistory);
  const efficiency = measureTokenEfficiency(metrics.tokens, metrics.outputQuality);
  const time = measureTimeHealth(metrics.elapsedSeconds, 300);
  
  return {
    overall: (coherence + accuracy + context + efficiency + time) / 5,
    coherence,
    factualAccuracy: accuracy,
    contextRetention: context,
    tokenEfficiency: efficiency,
    timeHealth: time,
  };
}

export function shouldTapOut(healthScore: AgentHealthScore): boolean {
  return healthScore.overall < 0.65;
}

// lib/model-rotation.ts
export async function tapOut(taskId: string, currentAgent: string) {
  const checkpoint = await saveCheckpoint(taskId);
  await notifyUser(taskId, { message: "Agent tapping out..." });
  const newModel = selectFreshModel(currentAgent);
  const newContainer = await createContainer(taskId, newModel);
  const resumed = await resumeWithCheckpoint(newContainer, checkpoint);
  await logRotation({ taskId, from: currentAgent, to: newModel });
  return resumed;
}

// lib/refunds.ts
export async function processRefund(taskId: string) {
  const ledger = await getProfitLedger(taskId);
  if (ledger.refunded) return; // Already refunded
  
  // Deduct from reserve (not net profit)
  const refundAmount = ledger.reserveAmount;
  await deductFromReserve(ledger.userId, refundAmount);
  await logTransaction({ userId: ledger.userId, type: "refund", amount: refundAmount, taskId });
  
  return { refunded: true, amount: refundAmount };
}
```

### API Route: Track Profit

```typescript
// app/api/tasks/[id]/profit (GET)
export async function GET(req, { params }) {
  const taskId = params.id;
  const ledger = await db.collection("profitLedgers").doc(taskId).get();
  return Response.json(ledger.data());
}
```

### Frontend: Profit Dashboard (Partner View)

```
workspace/[id]/
└── dashboard/
    ├── page.tsx (shows profit ledgers, health scores)
    ├── components/
    │   ├── profit-summary.tsx
    │   ├── health-score-card.tsx
    │   └── recent-tasks.tsx
    └── ...
```

---

## WEEK 6: CIRCUIT-BOX ADMIN PANEL

### Structure

```
app/
└── (app)/
    └── admin/
        ├── circuit-box/
        │   ├── page.tsx (main dashboard)
        │   ├── components/
        │   │   ├── system-config.tsx
        │   │   ├── metrics.tsx
        │   │   ├── user-management.tsx
        │   │   └── approval-queue.tsx
        │   └── layout.tsx
```

### Key Features (MVP)

- **System Config:** Toggle features (health monitoring on/off, refund enable/disable, etc)
- **Metrics:** Real-time dashboard (user count, task volume, refund rate, avg health score)
- **User Management:** List users, ban/approve/suspend
- **RBAC:** Super admin (owner only) vs user workspace (slimmed down)

### Security

- [ ] Super admin role check (Firestore rule: only ownerId can access /admin routes)
- [ ] Audit logging (every change logged to `auditLogs` collection)
- [ ] Rate limiting (API routes rate-limited to prevent abuse)

---

## WEEK 7: HARDENING & OPTIMIZATION

### Performance Checklist

- [ ] Code splitting (lazy load routes, pages)
- [ ] Image optimization (next/image for all images)
- [ ] Database query optimization (add Firestore indexes)
- [ ] Caching strategy (React Query for server state, revalidate on update)
- [ ] Bundle analysis (npx next/analyze)
- [ ] Lighthouse score target: > 90

### Security Checklist

- [ ] OWASP Top 10 audit (manual code review for SQL injection, XSS, CSRF)
- [ ] Input validation (Zod for forms)
- [ ] Rate limiting (on all API routes)
- [ ] HTTPS enforced (Vercel does this by default)
- [ ] Secrets management (Vercel env vars, never hardcode)
- [ ] GDPR compliance (data retention policy, deletion endpoint)
- [ ] CCPA compliance (user data export, deletion)

### Testing Checklist

- [ ] Unit tests (critical business logic: health scoring, refunds)
- [ ] Integration tests (API routes end-to-end)
- [ ] Load testing (1000 concurrent users, should handle)
- [ ] Manual QA (signup, workspace, plugin execution)

---

## WEEK 8: LAUNCH

### Pre-Launch

- [ ] All features working (signup, workspace, plugin execution, health monitoring, refunds)
- [ ] Security audit passed
- [ ] Performance targets met (Lighthouse > 90, P95 < 500ms)
- [ ] Monitoring set up (Sentry for errors, Vercel analytics for perf)
- [ ] Runbook created (how to rollback, how to hotfix)

### Launch Day

- [ ] Final QA pass (all flows tested on prod)
- [ ] Monitoring dashboard open (watch error rate, latency)
- [ ] Support team on standby
- [ ] Customer comms sent (launch email, in-app notification)
- [ ] Rollback plan ready (if needed)

### Post-Launch (Days 1-3)

- [ ] Daily sync on metrics (error rate, uptime, user feedback)
- [ ] Quick fixes for bugs (deploy within 1-2 hours)
- [ ] Monitor refund rate (should be < 10%, alert if > 15%)
- [ ] Customer support overflow plan (if surge in signups)

---

## KEY FILES TO CREATE (Week-by-Week)

### Week 1

```
app/
├── layout.tsx
├── page.tsx
├── (auth)/
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   └── layout.tsx
├── api/
│   └── health/route.ts (GET, returns { status: "ok" })
lib/
├── firebase.ts
└── utils.ts
```

### Week 2-3

```
app/
├── (app)/
│   ├── workspace/[id]/
│   │   ├── dashboard/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   └── layout.tsx
├── api/
│   ├── auth/[...auth].ts (Firebase auth routes)
│   ├── workspaces/route.ts (GET, POST)
│   └── workspaces/[id]/route.ts (GET, PUT, DELETE)
components/
├── landing/
│   ├── hero.tsx
│   ├── features.tsx
│   └── footer.tsx
├── workspace/
│   └── dashboard.tsx
└── common/
    ├── header.tsx
    └── nav.tsx
```

### Week 4-5

```
lib/
├── agent-health.ts
├── model-rotation.ts
├── refunds.ts
└── profit-ledger.ts
app/api/
├── tasks/[id]/health/route.ts
├── tasks/[id]/profit/route.ts
└── refunds/route.ts
```

### Week 6

```
app/
└── (app)/
    └── admin/
        └── circuit-box/
            ├── page.tsx
            ├── components/
            │   ├── system-config.tsx
            │   ├── metrics.tsx
            │   └── user-management.tsx
            └── layout.tsx
```

---

## ENVIRONMENT VARIABLES (Add to .env.local, then Vercel)

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# OpenRouter (LLM abstraction)
OPENROUTER_API_KEY=

# Supabase (analytics)
SUPABASE_URL=
SUPABASE_ANON_KEY=

# GCP
GCP_PROJECT_ID=
```

---

## DEPLOYMENT COMMANDS

```bash
# Local development
npm run dev

# Build
npm run build

# Run production build locally (for testing)
npm start

# Deploy to Vercel
git push origin main
# Vercel auto-deploys

# Check build output
vercel logs
```

---

## MONITORING & ALERTS

After launch, monitor:

- **Error rate:** Alert if > 1%
- **Response time (P95):** Alert if > 500ms
- **Uptime:** Alert if < 99.9%
- **Refund rate:** Alert if > 15%
- **User signups:** Alert if 0 (broken auth)

Set up in Sentry (errors) + Vercel Analytics (performance).

---

## FINAL CHECKLIST (Before You Start)

- [ ] You've read the full PRD (Locale_Rebuild_PRD_v3.md)
- [ ] You've read the promotional copy (Locale_Promotional_Copy_v1.md)
- [ ] You've read the economics doc (LOCALE_Section_2_Agent_Health_Economics_v2.0.md)
- [ ] You understand the 8-week timeline (no flexibility)
- [ ] You understand what to DELETE (SmelterOS, C1, BARS, etc)
- [ ] You understand what to KEEP (Firebase, Stripe, GCP, etc)
- [ ] You have access to all API keys (Firebase, Stripe, OpenRouter, GCP)
- [ ] Your team is 100% allocated (no side projects)
- [ ] You have weekly standups scheduled
- [ ] You have a rollback plan ready

---

**READY? Let's ship this.**

---

**END OF QUICK START GUIDE**