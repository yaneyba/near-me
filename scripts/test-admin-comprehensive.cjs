/**
 * Test admin settings functionality by logging in as admin and managing settings
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Admin credentials from .env
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseAnonKey || !adminEmail || !adminPassword) {
  console.error('Missing configuration. Need VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, ADMIN_EMAIL, ADMIN_PASSWORD');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminSettings() {
  try {
    console.log('🔐 Testing Admin Settings Functionality...\n');
    
    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });
    
    if (authError) {
      console.error('❌ Admin login failed:', authError.message);
      return;
    }
    
    console.log('✅ Admin logged in successfully');
    console.log(`   User ID: ${authData.user.id}`);
    console.log(`   Email: ${authData.user.email}\n`);
    
    // Step 2: Check admin profile
    console.log('2. Checking admin profile...');
    const { data: profile, error: profileError } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Error fetching admin profile:', profileError);
      return;
    }
    
    console.log('✅ Admin profile found:');
    console.log(`   Role: ${profile.role}`);
    console.log(`   Business ID: ${profile.business_id}`);
    console.log(`   Business Name: ${profile.business_name}\n`);
    
    if (profile.role !== 'admin') {
      console.error('❌ User is not an admin. Cannot proceed with admin settings test.');
      return;
    }
    
    // Step 3: Try to read all admin settings (admin can read all)
    console.log('3. Reading all admin settings (admin access)...');
    const { data: allSettings, error: readAllError } = await supabase
      .from('admin_settings')
      .select('*');
    
    if (readAllError) {
      console.error('❌ Error reading all settings:', readAllError);
    } else {
      console.log('✅ All admin settings:');
      if (allSettings.length === 0) {
        console.log('   No settings found - will create defaults');
      } else {
        allSettings.forEach(setting => {
          console.log(`   ${setting.key}: ${JSON.stringify(setting.value)} (${setting.description})`);
        });
      }
    }
    console.log('');
    
    // Step 4: Insert default settings if they don't exist
    console.log('4. Ensuring default settings exist...');
    const defaultSettings = [
      {
        key: 'login_enabled',
        value: true,
        description: 'Enable or disable user login functionality'
      },
      {
        key: 'tracking_enabled',
        value: true,
        description: 'Enable or disable user engagement tracking'
      }
    ];
    
    for (const defaultSetting of defaultSettings) {
      const exists = allSettings?.find(s => s.key === defaultSetting.key);
      
      if (!exists) {
        console.log(`   Inserting ${defaultSetting.key}...`);
        const { data: insertData, error: insertError } = await supabase
          .from('admin_settings')
          .insert(defaultSetting)
          .select();
        
        if (insertError) {
          console.error(`   ❌ Error inserting ${defaultSetting.key}:`, insertError);
        } else {
          console.log(`   ✅ Inserted ${defaultSetting.key}`);
        }
      } else {
        console.log(`   ✅ ${defaultSetting.key} already exists`);
      }
    }
    console.log('');
    
    // Step 5: Test updating settings
    console.log('5. Testing setting updates...');
    
    // Toggle login_enabled
    const { data: updateData, error: updateError } = await supabase
      .from('admin_settings')
      .update({ 
        value: false,
        updated_at: new Date().toISOString(),
        updated_by: authData.user.id
      })
      .eq('key', 'login_enabled')
      .select();
    
    if (updateError) {
      console.error('   ❌ Error updating login_enabled:', updateError);
    } else {
      console.log('   ✅ Successfully updated login_enabled to false');
    }
    
    // Toggle it back
    const { data: updateBackData, error: updateBackError } = await supabase
      .from('admin_settings')
      .update({ 
        value: true,
        updated_at: new Date().toISOString(),
        updated_by: authData.user.id
      })
      .eq('key', 'login_enabled')
      .select();
    
    if (updateBackError) {
      console.error('   ❌ Error updating login_enabled back:', updateBackError);
    } else {
      console.log('   ✅ Successfully updated login_enabled back to true');
    }
    console.log('');
    
    // Step 6: Test public access (logout and check public settings)
    console.log('6. Testing public access to settings...');
    await supabase.auth.signOut();
    
    const { data: publicSettings, error: publicError } = await supabase
      .from('admin_settings')
      .select('*')
      .in('key', ['login_enabled', 'tracking_enabled']);
    
    if (publicError) {
      console.error('   ❌ Error reading public settings:', publicError);
    } else {
      console.log('   ✅ Public settings accessible:');
      publicSettings.forEach(setting => {
        console.log(`     ${setting.key}: ${JSON.stringify(setting.value)}`);
      });
    }
    
    console.log('\n🎉 Admin Settings Test Complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdminSettings();
