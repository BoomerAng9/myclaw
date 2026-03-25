import { Router, Request, Response } from 'express';
import { insforge } from '../insforge';
import { generateEventContent } from './gemini-content';
import { generatePromoImage } from './nano-banana-promo';
import { stitchEventLead } from './event-stitch';
import { v4 as uuid } from 'uuid';

const router = Router();

// POST /v1/event/register — Lead capture + registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, company, role, ticketType, trackInterest, dietaryRestrictions, tshirtSize } = req.body;
    if (!name || !email || !ticketType) {
      return res.status(400).json({ error: 'name, email, and ticketType are required' });
    }

    const registrationId = uuid();
    const registration = {
      id: registrationId,
      name, email, phone, company, role, ticketType, trackInterest,
      dietaryRestrictions: dietaryRestrictions || null,
      tshirtSize: tshirtSize || null,
      payment_status: 'pending',
      access_token: null,
      created_at: new Date().toISOString(),
      source: req.headers['x-utm-source'] || 'direct'
    };

    // Store in InsForge
    const { data, error } = await insforge
      .from('event_registrations')
      .insert(registration)
      .select()
      .single();

    if (error) throw error;

    // Stitch lead into AIMS CRM
    await stitchEventLead({ type: 'attendee', ...registration });

    res.json({ success: true, registrationId, message: 'Registration captured. Proceed to checkout.' });
  } catch (err: any) {
    console.error('[event/register]', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /v1/event/checkout — Create Stripe checkout session
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const { ticketType, email, name, registrationId } = req.body;
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const earlyBird = process.env.EARLY_BIRD === 'true';
    const prices: Record<string, number> = {
      'in-person': earlyBird ? 9900 : 14900,
      'virtual': earlyBird ? 2900 : 4900,
      'vip': earlyBird ? 19900 : 29900,
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `CTIH Hack-A-Thon — ${ticketType.charAt(0).toUpperCase() + ticketType.slice(1)} Pass`,
            description: `Coastal Talent and Innovation Hack-A-Thon${earlyBird ? ' (Early Bird)' : ''}`,
          },
          unit_amount: prices[ticketType] || 4900,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.EVENT_BASE_URL || 'https://foai.cloud'}/event/success.html?session_id={CHECKOUT_SESSION_ID}&reg=${registrationId}`,
      cancel_url: `${process.env.EVENT_BASE_URL || 'https://foai.cloud'}/event/register.html?cancelled=true`,
      metadata: { registrationId, ticketType },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('[event/checkout]', err.message);
    res.status(500).json({ error: 'Checkout creation failed' });
  }
});

// POST /v1/event/webhook — Stripe webhook handler
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'] as string;
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { registrationId, ticketType } = session.metadata;
      const accessToken = uuid();

      // Update registration in InsForge
      await insforge.from('event_registrations').update({
        payment_status: 'completed',
        access_token: accessToken,
        stripe_session_id: session.id,
        paid_at: new Date().toISOString()
      }).eq('id', registrationId);

      // Create access record
      await insforge.from('event_access').insert({
        id: uuid(),
        registration_id: registrationId,
        access_token: accessToken,
        ticket_type: ticketType,
        virtual_stream_url: ticketType !== 'in-person' ? `https://foai.cloud/event/live?token=${accessToken}` : null,
        created_at: new Date().toISOString()
      });

      // Stitch payment confirmation
      await stitchEventLead({ type: 'payment_confirmed', registrationId, accessToken, ticketType });
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error('[event/webhook]', err.message);
    res.status(400).json({ error: 'Webhook failed' });
  }
});

// POST /v1/event/sponsor-inquiry — Sponsor lead capture
router.post('/sponsor-inquiry', async (req: Request, res: Response) => {
  try {
    const { companyName, contactName, email, phone, website, tierInterest, message } = req.body;
    if (!companyName || !contactName || !email || !tierInterest) {
      return res.status(400).json({ error: 'companyName, contactName, email, and tierInterest are required' });
    }

    const inquiryId = uuid();
    const inquiry = {
      id: inquiryId,
      company_name: companyName, contact_name: contactName,
      email, phone, website, tier_interest: tierInterest,
      message: message || null,
      status: 'new',
      created_at: new Date().toISOString()
    };

    const { error } = await insforge.from('sponsor_inquiries').insert(inquiry);
    if (error) throw error;

    // Stitch sponsor lead
    await stitchEventLead({ type: 'sponsor', ...inquiry });

    res.json({ success: true, inquiryId });
  } catch (err: any) {
    console.error('[event/sponsor-inquiry]', err.message);
    res.status(500).json({ error: 'Sponsor inquiry failed' });
  }
});

// GET /v1/event/verify-access/:token — Verify event access
router.get('/verify-access/:token', async (req: Request, res: Response) => {
  try {
    const { data, error } = await insforge
      .from('event_access')
      .select('*, event_registrations(*)')
      .eq('access_token', req.params.token)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Invalid access token' });

    res.json({
      valid: true,
      ticketType: data.ticket_type,
      attendeeName: data.event_registrations?.name,
      virtualStreamUrl: data.virtual_stream_url,
      accessToken: data.access_token
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// POST /v1/event/generate-content — Gemini-powered marketing content
router.post('/generate-content', async (req: Request, res: Response) => {
  try {
    const { contentType, context } = req.body;
    const content = await generateEventContent(contentType, context);
    res.json({ success: true, content });
  } catch (err: any) {
    console.error('[event/generate-content]', err.message);
    res.status(500).json({ error: 'Content generation failed' });
  }
});

// POST /v1/event/generate-promo-image — Nano Banana Pro 2 promo images
router.post('/generate-promo-image', async (req: Request, res: Response) => {
  try {
    const { prompt, style, aspectRatio } = req.body;
    const image = await generatePromoImage(prompt, style, aspectRatio);
    res.json({ success: true, image });
  } catch (err: any) {
    console.error('[event/generate-promo-image]', err.message);
    res.status(500).json({ error: 'Image generation failed' });
  }
});

// GET /v1/event/stats — Admin dashboard stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { count: totalRegistrations } = await insforge.from('event_registrations').select('*', { count: 'exact', head: true });
    const { count: paidRegistrations } = await insforge.from('event_registrations').select('*', { count: 'exact', head: true }).eq('payment_status', 'completed');
    const { count: sponsorInquiries } = await insforge.from('sponsor_inquiries').select('*', { count: 'exact', head: true });
    const { data: ticketBreakdown } = await insforge.from('event_registrations').select('ticketType').eq('payment_status', 'completed');

    const breakdown = (ticketBreakdown || []).reduce((acc: Record<string, number>, r: any) => {
      acc[r.ticketType] = (acc[r.ticketType] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalRegistrations: totalRegistrations || 0,
      paidRegistrations: paidRegistrations || 0,
      sponsorInquiries: sponsorInquiries || 0,
      ticketBreakdown: breakdown,
      conversionRate: totalRegistrations ? ((paidRegistrations || 0) / totalRegistrations * 100).toFixed(1) + '%' : '0%'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Stats query failed' });
  }
});

export default router;
