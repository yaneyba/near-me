#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jeofyinldjyuouppgxhi.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb2Z5aW5sZGp5dW91cHBneGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTkyNTYsImV4cCI6MjA2NTc5NTI1Nn0._jjFXt-GPNQMJFmOnUB2VC8mMJVAckfRQNOHlq9jvu4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addAdsSettingViaUpsert() {
  console.log('🔄 Adding ads_enabled setting via upsert...\n');

  try {
    // Try to upsert the ads_enabled setting
    const { data, error } = await supabase
      .from('admin_settings')
      .upsert({
        key: 'ads_enabled',
        value: false,
        description: 'Enable or disable advertisements on the site'
      }, {
        onConflict: 'key'
      })
      .select();

    if (error) {
      console.error('❌ Upsert failed:', error);
      
      // Try update instead
      console.log('🔄 Trying update instead...');
      const { data: updateData, error: updateError } = await supabase
        .from('admin_settings')
        .update({
          value: false,
          description: 'Enable or disable advertisements on the site'
        })
        .eq('key', 'ads_enabled')
        .select();

      if (updateError) {
        console.error('❌ Update also failed:', updateError);
        return;
      }

      console.log('✅ Update successful:', updateData);
    } else {
      console.log('✅ Upsert successful:', data);
    }

    // Verify all settings
    console.log('\n📋 Current admin settings:');
    const { data: allSettings, error: fetchError } = await supabase
      .from('admin_settings')
      .select('*')
      .order('key');

    if (fetchError) {
      console.error('❌ Error fetching settings:', fetchError);
      return;
    }

    console.log('Found', allSettings?.length || 0, 'settings:');
    allSettings?.forEach(setting => {
      console.log(`   • ${setting.key}: ${setting.value} (${typeof setting.value})`);
    });

    console.log('\n✅ Ads setting added to admin settings!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

addAdsSettingViaUpsert();
