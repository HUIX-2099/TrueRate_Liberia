"use client"

export const dynamic = "force-dynamic"

import { withGovernmentAuth } from "@/lib/gov/withGovernmentAuth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuditLogTable } from "./AuditLogTable"
import { Shield, Activity, Users, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

function GovDashboard() {
  const [stats, setStats] = useState({ totalLogs: 0, criticalCount: 0, warnCount: 0 })

  useEffect(() => {
    fetch("/api/gov/audit-log?limit=200")
      .then((r) => r.json())
      .then((d) => {
        const entries = d.entries ?? []
        setStats({
          totalLogs: d.total ?? 0,
          criticalCount: entries.filter((e: { severity: string }) => e.severity === "critical").length,
          warnCount: entries.filter((e: { severity: string }) => e.severity === "warn").length,
        })
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/40 border border-border/40">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Government Portal</p>
              <h1 className="text-2xl font-black text-foreground">Security &amp; Compliance Dashboard</h1>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid gap-4 sm:grid-cols-3 mb-10">
            <div className="rounded-2xl border border-border/40 bg-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-4 w-4 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total events</p>
              </div>
              <p className="text-3xl font-black tabular-nums text-foreground">{stats.totalLogs.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Warnings</p>
              </div>
              <p className="text-3xl font-black tabular-nums text-amber-600 dark:text-amber-400">{stats.warnCount}</p>
            </div>
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-4 w-4 text-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Critical events</p>
              </div>
              <p className="text-3xl font-black tabular-nums text-destructive">{stats.criticalCount}</p>
            </div>
          </div>

          {/* Audit log table */}
          <AuditLogTable />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default withGovernmentAuth(GovDashboard, "gov")
