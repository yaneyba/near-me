#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Use environment variables from .env
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jeofyinldjyuouppgxhi.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implb2Z5aW5sZGp5dW91cHBneGhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTkyNTYsImV4cCI6MjA2NTc5NTI1Nn0._jjFXt-GPNQMJFmOnUB2VC8mMJVAckfRQNOHlq9jvu4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupAdsSettings() {
  console.log('🎯 Setting up ads settings in admin_settings table...\n');

  try {
    // Check if ads_enabled setting exists
    const { data: existingAds, error: checkError } = await supabase
      .from('admin_settings')
      .select('*')
      .eq('key', 'ads_enabled')
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking existing ads setting:', checkError);
      return;
    }

    if (existingAds) {
      console.log('✅ ads_enabled setting already exists:', existingAds);
    } else {
      console.log('📝 Creating ads_enabled setting...');
      
      const { data: insertData, error: insertError } = await supabase
        .from('admin_settings')
        .insert({
          key: 'ads_enabled',
          value: false,
          description: 'Controls whether advertisements are displayed on the site'
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error inserting ads setting:', insertError);
        return;
      }

      console.log('✅ Successfully created ads_enabled setting:', insertData);
    }

    // Verify all admin settings
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

    console.log('\n✅ Ads settings setup complete!');
    console.log('\n📝 All VITE_SETTINGS_ environment variables:');
    console.log('   • VITE_SETTINGS_ENABLE_ADS=false → ads_enabled');
    console.log('   • VITE_SETTINGS_AUTH_LOGIN_ENABLED=true → login_enabled');
    console.log('   • VITE_SETTINGS_ENABLE_TRACKING=true → tracking_enabled');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

setupAdsSettings();
