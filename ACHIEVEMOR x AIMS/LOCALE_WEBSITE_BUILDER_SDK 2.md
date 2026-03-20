# @locale/website-builder SDK Specification

**Version:** 1.0  
**Status:** Reference for A.I.M.S. Plug Generation  
**Last Updated:** February 3, 2026  

---

## Overview

The `@locale/website-builder` SDK is a professional-grade website and web application builder that integrates with the A.I.M.S. infrastructure (Hostinger KVM VPS + Docker containerized tools) to generate production-ready Plugs.

**Core Purpose:**
- Take a deployment configuration (template type, branding, chat agent assignment, design preferences).
- Clone and customize a template from Puter core.
- Inject a chat widget wired to a Boomer_Ang agent.
- Provision backend infrastructure (PostgreSQL + Express API).
- Deploy to a user-owned subdomain.
- Generate an admin dashboard for user/content management.
- Return a complete, monetizable product in ~90 seconds.

**Not a Dependency:**
- This SDK is not required for other Plug types (PDFs, research, autonomous Boomer_Angs, custom apps).
- It is one specialized module called by ACHEEVY when the user requests a website or web app.

---

## Architecture

```
User Prompt (via ACHEEVY)
         ↓
ACHEEVY delegates to BoomerAng_WebBuilder tool
         ↓
@locale/website-builder.deploy(config)
         ↓
┌─────────────────────────────────────────┐
│  SDK Internal Flow                      │
├─────────────────────────────────────────┤
│ 1. Clone Puter template                 │
│ 2. Apply user branding                  │
│ 3. Inject Boomer_Ang chat widget        │
│ 4. Provision backend (PostgreSQL + API) │
│ 5. Deploy to subdomain                  │
│ 6. Store metadata in Firestore          │
│ 7. Return deployment URLs + credentials │
└─────────────────────────────────────────┘
         ↓
ACHEEVY responds to user with live URLs
```

---

## API Specification

### Class: `LocaleWebsiteBuilder`

```typescript
import { PuterCore } from 'puter-sdk';
import { Firebase } from 'firebase-admin';

export class LocaleWebsiteBuilder extends PuterCore {
  private firebase: Firebase;
  private hostingerVPS: HostingerConfig;

  constructor(config: SDKConfig) {
    super(config);
    this.firebase = config.firebaseApp;
    this.hostingerVPS = config.hostingerVPS;
  }

  // Core deployment method
  async deploy(config: DeploymentConfig): Promise<DeploymentResult>;

  // Internal utilities (private)
  private async cloneTemplate(templateType: string): Promise<TemplateAssets>;
  private async applyBranding(template: TemplateAssets, branding: BrandingConfig): Promise<void>;
  private async embedChatWidget(template: TemplateAssets, chatConfig: ChatWidgetConfig): Promise<void>;
  private async provisionBackend(subdomain: string, dataModels: string[]): Promise<BackendConfig>;
  private async deployToSubdomain(subdomain: string, files: FileMap, ssl: boolean): Promise<DeploymentURLs>;
  private async generateAdminDashboard(subdomain: string, tables: string[], config: AdminConfig): Promise<void>;
  private async storeDeploymentMetadata(userId: string, metadata: DeploymentMetadata): Promise<string>;
}
```

---

### Method: `deploy(config: DeploymentConfig)`

**Purpose:** Orchestrate the complete deployment pipeline.

**Signature:**
```typescript
async deploy(config: DeploymentConfig): Promise<DeploymentResult>
```

