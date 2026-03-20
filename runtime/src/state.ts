export interface GrammarState {
  // Input
  rawIntent: string;
  
  // Normalized intent
  normalizedObjective?: string;
  constraints?: string[];
  inputs?: any;
  blocked?: boolean;
  blockReason?: string;

  // Governed Context
  contextPack?: {
    approved: boolean;
    policyConstraints: string[];
    semanticEmbeddings: any[];
    history: any[];
  };

  // Routing
  assignedCapability?: string;
  targetProvider?: string;
  estimatedCostTokens?: number;

  // Execution
  boardState: 'planning' | 'running' | 'review' | 'blocked' | 'approved' | 'packaged' | 'delivered';
  specialistLogs: any[];
  currentDraft?: string;
  
  // Validation
  validationErrors?: string[];
  hallucinationScore?: number;
  approvedForAssembly?: boolean;
  
  // Final Assembly
  finalArtifact?: string;
  
  // KYB Packaging
  manifest?: {
    serialId: string;
    evidence: any[];
    auditPath: string;
  };
}
