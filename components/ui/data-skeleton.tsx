"use client"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

/** KPI card skeleton for 3-column dashboard rows */
export function KpiCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/40 bg-card p-6 space-y-4", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl shrink-0 text-primary" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-24 text-primary" />
          <Skeleton className="h-3 w-16 text-primary" />
        </div>
      </div>
      <Skeleton className="h-8 w-32 text-primary" />
      <Skeleton className="h-16 w-full rounded-xl" />
    </div>
  )
}

/** Chart card skeleton */
export function ChartSkeleton({ height = 280, className }: { height?: number; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/40 bg-card p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 text-primary" />
          <Skeleton className="h-3 w-60 text-primary" />
        </div>
        <Skeleton className="h-8 w-24 rounded-xl text-primary" />
      </div>
      <Skeleton className={`w-full rounded-xl`} style={{ height }} />
    </div>
  )
}

/** Table row skeleton */
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-border/30">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-3">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}

/** Article / news card skeleton */
export function NewsCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/40 bg-card p-5 space-y-3", className)}>
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-xl shrink-0 text-primary" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 text-primary" />
          <Skeleton className="h-4 w-1/2 text-primary" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5 text-primary" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-16 rounded-full text-primary" />
        <Skeleton className="h-5 w-12 rounded-full text-primary" />
      </div>
    </div>
  )
}

/** Product card skeleton for marketplace */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[2rem] border border-border/30 bg-card overflow-hidden", className)}>
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-5 w-3/4 text-primary" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full text-primary" />
          <Skeleton className="h-5 w-24 rounded-full text-primary" />
        </div>
        <Skeleton className="h-8 w-28 text-primary" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  )
}

/** Thread list skeleton for forums */
export function ForumThreadSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[2rem] border border-border/40 bg-card p-6 sm:p-8", className)}>
      <div className="flex gap-4 md:gap-8">
        <Skeleton className="h-14 w-14 rounded-2xl shrink-0 text-primary" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full text-primary" />
            <Skeleton className="h-5 w-16 rounded-full text-primary" />
          </div>
          <Skeleton className="h-6 w-3/4 text-primary" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 text-primary" />
        </div>
      </div>
    </div>
  )
}
