-- TARGETED MIGRATION - Remove exact dependencies from your DDL
-- This addresses the specific policies found in your current database

-- ========================================
-- STEP 1: DROP POLICIES THAT DEPEND ON is_admin_user()
-- ========================================

-- From business_submissions table
DROP POLICY IF EXISTS "Email-based admins can insert submissions" ON business_submissions;

-- From admin_settings table  
DROP POLICY IF EXISTS "Email-based admins can read all settings" ON admin_settings;
DROP POLICY IF EXISTS "Email-based admins can update settings" ON admin_settings;
DROP POLICY IF EXISTS "Email-based admins can insert settings" ON admin_settings;

-- From businesses table
DROP POLICY IF EXISTS "Admins can manage all businesses" ON businesses;

-- From aggregated_metrics table
DROP POLICY IF EXISTS "Admins can read all aggregated metrics" ON aggregated_metrics;

-- ========================================
-- STEP 2: DROP THE is_admin_user() FUNCTION
-- ========================================

DROP FUNCTION IF EXISTS public.is_admin_user();

-- ========================================
-- STEP 3: CREATE SERVICE ROLE POLICIES
-- ========================================

-- Business submissions - service role access
CREATE POLICY "Service role can manage business_submissions" ON business_submissions
    FOR ALL USING (auth.role() = 'service_role');

-- Admin settings - service role access
CREATE POLICY "Service role can manage admin_settings" ON admin_settings
    FOR ALL USING (auth.role() = 'service_role');

-- Businesses - service role access  
CREATE POLICY "Service role can manage businesses" ON businesses
    FOR ALL USING (auth.role() = 'service_role');

-- Aggregated metrics - service role access
CREATE POLICY "Service role can manage aggregated_metrics" ON aggregated_metrics
    FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- STEP 4: ENSURE USER POLICIES EXIST
-- ========================================

-- Keep existing user policies for business_submissions (they already exist in your DDL):
-- - "Authenticated users can insert submissions"
-- - "Users can view their own submissions" 
-- - "Anon can insert"
-- - "Authenticator can insert"
-- - "Public can insert"
-- - "Temporary admin access" (you may want to remove this later)

-- Keep existing user policies for admin_settings:
-- - "All users can read public settings"

-- Keep existing user policies for businesses:
-- - "Anyone can read active businesses"

-- Keep existing user policies for aggregated_metrics:
-- - "Business owners can read their own metrics"

-- Note: No additional user policies needed since they already exist

-- ========================================
-- STEP 5: VERIFY MIGRATION SUCCESS
-- ========================================

-- Check that is_admin_user function is gone
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ SUCCESS: is_admin_user() function removed'
        ELSE '❌ FAILED: is_admin_user() function still exists'
    END as function_removal_status
FROM pg_proc 
WHERE proname = 'is_admin_user';

-- List current policies to verify new structure
SELECT 
    tablename, 
    policyname,
    CASE 
        WHEN policyname LIKE '%service_role%' THEN '✅ Service Role Policy'
        WHEN policyname LIKE '%admin%' AND policyname NOT LIKE '%service_role%' THEN '⚠️  Old Admin Policy'
        ELSE '📝 User Policy'
    END as policy_type
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('business_submissions', 'admin_settings', 'businesses', 'aggregated_metrics')
ORDER BY tablename, policyname;

-- Check for any remaining references to is_admin_user in policies
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ SUCCESS: No policies reference is_admin_user()'
        ELSE '❌ FAILED: ' || COUNT(*) || ' policies still reference is_admin_user()'
    END as policy_cleanup_status
FROM pg_policies 
WHERE schemaname = 'public' 
  AND (qual LIKE '%is_admin_user%' OR with_check LIKE '%is_admin_user%');

-- Summary
SELECT '🎉 MIGRATION COMPLETED SUCCESSFULLY!' as final_status;
