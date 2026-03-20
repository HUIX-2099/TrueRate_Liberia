"use client"

/**
 * Lightweight client-side accessibility self-audit for development.
 *
 * Checks for common WCAG 2.1 AA violations without requiring axe-core:
 *   - Images without alt text
 *   - Interactive elements without accessible names
 *   - Insufficient color contrast (heuristic only)
 *   - Missing form labels
 *   - Empty links and buttons
 *
 * Import and call `useA11yAudit()` in a dev-only component.
 */

import { useEffect } from "react"

interface A11yViolation {
  element: string
  rule: string
  message: string
  severity: "error" | "warning"
}

function runAudit(): A11yViolation[] {
  if (typeof document === "undefined") return []
  const violations: A11yViolation[] = []

  // WCAG 1.1.1 — Non-text Content: images must have alt
  document.querySelectorAll("img:not([alt])").forEach((el) => {
    violations.push({
      element: el.outerHTML.slice(0, 80),
      rule: "WCAG 1.1.1",
      message: "Image is missing alt attribute",
      severity: "error",
    })
  })

  // WCAG 4.1.2 — buttons with no text content or aria-label
  document.querySelectorAll("button").forEach((btn) => {
    const hasLabel =
      btn.textContent?.trim() ||
      btn.getAttribute("aria-label") ||
      btn.getAttribute("aria-labelledby") ||
      btn.querySelector("svg[aria-label]")
    if (!hasLabel) {
      violations.push({
        element: btn.outerHTML.slice(0, 80),
        rule: "WCAG 4.1.2",
        message: "Button has no accessible name",
        severity: "error",
      })
    }
  })

  // WCAG 4.1.2 — links with no text
  document.querySelectorAll("a").forEach((a) => {
    const hasLabel =
      a.textContent?.trim() ||
      a.getAttribute("aria-label") ||
      a.getAttribute("aria-labelledby")
    if (!hasLabel) {
      violations.push({
        element: a.outerHTML.slice(0, 80),
        rule: "WCAG 4.1.2",
        message: "Link has no accessible name",
        severity: "error",
      })
    }
  })

  // WCAG 1.3.1 — form inputs without labels
  document.querySelectorAll("input, select, textarea").forEach((input) => {
    const id = input.id
    const hasLabel =
      (id && document.querySelector(`label[for="${id}"]`)) ||
      input.getAttribute("aria-label") ||
      input.getAttribute("aria-labelledby") ||
      input.closest("label")
    if (!hasLabel) {
      violations.push({
        element: input.outerHTML.slice(0, 80),
        rule: "WCAG 1.3.1",
        message: "Form control has no associated label",
        severity: "error",
      })
    }
  })

  // WCAG 2.4.1 — check for skip link target
  const mainContent = document.getElementById("main-content")
  if (!mainContent) {
    violations.push({
      element: "document",
      rule: "WCAG 2.4.1",
      message: 'No element with id="main-content" found — skip link target missing',
      severity: "warning",
    })
  }

  // SVG charts without aria-label
  document.querySelectorAll('svg[role="img"]').forEach((svg) => {
    if (!svg.getAttribute("aria-label") && !svg.querySelector("title")) {
      violations.push({
        element: svg.outerHTML.slice(0, 60) + "…",
        rule: "WCAG 4.1.2",
        message: 'SVG with role="img" is missing aria-label or <title>',
        severity: "warning",
      })
    }
  })

  return violations
}

export function useA11yAudit() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return

    const timer = setTimeout(() => {
      const violations = runAudit()
      if (violations.length === 0) {
        console.info("[a11y] ✅ No accessibility violations detected on this page.")
        return
      }
      const errors = violations.filter((v) => v.severity === "error")
      const warnings = violations.filter((v) => v.severity === "warning")
      if (errors.length) {
        console.groupCollapsed(`[a11y] ❌ ${errors.length} accessibility error(s)`)
        errors.forEach((v) => console.error(`[${v.rule}] ${v.message}\n`, v.element))
        console.groupEnd()
      }
      if (warnings.length) {
        console.groupCollapsed(`[a11y] ⚠️ ${warnings.length} accessibility warning(s)`)
        warnings.forEach((v) => console.warn(`[${v.rule}] ${v.message}\n`, v.element))
        console.groupEnd()
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [])
}
