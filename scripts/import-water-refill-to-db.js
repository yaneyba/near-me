#!/usr/bin/env node

/**
 * Import updated water refill JSON data into D1 database
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importToDatabase() {
  console.log('📊 Importing water refill data to D1 database...\n');
  
  try {
    // Read the updated JSON file
    const jsonPath = path.join(__dirname, '..', 'src', 'data', 'water-refill-businesses.json');
    const businesses = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    console.log(`📝 Found ${businesses.length} businesses to import`);
    
    // Create SQL insert statements
    const insertStatements = businesses.map((business, index) => {
      const cleanBusiness = {
        id: business.id,
        name: business.name.replace(/'/g, "''"), // Escape quotes
        category: business.category,
        city: business.city,
        state: business.state,
        address: business.address ? business.address.replace(/'/g, "''") : null,
        phone: business.phone,
        website: business.website,
        description: business.description ? business.description.replace(/'/g, "''") : null,
        rating: business.rating,
        reviewCount: business.reviewCount,
        image: business.image,
        verified: business.verified ? 1 : 0,
        premium: business.premium ? 1 : 0,
        status: business.status,
        established: business.established,
        latitude: business.latitude,
        longitude: business.longitude,
        hours: JSON.stringify(business.hours),
        services: JSON.stringify(business.services),
        google_places_id: business.google_places_id,
        google_cid: business.google_cid
      };
      
      const values = [
        `'${cleanBusiness.id}'`,
        `'${cleanBusiness.id}'`, // business_id same as id
        `'${cleanBusiness.name}'`,
        `'${cleanBusiness.category}'`, 
        `'${cleanBusiness.city}'`,
        `'${cleanBusiness.state}'`,
        cleanBusiness.address ? `'${cleanBusiness.address}'` : 'NULL',
        cleanBusiness.phone ? `'${cleanBusiness.phone}'` : 'NULL',
        cleanBusiness.website ? `'${cleanBusiness.website}'` : 'NULL',
        cleanBusiness.description ? `'${cleanBusiness.description}'` : 'NULL',
        cleanBusiness.rating,
        cleanBusiness.reviewCount,
        cleanBusiness.image ? `'${cleanBusiness.image}'` : 'NULL',
        cleanBusiness.verified,
        cleanBusiness.premium,
        `'${cleanBusiness.status}'`,
        cleanBusiness.established,
        cleanBusiness.latitude,
        cleanBusiness.longitude,
        `'${cleanBusiness.hours}'`,
        `'${cleanBusiness.services}'`
      ].join(', ');
      
      return `INSERT INTO businesses (id, business_id, name, category, city, state, address, phone, website, description, rating, review_count, image, verified, premium, status, established, latitude, longitude, hours, services) VALUES (${values});`;
    });
    
    // Write SQL file
    const sqlPath = path.join(__dirname, 'import-water-refill-data.sql');
    fs.writeFileSync(sqlPath, insertStatements.join('\n'));
    
    console.log(`📄 Generated SQL file: ${sqlPath}`);
    console.log(`\n🔧 To import to database, run:`);
    console.log(`wrangler d1 execute nearme-db --file=${sqlPath}`);
    
  } catch (error) {
    console.error('❌ Error generating import SQL:', error.message);
    process.exit(1);
  }
}

importToDatabase();
