/*
  # Create admin settings table

  1. New Tables
    - `admin_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique, not null) - Setting name/key
      - `value` (jsonb, not null) - Setting value (stored as JSON)
      - `description` (text) - Human-readable description
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `updated_by` (uuid, references auth.users) - Admin who last updated

  2. Security
    - Enable RLS on `admin_settings` table
    - Add policy for admin users to read all settings
    - Add policy for admin users to update settings
    - Add policy for authenticated users to read specific settings

  3. Default Settings
    - Insert default settings for login and tracking
*/

-- Create admin settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users
);

-- Enable Row Level Security
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Allow admin users to read all settings
CREATE POLICY "Admin users can read all settings"
  ON admin_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Allow admin users to update settings
CREATE POLICY "Admin users can update settings"
  ON admin_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Allow admin users to insert settings
CREATE POLICY "Admin users can insert settings"
  ON admin_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM business_profiles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Allow all authenticated users to read public settings
CREATE POLICY "All users can read public settings"
  ON admin_settings
  FOR SELECT
  TO authenticated
  USING (
    key IN ('login_enabled', 'tracking_enabled')
  );

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON admin_settings
FOR EACH ROW
EXECUTE FUNCTION update_admin_settings_updated_at();

-- Insert default settings
INSERT INTO admin_settings (key, value, description)
VALUES 
  ('login_enabled', 'true', 'Enable or disable user login functionality'),
  ('tracking_enabled', 'true', 'Enable or disable user engagement tracking')
ON CONFLICT (key) DO NOTHING;