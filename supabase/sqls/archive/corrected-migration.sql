-- CORRECTED MIGRATION - Drop remaining dependent policies first
-- Based on the error output, we need to drop these specific policies first

-- Drop the remaining policies that depend on is_admin_user()
DROP POLICY IF EXISTS "Email-based admins can insert submissions" ON business_submissions;
DROP POLICY IF EXISTS "Email-based admins can read all settings" ON admin_settings;
DROP POLICY IF EXISTS "Email-based admins can update settings" ON admin_settings;
DROP POLICY IF EXISTS "Email-based admins can insert settings" ON admin_settings;
DROP POLICY IF EXISTS "Admins can manage all businesses" ON businesses;
DROP POLICY IF EXISTS "Admins can read all aggregated_metrics" ON aggregated_metrics;

-- Now we can safely drop the function
DROP FUNCTION IF EXISTS public.is_admin_user();

-- Create the new service role policies
CREATE POLICY "Service role can manage business_submissions" ON business_submissions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage admin_settings" ON admin_settings
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage businesses" ON businesses
    FOR ALL USING (auth.role() = 'service_role');

-- Handle aggregated_metrics if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'aggregated_metrics') THEN
        EXECUTE 'CREATE POLICY "Service role can manage aggregated_metrics" ON aggregated_metrics
            FOR ALL USING (auth.role() = ''service_role'')';
    END IF;
END $$;

-- Ensure user policies exist
DO $$
BEGIN
    -- Business submissions user policies
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

    -- Admin settings user policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admin_settings' 
        AND policyname = 'Authenticated users can read admin_settings'
    ) THEN
        CREATE POLICY "Authenticated users can read admin_settings" ON admin_settings
            FOR SELECT TO authenticated
            USING (true);
    END IF;

    -- Businesses public access
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'businesses' 
        AND policyname = 'Public read access for businesses'
    ) THEN
        CREATE POLICY "Public read access for businesses" ON businesses
            FOR SELECT USING (status = 'active');
    END IF;
END $$;

-- Verify the migration
SELECT 'Migration completed. Checking results:' as status;

-- Check that is_admin_user function is gone
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ is_admin_user() function removed successfully'
        ELSE '❌ is_admin_user() function still exists'
    END as function_status
FROM pg_proc 
WHERE proname = 'is_admin_user';

-- List current policies
SELECT 
    tablename, 
    policyname,
    CASE 
        WHEN policyname LIKE '%service_role%' THEN '✅ Service Role Policy'
        ELSE '📝 User Policy'
    END as policy_type
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
