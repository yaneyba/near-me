# Near-Me Platform Database Entities

This document provides a comprehensive overview of all database entities and their relationships in the Near-Me platform, based on the current production database schema.

## 📊 Database Overview

**Database**: `nearme-db` (Cloudflare D1)  
**Tables**: 10 core tables  
**Indexes**: 15 performance indexes  
**Current Records**: 59 businesses, 15 submissions, 1 business profile  

---

## 🏢 Core Business Entities

### 1. **businesses** (Primary Entity)
The main table storing all business listings across all categories and cities.

```sql
CREATE TABLE businesses (
    id TEXT PRIMARY KEY,                    -- Primary key (e.g., "auto-repair-denver-03")
    business_id TEXT UNIQUE,                -- Unique business identifier
    name TEXT NOT NULL,                     -- Business name
    description TEXT,                       -- Business description
    address TEXT,                           -- Full street address
    city TEXT,                              -- City slug (e.g., "san-francisco")
    state TEXT,                             -- State name
    zip_code TEXT,                          -- ZIP/postal code
    phone TEXT,                             -- Contact phone number
    email TEXT,                             -- Business email
    website TEXT,                           -- Business website URL
    category TEXT,                          -- Business category (e.g., "nail-salons")
    services TEXT,                          -- JSON array of services offered
    hours TEXT,                             -- JSON object of operating hours
    rating REAL DEFAULT 0.0,                -- Average rating (0.0-5.0)
    review_count INTEGER DEFAULT 0,         -- Number of reviews
    image TEXT,                             -- Primary image path/URL
    logo_url TEXT,                          -- Business logo URL
    established INTEGER,                    -- Year established
    verified INTEGER DEFAULT 0,            -- Verification status (0/1)
    premium INTEGER DEFAULT 0,             -- Premium listing status (0/1)
    status TEXT DEFAULT 'active',          -- Business status
    site_id TEXT,                          -- Site/subdomain identifier
    latitude REAL,                         -- GPS latitude
    longitude REAL,                        -- GPS longitude
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
```

**Indexes:**
- `idx_businesses_business_id` - Fast lookups by business_id
- `idx_businesses_category` - Category filtering
- `idx_businesses_site_id` - Site-specific queries
- `idx_businesses_status` - Active/inactive filtering

**Sample Data Structure:**
```json
{
  "id": "auto-repair-denver-03",
  "business_id": "auto-repair-denver-03",
  "name": "Mountain View Auto",
  "category": "auto-repair",
  "city": "denver",
  "services": ["General Repairs", "Preventive Maintenance", "Brake Service"],
  "hours": {
    "Monday": "7:30 AM - 5:30 PM",
    "Tuesday": "7:30 AM - 5:30 PM",
    "Wednesday": "7:30 AM - 5:30 PM",
    "Thursday": "7:30 AM - 5:30 PM",
    "Friday": "7:30 AM - 5:30 PM",
    "Saturday": "8:00 AM - 2:00 PM",
    "Sunday": "Closed"
  },
  "rating": 4.8,
  "verified": 0,
  "premium": 0
}
```

### 2. **business_submissions**
Stores new business submissions from the public submission form.

```sql
CREATE TABLE business_submissions (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,            -- Name of the business
    owner_name TEXT NOT NULL,               -- Business owner's name
    email TEXT NOT NULL,                    -- Contact email
    phone TEXT NOT NULL,                    -- Contact phone
    address TEXT NOT NULL,                  -- Business address
    city TEXT NOT NULL,                     -- City
    state TEXT NOT NULL,                    -- State
    zip_code TEXT NOT NULL,                 -- ZIP code
    category TEXT NOT NULL,                 -- Business category
    website TEXT,                           -- Website (optional)
    description TEXT,                       -- Business description
    services TEXT,                          -- JSON array of services
    hours TEXT,                             -- JSON object of hours
    status TEXT DEFAULT 'pending',         -- 'pending', 'approved', 'rejected'
    submitted_at TEXT DEFAULT (datetime('now')),
    reviewed_at TEXT,                       -- When admin reviewed
    reviewer_notes TEXT,                    -- Admin notes
    site_id TEXT NOT NULL,                  -- Originating site
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
```

