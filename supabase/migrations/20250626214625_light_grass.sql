/*
  # Create user engagement events table

  1. New Tables
    - `user_engagement_events`
      - `id` (uuid, primary key)
      - `business_id` (text, not null) - Reference to business being tracked
      - `business_name` (text, not null) - Business name for easier querying
      - `event_type` (text, not null) - Type of engagement event
      - `event_data` (jsonb) - Additional event metadata
      - `timestamp` (timestamptz, default now()) - When the event occurred
      - `ip_address` (text) - User's IP address for analytics
      - `user_session_id` (text, not null) - Session identifier for unique user tracking
      - `created_at` (timestamptz, default now()) - Record creation timestamp

  2. Security
    - Enable RLS on `user_engagement_events` table
    - Add policy to allow anonymous users to insert engagement events
    - This allows tracking without requiring user authentication

  3. Indexes
    - Add indexes for common query patterns (business_id, timestamp, event_type)
*/

CREATE TABLE IF NOT EXISTS user_engagement_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id text NOT NULL,
  business_name text NOT NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  timestamp timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_session_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_engagement_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert engagement events
-- This is necessary for tracking user interactions without authentication
CREATE POLICY "Allow anonymous insert for user engagement events"
  ON user_engagement_events
  FOR INSERT
  WITH CHECK (true);

-- Allow reading engagement events for analytics (authenticated users only)
CREATE POLICY "Allow authenticated users to read engagement events"
  ON user_engagement_events
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_engagement_events_business_id 
  ON user_engagement_events(business_id);

CREATE INDEX IF NOT EXISTS idx_user_engagement_events_timestamp 
  ON user_engagement_events(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_user_engagement_events_event_type 
  ON user_engagement_events(event_type);

CREATE INDEX IF NOT EXISTS idx_user_engagement_events_session_id 
  ON user_engagement_events(user_session_id);

-- Composite index for common analytics queries
CREATE INDEX IF NOT EXISTS idx_user_engagement_events_business_timestamp 
  ON user_engagement_events(business_id, timestamp DESC);