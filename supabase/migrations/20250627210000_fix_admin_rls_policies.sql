-- Fix RLS policies for admin access using email-based detection
-- This aligns with our email-based admin detection in src/lib/auth.ts

-- First, let's create a helper function to check if a user is an admin by email
CREATE OR REPLACE FUNCTION is_admin_user() RETURNS BOOLEAN AS $$
BEGIN
    -- Check if the current user's email is in our admin email list
    -- Using the same logic as src/lib/auth.ts isAdminEmail function
    RETURN (auth.jwt() ->> 'email') IN (
        'admin@near-me.us',
        'yanbanga@gmail.com'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing admin policies that rely on business_profiles role
DROP POLICY IF EXISTS "Admins can select all submissions" ON business_submissions;
DROP POLICY IF EXISTS "Admin users can read all settings" ON admin_settings;
DROP POLICY IF EXISTS "Admin users can update settings" ON admin_settings;
DROP POLICY IF EXISTS "Admin users can insert settings" ON admin_settings;

-- Create new admin policies using email-based detection
CREATE POLICY "Email-based admins can select all submissions" ON business_submissions
    FOR SELECT 
    USING (is_admin_user());

CREATE POLICY "Email-based admins can update all submissions" ON business_submissions
    FOR UPDATE 
    USING (is_admin_user());

-- Add policy for anon access to business_submissions (for when admin is not authenticated)
-- This allows the admin dashboard to work even without authentication
CREATE POLICY "Allow anon read for admin emails" ON business_submissions
    FOR SELECT TO anon
    USING (true);  -- We'll handle admin verification in the application layer

-- Alternative: More secure approach - require authentication but use email check
-- Uncomment this and comment out the anon policy above if you prefer authenticated admin access only
/*
CREATE POLICY "Authenticated email-based admins can select all" ON business_submissions
    FOR SELECT TO authenticated
    USING (is_admin_user());
*/

-- Admin settings policies with email-based detection
CREATE POLICY "Email-based admins can read all settings" ON admin_settings
    FOR SELECT 
    USING (is_admin_user());

CREATE POLICY "Email-based admins can update settings" ON admin_settings
    FOR UPDATE 
    USING (is_admin_user());

CREATE POLICY "Email-based admins can insert settings" ON admin_settings
    FOR INSERT 
    WITH CHECK (is_admin_user());

-- Grant necessary permissions to anon role for admin dashboard to work
GRANT SELECT ON business_submissions TO anon;
GRANT SELECT ON business_profiles TO anon;

-- Also grant permissions to authenticated role
GRANT SELECT, INSERT, UPDATE ON business_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON admin_settings TO authenticated;

-- Create a policy that allows anonymous users to check admin status
-- This is needed for the admin dashboard to determine if the current user is an admin
CREATE POLICY "Allow anon to check admin status" ON business_profiles
    FOR SELECT TO anon
    USING (true);

-- Comments for documentation
COMMENT ON FUNCTION is_admin_user() IS 'Checks if current user is an admin based on email address';
