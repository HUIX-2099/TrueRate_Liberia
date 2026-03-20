# Liberia NIC Investment Website — Modern Redesign Proposal

**Client:** Liberia National Investment Commission (NIC) — nic.gov.lr  
**Scope:** “Why Invest in Liberia” / homepage / investment opportunities landing  
**Audience:** Foreign and domestic investors (FDI, sectors: agriculture, mining, energy, tourism, fintech, infrastructure, renewables)  
**Design approach:** Fintech-inspired, sovereign investment promotion — trustworthy, conversion-focused, mobile-first, low-bandwidth friendly.

---

## 1. Overall Design System

### Color palette (primary, secondary, accents — and why each fits Liberia/fintech/trust)

| Role | Hex (example) | Usage | Rationale |
|------|----------------|--------|-----------|
| **Primary** | `#0F766E` (Teal) or `#0D9488` | CTAs, key headings, links, “Invest” badges | Evokes growth, stability, and ocean/port; distinct from generic “gov blue”; reads as modern fintech (Revolut/Wise use teal/green). Aligns with Liberia’s natural-resource and maritime identity. |
| **Primary dark** | `#0D5C55` | Hover states, darker accents | Ensures 4.5:1 contrast on white; reinforces trust. |
| **Secondary** | `#1E40AF` (Deep blue) | Trust blocks, government seals, “Official” labels, secondary CTAs | Blue = trust, institutions, water; nods to national flag blue; used sparingly so primary stays dominant. |
| **Accent — growth** | `#15803D` (Liberia green) | Success stats, “Growth”, “Reforms”, positive KPIs | National/symbolic green; growth and natural resources; financial-inclusion “positive outcome” cue. |
| **Accent — warmth** | `#B45309` (Amber) | Highlights, “New”, “ARREST Agenda”, urgency | Warmth without alarm; draws eye to reforms and news. |
| **Neutral — background** | `#FAFAF9` (Stone-50) | Page background | Soft, not pure white; reduces glare; accessible. |
| **Neutral — surface** | `#FFFFFF` | Cards, modals, form surfaces | Clean, scannable. |
| **Neutral — text** | `#1C1917` (Stone-900) | Body copy | WCAG AA on light background. |
| **Muted text** | `#78716C` (Stone-500) | Captions, secondary copy | Clear hierarchy without low contrast. |
| **Border / divider** | `#E7E5E4` (Stone-200) | Cards, sections | Subtle separation. |

**Liberia-specific notes:** Use green and blue as the main “national” pair; avoid heavy red (flag) in large areas to keep a calm, institutional feel. Red reserved for alerts or small accent only.

---

### Typography stack (fonts, sizes, weights)

| Element | Font | Sizes (mobile → desktop) | Weight | Notes |
|--------|------|---------------------------|--------|--------|
| **Display / Hero** | **DM Sans** or **Plus Jakarta Sans** | clamp(1.75rem, 4vw + 1rem, 3.25rem) | 700–800 | Distinctive but readable; works at 18px for body if needed. |
| **Headings (H2–H3)** | Same as display | 1.5rem → 2rem (H2), 1.25rem → 1.5rem (H3) | 600–700 | Clear hierarchy. |
| **Body** | **Inter** or **Source Sans 3** | 1rem (16px) base | 400 | Highly legible; excellent for forms and long copy. |
| **Captions / labels** | Same as body | 0.875rem (14px) | 400–500 | Stats, card meta, “Last updated”. |
| **Micro / legal** | Same as body | 0.75rem (12px) | 400 | Footer, disclaimers. |
| **Numbers (FDI, growth %)** | **Tabular figures** (font-feature-settings) | Same as context | 600–700 | Aligned columns in stats and data viz. |

**Loading strategy:** Subset fonts (Latin + optional symbols); preload only display + body; `font-display: swap` to avoid FOIT on slow networks.

---

### Key UI principles (mobile-first, accessibility WCAG AA, performance)

