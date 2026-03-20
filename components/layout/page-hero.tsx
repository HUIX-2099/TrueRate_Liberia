"use client"

import type React from "react"
import { cn } from "@/lib/utils"

const HERO_BASE =
  "relative overflow-x-hidden min-h-[min(36vh,280px)] sm:min-h-[38vh] bg-background border-b border-border/30"

const PILL_LIVE = (
  <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
  </span>
)

export interface PageHeroStat {
  value: string
  caption: string
  icon: React.ReactNode
  iconClassName?: string
}

export interface PageHeroProps {
  /** Accessible label for the section */
  ariaLabel: string
  /** Uppercase label with left border (e.g. "Your Daily Money Toolkit") */
  label: string
  /** Main headline */
  title: React.ReactNode
  /** Description - in bordered box for left variant, plain for centered */
  description: React.ReactNode
  /** "centered" = single column center; "left" = left-aligned, optional right column */
  variant?: "centered" | "left"
  /** Optional pill above headline: { text, live?: true for pulsing dot } */
  pill?: { text: string; live?: boolean }
  /** Optional badges (centered layout), e.g. multiple Badge components */
  badges?: React.ReactNode
  /** Optional stats - inline on mobile, cards on md+ (left variant) */
  stats?: PageHeroStat[]
  /** Optional CTAs or right-column content */
  children?: React.ReactNode
  /** Optional footer line below description (e.g. "Last updated: Jan 15, 2026") */
  footer?: React.ReactNode
  /** Extra class for the section */
  className?: string
  /** Max width for content when centered (default max-w-3xl) */
  contentMaxWidth?: "max-w-2xl" | "max-w-3xl" | "max-w-4xl"
}

export function PageHero({
  ariaLabel,
  label,
  title,
  description,
  variant = "centered",
  pill,
  badges,
  stats,
  children,
  footer,
  className,
  contentMaxWidth = "max-w-3xl",
}: PageHeroProps) {
  const titleNode =
    typeof title === "string" ? (
      <span className="inline-block pb-1.5 text-foreground">
        {title}
      </span>
    ) : (
      title
    )

  if (variant === "centered") {
    return (
      <section
        aria-label={ariaLabel}
        className={cn(HERO_BASE, className)}
      >
        <div className="container relative z-10 mx-auto min-w-0 max-w-[100vw] xl:max-w-none overflow-x-hidden px-4 sm:px-6 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className={cn("mx-auto text-center", contentMaxWidth)}>
            {pill && (
              <div className="inline-flex items-center gap-2.5 rounded-full bg-muted/20 border border-border/50 px-3.5 py-2 text-sm w-fit mb-5 sm:mb-6">
                {pill.live && PILL_LIVE}
                <span className="text-foreground font-semibold">{pill.text}</span>
              </div>
            )}
            {badges && (
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                {badges}
              </div>
            )}
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground text-center inline-block mx-auto mb-3">
              {label}
            </p>
            <h1 className="font-display text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance leading-[1.1] mb-4">
              {titleNode}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground text-pretty leading-relaxed mb-6 px-4 py-3.5 sm:px-5 sm:py-4 md:px-0 md:py-0">
              {description}
            </p>
            {footer && <div className="text-sm text-muted-foreground">{footer}</div>}
            {children}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-label={ariaLabel} className={cn(HERO_BASE, className)}>
      <div className="container relative z-10 mx-auto min-w-0 max-w-[100vw] xl:max-w-none overflow-x-hidden px-4 sm:px-6 max-w-6xl py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="flex flex-col gap-5 sm:gap-6 min-w-0 text-left">
            {pill && (
              <div className="inline-flex items-center gap-2.5 rounded-full bg-muted/20 border border-border/50 px-3.5 py-2 text-sm w-fit">
                {pill.live && PILL_LIVE}
                <span className="text-foreground font-semibold">{pill.text}</span>
              </div>
            )}
            <div className="space-y-4 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {label}
              </p>
              <h1 className="font-display text-2xl min-[360px]:text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-balance leading-[1.1]">
                {titleNode}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground text-pretty max-w-xl leading-[1.6] px-4 py-3.5 sm:px-5 sm:py-4 md:hidden">
                {description}
              </p>
              <p className="hidden md:block text-base sm:text-lg text-muted-foreground text-pretty max-w-xl leading-[1.6]">
                {description}
              </p>
            </div>
            {stats && stats.length > 0 && (
              <>
                <div className="flex flex-wrap items-stretch gap-2 md:hidden pt-2 rounded-2xl border border-border/45 bg-muted/10 p-3.5">
                  {stats.map((s, i) => (
                    <div
                      key={i}
                      className="flex flex-1 min-w-[6rem] flex-col items-center justify-center gap-0.5 rounded-xl bg-background/50 dark:bg-background/20 py-2 px-2 border border-border/30"
                    >
                      <div className="flex items-center justify-center mb-0.5">{s.icon}</div>
                      <span className="text-sm font-bold text-foreground tabular-nums">{s.value}</span>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{s.caption}</span>
                    </div>
                  ))}
                </div>
                <div className="hidden md:grid grid-cols-3 gap-3 pt-1">
                  {stats.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border/60 bg-card px-3 py-3 text-center transition-colors hover:border-border/80 min-w-0"
                    >
                      <div className="flex justify-center mb-1.5">
                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg bg-muted/40 border border-border/40 text-foreground",
                            s.iconClassName
                          )}
                        >
                          {s.icon}
                        </span>
                      </div>
                      <span className="block text-xl font-bold text-foreground leading-none">{s.value}</span>
                      <span className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                        {s.caption}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {footer && !children && <div className="text-sm text-muted-foreground pt-1">{footer}</div>}
          </div>
          {children && (
            <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto min-w-0 order-first lg:order-none">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
