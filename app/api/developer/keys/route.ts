import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { listApiKeys, createApiKey, TIER_LIMITS } from "@/lib/api-keys/store"
import type { ApiTier } from "@/lib/api-keys/store"
import { z } from "zod"

const CreateKeySchema = z.object({
  name: z.string().min(1).max(80),
  tier: z.enum(["free", "standard", "premium", "enterprise"]).optional(),
})

export async function GET() {
  const session = await auth()
  const userId = (session?.user as any)?.id ?? "demo-user"
  const keys = listApiKeys(userId).map((k) => ({
    id: k.id,
    keyPrefix: k.keyPrefix,
    name: k.name,
    tier: k.tier,
    tierLabel: TIER_LIMITS[k.tier].label,
    rateLimit: k.rateLimit,
    requestCount: k.requestCount,
    active: k.active,
    createdAt: k.createdAt,
    lastUsedAt: k.lastUsedAt ?? null,
  }))
  return NextResponse.json({ keys })
}

export async function POST(req: Request) {
  const session = await auth()
  const userId = (session?.user as any)?.id ?? "demo-user"
  const body = await req.json().catch(() => ({}))
  const parsed = CreateKeySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }
  const record = createApiKey({
    userId,
    name: parsed.data.name,
    tier: parsed.data.tier as ApiTier | undefined,
  })
  return NextResponse.json({
    id: record.id,
    key: record.key,        // returned once — client must copy it
    keyPrefix: record.keyPrefix,
    name: record.name,
    tier: record.tier,
    rateLimit: record.rateLimit,
    createdAt: record.createdAt,
  }, { status: 201 })
}
