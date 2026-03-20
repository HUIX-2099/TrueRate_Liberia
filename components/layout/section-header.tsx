"use client"

import { cn } from "@/lib/utils"

export interface SectionHeaderProps {
  id?: string
  badge?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** Extra actions (e.g. link button) below description */
  actions?: React.ReactNode
  className?: string
  /** Center (default) or left */
  align?: "center" | "left"
}

export function SectionHeader({
  id,
  badge,
  title,
  description,
  actions,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "mb-5 sm:mb-6 md:mb-8 lg:mb-10 min-w-0 max-w-full",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className
      )}
    >
      {badge && (
        <div
          className={cn(
            "flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3",
            align === "center" && "justify-center"
          )}
        >
          {badge}
        </div>
      )}
      <h2
        id={id}
        className={cn(
          "text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight font-display text-balance leading-tight break-words",
          align === "center" && "mx-auto"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-sm sm:text-base text-muted-foreground text-pretty mt-1.5 sm:mt-2 max-w-2xl min-w-0",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
      {actions && (
        <div
          className={cn(
            "mt-3 sm:mt-4 md:mt-5 flex flex-wrap gap-2 sm:gap-3 min-w-0 max-w-full",
            align === "center" && "justify-center"
          )}
        >
          {actions}
        </div>
      )}
    </header>
  )
}
