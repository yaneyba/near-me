-- CRITICAL FIX: Admin Access Without Business Profiles
-- Admins are NOT businesses and should not need business_profiles entries
-- This SQL fixes the RLS policies to use email-based admin detection

-- Update the admin detection function to be more explicit
CREATE OR REPLACE FUNCTION is_admin_user() RETURNS BOOLEAN AS $$
BEGIN
    -- Admin users are detected by email, NOT by business_profiles table
    -- This allows admins to access admin functions without having business profiles
    RETURN (auth.jwt() ->> 'email') IN (
        'yaneyba@finderhubs.com'
        -- Add more admin emails here as needed
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix business_submissions policies - admins don't need business_profiles
DROP POLICY IF EXISTS "Email-based admins can select all submissions" ON business_submissions;
DROP POLICY IF EXISTS "Email-based admins can update all submissions" ON business_submissions;

CREATE POLICY "Email-based admins can select all submissions" ON business_submissions
    FOR SELECT TO authenticated
    USING (is_admin_user());

CREATE POLICY "Email-based admins can update all submissions" ON business_submissions
    FOR UPDATE TO authenticated
    USING (is_admin_user());

CREATE POLICY "Email-based admins can insert submissions" ON business_submissions
    FOR INSERT TO authenticated
    WITH CHECK (is_admin_user());

-- Fix admin_settings policies - use email-based detection only
DROP POLICY IF EXISTS "Email-based admins can read all settings" ON admin_settings;
DROP POLICY IF EXISTS "Email-based admins can update settings" ON admin_settings;
DROP POLICY IF EXISTS "Email-based admins can insert settings" ON admin_settings;

CREATE POLICY "Email-based admins can read all settings" ON admin_settings
    FOR SELECT TO authenticated
    USING (is_admin_user());

CREATE POLICY "Email-based admins can update settings" ON admin_settings
    FOR UPDATE TO authenticated
    USING (is_admin_user());

CREATE POLICY "Email-based admins can insert settings" ON admin_settings
    FOR INSERT TO authenticated
    WITH CHECK (is_admin_user());

-- Fix businesses table policies for admin access
DROP POLICY IF EXISTS "Admins can manage all businesses" ON businesses;

CREATE POLICY "Admins can manage all businesses" ON businesses
    FOR ALL TO authenticated
    USING (is_admin_user());

-- Business profiles policies remain the same for business users
-- Admins don't need access to business_profiles table

-- Remove the old business_profiles-based admin policies that were wrong
DROP POLICY IF EXISTS "Admin users can read all settings" ON admin_settings;
DROP POLICY IF EXISTS "Admin users can update settings" ON admin_settings;
DROP POLICY IF EXISTS "Admin users can insert settings" ON admin_settings;

-- Comments for clarity
COMMENT ON FUNCTION is_admin_user() IS 'Email-based admin detection - admins are NOT businesses and do not need business_profiles entries';
