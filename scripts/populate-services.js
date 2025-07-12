/**
 * Populate services table from services.json
 * This migrates the static service data into the database
 */

import { readFileSync } from 'fs';

async function populateServices() {
  console.log('🔧 Migrating services from JSON to database...');
  
  try {
    // Read services.json
    const servicesData = JSON.parse(readFileSync('src/data/services.json', 'utf8'));
    const { execSync } = await import('child_process');
    
    let totalAdded = 0;
    
    for (const [category, services] of Object.entries(servicesData)) {
      console.log(`\n📋 Processing ${category} services...`);
      
      for (const service of services) {
        const serviceId = `${category}-${service.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
        
        const insertSQL = `INSERT OR IGNORE INTO services (id, name, category, display_name) VALUES ('${serviceId}', '${service.replace(/'/g, "''")}', '${category}', '${service.replace(/'/g, "''")}');`;
        
        try {
          execSync(
            `wrangler d1 execute nearme-db --command "${insertSQL}"`,
            { encoding: 'utf8', cwd: process.cwd() }
          );
          console.log(`  ✅ Added: ${service}`);
          totalAdded++;
        } catch (error) {
          console.error(`  ❌ Error adding ${service}:`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 Services migration complete! Added ${totalAdded} services.`);
    
  } catch (error) {
    console.error('❌ Error populating services:', error.message);
    process.exit(1);
  }
}

// Run the script
populateServices();
