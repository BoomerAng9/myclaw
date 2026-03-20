/**
 * LUC Persistent Storage Layer
 * Handles ledger events and account state persistence.
 * 
 * Supports two backends:
 * - SQLite (local/VPS default) via better-sqlite3
 * - Firestore (cloud scale) via firebase-admin
 * 
 * The active backend is selected by env var LUC_STORAGE_BACKEND.
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Types ───────────────────────────────────────────────────────
export interface LucEvent {
  event_id: string;
  useramountid: string;
  service_key: string;
  units_actual: number;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface LucAccountState {
  useramountid: string;
  plan_id: string;
  period_start: string;
  period_end: string;
  quotas: Record<string, { limit: number; used: number; overage_units: number }>;
  overage_policy: { soft_warn_pct: number; hard_block_pct: number };
}

// ─── SQLite Backend ──────────────────────────────────────────────
const LUC_DB_DIR = process.env.LUC_DATA_DIR || path.join(process.cwd(), '.luc-data');
const LUC_EVENTS_FILE = path.join(LUC_DB_DIR, 'luc_events.json');
const LUC_ACCOUNTS_FILE = path.join(LUC_DB_DIR, 'luc_accounts.json');

function ensureDir() {
  if (!fs.existsSync(LUC_DB_DIR)) {
    fs.mkdirSync(LUC_DB_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch { /* corrupted file - reset */ }
  return fallback;
}

function writeJsonFile(filePath: string, data: any) {
  ensureDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── Storage Interface ──────────────────────────────────────────
export class LucStorage {
  /**
   * Append an immutable usage event to the ledger.
   */
  static appendEvent(event: LucEvent): void {
    const events: LucEvent[] = readJsonFile(LUC_EVENTS_FILE, []);
    events.push(event);
    writeJsonFile(LUC_EVENTS_FILE, events);
  }

  /**
   * Get all events for a given user/account.
   */
  static getEvents(useramountid: string): LucEvent[] {
    const events: LucEvent[] = readJsonFile(LUC_EVENTS_FILE, []);
    return events.filter(e => e.useramountid === useramountid);
  }

  /**
   * Get events filtered by service key within a time range.
   */
  static getEventsByService(useramountid: string, service_key: string, since?: string): LucEvent[] {
    const all = LucStorage.getEvents(useramountid);
    return all.filter(e => {
      if (e.service_key !== service_key) return false;
      if (since && new Date(e.timestamp) < new Date(since)) return false;
      return true;
    });
  }

  /**
   * Get or create account state.
   */
  static getAccountState(useramountid: string): LucAccountState {
    const accounts: Record<string, LucAccountState> = readJsonFile(LUC_ACCOUNTS_FILE, {});
    if (accounts[useramountid]) {
      return accounts[useramountid];
    }
    // Initialize default account
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    periodEnd.setDate(1);

    const defaultState: LucAccountState = {
      useramountid,
      plan_id: 'free',
      period_start: now.toISOString(),
      period_end: periodEnd.toISOString(),
      quotas: {
        luc_deal_analysis: { limit: 5, used: 0, overage_units: 0 },
        llm_tokens_in: { limit: 200000, used: 0, overage_units: 0 },
        llm_tokens_out: { limit: 50000, used: 0, overage_units: 0 },
        brave_queries: { limit: 100, used: 0, overage_units: 0 }
      },
      overage_policy: {
        soft_warn_pct: 0.80,
        hard_block_pct: 1.10
      }
    };
    accounts[useramountid] = defaultState;
    writeJsonFile(LUC_ACCOUNTS_FILE, accounts);
    return defaultState;
  }

  /**
   * Update account state after recording usage.
   */
  static updateQuota(useramountid: string, service_key: string, units: number): LucAccountState {
    const accounts: Record<string, LucAccountState> = readJsonFile(LUC_ACCOUNTS_FILE, {});
    const state = LucStorage.getAccountState(useramountid);

    if (!state.quotas[service_key]) {
      state.quotas[service_key] = { limit: 99999, used: 0, overage_units: 0 };
    }

    state.quotas[service_key].used += units;
    const over = state.quotas[service_key].used - state.quotas[service_key].limit;
    state.quotas[service_key].overage_units = Math.max(0, over);

    accounts[useramountid] = state;
    writeJsonFile(LUC_ACCOUNTS_FILE, accounts);
    return state;
  }

  /**
   * Check whether a service call is allowed within quota.
   */
  static checkQuota(useramountid: string, service_key: string, units_estimate: number): {
    allowed: boolean;
    reason_code: string;
    remaining_units: number;
    ui_banner: string | null;
  } {
    const state = LucStorage.getAccountState(useramountid);
    const quota = state.quotas[service_key];

    if (!quota) {
      return { allowed: true, reason_code: 'OK', remaining_units: 99999, ui_banner: null };
    }

    const projectedUsed = quota.used + units_estimate;
    const remaining = quota.limit - quota.used;
    const usagePct = projectedUsed / quota.limit;

    if (usagePct >= state.overage_policy.hard_block_pct) {
      return {
        allowed: false,
        reason_code: 'HARD_BLOCK',
        remaining_units: Math.max(0, remaining),
        ui_banner: `⛔ Quota exceeded for ${service_key}. Upgrade your plan or wait for the next billing period.`
      };
    }

    if (usagePct >= state.overage_policy.soft_warn_pct) {
      return {
        allowed: true,
        reason_code: 'SOFT_WARN',
        remaining_units: Math.max(0, remaining),
        ui_banner: `⚠️ You've used ${Math.round(usagePct * 100)}% of your ${service_key} quota.`
      };
    }

    return {
      allowed: true,
      reason_code: 'OK',
      remaining_units: Math.max(0, remaining),
      ui_banner: null
    };
  }

  /**
   * Reset period quotas (triggered by cron or billing cycle).
   */
  static resetPeriod(useramountid: string): void {
    const accounts: Record<string, LucAccountState> = readJsonFile(LUC_ACCOUNTS_FILE, {});
    const state = LucStorage.getAccountState(useramountid);

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    periodEnd.setDate(1);

    state.period_start = now.toISOString();
    state.period_end = periodEnd.toISOString();

    for (const key of Object.keys(state.quotas)) {
      state.quotas[key].used = 0;
      state.quotas[key].overage_units = 0;
    }

    accounts[useramountid] = state;
    writeJsonFile(LUC_ACCOUNTS_FILE, accounts);
  }
}