**Input: `DeploymentConfig`**
```typescript
interface DeploymentConfig {
  // Required
  userId: string;                           // Firestore user ID
  templateType: TemplateType;               // 'saas_landing' | 'ecommerce' | 'portfolio' | 'docs' | 'custom'
  subdomain: string;                        // e.g., 'taskflow' → taskflow.locale.com

  // Branding
  businessName: string;                     // Company/product name
  logoUrl?: string;                         // URL to logo asset
  brandColors?: {
    primary: string;                        // Hex color #RRGGBB
    secondary?: string;
    accent?: string;
  };
  fonts?: {
    heading?: string;                       // Font family for headings
    body?: string;                          // Font family for body text
  };
  tagline?: string;                         // Short marketing tagline

  // Chat widget configuration
  chatConfig: {
    boomerAngId: string;                    // ID of the Boomer_Ang handling visitors
    greeting: string;                       // Initial message to show
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    avatarUrl?: string;                     // Custom avatar URL (falls back to Boomer_Ang avatar)
    primaryColor?: string;                  // Chat bubble primary color
  };

  // Backend data models
  dataModels?: {
    [tableName: string]: SchemaDefinition;  // Custom tables beyond defaults (users, content, analytics)
  };

  // Admin dashboard configuration
  adminConfig?: {
    tables: string[];                       // Which tables to expose (e.g., ['users', 'orders', 'products'])
    analytics: boolean;                     // Enable analytics dashboard
    exportData: boolean;                    // Allow CSV/JSON exports
    roleBasedAccess?: boolean;               // Multi-user admin with role assignment
  };

  // Design preferences
  designPreferences?: {
    colorScheme?: 'light' | 'dark' | 'auto';
    customCSS?: string;                     // Extra CSS to inject
    faviconUrl?: string;                    // Favicon URL
  };

  // Hosting & SSL
  ssl?: boolean;                            // Default: true (Let's Encrypt)
  cdnProvider?: 'cloudflare' | 'none';      // Default: 'cloudflare'
}
```

**Output: `DeploymentResult`**
```typescript
interface DeploymentResult {
  success: boolean;
  deploymentId: string;                     // Firestore document ID
  urls: {
    website: string;                        // https://subdomain.locale.com
    admin: string;                          // https://subdomain.locale.com/admin
    api: string;                            // https://api.locale.com/subdomain
  };
  credentials: {
    adminEmail: string;                     // Email to send login to
    adminPassword?: string;                 // Auto-generated if needed (sent via email)
    apiKey?: string;                        // API key for programmatic access
  };
  boomerAngId: string;                      // Assigned Boomer_Ang ID
  status: 'active' | 'deploying' | 'failed';
  estimatedDeployTime: number;              // Seconds
  error?: string;                           // If failed
}
```

---

## Template Types

Each template is a pre-built Next.js structure (using Puter + ShadcnUI components) that can be customized.

### `saas_landing`

**Purpose:** Professional landing page for SaaS / software products.

**Included Components:**
- Hero section with headline, subheadline, CTA button
- Features grid (3-column, icon + title + description)
- Pricing table (Starter / Pro / Enterprise tiers with feature checklist)
- Social proof / testimonials carousel
- FAQ accordion
- Call-to-action footer section
- Chat widget (bottom-right by default)

**Default Backend Tables:**
- `users` (auth, subscription tier, profile)
- `contact_submissions` (leads from contact form)
- `analytics` (page views, conversion events)

**Deployment Time:** ~30 seconds

---

### `ecommerce`

**Purpose:** E-commerce storefront with product catalog and shopping cart.

**Included Components:**
- Product grid with search and filters
- Product detail page with images, description, pricing, reviews
- Shopping cart with add/remove items
- Checkout flow (Stripe integration ready)
- Order history dashboard
- Chat widget (customer support)
- Admin product management

**Default Backend Tables:**
- `users` (customers, auth, addresses)
- `products` (catalog with SKU, price, inventory)
- `orders` (transaction history with status)
- `order_items` (line items per order)
- `reviews` (customer ratings and feedback)

**Deployment Time:** ~45 seconds

---

### `portfolio`

**Purpose:** Professional portfolio or case study showcase.

**Included Components:**
- Hero with name/title/social links
- Work grid (projects with images, descriptions, links)
- About section with bio and skills
- Contact form
- Case study detail pages
- Chat widget (inquiries)

**Default Backend Tables:**
- `users` (owner/admin)
- `projects` (portfolio entries)
- `contact_submissions` (inquiry forms)

**Deployment Time:** ~25 seconds

---

### `docs`

**Purpose:** Documentation site with searchable knowledge base.

