"use client"

import { cn } from "@/lib/utils"

export interface MetricCardProps {
  label: string
  value: React.ReactNode
  subtext?: string
  variant?: "default" | "positive" | "warning" | "negative"
  className?: string
  children?: React.ReactNode
}

const variantClasses = {
  default: "bg-card/80 border border-border/25 text-foreground shadow-sm",
  positive: "bg-muted/40 border border-border/40 dark:bg-muted/40 border border-border/40 border-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  warning: "bg-muted/40 border border-border/40 dark:bg-muted/40 border border-border/40 border-amber-500/20 text-amber-700 dark:text-amber-400",
  negative: "bg-muted/40 border border-border/40 dark:bg-muted/40 border border-border/40 border-destructive/20 text-destructive",
}

export function MetricCard({
  label,
  value,
  subtext,
  variant = "default",
  className,
  children,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-shadow hover:shadow-md",
        variantClasses[variant],
        className
      )}
      role="group"
      aria-label={`${label}: ${typeof value === "string" ? value : ""}`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </p>
      <div className="text-lg sm:text-xl font-bold tabular-nums">{value}</div>
      {subtext != null && subtext !== "" && (
        <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
      )}
      {children}
    </div>
  )
}
