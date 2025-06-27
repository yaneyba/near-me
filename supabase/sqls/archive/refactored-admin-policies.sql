-- REFACTORED PRODUCTION DDL - Removing Hard-coded Admin Detection
-- This removes the problematic is_admin_user() function and replaces it with proper policies
-- Date: June 27, 2025

-- ========================================
-- REMOVE HARD-CODED ADMIN FUNCTION
-- ========================================

-- Drop the problematic hard-coded admin function
DROP FUNCTION IF EXISTS public.is_admin_user();

-- ========================================
-- PROPER ADMIN DETECTION APPROACH
-- ========================================

-- Option 1: Service Role Access (Recommended for admin operations)
-- Admin operations should use the service role key, not JWT detection

-- Option 2: User Metadata Approach (if you need JWT-based admin detection)
-- Admins can be identified by user metadata set during user creation
-- This is managed at the application level, not hard-coded in database

-- Option 3: Simple authenticated user access for most operations
-- Let the application handle admin logic, database just ensures authentication

-- ========================================
-- REFACTORED POLICIES (Examples for key tables)
-- ========================================

-- Business Submissions Policies (Replace hard-coded admin checks)
DROP POLICY IF EXISTS "Admins can read all business_submissions" ON business_submissions;
DROP POLICY IF EXISTS "Admins can update all business_submissions" ON business_submissions;
DROP POLICY IF EXISTS "Admins can insert business_submissions" ON business_submissions;

-- New approach: Service role for admin operations
CREATE POLICY "Service role can manage business_submissions" ON business_submissions
    FOR ALL USING (auth.role() = 'service_role');

-- Users can create their own submissions
CREATE POLICY "Users can create business_submissions" ON business_submissions
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can read their own submissions (if we add user_id column)
-- CREATE POLICY "Users can read own business_submissions" ON business_submissions
--     FOR SELECT USING (auth.uid() = user_id);

-- Contact Messages Policies (Replace hard-coded admin checks)
DROP POLICY IF EXISTS "Admins can read all contact_messages" ON contact_messages;

CREATE POLICY "Service role can manage contact_messages" ON contact_messages
    FOR ALL USING (auth.role() = 'service_role');

-- Anyone can create contact messages (public contact form)
CREATE POLICY "Anyone can create contact_messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Business Profiles Policies (Replace hard-coded admin checks)
DROP POLICY IF EXISTS "Admins can read all business_profiles" ON business_profiles;
DROP POLICY IF EXISTS "Admins can update all business_profiles" ON business_profiles;

CREATE POLICY "Service role can manage business_profiles" ON business_profiles
    FOR ALL USING (auth.role() = 'service_role');

-- Users can read their own profile
CREATE POLICY "Users can read own business_profile" ON business_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own business_profile" ON business_profiles
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Businesses Policies (Replace hard-coded admin checks)
DROP POLICY IF EXISTS "Admins can read all businesses" ON businesses;

CREATE POLICY "Service role can manage businesses" ON businesses
    FOR ALL USING (auth.role() = 'service_role');

-- Public read access for businesses (they're displayed publicly)
CREATE POLICY "Public read access for businesses" ON businesses
    FOR SELECT USING (status = 'active');

-- Admin Settings Policies (Replace hard-coded admin checks)
DROP POLICY IF EXISTS "Admins can manage admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "Admins can read admin_settings" ON admin_settings;
DROP POLICY IF EXISTS "Admins can insert admin_settings" ON admin_settings;

CREATE POLICY "Service role can manage admin_settings" ON admin_settings
    FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users can read settings (for feature flags)
CREATE POLICY "Authenticated users can read admin_settings" ON admin_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- ========================================
-- CLEAN UP GRANTS FOR REMOVED FUNCTION
-- ========================================

-- Remove grants for the deleted function (these will fail gracefully if function doesn't exist)
-- REVOKE EXECUTE ON FUNCTION is_admin_user() FROM anon;
-- REVOKE EXECUTE ON FUNCTION is_admin_user() FROM authenticated;
-- REVOKE EXECUTE ON FUNCTION is_admin_user() FROM service_role;

-- ========================================
-- APPLICATION-LEVEL ADMIN HANDLING
-- ========================================

-- The application should:
-- 1. Use environment variables for admin email lists (VITE_ADMIN_EMAILS)
-- 2. Use service role key for admin operations 
-- 3. Check admin status in application code, not database
-- 4. Use proper authentication middleware

-- Example application flow:
-- 1. User logs in normally through Supabase Auth
-- 2. Application checks if email is in VITE_ADMIN_EMAILS env var
-- 3. If admin, application uses service role for database operations
-- 4. If regular user, application uses user's JWT for limited operations

-- ========================================
-- MIGRATION NOTES
-- ========================================

-- 1. Update application code to use service role for admin operations
-- 2. Remove any references to is_admin_user() in application
-- 3. Test all admin functionality with new policies
-- 4. Ensure environment variables are set (VITE_ADMIN_EMAILS)
-- 5. Deploy application changes before running this SQL

COMMENT ON SCHEMA public IS 'Refactored to remove hard-coded admin detection. Admin logic now handled at application level with proper environment variable configuration.';
