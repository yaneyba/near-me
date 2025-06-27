-- Add missing Stripe subscription columns to business_profiles table
-- Note: This migration adds columns that may already exist in production
-- The production schema already has comprehensive Stripe integration

-- Add stripe_current_period_end column if it doesn't exist (production may already have this)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'stripe_current_period_end') THEN
        ALTER TABLE business_profiles ADD COLUMN stripe_current_period_end BIGINT;
        
        -- Add index for the new column
        CREATE INDEX IF NOT EXISTS idx_business_profiles_stripe_current_period_end 
        ON business_profiles(stripe_current_period_end);
        
        -- Add comment for the new column
        COMMENT ON COLUMN business_profiles.stripe_current_period_end IS 'Unix timestamp of current subscription period end';
    END IF;
END $$;

-- Ensure business_profiles has approval workflow (may already exist in production)
DO $$ 
BEGIN 
    -- Add approval_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'approval_status') THEN
        ALTER TABLE business_profiles ADD COLUMN approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected'));
        
        -- Create index for approval status queries
        CREATE INDEX IF NOT EXISTS idx_business_profiles_approval_status 
        ON business_profiles(approval_status);
        
        COMMENT ON COLUMN business_profiles.approval_status IS 'Business approval status: pending, approved, rejected';
    END IF;
    
    -- Add approved_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'approved_at') THEN
        ALTER TABLE business_profiles ADD COLUMN approved_at TIMESTAMPTZ;
        COMMENT ON COLUMN business_profiles.approved_at IS 'Timestamp when business was approved';
    END IF;
    
    -- Add approved_by column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'approved_by') THEN
        ALTER TABLE business_profiles ADD COLUMN approved_by UUID REFERENCES auth.users;
        COMMENT ON COLUMN business_profiles.approved_by IS 'Admin user who approved the business';
    END IF;
END $$;

-- Update existing business_profiles to approved status (since they already exist)
UPDATE business_profiles 
SET approval_status = 'approved', approved_at = COALESCE(approved_at, created_at)
WHERE approval_status IS NULL OR approval_status = 'pending';

-- Note: Production already has comprehensive Stripe tables (stripe_customers, stripe_subscriptions, etc.)
-- This migration only adds missing columns to business_profiles for direct subscription management
