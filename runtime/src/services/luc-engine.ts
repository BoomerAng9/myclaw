/**
 * LUC — Ledger Usage Calculator (Headless Engine)
 *
 * The metering brain for Chicken Hawk / SuperClaw.
 * estimate() → canExecute() → recordUsage()
 *
 * Service keys are customized per project:
 *   tokens_in, tokens_out, voice_minutes, container_hours, storage_gb
 *
 * Soft warn @ 80%, hard block @ 110%.
 * Tenant-aware quotas stored in InsForge.
 */

// ─── Types ──────────────────────────────────────────────────────

export interface ServiceKey {
  key: string;          // e.g. 'tokens_in', 'voice_minutes'
  used: number;
  limit: number;
  unit: string;         // e.g. 'tokens', 'minutes', 'hours', 'GB'
}

export interface UsageEstimate {
  serviceKey: string;
  projectedCost: number;
  projectedUsage: number;
  remainingBudget: number;
  warningLevel: 'none' | 'soft' | 'hard';
}

export interface UsageRecord {
  tenantId: string;
  serviceKey: string;
  amount: number;
  timestamp: string;
  actionId: string;
}

export interface LucGateResult {
  allowed: boolean;
  reason: string;
  warningLevel: 'none' | 'soft' | 'hard';
  currentPercent: number;
}

// ─── Engine ─────────────────────────────────────────────────────

export class LucEngine {
  private quotas: Map<string, ServiceKey> = new Map();
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  /**
   * Load quotas from InsForge or local config.
   * In production, this reads from the InsForge `luc_quotas` table.
   */
  async loadQuotas(quotas: ServiceKey[]): Promise<void> {
    for (const q of quotas) {
      this.quotas.set(q.key, { ...q });
    }
    console.log(`[LUC] Loaded ${quotas.length} service key(s) for tenant ${this.tenantId}`);
  }

  /**
   * estimate() — Projects the cost/usage of a pending action
   * WITHOUT executing it. Returns the projected state.
   */
  estimate(serviceKey: string, projectedAmount: number): UsageEstimate {
    const quota = this.quotas.get(serviceKey);
    if (!quota) {
      return {
        serviceKey,
        projectedCost: projectedAmount,
        projectedUsage: projectedAmount,
        remainingBudget: 0,
        warningLevel: 'hard',
      };
    }

    const projectedTotal = quota.used + projectedAmount;
    const percent = (projectedTotal / quota.limit) * 100;
    const remaining = quota.limit - projectedTotal;

    let warningLevel: 'none' | 'soft' | 'hard' = 'none';
    if (percent >= 110) warningLevel = 'hard';
    else if (percent >= 80) warningLevel = 'soft';

    return {
      serviceKey,
      projectedCost: projectedAmount,
      projectedUsage: projectedTotal,
      remainingBudget: Math.max(0, remaining),
      warningLevel,
    };
  }

  /**
   * canExecute() — The HARD GATE. Returns whether the action
   * is allowed to proceed. Blocks at 110%.
   */
  canExecute(serviceKey: string, requestedAmount: number): LucGateResult {
    const quota = this.quotas.get(serviceKey);

    if (!quota) {
      return {
        allowed: false,
        reason: `Service key "${serviceKey}" not registered for tenant ${this.tenantId}.`,
        warningLevel: 'hard',
        currentPercent: 0,
      };
    }

    const projectedTotal = quota.used + requestedAmount;
    const percent = (projectedTotal / quota.limit) * 100;

    if (percent >= 110) {
      return {
        allowed: false,
        reason: `HARD BLOCK: ${serviceKey} would reach ${percent.toFixed(1)}% of limit (${quota.limit} ${quota.unit}). Action denied.`,
        warningLevel: 'hard',
        currentPercent: percent,
      };
    }

    let warningLevel: 'none' | 'soft' | 'hard' = 'none';
    let reason = `OK: ${serviceKey} at ${percent.toFixed(1)}%.`;

    if (percent >= 80) {
      warningLevel = 'soft';
      reason = `SOFT WARNING: ${serviceKey} at ${percent.toFixed(1)}% of limit. Proceed with caution.`;
    }

    return {
      allowed: true,
      reason,
      warningLevel,
      currentPercent: percent,
    };
  }

  /**
   * recordUsage() — Logs the actual usage AFTER the action completes.
   * Updates the in-memory quota and returns the record for InsForge persistence.
   */
  recordUsage(serviceKey: string, amount: number, actionId: string): UsageRecord {
    const quota = this.quotas.get(serviceKey);

    if (quota) {
      quota.used += amount;
      this.quotas.set(serviceKey, quota);
    }

    const record: UsageRecord = {
      tenantId: this.tenantId,
      serviceKey,
      amount,
      timestamp: new Date().toISOString(),
      actionId,
    };

    console.log(`[LUC] Recorded: ${amount} ${quota?.unit || 'units'} of ${serviceKey} for action ${actionId}`);
    return record;
  }

  /**
   * Returns a snapshot of all current quotas for dashboard display.
   */
  getSnapshot(): ServiceKey[] {
    return Array.from(this.quotas.values());
  }
}
