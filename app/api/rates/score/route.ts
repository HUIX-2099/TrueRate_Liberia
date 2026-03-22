import { NextResponse, type NextRequest } from "next/server"
import { getServerApiUrl } from "@/lib/api/server-base-url"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

function calcScore(
  quotedRate: number,
  marketRate: number,
): {
  grade: string
  score: string
  diff: number
  diffPct: number
  verdict: string
  advice: string
  color: string
} {
  const diff = quotedRate - marketRate
  const diffPct = (diff / marketRate) * 100

  let grade: string
  let score: string
  let verdict: string
  let advice: string
  let color: string

  if (diffPct >= 0.5) {
    grade = "A"
    score = "Excellent"
    color = "emerald"
    verdict = `This rate is L$${Math.abs(diff).toFixed(2)} above market — better than average.`
    advice = "This is a good rate. You can accept it or try one more changer to confirm."
  } else if (diffPct >= -0.5) {
    grade = "B"
    score = "Fair"
    color = "blue"
    verdict = `This rate is very close to the live market rate of L$${marketRate.toFixed(2)}.`
    advice = "This is a fair rate. Acceptable for most transactions."
  } else if (diffPct >= -1.5) {
    grade = "C"
    score = "Below Average"
    color = "amber"
    verdict = `This rate is L$${Math.abs(diff).toFixed(2)} below market (${Math.abs(diffPct).toFixed(1)}% worse).`
    advice = "You could do better. Try 1-2 more changers before committing."
  } else if (diffPct >= -3) {
    grade = "D"
    score = "Poor"
    color = "orange"
    verdict = `This rate is L$${Math.abs(diff).toFixed(2)} below market (${Math.abs(diffPct).toFixed(1)}% worse).`
    advice = "This is a below-market rate. Shop around — you should find better."
  } else {
    grade = "F"
    score = "Suspicious"
    color = "rose"
    verdict = `This rate is L$${Math.abs(diff).toFixed(2)} below market (${Math.abs(diffPct).toFixed(1)}% worse). This may be fraud.`
    advice = "Do not exchange at this rate. Report this changer on TrueRate if they refuse to improve."
  }

  return { grade, score, diff, diffPct, verdict, advice, color }
}

function parseJsonRate(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null
  const r = (payload as { rate?: unknown }).rate
  return typeof r === "number" && Number.isFinite(r) ? r : null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const quotedRate = typeof body?.quotedRate === "number" ? body.quotedRate : null
    if (!quotedRate || quotedRate < 100 || quotedRate > 300) {
      return NextResponse.json({ error: "Valid quotedRate required (100-300)" }, { status: 400 })
    }

    const [rateRes, cblRes] = await Promise.allSettled([
      fetch(getServerApiUrl("/api/rates/live"), { cache: "no-store" }).then((r) => r.json()),
      fetch(getServerApiUrl("/api/rates/cbl"), { cache: "no-store" }).then((r) => r.json()),
    ])

    const liveJson = rateRes.status === "fulfilled" ? rateRes.value : null
    const cblJson = cblRes.status === "fulfilled" ? cblRes.value : null

    const parsedLive = parseJsonRate(liveJson)
    const marketRate = parsedLive != null && parsedLive > 0 ? parsedLive : 183

    const parsedCbl = parseJsonRate(cblJson)
    const cblRate = parsedCbl != null && parsedCbl > 0 ? parsedCbl : null

    const result = calcScore(quotedRate, marketRate)

    const supabase = createServiceRoleClient()
    if (supabase) {
      const { error } = await supabase.from("rate_score_lookups").insert({
        quoted_rate: quotedRate,
        market_rate: marketRate,
        score: result.score,
        grade: result.grade,
        created_at: new Date().toISOString(),
      })
      if (error) console.error("rate_score_lookups insert:", error.message)
    }

    return NextResponse.json({
      ok: true,
      quotedRate,
      marketRate,
      cblRate,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
