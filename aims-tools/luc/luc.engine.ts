import { LucEstimateInput, LucUsageRecord } from './luc.schemas';
import { LucStorage } from './luc.storage';

export class LucEngine {
  /**
   * Projects usage/costs without mutating state.
   * Incorporates AIMS VPS Ecosystem 'ByteRover' pattern:
   * 1. Ingest Prompt/Capability
   * 2. Estimate base cost
   * 3. Apply discount if pattern exists
   */
  static estimate(input: LucEstimateInput): any {
    const hasPattern = input.context_factors?.has_pattern_match || false;
    const discountMultiplier = hasPattern ? (Math.random() * (0.85 - 0.60) + 0.60) : 1.0;
    const finalEstimate = Math.round(input.units_estimate * discountMultiplier);
    const discountPercentage = hasPattern ? Math.round((1 - discountMultiplier) * 100) : 0;

    // Pull current state for projection
    const state = LucStorage.getAccountState(input.useramountid);
    const currentUsed = state.quotas[input.service_key]?.used || 0;

    return {
      units_estimate: input.units_estimate,
      projected_used: currentUsed + finalEstimate,
      projected_overage_units: Math.max(0, (currentUsed + finalEstimate) - (state.quotas[input.service_key]?.limit || 99999)),
      confidence: 0.95,
      discount_applied: hasPattern,
      discount_percentage: discountPercentage,
      ui_breakdown: {
        service: input.service_key,
        cost_estimated: finalEstimate,
        current_used: currentUsed,
        limit: state.quotas[input.service_key]?.limit || 99999,
        discounts: hasPattern ? `${discountPercentage}% reuse discount applied` : 'None'
      }
    };
  }

  /**
   * Hard gate before tool runs. Reads from persistent quota state.
   */
  static canExecute(useramountid: string, service_key: string, units_estimate: number) {
    return LucStorage.checkQuota(useramountid, service_key, units_estimate);
  }

  /**
   * Appends usage event and updates aggregates persistently.
   */
  static recordUsage(record: LucUsageRecord) {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // 1. Append immutable event
    LucStorage.appendEvent({
      event_id: eventId,
      useramountid: record.useramountid,
      service_key: record.service_key,
      units_actual: record.units_actual,
      metadata: record.metadata || {},
      timestamp: new Date().toISOString()
    });

    // 2. Update running quota aggregate
    const updatedState = LucStorage.updateQuota(
      record.useramountid,
      record.service_key,
      record.units_actual
    );

    return {
      success: true,
      event_id: eventId,
      service_key: record.service_key,
      units_recorded: record.units_actual,
      luc_state: {
        plan_id: updatedState.plan_id,
        quota_snapshot: updatedState.quotas[record.service_key] || null,
        period_end: updatedState.period_end
      }
    };
  }
}