- **Mobile-first:** Design breakpoints at 320px → 375px → 768px → 1024px → 1280px. Base layout is single column; grids and multi-column only from `sm`/`md` up.
- **Accessibility (WCAG AA):** Minimum 4.5:1 contrast for body text; 3:1 for large text. Focus visible (2px ring, offset). Semantic HTML (`<main>`, `<section>`, `<nav>`, headings in order). Buttons/links min 44×44px touch targets. `aria-live` for dynamic stats; `aria-labelledby` for sections.
- **Performance:** Lazy-load images below the fold; use WebP/AVIF with JPEG fallback. No autoplay video with sound; hero video optional and muted. Critical CSS inlined; defer non-critical JS. Target LCP < 2.5s on 3G.
- **Low-bandwidth:** Avoid large hero videos by default; offer “Watch video” as optional. Prefer SVG icons; compress and size images by breakpoint (e.g. 800w mobile, 1200w desktop).
- **Financial-inclusion tone:** Clear language, short sentences, avoid jargon in hero and CTAs. Use “Register your interest”, “See how to invest”, “Download investment guide” rather than “Submit RFI” alone.

---

## 2. Hero Section (above the fold)

### Layout description

- **Desktop:** Full-width band; left 50% = headline, subheadline, 2 CTAs, optional trust line (“Official investment promotion agency of the Republic of Liberia”). Right 50% = hero visual (image or subtle video).
- **Mobile:** Stack vertically: headline → subhead → CTAs (full-width or 2-column) → trust line → hero image (cropped for portrait/center).

Use a **max-width content area** (e.g. 1200px) so text doesn’t span the whole screen on ultra-wide; image can bleed to edge or sit in a rounded container.

### Headline + subheadline suggestions

- **Headline (H1):**  
  - “Invest in Liberia — Growth, Reforms & Opportunity”  
  - Or: “Why Invest in Liberia? Stability. Reforms. Returns.”  
- **Subheadline (one line or two):**  
  - “Explore priority sectors, incentives, and a clear path to invest. The National Investment Commission is your single point of contact.”  
  - Or: “From agriculture to fintech, mining to renewable energy. See opportunities, incentives, and how to get started.”

### Primary CTA buttons

1. **Primary (filled, teal):** “Explore opportunities” → scroll to Priority Sectors or `/opportunities`.
2. **Secondary (outline or ghost):** “Contact our team” → scroll to contact form or `/contact`.
3. **Tertiary (text or subtle):** “Register your interest” → leads to a short form or “Expression of interest” modal.

Order on mobile: Primary first, then Secondary; “Register interest” can be a link below or in nav.

### Background: hero image/video suggestion

- **Image option:** High-quality photo of Liberia that signals growth and credibility — e.g. Freeport of Monrovia, modern office/agribusiness, renewable installation, or diverse workers. Avoid generic stock; prefer commissioned or NIC-provided assets. Overlay: subtle dark gradient (bottom or full) so white text stays readable.
- **Video option (optional, muted):** Short loop (10–15 s): port activity, crops, city growth, or digital/mobile money scene. Low resolution (e.g. 720p), lazy-loaded; poster image required. No autoplay on mobile if data-saving mode detected (or preference).
- **Fallback:** Gradient (teal → blue) with simple geometric or map shape so the site never depends on media load.

---

## 3. Key Sections (in recommended scroll order)

### 3.1 Why Invest in Liberia (key stats, growth highlights, 2025+ reforms)

- **Purpose:** Establish credibility and momentum in one glance (growth, reforms, ease of doing business).
- **Layout:** Section with H2 “Why invest in Liberia?”; below, a **grid of stat cards** (2×2 on mobile, 4 in a row on desktop). Each card: big number, label, optional short line (e.g. “FDI growth”, “Ease of business”, “Sectors open”, “One-stop shop”).
- **Content elements:**  
  - 2–4 headline stats (e.g. “X% GDP growth”, “One-stop business registration”, “ARREST Agenda”, “LIFT Project”).  
  - Short paragraph on 2025+ reforms (business registration, ARREST, LIFT).  
  - Optional “Read the full story” link to an “About reforms” page.
- **Visuals:** Icons (growth chart, document/checkmark, building, handshake); optional small illustration or photo strip. No heavy charts here — keep it scannable.

---

