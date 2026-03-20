export const LUC_SERVICE_KEYS = {
  // LLM Pricing Trackers 
  LLM_TOKENS_IN: 'llm_tokens_in',
  LLM_TOKENS_OUT: 'llm_tokens_out',
  
  // Workflow Trackers
  N8N_EXECUTIONS: 'n8n_executions',
  NODE_RUNTIME_SECONDS: 'node_runtime_seconds',
  SWARM_CYCLES: 'swarm_cycles',
  
  // Real Estate App Usage Metric
  LUC_DEAL_ANALYSIS: 'luc_deal_analysis',
  
  // Voice, Network, etc
  VOICE_CHARS: 'voice_chars',
  CONTAINER_HOURS: 'container_hours',

  // ─── KYB Onboarding Governance ───────────────────────────────
  KYB_REGISTRATIONS: 'kyb_registrations',           // New Boomer_Ang births
  KYB_REVIEW_ESCALATIONS: 'kyb_review_escalations', // High-risk → Ops_Ang manual review
  KYB_ANCHOR_HASHES: 'kyb_anchor_hashes',           // Anchor Chain entries committed
  KYB_DECOMMISSIONS: 'kyb_decommissions',            // Death certificates issued

  // ─── Stepper Automation Tracking ─────────────────────────────
  STEPPER_WEBHOOK_CALLS: 'stepper_webhook_calls',   // Inbound payloads from Stepper
  STEPPER_COMPONENT_RUNS: 'stepper_component_runs', // Reusable Component executions

  // ─── Paperform Tracking ──────────────────────────────────────
  PAPERFORM_SUBMISSIONS: 'paperform_submissions',    // Raw form submissions received
  
  // ─── Spoke Manifest ──────────────────────────────────────────
  SPOKE_MYCLAW: 'spoke_myclaw',      // myclaw.foai.cloud
  SPOKE_PERFORM: 'spoke_perform',    // perform.foai.cloud
  SPOKE_BLOCKWISE: 'spoke_blockwise' // blockwise.foai.cloud
};

export const DEFAULT_LUC_QUOTAS = {
  FREE_TIER: {
    limit_deals_per_month: 5,
    limit_kyb_registrations_per_month: 2,
    limit_stepper_webhooks_per_month: 20
  },
  STARTER_TIER: {
    limit_deals_per_month: 50,
    limit_kyb_registrations_per_month: 25,
    limit_stepper_webhooks_per_month: 500
  },
  PRO_TIER: {
    limit_deals_per_month: -1, // Unlimited
    limit_kyb_registrations_per_month: -1,
    limit_stepper_webhooks_per_month: -1,
    limit_spokes_per_account: -1
  }
};

// ─── KYB Standard Constants ─────────────────────────────────────
export const KYB_PHASES = {
  REGISTRATION: 'REGISTRATION',
  EXECUTION: 'EXECUTION',
  TRAINING: 'TRAINING',
  DECOMMISSION: 'DECOMMISSION'
} as const;

export const KYB_ROUTING_DECISIONS = {
  APPROVED_STANDARD: 'Approved_Standard',
  OPS_MANUAL_REVIEW: 'Ops_Ang_Manual_Review',
  AUTO_REJECTED: 'Auto_Rejected',
  PENDING_EVIDENCE: 'Pending_Evidence'
} as const;

export const KYB_RISK_THRESHOLDS = {
  LOW: 0.3,    // Auto-approve
  MEDIUM: 0.6, // Flagged but proceed
  HIGH: 0.85   // Escalate to Ops_Ang
} as const;
