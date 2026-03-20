"use client"

import { cn } from "@/lib/utils"

export type GovernmentSource = "lisgis" | "cbl" | "moc" | "market"

const SOURCES: Record<
  GovernmentSource,
  { label: string; title: string; className: string }
> = {
  lisgis: {
    label: "LISGIS",
    title: "Liberia Institute of Statistics and Geo-Information Services",
    className: "border-primary/30 bg-primary/5 text-primary",
  },
  cbl: {
    label: "CBL",
    title: "Central Bank of Liberia",
    className: "border-secondary/30 bg-secondary/5 text-secondary",
  },
  moc: {
    label: "Ministry of Commerce",
    title: "Ministry of Commerce and Industry",
    className: "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400",
  },
  market: {
    label: "Market",
    title: "Market & street sources",
    className: "border-muted-foreground/30 bg-muted/30 text-muted-foreground",
  },
}

export interface GovernmentSourceBadgeProps {
  source: GovernmentSource
  className?: string
  /** Optional link to official source */
  href?: string
}

export function GovernmentSourceBadge({
  source,
  className,
  href,
}: GovernmentSourceBadgeProps) {
  const config = SOURCES[source]
  const content = (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium tabular-nums",
        config.className,
        className
      )}
      title={config.title}
    >
      {config.label}
    </span>
  )
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
      >
        {content}
      </a>
    )
  }
  return content
}