### 3.2 Priority Sectors (card/grid showcase)

- **Purpose:** Let investors quickly see sectors (agriculture, mining, energy, tourism, fintech/digital finance, infrastructure, renewables) and drill in.
- **Layout:** H2 “Priority sectors”; **grid of sector cards** (1 col mobile, 2 cols tablet, 3–4 cols desktop). Each card: icon or small image, sector name, 1–2 line description, “Learn more” or “View opportunities” link.
- **Content elements:**  
  - Agriculture (rubber, palm oil, rice, cocoa; agro-processing).  
  - Mining (iron ore, gold; responsible extraction).  
  - Energy & renewables (power, solar, grid).  
  - Tourism (ecotourism, coastal, hospitality).  
  - Fintech & digital finance (mobile money, payments).  
  - Infrastructure (roads, ports, logistics).  
  - Manufacturing & agro-processing (if separate from agriculture).
- **Visuals:** Consistent icon set (e.g. Lucide or custom SVG) per sector; optional sector image per card. Hover: slight lift + border/primary accent.

---

### 3.3 Investment Incentives & Reforms (accordion or cards)

- **Purpose:** Clearly communicate tax breaks, free zones, one-stop shop, and other incentives.
- **Layout:** H2 “Incentives & reforms”; **accordion** (one item open by default) or **card grid**. Each item: title (e.g. “Tax incentives”, “Free zones”, “One-stop shop”, “Investor aftercare”) + short body.
- **Content elements:**  
  - Tax holidays / reduced rates for priority sectors.  
  - Free zones / special economic zones.  
  - One-stop shop (business registration, permits).  
  - ARREST Agenda and LIFT Project (1–2 sentences each + link).  
  - Investor support / aftercare.
- **Visuals:** Simple icons per incentive type; optional “Download incentive summary” PDF button.

---

### 3.4 Success Stories / Case Studies

- **Purpose:** Build trust with real investors and outcomes.
- **Layout:** H2 “Success stories”; **carousel or horizontal scroll** on mobile; **grid of 2–3 cards** on desktop. Each card: logo (or sector icon), company/sector name, 1–2 sentence quote or outcome, optional “Read more” link.
- **Content elements:** 3–5 short case studies (sector, investment type, result). Optional “As featured in” or “Partners” logo strip (NIC partners, development banks).
- **Visuals:** Investor logos (grayscale, hover color); quote marks; optional photo. Keep cards equal height; avoid long text.

---

### 3.5 How to Invest (step-by-step timeline/infographic)

- **Purpose:** Remove friction — show that the process is simple and transparent.
- **Layout:** H2 “How to invest”; **vertical timeline** (mobile) or **horizontal steps** (desktop). Steps: 1 → 2 → 3 → 4 (e.g. “Explore sectors”, “Contact NIC”, “Submit application”, “Register & start”).
- **Content elements:** Each step: number, title, 1–2 sentence description, optional “Contact” or “Guide” link. Final CTA: “Contact our team” or “Download step-by-step guide (PDF)”.
- **Visuals:** Numbered circles or icons; connecting line or arrow. Clear, minimal illustration (no clutter).

---

### 3.6 Data & Insights (charts: FDI, growth, mobile money)

- **Purpose:** Support credibility with data; appeal to data-driven investors.
- **Layout:** H2 “Data & insights”; **2–3 chart widgets** in a grid (stack on mobile). Below charts, 1–2 sentence summary and “Full report” or “Methodology” link.
- **Content elements:**  
  - FDI trends (e.g. bar or line chart, last 5 years if available).  
  - Economic growth (GDP or sector growth).  
  - Mobile money / fintech adoption (if data exists).  
  - Sourcing note: “Source: CBL, LISGIS, NIC” or similar.
- **Visuals:** Simple charts (bar, line); consistent primary/secondary colors; ensure labels and legends are readable and not image-only (use text/SVG). Lazy-load chart library or use static SVG for first paint.

---

### 3.7 News & Updates (latest from NIC, government agenda)

