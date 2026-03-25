/**
 * Ecosystem Network Types — Schema for .ecosystem.json files
 * 
 * These types define the structure of the network manifest and
 * per-repo ecosystem configuration files.
 */

export interface EcosystemNetwork {
  $schema: string;
  name: string;
  version: string;
  hub: string;
  updated: string;
  description: string;
  nodes: Record<string, EcosystemNode>;
  edges: EcosystemEdge[];
  shared_contracts: Record<string, SharedContract>;
}

export interface EcosystemNode {
  role: 'hub' | 'platform' | 'gateway' | 'app' | 'marketing' | 'vertical' | 'agent' | 'service';
  description: string;
  repo: string;
  provides: string[];
  consumes: string[];  // format: "node/capability"
  ports: Record<string, number>;
  tags: string[];
}

export interface EcosystemEdge {
  from: string;
  to: string;
  type: 'routes-through' | 'invokes' | 'embeds' | 'inherits' | 'proxies' | 'streams' | 'authenticates' | 'links-to' | 'uses-plugs' | 'delegates-chat' | 'orchestrates' | 'references';
  protocol: string;
}

export interface SharedContract {
  provider: string;
  method: string;
  endpoints?: Record<string, string>;
  routes?: Record<string, string>;
  topics?: string[];
  token_format?: string;
  consumers: string[];
}

// Per-repo .ecosystem.json schema
export interface RepoEcosystemConfig {
  node: string;
  role: EcosystemNode['role'];
  network: string;
  version: string;
  description: string;
  provides: RepoProvision[];
  consumes: RepoConsumption[];
  connections: Record<string, RepoConnection>;
  file_index?: Record<string, string[]>;
}

export interface RepoProvision {
  name: string;
  path: string;
  description: string;
}

export interface RepoConsumption {
  node: string;
  capability: string;
  endpoint?: string;
}

export interface RepoConnection {
  type: string;
  purpose: string;
}
