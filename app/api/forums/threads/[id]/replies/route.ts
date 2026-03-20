import { NextResponse } from "next/server"
import { z } from "zod"
import { getReplies, createReply } from "@/lib/forums/store"

const replySchema = z.object({
  body: z.string().min(2).max(2000),
  authorName: z.string().min(1).max(60).optional().default("Anonymous"),
})

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const replies = await getReplies(id)
  return NextResponse.json({ replies, total: replies.length })
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: threadId } = await params
  try {
    const body = await request.json()
    const parsed = replySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    let authorId = "anonymous-" + Date.now()
    let authorName = parsed.data.authorName

    try {
      const { auth } = await import("@/auth")
      const session = await auth()
      if (session?.user?.email) {
        authorId = (session.user as { id?: string }).id ?? authorId
        authorName = session.user.name ?? authorName
      }
    } catch {
      // Allow anonymous replies
    }

    const reply = await createReply({
      threadId,
      authorId,
      authorName,
      body: parsed.data.body.trim(),
    })

    if (!reply) {
      return NextResponse.json({ error: "Thread not found or is locked" }, { status: 404 })
    }

    return NextResponse.json({ ok: true, reply }, { status: 201 })
  } catch (err) {
    console.error("[forums/replies POST]", err)
    return NextResponse.json({ error: "Failed to post reply" }, { status: 500 })
  }
}
