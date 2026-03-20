import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { revokeApiKey } from "@/lib/api-keys/store"

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const userId = (session?.user as any)?.id ?? "demo-user"
  const revoked = revokeApiKey(id, userId)
  if (!revoked) {
    return NextResponse.json({ error: "Key not found or not owned by you." }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
