/**
 * Email Alert Adapter.
 * Supports Resend and SendGrid based on env vars.
 * Falls back to console stub for development.
 */

export interface EmailResult {
  ok: boolean
  provider: string
  messageId?: string
  error?: string
}

export interface EmailPayload {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
}

const DEFAULT_FROM = process.env.EMAIL_FROM ?? "TrueRate Liberia <alerts@truerateliberia.com>"

export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  const { to, subject, html, text } = payload
  const from = payload.from ?? DEFAULT_FROM

  // ── Resend ──────────────────────────────────────────────────────────────────
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, subject, html, text }),
      })
      const data = await res.json()
      if (res.ok) return { ok: true, provider: "resend", messageId: data.id }
      return { ok: false, provider: "resend", error: data.message ?? data.error }
    } catch (err) {
      return { ok: false, provider: "resend", error: String(err) }
    }
  }

  // ── SendGrid ─────────────────────────────────────────────────────────────────
  if (process.env.SENDGRID_API_KEY) {
    try {
      const toArr = Array.isArray(to) ? to : [to]
      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: toArr.map((e) => ({ email: e })) }],
          from: { email: from.match(/<(.+)>/)?.[1] ?? from, name: "TrueRate Liberia" },
          subject,
          content: [
            { type: "text/plain", value: text ?? subject },
            { type: "text/html", value: html },
          ],
        }),
      })
      if (res.ok) return { ok: true, provider: "sendgrid", messageId: res.headers.get("X-Message-Id") ?? undefined }
      const data = await res.json().catch(() => ({}))
      return { ok: false, provider: "sendgrid", error: JSON.stringify(data.errors) }
    } catch (err) {
      return { ok: false, provider: "sendgrid", error: String(err) }
    }
  }

  // ── Development stub ─────────────────────────────────────────────────────────
  console.log(`[EMAIL STUB] To: ${JSON.stringify(to)}\nSubject: ${subject}\n---\n${text ?? html}`)
  return { ok: true, provider: "stub", messageId: `stub-${Date.now()}` }
}

/** Send a digest email to a subscriber. */
export async function sendDigestEmail(email: string, subject: string, html: string): Promise<EmailResult> {
  return sendEmail({ to: email, subject, html })
}

/** Send a rate alert email. */
export async function sendRateAlertEmail(email: string, rate: number, context: string): Promise<EmailResult> {
  const subject = `TrueRate Alert: USD/LRD is now ${rate.toFixed(2)}`
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h2 style="color:#0e7490">TrueRate Liberia — Rate Alert</h2>
      <p style="font-size:32px;font-weight:bold;color:#0f172a">$1 = ${rate.toFixed(2)} LRD</p>
      <p style="color:#475569">${context}</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0" />
      <p style="font-size:12px;color:#94a3b8">
        You received this alert because you subscribed to rate notifications on TrueRate Liberia.<br/>
        <a href="https://truerateliberia.com/tools#alerts" style="color:#0e7490">Manage your alerts</a>
      </p>
    </div>
  `
  return sendEmail({ to: email, subject, html })
}
