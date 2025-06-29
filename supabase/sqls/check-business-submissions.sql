-- MIGRATION 1: Fix business_submissions table
-- This adds missing columns to your existing business_submissions table

-- First, let's see what columns exist
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'business_submissions' 
ORDER BY ordinal_position;