- **Purpose:** Show the site is alive and aligned with government agenda.
- **Layout:** H2 “News & updates”; **list or card list** (3–5 items). Each: date, title, 1-line excerpt, “Read more” link. Optional “All news” link.
- **Content elements:** Press releases, NIC announcements, ARREST/LIFT updates, sector news. Dates visible.
- **Visuals:** Small thumbnail optional; calendar or newspaper icon. Keep list scannable.

---

### 3.8 Footer / Quick Links (contact, FAQs, downloads)

- **Purpose:** Contact, support, and key documents in one place.
- **Layout:** **Multi-column footer** (collapse to stacked on mobile). Columns: Contact (address, phone, email); Quick links (How to invest, Sectors, Incentives, News, FAQs); Downloads (Investment guide PDF, one-stop shop guide); Social/Newsletter optional. Bottom bar: copyright, “Republic of Liberia”, optional Gov’t logo.
- **Content elements:**  
  - NIC address, phone, email, contact form link.  
  - Links to key sections (anchor or pages).  
  - “Investment guide PDF”, “Step-by-step guide”.  
  - FAQ link or expandable FAQ in-page.
- **Visuals:** Government seal or NIC logo; clear typography; no small gray links (min touch target, sufficient contrast).

---

## 4. Mobile-Specific Adaptions

- **Layout:** Single column; hero text first, then CTAs, then image. Sections stack; grids become 1-col or 2-col. Footer columns stack; order: Contact → Quick links → Downloads.
- **Navigation:** Hamburger menu; drawer or full-screen overlay with clear “Why invest”, “Sectors”, “How to invest”, “Contact”, “Register interest”. Sticky header with logo + menu; optional sticky CTA bar at bottom (“Contact us” / “Register interest”).
- **Touch-friendly:** Buttons and links min 44px height; spacing between tappable elements at least 8px. No hover-only actions; carousels swipeable with visible prev/next or dots. Forms: large inputs, clear labels, one column.
- **Performance:** Hero image served at 800w for mobile; lazy-load below-fold images and charts. Consider omitting or simplifying video on small screens or when `prefers-reduced-motion` or data-saver is on.

---

## 5. Trust & Fintech Touches

- **Security / credibility:** “Official site” or “Government of Liberia” label near logo; SSL (padlock) implied by HTTPS. Optional “Verified” or seal in footer. No fake badges; only real certifications or partnerships.
- **Inclusion:**  
  - **Multilingual:** Toggle “English” / “Français” (or other) in header or footer; switch content or key pages. Preserve language in URL or cookie.  
  - **High-contrast / reduced motion:** Respect `prefers-contrast` and `prefers-reduced-motion` (reduce or remove animations; ensure focus visible).
- **Micro-interactions:**  
  - Button hover: slight darken or scale (e.g. `scale(1.02)`); focus ring always visible.  
  - Card hover: subtle shadow + border color.  
  - Smooth scroll for anchor links (“Explore opportunities” → sectors).  
  - Optional: gentle fade-in on scroll for sections (with reduced-motion off).
- **Fast-loading:** Lazy-load images (below fold); WebP/AVIF + fallback; critical CSS inlined; fonts subset and preloaded; defer non-critical JS; avoid large third-party scripts above the fold.

---

## 6. Sample Visual Descriptions or Pseudo-Code

### A. Hero (Tailwind-style)

```text
Section: min-h-[85vh] md:min-h-[90vh] flex flex-col md:flex-row items-center
  Container: max-w-6xl mx-auto px-4 md:px-8
    Left (md:w-1/2):
      Badge: "Official investment promotion — Republic of Liberia" (text-xs, text-muted)
      H1: "Invest in Liberia — Growth, Reforms & Opportunity" (text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance)
      P: subheadline (text-lg text-muted-foreground mt-4 max-w-lg)
      Div (flex gap-3 mt-8):
        Button primary: "Explore opportunities" (bg-primary text-white px-6 py-3 rounded-lg min-h-[48px])
        Button secondary: "Contact our team" (border-2 border-primary text-primary px-6 py-3 rounded-lg)
      A: "Register your interest" (text-sm text-primary underline mt-4 inline-block)
    Right (md:w-1/2 mt-8 md:mt-0):
      Figure: aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden
        Img: hero image (object-cover w-full h-full) or
        Video: muted loop playsinline poster="hero-poster.jpg"
```

