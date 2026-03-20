import { NextResponse } from "next/server"
import { z } from "zod"
import { getThreads, createThread, getThreadCount, type ForumCategoryKey } from "@/lib/forums/store"

const VALID_CATEGORIES = ["scamAlerts", "exchangeTips", "marketNews", "changerReviews"] as const

const createSchema = z.object({
  title: z.string().min(5).max(200),
  body: z.string().min(10).max(5000),
  category: z.enum(VALID_CATEGORIES),
  authorName: z.string().min(1).max(60).optional().default("Anonymous"),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") ?? undefined
  const limit = Math.min(Number(searchParams.get("limit") ?? "50"), 100)
  const offset = Math.max(Number(searchParams.get("offset") ?? "0"), 0)

  const [threads, total] = await Promise.all([
    getThreads({ category, limit, offset }),
    getThreadCount(category),
  ])

  return NextResponse.json({ threads, total, limit, offset })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    const { title, body: threadBody, category, authorName } = parsed.data

    // Get author from session if available
    let authorId = "anonymous-" + Date.now()
    let resolvedAuthorName = authorName

    try {
      const { auth } = await import("@/auth")
      const session = await auth()
      if (session?.user?.email) {
        authorId = (session.user as { id?: string }).id ?? authorId
        resolvedAuthorName = session.user.name ?? authorName
      }
    } catch {
      // Auth not critical for posting — allow anonymous
    }

    const thread = await createThread({
      title: title.trim(),
      body: threadBody.trim(),
      category: category as ForumCategoryKey,
      authorId,
      authorName: resolvedAuthorName,
    })

    return NextResponse.json({ ok: true, thread }, { status: 201 })
  } catch (err) {
    console.error("[forums/threads POST]", err)
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 })
  }
}
