#!/usr/bin/env node

/**
 * Supabase to D1 Migration Script
 * 
 * This script migrates data from Supabase to Cloudflare D1 while preserving:
 * - Data integrity
 * - Relationships between tables
 * - Data type compatibility
 * 
 * Environment Variables Required:
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import path from 'path';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const D1_DATABASE_NAME = 'nearme-db';
const D1_DATABASE_ID = '86879c31-0686-4532-a66c-f310b89d7a27';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - VITE_SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// D1 Schema for near-me platform
const D1_SCHEMA = `
-- D1 Database Schema for Near-Me Platform
-- Migrated from Supabase with data type optimizations

-- Business Submissions Table
CREATE TABLE IF NOT EXISTS business_submissions (
    id TEXT PRIMARY KEY,
    business_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    category TEXT NOT NULL,
    website TEXT,
    description TEXT,
    services TEXT, -- JSON array as TEXT
    hours TEXT, -- JSON object as TEXT
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    submitted_at TEXT DEFAULT (datetime('now')),
    reviewed_at TEXT,
    reviewer_notes TEXT,
    site_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT,
    city TEXT,
    status TEXT DEFAULT 'new',
    admin_notes TEXT,
    resolved_at TEXT,
    resolved_by TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Business Profiles Table
CREATE TABLE IF NOT EXISTS business_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    business_id TEXT,
    business_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    category TEXT,
    website TEXT,
    description TEXT,
    services TEXT, -- JSON array as TEXT
    hours TEXT, -- JSON object as TEXT
    role TEXT DEFAULT 'owner',
    subscription_status TEXT DEFAULT 'not_started',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    subscription_start_date TEXT,
    subscription_end_date TEXT,
    trial_end_date TEXT,
    site_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Businesses Table (Public Directory)
CREATE TABLE IF NOT EXISTS businesses (
    id TEXT PRIMARY KEY,
    business_id TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    website TEXT,
    category TEXT NOT NULL,
    services TEXT, -- JSON array as TEXT
    hours TEXT, -- JSON object as TEXT
    rating REAL DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    image TEXT,
    logo_url TEXT,
    established INTEGER,
    verified INTEGER DEFAULT 0, -- 0 = false, 1 = true
    premium INTEGER DEFAULT 0, -- 0 = false, 1 = true
    status TEXT DEFAULT 'active',
    site_id TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- User Engagement Events Table
CREATE TABLE IF NOT EXISTS user_engagement_events (
    id TEXT PRIMARY KEY,
    business_id TEXT,
    event_type TEXT NOT NULL,
    event_data TEXT, -- JSON object as TEXT
    timestamp TEXT DEFAULT (datetime('now')),
    user_agent TEXT,
    ip_address TEXT,
    session_id TEXT
);

-- Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
    id TEXT PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL, -- JSON as TEXT
    description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Stripe Orders Table
CREATE TABLE IF NOT EXISTS stripe_orders (
    id TEXT PRIMARY KEY,
    business_profile_id TEXT,
    stripe_session_id TEXT UNIQUE NOT NULL,
    stripe_payment_intent_id TEXT,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'pending',
    metadata TEXT, -- JSON as TEXT
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_submissions_status ON business_submissions(status);
CREATE INDEX IF NOT EXISTS idx_business_submissions_site_id ON business_submissions(site_id);
CREATE INDEX IF NOT EXISTS idx_business_submissions_email ON business_submissions(email);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_site_id ON business_profiles(site_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_email ON business_profiles(email);

CREATE INDEX IF NOT EXISTS idx_businesses_business_id ON businesses(business_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_site_id ON businesses(site_id);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);

CREATE INDEX IF NOT EXISTS idx_user_engagement_events_business_id ON user_engagement_events(business_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_events_timestamp ON user_engagement_events(timestamp);

CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(setting_key);
`;

// Table mapping with data transformations
const TABLES_TO_MIGRATE = [
  {
    name: 'business_submissions',
    supabaseTable: 'business_submissions',
    transformRow: (row) => ({
      ...row,
      id: row.id || generateId(),
      services: Array.isArray(row.services) ? JSON.stringify(row.services) : row.services || '[]',
      hours: typeof row.hours === 'object' ? JSON.stringify(row.hours) : row.hours || '{}',
      submitted_at: row.submitted_at ? new Date(row.submitted_at).toISOString() : new Date().toISOString(),
      reviewed_at: row.reviewed_at ? new Date(row.reviewed_at).toISOString() : null,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    })
  },
  {
    name: 'contact_messages',
    supabaseTable: 'contact_messages',
    transformRow: (row) => ({
      ...row,
      id: row.id || generateId(),
      resolved_at: row.resolved_at ? new Date(row.resolved_at).toISOString() : null,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    })
  },
  {
    name: 'business_profiles',
    supabaseTable: 'business_profiles',
    transformRow: (row) => ({
      ...row,
      id: row.id || generateId(),
      services: Array.isArray(row.services) ? JSON.stringify(row.services) : row.services || '[]',
      hours: typeof row.hours === 'object' ? JSON.stringify(row.hours) : row.hours || '{}',
      subscription_start_date: row.subscription_start_date ? new Date(row.subscription_start_date).toISOString() : null,
      subscription_end_date: row.subscription_end_date ? new Date(row.subscription_end_date).toISOString() : null,
      trial_end_date: row.trial_end_date ? new Date(row.trial_end_date).toISOString() : null,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    })
  },
  {
    name: 'businesses',
    supabaseTable: 'businesses',
    transformRow: (row) => ({
      ...row,
      id: row.id || generateId(),
      services: Array.isArray(row.services) ? JSON.stringify(row.services) : row.services || '[]',
      hours: typeof row.hours === 'object' ? JSON.stringify(row.hours) : row.hours || '{}',
      verified: row.verified ? 1 : 0, // Convert boolean to integer
      premium: row.premium ? 1 : 0, // Convert boolean to integer
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    })
  },
  {
    name: 'user_engagement_events',
    supabaseTable: 'user_engagement_events',
    transformRow: (row) => ({
      ...row,
      id: row.id || generateId(),
      event_data: typeof row.event_data === 'object' ? JSON.stringify(row.event_data) : row.event_data || '{}',
      timestamp: row.timestamp ? new Date(row.timestamp).toISOString() : new Date().toISOString(),
    })
  },
  {
    name: 'admin_settings',
    supabaseTable: 'admin_settings',
    transformRow: (row) => ({
      ...row,
      id: row.id || generateId(),
      setting_value: typeof row.setting_value === 'object' ? JSON.stringify(row.setting_value) : row.setting_value || '{}',
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    })
  },
  {
    name: 'stripe_orders',
    supabaseTable: 'stripe_orders',
    transformRow: (row) => ({
      ...row,
      id: row.id || generateId(),
      metadata: typeof row.metadata === 'object' ? JSON.stringify(row.metadata) : row.metadata || '{}',
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    })
  }
];

// Utility functions
function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function escapeSQL(value) {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`;
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }
  return `'${String(value)}'`;
}

// Main migration functions
async function extractDataFromSupabase(tableName) {
  console.log(`📥 Extracting data from Supabase table: ${tableName}`);
  
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      if (error.code === 'PGRST106') {
        console.log(`⚠️  Table ${tableName} does not exist in Supabase, skipping...`);
        return [];
      }
      throw error;
    }

    console.log(`✅ Extracted ${data?.length || 0} rows from ${tableName}`);
    return data || [];
  } catch (error) {
    console.error(`❌ Failed to extract data from ${tableName}:`, error.message);
    return [];
  }
}

async function generateD1Migrations() {
  console.log('🔄 Starting Supabase to D1 migration...');
  
  // Create migrations directory
  const migrationsDir = './migrations/d1';
  await fs.mkdir(migrationsDir, { recursive: true });

  // Step 1: Create schema migration
  console.log('📝 Creating D1 schema migration...');
  await fs.writeFile(
    path.join(migrationsDir, '001_schema.sql'),
    D1_SCHEMA
  );

  // Step 2: Extract and transform data for each table
  const dataMigrations = [];

  for (const table of TABLES_TO_MIGRATE) {
    console.log(`\n🔄 Processing table: ${table.name}`);
    
    const supabaseData = await extractDataFromSupabase(table.supabaseTable);
    
    if (supabaseData.length === 0) {
      console.log(`⏭️  No data to migrate for ${table.name}`);
      continue;
    }

    // Transform data for D1 compatibility
    const transformedData = supabaseData.map(table.transformRow);
    
    // Generate INSERT statements
    const columns = Object.keys(transformedData[0]);
    const insertStatements = transformedData.map(row => {
      const values = columns.map(col => escapeSQL(row[col])).join(', ');
      return `INSERT INTO ${table.name} (${columns.join(', ')}) VALUES (${values});`;
    });

    const migrationSQL = `
-- Data migration for ${table.name}
-- Migrated ${transformedData.length} rows from Supabase

${insertStatements.join('\n')}
`;

    const fileName = `002_data_${table.name}.sql`;
    await fs.writeFile(path.join(migrationsDir, fileName), migrationSQL);
    
    dataMigrations.push({
      table: table.name,
      rows: transformedData.length,
      file: fileName
    });

    console.log(`✅ Generated migration for ${table.name}: ${transformedData.length} rows`);
  }

  // Step 3: Create summary report
  const summary = `
# Supabase to D1 Migration Summary

## Migration Overview
- **Date**: ${new Date().toISOString()}
- **Database**: ${D1_DATABASE_NAME} (${D1_DATABASE_ID})
- **Tables Migrated**: ${dataMigrations.length}

## Data Summary
${dataMigrations.map(m => `- **${m.table}**: ${m.rows} rows`).join('\n')}

## Migration Files Generated
1. \`001_schema.sql\` - Database schema
${dataMigrations.map((m, i) => `${i + 2}. \`${m.file}\` - Data for ${m.table}`).join('\n')}

## Next Steps
1. Apply schema: \`wrangler d1 execute ${D1_DATABASE_NAME} --file=./migrations/d1/001_schema.sql\`
2. Apply data migrations:
${dataMigrations.map(m => `   \`wrangler d1 execute ${D1_DATABASE_NAME} --file=./migrations/d1/${m.file}\``).join('\n')}

## Validation
After migration, verify data integrity:
\`\`\`bash
wrangler d1 execute ${D1_DATABASE_NAME} --command="SELECT COUNT(*) as total_submissions FROM business_submissions;"
wrangler d1 execute ${D1_DATABASE_NAME} --command="SELECT COUNT(*) as total_contacts FROM contact_messages;"
wrangler d1 execute ${D1_DATABASE_NAME} --command="SELECT COUNT(*) as total_businesses FROM businesses;"
\`\`\`
`;

  await fs.writeFile(path.join(migrationsDir, 'MIGRATION_SUMMARY.md'), summary);

  console.log('\n🎉 Migration files generated successfully!');
  console.log(`📁 Files created in: ${migrationsDir}`);
  console.log('\n📋 Summary:');
  console.log(`   - Schema file: 001_schema.sql`);
  dataMigrations.forEach((m, i) => {
    console.log(`   - ${m.table}: ${m.rows} rows → ${m.file}`);
  });

  return { migrationsDir, dataMigrations };
}

async function applyMigrationsToD1(migrationsDir, dataMigrations) {
  console.log('\n🚀 Applying migrations to D1 database...');
  
  // Apply schema first
  console.log('📝 Applying schema migration...');
  const { execSync } = await import('child_process');
  
  try {
    execSync(`wrangler d1 execute ${D1_DATABASE_NAME} --file=${migrationsDir}/001_schema.sql`, { 
      stdio: 'inherit' 
    });
    console.log('✅ Schema applied successfully');
  } catch (error) {
    console.error('❌ Failed to apply schema:', error.message);
    return false;
  }

  // Apply data migrations
  for (const migration of dataMigrations) {
    console.log(`📥 Applying data migration: ${migration.table}...`);
    try {
      execSync(`wrangler d1 execute ${D1_DATABASE_NAME} --file=${migrationsDir}/${migration.file}`, { 
        stdio: 'inherit' 
      });
      console.log(`✅ ${migration.table} data migrated successfully (${migration.rows} rows)`);
    } catch (error) {
      console.error(`❌ Failed to migrate ${migration.table}:`, error.message);
      return false;
    }
  }

  console.log('\n🎉 All migrations applied successfully!');
  return true;
}

async function validateMigration() {
  console.log('\n🔍 Validating migration...');
  
  const { execSync } = await import('child_process');
  
  const validationQueries = [
    'SELECT COUNT(*) as count, "business_submissions" as table_name FROM business_submissions',
    'SELECT COUNT(*) as count, "contact_messages" as table_name FROM contact_messages',
    'SELECT COUNT(*) as count, "business_profiles" as table_name FROM business_profiles',
    'SELECT COUNT(*) as count, "businesses" as table_name FROM businesses',
    'SELECT COUNT(*) as count, "user_engagement_events" as table_name FROM user_engagement_events',
    'SELECT COUNT(*) as count, "admin_settings" as table_name FROM admin_settings',
    'SELECT COUNT(*) as count, "stripe_orders" as table_name FROM stripe_orders'
  ];

  for (const query of validationQueries) {
    try {
      console.log(`🔍 Checking: ${query.split('"')[1]}`);
      execSync(`wrangler d1 execute ${D1_DATABASE_NAME} --command="${query}"`, { 
        stdio: 'inherit' 
      });
    } catch (error) {
      console.error(`❌ Validation failed for query: ${query}`);
    }
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 Starting Supabase to D1 Migration');
    console.log(`📊 Source: ${SUPABASE_URL}`);
    console.log(`🗄️  Target: D1 Database ${D1_DATABASE_NAME}`);
    console.log('─'.repeat(50));

    // Generate migration files
    const { migrationsDir, dataMigrations } = await generateD1Migrations();
    
    // Ask user if they want to apply migrations immediately
    console.log('\n❓ Do you want to apply the migrations to D1 now? (y/N)');
    
    // For automated execution, we'll skip the prompt and just generate files
    console.log('\n📁 Migration files have been generated.');
    console.log('🔧 To apply them manually, run:');
    console.log(`   wrangler d1 execute ${D1_DATABASE_NAME} --file=${migrationsDir}/001_schema.sql`);
    dataMigrations.forEach(m => {
      console.log(`   wrangler d1 execute ${D1_DATABASE_NAME} --file=${migrationsDir}/${m.file}`);
    });
    
    console.log('\n✅ Migration preparation complete!');
    console.log(`📋 Check ${migrationsDir}/MIGRATION_SUMMARY.md for detailed information.`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Execute if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as runMigration };
