# Business Page Audit & Redesign

Audit and implementation notes for the Business Dashboard page: clarity, trust, conversion, and design system alignment.

---

## 1. Cognitive load

**Before:** Hero had multiple badges (30-day forecasts, Changer booking, API access), long subcopy, and no single primary action. Tools section title “Everything Your Business Needs” was vague; five tabs competed for attention.

**Changes:**
- **Single value prop:** One clear headline + one short sentence (“Professional tools for importers and exporters — maximize profits and minimize forex risk”).
- **Two CTAs only:** Primary “Upgrade to Business — $5/mo” and secondary “Browse tools”; removed extra badge row from hero, replaced with three short trust bullets (Transparent data, 30-day forecasts, API access).
- **Section rename:** “Everything Your Business Needs” → “Tools & Reports” with one-line description.
- **Trust strip:** New `BusinessTrustBar` below hero consolidates live rate, data source, last updated, and “25,000+ business users” so trust lives in one place.

---

## 2. Visual hierarchy

**Spacing scale (Tailwind):**
- Section vertical: `py-10 sm:py-12 md:py-16` (40px → 48px → 64px).
- Section inner: `mb-8 sm:mb-10` for section headers; `gap-6 sm:gap-8` for grids; `space-y-6 sm:space-y-8` for stacks.
- Consistent use of `4, 6, 8, 10, 12, 16` (16px–64px) for rhythm.

**Font scale:**
- Hero title: `text-3xl sm:text-4xl md:text-5xl` (30px → 36px → 48px), `font-display`, `tracking-tight`.
- Section titles: `text-2xl sm:text-3xl`, same gradient treatment.
- Card titles: `text-lg sm:text-xl`.
- Body: `text-base`; captions/secondary: `text-sm`.
- Numbers: `tabular-nums` on rates and prices.

**Hierarchy:**
- One H1 (hero); H2 for “Tools & Reports” and “Choose Your Plan”.
- Primary CTA uses `size="lg"`, `font-semibold`, solid background; secondary CTA is outline.
- Pricing: Business card uses `border-2 border-primary/30` and “Most Popular” badge; Free stays subtle.

---

## 3. CTA placement and strength

- **Above fold:** Primary “Upgrade to Business — $5/mo” and “Browse tools” in hero; both `min-h-[44px]` for touch.
- **Pricing section:** `id="pricing"` + `scroll-mt-24` for smooth scroll from hero CTA. Business plan CTA is “Upgrade to Business” linking to `/auth/signup?plan=business`.
- **Testimonial block:** Added explicit CTA button: “Upgrade to Business — $5/mo” with arrow (conversion moment after social proof).

---

## 4. Mobile responsiveness

- **Containers:** `container mx-auto px-4 sm:px-6 max-w-6xl`; no horizontal overflow.
- **Hero CTAs:** Stack on small screens (`flex-col`), row on `sm:` (`flex-row`); full-width buttons on mobile (`w-full sm:w-auto`).
- **Tabs:** Horizontal scroll with `[scrollbar-width:none]`, `-webkit-overflow-scrolling:touch`, `min-h-[44px]` for tap targets.
- **Touch targets:** Buttons and key controls use `min-h-[44px]` or `min-h-[48px]` where appropriate.
- **Trust bar:** Wraps with `flex-wrap`, centers on small screens, remains readable when stacked.

---

## 5. Financial trust signals

- **Live rate + real-time indicator:** `BusinessTrustBar` shows “Live rate” with pulse dot and “1 USD = X.XX LRD” from API; “Updated Xm ago” from `timestamp`.
- **Data transparency:** “Data: CBL & market sources” with shield icon; pricing section line “Transparent data · CBL & market sources”.
- **Credibility:** “25,000+ business users” in trust bar; testimonial repeats “25,000+ business users” and ties to upgrade CTA.
- **Consistency:** Primary/secondary colors and `ShieldCheck` used for trust-related copy; no new palette, just clear placement.

---

## 6. Component structure

- **New:** `components/business-trust-bar.tsx` — fetches `/api/rates/live`, shows live rate, “Live” pulse, data source, last updated, and “25,000+ business users”. Renders below hero.
- **Page sections (order):**
  1. Hero (value prop + 2 CTAs + 3 trust bullets).
  2. `BusinessTrustBar`.
  3. Tools & Reports (tabs: Smart Tools, Book Changer, Alerts, Reports, API Access).
  4. Pricing (Free + Business; data-transparency line).
  5. Testimonial + CTA.

---

## 7. Color system (no variable changes)

- **Primary:** Main CTAs, “Most Popular” badge (Business card), key icons.
- **Secondary:** Checkmarks, trust accents, “Live” pulse.
- **Muted:** Secondary text, borders; `muted/30` for subtle backgrounds (trust bar, card alt rows).
- **Gradients:** Hero and section titles keep existing `from-primary via-secondary to-primary`; Business card uses `from-primary/[0.04]` instead of secondary for consistency with primary CTA.

Pricing “Most Popular” card was aligned to primary (border and badge) so the main conversion action and highlight use one system color.

---

## 8. Exact spacing reference (Tailwind → px)

| Token | px  | Usage example           |
|-------|-----|-------------------------|
| 4     | 16  | gap-4, p-4, mb-4        |
| 6     | 24  | gap-6, mb-6, py-6       |
| 8     | 32  | gap-8, mb-8, p-8        |
| 10    | 40  | py-10, mb-10            |
| 12    | 48  | py-12, mb-12, gap-12    |
| 16    | 64  | mt-16, py-16            |
| 20    | 80  | mt-20                   |

---

## 9. Font scale reference

| Class           | Approx  | Use              |
|-----------------|---------|------------------|
| text-xs         | 12px    | Labels, badges   |
| text-sm         | 14px    | Captions, lists  |
| text-base       | 16px    | Body             |
| text-lg         | 18px    | Card titles      |
| text-xl         | 20px    | Card titles (sm+)|
| text-2xl         | 24px    | Section titles   |
| text-3xl         | 30px    | Hero (mobile)    |
| text-4xl         | 36px    | Hero (sm)        |
| text-5xl         | 48px    | Hero (md+)       |

---

## 10. Optional follow-ups

- Add `RateSourceAttribution` (compact) next to live rate in `BusinessTrustBar` if you want tooltip with source list.
- A/B test hero CTA copy: “Start free” vs “Upgrade to Business — $5/mo” for logged-out vs logged-in.
- Consider a sticky “Upgrade” bar on scroll (e.g. after hero) for long sessions.
- If signup doesn’t support `?plan=business`, wire the pricing and testimonial CTAs to the correct signup or checkout flow.
