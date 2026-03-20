# Diaspora Mode — API Endpoints

REST API design for Diaspora Marketplace, intelligence, investment, remittance, and trust. All authenticated routes assume JWT or session; role checks where noted.

---

## Authentication (shared)

- **POST** `/api/auth/signin` — email + password → JWT/session
- **POST** `/api/auth/signup` — register (role default `user`)
- **POST** `/api/auth/signout` — invalidate session
- **GET** `/api/auth/me` — current user + role

---

## 1. Diaspora Marketplace (TrueRate Direct)

### Vendors

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/diaspora/vendors` | List verified vendors (optional `?category=construction`) | Optional |
| GET | `/api/diaspora/vendors/[id]` | Vendor profile + products | No |
| GET | `/api/diaspora/vendors/[id]/products` | Products by vendor (optional `?category=`) | No |
| POST | `/api/diaspora/vendors` | Create vendor (role: vendor/admin) | Yes |
| PATCH | `/api/diaspora/vendors/[id]` | Update vendor (owner or admin) | Yes |

### Products

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/diaspora/products` | List products (filters: category, vendor_id) | No |
| GET | `/api/diaspora/products/[id]` | Product detail | No |
| POST | `/api/diaspora/products` | Create product (vendor) | Yes |
| PATCH | `/api/diaspora/products/[id]` | Update product (vendor owner) | Yes |

### Cart & Orders

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/diaspora/cart` | Current user cart (multi-vendor) | Yes |
| PUT | `/api/diaspora/cart` | Set cart items `{ items: [{ product_id, quantity }] }` | Yes |
| POST | `/api/diaspora/cart/convert` | Get USD→LRD conversion for cart (body: optional `fx_rate` override) | Yes |
| POST | `/api/diaspora/orders` | Create order from cart; body: recipient_name, recipient_phone, delivery_address, delivery_city, delivery_notes, use_escrow | Yes |
| GET | `/api/diaspora/orders` | List current user orders | Yes |
| GET | `/api/diaspora/orders/[id]` | Order detail + items + status | Yes |
| PATCH | `/api/diaspora/orders/[id]` | Update order (e.g. upload proof_photo; vendor/admin for status) | Yes |

### Checkout (Stripe)

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/diaspora/checkout` | Create Stripe Checkout Session for cart; return `url` | Yes |
| POST | `/api/diaspora/webhooks/stripe` | Stripe webhook (payment_intent.succeeded, etc.) — update order status, release escrow | No (verify signature) |

---

## 2. Economic Intelligence

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/rates/live` | Already exists — live USD/LRD (official + market) | No |
| GET | `/api/rates/historical` | Historical rates for charts (query: range=7d|30d|90d) | No |
| GET | `/api/diaspora/intelligence/summary` | Aggregated: live rate, 7/30/90d trend, inflation indicator, fuel/rice last price, CBL policy headline, volatility flag | No |
| GET | `/api/diaspora/intelligence/fuel` | Fuel price tracker series | No |
| GET | `/api/diaspora/intelligence/rice` | Rice price tracker series | No |
| GET | `/api/diaspora/intelligence/alerts` | Market volatility / CBL update alerts (optional ?user_id for subscribed) | Optional |

---

## 3. Diaspora Investment Navigator

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/diaspora/invest/roi-calculator` | Body: amount_usd, amount_lrd, sector, horizon_years, inflation_pct → ROI + inflation-adjusted projection | No |
| GET | `/api/diaspora/invest/sectors` | Sector list with risk level (real_estate, agriculture, sme_retail, import_export) | No |
| GET | `/api/diaspora/invest/projects` | Verified project listings (optional ?sector=, ?risk=) | No |
| GET | `/api/diaspora/invest/projects/[id]` | Project detail | No |

---

## 4. Remittance Optimization

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/diaspora/remittance/providers` | Compare providers: name, fx_spread, fee_fixed, fee_pct, last_updated | No |
| GET | `/api/diaspora/remittance/best-timing` | Returns: is_favorable_today, message, current_rate, 7d_avg | No |
| POST | `/api/diaspora/remittance/plan` | Body: amount_usd, target_date → suggested send date and provider | Yes (optional) |

---

## 5. Trust & Transparency

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/diaspora/vendors/[id]/ratings` | Vendor ratings + aggregate | No |
| POST | `/api/diaspora/vendors/[id]/ratings` | Submit rating (user, after order) | Yes |
| POST | `/api/diaspora/fraud/report` | Body: subject_type, subject_id, description | Yes |
| GET | `/api/diaspora/disputes` | List current user disputes | Yes |
| POST | `/api/diaspora/disputes` | Open dispute: order_id, reason | Yes |
| GET | `/api/diaspora/activity` | Activity log for current user (orders, payments, disputes) | Yes |
| GET | `/api/diaspora/orders/[id]/audit` | Audit trail for order (user owner or admin) | Yes |

Admin-only (role check):

- **PATCH** `/api/diaspora/fraud/report/[id]` — status, admin_notes
- **PATCH** `/api/diaspora/disputes/[id]` — status, resolution
- **PATCH** `/api/diaspora/vendors/[id]/verify` — set truerate_verified, business_reg_status

---

## Response Conventions

- **200** — JSON body with data
- **201** — Created (e.g. order, dispute)
- **400** — Validation error; body `{ error, details? }`
- **401** — Unauthorized
- **403** — Forbidden (wrong role)
- **404** — Not found
- **500** — Server error

Use consistent envelope for list routes, e.g. `{ data: [], total, page, pageSize }` where applicable.
