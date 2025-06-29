/**
 * Script to check admin settings in the database
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAdminSettings() {
  try {
    console.log('Checking admin_settings table...');
    
    // Get all admin settings (these should be readable by public policy)
    const { data: settings, error } = await supabase
      .from('admin_settings')
      .select('*')
      .in('key', ['login_enabled', 'tracking_enabled']);
    
    if (error) {
      console.error('Error fetching admin settings:', error);
      console.log('This might be expected if the table doesn\'t exist yet or RLS is blocking access');
      return;
    }
    
    if (!settings || settings.length === 0) {
      console.log('No public admin settings found. They should be created by the migration.');
      console.log('The settings might exist but not be accessible via the anon key.');
      return;
    }
    
    console.log('Current public admin settings:');
    settings.forEach(setting => {
      console.log(`  ${setting.key}: ${JSON.stringify(setting.value)} (${setting.description})`);
    });
    
    console.log('✅ Admin settings check complete');
    
  } catch (error) {
    console.error('Error checking admin settings:', error);
  }
}

checkAdminSettings();
