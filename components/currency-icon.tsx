"use client"

import { cn } from "@/lib/utils"

const CURRENCY_FLAGS: Record<string, string> = {
  USD: "🇺🇸",
  LRD: "🇱🇷",
  SLL: "🇸🇱",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  NGN: "🇳🇬",
  GHS: "🇬🇭",
  XOF: "🌍",
}

export interface CurrencyIconProps {
  /** Currency code (e.g. USD, LRD) */
  code: string
  /** Optional flag emoji override */
  flag?: string
  /** Show code next to the flag */
  showCode?: boolean
  /** Size: sm (input prefix), default (selector), lg */
  size?: "sm" | "default" | "lg"
  className?: string
}

export function CurrencyIcon({ code, flag, showCode = false, size = "default", className }: CurrencyIconProps) {
  const emoji = flag ?? CURRENCY_FLAGS[code] ?? "💱"
  const sizeClasses = {
    sm: "h-6 w-6 text-base",
    default: "h-8 w-8 text-lg",
    lg: "h-10 w-10 text-xl",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg border border-border/50 bg-muted/50 shrink-0 overflow-hidden",
        sizeClasses[size],
        className,
      )}
      title={code}
    >
      <span className="leading-none" aria-hidden>{emoji}</span>
      {showCode && (
        <span className="ml-1.5 text-xs font-medium text-foreground tabular-nums">{code}</span>
      )}
    </span>
  )
}

/** Inline icon only (no code), for input prefixes and tight spaces */
export function CurrencyIconOnly({ code, flag, size = "sm", className }: Omit<CurrencyIconProps, "showCode">) {
  const emoji = flag ?? CURRENCY_FLAGS[code] ?? "💱"
  const sizeClasses = {
    sm: "h-6 w-6 text-sm",
    default: "h-7 w-7 text-base",
    lg: "h-8 w-8 text-lg",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-border/40 bg-muted/40 shrink-0 overflow-hidden",
        sizeClasses[size],
        className,
      )}
      title={code}
      aria-hidden
    >
      {emoji}
    </span>
  )
}
