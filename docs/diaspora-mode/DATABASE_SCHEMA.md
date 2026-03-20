# Diaspora Mode — Database Schema

PostgreSQL schema for Diaspora Marketplace, orders, vendors, and trust/audit. Compatible with Prisma or raw SQL.

---

## 1. Users & Roles

```sql
-- Extend existing or create users table with role
CREATE TABLE IF NOT EXISTS users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT UNIQUE NOT NULL,
  password_hash     TEXT,
  role              TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'vendor', 'admin')),
  full_name         TEXT,
  phone             TEXT,
  country_code      TEXT,  -- e.g. US, UK
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

---

## 2. Vendors (TrueRate Direct)

```sql
CREATE TABLE vendors (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE SET NULL,
  store_name          TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  description         TEXT,
  location_address    TEXT NOT NULL,
  location_city       TEXT DEFAULT 'Monrovia',
  location_region     TEXT,
  phone               TEXT NOT NULL,
  whatsapp            TEXT,
  business_reg_no     TEXT,
  business_reg_status TEXT CHECK (business_reg_status IN ('pending', 'verified', 'rejected')),
  truerate_verified    BOOLEAN NOT NULL DEFAULT false,
  verified_at         TIMESTAMPTZ,
  categories          TEXT[] NOT NULL DEFAULT '{}',  -- construction, food_groceries, household, fuel
  logo_url            TEXT,
  banner_url          TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vendors_slug ON vendors(slug);
CREATE INDEX idx_vendors_verified ON vendors(truerate_verified);
CREATE INDEX idx_vendors_categories ON vendors USING GIN(categories);
```

---

## 3. Products & Catalog

```sql
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id   UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  description TEXT,
  category    TEXT NOT NULL,  -- construction, food_groceries, household, fuel_voucher
  unit        TEXT NOT NULL DEFAULT 'piece',  -- piece, kg, liter, gallon, bag, etc.
  price_usd   DECIMAL(12,2) NOT NULL,
  price_lrd   DECIMAL(14,2),
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, slug)
);

CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_products_category ON products(category);
```

---

## 4. Orders & Cart

```sql
CREATE TABLE orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id),
  status            TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'disputed', 'refunded'
  )),
  total_usd         DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_lrd         DECIMAL(14,2),
  fx_rate_snapshot  DECIMAL(10,4),
  fee_breakdown     JSONB,  -- { platform_fee_usd, delivery_fee_usd, tax_usd }
  payment_hold      BOOLEAN NOT NULL DEFAULT false,  -- escrow-style
  stripe_payment_id TEXT,
  recipient_name    TEXT NOT NULL,
  recipient_phone   TEXT NOT NULL,
  delivery_address  TEXT NOT NULL,
  delivery_city     TEXT,
  delivery_notes    TEXT,
  proof_photo_url   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  vendor_id   UUID NOT NULL REFERENCES vendors(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_usd DECIMAL(12,2) NOT NULL,
  line_total_usd DECIMAL(12,2) NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
```

---

## 5. Vendor Ratings & Trust

```sql
CREATE TABLE vendor_ratings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id  UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES users(id),
  order_id   UUID REFERENCES orders(id),
  rating     SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, user_id, order_id)
);

CREATE TABLE fraud_reports (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id),
  subject_type TEXT NOT NULL,  -- vendor, order, user
  subject_id  UUID NOT NULL,
  description TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE disputes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id),
  user_id     UUID NOT NULL REFERENCES users(id),
  reason      TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'rejected')),
  resolution  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vendor_ratings_vendor ON vendor_ratings(vendor_id);
CREATE INDEX idx_fraud_reports_status ON fraud_reports(status);
CREATE INDEX idx_disputes_order ON disputes(order_id);
```

---

## 6. Audit & Activity Log

```sql
CREATE TABLE activity_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  action      TEXT NOT NULL,  -- order_created, payment_completed, dispute_opened, etc.
  entity_type TEXT NOT NULL,
  entity_id   UUID,
  metadata    JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);
```

---

## 7. Remittance & FX (optional)

```sql
CREATE TABLE remittance_providers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  fx_spread_pct DECIMAL(5,2),
  fee_fixed_usd DECIMAL(8,2),
  fee_pct       DECIMAL(5,2),
  last_updated  TIMESTAMPTZ
);

CREATE TABLE fx_rate_snapshots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate        DECIMAL(10,4) NOT NULL,
  source      TEXT NOT NULL,  -- official, market
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

---

## Entity Relationship Summary

- **users** → vendors (1:1), orders (1:n), vendor_ratings, fraud_reports, disputes, activity_logs
- **vendors** → products (1:n), order_items (via orders), vendor_ratings
- **orders** → order_items (1:n), disputes (1:n)
- **products** → order_items (n:1)

Use JWT or session with `role` for RBAC; gate `/diaspora/marketplace` and checkout by auth; admin-only for fraud/dispute resolution and vendor verification.
