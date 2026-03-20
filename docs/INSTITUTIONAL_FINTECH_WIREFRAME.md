# Institutional Fintech Wireframe — West African Market Intelligence

Layout structure, component hierarchy, and data-section patterns for an institutional-grade, data-focused fintech platform serving West African users. For **mobile-first** breakpoint strategy, real-time rate visibility, and touch targets, see [MOBILE_FIRST_ARCHITECTURE.md](./MOBILE_FIRST_ARCHITECTURE.md).

---

## 1. Design principles

| Principle | Application |
|-----------|-------------|
| **Institutional-grade** | Restrained color; strong typography scale; clear hierarchy; data-first layout. |
| **Clean & data-focused** | One primary idea per section; KPIs in card-based blocks; government/source attribution visible. |
| **Trust & transparency** | Live rate visibility; source badges (CBL, LISGIS, Ministry); last-updated and user counts. |
| **West African context** | Resilient to low bandwidth; large touch targets; clear labels; LRD/USD prominence. |
| **Modern fintech UX** | Minimalist layout; soft shadows; subtle motion; card-based data sections; tabular numbers. |

---

## 2. Global layout wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Skip links (sr-only, focus visible)                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  HEADER (sticky)                                                          │
│  [Logo]  [Nav: Rates | Tools | Price Index | …]  [Theme] [Find] [Sign In] │
├─────────────────────────────────────────────────────────────────────────┤
│  TRUST BAR (optional, below header)                                       │
│  ● Live  1 USD = 182.50 LRD   │  Data: CBL & market  │  Updated 2m ago  │
│  25,000+ users                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│  MAIN CONTENT (id="main-content")                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  HERO / PAGE TITLE SECTION                                          │  │
│  │  [Badge]  Headline  │  Subtext  │  [Primary CTA] [Secondary]         │  │
│  │  Optional: Live rate block (compact) or key stat                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  DATA SECTION 1 (e.g. KPIs / Market snapshot)                       │  │
│  │  Section heading (aria-labelledby)                                  │  │
│  │  [DataCard] [DataCard] [DataCard]  or  [LiveRateBlock] + sidebar    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  DATA SECTION 2 (e.g. Government / CPI)                            │  │
│  │  [GovernmentSourceBadge]  Section title                            │  │
│  │  [DataCard] [DataCard] [DataCard]  │  Source link (LISGIS/CBL)      │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  CONTENT SECTION (tools, list, CTA)                                 │  │
│  │  Cards / tables / lists with consistent spacing                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────┤
│  FOOTER (links, legal, social)                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component breakdown

### 3.1 Layout & structure

| Component | Purpose | Props / variants |
|-----------|---------|------------------|
| **PageSection** | Section wrapper; spacing, background variant, aria-labelledby | `variant`, `tight`, `ariaLabelledBy` |
| **PageContainer** | Max-width + horizontal padding; content width | `maxWidth`: 4xl \| 5xl \| 6xl \| none |
| **SectionHeader** | Section title + optional badge, description, actions | `badge`, `title`, `description`, `actions`, `align` |

### 3.2 Data & trust

| Component | Purpose | Props / variants |
|-----------|---------|------------------|
| **DataCard** | KPI / stat block: label, value, optional trend, source | `label`, `value`, `subtext`, `trend`, `icon`, `sourceBadge`, `elevation` |
| **LiveRateBlock** | Prominent real-time rate; live dot; optional compact | `rate`, `loading`, `timestamp`, `variant`: default \| compact |
| **TrustBar** (BusinessTrustBar) | Strip: live rate, data source, last updated, user count | Uses LiveRateBlock + GovernmentSourceBadge |
| **GovernmentSourceBadge** | Small pill: "LISGIS", "CBL", "Ministry of Commerce" | `source`: lisgis \| cbl \| moc \| market |

### 3.3 Cards & surfaces

| Component | Purpose | Notes |
|-----------|---------|------|
| **Card** (ui) | Base surface; soft shadow, rounded-2xl, hover elevation | Use `shadow-institutional` / design tokens |
| **DataSection** | Wrapper for a row of DataCards; grid, gap | Optional section title + source link |

### 3.4 Typography scale (institutional)

| Role | Class / token | Use |
|------|----------------|-----|
| Page title | `text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-display` | Hero, dashboard welcome |
| Section title | `text-xl sm:text-2xl font-semibold tracking-tight` | Data section headings |
| Card title | `text-base sm:text-lg font-semibold` | DataCard label, card headers |
| KPI value | `text-2xl sm:text-3xl font-bold tabular-nums` | Rates, CPI, counts |
| Body | `text-base`; caption `text-sm text-muted-foreground` | Descriptions |
| Micro / source | `text-xs text-muted-foreground` | Source line, timestamps |

### 3.5 Motion & elevation

