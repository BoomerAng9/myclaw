/**
 * CTIH InsForge Migration Script
 * Creates all required tables for the Coastal Talent and Innovation Hack-A-Thon
 * 
 * Usage: npx ts-node scripts/insforge-migrate-ctih.ts
 * Requires: INSFORGE_URL and INSFORGE_ANON_KEY environment variables
 */

const INSFORGE_URL = process.env.INSFORGE_URL;
const INSFORGE_ANON_KEY = process.env.INSFORGE_ANON_KEY;

if (!INSFORGE_URL || !INSFORGE_ANON_KEY) {
  console.error('Missing INSFORGE_URL or INSFORGE_ANON_KEY environment variables');
  process.exit(1);
}

async function insforgeQuery(sql: string): Promise<any> {
  const res = await fetch(`${INSFORGE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': INSFORGE_ANON_KEY!,
      'Authorization': `Bearer ${INSFORGE_ANON_KEY}`
    },
    body: JSON.stringify({ query: sql })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`InsForge query failed (${res.status}): ${text}`);
  }
  return res.json();
}

const MIGRATIONS = [
  {
    name: 'event_registrations',
    sql: `
      CREATE TABLE IF NOT EXISTS event_registrations (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        
        -- Attendee info
        email TEXT NOT NULL,
        full_name TEXT NOT NULL,
        company TEXT,
        role TEXT,
        phone TEXT,
        
        -- Event details
        event_id TEXT DEFAULT 'ctih-2026',
        ticket_type TEXT NOT NULL CHECK (ticket_type IN ('in-person', 'virtual', 'vip')),
        track_preference TEXT CHECK (track_preference IN ('ai', 'web3', 'social-impact', 'creative-tech')),
        dietary_restrictions TEXT,
        
        -- Payment
        payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
        payment_session_id TEXT,
        amount_paid INTEGER, -- cents
        currency TEXT DEFAULT 'usd',
        
        -- Access
        access_token TEXT UNIQUE,
        checked_in BOOLEAN DEFAULT false,
        checked_in_at TIMESTAMPTZ,
        
        -- Source tracking
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        referral_code TEXT,
        
        UNIQUE(email, event_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_event_reg_email ON event_registrations(email);
      CREATE INDEX IF NOT EXISTS idx_event_reg_event ON event_registrations(event_id);
      CREATE INDEX IF NOT EXISTS idx_event_reg_payment ON event_registrations(payment_status);
      CREATE INDEX IF NOT EXISTS idx_event_reg_token ON event_registrations(access_token);
    `
  },
  {
    name: 'event_access',
    sql: `
      CREATE TABLE IF NOT EXISTS event_access (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT now(),
        
        registration_id UUID REFERENCES event_registrations(id),
        email TEXT NOT NULL,
        event_id TEXT DEFAULT 'ctih-2026',
        
        -- Access control
        access_type TEXT NOT NULL CHECK (access_type IN ('full', 'virtual-only', 'vip', 'speaker', 'sponsor')),
        valid_from TIMESTAMPTZ DEFAULT now(),
        valid_until TIMESTAMPTZ,
        revoked BOOLEAN DEFAULT false,
        revoked_reason TEXT,
        
        -- Session tracking
        last_accessed_at TIMESTAMPTZ,
        access_count INTEGER DEFAULT 0,
        ip_addresses TEXT[],
        
        UNIQUE(email, event_id, access_type)
      );
      
      CREATE INDEX IF NOT EXISTS idx_event_access_email ON event_access(email);
      CREATE INDEX IF NOT EXISTS idx_event_access_reg ON event_access(registration_id);
    `
  },
  {
    name: 'sponsor_inquiries',
    sql: `
      CREATE TABLE IF NOT EXISTS sponsor_inquiries (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        
        -- Contact
        company_name TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        contact_phone TEXT,
        website TEXT,
        
        -- Sponsorship
        event_id TEXT DEFAULT 'ctih-2026',
        tier TEXT NOT NULL CHECK (tier IN ('platinum', 'gold', 'silver', 'custom')),
        custom_amount INTEGER, -- cents, for custom tier
        message TEXT,
        
        -- Pipeline
        status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'negotiating', 'confirmed', 'paid', 'declined')),
        assigned_to TEXT,
        follow_up_date TIMESTAMPTZ,
        notes TEXT,
        
        -- Payment
        payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'invoiced', 'completed', 'refunded')),
        payment_session_id TEXT,
        amount_paid INTEGER, -- cents
        
        -- Source
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT
      );
      
      CREATE INDEX IF NOT EXISTS idx_sponsor_email ON sponsor_inquiries(contact_email);
      CREATE INDEX IF NOT EXISTS idx_sponsor_status ON sponsor_inquiries(status);
      CREATE INDEX IF NOT EXISTS idx_sponsor_tier ON sponsor_inquiries(tier);
    `
  },
  {
    name: 'aims_leads',
    sql: `
      CREATE TABLE IF NOT EXISTS aims_leads (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        
        -- Lead info
        email TEXT NOT NULL,
        full_name TEXT,
        company TEXT,
        phone TEXT,
        
        -- Source
        source TEXT NOT NULL, -- 'ctih-registration', 'ctih-sponsor', 'website', 'referral'
        source_id TEXT, -- FK to originating record
        event_id TEXT,
        
        -- Qualification
        lead_score INTEGER DEFAULT 0,
        status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
        tags TEXT[],
        
        -- Nurture
        email_sequence_id TEXT,
        emails_sent INTEGER DEFAULT 0,
        last_email_at TIMESTAMPTZ,
        last_opened_at TIMESTAMPTZ,
        last_clicked_at TIMESTAMPTZ,
        
        -- Conversion
        converted_at TIMESTAMPTZ,
        conversion_value INTEGER, -- cents
        
        UNIQUE(email, source, event_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_leads_email ON aims_leads(email);
      CREATE INDEX IF NOT EXISTS idx_leads_source ON aims_leads(source);
      CREATE INDEX IF NOT EXISTS idx_leads_status ON aims_leads(status);
      CREATE INDEX IF NOT EXISTS idx_leads_score ON aims_leads(lead_score DESC);
    `
  },
  {
    name: 'payment_sessions',
    sql: `
      CREATE TABLE IF NOT EXISTS payment_sessions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        
        -- Session
        stripe_session_id TEXT UNIQUE,
        stripe_payment_intent TEXT,
        
        -- Payer
        email TEXT NOT NULL,
        
        -- Payment details
        payment_type TEXT NOT NULL CHECK (payment_type IN ('ticket', 'sponsor', 'addon')),
        amount INTEGER NOT NULL, -- cents
        currency TEXT DEFAULT 'usd',
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'expired')),
        
        -- Reference
        event_id TEXT DEFAULT 'ctih-2026',
        reference_type TEXT, -- 'registration', 'sponsor_inquiry'
        reference_id UUID,
        
        -- Metadata
        metadata JSONB DEFAULT '{}',
        
        -- Webhook tracking
        webhook_received_at TIMESTAMPTZ,
        webhook_event_id TEXT,
        error_message TEXT
      );
      
      CREATE INDEX IF NOT EXISTS idx_payment_stripe ON payment_sessions(stripe_session_id);
      CREATE INDEX IF NOT EXISTS idx_payment_email ON payment_sessions(email);
      CREATE INDEX IF NOT EXISTS idx_payment_status ON payment_sessions(status);
      CREATE INDEX IF NOT EXISTS idx_payment_type ON payment_sessions(payment_type);
    `
  },
  {
    name: 'acheevy_traces',
    sql: `
      CREATE TABLE IF NOT EXISTS acheevy_traces (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT now(),
        
        -- Trace identity
        trace_type TEXT NOT NULL, -- 'event-lead', 'payment', 'sponsor', 'content-gen', 'image-gen'
        source_repo TEXT NOT NULL, -- 'myclaw', 'aims', etc.
        source_action TEXT NOT NULL, -- 'register', 'checkout', 'generate-content'
        
        -- Actor
        actor_email TEXT,
        actor_id TEXT,
        
        -- Payload
        payload JSONB NOT NULL DEFAULT '{}',
        
        -- Integrity
        hash TEXT NOT NULL, -- SHA-256 of payload + timestamp
        parent_trace_id UUID, -- chain traces together
        
        -- Status
        status TEXT DEFAULT 'recorded' CHECK (status IN ('recorded', 'verified', 'disputed'))
      );
      
      CREATE INDEX IF NOT EXISTS idx_traces_type ON acheevy_traces(trace_type);
      CREATE INDEX IF NOT EXISTS idx_traces_source ON acheevy_traces(source_repo);
      CREATE INDEX IF NOT EXISTS idx_traces_actor ON acheevy_traces(actor_email);
      CREATE INDEX IF NOT EXISTS idx_traces_created ON acheevy_traces(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_traces_hash ON acheevy_traces(hash);
    `
  }
];

async function runMigrations() {
  console.log('=== CTIH InsForge Migration ===');
  console.log(`Target: ${INSFORGE_URL}`);
  console.log(`Tables: ${MIGRATIONS.map(m => m.name).join(', ')}`);
  console.log('');

  let success = 0;
  let failed = 0;

  for (const migration of MIGRATIONS) {
    process.stdout.write(`Creating ${migration.name}... `);
    try {
      await insforgeQuery(migration.sql);
      console.log('OK');
      success++;
    } catch (err: any) {
      console.log(`FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log('');
  console.log(`=== Results: ${success} created, ${failed} failed ===`);

  if (failed > 0) {
    console.log('');
    console.log('NOTE: If exec_sql RPC is not available, run the SQL directly');
    console.log('in your InsForge/Supabase SQL editor. The SQL is printed above.');
    process.exit(1);
  }
}

runMigrations();
