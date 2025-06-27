-- Align local schema with production DDL reference
-- This migration adds the business_submissions table and related approval workflow
-- Based on the production DDL in docs/PRODUCTION-DDL-REFERENCE.sql

-- Create submission_status enum if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
        CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END $$;

-- Create business_submissions table for proper approval workflow
CREATE TABLE IF NOT EXISTS business_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    services TEXT[] DEFAULT '{}',
    hours JSONB,
    status submission_status DEFAULT 'pending',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewer_notes TEXT,
    site_id TEXT NOT NULL DEFAULT 'near-me-us',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for business_submissions
CREATE INDEX IF NOT EXISTS idx_business_submissions_status ON business_submissions(status);
CREATE INDEX IF NOT EXISTS idx_business_submissions_site_id ON business_submissions(site_id);
CREATE INDEX IF NOT EXISTS idx_business_submissions_submitted_at ON business_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_business_submissions_email ON business_submissions(email);

-- Add update trigger for business_submissions
CREATE TRIGGER update_business_submissions_updated_at
    BEFORE UPDATE ON business_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS policies for business_submissions (based on production)
ALTER TABLE business_submissions ENABLE ROW LEVEL SECURITY;

-- Users can view their own submissions
CREATE POLICY "Users can view their own submissions" ON business_submissions
    FOR SELECT TO authenticated
    USING (email = (auth.jwt() ->> 'email'));

-- Authenticated users can insert submissions  
CREATE POLICY "Authenticated users can insert submissions" ON business_submissions
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Anonymous users can insert submissions (for registration form)
CREATE POLICY "Anon can insert" ON business_submissions
    FOR INSERT TO anon
    WITH CHECK (true);

-- Public can insert submissions (broader access)
CREATE POLICY "Public can insert" ON business_submissions
    FOR INSERT WITH CHECK (true);

-- Admins can manage all submissions
CREATE POLICY "Admins can select all submissions" ON business_submissions
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE users.id = auth.uid() 
            AND (users.raw_app_meta_data ->> 'role') = 'admin'
        )
    );

-- Update business_profiles to align with production
-- Add missing columns that may exist in production but not locally
DO $$ 
BEGIN 
    -- Ensure stripe_subscription_status column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'stripe_subscription_status') THEN
        ALTER TABLE business_profiles ADD COLUMN stripe_subscription_status TEXT DEFAULT 'not_started';
        CREATE INDEX IF NOT EXISTS idx_business_profiles_stripe_subscription_status 
        ON business_profiles(stripe_subscription_status);
    END IF;
    
    -- Ensure cancel_at_period_end column exists  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'cancel_at_period_end') THEN
        ALTER TABLE business_profiles ADD COLUMN cancel_at_period_end BOOLEAN DEFAULT false;
    END IF;
    
    -- Ensure business_id column exists (links to businesses table)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'business_id') THEN
        ALTER TABLE business_profiles ADD COLUMN business_id TEXT;
        CREATE INDEX IF NOT EXISTS idx_business_profiles_business_id 
        ON business_profiles(business_id);
    END IF;
END $$;

-- Add admin_settings table if it doesn't exist (for feature flags)
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users
);

-- Add update trigger for admin_settings
CREATE OR REPLACE FUNCTION update_admin_settings_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_settings_updated_at
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_settings_updated_at();

-- RLS for admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Admin users can manage settings
CREATE POLICY "Admin users can read all settings" ON admin_settings
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM business_profiles 
            WHERE business_profiles.user_id = auth.uid() 
            AND business_profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin users can update settings" ON admin_settings
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM business_profiles 
            WHERE business_profiles.user_id = auth.uid() 
            AND business_profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin users can insert settings" ON admin_settings
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM business_profiles 
            WHERE business_profiles.user_id = auth.uid() 
            AND business_profiles.role = 'admin'
        )
    );

-- All users can read public settings (login_enabled, tracking_enabled)
CREATE POLICY "All users can read public settings" ON admin_settings
    FOR SELECT TO authenticated
    USING (key = ANY(ARRAY['login_enabled', 'tracking_enabled']));

-- Insert default settings if they don't exist
INSERT INTO admin_settings (key, value, description) VALUES
    ('login_enabled', 'true', 'Whether user login/registration is enabled')
ON CONFLICT (key) DO NOTHING;

INSERT INTO admin_settings (key, value, description) VALUES
    ('tracking_enabled', 'true', 'Whether analytics tracking is enabled')
ON CONFLICT (key) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE business_submissions IS 'Stores business registration submissions requiring admin approval';
COMMENT ON TABLE admin_settings IS 'Configuration settings managed by administrators';
COMMENT ON COLUMN business_profiles.approval_status IS 'Business approval status: pending, approved, rejected';
COMMENT ON COLUMN business_profiles.stripe_subscription_status IS 'Current Stripe subscription status';
COMMENT ON COLUMN business_profiles.business_id IS 'Reference to businesses table entry';
