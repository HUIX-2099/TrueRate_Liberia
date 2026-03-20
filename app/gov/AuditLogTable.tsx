"use client"

import { useState, useEffect, useTransition } from "react"
import { cn } from "@/lib/utils"
import { Shield, RefreshCw, Filter, AlertTriangle, Info, AlertOctagon } from "lucide-react"
import type { AuditEntry } from "@/lib/gov/audit-log"

const SEVERITY_STYLES: Record<AuditEntry["severity"], { bg: string; text: string; icon: React.ElementType }> = {
  info:     { bg: "bg-muted/40 border border-border/40",     text: "text-primary",     icon: Info          },
  warn:     { bg: "bg-muted/40 border border-border/40",   text: "text-amber-600 dark:text-amber-400",  icon: AlertTriangle  },
  critical: { bg: "bg-muted/40 border border-border/40", text: "text-destructive",  icon: AlertOctagon  },
}

export function AuditLogTable() {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"" | "info" | "warn" | "critical">("")
  const [isPending, startTransition] = useTransition()

  const fetchLog = () => {
    setLoading(true)
    const url = `/api/gov/audit-log?limit=50${filter ? `&severity=${filter}` : ""}`
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setEntries(d.entries ?? [])
        setTotal(d.total ?? 0)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    queueMicrotask(() => fetchLog())
  }, [filter])

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">
            Audit Log <span className="text-muted-foreground font-normal">({total.toLocaleString()} entries)</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-lg border border-border/50 bg-muted/20 px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">All severities</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="critical">Critical</option>
          </select>
          <button
            onClick={() => startTransition(fetchLog)}
            disabled={isPending || loading}
            className="flex items-center gap-1.5 rounded-lg border border-border/40 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", (isPending || loading) && "animate-spin")} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border/40 bg-card shadow-sm">
        {loading && entries.length === 0 ? (
          <div className="p-10 text-center">
            <div className="h-8 w-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading audit entries…</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="p-10 text-center">
            <Shield className="h-8 w-8 /30 mx-auto mb-3 text-primary" />
            <p className="text-sm text-muted-foreground">No audit entries yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm" aria-label="Audit log">
            <thead>
              <tr className="border-b border-border/40 bg-muted/10">
                <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground w-36">Time</th>
                <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action</th>
                <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User</th>
                <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Severity</th>
                <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Details</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const { bg, text, icon: SevIcon } = SEVERITY_STYLES[entry.severity]
                return (
                  <tr key={entry.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                    <td className="p-3 text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"
                      })}
                    </td>
                    <td className="p-3 font-mono text-xs text-foreground">{entry.action}</td>
                    <td className="p-3 text-xs text-muted-foreground font-mono">{entry.userId ?? "anon"}</td>
                    <td className="p-3">
                      <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wide", bg, text)}>
                        <SevIcon className="h-3 w-3 text-primary" />
                        {entry.severity}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground font-mono hidden lg:table-cell max-w-xs truncate">
                      {entry.details ? JSON.stringify(entry.details) : "—"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
