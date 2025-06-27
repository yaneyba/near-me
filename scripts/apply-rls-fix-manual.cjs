// Script to apply the RLS fix migration to Supabase
// This fixes the admin access issues by using email-based admin detection

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

console.log('Applying RLS fix migration to Supabase...');

const MIGRATION_FILE = path.join(__dirname, '..', 'supabase', 'migrations', '20250627210000_fix_admin_rls_policies.sql');

if (!fs.existsSync(MIGRATION_FILE)) {
    console.error('Migration file not found:', MIGRATION_FILE);
    process.exit(1);
}

console.log('Reading migration from:', MIGRATION_FILE);

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

const migration = fs.readFileSync(MIGRATION_FILE, 'utf8');

console.log('Since automatic SQL execution is limited, outputting SQL for manual execution...');

console.log('\n=== COPY THIS SQL TO SUPABASE SQL EDITOR ===');
console.log('Go to: https://supabase.com/dashboard/project/[your-project]/sql/new');
console.log('\n--- START SQL ---');
console.log(migration);
console.log('--- END SQL ---\n');

console.log('After running the SQL above, test the admin dashboard to see if the RLS issues are resolved.');
console.log('The migration adds email-based admin detection and proper RLS policies.');