**Indexes:**
- `idx_business_submissions_status` - Filter by approval status
- `idx_business_submissions_site_id` - Site-specific submissions
- `idx_business_submissions_email` - Contact lookups

### 3. **business_profiles**
Business owner dashboard profiles for managing listings.

```sql
CREATE TABLE business_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT,                           -- Associated user account
    business_id TEXT,                       -- Reference to businesses table
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
    services TEXT,                          -- JSON array
    hours TEXT,                             -- JSON object
    role TEXT DEFAULT 'owner',              -- User role
    subscription_status TEXT DEFAULT 'not_started',
    stripe_customer_id TEXT,                -- Stripe integration
    stripe_subscription_id TEXT,
    stripe_price_id TEXT,
    premium INTEGER DEFAULT 0,             -- Premium status
    subscription_start_date TEXT,
    subscription_end_date TEXT,
    trial_end_date TEXT,
    site_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
```

**Indexes:**
- `idx_business_profiles_user_id` - User account lookups
- `idx_business_profiles_site_id` - Site filtering
- `idx_business_profiles_email` - Email lookups

---

## 📧 Communication Entities

### 4. **contact_messages**
Customer inquiries and contact form submissions.

```sql
CREATE TABLE contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,                     -- Customer name
    email TEXT NOT NULL,                    -- Customer email
    subject TEXT NOT NULL,                  -- Message subject
    message TEXT NOT NULL,                  -- Message content
    category TEXT,                          -- Related category (optional)
    city TEXT,                              -- Related city (optional)
    status TEXT DEFAULT 'new',             -- 'new', 'in_progress', 'resolved'
    admin_notes TEXT,                       -- Internal admin notes
    resolved_at TEXT,                       -- Resolution timestamp
    resolved_by TEXT,                       -- Admin who resolved
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
```

**Indexes:**
- `idx_contact_messages_status` - Filter by status
- `idx_contact_messages_created_at` - Chronological sorting

---

## 📊 Analytics & Tracking Entities

### 5. **user_engagement_events**
Tracks user interactions with businesses for analytics.

```sql
CREATE TABLE user_engagement_events (
    id TEXT PRIMARY KEY,
    business_id TEXT,                       -- Reference to businesses table
    event_type TEXT NOT NULL,              -- 'view', 'click', 'call', 'website', 'directions'
    event_data TEXT,                        -- JSON object with additional data
    timestamp TEXT DEFAULT (datetime('now')),
    user_agent TEXT,                        -- Browser/device info
    ip_address TEXT,                        -- User IP (anonymized)
    session_id TEXT                         -- Session identifier
);
```

**Indexes:**
- `idx_user_engagement_events_business_id` - Business-specific analytics
- `idx_user_engagement_events_timestamp` - Time-based queries

---

## 💰 Payment & Subscription Entities

### 6. **stripe_orders**
Stripe payment processing records.

```sql
CREATE TABLE stripe_orders (
    id TEXT PRIMARY KEY,
    business_profile_id TEXT,               -- Reference to business_profiles
    stripe_session_id TEXT UNIQUE NOT NULL, -- Stripe checkout session
    stripe_payment_intent_id TEXT,          -- Stripe payment intent
    amount INTEGER NOT NULL,                -- Amount in cents
    currency TEXT DEFAULT 'usd',           -- Currency code
    status TEXT DEFAULT 'pending',         -- Payment status
    metadata TEXT,                          -- JSON metadata
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
```

---

## ⚙️ Configuration Entities

### 7. **admin_settings**
System-wide configuration settings.

```sql
CREATE TABLE admin_settings (
    id TEXT PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,      -- Setting identifier
    setting_value TEXT NOT NULL,           -- JSON value
    description TEXT,                       -- Setting description
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
```

**Indexes:**
- `idx_admin_settings_key` - Fast setting lookups

---

## 🗺️ Location Entities

### 8. **neighborhoods**
City neighborhood data for location filtering.

```sql
CREATE TABLE neighborhoods (
    id TEXT PRIMARY KEY,
    city TEXT NOT NULL,                     -- City identifier
    neighborhood_name TEXT NOT NULL,        -- Neighborhood name
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
```

