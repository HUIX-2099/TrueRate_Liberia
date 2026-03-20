/**
 * Edge-compatible NextAuth configuration.
 *
 * This file MUST NOT import Prisma, bcryptjs, or any other Node.js-only module.
 * It is used by middleware.ts which runs in the Edge Runtime.
 *
 * Full server-side auth (with Prisma + bcrypt) lives in auth.ts.
 */
import type { NextAuthOptions } from "next-auth"

const PROTECTED_PATHS = [
  "/dashboard",
  "/admin",
  "/business",
  "/gov",
  "/developer",
]

export const authConfig: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  session: { strategy: "jwt" as const },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as Record<string, unknown>
        token.id = user.id
        token.role = u.role ?? "USER"
        token.points = u.points ?? 0
        token.rank = u.rank ?? "Newcomer"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).id = token.id as string
        ;(session.user as Record<string, unknown>).role = token.role
        ;(session.user as Record<string, unknown>).points = token.points
        ;(session.user as Record<string, unknown>).rank = token.rank
      }
      return session
    },
  },
  providers: [], // populated in auth.ts with Credentials + Google
  secret: process.env.NEXTAUTH_SECRET ?? "truerate-dev-secret-change-in-production",
}
