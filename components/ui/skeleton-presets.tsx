"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const widthMap = {
  full: "w-full",
  "3/4": "w-3/4",
  "1/2": "w-1/2",
  "1/3": "w-1/3",
  "1/4": "w-1/4",
} as const

/** Single line of text placeholder */
export function SkeletonText({
  className,
  width = "full",
}: {
  className?: string
  width?: keyof typeof widthMap
}) {
  return <Skeleton className={cn("h-4 rounded", widthMap[width], className)} />
}

/** Multi-line paragraph placeholder */
export function SkeletonParagraph({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4 rounded", i === lines - 1 && lines > 1 ? "w-[80%]" : "w-full")}
        />
      ))}
    </div>
  )
}

/** Card-shaped skeleton with optional icon + title + lines */
export function CardSkeleton({
  hasIcon = true,
  lines = 2,
  className,
}: {
  hasIcon?: boolean
  lines?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-card)]",
        className
      )}
    >
      <div className="flex items-start gap-4">
        {hasIcon && (
          <Skeleton className="h-12 w-12 shrink-0 rounded-xl text-primary" />
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 rounded text-primary" />
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}

/** Rate/Live stat block skeleton */
export function RateCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-card)]",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-24 rounded-lg text-primary" />
        <Skeleton className="h-5 w-16 rounded text-primary" />
      </div>
      <div className="text-center mb-4">
        <Skeleton className="h-12 w-32 mx-auto rounded mb-2 text-primary" />
        <Skeleton className="h-4 w-24 mx-auto rounded text-primary" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-16 rounded-xl" />
        <Skeleton className="h-16 rounded-xl" />
      </div>
    </div>
  )
}

/** List of rows (e.g. leaderboard, table) */
export function ListSkeleton({
  rows = 5,
  className,
}: {
  rows?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4">
          <Skeleton className="h-8 w-8 rounded-lg shrink-0 text-primary" />
          <div className="flex-1 space-y-1 min-w-0">
            <Skeleton className="h-4 w-1/3 rounded text-primary" />
            <Skeleton className="h-3 w-1/4 rounded text-primary" />
          </div>
          <Skeleton className="h-6 w-20 rounded tabular-nums shrink-0 text-primary" />
        </div>
      ))}
    </div>
  )
}

/** Section header (badge + title + description) */
export function SectionHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("text-center mb-8 sm:mb-10 space-y-3", className)}>
      <div className="flex justify-center gap-2">
        <Skeleton className="h-5 w-24 rounded-full text-primary" />
        <Skeleton className="h-5 w-16 rounded-full text-primary" />
      </div>
      <Skeleton className="h-8 w-64 mx-auto rounded text-primary" />
      <Skeleton className="h-4 w-96 max-w-full mx-auto rounded text-primary" />
    </div>
  )
}