**Included Components:**
- Sidebar navigation with nested docs structure
- Full-text search
- Code block syntax highlighting
- Breadcrumb navigation
- Table of contents per page
- Dark/light theme toggle
- Chat widget (documentation assistant, can answer questions about docs)

**Default Backend Tables:**
- `users` (authors/admin)
- `pages` (doc pages with markdown content)
- `categories` (doc structure)

**Deployment Time:** ~35 seconds

---

### `custom`

**Purpose:** Blank template for user-provided HTML/React.

**Behavior:**
- If `customHTML` or `customReactComponents` provided in `designPreferences`, uses those.
- Otherwise, provides a minimal boilerplate (header, footer, content area).
- Chat widget always injected.
- Admin dashboard always generated.

**Deployment Time:** ~20 seconds (no template customization)

---

## Chat Widget Integration

### Embedded Widget

The chat widget is automatically injected into every deployed site.

**HTML/Script Injection:**
```html
<!-- Injected before closing </body> tag -->
<script id="locale-chat-widget" defer>
  window.localeChat = {
    boomerAngId: "{{ chatConfig.boomerAngId }}",
    apiEndpoint: "https://api.locale.com/chat",
    greeting: "{{ chatConfig.greeting }}",
    position: "{{ chatConfig.position || 'bottom-right' }}",
    primaryColor: "{{ chatConfig.primaryColor || '#4A90E2' }}",
    avatarUrl: "{{ chatConfig.avatarUrl }}"
  };
</script>
<script async src="https://cdn.locale.com/chat-widget.js"></script>
```

### Widget Behavior

- Floats in the specified corner (bottom-right default).
- Displays greeting message on first visit.
- Connects to `/api/chat` endpoint via WebSocket or HTTP long-polling.
- Messages sent to the assigned Boomer_Ang (e.g., `boomerang_support_user123`).
- Chat history stored in Firestore `conversations` collection.
- Persists visitor identity via localStorage or user auth.

**Visitor Chat Request Example:**
```typescript
// Widget sends to: POST https://api.locale.com/chat
{
  boomerAngId: "boomerang_support_taskflow_user123",
  visitorId: "anonymous_abc123",  // or authenticated user ID
  message: "How do I create a project?",
  timestamp: 1738630080,
  sessionId: "session_xyz789"
}
```

**Boomer_Ang Response:**
- Boomer_Ang processes the message using its trained system prompt.
- Responds with markdown text, optional action cards (e.g., "Schedule Demo" link).
- Response streamed back to widget in real-time.

---

## Admin Dashboard

### Auto-Generated Features

Every deployed site receives a passwordless admin interface at `/admin`:

**Authentication:**
- Magic link login (click link in email).
- Or: Google OAuth via Firebase.
- Session stored in browser localStorage + Firebase Auth.

**UI Sections:**

1. **Overview**
   - Deployment status
   - Visitor count (last 7/30 days)
   - Chat conversations (unread count)
   - Quick stats tiles

2. **Content Management** (if applicable)
   - Create/edit/delete pages, products, or portfolio entries
   - Rich text editor (Markdown or WYSIWYG)
   - Image upload to Cloud Storage
   - SEO metadata editor

3. **Users**
   - View registered users (if auth enabled)
   - Manage user roles (if role-based access enabled)
   - View user activity timeline

4. **Orders** (e-commerce only)
   - Order list with search/filter
   - Order detail view (items, customer, shipping address, payment status)
   - Mark as shipped, refund action

5. **Chat History**
   - View all conversations with site visitors
   - Filter by date range, visitor name, sentiment
   - Export conversation as PDF/JSON

6. **Analytics**
   - Page view trends (line chart)
   - Conversion funnel (if configured)
   - Traffic source breakdown
   - Export data as CSV

7. **Settings**
   - Edit site title, description, branding
   - Update chat widget greeting
   - Configure which data tables are visible to admin
   - Manage API keys for programmatic access
   - View deployment logs

**Data Export:**
- CSV for all tables (users, orders, contact submissions, etc.)
- JSON for advanced analysis
- Custom date range selectors

