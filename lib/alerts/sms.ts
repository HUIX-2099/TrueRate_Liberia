/**
 * SMS Alert Adapter.
 * Supports Twilio and Africa's Talking based on env vars.
 * Falls back to a console log stub for development.
 */

export interface SmsResult {
  ok: boolean
  provider: string
  messageId?: string
  error?: string
}

export async function sendSms(to: string, message: string): Promise<SmsResult> {
  const phone = to.startsWith("+") ? to : `+${to}`

  // ── Twilio ──────────────────────────────────────────────────────────────────
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env
      const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")
      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: "POST",
          headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ To: phone, From: TWILIO_PHONE_NUMBER, Body: message }),
        }
      )
      const data = await res.json()
      if (res.ok) return { ok: true, provider: "twilio", messageId: data.sid }
      return { ok: false, provider: "twilio", error: data.message }
    } catch (err) {
      return { ok: false, provider: "twilio", error: String(err) }
    }
  }

  // ── Africa's Talking ────────────────────────────────────────────────────────
  if (process.env.AT_API_KEY && process.env.AT_USERNAME) {
    try {
      const res = await fetch("https://api.africastalking.com/version1/messaging", {
        method: "POST",
        headers: {
          Accept: "application/json",
          apiKey: process.env.AT_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: process.env.AT_USERNAME,
          to: phone,
          message,
        }),
      })
      const data = await res.json()
      const status = data?.SMSMessageData?.Recipients?.[0]?.status
      if (status === "Success") {
        return { ok: true, provider: "africas_talking", messageId: data?.SMSMessageData?.Recipients?.[0]?.messageId }
      }
      return { ok: false, provider: "africas_talking", error: status ?? "Unknown error" }
    } catch (err) {
      return { ok: false, provider: "africas_talking", error: String(err) }
    }
  }

  // ── Development stub ────────────────────────────────────────────────────────
  console.log(`[SMS STUB] To: ${phone}\nMessage: ${message}`)
  return { ok: true, provider: "stub", messageId: `stub-${Date.now()}` }
}

/** Send a rate alert SMS to a subscriber. */
export async function sendRateAlert(phone: string, rate: number, context: string): Promise<SmsResult> {
  const msg = `TrueRate Liberia Alert: USD/LRD rate is now ${rate.toFixed(2)}. ${context} Reply STOP to unsubscribe.`
  return sendSms(phone, msg)
}
