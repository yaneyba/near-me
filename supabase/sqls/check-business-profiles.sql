-- MIGRATION 2: Fix business_profiles table
-- This adds missing columns to your existing business_profiles table

-- First, let's see what columns exist
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'business_profiles' 
ORDER BY ordinal_position;
