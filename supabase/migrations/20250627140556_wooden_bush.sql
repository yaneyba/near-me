/*
  # Add Stripe fields to business_profiles table

  1. Changes
    - Add `stripe_customer_id` (text) - Stripe customer ID for the business
    - Add `stripe_subscription_id` (text) - Stripe subscription ID for the business
    - Add `stripe_price_id` (text) - Stripe price ID for the business subscription
    - Add `premium` (boolean) - Whether the business has a premium subscription

  2. Security
    - Maintain existing RLS policies
*/

-- Add Stripe fields to business_profiles table
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS stripe_price_id text;
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS premium boolean DEFAULT false;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_business_profiles_stripe_customer_id
  ON business_profiles(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_business_profiles_stripe_subscription_id
  ON business_profiles(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_business_profiles_premium
  ON business_profiles(premium);