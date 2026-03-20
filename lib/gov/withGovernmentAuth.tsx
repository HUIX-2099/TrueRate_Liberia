"use client"

/**
 * Government/Admin security HOC.
 *
 * Wraps any page component and:
 *   1. Checks that the user is authenticated
 *   2. Checks that the user has the "gov" or "admin" role
 *   3. Shows an access denied screen if either check fails
 *
 * Usage (client component):
 *   export default withGovernmentAuth(MyAdminPage)
 *
 * For server components, use `requireGovAuth()` from lib/gov/server-auth.ts
 */

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Shield, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"

export type GovRole = "gov" | "admin" | "superadmin"

const ALLOWED_ROLES: GovRole[] = ["gov", "admin", "superadmin"]

function AccessDenied({ reason }: { reason: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/40 border border-border/40 mx-auto">
          <Lock className="h-9 w-9 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground mb-2">Access Restricted</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">{reason}</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/auth/signin?callbackUrl=/gov"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Shield className="h-4 w-4 text-primary" />
            Sign in with government credentials
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/40 px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
            Back to TrueRate
          </Link>
        </div>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Verifying credentials…</p>
      </div>
    </div>
  )
}

export function withGovernmentAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: GovRole = "gov"
) {
  const ProtectedComponent = (props: P) => {
    const sessionResult = useSession()
    // useSession may return undefined if SessionProvider is missing — guard defensively
    const status = sessionResult?.status ?? "loading"
    const session = sessionResult?.data

    if (status === "loading") return <LoadingScreen />

    if (!session) {
      return (
        <AccessDenied reason="You must sign in with your government credentials to access this portal." />
      )
    }

    const userRole = (session.user as any)?.role as string | undefined
    if (!userRole || !ALLOWED_ROLES.includes(userRole as GovRole)) {
      return (
        <AccessDenied reason="Your account does not have the required clearance level to access this portal. Contact your system administrator." />
      )
    }

    return <Component {...props} />
  }

  ProtectedComponent.displayName = `withGovernmentAuth(${Component.displayName ?? Component.name})`
  return ProtectedComponent
}
