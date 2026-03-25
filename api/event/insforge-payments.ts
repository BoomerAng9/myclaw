/**
 * InsForge Payments — Stripe via InsForge
 * 
 * InsForge manages Stripe internally. This module creates payment records
 * in InsForge which triggers Stripe checkout sessions via InsForge's
 * payment pipeline. Keys are managed by InsForge — never stored locally.
 * 
 * SECURITY: Stripe keys are rotated. All payment operations go through
 * InsForge's managed Stripe integration. Do NOT use stripe SDK directly.
 */
import { insforge } from '../insforge';
import { v4 as uuid } from 'uuid';

// Ticket pricing (in cents)
const TICKET_PRICES = {
  'in-person': { standard: 14900, earlyBird: 9900, label: 'In-Person Pass' },
  'virtual': { standard: 4900, earlyBird: 2900, label: 'Virtual Pass' },
  'vip': { standard: 29900, earlyBird: 19900, label: 'VIP Pass' }
} as const;

const SPONSOR_PRICES = {
  'platinum': { amount: 1000000, label: 'Platinum Sponsorship' },
  'gold': { amount: 500000, label: 'Gold Sponsorship' },
  'silver': { amount: 250000, label: 'Silver Sponsorship' }
} as const;

type TicketType = keyof typeof TICKET_PRICES;
type SponsorTier = keyof typeof SPONSOR_PRICES;

interface PaymentSession {
  id: string;
  registrationId: string;
  type: 'ticket' | 'sponsorship';
  amount: number;
  currency: string;
  label: string;
  customerEmail: string;
  customerName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  successUrl: string;
  cancelUrl: string;
  checkoutUrl?: string;
  metadata: Record<string, string>;
  createdAt: string;
}

/**
 * Create a ticket payment session via InsForge.
 * InsForge handles Stripe checkout session creation internally.
 */
export async function createTicketPayment(params: {
  registrationId: string;
  ticketType: TicketType;
  email: string;
  name: string;
  earlyBird?: boolean;
}): Promise<{ sessionId: string; checkoutUrl: string }> {
  const { registrationId, ticketType, email, name, earlyBird } = params;
  const pricing = TICKET_PRICES[ticketType];
  if (!pricing) throw new Error(`Invalid ticket type: ${ticketType}`);

  const amount = earlyBird ? pricing.earlyBird : pricing.standard;
  const sessionId = uuid();
  const baseUrl = process.env.EVENT_BASE_URL || 'https://foai.cloud';

  const paymentSession: PaymentSession = {
    id: sessionId,
    registrationId,
    type: 'ticket',
    amount,
    currency: 'usd',
    label: `CTIH Hack-A-Thon — ${pricing.label}${earlyBird ? ' (Early Bird)' : ''}`,
    customerEmail: email,
    customerName: name,
    status: 'pending',
    successUrl: `${baseUrl}/event/success.html?session=${sessionId}&reg=${registrationId}`,
    cancelUrl: `${baseUrl}/event/register.html?cancelled=true`,
    metadata: {
      event: 'ctih-hackathon',
      ticketType,
      registrationId,
      earlyBird: String(!!earlyBird)
    },
    createdAt: new Date().toISOString()
  };

  // Insert payment session into InsForge — triggers Stripe checkout creation
  const { data, error } = await insforge
    .from('payment_sessions')
    .insert(paymentSession)
    .select()
    .single();

  if (error) throw new Error(`Payment session creation failed: ${error.message}`);

  // InsForge returns the Stripe checkout URL via its internal webhook/trigger
  // Poll for checkout URL or use the InsForge realtime subscription
  const checkoutUrl = data?.checkoutUrl || await pollForCheckoutUrl(sessionId);

  return { sessionId, checkoutUrl };
}

/**
 * Create a sponsor payment session via InsForge.
 */
