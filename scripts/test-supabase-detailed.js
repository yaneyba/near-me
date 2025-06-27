#!/usr/bin/env node

// Test Supabase connection and verify schema
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('business_profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    return false;
  }
}

async function checkTables() {
  console.log('\n🔍 Checking required tables...\n');
  
  const requiredTables = [
    'business_profiles',
    'business_submissions', 
    'contact_messages',
    'businesses'
  ];
  
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`❌ Table '${table}' does not exist`);
        } else {
          console.log(`⚠️  Table '${table}' exists but has issues:`, error.message);
        }
      } else {
        console.log(`✅ Table '${table}' exists and accessible`);
      }
    } catch (error) {
      console.log(`❌ Error checking table '${table}':`, error.message);
    }
  }
}

async function checkServiceRoleKey() {
  console.log('\n🔍 Validating service role key...\n');
  
  try {
    // Try to decode the JWT to check if it's valid
    const token = supabaseServiceKey;
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.log('❌ Service role key format is invalid');
      return false;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    console.log('Service role key payload:', payload);
    
    if (payload.role === 'service_role') {
      console.log('✅ Service role key appears valid');
      return true;
    } else {
      console.log('❌ Service role key does not have service_role permission');
      console.log('Found role:', payload.role);
      return false;
    }
  } catch (error) {
    console.log('❌ Error decoding service role key:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Supabase Connection Test\n');
  console.log('URL:', supabaseUrl);
  console.log('Service Key (first 20 chars):', supabaseServiceKey.substring(0, 20) + '...\n');
  
  const keyValid = await checkServiceRoleKey();
  
  if (!keyValid) {
    console.log('\n❌ Please get a fresh service role key from:');
    console.log(`https://supabase.com/dashboard/project/jeofyinldjyuouppgxhi/settings/api`);
    process.exit(1);
  }
  
  const connected = await testConnection();
  
  if (connected) {
    await checkTables();
  }
  
  console.log('\n📝 Next steps:');
  console.log('1. If tables are missing, run the manual migration in Supabase SQL Editor');
  console.log('2. Use docs/MANUAL-MIGRATION.sql for the complete schema');
  console.log('3. Test the admin dashboard at http://localhost:5173/admin');
}

main().catch(console.error);
