/**
 * Populate neighborhoods table from neighborhoods.json
 * This migrates the static neighborhood data into the database
 */

import { readFileSync } from 'fs';

async function populateNeighborhoods() {
  console.log('🏘️  Migrating neighborhoods from JSON to database...');
  
  try {
    // Read neighborhoods.json
    const neighborhoodsData = JSON.parse(readFileSync('src/data/neighborhoods.json', 'utf8'));
    const { execSync } = await import('child_process');
    
    let totalAdded = 0;
    
    for (const [cityName, neighborhoods] of Object.entries(neighborhoodsData)) {
      console.log(`\n📍 Processing ${cityName}...`);
      
      // City ID should match what we created in cities table
      const cityId = cityName.toLowerCase().replace(/\s+/g, '-');
      
      for (const neighborhood of neighborhoods) {
        const neighborhoodId = `${cityId}-${neighborhood.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
        
        const insertSQL = `INSERT OR IGNORE INTO neighborhoods (id, name, city_id, display_name) VALUES ('${neighborhoodId}', '${neighborhood.replace(/'/g, "''")}', '${cityId}', '${neighborhood.replace(/'/g, "''")}');`;
        
        try {
          execSync(
            `wrangler d1 execute nearme-db --command "${insertSQL}"`,
            { encoding: 'utf8', cwd: process.cwd() }
          );
          console.log(`  ✅ Added: ${neighborhood}`);
          totalAdded++;
        } catch (error) {
          console.error(`  ❌ Error adding ${neighborhood}:`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 Neighborhoods migration complete! Added ${totalAdded} neighborhoods.`);
    
  } catch (error) {
    console.error('❌ Error populating neighborhoods:', error.message);
    process.exit(1);
  }
}

// Run the script
populateNeighborhoods();