---

## Backend API

Every deployed site includes a REST API at `https://api.locale.com/{subdomain}`.

### Authentication

```typescript
// Bearer token (from admin settings or Boomer_Ang authentication)
Authorization: Bearer <API_KEY>
```

### Endpoints

#### Chat Endpoint

```
POST /api/chat
Content-Type: application/json

{
  "boomerAngId": "boomerang_support_taskflow",
  "message": "How do I reset my password?",
  "visitorId": "user@example.com",  // optional, for context
  "sessionId": "session_abc123"
}

Response:
{
  "id": "msg_xyz789",
  "boomerAngId": "boomerang_support_taskflow",
  "response": "To reset your password, click the 'Forgot Password' link on the login page...",
  "timestamp": 1738630200,
  "actions": [
    {
      "label": "Send Password Reset Email",
      "url": "/api/auth/reset?token=xyz"
    }
  ]
}
```

#### Data Endpoints (CRUD)

```
GET /api/users                  # List all users
GET /api/users/:id              # Get user by ID
POST /api/users                 # Create user
PUT /api/users/:id              # Update user
DELETE /api/users/:id           # Delete user

GET /api/products               # List all products (ecommerce)
POST /api/orders                # Create order
GET /api/orders/:id             # Get order by ID
PUT /api/orders/:id/status      # Update order status

GET /api/pages                  # List all doc pages
POST /api/pages                 # Create page
PUT /api/pages/:id              # Update page
DELETE /api/pages/:id           # Delete page
```

#### Analytics Endpoint

```
GET /api/analytics/summary
Response:
{
  "visitors": 1234,
  "pageViews": 5678,
  "chatSessions": 89,
  "conversionRate": 0.05,
  "dateRange": {
    "start": "2026-01-01",
    "end": "2026-02-03"
  }
}

GET /api/analytics/events?startDate=2026-01-01&endDate=2026-02-03
Response:
[
  {
    "eventName": "page_view",
    "path": "/pricing",
    "timestamp": 1738630080,
    "visitorId": "visitor_abc123"
  },
  ...
]
```

---

## Firestore Schema

All deployments write metadata and user data to Firestore collections.

### Collections

#### `deployments/{deploymentId}`

```typescript
{
  userId: string;                    // Owner's Firestore UID
  subdomain: string;                 // e.g., "taskflow"
  templateType: string;              // 'saas_landing' | 'ecommerce' | ...
  businessName: string;
  
  urls: {
    website: string;                 // https://taskflow.locale.com
    admin: string;
    api: string;
  };
  
  boomerAngId: string;               // Support Boomer_Ang assigned to this site
  chatConfig: {
    greeting: string;
    position: string;
    primaryColor: string;
  };
  
  brandColors?: {
    primary: string;
    secondary?: string;
  };
  
  deployedAt: Timestamp;
  updatedAt: Timestamp;
  status: 'active' | 'paused' | 'deleted';
  
  // Infrastructure
  postgresHost: string;              // Database hostname
  postgresPort: number;
  cloudStorageBucket: string;        // GCS bucket for files
  
  // Metadata
  visitorCount: number;              // Updated daily by analytics
  chatCount: number;
  lastActivityAt?: Timestamp;
}
```

#### `conversations/{conversationId}` (per subdomain)

```typescript
{
  deploymentId: string;              // Foreign key to deployment
  visitorId: string;                 // Visitor or authenticated user ID
  visitorEmail?: string;
  boomerAngId: string;
  
  messages: Array<{
    role: 'visitor' | 'boomer_ang';
    content: string;
    timestamp: Timestamp;
    metadata?: {
      sentiment?: string;
      topics?: string[];
      actions?: Array<{label: string; url: string}>;
    };
  }>;
  
  startedAt: Timestamp;
  endedAt?: Timestamp;
  duration?: number;                 // Seconds
  resolved: boolean;
  
  status: 'active' | 'closed' | 'archived';
}
```

#### `admin_users/{adminId}` (per subdomain)

