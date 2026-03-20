# Diaspora Mode — Implementation Roadmap

Phased plan from MVP to scale. Assumes Next.js App Router, TypeScript, Tailwind, Stripe, PostgreSQL, and JWT or OAuth for auth.

---

## MVP (Phase 1) — Foundation & Trust

**Goal:** Launch the Diaspora Mode landing page and prove value with live rates, navigation to existing tools, and trust messaging. No payments or DB yet.

### Deliverables

1. **Diaspora Mode page** (`/diaspora`)
   - Hero: “Navigate Home. From Anywhere.” + CTAs (Enter Marketplace, View Live Rates, Track Investments).
   - Five feature modules (preview cards): Marketplace, Economic Intelligence, Investment Navigator, Remittance Optimization, Trust & Transparency.
   - Mobile-first, dark/light, fintech aesthetic.
   - Links to existing routes: `/rates`, `/market-intelligence`, `/invest`, `/tools/remittance`, `/report-fraud`.

2. **Marketplace placeholder** (`/diaspora/marketplace`)
   - Category list (Construction, Food & Groceries, Household, Fuel).
   - “Coming soon” state; no cart or checkout.

3. **Navigation**
   - Add “Diaspora Mode” to header/nav and optional bottom nav.
   - Sitemap entry for `/diaspora`.

4. **Docs**
   - Database schema (vendors, products, orders, ratings, disputes, activity_logs).
   - API endpoint spec for marketplace, intelligence, investment, remittance, trust.
   - This roadmap and revenue model.

**Tech:** Next.js, Tailwind, existing `/api/rates/live` and market-intelligence/invest/remittance pages. No new DB or Stripe.

**Timeline:** 1–2 weeks.

---

## Phase 2 — Marketplace & Payments

**Goal:** Real Diaspora Marketplace: verified vendors, catalog, multi-vendor cart, checkout with Stripe, delivery details, and escrow-style hold option.

### Deliverables

1. **Database**
   - Implement schema (users, vendors, products, orders, order_items, vendor_ratings, activity_logs).
   - Migrations (e.g. Prisma or raw SQL in repo).

2. **Auth**
   - JWT or OAuth (e.g. NextAuth) with roles: `user`, `vendor`, `admin`.
   - Protect `/diaspora/marketplace` (browse public; cart/checkout require auth).

3. **Vendors & Products**
   - Vendor onboarding (admin or vendor role): store name, location, contact, WhatsApp, business registration status, categories.
   - Product CRUD per vendor: name, category, unit, price (USD; LRD optional), image.
   - Public API: list vendors (verified filter), vendor profile, list products by vendor/category.

4. **Cart & Orders**
   - Cart in DB or session: multi-vendor cart, live USD→LRD conversion (use `/api/rates/live`).
   - Checkout: recipient form (name, phone, address, city, notes), fee breakdown, escrow toggle.
   - Create order → Stripe Checkout Session → redirect; webhook updates order status (e.g. paid → processing).
   - Order confirmation page; optional proof-of-delivery upload (photo URL).

5. **Trust**
   - Vendor profile: TrueRate Verified badge, business registration status, ratings (from vendor_ratings).
   - Post-order rating flow.
   - Activity log for user (order created, payment completed).

6. **Intelligence dashboard**
   - `/diaspora` or `/market-intelligence`: 7/30/90-day rate charts, inflation indicator, fuel/rice trackers (use or extend existing APIs), CBL policy headline, volatility alert.

**Tech:** Next.js API routes, Prisma or pg, Stripe SDK, existing rate APIs.

**Timeline:** 4–8 weeks.

---

## Phase 3 — Investment Navigator & Remittance Optimization

**Goal:** ROI calculator, sector risk indicators, verified projects; remittance provider comparison and best-timing alerts.

### Deliverables

1. **Investment Navigator**
   - ROI calculator API: amount (USD/LRD), sector, horizon, inflation → projected return and inflation-adjusted value.
   - Sectors: Real Estate, Agriculture, SME Retail, Import/Export with risk labels.
   - Verified project listings (admin-curated): title, sector, risk, short description, link or CTA.
   - Optional: capital pooling (future phase) — design only or minimal “express interest” signup.

2. **Remittance**
   - Remittance providers table: name, FX spread, fees (fixed + %).
   - API: compare providers; “best timing” (e.g. rate favorable today vs 7d avg); optional smart planner (target date → suggested send date).
   - Optional: email/push when rate is favorable (if digest/notifications already exist).

3. **Trust**
   - Fraud report API + form: subject (vendor/order/user), description; admin queue.
   - Dispute workflow: open dispute on order, status (open → under_review → resolved/rejected), resolution notes.
   - Order audit trail API for user and admin.

**Tech:** Same stack; new API routes and DB tables (remittance_providers, disputes, fraud_reports, fx_rate_snapshots if needed).

**Timeline:** 2–4 weeks after Phase 2.

---

## Phase 4 — Scale & Premium

**Goal:** Vendor self-service, richer intelligence, optional subscription or transaction-based revenue.

### Deliverables

1. **Vendor portal**
   - Vendors manage profile, products, and orders (view, update status, upload delivery proof).
   - Admin: verify vendors, resolve disputes/fraud, audit logs.

2. **Intelligence**
   - Alerts: volatility, CBL updates, “rate favorable” for remittance (email/SMS if infra exists).
   - Optional: export reports (PDF) for diaspora users.

3. **Monetization**
   - Platform fee on marketplace orders (e.g. % or fixed); Stripe Connect or manual payout to vendors.
   - Optional: premium tier (e.g. investment project access, priority support, lower marketplace fee).
   - Optional: remittance affiliate or referral fees.

4. **Performance & UX**
   - Caching for rates and intelligence (e.g. ISR or short TTL).
   - Delivery tracking (integrate local partner or manual status only).
   - Mobile PWA enhancements (offline copy of rates, etc.).

**Timeline:** 4–6 weeks after Phase 3.

---

## Summary

| Phase | Focus | Key outputs |
|-------|--------|-------------|
| **MVP** | Landing + trust | `/diaspora` page, marketplace placeholder, docs |
| **Phase 2** | Marketplace + payments | Vendors, products, cart, Stripe checkout, orders, ratings, activity |
| **Phase 3** | Invest + remittance | ROI calculator, sectors, projects; provider compare, best timing, disputes/fraud |
| **Phase 4** | Scale + premium | Vendor portal, alerts, fees, optional subscription |

Dependencies: Phase 2 blocks Phase 3 (auth + orders needed for disputes). Phase 3 can run in parallel with Phase 2 polish (e.g. intelligence dashboard). Phase 4 builds on all prior phases.
