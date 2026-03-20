# Diaspora Marketplace — Implementation Roadmap

MVP → Phase 2 → Scale. Aligns with existing [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) and adds marketplace-specific deliverables.

---

## MVP (Current)

**Goal:** Full marketplace UX with verified vendors, product catalog, cart, checkout, and order confirmation using mock data and in-memory order store.

### Done

- **Database schema**: Prisma schema in `prisma/schema.prisma` (users, vendors, products, orders, order_items, ratings, disputes, activity_logs).
- **API routes**: `/api/diaspora/vendors`, `/api/diaspora/products`, `/api/diaspora/cart/quote`, `/api/diaspora/checkout`, `/api/diaspora/orders`, `/api/diaspora/orders/[id]`. All use mock data and in-memory order store.
- **UI**: Marketplace page with vendor list (verified badge, location, contact), category filter, product grid, add-to-cart. Cart drawer with multi-vendor grouping and link to checkout. Checkout page with recipient form, live fee breakdown and USD→LRD, place order → order confirmation. Orders list and order confirmation pages.
- **Cart**: `DiasporaCartProvider` in diaspora layout; cart persisted in localStorage; checkout creates order and redirects to confirmation.
- **Trust**: Vendor cards show “Verified by TrueRate”, business registration status, rating/review count. Fee breakdown (platform fee, delivery) and FX rate on checkout.
- **Docs**: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md), [API_ENDPOINTS.md](./API_ENDPOINTS.md), [FEATURE_ARCHITECTURE.md](./FEATURE_ARCHITECTURE.md).

### Not done (MVP)

- Real payments (Stripe): checkout returns confirmation URL only; no card or bank transfer.
- Auth: no login; orders keyed by guest.
- Admin dashboard: stub only; no real vendor approval or dispute handling.

---

## Phase 2 — Payments & persistence

**Goal:** Real payments (Stripe), PostgreSQL persistence, auth, and basic admin.

### Deliverables

1. **Database**
   - Set `DATABASE_URL`; run Prisma migrations.
   - Replace `lib/diaspora/mock-data` and `lib/diaspora/order-store` with Prisma client in API routes.

2. **Auth**
   - JWT or NextAuth with roles: `user`, `vendor`, `admin`.
   - Protect: GET/POST cart, checkout, GET orders (require user or session).
   - Optional: guest checkout with session ID.

3. **Stripe**
   - Install Stripe SDK; add `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`.
   - POST `/api/diaspora/checkout`: create Stripe Checkout Session (line items, amount, success/cancel URLs), store order as `pending_payment`, return `url` to redirect.
   - POST `/api/diaspora/webhooks/stripe`: on `checkout.session.completed` (or `payment_intent.succeeded`), set order status to `paid`, update `stripe_payment_id`; optionally release escrow if used.

4. **Trust & orders**
   - Vendor ratings: GET/POST `/api/diaspora/vendors/[id]/ratings`; persist in DB.
   - Order tracking: status updates (processing → shipped → delivered); optional proof-of-delivery photo URL.
   - Disputes: POST `/api/diaspora/disputes` (order_id, reason); admin PATCH to resolve.

5. **Admin**
   - Protect `/diaspora/admin` and admin APIs by `role === 'admin'`.
   - Vendor approval: list pending vendors; PATCH `/api/diaspora/vendors/[id]/verify` (truerate_verified, business_reg_status).
   - Disputes: list open/under_review; PATCH status and resolution.
   - Transaction volume: aggregate orders by period; optional export.

---

## Phase 3 — Scale & analytics

**Goal:** Vendor self-service, analytics, and optional US bank transfer.

### Deliverables

1. **Vendor portal**
   - Vendors (role `vendor`) can update profile, manage products, view their orders, update status, upload delivery proof.

2. **Payments**
   - Optional: ACH/US bank transfer flow (e.g. Stripe ACH or partner); show “Pay by bank” and FX rate; reconcile manually or via webhook.

3. **Analytics**
   - Diaspora spending trends (construction vs food vs fuel vs household).
   - Monthly inflow impact (orders linked to remittance intent).
   - Admin dashboard: charts, sector-level insights, fraud/dispute metrics.

4. **Fraud & compliance**
   - Rate limiting on checkout and auth.
   - Fraud report API and admin queue (existing schema: `fraud_reports`).
   - Activity logs for orders and payments (existing schema: `activity_logs`).

---

## Summary

| Phase   | Focus              | Key outputs                                      |
|---------|--------------------|--------------------------------------------------|
| **MVP** | UX + mock data     | Vendors, products, cart, checkout, orders, docs  |
| **Phase 2** | Payments + DB + auth | Stripe, Prisma, JWT/NextAuth, ratings, disputes, admin |
| **Phase 3** | Scale + analytics  | Vendor portal, bank transfer, analytics, fraud   |

Dependencies: Phase 2 unblocks production payments and admin. Phase 3 builds on Phase 2 for vendor and analytics features.
