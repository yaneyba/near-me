-- REFACTORED PRODUCTION DATABASE DDL
-- This removes all hard-coded admin detection and replaces with proper service role policies
-- Generated: June 27, 2025
-- 
-- IMPORTANT: This DDL uses service role for admin operations instead of hard-coded email checks
-- Admin operations should be performed using the service role key from the application

-- ========================================
-- ENUMS
-- ========================================

CREATE TYPE IF NOT EXISTS submission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE IF NOT EXISTS stripe_subscription_status AS ENUM ('not_started', 'incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');
CREATE TYPE IF NOT EXISTS stripe_order_status AS ENUM ('pending', 'completed', 'canceled');

-- ========================================
-- BUSINESS SUBMISSIONS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS business_submissions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name  TEXT NOT NULL,
    owner_name     TEXT NOT NULL,
    email          TEXT NOT NULL,
    phone          TEXT NOT NULL,
    address        TEXT NOT NULL,
    city           TEXT NOT NULL,
    state          TEXT NOT NULL,
    zip_code       TEXT NOT NULL,
    category       TEXT NOT NULL,
    website        TEXT,
    description    TEXT,
    services       TEXT[] DEFAULT '{}',
    hours          JSONB,
    status         submission_status DEFAULT 'pending',
    submitted_at   TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at    TIMESTAMPTZ,
    reviewer_notes TEXT,
    site_id        TEXT NOT NULL,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_business_submissions_status ON business_submissions(status);
CREATE INDEX IF NOT EXISTS idx_business_submissions_site_id ON business_submissions(site_id);
CREATE INDEX IF NOT EXISTS idx_business_submissions_submitted_at ON business_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_business_submissions_email ON business_submissions(email);

-- RLS Policies
ALTER TABLE business_submissions ENABLE ROW LEVEL SECURITY;

-- Service role can manage all submissions (for admin operations)
CREATE POLICY "Service role can manage business_submissions" ON business_submissions
    FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users can create submissions
CREATE POLICY "Authenticated users can create submissions" ON business_submissions
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions" ON business_submissions
    FOR SELECT TO authenticated
    USING (email = (auth.jwt() ->> 'email'));

