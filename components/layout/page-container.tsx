"use client"

import { cn } from "@/lib/utils"

export interface PageContainerProps {
  children: React.ReactNode
  /** max-w-2xl | max-w-4xl | max-w-5xl | max-w-6xl | screen-xl | none — mobile-first fluid width */
  maxWidth?: "2xl" | "4xl" | "5xl" | "6xl" | "screen-xl" | "none"
  className?: string
}

const maxWidthClasses = {
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "screen-xl": "max-w-screen-xl",
  none: "max-w-[100vw] xl:max-w-none",
}

export function PageContainer({
  children,
  maxWidth = "6xl",
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto min-w-0 box-border",
        "px-3 min-[360px]:px-4 sm:px-6 md:px-8 lg:px-10",
        "max-w-[100vw]",
        maxWidth !== "none" && maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  )
}
