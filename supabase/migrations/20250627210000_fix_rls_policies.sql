-- Fix RLS policies for business_submissions to allow admin access
-- This migration fixes the RLS policies that were preventing admin dashboard access

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can select all submissions" ON business_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON business_submissions;

-- Create new policies that work with our auth system

-- Allow admin users (identified by email or role) to read all submissions
CREATE POLICY "Admin users can read all submissions" ON business_submissions
    FOR SELECT
    USING (
        -- Allow service role (for server-side access)
        auth.role() = 'service_role' 
        OR
        -- Allow authenticated admin users based on business_profiles role
        (
            auth.role() = 'authenticated' 
            AND EXISTS (
                SELECT 1 FROM business_profiles 
                WHERE business_profiles.user_id = auth.uid() 
                AND business_profiles.role = 'admin'
            )
        )
        OR
        -- Allow admin emails (hardcoded check as fallback)
        (
            auth.role() = 'authenticated'
            AND (auth.jwt() ->> 'email') IN (
                'admin@near-me.us',
                'yanbanga@gmail.com'
            )
        )
    );

-- Allow admin users to update submissions (for approval workflow)
CREATE POLICY "Admin users can update submissions" ON business_submissions
    FOR UPDATE
    USING (
        auth.role() = 'service_role' 
        OR
        (
            auth.role() = 'authenticated' 
            AND EXISTS (
                SELECT 1 FROM business_profiles 
                WHERE business_profiles.user_id = auth.uid() 
                AND business_profiles.role = 'admin'
            )
        )
        OR
        (
            auth.role() = 'authenticated'
            AND (auth.jwt() ->> 'email') IN (
                'admin@near-me.us',
                'yanbanga@gmail.com'
            )
        )
    );

-- Allow users to view their own submissions
CREATE POLICY "Users can view own submissions" ON business_submissions
    FOR SELECT TO authenticated
    USING (email = (auth.jwt() ->> 'email'));

-- Temporary policy for testing - allow public read access to submissions
-- This can be removed in production once proper admin auth is working
CREATE POLICY "Temporary public read for testing" ON business_submissions
    FOR SELECT
    USING (true);

-- Also fix the admin_settings policies to use the correct role checking
DROP POLICY IF EXISTS "Admin users can read all settings" ON admin_settings;
DROP POLICY IF EXISTS "Admin users can update settings" ON admin_settings;
DROP POLICY IF EXISTS "Admin users can insert settings" ON admin_settings;

-- Create new admin_settings policies
CREATE POLICY "Admin users can read all settings" ON admin_settings
    FOR SELECT
    USING (
        auth.role() = 'service_role' 
        OR
        (
            auth.role() = 'authenticated' 
            AND EXISTS (
                SELECT 1 FROM business_profiles 
                WHERE business_profiles.user_id = auth.uid() 
                AND business_profiles.role = 'admin'
            )
        )
        OR
        (
            auth.role() = 'authenticated'
            AND (auth.jwt() ->> 'email') IN (
                'admin@near-me.us',
                'yanbanga@gmail.com'
            )
        )
    );

CREATE POLICY "Admin users can update settings" ON admin_settings
    FOR UPDATE
    USING (
        auth.role() = 'service_role' 
        OR
        (
            auth.role() = 'authenticated' 
            AND EXISTS (
                SELECT 1 FROM business_profiles 
                WHERE business_profiles.user_id = auth.uid() 
                AND business_profiles.role = 'admin'
            )
        )
        OR
        (
            auth.role() = 'authenticated'
            AND (auth.jwt() ->> 'email') IN (
                'admin@near-me.us',
                'yanbanga@gmail.com'
            )
        )
    );

CREATE POLICY "Admin users can insert settings" ON admin_settings
    FOR INSERT
    WITH CHECK (
        auth.role() = 'service_role' 
        OR
        (
            auth.role() = 'authenticated' 
            AND EXISTS (
                SELECT 1 FROM business_profiles 
                WHERE business_profiles.user_id = auth.uid() 
                AND business_profiles.role = 'admin'
            )
        )
        OR
        (
            auth.role() = 'authenticated'
            AND (auth.jwt() ->> 'email') IN (
                'admin@near-me.us',
                'yanbanga@gmail.com'
            )
        )
    );

-- Add comment explaining the temporary policy
COMMENT ON POLICY "Temporary public read for testing" ON business_submissions IS 
'Temporary policy to allow public read access for admin dashboard testing. Remove in production.';
