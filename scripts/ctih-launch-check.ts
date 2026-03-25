/**
 * CTIH Launch Readiness Validator
 * Run this to verify every dependency is live before "TestFlight"
 *
 * Usage: npx ts-node scripts/ctih-launch-check.ts
 */

interface Check {
  name: string;
  check: () => Promise<{ ok: boolean; detail: string }>;
}

const INSFORGE_URL = process.env.INSFORGE_URL;
const INSFORGE_ANON_KEY = process.env.INSFORGE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MYCLAW_URL = process.env.MYCLAW_URL || 'http://localhost:3050';

const checks: Check[] = [
  {
    name: 'INSFORGE_URL set',
    check: async () => ({
      ok: !!INSFORGE_URL,
      detail: INSFORGE_URL ? INSFORGE_URL.replace(/\/\/(.{4}).*@/, '//$1***@') : 'MISSING'
    })
  },
  {
    name: 'INSFORGE_ANON_KEY set',
    check: async () => ({
      ok: !!INSFORGE_ANON_KEY,
      detail: INSFORGE_ANON_KEY ? `${INSFORGE_ANON_KEY.slice(0, 8)}...` : 'MISSING'
    })
  },
  {
    name: 'GEMINI_API_KEY set',
    check: async () => ({
      ok: !!GEMINI_API_KEY,
      detail: GEMINI_API_KEY ? `${GEMINI_API_KEY.slice(0, 8)}...` : 'MISSING'
    })
  },
  {
    name: 'InsForge reachable',
    check: async () => {
      if (!INSFORGE_URL) return { ok: false, detail: 'No URL configured' };
      try {
        const res = await fetch(`${INSFORGE_URL}/rest/v1/`, {
          headers: { 'apikey': INSFORGE_ANON_KEY || '' }
        });
        return { ok: res.ok, detail: `HTTP ${res.status}` };
      } catch (e: any) {
        return { ok: false, detail: e.message };
      }
    }
  },
  {
    name: 'event_registrations table exists',
    check: async () => {
      if (!INSFORGE_URL) return { ok: false, detail: 'No InsForge URL' };
      try {
        const res = await fetch(`${INSFORGE_URL}/rest/v1/event_registrations?select=id&limit=0`, {
          headers: {
            'apikey': INSFORGE_ANON_KEY || '',
            'Authorization': `Bearer ${INSFORGE_ANON_KEY}`
          }
        });
        return { ok: res.ok, detail: res.ok ? 'exists' : `HTTP ${res.status}` };
      } catch (e: any) {
        return { ok: false, detail: e.message };
      }
    }
  },
  {
    name: 'sponsor_inquiries table exists',
    check: async () => {
      if (!INSFORGE_URL) return { ok: false, detail: 'No InsForge URL' };
      try {
        const res = await fetch(`${INSFORGE_URL}/rest/v1/sponsor_inquiries?select=id&limit=0`, {
          headers: {
            'apikey': INSFORGE_ANON_KEY || '',
            'Authorization': `Bearer ${INSFORGE_ANON_KEY}`
          }
        });
        return { ok: res.ok, detail: res.ok ? 'exists' : `HTTP ${res.status}` };
      } catch (e: any) {
        return { ok: false, detail: e.message };
      }
    }
  },
  {
    name: 'aims_leads table exists',
    check: async () => {
      if (!INSFORGE_URL) return { ok: false, detail: 'No InsForge URL' };
      try {
        const res = await fetch(`${INSFORGE_URL}/rest/v1/aims_leads?select=id&limit=0`, {
          headers: {
            'apikey': INSFORGE_ANON_KEY || '',
            'Authorization': `Bearer ${INSFORGE_ANON_KEY}`
          }
        });
        return { ok: res.ok, detail: res.ok ? 'exists' : `HTTP ${res.status}` };
      } catch (e: any) {
        return { ok: false, detail: e.message };
      }
    }
  },
  {
    name: 'payment_sessions table exists',
    check: async () => {
      if (!INSFORGE_URL) return { ok: false, detail: 'No InsForge URL' };
      try {
        const res = await fetch(`${INSFORGE_URL}/rest/v1/payment_sessions?select=id&limit=0`, {
          headers: {
            'apikey': INSFORGE_ANON_KEY || '',
            'Authorization': `Bearer ${INSFORGE_ANON_KEY}`
          }
        });
        return { ok: res.ok, detail: res.ok ? 'exists' : `HTTP ${res.status}` };
      } catch (e: any) {
        return { ok: false, detail: e.message };
      }
    }
  },
  {
    name: 'acheevy_traces table exists',
    check: async () => {
      if (!INSFORGE_URL) return { ok: false, detail: 'No InsForge URL' };
      try {
        const res = await fetch(`${INSFORGE_URL}/rest/v1/acheevy_traces?select=id&limit=0`, {
          headers: {
            'apikey': INSFORGE_ANON_KEY || '',
            'Authorization': `Bearer ${INSFORGE_ANON_KEY}`
          }
        });
        return { ok: res.ok, detail: res.ok ? 'exists' : `HTTP ${res.status}` };
      } catch (e: any) {
        return { ok: false, detail: e.message };
      }
    }
  },
  {
    name: 'Gemini API reachable',
    check: async () => {
      if (!GEMINI_API_KEY) return { ok: false, detail: 'No API key' };
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
        );
        return { ok: res.ok, detail: res.ok ? 'connected' : `HTTP ${res.status}` };
      } catch (e: any) {
        return { ok: false, detail: e.message };
      }
    }
  },
  {
    name: 'MyClaw API reachable',
    check: async () => {
      try {
        const res = await fetch(`${MYCLAW_URL}/health`, { signal: AbortSignal.timeout(5000) });
        return { ok: res.ok, detail: `HTTP ${res.status} at ${MYCLAW_URL}` };
      } catch (e: any) {
        return { ok: false, detail: `${MYCLAW_URL} — ${e.message}` };
      }
    }
  },
  {
    name: 'LiteLLM not present',
    check: async () => {
      // Verify no litellm in our dependencies
      try {
        require.resolve('litellm');
        return { ok: false, detail: 'CRITICAL: litellm is installed — remove immediately' };
      } catch {
        return { ok: true, detail: 'not installed (correct)' };
      }
    }
  }
];

async function runChecks() {
  console.log('========================================');
  console.log('  CTIH Launch Readiness Validator');
  console.log('  Coastal Talent & Innovation Hack-A-Thon');
  console.log('========================================');
  console.log('');

  let passed = 0;
  let failed = 0;
  const failures: string[] = [];

  for (const c of checks) {
    try {
      const result = await c.check();
      const icon = result.ok ? 'PASS' : 'FAIL';
      console.log(`  [${icon}] ${c.name} — ${result.detail}`);
      if (result.ok) {
        passed++;
      } else {
        failed++;
        failures.push(c.name);
      }
    } catch (e: any) {
      console.log(`  [FAIL] ${c.name} — ${e.message}`);
      failed++;
      failures.push(c.name);
    }
  }

  console.log('');
  console.log('========================================');
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log('========================================');

  if (failed > 0) {
    console.log('');
    console.log('  Blockers:');
    failures.forEach(f => console.log(`    - ${f}`));
    console.log('');
    console.log('  Fix the above before going live.');
    process.exit(1);
  } else {
    console.log('');
    console.log('  ALL SYSTEMS GO. Ready for TestFlight.');
    console.log('');
  }
}

runChecks();
