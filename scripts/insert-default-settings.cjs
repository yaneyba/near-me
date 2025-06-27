/**
 * Script to insert default admin settings
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertDefaultSettings() {
  console.log('📥 Inserting default admin settings...\n');

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
    },
    {
      key: 'ads_enabled',
      value: false,
      description: 'Enable or disable advertisements on the site'
    }
  ];

  try {
    for (const setting of defaultSettings) {
      console.log(`Inserting ${setting.key}...`);
      
      const { data, error } = await supabase
        .from('admin_settings')
        .insert(setting)
        .select();

      if (error) {
        if (error.message.includes('duplicate key')) {
          console.log(`   ⚠️ ${setting.key} already exists, updating instead...`);
          
          const { error: updateError } = await supabase
            .from('admin_settings')
            .update({ 
              value: setting.value,
              description: setting.description 
            })
            .eq('key', setting.key);

          if (updateError) {
            console.log(`   ❌ Update failed: ${updateError.message}`);
          } else {
            console.log(`   ✅ Updated ${setting.key}`);
          }
        } else {
          console.log(`   ❌ Insert failed: ${error.message}`);
        }
      } else {
        console.log(`   ✅ Inserted ${setting.key}`);
        console.log(`   📄 Data:`, data);
      }
    }

    // Verify the insertion
    console.log('\n🔍 Verifying inserted settings...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('admin_settings')
      .select('*')
      .in('key', ['login_enabled', 'tracking_enabled']);

    if (verifyError) {
      console.log('❌ Verification failed:', verifyError.message);
    } else {
      console.log('✅ Current settings in database:');
      verifyData.forEach(setting => {
        console.log(`   ${setting.key}: ${JSON.stringify(setting.value)} (${setting.description})`);
      });
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

insertDefaultSettings();
