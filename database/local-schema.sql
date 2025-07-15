-- Schema setup for local development database
-- This mirrors the production database schema

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
    services TEXT,
    hours TEXT,
    status TEXT DEFAULT 'pending',
    submitted_at TEXT DEFAULT (datetime('now')),
    reviewed_at TEXT,
    reviewer_notes TEXT,
    site_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

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
);

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
    services TEXT,
    hours TEXT,
    role TEXT DEFAULT 'owner',
    subscription_status TEXT DEFAULT 'not_started',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    stripe_price_id TEXT,
    premium INTEGER DEFAULT 0,
    subscription_start_date TEXT,
    subscription_end_date TEXT,
    trial_end_date TEXT,
    site_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE user_engagement_events (
    id TEXT PRIMARY KEY,
    business_id TEXT,
    event_type TEXT NOT NULL,
    event_data TEXT,
    timestamp TEXT DEFAULT (datetime('now')),
    user_agent TEXT,
    ip_address TEXT,
    session_id TEXT
);

CREATE TABLE admin_settings (
    id TEXT PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE stripe_orders (
    id TEXT PRIMARY KEY,
    business_profile_id TEXT,
    stripe_session_id TEXT UNIQUE NOT NULL,
    stripe_payment_intent_id TEXT,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'pending',
    metadata TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE neighborhoods (
    id TEXT PRIMARY KEY,
    city TEXT NOT NULL,
    neighborhood_name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE services (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    service TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE d1_migrations(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE cities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    state TEXT,
    display_name TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

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
);
