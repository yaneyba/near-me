-- OPTION 1: EMAIL-ONLY ADMIN APPROACH (RECOMMENDED)
-- Admins are stored ONLY in auth.users, detected by email
-- NO business_profiles entries needed for admins

-- Update admin detection to be email-only
CREATE OR REPLACE FUNCTION is_admin_user() RETURNS BOOLEAN AS $$
BEGIN
    -- Admins detected purely by email - no database table lookups needed
    RETURN (auth.jwt() ->> 'email') IN (
        'yaneyba@finderhubs.com'
        -- Add more admin emails here as needed
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Clean up: Remove any existing admin business_profiles entries
-- These are incorrect since admins are not businesses
DELETE FROM business_profiles WHERE role = 'admin';

-- Update all admin policies to use email-only detection
-- No changes needed to existing policies - they already use is_admin_user()

-- Comments
COMMENT ON FUNCTION is_admin_user() IS 'Email-only admin detection - admins exist only in auth.users, not business_profiles';
