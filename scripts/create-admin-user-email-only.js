// CORRECTED Admin User Setup Script - Email-Only Approach
// This script creates ONLY the auth user, no business_profiles entry
// Admins are detected by email, not database role

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
    console.log('🔐 Admin User Setup Script (Email-Only Approach)');
    console.log('================================================');
    console.log('This script creates an admin user in Supabase Auth ONLY.');
    console.log('No business_profiles entry is created (admins are not businesses).\n');

    // Get Supabase credentials
    const supabaseUrl = await prompt('Enter your Supabase URL: ');
    const supabaseServiceKey = await prompt('Enter your Supabase service role key: ');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Supabase URL and service role key are required');
      return;
    }

    // Create Supabase client with service role key (admin privileges)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get admin user details
    const email = await prompt('Enter admin email: ');
    const password = await prompt('Enter admin password: ');
    
    if (!email || !password) {
      console.error('❌ Email and password are required');
      return;
    }

    console.log('\n🔄 Creating admin user in Supabase Auth...');
    
    // Create user with Supabase Auth ONLY
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Skip email confirmation
    });

    if (userError) {
      console.error('❌ Error creating user:', userError.message);
      return;
    }

    console.log('✅ Admin user created successfully in Supabase Auth');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 User ID: ${userData.user.id}`);
    
    console.log('\n📝 IMPORTANT: Next Steps Required');
    console.log('================================');
    console.log('1. Add this email to the admin list in src/lib/auth.ts:');
    console.log(`   const adminEmails = ['yaneyba@finderhubs.com', '${email}'];`);
    console.log('');
    console.log('2. If different from code, update the database function:');
    console.log(`   UPDATE is_admin_user() to include '${email}'`);
    console.log('');
    console.log('3. No business_profiles entry was created (this is correct!)');
    console.log('   Admins are detected by email, not database role.');
    
    console.log('\n🎉 Admin user setup complete!');
    console.log('You can now log in with the provided email and password once the email is added to the admin list.');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  } finally {
    rl.close();
  }
}

createAdminUser();
