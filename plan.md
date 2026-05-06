# SocialERP — Bangladesh Social Seller SaaS
## Full System + Database Design Plan for Copilot

> Stack: Laravel 11 + Inertia.js + React + tailwind + typescript + PostgreSQL + Redis + Laravel Horizon
> Target: Facebook & Instagram page sellers in Bangladesh (COD-first market)
> Architecture: Multi-tenant SaaS (single-database, tenant-scoped)

---

## 1. TECHNOLOGY STACK

| Layer | Technology | Reason |
|---|---|---|
| Backend | Laravel 11 | Mature, great ecosystem, queue/jobs built-in |
| Frontend | Inertia.js + react | SPA feel without full API, shared validation |
| Database | PostgreSQL 16 | JSONB, partial indexes, better concurrency than MySQL |
| Cache / Queue | Redis 7 | Sessions, queues, real-time counters |
| Queue Worker | Laravel Horizon | Redis queue monitoring, retry logic |
| Search | Meilisearch | Fast customer/order search |
| File Storage | S3 / Cloudflare R2 | Product images, documents |
| Scheduler | Laravel Scheduler | Cron jobs (stock sync, report generation) |
| Realtime | Laravel Reverb (WebSocket) | Live order notifications |
| Auth | Laravel Sanctum | SPA auth + API tokens |

---

## 2. MULTI-TENANCY ARCHITECTURE

### Strategy: Single Database, Tenant-Scoped Models

Use the `stancl/tenancy` package in "single-database" mode.
Every tenant-owned table has a `tenant_id` column.
A `TenantScope` global scope is applied to all tenant models automatically.

### Tenant Resolution Flow
```
Request → Middleware (ResolveTenant) → sets app('tenant') → all models auto-scope
```

### Key Rules for Copilot
- Every model that belongs to a tenant MUST use the `BelongsToTenant` trait
- `BelongsToTenant` trait automatically injects `tenant_id` on `creating` and applies a global scope on `booted`
- Never query tenant data without the scope active
- Super-admin panel bypasses tenant scope via `withoutTenantScope()`
- All `tenant_id` columns must be `NOT NULL` with a foreign key to `tenants.id`

---

## 3. DATABASE CONVENTIONS & STANDARDS

### ID Strategy
- **ULID** for all primary entity tables (tenants, users, orders, customers, products, shipments)
- Use Laravel's `HasUlids` trait — ULIDs are sortable, URL-safe, and globally unique
- **BigInteger auto-increment** for high-volume append-only tables (stock_movements, order_status_history, tracking_events, audit_logs)

```php
// Entity tables
$table->ulid('id')->primary();

// High-volume log tables
$table->id(); // bigIncrements
```

### Naming Conventions
- Tables: `snake_case`, plural (e.g., `order_items`)
- Columns: `snake_case`
- Foreign keys: `{referenced_table_singular}_id` (e.g., `order_id`, `tenant_id`)
- Boolean columns: prefix `is_` or `has_` (e.g., `is_active`, `has_variants`)
- Timestamps: always include `created_at`, `updated_at`; soft-delete tables add `deleted_at`
- Money: always store as **integer (paisa/cents)** — `100` = ৳1.00. Never use FLOAT or DECIMAL for money to avoid floating point errors
- JSON columns: suffix `_data` or `_meta` (e.g., `shipping_address`, `raw_response`)

### Indexing Rules
- Every `tenant_id` column must be indexed (included in composite indexes)
- Composite index format: `(tenant_id, {filter_column})` — tenant_id always first
- Add index on any column used in `WHERE`, `ORDER BY`, or `JOIN`
- Partial indexes for status filters (PostgreSQL supports this — use it)
- Never index JSONB columns directly; use generated columns for frequently queried JSON fields

### Soft Deletes
- Use `SoftDeletes` on: tenants, users, products, customers, orders
- Do NOT use soft deletes on: log tables, tracking events, transactions (immutable records)

