// Business Owner User Creation Script
// This script creates a business owner user in Supabase with access to the business dashboard

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

async function createBusinessOwner() {
  try {
    console.log('👤 Business Owner User Setup Script');
    console.log('==================================');
    console.log('This script will create a business owner user in your Supabase project.\n');

    // Get Supabase credentials
    const supabaseUrl = await prompt('Enter your Supabase URL: ');
    const supabaseServiceKey = await prompt('Enter your Supabase service role key: ');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Supabase URL and service role key are required');
      return;
    }

    // Create Supabase client with service role key (admin privileges)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get business owner details
    const email = await prompt('Enter business owner email: ');
    const password = await prompt('Enter business owner password: ');
    const businessName = await prompt('Enter business name: ');
    const businessId = await prompt('Enter business ID (e.g., nail-salons-dallas-01): ');
    
    if (!email || !password || !businessName) {
      console.error('❌ Email, password, and business name are required');
      return;
    }

    console.log('\n🔄 Creating business owner user...');
    
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
    
    // Create business owner profile
    const { data: profileData, error: profileError } = await supabase
      .from('business_profiles')
      .insert({
        user_id: userData.user.id,
        business_id: businessId || null,
        business_name: businessName,
        email: email,
        role: 'owner' // Set role to owner
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creating business owner profile:', profileError.message);
      return;
    }

    console.log('✅ Business owner profile created successfully');
    console.log(`👤 User ID: ${userData.user.id}`);
    console.log(`🏢 Business: ${businessName}`);
    console.log(`🔑 Role: owner`);
    
    console.log('\n🎉 Business owner setup complete!');
    console.log('The user can now log in with the provided email and password to access the business dashboard.');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  } finally {
    rl.close();
  }
}

createBusinessOwner();