| Token | Use |
|-------|-----|
| `--shadow-institutional` | Default card: soft, low elevation |
| `--shadow-institutional-hover` | Card hover: slightly deeper |
| `--shadow-institutional-raised` | Floating elements (modals, dropdowns) |
| Transition | `transition-all duration-200 ease-out` for hover/focus |
| Reduced motion | Respect `prefers-reduced-motion` (existing globals) |

---

## 4. Page-specific wireframes

### 4.1 Home

- **Hero**: Headline + value prop; **LiveRateBlock** (large) with source selector; CTA buttons; 3 stat pills (Sources, Accuracy, Update freq).
- **Rates by Region**: SectionHeader + RegionalBreakdownWidget + quick tool links.
- **Quick Access**: SectionHeader + grid of **Card** links (Converter, Analytics, Predictions, Business, Map, Forums, etc.).
- **Leaderboard**: SectionHeader + MarketLeaderboard (top 3).
- **Price Index & Insights**: SectionHeader + **DataCard**-style blocks for PriceIndex, InflationTracker, MarketNews; **GovernmentSourceBadge** (LISGIS, live prices).
- **Trust**: SectionHeader + trust list (TrustSignals).
- **Referral CTA** + **Final CTA**.

### 4.2 Dashboard (user)

- **Welcome strip**: Avatar, "Welcome back, {name}", member since; Sign out. (Minimal gradient.)
- **KPI row**: 4× **DataCard** (Rank, Points, Reports, Accuracy).
- **Two-column**:
  - Left (2/3): **Card** "Recent Activity" (list of activity items).
  - Right (1/3): **Card** "Quick Actions" (buttons); **Card** "Leaderboard" (top 3); DigestSubscribe.
- Optional: **LiveRateBlock** compact in sidebar for context.

### 4.3 Price Index (government data)

- **Hero**: Badge "Official CPI & LISGIS"; title "Liberia Price Index"; short description.
- **Essential goods**: SectionHeader; PriceIndexPeriodCompare; PriceIndex (table/tabs).
- **CPI & Inflation**: SectionHeader with **GovernmentSourceBadge** (LISGIS); 3× **DataCard** (Latest CPI, YoY, MoM); source link line.
- **Data sources**: Single **Card** with body copy (LISGIS, Ministry, CBL fallback).

### 4.4 Business

- **Hero**: Badge + live rate (skeleton when loading); "Business Dashboard"; CTAs.
- **TrustBar**: Full-width strip (existing BusinessTrustBar, enhanced).
- **Tools**: Tabs (Smart Tools, Book Changer, Alerts, Reports, API); each tab content in **Card**-based grid.
- **Pricing** (id="pricing"): PricingCard grid.

### 4.5 Liberia Market / Market Intelligence

- **Hero**: Title; short description.
- **Two-column**: Main = **LiberiaMarketNews**; Sidebar = **MarketSnapshot** (LiveRateBlock-style), **Card** "News Outlets", **Card** "How We Curate".
- **GovernmentSourceBadge** or source line where relevant.

---

## 5. Responsive behavior

| Breakpoint | Behavior |
|------------|----------|
| Default (mobile) | Single column; stacked DataCards; full-width TrustBar; bottom nav. |
| sm | Slightly larger type; 2-column grids where appropriate. |
| md | Dashboard: 4-column KPI row; 2-column main/sidebar. |
| lg | Price Index: 3-column CPI cards; Business: 2-column tool cards. |
| xl | Max-width container; comfortable reading width. |

---

## 6. Accessibility checklist

- Skip links to main and pricing.
- `main` id="main-content"; sections with `aria-labelledby` where heading exists.
- Live rate and loading states: `aria-live="polite"`, `aria-busy` where appropriate.
- Government/source badges: short, readable; link to official source when applicable.
- Focus visible on all interactive elements; touch targets ≥ 44px for primary actions.
- Tabular numbers for all rates and KPIs.

---

## 7. File mapping (implementation)

| Concept | File(s) |
|---------|--------|
| PageSection, PageContainer, SectionHeader | `components/layout/page-section.tsx`, `page-container.tsx`, `section-header.tsx` |
| DataCard | `components/ui/data-card.tsx` (new) |
| LiveRateBlock | `components/live-rate-block.tsx` (new) |
| GovernmentSourceBadge | `components/government-source-badge.tsx` (new) |
| TrustBar | `components/business-trust-bar.tsx` (enhance) |
| Design tokens (shadows, motion) | `app/globals.css` |
| Dashboard layout | `app/dashboard/page.tsx` |
| Price Index government section | `app/price-index/page.tsx` |
| Market snapshot / rate card | `components/market-snapshot.tsx` |

This wireframe and component breakdown define the institutional fintech structure; implement components and pages to match for a clean, data-focused, West African–oriented experience.
