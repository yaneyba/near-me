// Admin User Setup Script
// This script creates an admin user in Supabase and sets the appropriate role

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
    console.log('🔐 Admin User Setup Script');
    console.log('==========================');
    console.log('This script will create an admin user in your Supabase project.\n');

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
    const businessName = await prompt('Enter business name (or "Admin"): ') || 'Admin';
    
    if (!email || !password) {
      console.error('❌ Email and password are required');
      return;
    }

    console.log('\n🔄 Creating admin user...');
    
    // Create user with Supabase Auth
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Skip email confirmation
    });

    if (userError) {
      console.error('❌ Error creating user:', userError.message);
      return;
    }

    console.log('✅ User created successfully');
    console.log(`📧 Email: ${email}`);
    
    // Create admin profile
    const { data: profileData, error: profileError } = await supabase
      .from('business_profiles')
      .insert({
        user_id: userData.user.id,
        business_name: businessName,
        email: email,
        role: 'admin' // Set role to admin
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creating admin profile:', profileError.message);
      return;
    }

    console.log('✅ Admin profile created successfully');
    console.log(`👤 User ID: ${userData.user.id}`);
    console.log(`👑 Role: admin`);
    
    console.log('\n🎉 Admin user setup complete!');
    console.log('You can now log in with the provided email and password.');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  } finally {
    rl.close();
  }
}

createAdminUser();