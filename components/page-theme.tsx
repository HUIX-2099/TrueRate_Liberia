"use client"

import { type ReactNode, useEffect, useRef } from "react"
import { useTheme } from "next-themes"

/**
 * Per-page theme override. When a page wraps its content in
 * <PageTheme theme="dark">...</PageTheme>, the app uses that theme for the
 * duration of the page; when the user navigates away, the previous theme
 * (user choice or system) is restored.
 *
 * Use for pages that should always be light (e.g. forms) or always dark
 * (e.g. dashboards). Omit or use theme="system" for no override.
 */
export function PageTheme({
  theme,
  children,
}: {
  theme?: "light" | "dark" | "system"
  children: ReactNode
}) {
  const { theme: globalTheme, setTheme } = useTheme()
  const previousRef = useRef<string | null>(null)

  useEffect(() => {
    if (theme !== "light" && theme !== "dark") return

    if (previousRef.current === null) {
      previousRef.current = globalTheme ?? "system"
    }
    setTheme(theme)

    return () => {
      if (previousRef.current != null) {
        setTheme(previousRef.current)
        previousRef.current = null
      }
    }
  }, [theme, setTheme, globalTheme])

  return <>{children}</>
}
