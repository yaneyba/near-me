#!/usr/bin/env node

/**
 * Fix water refill business IDs to use cleaner format
 * Changes from: water-refill-sf-001-sfo-water-filling-station
 * To: sf-001-sfo-water-station
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateCleanId(name, index) {
  const cleanName = name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/water-refill/g, '')
    .replace(/station/g, 'station')
    .replace(/filling/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 25); // Reasonable limit
  
  // Much simpler ID format
  return `sf-${String(index + 1).padStart(3, '0')}-${cleanName}`;
}

function main() {
  console.log('🔧 Fixing water refill business IDs...\n');
  
  try {
    // Read current JSON file
    const jsonPath = path.join(__dirname, '..', 'src', 'data', 'water-refill-businesses.json');
    const businesses = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    console.log(`📊 Found ${businesses.length} businesses to update`);
    
    // Update each business with cleaner ID
    const updatedBusinesses = businesses.map((business, index) => {
      const oldId = business.id;
      const newId = generateCleanId(business.name, index);
      
      console.log(`✅ ${oldId} → ${newId}`);
      
      return {
        ...business,
        id: newId,
        business_id: newId
      };
    });
    
    // Write updated JSON
    fs.writeFileSync(jsonPath, JSON.stringify(updatedBusinesses, null, 2));
    
    console.log(`\n🎉 Successfully updated ${updatedBusinesses.length} businesses!`);
    console.log(`📄 Updated file: ${jsonPath}`);
    
    // Show examples of new URLs
    console.log(`\n🌐 New URLs will be:`);
    updatedBusinesses.slice(0, 5).forEach(business => {
      console.log(`   https://water-refill.near-me.us/station/${business.id}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating IDs:', error.message);
    process.exit(1);
  }
}

main();
