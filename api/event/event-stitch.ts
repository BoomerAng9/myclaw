/**
 * Event Stitch Module
 * Uses InsForge (Stitch layer) to coordinate event data across the AIMS ecosystem.
 * Mirrors the RuntimeStitcher pattern from acheevy.digital/backend/insforge-stitching.ts
 */
import { insforge } from '../insforge';

interface StitchPayload {
  type: 'attendee' | 'sponsor' | 'payment_confirmed';
  [key: string]: any;
}

/**
 * Stitch an event lead into the AIMS ecosystem via InsForge.
 * Logs an unforgeable trace to acheevy_traces and syncs to the central ledger.
 */
export async function stitchEventLead(payload: StitchPayload): Promise<void> {
  const traceId = `ctih-${payload.type}-${Date.now()}`;

  try {
    // 1. Log trace to InsForge acheevy_traces (unforgeable audit trail)
    await insforge.from('acheevy_traces').insert({
      trace_id: traceId,
      engine: 'event-stitch',
      action: `event.${payload.type}`,
      payload: JSON.stringify(payload),
      resolution: `Lead stitched: ${payload.type} — ${payload.email || payload.registrationId || 'unknown'}`,
      status: 'completed',
      timestamp: new Date().toISOString()
    });

    // 2. Sync lead to AIMS central ledger
    if (payload.type === 'attendee' || payload.type === 'sponsor') {
      await insforge.from('aims_leads').insert({
        source: 'ctih-hackathon',
        lead_type: payload.type,
        email: payload.email,
        name: payload.name || payload.contact_name,
        company: payload.company || payload.company_name,
        metadata: JSON.stringify({
          event: 'Coastal Talent and Innovation Hack-A-Thon',
          ticketType: payload.ticketType,
          tierInterest: payload.tier_interest,
          trackInterest: payload.trackInterest,
          utmSource: payload.source
        }),
        created_at: new Date().toISOString()
      });
    }

    // 3. On payment confirmation, update lead status
    if (payload.type === 'payment_confirmed') {
      await insforge.from('aims_leads')
        .update({ status: 'converted', converted_at: new Date().toISOString() })
        .eq('source', 'ctih-hackathon')
        .eq('email', payload.email);
    }

    console.log(`[event-stitch] Trace ${traceId} stitched successfully`);
  } catch (err: any) {
    console.error(`[event-stitch] Trace ${traceId} failed:`, err.message);
    // Non-blocking — don't fail the parent request
  }
}