### B. “Why invest” stat cards

```text
Section: py-16 bg-background
  H2: "Why invest in Liberia?" (text-center text-2xl md:text-3xl font-bold mb-10)
  Grid: grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6
    Card (x4): bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition
      Span: number "X%" or "1" (text-3xl font-bold text-primary tabular-nums)
      P: label "FDI growth" / "One-stop shop" (text-sm text-muted-foreground mt-1)
      P (optional): short line (text-xs text-muted-foreground mt-2)
```

### C. Priority sector card

```text
Card: group bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200
  Div: w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4
    Icon: sector icon (e.g. Wheat for Agriculture) text-primary
  H3: "Agriculture" (text-lg font-semibold)
  P: "Rubber, palm oil, rice, cocoa and agro-processing." (text-sm text-muted-foreground mt-2)
  A: "Learn more" (text-sm font-medium text-primary group-hover:underline inline-flex items-center gap-1)
    Arrow icon
```

### D. How to invest timeline (mobile)

```text
Section: py-16
  H2: "How to invest" (text-2xl font-bold mb-8)
  Ul: space-y-6 (vertical timeline)
    Li (x4): flex gap-4
      Span: flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold
        Step number 1–4
      Div: flex-1 pb-6 border-l-2 border-border pl-4 (except last)
        H3: step title (font-semibold)
        P: step description (text-sm text-muted-foreground mt-1)
        A (optional): "Contact" or "Guide" (text-sm text-primary)
  Button: "Download step-by-step guide (PDF)" (outline, full-width sm:w-auto)
```

---

## 7. Final Recommendations

### Top 5 must-have improvements over current site

1. **Single, conversion-focused hero** — One clear headline, one primary CTA (“Explore opportunities”), one secondary (“Contact our team”), and a visible “Register interest” path. Replace long, text-heavy hero with scannable layout and clear hierarchy.
2. **Priority sectors as visual cards** — Replace walls of text with a grid of sector cards (icon + title + 1–2 lines + “Learn more”). Makes opportunities discoverable in seconds and works on mobile.
3. **Clear “How to invest” steps** — A simple 4-step timeline (explore → contact → submit → register) with optional PDF guide. Reduces uncertainty and supports conversion.
4. **Mobile-first and fast** — Responsive layout, 44px touch targets, lazy-loaded images, WebP, no heavy video autoplay. Ensure LCP and FID are good on 3G so Liberian and regional users aren’t excluded.
5. **Trust and credibility at a glance** — “Official” labeling, government/NIC branding, 2–4 headline stats (growth, reforms), and a short “Success stories” or partner strip. Data & insights section with simple charts (FDI, growth) to back the narrative.

### Tech stack suggestions

- **Framework:** **Next.js (React)** — SSR/SSG for fast first load and SEO; API routes for contact/registration forms and optional CMS.
- **Styling:** **Tailwind CSS** — Fast iteration, consistent spacing/colors, easy responsive and dark-mode if needed later. Use design tokens (e.g. in `tailwind.config`) for primary/secondary/accents.
- **Charts:** **Recharts** or **Chart.js** (or lightweight SVG) for FDI/growth/mobile money — keep bundle small; lazy-load chart component below fold.
- **Content:** **MDX** or **CMS (e.g. Sanity, Strapi)** for News and sector pages so NIC can update without code deploys.
- **Forms:** **React Hook Form** + validation (e.g. Zod); submit to API route then email or CRM. “Register interest” and “Contact” as primary forms.
- **Hosting:** **Vercel** or **Netlify** for edge, HTTPS, and good performance in Africa (consider CDN with regional nodes).
- **Accessibility:** **eslint-plugin-jsx-a11y**; **axe-core** in CI; manual checks for focus order and screen reader on key flows.

---

**Document version:** 1.0  
**Audience:** NIC web team, design/development vendors, stakeholders.  
**Next steps:** Prioritize hero + sectors + how to invest + contact for Phase 1; then incentives, success stories, data, news, and multilingual in Phase 2.
