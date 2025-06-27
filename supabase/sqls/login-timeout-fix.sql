-- IMMEDIATE FIX FOR LOGIN TIMEOUT ISSUE
-- Copy and paste this SQL into your Supabase SQL Editor and run it immediately

-- Fix 1: Update admin email to match code
CREATE OR REPLACE FUNCTION is_admin_user() RETURNS BOOLEAN AS $$
BEGIN
    RETURN (auth.jwt() ->> 'email') IN (
        'yaneyba@finderhubs.com',
        'admin@near-me.us'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix 2: Add missing RLS policies for business_profiles (CRITICAL FOR LOGIN)
-- Drop any existing conflicting policies first
DROP POLICY IF EXISTS "Users can read own profile" ON business_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON business_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON business_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON business_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON business_profiles;

-- Create proper policies
CREATE POLICY "Users can read own profile" ON business_profiles
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON business_profiles
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Admins can read all profiles" ON business_profiles
    FOR SELECT TO authenticated
    USING (is_admin_user());

CREATE POLICY "Admins can update all profiles" ON business_profiles
    FOR UPDATE TO authenticated
    USING (is_admin_user());

CREATE POLICY "Admins can insert profiles" ON business_profiles
    FOR INSERT TO authenticated
    WITH CHECK (is_admin_user());

-- Fix 3: Ensure proper permissions
GRANT SELECT, INSERT, UPDATE ON business_profiles TO authenticated;

-- Fix 4: Temporary anon access for testing (remove in production)
CREATE POLICY "Temporary anon read for debugging" ON business_profiles
    FOR SELECT TO anon
    USING (true);

-- Comments
COMMENT ON FUNCTION is_admin_user() IS 'Fixed admin email detection for yaneyba@finderhubs.com';
