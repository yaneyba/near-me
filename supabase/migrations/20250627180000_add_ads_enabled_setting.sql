-- Migration: Add ads_enabled setting to admin_settings table
-- Date: 2025-06-27

-- Insert the ads_enabled setting with default value false
INSERT INTO admin_settings (key, value, description) 
VALUES ('ads_enabled', 'false'::jsonb, 'Enable or disable advertisements on the site')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Verify the setting was added
DO $$
BEGIN
  RAISE NOTICE 'Added ads_enabled setting to admin_settings table';
END $$;
