import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/** SSR-safe: returns false on server and first client paint, then real value after mount to avoid hydration mismatch. */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setIsMobile(false)
      return
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener("change", onChange)
    onChange()

    return () => {
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return !!isMobile
}
