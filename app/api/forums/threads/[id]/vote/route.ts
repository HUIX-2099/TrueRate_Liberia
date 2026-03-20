import { NextResponse } from "next/server"
import { z } from "zod"
import { voteThread } from "@/lib/forums/store"

const voteSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)]),
})

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: threadId } = await params
  try {
    const body = await request.json()
    const parsed = voteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "value must be 1 or -1" }, { status: 400 })
    }

    // Use session userId or fallback to IP-based ID
    let userId = "anon"
    try {
      const { auth } = await import("@/auth")
      const session = await auth()
      if (session?.user?.email) {
        userId = (session.user as { id?: string }).id ?? session.user.email
      }
    } catch {
      // anonymous vote
    }

    const result = await voteThread(threadId, userId, parsed.data.value)
    if (!result) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    console.error("[forums/vote POST]", err)
    return NextResponse.json({ error: "Failed to record vote" }, { status: 500 })
  }
}
