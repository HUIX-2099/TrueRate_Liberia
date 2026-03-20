# Ideas for TrueRate Liberia

Prioritized ideas to improve the platform. Use checkboxes to track progress.

---

## Quick wins (high impact, lower effort)

- [x] Source attribution + CBL rate
- [x] “Last updated” + stale-rate warning
- [x] Offline converter with cached rate
- [x] Complete i18n for main screens
- [x] Wire SMS alerts to real backend

---

## Data & trust

- [x] Source attribution (where each rate comes from)
- [x] Show CBL official rate alongside composite rate
- [x] Crowdsourced rate verification / confirm or flag
- [x] Export rate history (CSV/Excel)

---

## Offline & low connectivity

- [x] Offline converter using last cached rate
- [x] Show “last updated” timestamp on converter, map, widgets
- [x] Stale-rate warning when cache is old (e.g. >2h) + refresh

---

## Reach

- [x] USSD/short code for feature phones
- [x] Complete i18n (Koloqua, French, Kpelle) for main flows
- [x] Market Woman Mode as prominent/default option

---

## Notifications

- [x] Real SMS alerts backend (replace simulated signup)
- [x] Push rules: “Notify when rate > X” or “moved by Y%”
- [x] Daily/weekly rate digest (email or push)

---

## Map & locations

- [x] Extend map to more counties
- [x] “Rate at this spot” community submissions (rate + optional photo)
- [x] Changer opening hours and contact (phone) on map

---

## Business & tools

- [x] Bulk conversion (multiple amounts at once)
- [x] Invoice PDF export from Invoice Protector
- [x] Business API (API key + docs for live/historical rate)
- [x] Remittance corridors (e.g. US → Liberia) and “typical remittance rate”

---

## Community & safety

- [x] Fraud report workflow with storage and follow-up
- [x] “Is this rate wrong?” dispute flow from map/converter
- [x] Align leaderboard with verified reports / repeat reporters

---

## Analytics & predictions

- [x] Compare periods (e.g. this week vs last week)
- [x] Short explanation for ML predictions (“based on last 60 days”)
- [x] Regional breakdown (e.g. by county or Monrovia vs upcountry)

---

## Polish

- [x] Status/health page (rate sources OK/delayed/down)
- [x] Error boundaries on converter, map, predictions
- [x] Rate change animation (up/down) when rate updates

---

## Sustainability (optional)

- [ ] Verified changer program (paid badge + visibility)
- [ ] Sponsored “Best rate near you” slot (clearly labeled)
- [ ] Donate / support (e.g. Mobile Money) link

---

## Future ideas

- [x] In-app rate alerts (browser push when rate crosses a threshold)
- [x] Dark/light theme sync with system and per-page overrides
- [x] Rate history charts by source (CBL vs market over time)
- [x] Rate comparison callout (“X months ago this was Y LRD” on converter & analytics)
- [ ] “Share this rate” one-tap copy for WhatsApp/SMS
- [ ] Multi-currency view (e.g. EUR, GBP alongside USD/LRD)

---

## Ideas backlog (prioritized)

*Quick to scan; pick by impact and effort.*

### High impact, lower effort

- [ ] **Share this rate** — One-tap copy for WhatsApp/SMS (rate + short message).
- [ ] **Multi-currency** — EUR, GBP (and optionally NGN, XOF) alongside USD/LRD on converter and key views.
- [ ] **Price index print view** — Print-friendly / “Save as PDF” for the current price index view.
- [ ] **Public API docs** — Simple docs page or `/docs/api` for Business API (live/historical rate, usage limits).
- [ ] **PWA / Install prompt** — “Add to home screen” for offline converter and cached rates.

### Ministry & data (align with partnership roadmap)

- [ ] **License-backed verification** — Wire verified changer badge to MoCI license data once DSA is live (`business_licenses` + `lib/verification`).
- [ ] **Public economic snapshot** — Monthly or quarterly “Liberia market snapshot” (PDF or page) from commodity + trade + COL.
- [ ] **CBL integration (future)** — Optional feed from Central Bank for official FX and policy context.
- [ ] **Complaint indicators in risk** — Use aggregated MoCI complaint data in market risk / fraud indicators when available.

### Sustainability & growth

- [ ] **Verified changer program** — Paid badge + visibility for licensed changers; clear terms.
- [ ] **Sponsored “Best rate near you”** — Clearly labeled slot; revenue without compromising trust.
- [ ] **Donate / support** — Mobile Money or link for users who want to support TrueRate.

### UX & polish

- [ ] **Keyboard shortcuts** — e.g. `/` to focus search on price index; Esc to clear.
- [ ] **Price index period compare** — “This week vs last week” or “vs last month” for basket or key items.
- [ ] **Rate widget embed** — One-line script for partners to embed “Live LRD/USD” on their site.
- [ ] **SME / business digest** — Optional email: rate summary + price index highlights + risk level.

### Data & platform

- [ ] **Historical price index** — Store and display time series for the index (or key items) for charts.
- [ ] **Alerts on price index** — “Notify me when rice (25kg) goes above X LRD” (if data allows).
- [ ] **Open data export** — Bulk CSV/JSON of aggregated (anon) rate and price index for researchers.
