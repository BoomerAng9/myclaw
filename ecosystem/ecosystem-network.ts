/**
 * AIMS Ecosystem Network — Dynamic repo interconnection layer
 * 
 * This module provides the shared types and runtime helpers for
 * cross-repo communication within the AIMS ecosystem.
 */

export interface EcosystemNode {
  repo: string;
  role: 'hub' | 'platform-core' | 'service' | 'frontend' | 'agent' | 'documentation';
  label: string;
  description: string;
  provides: string[];
  consumes: string[];
}

export interface EcosystemEdge {
  from: string;
  to: string;
  type: 'orchestrates' | 'consumes' | 'documents';
  label: string;
}

export interface EcosystemManifest {
  $schema: string;
  name: string;
  version: string;
  hub: string;
  nodes: Record<string, EcosystemNode>;
  edges: EcosystemEdge[];
  branding: {
    logo: string;
    icon: string;
    chatIcon: string;
    colors: {
      primary: string;
      primaryDark: string;
      surface: string;
      surfaceGlass: string;
      accent: string;
      text: string;
    };
  };
}

export interface NodeManifest {
  $schema: string;
  nodeId: string;
  repo: string;
  role: EcosystemNode['role'];
  label: string;
  description: string;
  provides: string[];
  consumes: string[];
  endpoints?: Record<string, string>;
  hub: string;
  peers: string[];
}

/** Resolve which peer repos a given node needs at runtime */
export function resolveDependencies(
  manifest: EcosystemManifest,
  nodeId: string
): EcosystemNode[] {
  const node = manifest.nodes[nodeId];
  if (!node) throw new Error(`Unknown node: ${nodeId}`);

  const needed = new Set(node.consumes);
  return Object.values(manifest.nodes).filter((peer) =>
    peer.provides.some((p) => needed.has(p))
  );
}

/** Get all edges involving a specific node */
export function getNodeEdges(
  manifest: EcosystemManifest,
  nodeId: string
): EcosystemEdge[] {
  return manifest.edges.filter(
    (e) => e.from === nodeId || e.to === nodeId
  );
}

/** ACHEEVY helmet icon path — used as chat interface icon everywhere */
export const ACHEEVY_CHAT_ICON = 'assets/branding/acheevy-helmet.png';

/** AIMS brand colors */
export const AIMS_COLORS = {
  primary: '#C8A84E',
  primaryDark: '#8B7635',
  surface: '#1A1A2E',
  surfaceGlass: 'rgba(26,26,46,0.85)',
  accent: '#FFD700',
  text: '#FFFFFF',
} as const;
