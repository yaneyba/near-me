-- POST-MIGRATION VERIFICATION SCRIPT
-- Run this after executing complete-admin-migration.sql to verify everything is working
-- Date: June 27, 2025

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- 1. Verify is_admin_user() function is removed
SELECT 'CHECKING: is_admin_user() function removal' as check_name;
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ SUCCESS: is_admin_user() function removed'
        ELSE '❌ FAILED: is_admin_user() function still exists'
    END as result
FROM pg_proc 
WHERE proname = 'is_admin_user';

-- 2. List all current policies to verify new structure
SELECT 'CHECKING: Current RLS policies' as check_name;
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
ORDER BY tablename, policyname;

-- 3. Check for any remaining references to is_admin_user in policies
SELECT 'CHECKING: Policies with is_admin_user references' as check_name;
SELECT 
    tablename,
    policyname,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND (qual LIKE '%is_admin_user%' OR with_check LIKE '%is_admin_user%');

-- Should return no rows if migration was successful

-- 4. Verify service role policies exist for key tables
SELECT 'CHECKING: Service role policies for key tables' as check_name;
SELECT 
    t.table_name,
    CASE 
        WHEN p.policyname IS NOT NULL THEN '✅ Has Service Role Policy'
        ELSE '❌ Missing Service Role Policy'
    END as status
FROM information_schema.tables t
LEFT JOIN pg_policies p ON (
    p.tablename = t.table_name 
    AND p.policyname LIKE '%service_role%'
)
WHERE t.table_schema = 'public' 
  AND t.table_type = 'BASE TABLE'
  AND t.table_name IN (
    'business_submissions',
    'contact_messages', 
    'business_profiles',
    'businesses',
    'admin_settings'
  )
ORDER BY t.table_name;

-- 5. Test service role access (should work)
SELECT 'CHECKING: Service role permissions' as check_name;
SELECT 
    tablename,
    privilege_type
FROM information_schema.role_table_grants 
WHERE grantee = 'service_role' 
  AND table_schema = 'public'
  AND table_name IN (
    'business_submissions',
    'contact_messages',
    'business_profiles', 
    'businesses',
    'admin_settings'
  )
ORDER BY tablename, privilege_type;

-- ========================================
-- SUMMARY REPORT
-- ========================================

SELECT 'MIGRATION VERIFICATION SUMMARY' as report_section;

-- Count old vs new policies
WITH policy_summary AS (
  SELECT 
    SUM(CASE WHEN policyname LIKE '%service_role%' THEN 1 ELSE 0 END) as service_role_policies,
    SUM(CASE WHEN policyname LIKE '%admin%' AND policyname NOT LIKE '%service_role%' THEN 1 ELSE 0 END) as old_admin_policies,
    SUM(CASE WHEN policyname NOT LIKE '%admin%' AND policyname NOT LIKE '%service_role%' THEN 1 ELSE 0 END) as user_policies,
    COUNT(*) as total_policies
  FROM pg_policies 
  WHERE schemaname = 'public'
)
SELECT 
  service_role_policies || ' service role policies' as new_policies,
  old_admin_policies || ' old admin policies' as legacy_policies,
  user_policies || ' user policies' as user_policies,
  total_policies || ' total policies' as total_count
FROM policy_summary;

-- Final status
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_admin_user') THEN 
      '❌ MIGRATION INCOMPLETE: is_admin_user() function still exists'
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE schemaname = 'public' 
        AND (qual LIKE '%is_admin_user%' OR with_check LIKE '%is_admin_user%')
    ) THEN 
      '❌ MIGRATION INCOMPLETE: Policies still reference is_admin_user()'
    WHEN (
      SELECT COUNT(*) FROM pg_policies 
      WHERE schemaname = 'public' AND policyname LIKE '%service_role%'
    ) < 5 THEN
      '⚠️  MIGRATION PARTIAL: Missing some service role policies'
    ELSE 
      '✅ MIGRATION SUCCESSFUL: All checks passed'
  END as migration_status;

-- ========================================
-- NEXT STEPS
-- ========================================

SELECT 'NEXT STEPS AFTER SUCCESSFUL MIGRATION' as next_steps;
SELECT '1. Test admin dashboard in application' as step_1;
SELECT '2. Verify admin operations work (approve submissions, etc.)' as step_2;
SELECT '3. Test user operations (create submissions, view own data)' as step_3;  
SELECT '4. Update production deployment if tests pass' as step_4;
SELECT '5. Archive old SQL files for reference' as step_5;
