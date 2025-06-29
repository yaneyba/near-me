// Admin User Setup Script (Auth Only)
// This script creates an admin user in Supabase auth.users with admin role

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt for input
const prompt = (question) => new Promise((resolve) => {
  rl.question(question, (answer) => resolve(answer));
});

async function createAdminUser() {
  try {
    console.log('🔐 Admin User Setup Script (Auth Only)');
    console.log('=====================================');
    console.log('This script will create an admin user in Supabase auth.users only.\n');

    // Supabase credentials (hardcoded)
    const supabaseUrl = 'https://jeofyinldjyuouppgxhi.supabase.co';
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb2Z5aW5sZGp5dW91cHBneGhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDIxOTI1NiwiZXhwIjoyMDY1Nzk1MjU2fQ.y6-sOndGKobfBgIcxkfwml3uxtJt3z_yjs_s91Mmdds';
    


    // Create Supabase client with service role key (admin privileges)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get admin user details
    const email = await prompt('Enter admin email: ');
    const password = await prompt('Enter admin password: ');
    
    if (!email || !password) {
      console.error('❌ Email and password are required');
      return;
    }

    console.log('\n🔄 Creating admin user...');
    
    // Create user with Supabase Auth and set admin role
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
      user_metadata: {
        role: 'admin' // Set role in user metadata
      }
    });

    if (userError) {
      console.error('❌ Error creating user:', userError.message);
      return;
    }

    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 User ID: ${userData.user.id}`);
    console.log(`👑 Role: admin (stored in user_metadata)`);
    
    console.log('\n🎉 Admin user setup complete!');
    console.log('You can now log in with the provided email and password.');
    console.log('The admin role is stored in the user\'s metadata.');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  } finally {
    rl.close();
  }
}

createAdminUser();