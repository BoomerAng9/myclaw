/// <reference types="node" />
import { createHash, randomBytes } from 'node:crypto';
import { 
  KYBOnboardPayload, 
  KYBFlightRecorderEntry,
  validateKYBPayload, 
  classifyRiskTier, 
  determineRoutingDecision 
} from '../Validation/kyb-onboard.schema';
import { insforge } from '../../../../../api/insforge';

const KYB_PHASES = { REGISTRATION: 'REGISTRATION' } as const;

/**
 * KYB (Know Your Boomer_Ang) Onboarding Webhook — V2

 * 
 * Pipeline: Paperform → Stepper → THIS ENDPOINT → LUC Flight Recorder
 * 
 * Responsibilities:
 *  1. Authenticate the Stepper webhook (Bearer token)
 *  2. Validate the payload against the KYB schema
 *  3. Classify risk tier and determine routing decision
 *  4. Generate the serial ID and input hash
 *  5. Write the Flight Recorder entry to LUC
 *  6. Return the serial ID + hash to Stepper for downstream use
 */
export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    // ── 1. Authenticate Stepper ──────────────────────────────────
    const authHeader = req.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.INTERNAL_API_KEY}`) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    // ── 2. Parse & Validate ──────────────────────────────────────
    const body = await req.json();
    const validation = validateKYBPayload(body);

    if (!validation.valid) {
      return jsonResponse({ 
        error: 'Payload validation failed', 
        details: validation.errors 
      }, 400);
    }

    const payload = body as KYBOnboardPayload;

    // ── 3. Risk Classification ───────────────────────────────────
    const riskTier = classifyRiskTier(payload.outcomeScore);
    const routingDecision = determineRoutingDecision(riskTier);

    // ── 4. Generate Immutable Identifiers ────────────────────────
    const rawDataString = JSON.stringify(payload);
    const inputHash = createHash('sha256').update(rawDataString).digest('hex');

    const year = new Date().getFullYear();
    const randomHex = randomBytes(4).toString('hex').toUpperCase();
    const serialId = `ANG-${year}-${randomHex}`;

    // ── 5. Construct the Flight Recorder Entry ───────────────────
    const executionTimeMs = Date.now() - startTime;

    const flightRecorderEntry: KYBFlightRecorderEntry = {
      timestamp: new Date().toISOString(),
      eventId: `kyb-onboard-${payload.submissionId}`,
      angSerialId: serialId,
      executionLog: {
        phase: KYB_PHASES.REGISTRATION,
        inputHash,
        outcomeScore: payload.outcomeScore,
        outcomeLabel: payload.outcomeLabel
      },
      routingDecision: routingDecision as any,
      verificationResults: {
        payloadValid: true,
        requiredFieldsPresent: true,
        riskTierAssigned: riskTier
      },
      costMetrics: {
        tokensUsed: 0,
        executionTimeMs
      }
    };

    // ── 6. Write to LUC / InsForge ───────────────────────────────
    let dbStatus = 'skipped';
    if (process.env.INSFORGE_URL) {
      try {
        const { error } = await insforge.from('kyb_ledger').insert({
          serial_id: serialId,
          owner_email: payload.ownerEmail,
          boomer_ang_name: payload.boomerAngName,
          risk_tier: riskTier,
          routing_decision: routingDecision,
          input_hash: inputHash,
          flight_recorder_entry: flightRecorderEntry
        });
        if (error) throw error;
        dbStatus = 'success';
      } catch (e: any) {
        console.error('[KYB Governance] Failed writing to InsForge:', e.message);
        dbStatus = 'failed';
      }
    }

    console.log(`[KYB Governance] ✓ New Boomer_Ang Registered`);
    console.log(`  Serial: ${serialId}`);
    console.log(`  Owner: ${payload.ownerEmail}`);
    console.log(`  Name: ${payload.boomerAngName}`);
    console.log(`  Risk: ${riskTier} → ${routingDecision}`);
    console.log(`  Hash: ${inputHash.substring(0, 16)}...`);
    console.log(`  DB State: ${dbStatus}`);

    // ── 7. Construct the Public Passport (KYB Tier 1) ────────────
    const publicPassport = {
      serialId,
      displayName: payload.boomerAngName,
      version: '1.0.0',
      category: payload.primarySkill,
      capabilities: {
        primarySkill: payload.primarySkill,
        supportedCapabilities: payload.capabilities,
        limitations: payload.limitations
      },
      verificationBadges: {
        technical: false,    // Pending first execution
        security: false,     // Pending vulnerability scan
        ethics: false        // Pending alignment check
      },
      privacyPolicy: {
        dataRetention: payload.privacy.dataRetention,
        humanReview: payload.privacy.humanReviewPolicy,
        modelUsage: payload.privacy.modelTrainingOptOut ? 'Data not used for training' : 'Data may be used for training'
      },
      status: riskTier === 'HIGH' ? 'Pending_Review' : 'Active'
    };

    // ── 8. Respond to Stepper ────────────────────────────────────
    return jsonResponse({
      success: true,
      message: 'KYB Registration logged to LUC Flight Recorder',
      serialId,
      inputHash,
      riskTier,
      routingDecision,
      publicPassport,
      flightRecorderEntry
    }, 200);

  } catch (error) {
    console.error('[KYB Webhook Error]', error);
    return jsonResponse({ error: 'Internal Server Error' }, 500);
  }
}

// ── Helper ─────────────────────────────────────────────────────────
function jsonResponse(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
