#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🔄 Starting UUID migration for businesses table...');

try {
  // Step 1: Create new table with UUID primary key
  console.log('📊 Creating new businesses table with UUID...');
  const createTableCommand = `npx wrangler d1 execute nearme-db --remote --command "
    CREATE TABLE businesses_new (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),
      business_id TEXT,
      name TEXT NOT NULL,
      description TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip_code TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      category TEXT,
      services TEXT,
      hours TEXT,
      rating REAL DEFAULT 0.0,
      review_count INTEGER DEFAULT 0,
      image_url TEXT,
      logo_url TEXT,
      established INTEGER,
      verified INTEGER DEFAULT 0,
      premium INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      site_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      latitude REAL,
      longitude REAL
    );"`;
  
  execSync(createTableCommand, { encoding: 'utf8', cwd: process.cwd() });
  console.log('✅ New table created successfully');

  // Step 2: Copy all data from old table to new table (UUID will be auto-generated)
  console.log('📋 Copying data to new table...');
  const copyDataCommand = `npx wrangler d1 execute nearme-db --remote --command "
    INSERT INTO businesses_new (
      name, description, address, city, state, zip_code, phone, email, website, 
      category, services, hours, rating, review_count, verified, premium, 
      status, site_id, created_at, updated_at, latitude, longitude, 
      business_id, image_url, logo_url, established
    )
    SELECT 
      name, description, address, city, state, zip_code, phone, email, website, 
      category, services, hours, rating, review_count, verified, premium, 
      status, site_id, created_at, updated_at, latitude, longitude, 
      business_id, image, logo_url, established
    FROM businesses;"`;
  
  execSync(copyDataCommand, { encoding: 'utf8', cwd: process.cwd() });
  console.log('✅ Data copied successfully');

  // Step 3: Drop old table
  console.log('🗑️ Dropping old table...');
  const dropOldCommand = `npx wrangler d1 execute nearme-db --remote --command "DROP TABLE businesses;"`;
  execSync(dropOldCommand, { encoding: 'utf8', cwd: process.cwd() });
  console.log('✅ Old table dropped');

  // Step 4: Rename new table to original name
  console.log('🔄 Renaming new table...');
  const renameCommand = `npx wrangler d1 execute nearme-db --remote --command "ALTER TABLE businesses_new RENAME TO businesses;"`;
  execSync(renameCommand, { encoding: 'utf8', cwd: process.cwd() });
  console.log('✅ Table renamed successfully');

  // Step 5: Verify the migration
  console.log('📊 Verifying migration...');
  const verifyCommand = `npx wrangler d1 execute nearme-db --remote --command "SELECT id, name FROM businesses WHERE category = 'water-refill' LIMIT 5;"`;
  const result = execSync(verifyCommand, { encoding: 'utf8', cwd: process.cwd() });
  console.log('Sample records with new UUIDs:');
  console.log(result);

  console.log('🎉 UUID migration completed successfully!');

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  console.log('🔄 You may need to manually clean up any partial changes');
}