### Encrypted Columns
Use `encrypted:` cast on sensitive fields (Laravel's built-in encryption via `APP_KEY`):
- `access_token`, `api_key`, `api_secret` on any integration table
- `password` uses `hashed` cast, not `encrypted`

---

## 4. FULL DATABASE SCHEMA

---

### 4.1 PLATFORM TABLES (non-tenant, super-admin scope)

---

#### `plans`
SaaS subscription plans.

```sql
id               BIGINT PK AUTO_INCREMENT
name             VARCHAR(100) NOT NULL          -- 'Starter', 'Growth', 'Pro'
slug             VARCHAR(100) UNIQUE NOT NULL   -- 'starter', 'growth', 'pro'
price_monthly    INTEGER NOT NULL DEFAULT 0     -- in paisa (BDT * 100)
price_yearly     INTEGER NOT NULL DEFAULT 0
order_limit      INTEGER DEFAULT NULL           -- NULL = unlimited
user_limit       INTEGER NOT NULL DEFAULT 3
social_accounts_limit INTEGER NOT NULL DEFAULT 2
features         JSONB NOT NULL DEFAULT '{}'    -- feature flags
is_active        BOOLEAN NOT NULL DEFAULT TRUE
sort_order       SMALLINT NOT NULL DEFAULT 0
created_at       TIMESTAMP
updated_at       TIMESTAMP
```

---

#### `tenants`
Each tenant = one seller business / shop.

```sql
id               ULID PK
name             VARCHAR(255) NOT NULL          -- Business name
slug             VARCHAR(100) UNIQUE NOT NULL   -- URL slug, subdomain
email            VARCHAR(255) UNIQUE NOT NULL   -- Primary contact email
phone            VARCHAR(20)
logo_path        VARCHAR(500)
plan_id          BIGINT FK → plans.id NOT NULL
plan_started_at  TIMESTAMP
plan_expires_at  TIMESTAMP
trial_ends_at    TIMESTAMP
status           VARCHAR(30) NOT NULL DEFAULT 'trial'
                 -- ENUM: trial, active, suspended, cancelled
settings         JSONB NOT NULL DEFAULT '{}'    -- tenant-level config
onboarding_step  SMALLINT NOT NULL DEFAULT 0    -- tracks setup wizard progress
timezone         VARCHAR(50) NOT NULL DEFAULT 'Asia/Dhaka'
currency         CHAR(3) NOT NULL DEFAULT 'BDT'
created_at       TIMESTAMP
updated_at       TIMESTAMP
deleted_at       TIMESTAMP NULL

INDEX (status)
INDEX (plan_id)
INDEX (plan_expires_at)
```

---

#### `users`
All users across all tenants.

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
name             VARCHAR(255) NOT NULL
email            VARCHAR(255) NOT NULL
email_verified_at TIMESTAMP NULL
password         VARCHAR(255)                   -- hashed, null if social login
role             VARCHAR(30) NOT NULL DEFAULT 'staff'
                 -- ENUM: owner, admin, manager, staff
permissions      JSONB NOT NULL DEFAULT '[]'    -- granular permission overrides
avatar_path      VARCHAR(500)
phone            VARCHAR(20)
last_login_at    TIMESTAMP NULL
last_login_ip    INET NULL
is_active        BOOLEAN NOT NULL DEFAULT TRUE
remember_token   VARCHAR(100)
created_at       TIMESTAMP
updated_at       TIMESTAMP
deleted_at       TIMESTAMP NULL

UNIQUE (tenant_id, email)
INDEX (tenant_id, role)
INDEX (tenant_id, is_active)
```

> **Note:** Only one `owner` per tenant. Enforced at application level + DB check constraint.

---

### 4.2 PRODUCT & INVENTORY SYSTEM

---

#### `categories`

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
parent_id        ULID FK → categories.id NULL   -- for nested categories
name             VARCHAR(100) NOT NULL
slug             VARCHAR(120) NOT NULL
sort_order       SMALLINT NOT NULL DEFAULT 0
is_active        BOOLEAN NOT NULL DEFAULT TRUE
created_at       TIMESTAMP
updated_at       TIMESTAMP

UNIQUE (tenant_id, slug)
INDEX (tenant_id, parent_id)
```

---

#### `products`

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
category_id      ULID FK → categories.id NULL
name             VARCHAR(255) NOT NULL
sku              VARCHAR(100) NOT NULL           -- unique per tenant
description      TEXT
cost_price       INTEGER NOT NULL DEFAULT 0      -- in paisa
selling_price    INTEGER NOT NULL DEFAULT 0      -- in paisa
weight_gram      INTEGER DEFAULT NULL
images           JSONB NOT NULL DEFAULT '[]'     -- [{url, is_primary, sort}]
has_variants     BOOLEAN NOT NULL DEFAULT FALSE
is_active        BOOLEAN NOT NULL DEFAULT TRUE
low_stock_alert  INTEGER NOT NULL DEFAULT 5      -- alert threshold
created_at       TIMESTAMP
updated_at       TIMESTAMP
deleted_at       TIMESTAMP NULL

UNIQUE (tenant_id, sku)
INDEX (tenant_id, category_id)
INDEX (tenant_id, is_active)
INDEX (tenant_id, has_variants)
```

---

#### `product_variants`
Only used when `products.has_variants = TRUE`.

```sql
id               ULID PK
product_id       ULID FK → products.id NOT NULL
tenant_id        ULID FK → tenants.id NOT NULL  -- denormalized for scoping
sku              VARCHAR(100) NOT NULL
name             VARCHAR(255) NOT NULL            -- e.g., "Red / XL"
attributes       JSONB NOT NULL DEFAULT '{}'      -- {color: "Red", size: "XL"}
cost_price       INTEGER                          -- NULL = inherit from product
selling_price    INTEGER                          -- NULL = inherit from product
is_active        BOOLEAN NOT NULL DEFAULT TRUE
sort_order       SMALLINT NOT NULL DEFAULT 0
created_at       TIMESTAMP
updated_at       TIMESTAMP

UNIQUE (tenant_id, sku)
INDEX (product_id)
INDEX (tenant_id, product_id)
```

---

#### `warehouses`

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
name             VARCHAR(100) NOT NULL
address          VARCHAR(500)
district         VARCHAR(100)
is_default       BOOLEAN NOT NULL DEFAULT FALSE
is_active        BOOLEAN NOT NULL DEFAULT TRUE
created_at       TIMESTAMP
updated_at       TIMESTAMP

INDEX (tenant_id, is_default)
```

> Only one default warehouse per tenant. Enforced via trigger or application logic.

---

#### `inventory`
Real-time stock levels. One row per product/variant per warehouse.

```sql
id               BIGINT PK AUTO_INCREMENT
tenant_id        ULID FK → tenants.id NOT NULL
warehouse_id     ULID FK → warehouses.id NOT NULL
product_id       ULID FK → products.id NOT NULL
variant_id       ULID FK → product_variants.id NULL
quantity_on_hand INTEGER NOT NULL DEFAULT 0      -- physical stock
quantity_reserved INTEGER NOT NULL DEFAULT 0     -- held by pending/confirmed orders
-- quantity_available = quantity_on_hand - quantity_reserved (computed in app, not stored)
updated_at       TIMESTAMP

UNIQUE (warehouse_id, product_id, variant_id)
INDEX (tenant_id, product_id)
INDEX (tenant_id, variant_id)

CHECK (quantity_on_hand >= 0)
CHECK (quantity_reserved >= 0)
CHECK (quantity_on_hand >= quantity_reserved)
```

> **Critical:** Use PostgreSQL `SELECT ... FOR UPDATE SKIP LOCKED` when decrementing stock during order confirmation. This prevents race conditions.

---

#### `stock_movements`
Immutable audit trail. Never update, only insert.

```sql
id               BIGINT PK AUTO_INCREMENT
tenant_id        ULID NOT NULL                   -- denormalized, no FK (immutable)
inventory_id     BIGINT FK → inventory.id NOT NULL
type             VARCHAR(30) NOT NULL
                 -- ENUM: stock_in, stock_out, reserved, released, adjusted, returned, damaged
quantity         INTEGER NOT NULL                -- positive = in, negative = out
quantity_before  INTEGER NOT NULL                -- snapshot before movement
quantity_after   INTEGER NOT NULL                -- snapshot after movement
reference_type   VARCHAR(50)                     -- 'order', 'adjustment', 'return', 'manual'
reference_id     VARCHAR(26)                     -- ULID of the reference record
note             TEXT
created_by       ULID                            -- user_id
created_at       TIMESTAMP NOT NULL DEFAULT NOW()

INDEX (tenant_id, inventory_id)
INDEX (tenant_id, created_at)
INDEX (reference_type, reference_id)
```

---

### 4.3 CUSTOMER MANAGEMENT (CRM)

---

#### `customers`
Central customer record. Shared across channels (FB, Insta, website, manual).

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
name             VARCHAR(255) NOT NULL
phone            VARCHAR(20)                     -- primary contact, indexed
phone_alt        VARCHAR(20)
email            VARCHAR(255)
fb_psid          VARCHAR(100)                    -- Facebook Page-Scoped User ID
instagram_id     VARCHAR(100)
district         VARCHAR(100)
upazila          VARCHAR(100)
default_address  JSONB                           -- {line1, district, upazila, note}
-- Behavioral metrics (updated via DB triggers or queue jobs)
total_orders     INTEGER NOT NULL DEFAULT 0
total_spent      INTEGER NOT NULL DEFAULT 0      -- in paisa
cod_attempted    INTEGER NOT NULL DEFAULT 0
cod_success      INTEGER NOT NULL DEFAULT 0
cod_refused      INTEGER NOT NULL DEFAULT 0
-- cod_success_rate = cod_success / NULLIF(cod_attempted, 0) * 100 (computed in app)
risk_score       SMALLINT NOT NULL DEFAULT 0     -- 0-100, higher = riskier
tags             JSONB NOT NULL DEFAULT '[]'      -- ["vip", "repeat", "scammer"]
notes            TEXT
is_blacklisted   BOOLEAN NOT NULL DEFAULT FALSE
blacklist_reason TEXT
blacklisted_at   TIMESTAMP NULL
blacklisted_by   ULID NULL
source           VARCHAR(30) DEFAULT 'manual'    -- ENUM: facebook, instagram, manual, website
created_at       TIMESTAMP
updated_at       TIMESTAMP
deleted_at       TIMESTAMP NULL

UNIQUE (tenant_id, phone)         -- one customer per phone per tenant
INDEX (tenant_id, is_blacklisted)
INDEX (tenant_id, risk_score)
INDEX (tenant_id, fb_psid)        -- for Messenger bot lookup
INDEX (tenant_id, created_at)
-- Partial index for blacklisted customers (fast lookup)
CREATE INDEX idx_customers_blacklisted ON customers (tenant_id) WHERE is_blacklisted = TRUE;
```

---

#### `customer_addresses`
Multiple saved addresses per customer.

```sql
id               BIGINT PK AUTO_INCREMENT
customer_id      ULID FK → customers.id NOT NULL
label            VARCHAR(50) DEFAULT 'Home'
address_line1    VARCHAR(500) NOT NULL
address_line2    VARCHAR(500)
district         VARCHAR(100) NOT NULL
upazila          VARCHAR(100)
landmark         VARCHAR(255)
is_default       BOOLEAN NOT NULL DEFAULT FALSE
created_at       TIMESTAMP
updated_at       TIMESTAMP

INDEX (customer_id)
```

---

#### `customer_notes`
Activity log / notes per customer (CRM feed).

```sql
id               BIGINT PK AUTO_INCREMENT
customer_id      ULID FK → customers.id NOT NULL
tenant_id        ULID NOT NULL
note             TEXT NOT NULL
type             VARCHAR(30) DEFAULT 'note'      -- ENUM: note, call, warning, blacklist, cod_refused
created_by       ULID NOT NULL
created_at       TIMESTAMP

INDEX (customer_id)
INDEX (tenant_id, created_at)
```

---

### 4.4 ORDER MANAGEMENT SYSTEM

---

#### `orders`
Core order table. Heart of the system.

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
order_number     VARCHAR(30) NOT NULL            -- e.g., ORD-2024-000001 (unique per tenant)
customer_id      ULID FK → customers.id NOT NULL
-- Source tracking
source           VARCHAR(30) NOT NULL DEFAULT 'manual'
                 -- ENUM: facebook_messenger, instagram_dm, manual, website, whatsapp
source_ref       VARCHAR(255)                    -- FB thread ID, post ID, etc.
-- Financial (all in paisa)
subtotal         INTEGER NOT NULL DEFAULT 0
discount_type    VARCHAR(20)                     -- 'flat', 'percent'
discount_value   INTEGER NOT NULL DEFAULT 0
discount_amount  INTEGER NOT NULL DEFAULT 0      -- computed
shipping_charge  INTEGER NOT NULL DEFAULT 0
total_amount     INTEGER NOT NULL DEFAULT 0      -- subtotal - discount + shipping
cod_amount       INTEGER NOT NULL DEFAULT 0      -- amount courier must collect (= total usually)
-- Courier & payment
payment_method   VARCHAR(30) NOT NULL DEFAULT 'cod'
                 -- ENUM: cod, bkash, nagad, rocket, bank_transfer, online
payment_status   VARCHAR(30) NOT NULL DEFAULT 'pending'
                 -- ENUM: pending, partial, paid, refunded
-- Shipping address (snapshot at order time, not FK to avoid drift)
shipping_name    VARCHAR(255) NOT NULL
shipping_phone   VARCHAR(20) NOT NULL
shipping_address TEXT NOT NULL
shipping_district VARCHAR(100) NOT NULL
shipping_upazila  VARCHAR(100)
-- Status
status           VARCHAR(30) NOT NULL DEFAULT 'pending'
                 -- ENUM: pending, confirmed, processing, ready_to_ship, shipped,
                 --       delivered, returned, cancelled, on_hold
priority         SMALLINT NOT NULL DEFAULT 0     -- 0=normal, 1=urgent
-- Internal
notes            TEXT                            -- visible to customer / staff
internal_notes   TEXT                            -- internal only
assigned_to      ULID FK → users.id NULL
-- Timestamps for each major status
confirmed_at     TIMESTAMP NULL
processing_at    TIMESTAMP NULL
shipped_at       TIMESTAMP NULL
delivered_at     TIMESTAMP NULL
returned_at      TIMESTAMP NULL
cancelled_at     TIMESTAMP NULL
cancelled_reason TEXT
created_at       TIMESTAMP
updated_at       TIMESTAMP
deleted_at       TIMESTAMP NULL

UNIQUE (tenant_id, order_number)
INDEX (tenant_id, status)
INDEX (tenant_id, customer_id)
INDEX (tenant_id, payment_status)
INDEX (tenant_id, created_at DESC)
INDEX (tenant_id, assigned_to)
INDEX (tenant_id, source)
-- Partial indexes for common filters (PostgreSQL)
CREATE INDEX idx_orders_pending ON orders (tenant_id, created_at) WHERE status = 'pending';
CREATE INDEX idx_orders_unpaid  ON orders (tenant_id, created_at) WHERE payment_status = 'pending' AND payment_method = 'cod';
```

> **Order Number Generation:** Use a per-tenant atomic sequence stored in a `tenant_sequences` table. Use `SELECT ... FOR UPDATE` or PostgreSQL sequences per tenant to guarantee no gaps and no duplicates under concurrent inserts.

---

#### `tenant_sequences`
Per-tenant auto-increment counters for order numbers.

```sql
tenant_id        ULID PK FK → tenants.id
order_sequence   BIGINT NOT NULL DEFAULT 0

-- On order creation: UPDATE tenant_sequences SET order_sequence = order_sequence + 1 WHERE tenant_id = ? RETURNING order_sequence
```

---

#### `order_items`
Line items snapshot. Always snapshot product name/price at order time — never join to products for historical orders.

```sql
id               BIGINT PK AUTO_INCREMENT
order_id         ULID FK → orders.id NOT NULL
tenant_id        ULID NOT NULL                   -- denormalized for bulk queries
product_id       ULID NULL                       -- FK but nullable (product may be deleted)
variant_id       ULID NULL
-- Snapshots (critical — product prices can change)
product_name     VARCHAR(255) NOT NULL
variant_name     VARCHAR(255)
sku              VARCHAR(100)
quantity         INTEGER NOT NULL DEFAULT 1
unit_price       INTEGER NOT NULL                -- paisa, selling price at order time
cost_price       INTEGER NOT NULL DEFAULT 0      -- paisa, COGS at order time
discount_amount  INTEGER NOT NULL DEFAULT 0      -- paisa, per-item discount
total_price      INTEGER NOT NULL                -- (unit_price * quantity) - discount
created_at       TIMESTAMP

INDEX (order_id)
INDEX (tenant_id, product_id)
CHECK (quantity > 0)
```

---

#### `order_status_history`
Immutable status change log.

```sql
id               BIGINT PK AUTO_INCREMENT
order_id         ULID FK → orders.id NOT NULL
tenant_id        ULID NOT NULL
from_status      VARCHAR(30)
to_status        VARCHAR(30) NOT NULL
note             TEXT
changed_by       ULID                            -- user_id or NULL (system)
changed_by_name  VARCHAR(255)                    -- snapshot
created_at       TIMESTAMP NOT NULL DEFAULT NOW()

INDEX (order_id)
INDEX (tenant_id, created_at DESC)
```

---

### 4.5 COURIER INTEGRATION

---

#### `courier_providers`
Master list of supported couriers (maintained by super-admin).

```sql
id               SMALLINT PK AUTO_INCREMENT
name             VARCHAR(100) NOT NULL           -- 'Pathao', 'RedX', 'Steadfast', 'Paperfly'
slug             VARCHAR(50) UNIQUE NOT NULL     -- 'pathao', 'redx', 'steadfast', 'paperfly'
logo_path        VARCHAR(500)
api_base_url     VARCHAR(500) NOT NULL
supports_partial_delivery BOOLEAN DEFAULT FALSE
supports_exchange BOOLEAN DEFAULT FALSE
cod_charge_type  VARCHAR(20)                     -- 'percent', 'flat'
cod_charge_value NUMERIC(5,2) DEFAULT 0
is_active        BOOLEAN NOT NULL DEFAULT TRUE
config_schema    JSONB NOT NULL DEFAULT '{}'     -- what fields each tenant must fill in
created_at       TIMESTAMP
updated_at       TIMESTAMP
```

---

#### `tenant_courier_accounts`
Per-tenant API credentials for each courier.

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
courier_provider_id SMALLINT FK → courier_providers.id NOT NULL
api_key          TEXT                            -- ENCRYPTED
api_secret       TEXT                            -- ENCRYPTED
store_id         VARCHAR(100)
merchant_id      VARCHAR(100)
default_pickup   JSONB                           -- {name, phone, address, district}
is_active        BOOLEAN NOT NULL DEFAULT TRUE
is_default       BOOLEAN NOT NULL DEFAULT FALSE
created_at       TIMESTAMP
updated_at       TIMESTAMP

UNIQUE (tenant_id, courier_provider_id)
INDEX (tenant_id, is_default)
```

---

#### `shipments`
One shipment per order (1:1 in most BD cases; designed to support 1:many if needed).

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
order_id         ULID FK → orders.id NOT NULL
courier_provider_id SMALLINT FK → courier_providers.id NOT NULL
-- Courier-assigned
tracking_number  VARCHAR(100)
courier_order_id VARCHAR(100)                    -- courier's internal ID
-- Status
status           VARCHAR(40) NOT NULL DEFAULT 'created'
                 -- ENUM: created, pickup_requested, picked_up, in_transit,
                 --       out_for_delivery, delivered, delivery_failed, returned, cancelled
-- Financials (paisa)
declared_value   INTEGER NOT NULL DEFAULT 0
cod_amount       INTEGER NOT NULL DEFAULT 0
courier_charge   INTEGER NOT NULL DEFAULT 0
-- Addresses (snapshot)
pickup_address   JSONB NOT NULL
delivery_address JSONB NOT NULL
weight_gram      INTEGER
-- Metadata
dispatched_at    TIMESTAMP NULL
picked_up_at     TIMESTAMP NULL
delivered_at     TIMESTAMP NULL
returned_at      TIMESTAMP NULL
delivery_attempts SMALLINT NOT NULL DEFAULT 0
raw_response     JSONB                           -- full courier API response
created_at       TIMESTAMP
updated_at       TIMESTAMP

UNIQUE (tenant_id, tracking_number)
INDEX (tenant_id, order_id)
INDEX (tenant_id, status)
INDEX (tenant_id, courier_provider_id, status)
```

---

#### `shipment_events`
Tracking history from courier webhooks / polling.

```sql
id               BIGINT PK AUTO_INCREMENT
shipment_id      ULID FK → shipments.id NOT NULL
status           VARCHAR(40) NOT NULL
location         VARCHAR(255)
description      TEXT
event_at         TIMESTAMP NOT NULL
raw_data         JSONB
created_at       TIMESTAMP NOT NULL DEFAULT NOW()

INDEX (shipment_id, event_at DESC)
```

---

### 4.6 PAYMENT & ACCOUNTING

---

#### `transactions`
Every money movement is a transaction. Append-only ledger.

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
order_id         ULID FK → orders.id NULL
type             VARCHAR(40) NOT NULL
                 -- ENUM: sale, cod_collection, cod_refund, shipping_fee,
                 --       return_deduction, adjustment, expense, ad_spend
direction        CHAR(2) NOT NULL                -- 'in', 'out'
amount           INTEGER NOT NULL                -- paisa, always positive
payment_method   VARCHAR(30)                     -- bkash, nagad, rocket, bank, cash, card
gateway_txn_id   VARCHAR(255)                    -- bKash/Nagad transaction ID
reference_type   VARCHAR(50)
reference_id     VARCHAR(26)
note             TEXT
transaction_date DATE NOT NULL                   -- business date (not necessarily created_at)
created_by       ULID
created_at       TIMESTAMP NOT NULL DEFAULT NOW()

INDEX (tenant_id, type)
INDEX (tenant_id, transaction_date)
INDEX (tenant_id, order_id)
INDEX (tenant_id, direction, transaction_date)  -- for P&L reports
```

> **Accounting rule:** Revenue = all `type='sale', direction='in'`. COD collected = `type='cod_collection', direction='in'`. Never update transactions, only insert corrections.

---

#### `expenses`
Track business costs (ad spend, office, packaging, etc.).

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
category         VARCHAR(100) NOT NULL           -- 'ads', 'packaging', 'salary', 'courier', 'other'
description      TEXT
amount           INTEGER NOT NULL                -- paisa
payment_method   VARCHAR(30)
expense_date     DATE NOT NULL
receipt_path     VARCHAR(500)                    -- uploaded receipt image
created_by       ULID NOT NULL
created_at       TIMESTAMP
updated_at       TIMESTAMP

INDEX (tenant_id, category, expense_date)
INDEX (tenant_id, expense_date)
```

---

### 4.7 SOCIAL CHANNEL MANAGEMENT

---

#### `social_accounts`
Connected FB pages and IG accounts per tenant.

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
platform         VARCHAR(20) NOT NULL            -- ENUM: facebook, instagram
platform_id      VARCHAR(100) NOT NULL           -- FB Page ID or IG Business Account ID
name             VARCHAR(255) NOT NULL           -- page/account name
username         VARCHAR(100)
avatar_url       VARCHAR(500)
access_token     TEXT NOT NULL                   -- ENCRYPTED, page-level token
token_expires_at TIMESTAMP NULL                  -- NULL = never (long-lived)
webhook_verified BOOLEAN NOT NULL DEFAULT FALSE
subscribed_fields JSONB NOT NULL DEFAULT '[]'    -- ['messages','messaging_postbacks','feed']
is_active        BOOLEAN NOT NULL DEFAULT TRUE
created_at       TIMESTAMP
updated_at       TIMESTAMP

UNIQUE (tenant_id, platform, platform_id)
INDEX (tenant_id, platform)
INDEX (platform, platform_id)               -- for webhook routing (no tenant filter here)
```

---

#### `social_conversations`
Each unique customer thread (inbox). One conversation per customer per social account.

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
social_account_id ULID FK → social_accounts.id NOT NULL
platform_thread_id VARCHAR(255) NOT NULL         -- FB thread ID, IG conversation ID
customer_id      ULID FK → customers.id NULL     -- matched/linked customer
sender_platform_id VARCHAR(100) NOT NULL         -- sender's FB/IG profile ID
sender_name      VARCHAR(255)
sender_avatar    VARCHAR(500)
status           VARCHAR(20) NOT NULL DEFAULT 'open'
                 -- ENUM: open, converted, closed, spam
order_id         ULID FK → orders.id NULL        -- linked order if converted
last_message_at  TIMESTAMP
last_message_preview VARCHAR(500)
unread_count     SMALLINT NOT NULL DEFAULT 0
is_archived      BOOLEAN NOT NULL DEFAULT FALSE
created_at       TIMESTAMP
updated_at       TIMESTAMP

UNIQUE (social_account_id, platform_thread_id)
INDEX (tenant_id, status, last_message_at DESC)
INDEX (tenant_id, customer_id)
```

---

#### `social_messages`
All messages in a conversation. Append-only.

```sql
id               ULID PK
tenant_id        ULID NOT NULL
conversation_id  ULID FK → social_conversations.id NOT NULL
platform_message_id VARCHAR(255) NOT NULL UNIQUE  -- idempotency (webhook dedup)
direction        VARCHAR(10) NOT NULL             -- ENUM: inbound, outbound
message_type     VARCHAR(20) NOT NULL DEFAULT 'text'
                 -- ENUM: text, image, sticker, attachment, template, unsupported
content          TEXT
attachments      JSONB NOT NULL DEFAULT '[]'      -- [{type, url, mime_type}]
is_read          BOOLEAN NOT NULL DEFAULT FALSE
sent_by          ULID NULL                        -- user_id if outbound
sent_at          TIMESTAMP NOT NULL
created_at       TIMESTAMP NOT NULL DEFAULT NOW()

INDEX (conversation_id, sent_at DESC)
INDEX (tenant_id, created_at DESC)
INDEX (platform_message_id)                     -- dedup check
```

---

### 4.8 AUTOMATION ENGINE

---

#### `automation_rules`
Keyword auto-replies, order triggers, customer tagging.

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
name             VARCHAR(255) NOT NULL
description      TEXT
trigger_event    VARCHAR(50) NOT NULL
                 -- ENUM: keyword_match, new_message, order_created, order_status_changed,
                 --       customer_tagged, cod_refused, low_stock
conditions       JSONB NOT NULL DEFAULT '[]'
                 -- [{field, operator, value}] — evaluated with AND/OR logic
                 -- Example: [{field:'message.text', op:'contains', val:'price'}]
actions          JSONB NOT NULL DEFAULT '[]'
                 -- [{type:'send_message', payload:{...}},
                 --  {type:'create_order', payload:{...}},
                 --  {type:'tag_customer', payload:{tags:[...]}}]
is_active        BOOLEAN NOT NULL DEFAULT TRUE
priority         SMALLINT NOT NULL DEFAULT 0     -- lower number = higher priority
run_count        INTEGER NOT NULL DEFAULT 0      -- total executions
last_run_at      TIMESTAMP NULL
created_at       TIMESTAMP
updated_at       TIMESTAMP

INDEX (tenant_id, is_active, priority)
INDEX (tenant_id, trigger_event, is_active)
```

---

#### `automation_logs`
Audit trail for automation executions.

```sql
id               BIGINT PK AUTO_INCREMENT
tenant_id        ULID NOT NULL
rule_id          ULID FK → automation_rules.id NOT NULL
trigger_ref_type VARCHAR(50)                     -- 'social_message', 'order'
trigger_ref_id   VARCHAR(26)
result           VARCHAR(20) NOT NULL            -- ENUM: success, failed, skipped
actions_taken    JSONB NOT NULL DEFAULT '[]'
error_message    TEXT
created_at       TIMESTAMP NOT NULL DEFAULT NOW()

INDEX (rule_id, created_at DESC)
INDEX (tenant_id, created_at DESC)
```

---

### 4.9 COURIER GATEWAY INTEGRATIONS

---

#### `payment_gateways`
Master list (super-admin controlled).

```sql
id               SMALLINT PK AUTO_INCREMENT
name             VARCHAR(100) NOT NULL           -- 'ePay', 'OnePay', 'SSLCommerz'
slug             VARCHAR(50) UNIQUE NOT NULL
supported_methods JSONB NOT NULL DEFAULT '[]'   -- ['bkash','nagad','rocket','card']
api_base_url     VARCHAR(500)
sandbox_url      VARCHAR(500)
is_active        BOOLEAN NOT NULL DEFAULT TRUE
config_schema    JSONB NOT NULL DEFAULT '{}'
created_at       TIMESTAMP
updated_at       TIMESTAMP
```

---

#### `tenant_payment_gateways`
Per-tenant payment gateway config.

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
payment_gateway_id SMALLINT FK → payment_gateways.id NOT NULL
store_id         VARCHAR(255)                    -- ENCRYPTED
api_key          TEXT                            -- ENCRYPTED
api_secret       TEXT                            -- ENCRYPTED
is_sandbox       BOOLEAN NOT NULL DEFAULT FALSE
is_active        BOOLEAN NOT NULL DEFAULT TRUE
is_default       BOOLEAN NOT NULL DEFAULT FALSE
created_at       TIMESTAMP
updated_at       TIMESTAMP

UNIQUE (tenant_id, payment_gateway_id)
```

---

### 4.10 NOTIFICATIONS & AUDIT

---

#### `notifications`
In-app notification center.

```sql
id               ULID PK
tenant_id        ULID FK → tenants.id NOT NULL
user_id          ULID FK → users.id NOT NULL
type             VARCHAR(100) NOT NULL           -- e.g., 'new_order', 'low_stock', 'cod_refused'
title            VARCHAR(255) NOT NULL
body             TEXT
action_url       VARCHAR(500)
data             JSONB NOT NULL DEFAULT '{}'
read_at          TIMESTAMP NULL
created_at       TIMESTAMP

INDEX (tenant_id, user_id, read_at)   -- unread notifications
INDEX (tenant_id, created_at DESC)
-- Partial index for unread
CREATE INDEX idx_notifications_unread ON notifications (tenant_id, user_id, created_at) WHERE read_at IS NULL;
```

---

#### `audit_logs`
Immutable record of all significant actions.

```sql
id               BIGINT PK AUTO_INCREMENT
tenant_id        ULID NOT NULL
user_id          ULID NULL                       -- NULL = system action
user_name        VARCHAR(255)                    -- snapshot
action           VARCHAR(100) NOT NULL           -- 'order.created', 'product.updated', etc.
model_type       VARCHAR(100)                    -- 'Order', 'Product', 'Customer'
model_id         VARCHAR(26)
old_values       JSONB                           -- before state
new_values       JSONB                           -- after state
ip_address       INET
user_agent       VARCHAR(500)
created_at       TIMESTAMP NOT NULL DEFAULT NOW()

INDEX (tenant_id, model_type, model_id)
INDEX (tenant_id, user_id, created_at DESC)
INDEX (tenant_id, created_at DESC)
```

---

#### `webhook_logs`
All incoming webhooks (FB, courier, payment gateway).

```sql
id               BIGINT PK AUTO_INCREMENT
source           VARCHAR(50) NOT NULL            -- 'facebook', 'pathao', 'bkash'
event_type       VARCHAR(100)
payload          JSONB NOT NULL
headers          JSONB
status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                 -- ENUM: pending, processed, failed, ignored
tenant_id        ULID NULL                       -- resolved after processing
error_message    TEXT
processed_at     TIMESTAMP NULL
created_at       TIMESTAMP NOT NULL DEFAULT NOW()

INDEX (source, status, created_at)
INDEX (tenant_id, source, created_at DESC)
-- Partial index for unprocessed
CREATE INDEX idx_webhooks_pending ON webhook_logs (source, created_at) WHERE status = 'pending';
```

> **Webhook Idempotency:** Check `platform_message_id` in `social_messages` before inserting. Check `tracking_number + status` in shipment_events before inserting. All webhook processing is idempotent.

---

## 5. CACHING STRATEGY (Redis)

| Cache Key Pattern | TTL | Content |
|---|---|---|
| `tenant:{id}:settings` | 60 min | Tenant config/settings JSON |
| `tenant:{id}:plan` | 60 min | Active plan features |
| `tenant:{id}:dashboard` | 5 min | Dashboard metric counts |
| `tenant:{id}:product:{id}:stock` | 30 sec | Inventory count (invalidated on movement) |
| `tenant:{id}:couriers` | 60 min | Active courier accounts |
| `order_number:lock:{tenant_id}` | 5 sec | Distributed lock for order number generation |
| `webhook:dedup:{platform_message_id}` | 24h | Deduplication key for webhooks |

### Cache Invalidation Rules
- Invalidate product stock cache on every `stock_movements` insert
- Invalidate dashboard cache on every order status change
- Invalidate tenant settings cache on tenant update

---

## 6. QUEUE ARCHITECTURE (Laravel Horizon + Redis)

### Queue Definitions

| Queue Name | Priority | Purpose |
|---|---|---|
| `critical` | Highest | Order confirmation, stock reservation |
| `couriers` | High | Courier API dispatch, tracking sync |
| `webhooks` | High | Incoming FB/courier/payment webhooks |
| `notifications` | Medium | Push, in-app, SMS notifications |
| `analytics` | Low | CAPI events, report generation |
| `reports` | Lowest | CSV exports, scheduled reports |

### Key Jobs

```
ProcessIncomingWebhook     → webhooks queue (parses FB/courier/payment payloads)
ReserveInventoryJob        → critical queue (atomic stock reservation on order confirm)
DispatchToCourierJob       → couriers queue (calls Pathao/RedX/Steadfast API)
SyncCourierTrackingJob     → couriers queue (polling for tracking updates)
MatchConversationCustomer  → webhooks queue (link FB sender to existing customer)
SendFacebookMessage        → notifications queue (auto-reply)
SendMetaCapiEvent          → analytics queue (FB Conversion API)
GenerateDailyReport        → reports queue
UpdateCustomerMetrics      → analytics queue (recalculates COD rate, risk score)
```

### Failed Job Handling
- All jobs implement `ShouldQueue` and `InteractsWithQueue`
- Max attempts: `critical=3`, `couriers=5`, `webhooks=3`
- `backoff: [10, 30, 60]` seconds (exponential backoff)
- Failed jobs stored in `failed_jobs` table + alert sent to owner

---

## 7. MODULE STRUCTURE (Laravel)

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Orders/
│   │   ├── Products/
│   │   ├── Customers/
│   │   ├── Couriers/
│   │   ├── Social/
│   │   ├── Automation/
│   │   ├── Accounting/
│   │   └── Settings/
│   ├── Middleware/
│   │   ├── ResolveTenant.php
│   │   ├── EnsureTenantActive.php
│   │   └── CheckPlanLimit.php
│   └── Requests/         ← Form Request validation per action
│
├── Models/
│   ├── Concerns/
│   │   ├── BelongsToTenant.php   ← trait with global scope + auto-inject tenant_id
│   │   └── HasAuditLog.php       ← trait to log model changes
│   ├── Tenant.php
│   ├── User.php
│   ├── Order.php
│   ├── OrderItem.php
│   ├── Product.php
│   ├── Customer.php
│   ├── Shipment.php
│   ├── Inventory.php
│   └── ...
│
├── Services/             ← Business logic layer (no business logic in controllers)
│   ├── OrderService.php          ← createOrder(), confirmOrder(), cancelOrder()
│   ├── InventoryService.php      ← reserve(), release(), deduct(), adjust()
│   ├── CourierService.php        ← dispatch(), track(), cancel()
│   ├── CustomerService.php       ← findOrCreate(), updateMetrics(), assessRisk()
│   ├── AutomationService.php     ← evaluate(), execute()
│   └── Couriers/
│       ├── Contracts/
│       │   └── CourierDriver.php  ← interface: createOrder(), cancelOrder(), track()
│       ├── PathaoDriver.php
│       ├── RedXDriver.php
│       ├── SteadfastDriver.php
│       └── PaperFlyDriver.php
│
├── Jobs/
├── DTOs/
├── Events/
├── Listeners/
├── Observers/            ← Model observers for audit logs, cache invalidation
├── Policies/             ← Authorization (one Policy per model)
└── Enums/                ← PHP 8.1+ Backed Enums for all ENUM columns
    ├── OrderStatus.php
    ├── PaymentStatus.php
    ├── ShipmentStatus.php
    └── ...
```

---

## 8. API DESIGN STANDARDS

### Routes
- All tenant API routes under: `/api/v1/{resource}`
- Inertia routes (HTML responses) under: `/{resource}`
- Webhook endpoints: `/webhooks/{platform}` (no auth middleware, signature verification only)
- Super-admin: `/admin/` prefix with separate middleware

### Response Format (API)
```json
{
  "success": true,
  "data": {},
  "message": "Order created successfully",
  "meta": { "page": 1, "per_page": 20, "total": 150 }
}
```

### Rate Limiting
- Auth endpoints: 10 req/min per IP
- Tenant API: 300 req/min per tenant
- Webhook endpoints: unlimited (verified by signature)
- Use Laravel's `RateLimiter` in `RouteServiceProvider`

---

## 9. BUSINESS LOGIC RULES (Critical for Copilot)

### Order Flow State Machine
```
pending → confirmed → processing → ready_to_ship → shipped → delivered
                                                           ↘ returned
pending → cancelled (only from pending/confirmed)
shipped → returned
delivered → returned (within X days)
```
- State transitions must go through `OrderService::transition($order, $newStatus)`
- Every transition records in `order_status_history`
- Every transition fires an `OrderStatusChanged` event
- Reserved stock is released on `cancelled` and `returned`

### Inventory Reservation Rules
```
Order confirmed     → Reserve stock (quantity_reserved += qty)
Order cancelled     → Release stock (quantity_reserved -= qty)
Order shipped       → Deduct stock (quantity_on_hand -= qty, quantity_reserved -= qty)
Order returned      → Restore stock (quantity_on_hand += qty)
```
- All inventory mutations go through `InventoryService`
- Use `DB::transaction()` wrapping `SELECT FOR UPDATE` to prevent race conditions
- Log every mutation in `stock_movements`

### COD Risk Scoring
```php
// Risk score calculation (run via UpdateCustomerMetrics job)
$refusalRate = $customer->cod_refused / max(1, $customer->cod_attempted);
$riskScore = round($refusalRate * 100);
if ($customer->is_blacklisted) $riskScore = 100;
```
- Risk score updates asynchronously via queue after each delivery/refusal event
- Orders from high-risk customers (score > 70) trigger a warning flag on the order
- Blacklisted customers block new order creation (application-level check)

### Customer Matching (FB/Insta → Customer record)
```
Incoming FB message → lookup by fb_psid
→ Found: link conversation to customer
→ Not found: lookup by phone (if extracted from message)
  → Found: update fb_psid on customer
  → Not found: create new customer (name from FB profile, phone = null until collected)
```

### Order Number Generation
```php
// In OrderService::generateOrderNumber($tenantId)
DB::transaction(function () use ($tenantId) {
    $seq = DB::table('tenant_sequences')
        ->where('tenant_id', $tenantId)
        ->lockForUpdate()
        ->first();
    DB::table('tenant_sequences')
        ->where('tenant_id', $tenantId)
        ->update(['order_sequence' => $seq->order_sequence + 1]);
    return 'ORD-' . date('Y') . '-' . str_pad($seq->order_sequence + 1, 6, '0', STR_PAD_LEFT);
});
```

---

## 10. CODING STANDARDS FOR COPILOT

### Laravel Conventions
- Use **Form Requests** for all validation — no validation in controllers
- Use **API Resources** for all JSON transformations
- Use **Service classes** for all business logic — controllers only call services
- Use **Observers** for model lifecycle hooks (audit log, cache bust, metrics update)
- Use **Events + Listeners** for cross-module communication (avoid coupling)
- Use **Policies** for authorization — never check `$user->role === 'admin'` in controllers
- Use **Enums** (PHP 8.1 backed) for all status/type columns — never raw strings
- Use **DB::transaction()** for any operation that touches multiple tables
- Never use `$model->save()` in loops — use `upsert()` or `insert()` for bulk ops

### Inertia.js Conventions
- Share tenant/user data globally via `HandleInertiaRequests` middleware
- Pass only what the page needs (avoid over-fetching — use `->only()`)
- Use `Inertia::lazy()` for deferred data loads (heavy reports, analytics)
- Client-side navigation only — no full page reloads
- Form submissions via `useForm()` composable — never raw axios in components

### Security Rules
- All API keys/tokens in DB must use `encrypted` cast
- All webhook payloads must verify signature before processing
- All file uploads must validate mime type server-side (not just extension)
- All money amounts must be validated as positive integers
- Use `$table->morphs()` carefully — always add index when using polymorphic relations
- Scope every query to `tenant_id` — the global scope handles it, but always verify in complex raw queries

### Migration Rules
- Every migration must have a `down()` that cleanly reverses the `up()`
- Never add business logic to migrations
- Add indexes in separate migrations if the table is already large
- Always use `nullable()` when adding columns to existing tables

---

## 11. ENVIRONMENT VARIABLES (`.env` reference)

```env
# App
APP_NAME=SocialERP
APP_KEY=
APP_URL=https://app.socialerp.com.bd
APP_TIMEZONE=Asia/Dhaka

# Database
DB_CONNECTION=pgsql
DB_HOST=
DB_PORT=5432
DB_DATABASE=socialerp
DB_USERNAME=
DB_PASSWORD=

# Redis
REDIS_HOST=
REDIS_PORT=6379
REDIS_PASSWORD=

# Queue
QUEUE_CONNECTION=redis
HORIZON_BALANCE_STRATEGY=auto

# Broadcasting (Reverb WebSocket)
BROADCAST_DRIVER=reverb
REVERB_APP_ID=
REVERB_APP_KEY=
REVERB_APP_SECRET=

# Storage
FILESYSTEM_DISK=s3
AWS_BUCKET=socialerp-assets
AWS_ENDPOINT=           # Cloudflare R2 endpoint

# Meta (Facebook & Instagram)
META_APP_ID=
META_APP_SECRET=
META_VERIFY_TOKEN=

# Meilisearch
MEILISEARCH_HOST=
MEILISEARCH_KEY=

# Mail
MAIL_MAILER=smtp

# Encryption (for sensitive DB fields)
# Uses APP_KEY automatically via Laravel's encrypt()/decrypt()
```

---

## 12. PERFORMANCE CHECKLIST

- [ ] All `tenant_id` columns indexed (composite with commonly filtered column)
- [ ] Partial indexes created for status filters in PostgreSQL
- [ ] All money stored as integer (paisa), never float
- [ ] Inventory updates use `SELECT FOR UPDATE` in transactions
- [ ] Courier API calls dispatched to queue (never synchronous in request lifecycle)
- [ ] Webhook processing always idempotent (dedup keys in Redis or DB UNIQUE constraint)
- [ ] Dashboard metrics use Redis cache (never live DB count on every page load)
- [ ] Heavy reports use `chunk()` or `cursor()` — never `get()` on large datasets
- [ ] All sensitive fields use Laravel `encrypted` cast
- [ ] Horizon monitors and auto-restarts queues
- [ ] `order_status_history` and `stock_movements` never updated, only inserted
- [ ] JSONB fields have only non-queryable data (filter-needed values get their own columns)
- [ ] Customer phone has UNIQUE constraint per tenant
- [ ] `platform_message_id` in social_messages has UNIQUE constraint (webhook dedup)

---

*This document is the single source of truth for system and database design. All implementation decisions must align with this plan. If a new requirement arises, update this document first.*