/*
  # Create contact messages and business submissions tables

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `category` (text, nullable) - Business category context
      - `city` (text, nullable) - City context
      - `status` (text) - Message status: new, in_progress, resolved
      - `admin_notes` (text, nullable) - Internal notes
      - `resolved_at` (timestamptz, nullable)
      - `resolved_by` (text, nullable) - Admin who resolved
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `business_submissions`
      - `id` (uuid, primary key)
      - `business_name` (text)
      - `owner_name` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `category` (text)
      - `website` (text, nullable)
      - `description` (text, nullable)
      - `services` (text array, nullable)
      - `hours` (jsonb, nullable)
      - `status` (submission_status) - pending, approved, rejected
      - `submitted_at` (timestamptz)
      - `reviewed_at` (timestamptz, nullable)
      - `reviewer_notes` (text, nullable)
      - `site_id` (text) - For multi-site support
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public insert and admin management
    - Add policies for users to view their own submissions
*/

-- Create submission status enum
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  category text,
  city text,
  status text DEFAULT 'new',
  admin_notes text,
  resolved_at timestamptz,
  resolved_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create business_submissions table
CREATE TABLE IF NOT EXISTS business_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  owner_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  category text NOT NULL,
  website text,
  description text,
  services text[],
  hours jsonb,
  status submission_status DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewer_notes text,
  site_id text NOT NULL DEFAULT 'near-me-us',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_submissions ENABLE ROW LEVEL SECURITY;

-- Contact messages policies
CREATE POLICY "Allow anon insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert contact messages"
  ON contact_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (email = (jwt() ->> 'email'));

CREATE POLICY "Admins can manage all contact messages"
  ON contact_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = uid() 
      AND (users.raw_app_meta_data ->> 'role') = 'admin'
    )
  );

-- Business submissions policies
CREATE POLICY "Public can submit businesses"
  ON business_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert submissions"
  ON business_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own submissions"
  ON business_submissions
  FOR SELECT
  TO authenticated
  USING (email = (jwt() ->> 'email'));

CREATE POLICY "Admins can view all submissions"
  ON business_submissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = uid() 
      AND (users.raw_app_meta_data ->> 'role') = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages (email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_category ON contact_messages (category);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_business_submissions_email ON business_submissions (email);
CREATE INDEX IF NOT EXISTS idx_business_submissions_status ON business_submissions (status);
CREATE INDEX IF NOT EXISTS idx_business_submissions_site_id ON business_submissions (site_id);
CREATE INDEX IF NOT EXISTS idx_business_submissions_submitted_at ON business_submissions (submitted_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_submissions_updated_at
  BEFORE UPDATE ON business_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create notification functions for new submissions
CREATE OR REPLACE FUNCTION notify_new_contact_message()
RETURNS TRIGGER AS $$
BEGIN
  -- In a real implementation, this could send notifications
  -- For now, just log the event
  RAISE NOTICE 'New contact message from: %', NEW.email;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION notify_new_business_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- In a real implementation, this could send notifications
  -- For now, just log the event
  RAISE NOTICE 'New business submission: %', NEW.business_name;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add notification triggers
CREATE TRIGGER trigger_notify_new_contact_message
  AFTER INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_contact_message();

CREATE TRIGGER trigger_notify_new_business_submission
  AFTER INSERT ON business_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_business_submission();