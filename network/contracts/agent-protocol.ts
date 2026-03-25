/**
 * Shared Agent Protocol — Contract between all services and Agent-ACHEEVY-009
 * 
 * This file defines the TypeScript interfaces for cross-repo communication.
 * Each repo that consumes the agent API should reference these types.
 */

// === Auth Contract (provider: AIMS) ===
export interface EcosystemUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin' | 'agent';
  activeVerticals: string[];  // e.g., ['destinations-ai', 'estatemind-ai']
  token: string;              // Firebase JWT
}

// === Agent Protocol (provider: Agent-ACHEEVY-009) ===
export interface AgentRequest {
  sessionId: string;
  userId: string;
  message: string;
  context?: {
    vertical?: 'destinations' | 'estatemind' | 'general';
    tools?: string[];         // MCP tools to enable
    history?: ChatMessage[];
  };
  stream?: boolean;           // true = WebSocket stream
}

export interface AgentResponse {
  sessionId: string;
  messageId: string;
  content: string;
  role: 'assistant' | 'system';
  metadata?: {
    tokensUsed: number;
    model: string;
    tools_called: string[];
    vertical?: string;
  };
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// === Gateway Contract (provider: Chicken-Hawk) ===
export interface GatewayRoute {
  path: string;
  target: string;
  methods: ('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH')[];
  auth: boolean;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
}

export const GATEWAY_ROUTES: Record<string, GatewayRoute> = {
  aims: {
    path: '/api/aims/*',
    target: 'aims:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    auth: true,
  },
  agent: {
    path: '/api/agent/*',
    target: 'agent-acheevy-009:8000',
    methods: ['GET', 'POST'],
    auth: true,
    rateLimit: { requests: 60, windowMs: 60000 },
  },
  chat: {
    path: '/api/chat/*',
    target: 'grammar:3003',
    methods: ['GET', 'POST'],
    auth: true,
  },
  destinations: {
    path: '/api/destinations/*',
    target: 'destinations-ai:3001',
    methods: ['GET', 'POST'],
    auth: true,
  },
  estate: {
    path: '/api/estate/*',
    target: 'estatemind-ai:3002',
    methods: ['GET', 'POST'],
    auth: true,
  },
};

// === Event Bus Contract (provider: myclaw/Firebase) ===
export type EventTopic = 'user.action' | 'agent.task' | 'vertical.update' | 'deploy.status';

export interface EcosystemEvent<T = unknown> {
  topic: EventTopic;
  source: string;   // node name from ecosystem-network.json
  payload: T;
  timestamp: string;
  traceId: string;
}

// === Vertical Registration ===
export interface VerticalManifest {
  id: string;
  name: string;
  description: string;
  repo: string;
  apiBase: string;
  port: number;
  capabilities: string[];
  status: 'active' | 'development' | 'deprecated';
}

export const VERTICALS: VerticalManifest[] = [
  {
    id: 'destinations-ai',
    name: 'Destinations AI',
    description: 'AI-powered travel and destinations intelligence',
    repo: 'BoomerAng9/destinations-ai',
    apiBase: '/api/destinations',
    port: 3001,
    capabilities: ['trip-planning', 'destination-search', 'travel-insights'],
    status: 'development',
  },
  {
    id: 'estatemind-ai',
    name: 'EstateMind AI',
    description: 'AI-powered real estate intelligence',
    repo: 'BoomerAng9/estatemind-ai',
    apiBase: '/api/estate',
    port: 3002,
    capabilities: ['property-analysis', 'market-insights', 'investment-scoring'],
    status: 'development',
  },
];