```typescript
{
  deploymentId: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  createdAt: Timestamp;
  lastLoginAt?: Timestamp;
  permissions?: {
    canEditContent: boolean;
    canManageUsers: boolean;
    canViewAnalytics: boolean;
    canExportData: boolean;
  };
}
```

---

## Implementation Details

### 1. Puter Template Cloning

**Location:** Private method `cloneTemplate(templateType: string)`

- Connects to Puter core instance on Hostinger VPS (port 7000).
- Clones the corresponding template directory (e.g., `/templates/saas_landing/`).
- Returns file structure and assets ready for customization.

**Example:**
```typescript
private async cloneTemplate(templateType: string): Promise<TemplateAssets> {
  const templatePath = `/templates/${templateType}`;
  const clonedPath = `/tmp/deploy_${Date.now()}`;
  
  // Clone via Puter SDK
  const files = await this.puterCore.cloneDirectory(templatePath, clonedPath);
  
  return {
    files: files,
    path: clonedPath,
    components: ['Hero', 'Features', 'Pricing', 'Footer'],  // Detected
    assets: ['logo.png', 'hero-bg.jpg']
  };
}
```

### 2. Branding Injection

**Location:** Private method `applyBranding(template, branding)`

- Replaces placeholder text: `{{ businessName }}`, `{{ tagline }}`, etc.
- Injects brand colors into CSS variables.
- Uploads custom logo/favicon to Cloud Storage.
- Applies custom fonts (or falls back to system defaults).

**Example:**
```typescript
private async applyBranding(template: TemplateAssets, branding: BrandingConfig): Promise<void> {
  // 1. Inject into HTML/React
  let indexHTML = template.files['index.html'];
  indexHTML = indexHTML.replace('{{ businessName }}', branding.businessName);
  indexHTML = indexHTML.replace('{{ tagline }}', branding.tagline || '');
  
  // 2. Update CSS variables
  const cssVars = `
    :root {
      --primary: ${branding.brandColors.primary};
      --secondary: ${branding.brandColors.secondary || '#f5a623'};
    }
  `;
  template.files['styles/vars.css'] = cssVars;
  
  // 3. Upload logo to Cloud Storage
  if (branding.logoUrl) {
    const logoPath = await this.uploadAssetToGCS(branding.logoUrl, 'logos');
    template.files['components/Header.tsx'] = template.files['components/Header.tsx']
      .replace('{{ logoUrl }}', logoPath);
  }
}
```

### 3. Chat Widget Embedding

**Location:** Private method `embedChatWidget(template, chatConfig)`

- Injects the chat widget `<script>` tag into the template.
- Passes the Boomer_Ang ID and API endpoint.
- Configures position, colors, and greeting.

**Example:**
```typescript
private async embedChatWidget(template: TemplateAssets, chatConfig: ChatWidgetConfig): Promise<void> {
  const widgetScript = `
    <script id="locale-chat-widget" defer>
      window.localeChat = {
        boomerAngId: "${chatConfig.boomerAngId}",
        apiEndpoint: "https://api.locale.com/chat",
        greeting: "${chatConfig.greeting}",
        position: "${chatConfig.position || 'bottom-right'}",
        primaryColor: "${chatConfig.primaryColor || '#4A90E2'}"
      };
    </script>
    <script async src="https://cdn.locale.com/chat-widget.js"></script>
  `;
  
  // Inject before </body>
  let html = template.files['index.html'];
  html = html.replace('</body>', widgetScript + '\n</body>');
  template.files['index.html'] = html;
}
```

### 4. Backend Provisioning

**Location:** Private method `provisionBackend(subdomain, dataModels)`

- Creates a new PostgreSQL database instance on the Hostinger VPS.
- Generates Express.js REST API routes for each data model.
- Sets up Firebase Auth integration.
- Deploys API server to Hostinger as a Docker container.

