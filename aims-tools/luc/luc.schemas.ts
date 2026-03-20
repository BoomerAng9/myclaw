import { z } from 'zod';

export const LucEstimateInputSchema = z.object({
  useramountid: z.string(),
  service_key: z.string(),
  units_estimate: z.number(),
  context_factors: z.record(z.any()).optional()
});
export type LucEstimateInput = z.infer<typeof LucEstimateInputSchema>;

export const LucUsageRecordSchema = z.object({
  useramountid: z.string(),
  service_key: z.string(),
  units_actual: z.number(),
  metadata: z.record(z.any()).optional()
});
export type LucUsageRecord = z.infer<typeof LucUsageRecordSchema>;

export const QuotaStateSchema = z.object({
  useramountid: z.string(),
  plan_id: z.string(),
  period_start: z.string(),
  period_end: z.string(),
  quotas: z.record(z.object({
    limit: z.number(),
    used: z.number(),
    overage_units: z.number()
  })),
  overage_policy: z.object({
    soft_warn_pct: z.number(),
    hard_block_pct: z.number()
  })
});
export type QuotaState = z.infer<typeof QuotaStateSchema>;