### 9. **services**
Master list of services by category.

```sql
CREATE TABLE services (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,                 -- Business category
    service TEXT NOT NULL,                  -- Service name
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);
```

---

## 🔐 System Tables

### 10. **_cf_KV**
Cloudflare internal key-value storage (system table).

```sql
CREATE TABLE _cf_KV (
    key TEXT PRIMARY KEY,
    value BLOB
) WITHOUT ROWID;
```

---

## 🔗 Entity Relationships

### Primary Relationships
```
businesses (1) ←→ (1) business_profiles
    ↓
user_engagement_events (many)
    ↓
analytics aggregation

business_submissions → approval → businesses

business_profiles (1) ←→ (many) stripe_orders

neighborhoods (many) → (1) city
services (many) → (1) category
```

### Foreign Key Relationships
- `business_profiles.business_id` → `businesses.business_id`
- `user_engagement_events.business_id` → `businesses.business_id`
- `stripe_orders.business_profile_id` → `business_profiles.id`
- `neighborhoods.city` → city identifier
- `services.category` → category identifier

---

## 📋 Data Types & Constraints

### JSON Fields
All JSON fields are stored as TEXT with application-level parsing:
- `businesses.services` - Array of service strings
- `businesses.hours` - Object with day/time mappings
- `business_submissions.services` - Array of service strings
- `business_submissions.hours` - Object with day/time mappings
- `business_profiles.services` - Array of service strings
- `business_profiles.hours` - Object with day/time mappings
- `user_engagement_events.event_data` - Event metadata object
- `admin_settings.setting_value` - Configuration value object
- `stripe_orders.metadata` - Payment metadata object

### Boolean Fields (INTEGER 0/1)
- `businesses.verified` - Business verification status
- `businesses.premium` - Premium listing status
- `business_profiles.premium` - Premium subscription status

### Status Enumerations
- `business_submissions.status`: 'pending', 'approved', 'rejected'
- `businesses.status`: 'active', 'inactive'
- `contact_messages.status`: 'new', 'in_progress', 'resolved'
- `stripe_orders.status`: 'pending', 'completed', 'failed'
- `business_profiles.subscription_status`: 'not_started', 'active', 'cancelled'

---

## 🚀 Scaling Considerations

### Performance Indexes
Current indexes optimize for:
- **Category filtering** (`idx_businesses_category`)
- **Site-specific queries** (`idx_businesses_site_id`, `idx_business_profiles_site_id`)
- **Status filtering** (`idx_businesses_status`, `idx_business_submissions_status`)
- **Analytics queries** (`idx_user_engagement_events_business_id`, `idx_user_engagement_events_timestamp`)
- **User lookups** (`idx_business_profiles_user_id`, `idx_business_profiles_email`)

### Recommended Additional Indexes
For high-scale operations, consider:
```sql
-- Geographic queries
CREATE INDEX idx_businesses_city_category ON businesses(city, category);
CREATE INDEX idx_businesses_location ON businesses(latitude, longitude);

-- Rating/review queries
CREATE INDEX idx_businesses_rating ON businesses(rating DESC);
CREATE INDEX idx_businesses_review_count ON businesses(review_count DESC);

-- Time-based queries
CREATE INDEX idx_businesses_created_at ON businesses(created_at);
CREATE INDEX idx_business_submissions_submitted_at ON business_submissions(submitted_at);
```

### Data Archival Strategy
For long-term scaling:
- Archive old `user_engagement_events` (>1 year)
- Archive resolved `contact_messages` (>6 months)
- Archive rejected `business_submissions` (>3 months)

---

## 🔄 Migration Tracking

The current database supports migrations through the scaling system:
- **Migration files**: `migrations/d1/*.sql`
- **Naming convention**: `YYYYMMDDHHMMSS_description.sql`
- **Tracking**: Manual tracking through git commits

### Recommended Migration Table
```sql
CREATE TABLE migrations (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    applied_at TEXT DEFAULT (datetime('now')),
    rollback_sql TEXT
);
```

This entities documentation serves as the single source of truth for the Near-Me platform database structure and should be updated whenever schema changes are made.
