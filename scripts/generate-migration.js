#!/usr/bin/env node

/**
 * Generate migration files for new business categories
 * Usage: node scripts/generate-migration.js <category> <city> [data-file.json]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateMigrationNumber() {
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  return timestamp;
}

function sanitizeForSql(value) {
  if (typeof value === 'string') {
    return value.replace(/'/g, "''");
  }
  return value;
}

function generateDataMigration(category, city, businesses) {
  const migrationNumber = generateMigrationNumber();
  const fileName = `${migrationNumber}_data_${category.replace(/-/g, '_')}_businesses.sql`;
  
  let sql = `-- Migration: Add ${category} businesses for ${city}\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n\n`;
  
  businesses.forEach((business, index) => {
    const id = business.id || `${category}-${city}-${String(index + 1).padStart(3, '0')}`;
    const businessId = business.business_id || `${category}-${city}-${String(index + 1).padStart(2, '0')}`;
    
    sql += `INSERT INTO businesses (\n`;
    sql += `  id, business_id, name, category, description, phone, website, address,\n`;
    sql += `  city, state, zip_code, image, hours, services, rating, review_count,\n`;
    sql += `  verified, premium, status, established, latitude, longitude\n`;
    sql += `) VALUES (\n`;
    sql += `  '${sanitizeForSql(id)}',\n`;
    sql += `  '${sanitizeForSql(businessId)}',\n`;
    sql += `  '${sanitizeForSql(business.name)}',\n`;
    sql += `  '${sanitizeForSql(category)}',\n`;
    sql += `  '${sanitizeForSql(business.description || '')}',\n`;
    sql += `  '${sanitizeForSql(business.phone || '')}',\n`;
    sql += `  '${sanitizeForSql(business.website || '')}',\n`;
    sql += `  '${sanitizeForSql(business.address || '')}',\n`;
    sql += `  '${sanitizeForSql(city)}',\n`;
    sql += `  '${sanitizeForSql(business.state || 'California')}',\n`;
    sql += `  ${business.zip_code ? `'${business.zip_code}'` : 'NULL'},\n`;
    sql += `  '${sanitizeForSql(business.image || `/images/businesses/${category}-${index + 1}.jpg`)}',\n`;
    sql += `  '${sanitizeForSql(JSON.stringify(business.hours || {}))}',\n`;
    sql += `  '${sanitizeForSql(JSON.stringify(business.services || []))}',\n`;
    sql += `  ${business.rating || 4.0},\n`;
    sql += `  ${business.review_count || 0},\n`;
    sql += `  ${business.verified ? 1 : 0},\n`;
    sql += `  ${business.premium ? 1 : 0},\n`;
    sql += `  '${business.status || 'active'}',\n`;
    sql += `  ${business.established || new Date().getFullYear()},\n`;
    sql += `  ${business.latitude || 'NULL'},\n`;
    sql += `  ${business.longitude || 'NULL'}\n`;
    sql += `);\n\n`;
  });
  
  return { fileName, sql };
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node scripts/generate-migration.js <category> <city> [data-file.json]');
    console.error('Example: node scripts/generate-migration.js nail-salons frisco ./data/nail-salons-frisco.json');
    process.exit(1);
  }
  
  const [category, city, dataFile] = args;
  
  let businesses = [];
  
  if (dataFile && fs.existsSync(dataFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      businesses = Array.isArray(data) ? data : data.businesses || [];
    } catch (error) {
      console.error(`Error reading data file: ${error.message}`);
      process.exit(1);
    }
  } else {
    // Generate sample data
    businesses = [
      {
        name: `Sample ${category.replace('-', ' ')} Business 1`,
        description: `Premium ${category.replace('-', ' ')} service in ${city}`,
        phone: '(555) 123-4567',
        website: `https://example-${category}.com`,
        address: `123 Main St, ${city}, CA 94000`,
        hours: {
          monday: '9:00 AM - 6:00 PM',
          tuesday: '9:00 AM - 6:00 PM',
          wednesday: '9:00 AM - 6:00 PM',
          thursday: '9:00 AM - 6:00 PM',
          friday: '9:00 AM - 7:00 PM',
          saturday: '10:00 AM - 5:00 PM',
          sunday: 'Closed'
        },
        services: [`${category} Service 1`, `${category} Service 2`],
        rating: 4.5,
        review_count: 150,
        verified: true,
        premium: false,
        established: 2020
      }
    ];
    console.log(`No data file provided. Generated sample data for ${category} in ${city}`);
  }
  
  const migration = generateDataMigration(category, city, businesses);
  const migrationsDir = path.join(__dirname, '..', 'migrations', 'd1');
  const migrationPath = path.join(migrationsDir, migration.fileName);
  
  // Ensure migrations directory exists
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
  
  fs.writeFileSync(migrationPath, migration.sql);
  
  console.log(`✅ Migration generated: ${migration.fileName}`);
  console.log(`📄 File: ${migrationPath}`);
  console.log(`📊 Businesses: ${businesses.length}`);
  console.log(`\nTo apply this migration:`);
  console.log(`wrangler d1 execute nearme-db --file=./migrations/d1/${migration.fileName} --remote`);
}

main();
