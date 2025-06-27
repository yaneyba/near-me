-- Manual Migration for Supabase Dashboard
-- Copy and paste this into your Supabase SQL Editor and run it

-- Create submission_status enum
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Create business_submissions table
CREATE TABLE business_submissions (
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
CREATE INDEX idx_business_submissions_status ON business_submissions(status);
CREATE INDEX idx_business_submissions_site_id ON business_submissions(site_id);
CREATE INDEX idx_business_submissions_submitted_at ON business_submissions(submitted_at DESC);
CREATE INDEX idx_business_submissions_email ON business_submissions(email);

-- Enable RLS on business_submissions
ALTER TABLE business_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for business_submissions
CREATE POLICY "Public can insert" ON business_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own submissions" ON business_submissions FOR SELECT TO authenticated USING (email = (auth.jwt() ->> 'email'));
CREATE POLICY "Anon can insert" ON business_submissions FOR INSERT TO anon WITH CHECK (true);

-- Create admin_settings table
CREATE TABLE admin_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users
);

-- Enable RLS on admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Insert default settings
INSERT INTO admin_settings (key, value, description) VALUES
    ('login_enabled', 'true', 'Whether user login/registration is enabled'),
    ('tracking_enabled', 'true', 'Whether analytics tracking is enabled');

-- Update business_profiles table with new columns
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected'));
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS stripe_current_period_end BIGINT;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS stripe_subscription_status TEXT;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS premium BOOLEAN DEFAULT false;

-- Create indexes for business_profiles
CREATE INDEX IF NOT EXISTS idx_business_profiles_approval_status ON business_profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_business_profiles_stripe_customer_id ON business_profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_stripe_subscription_id ON business_profiles(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_premium ON business_profiles(premium);

-- Add some sample business submissions for testing
INSERT INTO business_submissions (business_name, owner_name, email, phone, address, city, state, zip_code, category, website, description, services, status) VALUES
('Elite Nail Spa', 'Sarah Johnson', 'sarah@elitenailspa.com', '(555) 123-4567', '123 Main Street', 'Dallas', 'Texas', '75201', 'nail-salons', 'https://elitenailspa.com', 'Premium nail salon offering manicures, pedicures, and nail art.', ARRAY['Manicures', 'Pedicures', 'Nail Art', 'Gel Extensions'], 'pending'),
('Quick Fix Auto Repair', 'Mike Rodriguez', 'mike@quickfixauto.com', '(555) 987-6543', '456 Oak Avenue', 'Austin', 'Texas', '73301', 'auto-repair', 'https://quickfixauto.com', 'Professional auto repair services for all makes and models.', ARRAY['Oil Changes', 'Brake Service', 'Engine Repair', 'Diagnostics'], 'pending'),
('Bella Vista Restaurant', 'Maria Gonzalez', 'maria@bellavista.com', '(555) 456-7890', '789 Pine Street', 'Houston', 'Texas', '77001', 'restaurants', 'https://bellavista.com', 'Authentic Italian cuisine in a cozy family atmosphere.', ARRAY['Dine-in', 'Takeout', 'Catering', 'Private Events'], 'pending');
