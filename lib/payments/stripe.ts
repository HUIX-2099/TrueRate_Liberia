/**
 * Stripe payment integration.
 * Set STRIPE_SECRET_KEY to activate. Stubs when key is absent.
 */

export interface StripePaymentIntentResult {
  ok: boolean
  clientSecret?: string
  paymentIntentId?: string
  amount?: number
  currency?: string
  error?: string
}

export interface CreatePaymentIntentParams {
  amountUsd: number
  orderId: string
  customerEmail?: string
  metadata?: Record<string, string>
}

export function isPaymentsEnabled(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}

export async function createStripePaymentIntent(params: CreatePaymentIntentParams): Promise<StripePaymentIntentResult> {
  if (!process.env.STRIPE_SECRET_KEY) {
    if (process.env.NODE_ENV === "production") {
      // Never silently stub in production — callers should check isPaymentsEnabled() first.
      return { ok: false, error: "Payments are not yet configured. Please try again later." }
    }
    // Development-only stub: returns a fake client secret for UI testing.
    console.log(`[STRIPE STUB] Creating payment intent: $${params.amountUsd} for order ${params.orderId}`)
    return {
      ok: true,
      clientSecret: `pi_stub_${Date.now()}_secret_stub`,
      paymentIntentId: `pi_stub_${Date.now()}`,
      amount: Math.round(params.amountUsd * 100),
      currency: "usd",
    }
  }

  try {
    const res = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: String(Math.round(params.amountUsd * 100)),
        currency: "usd",
        "metadata[orderId]": params.orderId,
        ...(params.customerEmail ? { receipt_email: params.customerEmail } : {}),
        ...Object.fromEntries(
          Object.entries(params.metadata ?? {}).map(([k, v]) => [`metadata[${k}]`, v])
        ),
      }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error?.message ?? "Stripe error" }
    return {
      ok: true,
      clientSecret: data.client_secret,
      paymentIntentId: data.id,
      amount: data.amount,
      currency: data.currency,
    }
  } catch (err) {
    return { ok: false, error: String(err) }
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  if (!process.env.STRIPE_SECRET_KEY || paymentIntentId.includes("stub")) {
    return { id: paymentIntentId, status: "succeeded", amount: 0, currency: "usd" }
  }
  const res = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
  })
  return res.json()
}
