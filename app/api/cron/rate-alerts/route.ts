import { NextResponse, type NextRequest } from "next/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getServerApiUrl } from "@/lib/api/server-base-url"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"
export const revalidate = 0

/**
 * GET /api/cron/rate-alerts
 * Evaluates active `rate_alerts` against `/api/rates/live` and optionally logs crisis events.
 * Auth: `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret: <CRON_SECRET>` (same as refresh-rates).
 */
export async function GET(req: NextRequest) {
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
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 })
  }

  const rateRes = await fetch(getServerApiUrl("/api/rates/live"), { cache: "no-store" })
  const rateData = (await rateRes.json()) as { rate?: number }
  const currentRate = rateData?.rate ?? 0

  if (!rateRes.ok || !currentRate || currentRate < 100) {
    return NextResponse.json({ error: "Could not fetch current rate" }, { status: 500 })
  }

  const { data: alerts, error } = await supabase
    .from("rate_alerts")
    .select("*")
    .eq("active", true)
    .eq("triggered", false)

  if (error) {
    console.error("Rate alerts cron query:", error.message)
    return NextResponse.json({ checked: 0, triggered: 0 })
  }
  if (!alerts) {
    return NextResponse.json({ checked: 0, triggered: 0 })
  }

  let triggered = 0
  const now = new Date().toISOString()

  for (const alert of alerts) {
    const target = Number(alert.target_rate)
    const dir = alert.direction as string
    const shouldTrigger =
      (dir === "above" && currentRate >= target) || (dir === "below" && currentRate <= target)

    if (shouldTrigger) {
      const { error: updateError } = await supabase
        .from("rate_alerts")
        .update({ triggered: true, triggered_at: now })
        .eq("id", alert.id)

      if (updateError) {
        console.error(`Rate alert update failed (${alert.id}):`, updateError.message)
        continue
      }

      triggered++
      console.log(
        `✅ Alert triggered: ${alert.id} — rate ${currentRate} went ${dir} ${target}`,
      )
      // TODO: Send actual SMS/email notification when provider is configured
      // For now: log the trigger for the admin dashboard
    }
  }

  await checkCrisisConditions(supabase, currentRate)

  return NextResponse.json({
    ok: true,
    currentRate,
    checked: alerts.length,
    triggered,
    timestamp: now,
  })
}

async function checkCrisisConditions(supabase: SupabaseClient, currentRate: number) {
  void currentRate
  try {
    const { data: oldRates } = await supabase
      .from("exchange_rates")
      .select("rate, recorded_at")
      .eq("base_currency", "USD")
      .eq("target_currency", "LRD")
      .order("recorded_at", { ascending: false })
      .limit(25)

    if (!oldRates || oldRates.length < 2) return

    const latestRate = Number(oldRates[0]?.rate)
    const oldestRate = Number(oldRates[oldRates.length - 1]?.rate)
    if (!Number.isFinite(latestRate) || !Number.isFinite(oldestRate) || oldestRate === 0) return

    const changePct = Math.abs((latestRate - oldestRate) / oldestRate) * 100

    if (changePct > 3) {
      const { data: existingCrisis } = await supabase
        .from("crisis_events")
        .select("id")
        .eq("resolved", false)
        .eq("trigger_type", "rate_spike")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!existingCrisis) {
        const crisisId = "CR-" + Date.now().toString(36)
        const { error: insertError } = await supabase.from("crisis_events").insert({
          id: crisisId,
          severity: changePct > 5 ? "high" : "medium",
          trigger_type: "rate_spike",
          trigger_value: changePct,
          threshold: 3,
          brief: `USD/LRD rate moved ${changePct.toFixed(1)}% — from L$${oldestRate.toFixed(2)} to L$${latestRate.toFixed(2)}. Monitor parallel market activity.`,
          actions: [
            "Check CBL official rate before exchanging",
            "Avoid large exchanges until rate stabilizes",
            "Compare at least 3 changers before committing",
          ],
          avoid: [
            "Don't panic exchange — sudden moves often reverse",
            "Avoid unofficial changers during volatile periods",
          ],
          resolved: false,
          created_at: new Date().toISOString(),
        })
        if (insertError) {
          console.error("Crisis event insert:", insertError.message)
        } else {
          console.log(`🚨 Crisis event logged: ${crisisId} — ${changePct.toFixed(1)}% rate movement`)
        }
      }
    }
  } catch (err) {
    console.error("Crisis check error:", err)
  }
}
