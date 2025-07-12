/**
 * Populate cities table from existing business data
 * This script extracts unique cities from the businesses table and creates proper city records
 */

import { readFileSync } from 'fs';
import { join } from 'path';

async function populateCities() {
  console.log('🏙️  Populating cities table from business data...');
  
  // First, get all unique cities from businesses table
  const { execSync } = await import('child_process');
  
  try {
    // Get unique cities from businesses
    const result = execSync(
      `wrangler d1 execute nearme-db --command "SELECT DISTINCT city FROM businesses WHERE city IS NOT NULL AND city != '' ORDER BY city;"`,
      { encoding: 'utf8', cwd: process.cwd() }
    );
    
    console.log('Raw wrangler output:', result);
    
    // Parse the JSON response from wrangler
    const cities = [];
    try {
      // Extract JSON from the output
      const jsonMatch = result.match(/\[\s*{[\s\S]*}\s*\]/);
      if (jsonMatch) {
        const jsonData = JSON.parse(jsonMatch[0]);
        if (jsonData[0] && jsonData[0].results) {
          for (const row of jsonData[0].results) {
            if (row.city) {
              cities.push(row.city);
            }
          }
        }
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError.message);
      // Fallback to text parsing if needed
    }
    
    console.log('Found cities:', cities);
    
    // Create city records
    for (const cityName of cities) {
      const cityId = cityName.toLowerCase().replace(/\s+/g, '-');
      const displayName = cityName.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
      
      const insertSQL = `INSERT OR IGNORE INTO cities (id, name, display_name) VALUES ('${cityId}', '${cityName}', '${displayName}');`;
      
      try {
        execSync(
          `wrangler d1 execute nearme-db --command "${insertSQL}"`,
          { encoding: 'utf8', cwd: process.cwd() }
        );
        console.log(`✅ Added city: ${displayName} (${cityId})`);
      } catch (error) {
        console.error(`❌ Error adding city ${cityName}:`, error.message);
      }
    }
    
    console.log('🎉 Cities population complete!');
    
  } catch (error) {
    console.error('❌ Error populating cities:', error.message);
    process.exit(1);
  }
}

// Run the script
populateCities();
