import { NextResponse } from "next/server"
import { buildSmeDigestContent } from "@/lib/digest/build-sme-digest"
import { getServerApiBaseUrl } from "@/lib/api/server-base-url"
import { getSubscribers } from "@/lib/digest/subscribers"

export const dynamic = "force-dynamic"
export const revalidate = 0

const RESEND_API_URL = "https://api.resend.com/emails"

/**
 * POST /api/digest/send
 * Sends SME digest to all subscribers. Protected by DIGEST_CRON_SECRET or CRON_SECRET.
 * Body: { frequency?: "daily" | "weekly" } — optional, send only to subscribers with this frequency.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization")
  const secretHeader = request.headers.get("x-cron-secret")
  const digestSecret = process.env.DIGEST_CRON_SECRET ?? process.env.CRON_SECRET
  const authorized =
    digestSecret &&
    (authHeader === `Bearer ${digestSecret}` || secretHeader === digestSecret)

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.DIGEST_FROM_EMAIL ?? "TrueRate <onboarding@resend.dev>"

  if (!resendKey) {
    return NextResponse.json(
      {
        error: "Email not configured",
        message: "Set RESEND_API_KEY and DIGEST_FROM_EMAIL to send digest emails",
      },
      { status: 503 }
    )
  }

  try {
    let body: { frequency?: string } = {}
    try {
      body = (await request.json()) as { frequency?: string }
    } catch {
      // no body
    }
    const frequencyFilter = body.frequency === "daily" || body.frequency === "weekly" ? body.frequency : undefined

    const subscribers = getSubscribers(frequencyFilter)
    if (subscribers.length === 0) {
      return NextResponse.json({
        ok: true,
        sent: 0,
        message: "No subscribers to send to",
      })
    }

    const baseUrl = getServerApiBaseUrl().replace(/\/$/, "")
    const { subject, html, text } = await buildSmeDigestContent(baseUrl)

    let sent = 0
    const errors: string[] = []

    for (const sub of subscribers) {
      try {
        const res = await fetch(RESEND_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [sub.email],
            subject,
            html,
            text,
          }),
        })
        if (res.ok) {
          sent++
        } else {
          const err = await res.text()
          errors.push(`${sub.email}: ${res.status} ${err}`)
        }
      } catch (e) {
        errors.push(`${sub.email}: ${e instanceof Error ? e.message : String(e)}`)
      }
    }

    return NextResponse.json({
      ok: true,
      sent,
      total: subscribers.length,
      errors: errors.length ? errors : undefined,
    })
  } catch (error) {
    console.error("[Digest send]", error)
    return NextResponse.json(
      {
        error: "Digest send failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
