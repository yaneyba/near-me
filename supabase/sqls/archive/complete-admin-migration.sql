-- COMPLETE MIGRATION FROM HARD-CODED ADMIN TO SERVICE ROLE
-- This script removes all hard-coded admin detection and applies proper service role policies
-- Run this AFTER deploying application changes that use service role for admin operations
-- Date: June 27, 2025

-- ========================================
-- STEP 1: DROP ALL OLD ADMIN POLICIES
-- ========================================

-- Business Submissions
DROP POLICY IF EXISTS "Email-based admins can select all submissions" ON business_submissions;
DROP POLICY IF EXISTS "Email-based admins can update all submissions" ON business_submissions;
DROP POLICY IF EXISTS "Admins can read all business_submissions" ON business_submissions;
DROP POLICY IF EXISTS "Admins can update all business_submissions" ON business_submissions;
DROP POLICY IF EXISTS "Admins can insert business_submissions" ON business_submissions;

-- Contact Messages
DROP POLICY IF EXISTS "Admins can read all contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Email-based admins can read all contact_messages" ON contact_messages;

-- Business Profiles
DROP POLICY IF EXISTS "Admins can read all business_profiles" ON business_profiles;
DROP POLICY IF EXISTS "Admins can update all business_profiles" ON business_profiles;
DROP POLICY IF EXISTS "Email-based admins can read all business_profiles" ON business_profiles;
DROP POLICY IF EXISTS "Email-based admins can update all business_profiles" ON business_profiles;

-- Businesses
DROP POLICY IF EXISTS "Admins can read all businesses" ON businesses;
DROP POLICY IF EXISTS "Email-based admins can read all businesses" ON businesses;
DROP POLICY IF EXISTS "Admins can manage businesses" ON businesses;

-- Admin Settings
DROP POLICY IF EXISTS "Admins can manage admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "Admins can read admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "Admins can insert admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "Email-based admins can manage admin_settings" ON admin_settings;

-- Stripe Orders (if exists)
DROP POLICY IF EXISTS "Admins can read all stripe_orders" ON stripe_orders;
DROP POLICY IF EXISTS "Email-based admins can read all stripe_orders" ON stripe_orders;

-- ========================================
-- STEP 2: DROP HARD-CODED ADMIN FUNCTION
-- ========================================

DROP FUNCTION IF EXISTS public.is_admin_user();

-- ========================================
-- STEP 3: CREATE NEW SERVICE ROLE POLICIES
-- ========================================

-- Business Submissions Policies
CREATE POLICY "Service role can manage business_submissions" ON business_submissions
    FOR ALL USING (auth.role() = 'service_role');

-- Ensure existing user policies remain
-- (These should already exist, but creating if not)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'business_submissions' 
        AND policyname = 'Authenticated users can create submissions'
    ) THEN
        CREATE POLICY "Authenticated users can create submissions" ON business_submissions
            FOR INSERT TO authenticated
            WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'business_submissions' 
        AND policyname = 'Users can view own submissions'
    ) THEN
        CREATE POLICY "Users can view own submissions" ON business_submissions
            FOR SELECT TO authenticated
            USING (email = (auth.jwt() ->> 'email'));
    END IF;
END $$;

-- Contact Messages Policies
CREATE POLICY "Service role can manage contact_messages" ON contact_messages
    FOR ALL USING (auth.role() = 'service_role');

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_messages' 
        AND policyname = 'Anyone can create contact_messages'
    ) THEN
        CREATE POLICY "Anyone can create contact_messages" ON contact_messages
            FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Business Profiles Policies
CREATE POLICY "Service role can manage business_profiles" ON business_profiles
    FOR ALL USING (auth.role() = 'service_role');

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'business_profiles' 
        AND policyname = 'Users can read own business_profile'
    ) THEN
        CREATE POLICY "Users can read own business_profile" ON business_profiles
            FOR SELECT TO authenticated
            USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'business_profiles' 
        AND policyname = 'Users can update own business_profile'
    ) THEN
        CREATE POLICY "Users can update own business_profile" ON business_profiles
            FOR UPDATE TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Businesses Policies
CREATE POLICY "Service role can manage businesses" ON businesses
    FOR ALL USING (auth.role() = 'service_role');

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'businesses' 
        AND policyname = 'Public read access for businesses'
    ) THEN
        CREATE POLICY "Public read access for businesses" ON businesses
            FOR SELECT USING (status = 'active');
    END IF;
END $$;

-- Admin Settings Policies
CREATE POLICY "Service role can manage admin_settings" ON admin_settings
    FOR ALL USING (auth.role() = 'service_role');

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admin_settings' 
        AND policyname = 'Authenticated users can read admin_settings'
    ) THEN
        CREATE POLICY "Authenticated users can read admin_settings" ON admin_settings
            FOR SELECT TO authenticated
            USING (true);
    END IF;
END $$;

-- Stripe Orders Policies (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stripe_orders') THEN
        EXECUTE 'CREATE POLICY "Service role can manage stripe_orders" ON stripe_orders
            FOR ALL USING (auth.role() = ''service_role'')';
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'stripe_orders' 
            AND policyname = 'Users can read own stripe_orders'
        ) THEN
            EXECUTE 'CREATE POLICY "Users can read own stripe_orders" ON stripe_orders
                FOR SELECT TO authenticated
                USING (
                    business_profile_id IN (
                        SELECT id FROM business_profiles WHERE user_id = auth.uid()
                    )
                )';
        END IF;
    END IF;
END $$;

-- ========================================
-- STEP 4: CLEAN UP GRANTS
-- ========================================

-- These will fail gracefully if the function doesn't exist
DO $$
BEGIN
    -- Remove old function grants if they exist
    BEGIN
        REVOKE EXECUTE ON FUNCTION is_admin_user() FROM anon;
    EXCEPTION WHEN undefined_function THEN
        -- Function doesn't exist, which is expected
        NULL;
    END;
    
    BEGIN
        REVOKE EXECUTE ON FUNCTION is_admin_user() FROM authenticated;
    EXCEPTION WHEN undefined_function THEN
        -- Function doesn't exist, which is expected
        NULL;
    END;
    
    BEGIN
        REVOKE EXECUTE ON FUNCTION is_admin_user() FROM service_role;
    EXCEPTION WHEN undefined_function THEN
        -- Function doesn't exist, which is expected
        NULL;
    END;
END $$;

-- ========================================
-- STEP 5: VERIFY MIGRATION
-- ========================================

-- List all policies to verify the migration
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check that is_admin_user function is gone
SELECT proname 
FROM pg_proc 
WHERE proname = 'is_admin_user';

-- Should return no rows if migration was successful

-- ========================================
-- STEP 6: MIGRATION NOTES
-- ========================================

COMMENT ON SCHEMA public IS 'Migration completed: Removed hard-coded admin detection, implemented service role policies. Admin operations now use service role key from application.';

-- ========================================
-- POST-MIGRATION CHECKLIST
-- ========================================

-- 1. ✅ Old admin function removed
-- 2. ✅ Old hard-coded admin policies removed  
-- 3. ✅ New service role policies created
-- 4. ✅ User policies preserved
-- 5. ✅ Function grants cleaned up
-- 6. ⚠️  Test admin operations with service role
-- 7. ⚠️  Test user operations with JWT
-- 8. ⚠️  Verify VITE_ADMIN_EMAILS environment variable is set
-- 9. ⚠️  Verify application uses admin service for admin operations

-- Migration completed successfully!
