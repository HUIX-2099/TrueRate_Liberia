import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      setIsMobile(false)
      return
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = (event?: MediaQueryListEvent) => {
      setIsMobile(event?.matches ?? window.innerWidth < MOBILE_BREAKPOINT)
    }

    if ("addEventListener" in mql) {
      mql.addEventListener("change", onChange)
    } else {
      mql.addListener(onChange)
    }

    onChange(mql as MediaQueryListEvent)

    return () => {
      if ("removeEventListener" in mql) {
        mql.removeEventListener("change", onChange)
      } else {
        mql.removeListener(onChange)
      }
    }
  }, [])

  return !!isMobile
}