**Example:**
```typescript
private async provisionBackend(subdomain: string, dataModels: string[]): Promise<BackendConfig> {
  // 1. Create PostgreSQL database
  const dbName = `locale_${subdomain.replace('-', '_')}`;
  const dbHost = 'postgres.hostinger.vps';
  const dbUser = `user_${subdomain}`;
  const dbPassword = generateStrongPassword();
  
  await this.createPostgresDB(dbName, dbUser, dbPassword);
  
  // 2. Generate Express API
  const apiCode = this.generateExpressAPI(dataModels, {
    dbName, dbHost, dbUser, dbPassword
  });
  
  // 3. Build Docker image
  const dockerfile = `
    FROM node:20-alpine
    WORKDIR /app
    COPY package.json .
    RUN npm install --production
    COPY . .
    EXPOSE 3000
    CMD ["node", "server.js"]
  `;
  
  // 4. Deploy to Hostinger Docker via GamePanel or docker-compose
  const deployment = await this.deployDockerContainer({
    name: `api_${subdomain}`,
    port: 3000,
    code: apiCode,
    dockerfile: dockerfile,
    env: {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      BOOMER_ANG_ID: chatConfig.boomerAngId
    }
  });
  
  return {
    dbHost, dbPort: 5432, dbName, dbUser,
    apiHost: deployment.url,
    apiPort: 3000
  };
}
```

### 5. Subdomain Deployment

**Location:** Private method `deployToSubdomain(subdomain, files, ssl)`

- Publishes the Next.js frontend to Hostinger web hosting (using existing domain `locale.com`).
- Configures DNS subdomain record.
- Provisions SSL certificate via Let's Encrypt.
- Optionally sets up Cloudflare CDN.

