"use client"

import { cn } from "@/lib/utils"

export interface DataGridProps {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4
}

export function DataGrid({
  children,
  className,
  columns = 3,
}: DataGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  )
}
