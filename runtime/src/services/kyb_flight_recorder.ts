import fs from 'fs/promises';
import path from 'path';

/**
 * KYB Flight Recorder Service
 * Centralizes saving manifests to an immutable location for audits.
 */

const LOGS_DIR = path.join(process.cwd(), 'kyb_logs');

export class KybFlightRecorder {
  static async init() {
    try {
      await fs.mkdir(LOGS_DIR, { recursive: true });
    } catch (err: any) {
      if (err.code !== 'EEXIST') throw err;
    }
  }

  /**
   * Commits the run manifest to the central ledger or local disk.
   */
  static async record(manifest: any): Promise<string> {
    const filename = `${manifest.serialId}.json`;
    const destination = path.join(LOGS_DIR, filename);

    console.log(`[KYB] Recording immutable run manifest: ${destination}`);
    
    // Convert to readable JSON string
    const jsonString = JSON.stringify(manifest, null, 2);

    // In a prod env, this would hash to a database or append-only ledger
    await fs.writeFile(destination, jsonString, 'utf-8');

    return destination; // Return the exact audit path
  }
}
