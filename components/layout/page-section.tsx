"use client"

import { cn } from "@/lib/utils"

export interface PageSectionProps {
  id?: string
  /** ID of the heading element for aria-labelledby */
  ariaLabelledBy?: string
  /** Optional aria-label if no visible heading */
  "aria-label"?: string
  children: React.ReactNode
  /** Background: default, muted, gradient-hero, gradient-cta */
  variant?: "default" | "muted" | "gradient-hero" | "gradient-cta"
  /** Tighter vertical padding for compact sections */
  tight?: boolean
  className?: string
}

const variantClasses = {
  default: "bg-background",
  muted: "bg-muted/30",
  "gradient-hero":
    "bg-background",
  "gradient-cta":
    "bg-muted/10 text-foreground",
}

export function PageSection({
  id,
  ariaLabelledBy,
  "aria-label": ariaLabel,
  children,
  variant = "default",
  tight = false,
  className,
}: PageSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className={cn(
        "min-w-0 w-full",
        tight ? "py-5 sm:py-6 md:py-8 lg:py-10" : "py-6 sm:py-8 md:py-10 lg:py-12 xl:py-16 2xl:py-20",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </section>
  )
}
