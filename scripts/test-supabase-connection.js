// Test Supabase connection and check if tables exist
import { supabase } from '../src/lib/supabase.js';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    console.log('✅ Supabase client connection successful');
    
    // Test if business_submissions table exists
    const { data: submissions, error: submissionsError } = await supabase
      .from('business_submissions')
      .select('count')
      .limit(1);
    
    if (submissionsError) {
      console.log('❌ business_submissions table error:', submissionsError.message);
      console.log('   This is normal if the migration hasn\'t been run yet');
    } else {
      console.log('✅ business_submissions table exists');
    }
    
    // Test if business_profiles table exists
    const { data: profiles, error: profilesError } = await supabase
      .from('business_profiles')
      .select('count')
      .limit(1);
    
    if (profilesError) {
      console.log('❌ business_profiles table error:', profilesError.message);
    } else {
      console.log('✅ business_profiles table exists');
    }
    
    // Test if admin_settings table exists
    const { data: settings, error: settingsError } = await supabase
      .from('admin_settings')
      .select('count')
      .limit(1);
    
    if (settingsError) {
      console.log('❌ admin_settings table error:', settingsError.message);
      console.log('   This is normal if the migration hasn\'t been run yet');
    } else {
      console.log('✅ admin_settings table exists');
    }
    
    // Test if contact_messages table exists (should exist from before)
    const { data: messages, error: messagesError } = await supabase
      .from('contact_messages')
      .select('count')
      .limit(1);
    
    if (messagesError) {
      console.log('❌ contact_messages table error:', messagesError.message);
    } else {
      console.log('✅ contact_messages table exists');
    }
    
  } catch (error) {
    console.error('❌ Fatal error testing Supabase:', error);
  }
}

// Run the test
testSupabaseConnection();
