# Mobile-First Architecture — Exchange Rate Platform

This fintech platform is built **mobile-first**: default styles target small screens (portrait phones); larger breakpoints enhance layout and density for tablets and desktop.

---

## 1. Principles

| Principle | Application |
|-----------|-------------|
| **Base = mobile** | All layout, typography, and spacing defaults are tuned for ~320px–430px viewports. Use `sm:`, `md:`, `lg:` to add or override for larger screens. |
| **Real-time rate first** | On the home page, the live rate card is the first visible content on mobile (order-first). A sticky mini rate bar keeps the rate visible while scrolling (mobile only). |
| **Clean data** | Cards and tables stack in a single column on mobile; no horizontal scroll for primary content. Data surfaces use clear labels, tabular numbers, and source attribution. |
| **Institutional trust** | Source badges (CBL, LISGIS, Market), “Updated X ago”, and user counts are visible on mobile without clutter. |
| **Touch-first** | Primary actions use at least 44×44px tap targets. Buttons and links have adequate spacing to avoid mis-taps. |

---

## 2. Breakpoint strategy (Tailwind)

- **Base (default)**: &lt; 640px — single column, compact padding, full-width CTAs.
- **sm (640px+)**: Slightly larger type and spacing; some 2-column grids.
- **md (768px+)**: Two-column layouts where appropriate; bottom nav hidden, desktop nav visible.
- **lg (1024px+)**: Multi-column content; hero side-by-side (rate + copy).
- **xl (1280px+)**: Max-width container; comfortable reading width.

Always write mobile styles first, then layer `sm:`, `md:`, `lg:` — never rely on `max-width` media to “fix” mobile after a desktop-first layout.

---

## 3. Key layout components (mobile-first)

| Component | Mobile (base) | sm / md / lg |
|-----------|----------------|--------------|
| **PageContainer** | `px-4`, full width, `min-w-0` | `sm:px-6`, `lg:px-8`; max-width at xl |
| **PageSection** | `py-8` (or tight `py-6`) | `sm:py-12`, `md:py-16`, `lg:py-20` |
| **Hero** | Rate card first (order-first), compact padding | lg: two columns, rate right |
| **TrustBar** | Single-column feel; rate → source → updated → users | sm: inline row, wrap |
| **StickyMobileRateBar** | Visible when hero scrolls out of view | `md:hidden` |

---

## 4. Real-time rate visibility

- **Hero**: Live rate card is the first block on mobile so it appears above the fold.
- **Sticky bar**: On viewports &lt; md, a slim sticky bar shows “1 USD = X.XX LRD” and “Live” when the user scrolls past the hero. Uses `useLiveRate` and IntersectionObserver (or scroll position) to toggle visibility.
- **Trust bar**: Compact live rate + source badges + “Updated X ago” + “25,000+ users” in a mobile-friendly strip.
- **aria-live**: Rate values use `aria-live="polite"` and `aria-busy` when loading so screen readers get updates.

---

## 5. Data presentation

- **Cards**: Stack vertically on mobile (`grid-cols-1`); `sm:grid-cols-2` or `lg:grid-cols-3` for grids.
- **Tables**: Wrapped in `overflow-x-auto` with `min-w-0` on parent; prefer card-based summaries on mobile when possible.
- **Numbers**: Use `tabular-nums` for rates and KPIs so digits align and don’t shift layout when values update.
- **Source**: Every data block that shows official data (CPI, CBL rate) includes a government/source badge and optional “Updated” line.

---

## 6. Touch and accessibility

- **Minimum tap target**: 44×44px for primary buttons and key links (e.g. `min-h-[44px] min-w-[44px]` or equivalent).
- **Spacing**: Adequate gap between tappable elements to reduce mis-taps.
- **Focus**: Visible focus ring on all interactive elements; skip links for main content and pricing.
- **Safe area**: `padding-bottom: env(safe-area-inset-bottom)` on main and bottom nav so content clears notches and home indicators.

---

## 7. File reference

| Concern | File(s) |
|---------|--------|
| Sticky mobile rate bar | `components/sticky-mobile-rate-bar.tsx` |
| Hero (rate-first order, compact mobile) | `components/hero.tsx` |
| Trust bar (mobile stack) | `components/business-trust-bar.tsx` |
| Section/container spacing | `components/layout/page-section.tsx`, `page-container.tsx` |
| Global mobile tweaks | `app/globals.css` |
| Root layout (safe area, bottom padding) | `app/layout.tsx` |

This architecture keeps the exchange-rate platform fast and trustworthy on the devices most used in West Africa, while scaling up cleanly to larger screens.
