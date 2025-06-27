/**
 * Script to check admin settings in the database
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAdminSettings() {
  try {
    console.log('Checking admin_settings table...');
    
    // Get all admin settings
    const { data: settings, error } = await supabase
      .from('admin_settings')
      .select('*');
    
    if (error) {
      console.error('Error fetching admin settings:', error);
      return;
    }
    
    if (settings.length === 0) {
      console.log('No admin settings found. They should be created by the migration.');
      return;
    }
    
    console.log('Current admin settings:');
    settings.forEach(setting => {
      console.log(`  ${setting.key}: ${JSON.stringify(setting.value)} (${setting.description})`);
    });
    
    console.log('✅ Admin settings check complete');
    
  } catch (error) {
    console.error('Error checking admin settings:', error);
  }
}

checkAdminSettings();
