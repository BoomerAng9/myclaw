/**
 * POST /api/luc/simulate
 * 
 * Simulates a capability cost analysis through the CFO_Ang LUC engine.
 * Or conditionally executes a live record via the isLive flag.
 */

import { LucAdapters } from '../luc.adapters';
import { LucEstimateInputSchema } from '../luc.schemas';

export async function handleSimulate(req: {
  body: any;
  headers?: Record<string, string>;
}): Promise<{ status: number; body: any }> {
  try {
    // 1. Validate input against standard schemas
    const parsed = LucEstimateInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return {
        status: 400,
        body: {
          error: 'VALIDATION_ERROR',
          message: 'Invalid parameters',
          details: parsed.error.flatten()
        }
      };
    }

    const { useramountid, ...rest } = parsed.data;
    
    // Fallback if UI doesn't supply it
    const finalUserId = useramountid || req.headers?.['x-aims-user'] || 'ua_default';

    // Check if UI is requesting a live test execution
    const isLive = req.body?.isLive === true;

    // 2. Gateway adapter route
    const result = await LucAdapters.simulateOrRecordGating(
      { ...rest, useramountid: finalUserId },
      { useramountid: finalUserId, isLive }
    );

    return {
      status: 200,
      body: result
    };
  } catch (err: any) {
    if (err.message?.includes('Usage blocked')) {
      return {
        status: 429,
        body: {
          error: 'QUOTA_EXCEEDED',
          message: err.message
        }
      };
    }

    return {
      status: 500,
      body: {
        error: 'INTERNAL_ERROR',
        message: err.message || 'Simulation execution failed'
      }
    };
  }
}

/**
 * GET /api/luc/status
 * 
 * Returns current quota state for the authenticated user.
 */
export async function handleStatus(req: {
  headers?: Record<string, string>;
}): Promise<{ status: number; body: any }> {
  try {
    const useramountid = req.headers?.['x-aims-user'] || 'ua_default';
    const { LucStorage } = await import('../luc.storage');
    const state = LucStorage.getAccountState(useramountid);
    return { status: 200, body: state };
  } catch (err: any) {
    return {
      status: 500,
      body: { error: 'INTERNAL_ERROR', message: err.message }
    };
  }
}

/**
 * GET /api/luc/events
 * 
 * Returns usage event history for the authenticated user.
 */
export async function handleEvents(req: {
  headers?: Record<string, string>;
  query?: Record<string, string>;
}): Promise<{ status: number; body: any }> {
  try {
    const useramountid = req.headers?.['x-aims-user'] || 'ua_default';
    const service_key = req.query?.service || undefined;
    const { LucStorage } = await import('../luc.storage');

    const events = service_key
      ? LucStorage.getEventsByService(useramountid, service_key)
      : LucStorage.getEvents(useramountid);

    return { status: 200, body: { events, count: events.length } };
  } catch (err: any) {
    return {
      status: 500,
      body: { error: 'INTERNAL_ERROR', message: err.message }
    };
  }
}
