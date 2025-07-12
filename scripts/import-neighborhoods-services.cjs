const fs = require('fs');
const https = require('https');

// Load the data files
const neighborhoods = JSON.parse(fs.readFileSync('./src/data/neighborhoods.json', 'utf8'));
const services = JSON.parse(fs.readFileSync('./src/data/services.json', 'utf8'));

const API_BASE_URL = 'https://near-me-32q.pages.dev';
const API_KEY = 'nearme-d1-api-2025';

async function executeQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ sql, params });
    
    const options = {
      hostname: 'near-me-32q.pages.dev',
      port: 443,
      path: '/api/query',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            resolve(result.data);
          } else {
            reject(new Error(result.error || 'Query failed'));
          }
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function createTables() {
  console.log('🔧 Creating neighborhoods and services tables...');
  
  // Create neighborhoods table
  const neighborhoodsTableSQL = `
    CREATE TABLE IF NOT EXISTS neighborhoods (
      id TEXT PRIMARY KEY,
      city TEXT NOT NULL,
      neighborhood_name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `;
  
  // Create services table
  const servicesTableSQL = `
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      service TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `;
  
  try {
    await executeQuery(neighborhoodsTableSQL);
    console.log('✅ Neighborhoods table created/verified');
    
    await executeQuery(servicesTableSQL);
    console.log('✅ Services table created/verified');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  }
}

async function truncateTables() {
  console.log('🗑️  Truncating existing data...');
  
  try {
    // Check if tables exist and truncate them
    await executeQuery('DELETE FROM neighborhoods');
    console.log('✅ Neighborhoods table truncated');
  } catch (error) {
    console.log('ℹ️  Neighborhoods table doesn\'t exist or already empty');
  }
  
  try {
    await executeQuery('DELETE FROM services');
    console.log('✅ Services table truncated');
  } catch (error) {
    console.log('ℹ️  Services table doesn\'t exist or already empty');
  }
}

async function importNeighborhoods() {
  console.log('🏘️  Importing neighborhoods...');
  
  let totalImported = 0;
  
  for (const [city, neighborhoodList] of Object.entries(neighborhoods)) {
    console.log(`\n📍 Importing ${neighborhoodList.length} neighborhoods for ${city}:`);
    
    for (const neighborhood of neighborhoodList) {
      try {
        const id = `${city}-${neighborhood.toLowerCase().replace(/\s+/g, '-')}`;
        const sql = `
          INSERT INTO neighborhoods (id, city, neighborhood_name, created_at, updated_at)
          VALUES (?, ?, ?, datetime('now'), datetime('now'))
        `;
        
        await executeQuery(sql, [id, city, neighborhood]);
        console.log(`  ✅ ${neighborhood}`);
        totalImported++;
      } catch (error) {
        console.error(`  ❌ Failed to import ${neighborhood}:`, error.message);
      }
    }
  }
  
  console.log(`\n🎉 Imported ${totalImported} neighborhoods total`);
}

async function importServices() {
  console.log('\n🛠️  Importing services...');
  
  let totalImported = 0;
  
  for (const [category, serviceList] of Object.entries(services)) {
    console.log(`\n📂 Importing ${serviceList.length} services for ${category}:`);
    
    for (const service of serviceList) {
      try {
        const id = `${category}-${service.toLowerCase().replace(/\s+/g, '-')}`;
        const sql = `
          INSERT INTO services (id, category, service, created_at, updated_at)
          VALUES (?, ?, ?, datetime('now'), datetime('now'))
        `;
        
        await executeQuery(sql, [id, category, service]);
        console.log(`  ✅ ${service}`);
        totalImported++;
      } catch (error) {
        console.error(`  ❌ Failed to import ${service}:`, error.message);
      }
    }
  }
  
  console.log(`\n🎉 Imported ${totalImported} services total`);
}

async function verifyImport() {
  console.log('\n📊 Verifying import...');
  
  try {
    // Count neighborhoods
    const neighborhoodCount = await executeQuery('SELECT COUNT(*) as total FROM neighborhoods');
    console.log(`📍 Total neighborhoods: ${neighborhoodCount[0].total}`);
    
    const neighborhoodsByCity = await executeQuery(`
      SELECT city, COUNT(*) as count 
      FROM neighborhoods 
      GROUP BY city 
      ORDER BY city
    `);
    console.log('🏙️  Neighborhoods by city:');
    neighborhoodsByCity.forEach(row => {
      console.log(`   ${row.city}: ${row.count}`);
    });
    
    // Count services
    const serviceCount = await executeQuery('SELECT COUNT(*) as total FROM services');
    console.log(`\n🛠️  Total services: ${serviceCount[0].total}`);
    
    const servicesByCategory = await executeQuery(`
      SELECT category, COUNT(*) as count 
      FROM services 
      GROUP BY category 
      ORDER BY category
    `);
    console.log('📂 Services by category:');
    servicesByCategory.forEach(row => {
      console.log(`   ${row.category}: ${row.count}`);
    });
    
  } catch (error) {
    console.error('❌ Error during verification:', error.message);
  }
}

async function main() {
  try {
    console.log('🚀 Starting neighborhoods and services import...\n');
    
    await createTables();
    await truncateTables();
    await importNeighborhoods();
    await importServices();
    await verifyImport();
    
    console.log('\n🎉 Import completed successfully!');
    
  } catch (error) {
    console.error('\n💥 Import failed:', error.message);
    process.exit(1);
  }
}

main();
