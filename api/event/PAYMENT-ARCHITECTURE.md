# CTIH Event Payment Architecture

## Flow
1. Attendee/Sponsor fills out form on foai.cloud/event/
2. Frontend calls `/v1/event/register` or `/v1/event/sponsor-inquiry` → InsForge stores lead
3. Frontend calls `/v1/event/checkout` → creates `payment_sessions` record in InsForge
4. InsForge's internal Stripe integration creates a Stripe Checkout Session
5. User is redirected to Stripe Checkout (hosted by Stripe, managed by InsForge)
6. On payment success, InsForge's Stripe webhook updates `payment_sessions.status = 'completed'`
7. Our `/v1/event/payment-complete` webhook picks up the change and generates access tokens

## Security
- **Stripe keys are managed by InsForge** — never stored in this repo
- **No direct Stripe SDK usage** — all payments go through InsForge's `payment_sessions` table
- **Keys rotated** — Previous keys invalidated on 2026-03-25
- **Audit trail** — Every payment logged to `acheevy_traces`

## InsForge Tables
- `payment_sessions` — Payment lifecycle (pending → processing → completed)
- `event_registrations` — Attendee data + payment status
- `event_access` — Post-payment access tokens
- `sponsor_inquiries` — Sponsor data + payment status
- `acheevy_traces` — Unforgeable audit trail

## Pricing
| Type | Standard | Early Bird |
|------|----------|------------|
| In-Person | $149 | $99 |
| Virtual | $49 | $29 |
| VIP | $299 | $199 |
| Platinum Sponsor | $10,000 | — |
| Gold Sponsor | $5,000 | — |
| Silver Sponsor | $2,500 | — |
