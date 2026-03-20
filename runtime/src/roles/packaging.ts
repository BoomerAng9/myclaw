import { GrammarState } from '../state';
import { randomUUID } from 'crypto';
import { KybFlightRecorder } from '../services/kyb_flight_recorder';

/**
 * Packaging Role: Prepares manifests, evidence, and handoff bundles.
 * This satisfies the KYB (Know Your Bot) Flight Recorder requirement.
 */
export async function runPackaging(state: GrammarState): Promise<Partial<GrammarState>> {
  console.log('[Packaging] Preparing KYB manifest and gathering evidence...');

  if (state.boardState !== 'packaged') {
    console.warn('[Packaging] Cannot package. Board state is not "packaged".');
    return { boardState: 'blocked' };
  }

  const manifestId = randomUUID();
  const timestamp = new Date().toISOString();

  // Create KYB Manifest
  const manifest = {
    serialId: manifestId,
    timestamp,
    objective: state.normalizedObjective || state.rawIntent,
    governancePack: {
        policiesChecked: state.contextPack?.policyConstraints || [],
        approved: state.contextPack?.approved || false,
    },
    routing: {
        capability: state.assignedCapability,
        provider: state.targetProvider
    },
    validation: {
        approved: state.approvedForAssembly,
        hallucinationScore: state.hallucinationScore
    },
    evidence: state.specialistLogs || []
  };

  // Initialize and write to disk
  await KybFlightRecorder.init();
  const auditPath = await KybFlightRecorder.record(manifest);

  const finalManifest = { ...manifest, auditPath };

  console.log('[Packaging] Deliverable ready. Manifest created:', auditPath);

  return {
    boardState: 'delivered',
    manifest: finalManifest
  };
}
