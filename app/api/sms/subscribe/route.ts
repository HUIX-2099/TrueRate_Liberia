import { NextResponse } from "next/server"

/**
 * SMS subscription store. Replace with a database for production.
 * To send real SMS, set env SMS_PROVIDER (e.g. "twilio" | "africas_talking")
 * and the corresponding API key (SMS_API_KEY or TWILIO_* / AFRICAS_TALKING_*).
 */
const subscriptions: Array<{
  phone: string
  frequency: string
  alerts: { rateChanges: boolean; weeklyReport: boolean; marketNews: boolean }
  createdAt: string
}> = []

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length <= 8) return "+231" + digits
  if (digits.startsWith("231")) return "+" + digits
  return "+231" + digits.slice(-8)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const phoneRaw = typeof body?.phone === "string" ? body.phone.trim() : ""
    if (!phoneRaw) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    const phone = normalizePhone(phoneRaw)
    const frequency = ["daily", "weekly", "major"].includes(body?.frequency) ? body.frequency : "daily"
    const alerts = {
      rateChanges: typeof body?.alerts?.rateChanges === "boolean" ? body.alerts.rateChanges : true,
      weeklyReport: typeof body?.alerts?.weeklyReport === "boolean" ? body.alerts.weeklyReport : false,
      marketNews: typeof body?.alerts?.marketNews === "boolean" ? body.alerts.marketNews : false,
    }

    const existing = subscriptions.findIndex((s) => s.phone === phone)
    const entry = { phone, frequency, alerts, createdAt: new Date().toISOString() }
    if (existing >= 0) {
      subscriptions[existing] = entry
    } else {
      subscriptions.push(entry)
    }

    // Optional: when SMS_PROVIDER and API key are set, send confirmation SMS or register with provider
    // const provider = process.env.SMS_PROVIDER
    // if (provider === "twilio" && process.env.TWILIO_ACCOUNT_SID) { ... }
    // if (provider === "africas_talking" && process.env.AFRICAS_TALKING_API_KEY) { ... }

    return NextResponse.json({ ok: true, phone })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
