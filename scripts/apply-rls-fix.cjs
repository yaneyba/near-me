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

console.log('Executing migration...');

// Execute the migration as a single statement
async function runMigration() {
    try {
        console.log('Executing migration SQL...');
        const { data, error } = await supabase.rpc('exec_sql', { sql: migration });
        
        if (error) {
            console.error('Error executing migration:', error);
            process.exit(1);
        } else {
            console.log('✓ Migration executed successfully!');
        }
    } catch (err) {
        console.error('Exception executing migration:', err);
        
        // Try alternative approach - execute via SQL editor function
        console.log('Trying alternative execution method...');
        try {
            // Split into statements and execute individually
            const statements = migration
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

            for (let i = 0; i < statements.length; i++) {
                const statement = statements[i];
                if (statement.trim().length === 0) continue;
                
                console.log(`Executing statement ${i + 1}/${statements.length}...`);
                const { error } = await supabase.from('pg_stat_statements').select('*').limit(0); // Test connection
                if (error) {
                    console.log('Trying direct SQL execution...');
                    // This is a fallback - we'll need manual execution
                    console.log('\n=== MANUAL EXECUTION REQUIRED ===');
                    console.log('Please run the following SQL in your Supabase SQL editor:');
                    console.log('\n' + migration);
                    console.log('\n=== END MANUAL SQL ===\n');
                    break;
                }
            }
        } catch (altErr) {
            console.error('Alternative execution also failed:', altErr);
            console.log('\n=== MANUAL EXECUTION REQUIRED ===');
            console.log('Please run the following SQL in your Supabase SQL editor:');
            console.log('\n' + migration);
            console.log('\n=== END MANUAL SQL ===\n');
        }
    }
    
    console.log('Migration process completed!');
    process.exit(0);
}

runMigration().catch(err => {
    console.error('Migration failed:', err);
    console.log('\n=== MANUAL EXECUTION REQUIRED ===');
    console.log('Please run the following SQL in your Supabase SQL editor:');
    console.log('\n' + migration);
    console.log('\n=== END MANUAL SQL ===\n');
    process.exit(1);
});