export async function createSponsorPayment(params: {
  sponsorId: string;
  tier: SponsorTier;
  email: string;
  companyName: string;
}): Promise<{ sessionId: string; checkoutUrl: string }> {
  const { sponsorId, tier, email, companyName } = params;
  const pricing = SPONSOR_PRICES[tier];
  if (!pricing) throw new Error(`Invalid sponsor tier: ${tier}`);

  const sessionId = uuid();
  const baseUrl = process.env.EVENT_BASE_URL || 'https://foai.cloud';

  const paymentSession: PaymentSession = {
    id: sessionId,
    registrationId: sponsorId,
    type: 'sponsorship',
    amount: pricing.amount,
    currency: 'usd',
    label: `CTIH Hack-A-Thon — ${pricing.label}`,
    customerEmail: email,
    customerName: companyName,
    status: 'pending',
    successUrl: `${baseUrl}/event/sponsors.html?success=true&session=${sessionId}`,
    cancelUrl: `${baseUrl}/event/sponsors.html?cancelled=true`,
    metadata: {
      event: 'ctih-hackathon',
      tier,
      sponsorId,
      type: 'sponsorship'
    },
    createdAt: new Date().toISOString()
  };

  const { data, error } = await insforge
    .from('payment_sessions')
    .insert(paymentSession)
    .select()
    .single();

  if (error) throw new Error(`Sponsor payment creation failed: ${error.message}`);

  const checkoutUrl = data?.checkoutUrl || await pollForCheckoutUrl(sessionId);
  return { sessionId, checkoutUrl };
}

/**
 * Handle payment completion callback from InsForge.
 * Called when InsForge's Stripe webhook processes a completed checkout.
 */
export async function handlePaymentComplete(sessionId: string): Promise<{
  registrationId: string;
  type: string;
  accessToken: string;
}> {
  // Verify payment session exists and is completed
  const { data: session, error } = await insforge
    .from('payment_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('status', 'completed')
    .single();

  if (error || !session) throw new Error('Payment session not found or not completed');

  // Generate access token
  const accessToken = uuid();

  // Update registration with payment confirmation
  if (session.type === 'ticket') {
    await insforge.from('event_registrations').update({
      payment_status: 'completed',
      access_token: accessToken,
      payment_session_id: sessionId,
      paid_at: new Date().toISOString()
    }).eq('id', session.registrationId);

    // Create access record
    await insforge.from('event_access').insert({
      id: uuid(),
      registration_id: session.registrationId,
      access_token: accessToken,
      ticket_type: session.metadata.ticketType,
      virtual_stream_url: session.metadata.ticketType !== 'in-person'
        ? `https://foai.cloud/event/live?token=${accessToken}`
        : null,
      created_at: new Date().toISOString()
    });
  } else if (session.type === 'sponsorship') {
    await insforge.from('sponsor_inquiries').update({
      status: 'paid',
      payment_session_id: sessionId,
      paid_at: new Date().toISOString()
    }).eq('id', session.registrationId);
  }

  // Log to acheevy_traces
  await insforge.from('acheevy_traces').insert({
    trace_id: `payment-${sessionId}-${Date.now()}`,
    engine: 'insforge-payments',
    action: `payment.${session.type}.completed`,
    payload: JSON.stringify({ sessionId, registrationId: session.registrationId }),
    resolution: `Payment confirmed via InsForge Stripe: ${session.label}`,
    status: 'completed',
    timestamp: new Date().toISOString()
  });

  return {
    registrationId: session.registrationId,
    type: session.type,
    accessToken
  };
}

/**
 * Poll InsForge for checkout URL (InsForge creates it asynchronously via Stripe).
 */
async function pollForCheckoutUrl(sessionId: string, maxAttempts = 10): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const { data } = await insforge
      .from('payment_sessions')
      .select('checkoutUrl')
      .eq('id', sessionId)
      .single();

    if (data?.checkoutUrl) return data.checkoutUrl;
  }
  throw new Error('Checkout URL not available — InsForge Stripe integration may need configuration');
}

/**
 * Get payment status for a session.
 */
export async function getPaymentStatus(sessionId: string): Promise<PaymentSession | null> {
  const { data, error } = await insforge
    .from('payment_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) return null;
  return data as PaymentSession;
}

/**
 * Get revenue stats from InsForge payment sessions.
 */
export async function getRevenueStats(): Promise<{
  totalRevenue: number;
  ticketRevenue: number;
  sponsorRevenue: number;
  transactions: number;
}> {
  const { data: completed } = await insforge
    .from('payment_sessions')
    .select('amount, type')
    .eq('status', 'completed');

  const sessions = completed || [];
  const ticketRevenue = sessions.filter(s => s.type === 'ticket').reduce((sum, s) => sum + s.amount, 0);
  const sponsorRevenue = sessions.filter(s => s.type === 'sponsorship').reduce((sum, s) => sum + s.amount, 0);

  return {
    totalRevenue: ticketRevenue + sponsorRevenue,
    ticketRevenue,
    sponsorRevenue,
    transactions: sessions.length
  };
}
