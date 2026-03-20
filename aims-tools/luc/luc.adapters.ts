import { LucEngine } from './luc.engine';
import { LucEstimateInput, LucUsageRecord } from './luc.schemas';

/**
 * LUC Adapters bridge the headless purely-functional LUC Engine to 
 * the orchestration layers, HTTP APIs, and specific agent behaviors.
 */
export const LucAdapters = {
  
  /**
   * For the Workspace LUC Visualizer (Simulate Mode or Live Record Mode)
   */
  simulateOrRecordGating: async (input: LucEstimateInput, context: { useramountid: string, isLive: boolean }) => {
    // 1. Run the headless estimator
    const estimateResult = LucEngine.estimate({
      useramountid: context.useramountid,
      service_key: input.service_key,
      units_estimate: input.units_estimate,
      context_factors: input.context_factors
    });

    let liveGateResponse = null;
    let liveRecordResponse = null;

    // 2. If 'isLive' flag checked, actually process the gated usage transaction
    if (context.isLive) {
      // Gate check
      const gateCheck = LucEngine.canExecute(
        context.useramountid,
        input.service_key,
        estimateResult.units_estimate
      );

      liveGateResponse = gateCheck;

      if (!gateCheck.allowed) {
        throw new Error(`Usage blocked by CFO_Ang: ${gateCheck.reason_code} - ${gateCheck.ui_banner}`);
      }

      // Record it
      liveRecordResponse = LucEngine.recordUsage({
        useramountid: context.useramountid,
        service_key: input.service_key,
        units_actual: estimateResult.units_estimate,
        metadata: { caller: 'luc_workspace_simulator', pattern_matched: input.context_factors?.has_pattern_match }
      });
    }

    return {
      simulation: estimateResult,
      isLive: context.isLive,
      liveGateResponse,
      liveRecordResponse
    };
  },

  /**
   * Standard Orchestrator Wrap — typically used by n8n or ACHEEVY before firing an action
   */
  enforceQuotaAndRecord: async (
    useramountid: string,
    service_key: string,
    units_estimate: number,
    executionCallback: () => Promise<any>,
    metadata: any = {}
  ) => {
    // 1. CFO_Ang Gate
    const gate = LucEngine.canExecute(useramountid, service_key, units_estimate);
    if (!gate.allowed) {
      throw new Error(`Task blocked by LUC CFO_Ang gate limit [${service_key}].`);
    }

    // 2. Run the payload Capability
    const capabilityResult = await executionCallback();

    // 3. Post-execution actuals recording (assuming units_actual equals estimate in this block for simplicity)
    const recordResult = LucEngine.recordUsage({
      useramountid,
      service_key,
      units_actual: units_estimate,
      metadata: { ...metadata, gateReason: gate.reason_code }
    });

    return {
      capabilityResult,
      usageRecorded: recordResult
    };
  }
};
