// Test script to create sample contact messages with the new enhanced schema
// Run this with: node test-contact-messages.js

const { createClient } = require('@supabase/supabase-js');

// You'll need to add your Supabase URL and anon key here
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleMessages = [
  {
    name: 'John Smith',
    email: 'john.smith@email.com',
    subject: 'Question about nail salon services',
    message: 'Hi, I was wondering what types of nail art services you offer. Do you do gel manicures?',
    category: 'nail-salons',
    city: 'denver',
    status: 'new'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.j@gmail.com',
    subject: 'Business listing inquiry',
    message: 'I own a nail salon and would like to get listed on your directory. How do I go about this?',
    category: 'nail-salons',
    city: 'boulder',
    status: 'in_progress',
    admin_notes: 'Sent initial response with listing instructions'
  },
  {
    name: 'Mike Davis',
    email: 'mike@example.com',
    subject: 'Website feedback',
    message: 'Great website! Found exactly what I was looking for. Thanks!',
    category: null,
    city: 'denver',
    status: 'resolved',
    resolved_by: 'admin',
    resolved_at: new Date().toISOString(),
    admin_notes: 'Positive feedback - no action needed'
  }
];

async function createTestMessages() {
  console.log('Creating test contact messages...');
  
  for (const message of sampleMessages) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert(message)
        .select('id');
      
      if (error) {
        console.error('Error creating message:', error);
      } else {
        console.log('Created message:', data[0].id);
      }
    } catch (err) {
      console.error('Failed to create message:', err);
    }
  }
  
  console.log('Done!');
}

createTestMessages();
