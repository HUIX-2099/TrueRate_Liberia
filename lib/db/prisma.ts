/**
 * Singleton Prisma client — Prisma 7.x compatible.
 * Returns null when DATABASE_URL is not configured (graceful degradation).
 *
 * In Prisma 7.x the connection URL is no longer in schema.prisma.
 * We pass it via a database adapter in the PrismaClient constructor.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
type PrismaClient = any

let prismaInstance: PrismaClient | null = null

export function getPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) return null

  if (!prismaInstance) {
    try {
      const { PrismaClient } = require("@prisma/client")

      // Prisma 7.x: pass the connection URL via adapter.
      // Falls back to plain constructor for local/older setups.
      prismaInstance = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
        log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      })
    } catch (e) {
      console.warn("[prisma] Failed to initialise PrismaClient:", e)
      return null
    }
  }

  return prismaInstance
}

export type { PrismaClient }
/* eslint-enable @typescript-eslint/no-explicit-any */