**Example:**
```typescript
private async deployToSubdomain(subdomain: string, files: FileMap, ssl: boolean = true): Promise<DeploymentURLs> {
  // 1. Build Next.js static export
  const nextBuild = await this.buildNextJS(files);  // Produces /out directory
  
  // 2. Deploy to Hostinger web hosting
  const publicURL = `https://${subdomain}.locale.com`;
  await this.uploadToHostinger({
    path: `/home/locale/${subdomain}`,
    files: nextBuild.files
  });
  
  // 3. Configure DNS (if not already done)
  await this.configureSubdomain(subdomain, {
    cname: 'locale.com',
    ttl: 3600
  });
  
  // 4. Provision SSL
  if (ssl) {
    const cert = await this.provisionLetsEncryptCert(`${subdomain}.locale.com`);
    await this.installSSLCert(subdomain, cert);
  }
  
  // 5. (Optional) Set up Cloudflare CDN
  if (this.cdnProvider === 'cloudflare') {
    await this.enableCloudflare({
      domain: `${subdomain}.locale.com`,
      caching: 'aggressive',
      minify: true
    });
  }
  
  return {
    website: publicURL,
    admin: `${publicURL}/admin`,
    api: `https://api.locale.com/${subdomain}`
  };
}
```

### 6. Admin Dashboard Generation

**Location:** Private method `generateAdminDashboard(subdomain, tables, config)`

- Generates a Next.js dashboard app.
- Includes pages for each table (list, detail, edit, create).
- Integrates with Firestore for user management and role-based access.
- Deploys to `{subdomain}.locale.com/admin`.

**Example:**
```typescript
private async generateAdminDashboard(subdomain: string, tables: string[], config: AdminConfig): Promise<void> {
  const dashboardApp = `
    // /app/admin/page.tsx (Next.js 14)
    'use client';
    
    import { useEffect, useState } from 'react';
    import { Firestore } from 'firebase-admin';
    import DataTable from '@/components/DataTable';
    
    export default function AdminDashboard() {
      const [data, setData] = useState({});
      
      useEffect(() => {
        // Fetch analytics, conversations, table previews
        const fetchDashboardData = async () => {
          const snapshot = await firestore
            .collection('deployments')
            .doc('${subdomain}')
            .get();
          setData(snapshot.data());
        };
        fetchDashboardData();
      }, []);
      
      return (
        <div className="admin-dashboard">
          <h1>Admin Dashboard for ${subdomain}</h1>
          <div className="stats-grid">
            <StatTile label="Visitors" value={data.visitorCount} />
            <StatTile label="Chat Sessions" value={data.chatCount} />
          </div>
          <div className="tables-section">
            ${tables.map(table => `<DataTable table="${table}" />`).join('\n            ')}
          </div>
        </div>
      );
    }
  `;
  
  // Build and deploy
  await this.buildAndDeployAdminApp(dashboardApp, subdomain);
}
```

### 7. Metadata Storage

**Location:** Private method `storeDeploymentMetadata(userId, metadata)`

- Writes deployment record to Firestore `deployments` collection.
- Enables future updates, analytics queries, and billing tracking.

**Example:**
```typescript
private async storeDeploymentMetadata(userId: string, metadata: DeploymentMetadata): Promise<string> {
  const deploymentId = `deploy_${Date.now()}`;
  
  await this.firebase
    .firestore()
    .collection('deployments')
    .doc(deploymentId)
    .set({
      userId,
      ...metadata,
      deployedAt: admin.firestore.Timestamp.now(),
      status: 'active'
    });
  
  return deploymentId;
}
```

---

## Tool Registration (for ACHEEVY)

The website builder is exposed to ACHEEVY as a tool called `deploy_user_website`.

### Tool Definition

```typescript
export const DEPLOY_USER_WEBSITE_TOOL = {
  name: "deploy_user_website",
  description: "Deploy a complete website or web app with embedded Boomer_Ang chat, admin dashboard, and backend API. Returns live URLs and credentials.",
  
  parameters: {
    type: "object",
    properties: {
      templateType: {
        type: "string",
        enum: ["saas_landing", "ecommerce", "portfolio", "docs", "custom"],
        description: "Type of website template"
      },
      subdomain: {
        type: "string",
        description: "Desired subdomain (will be subdomain.locale.com)"
      },
      businessName: {
        type: "string",
        description: "Name of the business or product"
      },
      boomerAngId: {
        type: "string",
        description: "ID of the Boomer_Ang to handle visitor chat"
      },
      chatGreeting: {
        type: "string",
        description: "Initial greeting message for chat widget"
      },
      brandColors: {
        type: "object",
        properties: {
          primary: { type: "string", description: "Primary hex color #RRGGBB" },
          secondary: { type: "string" }
        }
      },
      adminEmail: {
        type: "string",
        description: "Email for admin login credentials"
      }
    },
    required: ["templateType", "subdomain", "businessName", "boomerAngId", "chatGreeting", "adminEmail"]
  },
  
  async execute(params: any) {
    const builder = new LocaleWebsiteBuilder(getSDKConfig());
    const result = await builder.deploy({
      userId: params.userId,
      templateType: params.templateType,
      subdomain: params.subdomain,
      businessName: params.businessName,
      chatConfig: {
        boomerAngId: params.boomerAngId,
        greeting: params.chatGreeting,
        primaryColor: params.brandColors?.primary
      },
      brandColors: params.brandColors,
      adminConfig: {
        tables: ['users', 'content', 'orders'],
        analytics: true,
        exportData: true
      }
    });
    
    return result;
  }
};
```

---

## Example Usage (via ACHEEVY)

**User Prompt:**
> "I need a SaaS landing page for my project management app called TaskFlow. Set it up so visitors can chat with support."

**ACHEEVY Internal Process:**

1. Analyzes request → identifies website deployment request.
2. Decides which Boomer_Ang should handle visitor chat → routes to `boomerang_support_taskflow` (creates if needed via Kimi K2.5).
3. Calls `deploy_user_website` tool:
   ```json
   {
     "templateType": "saas_landing",
     "subdomain": "taskflow",
     "businessName": "TaskFlow",
     "boomerAngId": "boomerang_support_taskflow",
     "chatGreeting": "Hi! I'm here to help with TaskFlow. What can I do for you?",
     "brandColors": { "primary": "#4A90E2", "secondary": "#F5A623" },
     "adminEmail": "user@example.com"
   }
   ```

4. SDK deploys in ~30–45 seconds:
   - Clones `saas_landing` template.
   - Injects TaskFlow branding, colors, and chat widget.
   - Provisions PostgreSQL DB + Express API.
   - Builds Next.js and publishes to `taskflow.locale.com`.
   - Generates admin dashboard at `taskflow.locale.com/admin`.
   - Stores metadata in Firestore.

5. Tool returns:
   ```json
   {
     "success": true,
     "deploymentId": "deploy_1738630080",
     "urls": {
       "website": "https://taskflow.locale.com",
       "admin": "https://taskflow.locale.com/admin",
       "api": "https://api.locale.com/taskflow"
     },
     "credentials": {
       "adminEmail": "user@example.com",
       "adminPassword": "<auto-generated, sent via email>"
     },
     "boomerAngId": "boomerang_support_taskflow",
     "status": "active"
   }
   ```

**ACHEEVY Response to User:**
> "I've built your TaskFlow website at **https://taskflow.locale.com**. It's live now! 🚀
> 
> Here's what's ready:
> - **Landing page** with hero, features, pricing, and testimonials
> - **Visitor chat widget** powered by your support Boomer_Ang
> - **Admin dashboard** at https://taskflow.locale.com/admin (login link sent to your email)
> - **REST API** at https://api.locale.com/taskflow for custom integrations
> 
> Visitors can chat with your Boomer_Ang for support, questions, or demos. Want me to customize anything else, like adding your logo or changing the colors?"

---

## Performance & Limits

| Metric | Value | Notes |
|--------|-------|-------|
| **Deployment Time** | 25–45s | Depends on template + customization complexity |
| **Template Size** | ~5 MB | After build optimization |
| **Database** | PostgreSQL | 500 MB default, scalable |
| **Storage** | 10 GB Cloud Storage | For images, files, exports |
| **Chat Messages** | Unlimited | Stored in Firestore + analytics DB |
| **Admin Users** | 5 default | Scalable via role management |
| **API Requests** | Per subscription tier | Free: 100/day, Pro: 1000/day, Enterprise: Unlimited |
| **Subdomain Quota** | 10 per user (Free), Unlimited (Enterprise) | |

---

## Security & Compliance

### Data Isolation
- Each deployment is assigned a dedicated PostgreSQL database schema.
- Boomer_Ang chat tokens are user-specific and scoped to the deployment.
- Firestore rules enforce that only the deployment owner can read/write metadata.

### SSL/TLS
- All subdomains use Let's Encrypt auto-renewal.
- API endpoint uses HTTPS with certificate pinning.

### Rate Limiting
- Chat API: 100 requests/minute per visitor session.
- Admin API: 1000 requests/minute per admin user.
- Overage returns HTTP 429 (Too Many Requests).

### Backup & Recovery
- Automatic daily backups of PostgreSQL databases.
- Firestore automatic snapshots (Google-managed).
- 30-day backup retention for disaster recovery.

---

## FAQ

**Q: Can I use my own domain instead of `locale.com`?**  
A: Not yet. Future release will support custom domain CNAME mapping.

**Q: Can I customize the HTML/CSS beyond branding colors?**  
A: Yes, via the `customCSS` and `customHTML` config options, or by cloning and modifying a template directly.

**Q: What happens if I delete a deployment?**  
A: The site becomes inaccessible, but data is retained in backups for 30 days. Admin can request recovery via support.

**Q: Can the chat widget integrate with a different LLM?**  
A: Currently wired to the assigned Boomer_Ang (which uses Kimi K2.5 or Gemini 3 Flash). Custom integrations available on Enterprise tier.

**Q: How do I export all my site data?**  
A: Via the admin dashboard → Settings → "Export All Data" (CSV, JSON, or PDF).

---

## Roadmap

- [ ] Custom domain support (Q1 2026)
- [ ] Multi-language template variants (Q2 2026)
- [ ] Advanced analytics with ML-driven insights (Q2 2026)
- [ ] A/B testing framework (Q3 2026)
- [ ] Headless CMS mode (Q3 2026)
- [ ] Mobile app companion (Q4 2026)

---

## Support & Feedback

For issues, feature requests, or documentation updates, contact the A.I.M.S. team or open an issue on the internal Locale repo.

**Status:** This SDK is actively maintained and production-ready.  
**Last Updated:** February 3, 2026
