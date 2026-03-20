"use client"

const skipLinkClass =
  "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:inline-block focus:rounded-lg focus:bg-primary focus:px-4 focus:py-3 focus:min-h-[44px] focus:min-w-[44px] focus:text-sm focus:font-semibold focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"

/**
 * Skip links for WCAG 2.2: visible on focus only.
 * Place once at the top of the document (e.g. in root layout or first page wrapper).
 */
export function SkipLinks() {
  return (
    <>
      <a href="#main-content" className={skipLinkClass}>
        Skip to main content
      </a>
      <a href="#pricing" className={skipLinkClass + " focus:top-16 focus:min-h-[44px]"}>
        Skip to pricing
      </a>
    </>
  )
}
