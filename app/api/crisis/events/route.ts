import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const dynamic = "force-dynamic"

type AnthropicMessagesResponse = {
  content?: Array<{ type?: string; text?: string }>
  error?: { message?: string; type?: string }
}

export async function GET() {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    return NextResponse.json({ active: false, crises: [], severity: null })
  }

  const { data: activeCrises, error } = await supabase
    .from("crisis_events")
    .select("*")
    .eq("resolved", false)
    .order("created_at", { ascending: false })
    .limit(3)

  if (error) {
    console.error("crisis_events GET:", error.message)
    return NextResponse.json({ active: false, crises: [], severity: null })
  }

  if (activeCrises && activeCrises.length > 0) {
    const first = activeCrises[0] as { severity?: string }
    return NextResponse.json({
      active: true,
      crises: activeCrises,
      severity: first.severity ?? null,
    })
  }

  return NextResponse.json({ active: false, crises: [], severity: null })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const crisisId = typeof body?.crisisId === "string" ? body.crisisId.trim() : ""
    if (!crisisId) return NextResponse.json({ error: "crisisId required" }, { status: 400 })

    const supabase = createServiceRoleClient()
    if (!supabase) return NextResponse.json({ error: "DB not configured" }, { status: 503 })

    const { data: crisis, error: fetchError } = await supabase
      .from("crisis_events")
      .select("*")
      .eq("id", crisisId)
      .single()

    if (fetchError || !crisis) {
      return NextResponse.json({ error: "Crisis not found" }, { status: 404 })
    }

    const c = crisis as {
      trigger_type?: string
      severity?: string
      brief?: string
      created_at?: string
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: "AI not configured" }, { status: 503 })

    const prompt = `You are TRFN Crisis Analyst for TrueRate Liberia.

Crisis Event:
- Type: ${c.trigger_type ?? "unknown"}
- Severity: ${c.severity ?? "unknown"}
- Trigger: ${c.brief ?? ""}
- Detected: ${c.created_at ?? ""}

Write a concise crisis brief for everyday Liberians (not experts). Format:

**What's happening:**
[1-2 sentences — plain English, no jargon]

**What to do right now:**
- [Action 1]
- [Action 2]
- [Action 3]

**What NOT to do:**
- [Avoid 1]
- [Avoid 2]

**When this will likely pass:**
[Honest estimate — 1 sentence]

Keep it under 150 words. Be direct and calm — no panic, just facts.`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    const data = (await response.json()) as AnthropicMessagesResponse

    if (!response.ok) {
      const msg = data.error?.message ?? "Anthropic API request failed"
      console.error("Anthropic error:", msg)
      return NextResponse.json({ error: msg }, { status: 502 })
    }

    const firstText = data.content?.find((b) => typeof b.text === "string" && b.text.length > 0)
    const generated = firstText?.text?.trim() ?? ""
    const brief = generated.length > 0 ? generated : (c.brief ?? "")

    if (generated.length > 0) {
      const { error: updateError } = await supabase.from("crisis_events").update({ brief: generated }).eq("id", crisisId)
      if (updateError) console.error("crisis_events brief update:", updateError.message)
    }

    return NextResponse.json({ ok: true, brief })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
