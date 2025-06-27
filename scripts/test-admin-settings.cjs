/**
 * Script to test admin settings database operations
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminSettings() {
  console.log('🧪 Testing Admin Settings Database Operations\n');

  try {
    // Test 1: Read current settings
    console.log('1️⃣ Reading current settings from database...');
    const { data: settings, error: readError } = await supabase
      .from('admin_settings')
      .select('*')
      .in('key', ['login_enabled', 'tracking_enabled']);

    if (readError) {
      console.log('❌ Read Error:', readError.message);
      if (readError.message.includes('relation "admin_settings" does not exist')) {
        console.log('💡 The admin_settings table doesn\'t exist. Run migrations first.');
        return;
      }
    } else {
      console.log('✅ Read Success:');
      if (settings && settings.length > 0) {
        settings.forEach(setting => {
          console.log(`   ${setting.key}: ${JSON.stringify(setting.value)} (${setting.description})`);
        });
      } else {
        console.log('   No settings found');
      }
    }

    console.log('');

    // Test 2: Try to read all settings (should fail due to RLS if not admin)
    console.log('2️⃣ Trying to read ALL settings (should be restricted by RLS)...');
    const { data: allSettings, error: allError } = await supabase
      .from('admin_settings')
      .select('*');

    if (allError) {
      console.log('❌ Read All Error (expected for non-admin):', allError.message);
    } else {
      console.log('✅ Read All Success:');
      if (allSettings && allSettings.length > 0) {
        allSettings.forEach(setting => {
          console.log(`   ${setting.key}: ${JSON.stringify(setting.value)}`);
        });
      }
    }

    console.log('');

    // Test 3: Try to update settings (should fail for non-admin)
    console.log('3️⃣ Trying to update settings (should fail for non-admin)...');
    const { error: updateError } = await supabase
      .from('admin_settings')
      .update({ value: false })
      .eq('key', 'login_enabled');

    if (updateError) {
      console.log('❌ Update Error (expected for non-admin):', updateError.message);
    } else {
      console.log('✅ Update Success (unexpected - RLS may not be working)');
    }

    console.log('');

    // Test 4: Check if migrations are applied
    console.log('4️⃣ Checking table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('admin_settings')
      .select('id, key, value, description, created_at, updated_at')
      .limit(1);

    if (tableError) {
      console.log('❌ Table structure error:', tableError.message);
    } else {
      console.log('✅ Table structure is correct');
      if (tableInfo && tableInfo.length > 0) {
        console.log('   Sample row structure:', Object.keys(tableInfo[0]));
      }
    }

    console.log('\n🎯 Test Summary:');
    console.log('- Public settings should be readable ✅');
    console.log('- Admin-only settings should be blocked ❌ (for non-admin users)');
    console.log('- Updates should be blocked ❌ (for non-admin users)');
    console.log('- Table structure should be correct ✅');

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testAdminSettings();
