# Fintech Design System — Stripe/Revolut-Level Polish

Design tokens, component patterns, and Tailwind-ready styling for trust, clarity, and WCAG-aligned accessibility.

---

## 1. Design tokens (globals.css)

| Token | Value | Use |
|-------|--------|-----|
| `--space-section` | 4rem (64px) | Vertical padding between major sections |
| `--space-block` | 1.5rem (24px) | Between content blocks |
| `--space-inline` | 1rem (16px) | Horizontal rhythm |
| `--text-hero` | clamp(1.875rem, 5vw+1rem, 3rem) | Hero headline |
| `--text-display` | clamp(1.5rem, 3vw+0.5rem, 1.875rem) | Section titles |
| `--text-body` | 1rem | Body copy |
| `--text-caption` | 0.875rem | Captions, secondary |
| `--text-micro` | 0.75rem | Labels, fine print |
| `--shadow-card` | 0 1px 3px … | Default card elevation |
| `--shadow-card-hover` | 0 4px 6px … | Card hover / emphasis |

Use in Tailwind via arbitrary properties, e.g. `shadow-[var(--shadow-card)]`, `py-[var(--space-section)]`, or map in `@theme` if desired.

---

## 2. Spacing scale (Tailwind)

Stripe-style 8px base. Prefer these for consistency:

| Class | px | Use |
|-------|----|-----|
| `p-4`, `gap-4`, `mb-4` | 16 | In-card padding, tight gaps |
| `p-6`, `gap-6`, `mb-6` | 24 | Card padding, block spacing |
| `p-8`, `gap-8`, `mb-8` | 32 | Section inner |
| `py-10`, `mb-10` | 40 | Medium section spacing |
| `py-12`, `gap-12`, `mb-12` | 48 | Default section padding (sm) |
| `py-16`, `mt-16` | 64 | Large section separation |
| `py-20`, `mt-20` | 80 | Hero / pricing section |

---

## 3. Typography (Tailwind)

- **Hero:** `text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-display leading-[1.15]`
- **Section title:** `text-2xl sm:text-3xl font-bold tracking-tight font-display`
- **Card title:** `text-lg sm:text-xl font-semibold`
- **Body:** `text-base`; **Caption:** `text-sm`; **Micro:** `text-xs`
- **Numbers (rates, prices):** `tabular-nums` for alignment
- **Balance:** `text-balance` on headings; `text-pretty` on short paragraphs

---

## 4. Color consistency

- **Primary:** CTAs, key actions, “Most Popular” accent. Use `bg-primary`, `text-primary`, `border-primary/25`.
- **Secondary:** Success, checkmarks, trust accents. Use `text-secondary`, `bg-secondary/10`.
- **Muted:** Secondary text, borders. Use `text-muted-foreground`, `bg-muted/40`, `border-border/60`.
- **Surfaces:** `bg-card` for cards; `bg-background` for page; subtle gradients `from-primary/[0.05]` for hero only.
- **Contrast:** Ensure 4.5:1 for body text (muted-foreground on background). Primary on primary-foreground meets WCAG AA.

---

## 5. Accessibility (WCAG)

- **Focus:** `:focus-visible` only; 2px solid ring + 2px offset. Buttons use `focus-visible:ring-[3px]`. Skip links: “Skip to main content”, “Skip to pricing” (sr-only, visible on focus).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` in globals.css shortens animations/transitions. Live indicator uses `.live-dot-ping` so ping is disabled when preferred.
- **Landmarks:** `<main id="main-content">`, `<section aria-labelledby="...">`, `<header>` inside sections, `<aside aria-label="Customer testimonial">`.
- **Live regions:** Hero rate and trust bar rate use `aria-live="polite"` and `aria-busy` where loading.
- **Touch targets:** Minimum 44px (e.g. `min-h-[44px]`, `min-h-[48px]` for primary CTAs).

---

## 6. Component suggestions

### PageSection

Wrap major sections for consistent spacing and semantics:

```tsx
<section id="tools" className="py-12 sm:py-16 md:py-20" aria-labelledby="tools-heading">
  <header className="text-center mb-8 sm:mb-10">
    <h2 id="tools-heading" className="text-2xl sm:text-3xl font-bold ...">...</h2>
    <p className="text-muted-foreground text-sm sm:text-base ...">...</p>
  </header>
  {/* content */}
</section>
```

### TrustBar (existing: BusinessTrustBar)

- Live rate with `aria-live="polite"`.
- Data source line (e.g. “Data: CBL & market sources”).
- Last updated and “25,000+ users”.
- Use `.live-dot-ping` wrapper for the pulse so reduced-motion can disable it.

### PricingCard

- Default: `rounded-2xl border border-border/60 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]`.
- Featured: `border-2 border-primary/25`, “Most Popular” badge, same shadow hover.
- Use `<ul role="list">` and `<li>` for feature lists; one primary CTA per card.

### Stat / LiveRate block

- Small card or inline block: rate in `text-xl sm:text-2xl font-bold tabular-nums`, “Live” badge, optional `aria-live="polite"`.

### Testimonial block

- Use `<aside aria-label="Customer testimonial">`, `<blockquote>`, and a single CTA button below.

---

## 7. Layout structure

- **Container:** `container mx-auto px-4 sm:px-6 max-w-6xl` (or `max-w-4xl` for pricing grid).
- **Sections:** One primary idea per section; header (title + short description) then content.
- **Grids:** `grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8` for pricing; `lg:grid-cols-2` for tool pairs.
- **Fintech utilities (optional):** `.fintech-section`, `.fintech-section-tight`, `.fintech-container` in globals for reuse.

---

## 8. Performance

- Avoid layout thrash: use `min-h-[48px]` or fixed heights for buttons/tabs instead of content-dependent height jumps.
- Trust bar: single fetch with 60s refetch; no unnecessary re-renders.
- Hero gradient and orbs are CSS-only; no extra JS for animation.

---

## 9. Tailwind-ready checklist

- [ ] Use `shadow-[var(--shadow-card)]` and `shadow-[var(--shadow-card-hover)]` for cards.
- [ ] Use `rounded-xl` or `rounded-2xl` consistently; `rounded-lg` for inputs/tabs.
- [ ] Primary CTA: `min-h-[48px]`, `font-semibold`, solid background.
- [ ] Section padding: `py-12 sm:py-16 md:py-20`.
- [ ] Tabs: `min-h-[48px]`, scrollable on mobile with `[scrollbar-width:none]`.
- [ ] All interactive elements: visible focus ring (`focus-visible:ring-[3px]` or default outline).

Brand identity (primary/secondary palette, font-display) is preserved; elevation and spacing are elevated to fintech standards.
