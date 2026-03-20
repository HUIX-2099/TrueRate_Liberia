import { NextResponse } from "next/server"
import { getThreadById, getReplies } from "@/lib/forums/store"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [thread, replies] = await Promise.all([getThreadById(id), getReplies(id)])
  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 })
  }
  return NextResponse.json({ thread, replies })
}
