/**
 * Liberia Mobile Money Payment Adapter.
 * Supports Orange Money Liberia and Lonestar MTN Mobile Money.
 * Falls back to stub in development.
 *
 * Set ORANGE_MONEY_API_KEY, ORANGE_MONEY_MERCHANT_ID for Orange Money.
 * Set LONESTAR_API_KEY, LONESTAR_MERCHANT_ID for Lonestar MTN.
 */

export type MobileMoneyProvider = "orange_money" | "lonestar_mtn" | "stub"

export interface MobileMoneyPaymentResult {
  ok: boolean
  provider: MobileMoneyProvider
  transactionId?: string
  referenceId?: string
  status?: string
  error?: string
}

export interface InitiateMobileMoneyParams {
  phone: string
  amountLrd: number
  orderId: string
  description?: string
}

/** Orange Money Liberia - Initiate payment request */
export async function initiateOrangeMoneyPayment(params: InitiateMobileMoneyParams): Promise<MobileMoneyPaymentResult> {
  if (!process.env.ORANGE_MONEY_API_KEY || !process.env.ORANGE_MONEY_MERCHANT_ID) {
    console.log(`[ORANGE MONEY STUB] Payment: ${params.amountLrd} LRD from ${params.phone} for order ${params.orderId}`)
    return {
      ok: true,
      provider: "orange_money",
      transactionId: `om_stub_${Date.now()}`,
      referenceId: params.orderId,
      status: "pending",
    }
  }

  try {
    // Orange Money Liberia developer API (fictional endpoint — replace with real integration docs)
    const res = await fetch("https://api.orange.com/orange-money-webpay/lr/v1/webpayment", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ORANGE_MONEY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant_key: process.env.ORANGE_MONEY_MERCHANT_ID,
        currency: "LRD",
        order_id: params.orderId,
        amount: Math.round(params.amountLrd),
        return_url: `${process.env.NEXTAUTH_URL ?? "https://truerateliberia.com"}/diaspora/marketplace/order-confirmation?orderId=${params.orderId}`,
        cancel_url: `${process.env.NEXTAUTH_URL ?? "https://truerateliberia.com"}/diaspora/marketplace`,
        notif_url: `${process.env.NEXTAUTH_URL ?? "https://truerateliberia.com"}/api/webhooks/orange-money`,
        lang: "en",
      }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, provider: "orange_money", error: data.message ?? "Orange Money error" }
    return {
      ok: true,
      provider: "orange_money",
      transactionId: data.pay_token,
      referenceId: params.orderId,
      status: "pending",
    }
  } catch (err) {
    return { ok: false, provider: "orange_money", error: String(err) }
  }
}

/** Lonestar MTN Mobile Money - Initiate payment */
export async function initiateLonestarPayment(params: InitiateMobileMoneyParams): Promise<MobileMoneyPaymentResult> {
  if (!process.env.LONESTAR_API_KEY || !process.env.LONESTAR_MERCHANT_ID) {
    console.log(`[LONESTAR MTN STUB] Payment: ${params.amountLrd} LRD from ${params.phone} for order ${params.orderId}`)
    return {
      ok: true,
      provider: "lonestar_mtn",
      transactionId: `ls_stub_${Date.now()}`,
      referenceId: params.orderId,
      status: "pending",
    }
  }

  try {
    // Lonestar MTN API (fictional endpoint — replace with real integration docs)
    const res = await fetch("https://api.lonestar.com.lr/momo/v1/collections", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LONESTAR_API_KEY}`,
        "X-Reference-Id": params.orderId,
        "X-Target-Environment": process.env.NODE_ENV === "production" ? "production" : "sandbox",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: String(Math.round(params.amountLrd)),
        currency: "LRD",
        externalId: params.orderId,
        payer: { partyIdType: "MSISDN", partyId: params.phone.replace(/\D/g, "") },
        payerMessage: params.description ?? "TrueRate Marketplace Order",
        payeeNote: `Order ${params.orderId}`,
      }),
    })
    if (res.status === 202) {
      return { ok: true, provider: "lonestar_mtn", transactionId: params.orderId, referenceId: params.orderId, status: "pending" }
    }
    const data = await res.json().catch(() => ({}))
    return { ok: false, provider: "lonestar_mtn", error: data.message ?? `HTTP ${res.status}` }
  } catch (err) {
    return { ok: false, provider: "lonestar_mtn", error: String(err) }
  }
}
