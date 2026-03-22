import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"
export const revalidate = 0

/**
 * GET /api/cron/refresh-rates
 * Vercel Cron (or any scheduler): fetches USD-based rates and writes to `exchange_rates` using the service role.
 * Auth: `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret: <CRON_SECRET>` (same as digest/cron routes).
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  const secretHeader = req.headers.get("x-cron-secret")
  const cronSecret = process.env.CRON_SECRET
  const authorized =
    !!cronSecret &&
    (authHeader === `Bearer ${cronSecret}` || secretHeader === cronSecret)

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createServiceRoleClient()
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase service role not configured (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)" },
      { status: 503 }
    )
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "Missing EXCHANGE_RATE_API_KEY" }, { status: 500 })
  }

  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`, {
      cache: "no-store",
    })
    const data = (await res.json()) as {
      result?: string
      conversion_rates?: Record<string, number>
    }

    if (data.result !== "success" || !data.conversion_rates) {
      throw new Error("ExchangeRate API error")
    }

    const rates = data.conversion_rates
    const timestamp = new Date().toISOString()

    const pairs: { target: string; rate: number | undefined }[] = [
      { target: "LRD", rate: rates.LRD },
      { target: "EUR", rate: rates.EUR },
      { target: "GBP", rate: rates.GBP },
      { target: "NGN", rate: rates.NGN },
      { target: "GHS", rate: rates.GHS },
    ]

    const inserts = pairs
      .filter((p): p is { target: string; rate: number } => typeof p.rate === "number" && !Number.isNaN(p.rate))
      .map((p) => ({
        base_currency: "USD",
        target_currency: p.target,
        rate: p.rate,
        source: "ExchangeRate-API",
      }))

    if (inserts.length === 0) {
      throw new Error("No valid conversion rates returned")
    }

    const { error } = await supabase.from("exchange_rates").insert(inserts)

    if (error) throw error

    console.log(`✅ Rates refreshed at ${timestamp}`)
    return NextResponse.json({
      success: true,
      timestamp,
      rates: { LRD: rates.LRD, EUR: rates.EUR, GBP: rates.GBP },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("❌ Cron rate refresh failed:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
