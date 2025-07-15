# Database Schema Documentation

## Cloudflare D1 Database: nearme-db
**Database ID:** 86879c31-0686-4532-a66c-f310b89d7a27

## Tables Overview

### 1. businesses
**Purpose:** Main business listings table
```sql
CREATE TABLE "businesses" (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
  business_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  category TEXT,
  services TEXT,
  hours TEXT,
  rating REAL DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  image_url TEXT,
  logo_url TEXT,
  established INTEGER,
  verified INTEGER DEFAULT 0,
  premium INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  site_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  latitude REAL,
  longitude REAL
)
```

### 2. services
**Purpose:** Service categories and types
```sql
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  service TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
)
```

### 3. cities
**Purpose:** City listings
```sql
CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  state TEXT,
  display_name TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
)
```

### 4. neighborhoods
**Purpose:** Neighborhood data by city
```sql
CREATE TABLE neighborhoods (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  neighborhood_name TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
)
```

### 5. business_submissions
**Purpose:** New business submission forms
```sql
CREATE TABLE business_submissions (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  category TEXT NOT NULL,
  website TEXT,
  description TEXT,
  services TEXT, -- JSON array as TEXT
  hours TEXT, -- JSON object as TEXT
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  submitted_at TEXT DEFAULT (datetime('now')),
  reviewed_at TEXT,
  reviewer_notes TEXT,
  site_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
)
```

### 6. business_profiles
**Purpose:** Business owner profiles and subscriptions
```sql
CREATE TABLE business_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  business_id TEXT,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  category TEXT,
  website TEXT,
  description TEXT,
  services TEXT, -- JSON array as TEXT
  hours TEXT, -- JSON object as TEXT
  role TEXT DEFAULT 'owner',
  subscription_status TEXT DEFAULT 'not_started',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  premium INTEGER DEFAULT 0, -- 0 = false, 1 = true
  subscription_start_date TEXT,
  subscription_end_date TEXT,
  trial_end_date TEXT,
  site_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
)
```

### 7. contact_messages
**Purpose:** Contact form submissions
```sql
CREATE TABLE contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT,
  city TEXT,
  status TEXT DEFAULT 'new',
  admin_notes TEXT,
  resolved_at TEXT,
  resolved_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
)
```

### 8. user_engagement_events
**Purpose:** Analytics and engagement tracking
```sql
CREATE TABLE user_engagement_events (
  id TEXT PRIMARY KEY,
  business_id TEXT,
  event_type TEXT NOT NULL,
  event_data TEXT, -- JSON object as TEXT
  timestamp TEXT DEFAULT (datetime('now')),
  user_agent TEXT,
  ip_address TEXT,
  session_id TEXT
)
```

### 9. admin_settings
**Purpose:** Application configuration
```sql
CREATE TABLE admin_settings (
  id TEXT PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL, -- JSON as TEXT
  description TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
)
```

### 10. stripe_orders
**Purpose:** Payment processing
```sql
CREATE TABLE stripe_orders (
  id TEXT PRIMARY KEY,
  business_profile_id TEXT,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending',
  metadata TEXT, -- JSON as TEXT
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
)
```

### 11. d1_migrations
**Purpose:** Database migration tracking
```sql
CREATE TABLE d1_migrations(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
)
```

## Key Notes
- All tables use TEXT PRIMARY KEY with UUID generation
- JSON data is stored as TEXT in columns like `services` and `hours`
- Timestamps use SQLite `datetime('now')` function
- Database migrated from Supabase to Cloudflare D1
- Currently supports categories: nail-salons, auto-repair (streamlined from original set)

## API Endpoints Using These Tables
- `/api/services` - queries `services` table
- `/api/businesses` - queries `businesses` table
- `/api/cities` - queries `cities` table
- `/api/neighborhoods` - queries `neighborhoods` table

## Last Updated
July 14, 2025 - Schema exported and documented
