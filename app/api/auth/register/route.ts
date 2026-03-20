import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(128),
  password: z.string().min(6).max(128),
})

/** In-memory user store for development (no DB). Replace with Prisma in production. */
const memUsers = new Map<string, { id: string; name: string; email: string; passwordHash: string; points: number; rank: string; createdAt: string }>()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
    }

    const { name, email, password } = parsed.data
    const normalizedEmail = email.toLowerCase()

    if (process.env.DATABASE_URL) {
      const { getPrismaClient } = await import("@/lib/db/prisma")
      const prisma = getPrismaClient()
      if (prisma) {
        const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
        if (existing) {
          return NextResponse.json({ error: "Email already registered" }, { status: 409 })
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
          data: { email: normalizedEmail, passwordHash, fullName: name, points: 0, rank: "Newcomer" },
          select: { id: true, email: true, fullName: true },
        })
        return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.fullName } })
      }
    }

    // Fallback: in-memory store
    if (memUsers.has(normalizedEmail)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = {
      id: crypto.randomUUID(),
      name,
      email: normalizedEmail,
      passwordHash,
      points: 0,
      rank: "Newcomer",
      createdAt: new Date().toISOString(),
    }
    memUsers.set(normalizedEmail, user)
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
  } catch (err) {
    console.error("[register]", err)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
