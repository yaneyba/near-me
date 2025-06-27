/*
  # Link Stripe customers to business profiles

  1. Changes
    - Add business_profile_id column to stripe_customers table
    - Update stripe_customers table to reference business_profiles
    - Create migration function to populate business_profile_id from user_id
    - Update RLS policies to use business_profile_id

  2. Security
    - Update RLS policies to maintain proper access control
    - Ensure backward compatibility during migration
*/

-- Add business_profile_id column to stripe_customers
ALTER TABLE stripe_customers 
ADD COLUMN business_profile_id uuid REFERENCES business_profiles(id);

-- Create function to populate business_profile_id from user_id
CREATE OR REPLACE FUNCTION migrate_stripe_customers_to_business_profiles()
RETURNS void AS $$
BEGIN
  UPDATE stripe_customers sc
  SET business_profile_id = bp.id
  FROM business_profiles bp
  WHERE sc.user_id = bp.user_id
  AND sc.business_profile_id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Run the migration function
SELECT migrate_stripe_customers_to_business_profiles();

-- Update RLS policies to use business_profile_id
DROP POLICY IF EXISTS "Users can view their own customer data" ON stripe_customers;

CREATE POLICY "Users can view their own customer data"
  ON stripe_customers
  FOR SELECT
  TO authenticated
  USING (
    (user_id = auth.uid() OR 
    business_profile_id IN (
      SELECT id FROM business_profiles WHERE user_id = auth.uid()
    ))
    AND deleted_at IS NULL
  );

-- Update subscription view to join through business_profile_id when available
CREATE OR REPLACE VIEW stripe_user_subscriptions WITH (security_invoker = true) AS
SELECT
    c.customer_id,
    s.subscription_id,
    s.status as subscription_status,
    s.price_id,
    s.current_period_start,
    s.current_period_end,
    s.cancel_at_period_end,
    s.payment_method_brand,
    s.payment_method_last4
FROM stripe_customers c
LEFT JOIN stripe_subscriptions s ON c.customer_id = s.customer_id
WHERE (c.user_id = auth.uid() OR 
       c.business_profile_id IN (
         SELECT id FROM business_profiles WHERE user_id = auth.uid()
       ))
AND c.deleted_at IS NULL
AND s.deleted_at IS NULL;

-- Update orders view to join through business_profile_id when available
CREATE OR REPLACE VIEW stripe_user_orders WITH (security_invoker) AS
SELECT
    c.customer_id,
    o.id as order_id,
    o.checkout_session_id,
    o.payment_intent_id,
    o.amount_subtotal,
    o.amount_total,
    o.currency,
    o.payment_status,
    o.status as order_status,
    o.created_at as order_date
FROM stripe_customers c
LEFT JOIN stripe_orders o ON c.customer_id = o.customer_id
WHERE (c.user_id = auth.uid() OR 
       c.business_profile_id IN (
         SELECT id FROM business_profiles WHERE user_id = auth.uid()
       ))
AND c.deleted_at IS NULL
AND o.deleted_at IS NULL;