-- MIGRATION: Enhance contact_messages table with new fields
-- This safely adds new columns to the existing table without losing data
-- Run this script to update your existing contact_messages table

-- Step 1: Add missing columns to contact_messages table
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS subject TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new',
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS resolved_by TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 2: Update subject column to be NOT NULL with default value for existing rows
UPDATE contact_messages SET subject = 'Contact Form Submission' WHERE subject IS NULL;
ALTER TABLE contact_messages ALTER COLUMN subject SET NOT NULL;

-- Step 3: Remove site_id column if it exists (since new schema doesn't use it)
ALTER TABLE contact_messages DROP COLUMN IF EXISTS site_id;

-- Step 4: Add new indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_category ON contact_messages(category);

-- Step 5: Add updated_at trigger
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Add table comments
COMMENT ON TABLE contact_messages IS 'Stores contact form submissions from users';
COMMENT ON COLUMN contact_messages.category IS 'Business category context when message was sent';
COMMENT ON COLUMN contact_messages.city IS 'City context when message was sent';
COMMENT ON COLUMN contact_messages.status IS 'Message status: new, in_progress, resolved';
COMMENT ON COLUMN contact_messages.admin_notes IS 'Internal notes for admin use';
COMMENT ON COLUMN contact_messages.resolved_by IS 'Admin user who resolved the message';

-- Step 7: Update RLS policies (drop old ones and create new ones)
DROP POLICY IF EXISTS "Anonymous users can submit contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Anyone can create contact_messages" ON contact_messages;
DROP POLICY IF EXISTS "Service role can manage contact_messages" ON contact_messages;

-- Create new policies
CREATE POLICY "Anonymous users can submit contact messages" ON contact_messages
    AS PERMISSIVE FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Service role can manage contact_messages" ON contact_messages
    FOR ALL USING (auth.role() = 'service_role');

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'contact_messages' 
ORDER BY ordinal_position;
