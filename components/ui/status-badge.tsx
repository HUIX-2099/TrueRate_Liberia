"use client"

import { cn } from "@/lib/utils"

export type StatusVariant = "stable" | "watch" | "volatile" | "positive" | "warning" | "negative" | "neutral"

export interface StatusBadgeProps {
  label: string
  variant?: StatusVariant
  size?: "sm" | "md"
  className?: string
}

const variantClasses: Record<StatusVariant, string> = {
  stable:
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  watch:
    "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  volatile:
    "bg-destructive/15 text-destructive border-destructive/30",
  positive:
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  warning:
    "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  negative:
    "bg-destructive/15 text-destructive border-destructive/30",
  neutral:
    "bg-muted/80 text-muted-foreground border-border/60",
}

const sizeClasses = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
}

export function StatusBadge({
  label,
  variant = "neutral",
  size = "md",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-md border",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      role="status"
    >
      {label}
    </span>
  )
}
