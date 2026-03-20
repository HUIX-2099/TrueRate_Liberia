"use client"

import { cn } from "@/lib/utils"

export interface SectionContainerProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  id?: string
  action?: React.ReactNode
}

export function SectionContainer({
  title,
  description,
  children,
  className,
  id,
  action,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-[var(--radius-card)] border border-border/30 bg-card shadow-[var(--shadow-ecommerce)] scroll-mt-28 transition-all duration-200 hover:shadow-[var(--shadow-ecommerce-hover)]",
        className
      )}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-4 border-b border-border/20 bg-muted/5">
        <div>
          <h2
            id={id ? `${id}-heading` : undefined}
            className="text-base sm:text-lg font-semibold text-foreground tracking-tight"
          >
            {title}
          </h2>
          {description != null && description !== "" && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {action != null && <div className="shrink-0 flex items-center gap-2 flex-wrap">{action}</div>}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  )
}