-- ========================================
-- CONTACT MESSAGES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS contact_messages (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    message    TEXT NOT NULL,
    site_id    TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_site_id ON contact_messages(site_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- RLS Policies
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Service role can manage all messages (for admin operations)
CREATE POLICY "Service role can manage contact_messages" ON contact_messages
    FOR ALL USING (auth.role() = 'service_role');

-- Anyone can create contact messages (public contact form)
CREATE POLICY "Anyone can create contact_messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- ========================================
-- BUSINESS PROFILES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS business_profiles (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name         TEXT NOT NULL,
    email                 TEXT NOT NULL,
    phone                 TEXT,
    address               TEXT,
    city                  TEXT,
    state                 TEXT,
    zip_code              TEXT,
    category              TEXT,
    website               TEXT,
    description           TEXT,
    services              TEXT[] DEFAULT '{}',
    hours                 JSONB,
    subscription_status   stripe_subscription_status DEFAULT 'not_started',
    stripe_customer_id    TEXT,
    stripe_subscription_id TEXT,
    subscription_start_date TIMESTAMPTZ,
    subscription_end_date   TIMESTAMPTZ,
    trial_end_date        TIMESTAMPTZ,
    site_id               TEXT NOT NULL,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, site_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_site_id ON business_profiles(site_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_subscription_status ON business_profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_business_profiles_email ON business_profiles(email);

-- RLS Policies
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

-- Service role can manage all profiles (for admin operations)
CREATE POLICY "Service role can manage business_profiles" ON business_profiles
    FOR ALL USING (auth.role() = 'service_role');

-- Users can read their own profile
CREATE POLICY "Users can read own business_profile" ON business_profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own business_profile" ON business_profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ========================================
-- BUSINESSES TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS businesses (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    description TEXT,
    address     TEXT NOT NULL,
    city        TEXT NOT NULL,
    state       TEXT NOT NULL,
    zip_code    TEXT NOT NULL,
    phone       TEXT,
    email       TEXT,
    website     TEXT,
    category    TEXT NOT NULL,
    services    TEXT[] DEFAULT '{}',
    hours       JSONB,
    rating      DECIMAL(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    image_url   TEXT,
    logo_url    TEXT,
    status      TEXT DEFAULT 'active',
    is_premium  BOOLEAN DEFAULT FALSE,
    site_id     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_businesses_site_id ON businesses(site_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_is_premium ON businesses(is_premium);
CREATE INDEX IF NOT EXISTS idx_businesses_rating ON businesses(rating DESC);

-- RLS Policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Service role can manage all businesses (for admin operations)
CREATE POLICY "Service role can manage businesses" ON businesses
    FOR ALL USING (auth.role() = 'service_role');

-- Public read access for active businesses
CREATE POLICY "Public read access for businesses" ON businesses
    FOR SELECT USING (status = 'active');

-- ========================================
-- ADMIN SETTINGS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS admin_settings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Service role can manage all settings (for admin operations)
CREATE POLICY "Service role can manage admin_settings" ON admin_settings
    FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users can read settings (for feature flags)
CREATE POLICY "Authenticated users can read admin_settings" ON admin_settings
    FOR SELECT TO authenticated
    USING (true);

-- ========================================
-- STRIPE ORDERS TABLE
-- ========================================

CREATE TABLE IF NOT EXISTS stripe_orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
    stripe_session_id   TEXT NOT NULL UNIQUE,
    stripe_payment_intent_id TEXT,
    amount          INTEGER NOT NULL, -- Amount in cents
    currency        TEXT DEFAULT 'usd',
    status          stripe_order_status DEFAULT 'pending',
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stripe_orders_business_profile_id ON stripe_orders(business_profile_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_stripe_session_id ON stripe_orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_status ON stripe_orders(status);

-- RLS Policies
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- Service role can manage all orders (for admin operations)
CREATE POLICY "Service role can manage stripe_orders" ON stripe_orders
    FOR ALL USING (auth.role() = 'service_role');

-- Users can read their own orders
CREATE POLICY "Users can read own stripe_orders" ON stripe_orders
    FOR SELECT TO authenticated
    USING (
        business_profile_id IN (
            SELECT id FROM business_profiles WHERE user_id = auth.uid()
        )
    );

-- ========================================
-- TRIGGERS
-- ========================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_business_submissions_updated_at
    BEFORE UPDATE ON business_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_profiles_updated_at
    BEFORE UPDATE ON business_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stripe_orders_updated_at
    BEFORE UPDATE ON stripe_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- GRANTS
-- ========================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant access to tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant access to sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO service_role, authenticated;

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON SCHEMA public IS 'Refactored production schema with proper service role based admin policies. No hard-coded admin detection.';

COMMENT ON TABLE business_submissions IS 'Business submission requests from potential customers';
COMMENT ON TABLE contact_messages IS 'Contact form messages from website visitors';
COMMENT ON TABLE business_profiles IS 'Business owner profiles with subscription management';
COMMENT ON TABLE businesses IS 'Public business directory listings';
COMMENT ON TABLE admin_settings IS 'Application configuration and feature flags';
COMMENT ON TABLE stripe_orders IS 'Stripe payment order tracking';

-- ========================================
-- MIGRATION NOTES
-- ========================================

-- This refactored DDL:
-- 1. Removes all hard-coded admin detection (no is_admin_user() function)
-- 2. Uses service role for all admin operations
-- 3. Implements proper RLS policies for security
-- 4. Maintains all necessary indexes and constraints
-- 5. Includes proper triggers for updated_at columns
-- 
-- To migrate from old schema:
-- 1. Deploy application changes that use service role for admin operations
-- 2. Update environment variables (VITE_ADMIN_EMAILS)
-- 3. Run the cleanup SQL to drop old policies and functions
-- 4. Apply this DDL to create new policies
-- 5. Test all admin and user flows
