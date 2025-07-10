
-- D1 Database Schema for Near-Me Platform
-- Migrated from Supabase with data type optimizations

-- Business Submissions Table
CREATE TABLE IF NOT EXISTS business_submissions (
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
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
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

-- Business Profiles Table
CREATE TABLE IF NOT EXISTS business_profiles (
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
);

-- Businesses Table (Public Directory)
CREATE TABLE IF NOT EXISTS businesses (
    id TEXT PRIMARY KEY,
    business_id TEXT UNIQUE,
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
    services TEXT, -- JSON array as TEXT
    hours TEXT, -- JSON object as TEXT
    rating REAL DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    image TEXT,
    logo_url TEXT,
    established INTEGER,
    verified INTEGER DEFAULT 0, -- 0 = false, 1 = true
    premium INTEGER DEFAULT 0, -- 0 = false, 1 = true
    status TEXT DEFAULT 'active',
    site_id TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- User Engagement Events Table
CREATE TABLE IF NOT EXISTS user_engagement_events (
    id TEXT PRIMARY KEY,
    business_id TEXT,
    event_type TEXT NOT NULL,
    event_data TEXT, -- JSON object as TEXT
    timestamp TEXT DEFAULT (datetime('now')),
    user_agent TEXT,
    ip_address TEXT,
    session_id TEXT
);

-- Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
    id TEXT PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL, -- JSON as TEXT
    description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Stripe Orders Table
CREATE TABLE IF NOT EXISTS stripe_orders (
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
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_submissions_status ON business_submissions(status);
CREATE INDEX IF NOT EXISTS idx_business_submissions_site_id ON business_submissions(site_id);
CREATE INDEX IF NOT EXISTS idx_business_submissions_email ON business_submissions(email);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_site_id ON business_profiles(site_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_email ON business_profiles(email);

CREATE INDEX IF NOT EXISTS idx_businesses_business_id ON businesses(business_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_site_id ON businesses(site_id);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);

CREATE INDEX IF NOT EXISTS idx_user_engagement_events_business_id ON user_engagement_events(business_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_events_timestamp ON user_engagement_events(timestamp);

CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(setting_key);
