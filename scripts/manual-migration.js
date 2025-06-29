// Manual migration runner to create the required tables
// Use this if the standard migration system isn't working
import { supabase } from '../src/lib/supabase.js';

const migrationSQL = `
-- Create submission_status enum if it doesn't exist
DO \$\$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
        CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END \$\$;

-- Create business_submissions table for proper approval workflow
CREATE TABLE IF NOT EXISTS business_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    category TEXT NOT NULL,
    website TEXT,
    description TEXT,
    services TEXT[] DEFAULT '{}',
    hours JSONB,
    status submission_status DEFAULT 'pending',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewer_notes TEXT,
    site_id TEXT NOT NULL DEFAULT 'near-me-us',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for business_submissions
CREATE INDEX IF NOT EXISTS idx_business_submissions_status ON business_submissions(status);
CREATE INDEX IF NOT EXISTS idx_business_submissions_site_id ON business_submissions(site_id);
CREATE INDEX IF NOT EXISTS idx_business_submissions_submitted_at ON business_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_business_submissions_email ON business_submissions(email);

-- Enable RLS on business_submissions
ALTER TABLE business_submissions ENABLE ROW LEVEL SECURITY;

-- Add admin_settings table if it doesn't exist (for feature flags)
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users
);

-- Enable RLS on admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Insert default settings if they don't exist
INSERT INTO admin_settings (key, value, description) VALUES
    ('login_enabled', 'true', 'Whether user login/registration is enabled')
ON CONFLICT (key) DO NOTHING;

INSERT INTO admin_settings (key, value, description) VALUES
    ('tracking_enabled', 'true', 'Whether analytics tracking is enabled')
ON CONFLICT (key) DO NOTHING;

-- Update business_profiles table with new columns if they don't exist
DO \$\$ 
BEGIN 
    -- Add approval_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'approval_status') THEN
        ALTER TABLE business_profiles ADD COLUMN approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'rejected'));
    END IF;
    
    -- Add approved_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'approved_at') THEN
        ALTER TABLE business_profiles ADD COLUMN approved_at TIMESTAMPTZ;
    END IF;
    
    -- Add approved_by column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'approved_by') THEN
        ALTER TABLE business_profiles ADD COLUMN approved_by UUID REFERENCES auth.users;
    END IF;
    
    -- Add stripe_customer_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE business_profiles ADD COLUMN stripe_customer_id TEXT;
    END IF;
    
    -- Add stripe_subscription_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'stripe_subscription_id') THEN
        ALTER TABLE business_profiles ADD COLUMN stripe_subscription_id TEXT;
    END IF;
    
    -- Add stripe_price_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'stripe_price_id') THEN
        ALTER TABLE business_profiles ADD COLUMN stripe_price_id TEXT;
    END IF;
    
    -- Add stripe_current_period_end column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'stripe_current_period_end') THEN
        ALTER TABLE business_profiles ADD COLUMN stripe_current_period_end BIGINT;
    END IF;
    
    -- Add premium column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_profiles' AND column_name = 'premium') THEN
        ALTER TABLE business_profiles ADD COLUMN premium BOOLEAN DEFAULT false;
    END IF;
END \$\$;

-- Create necessary indexes
CREATE INDEX IF NOT EXISTS idx_business_profiles_approval_status ON business_profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_business_profiles_stripe_customer_id ON business_profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_stripe_subscription_id ON business_profiles(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_premium ON business_profiles(premium);
`;

async function runMigration() {
  console.log('Running manual migration...');
  
  try {
    // Split the SQL into individual statements and execute them
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        if (error) {
          console.log('Statement failed (might be normal):', statement.substring(0, 50) + '...');
          console.log('Error:', error.message);
        } else {
          console.log('✅ Statement executed successfully');
        }
      } catch (err) {
        console.log('Statement failed (might be normal):', statement.substring(0, 50) + '...');
        console.log('Error:', err.message);
      }
    }
    
    console.log('Migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
runMigration();
