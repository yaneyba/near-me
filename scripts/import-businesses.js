const fs = require('fs');
const https = require('https');

// Load the businesses data
const businesses = JSON.parse(fs.readFileSync('./src/data/businesses.json', 'utf8'));

const API_BASE_URL = 'https://near-me-32q.pages.dev';
const API_KEY = 'nearme-d1-api-2025';

console.log(`Starting import of ${businesses.length} businesses...`);

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

async function importBusiness(business, index) {
  try {
    // Map JSON structure to D1 table structure
    const sql = `
      INSERT INTO businesses (
        id, business_id, name, category, description, 
        address, city, state, zip_code, phone, email, website,
        services, hours, rating, review_count, image, logo_url,
        established, verified, premium, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;

    const params = [
      business.id,                                    // id
      business.id,                                    // business_id (same as id)
      business.name,                                  // name
      business.category,                              // category
      business.description || null,                   // description
      business.address || null,                       // address
      business.city,                                  // city
      business.state || null,                         // state
      business.zipCode || business.zip || null,       // zip_code
      business.phone || null,                         // phone
      business.email || null,                         // email
      business.website || null,                       // website
      business.services ? JSON.stringify(business.services) : null, // services
      business.hours ? JSON.stringify(business.hours) : null,       // hours
      business.rating || 0,                           // rating
      business.reviewCount || 0,                      // review_count
      business.image || business.logoUrl || null,     // image
      business.logoUrl || business.image || null,     // logo_url
      business.established || null,                   // established
      business.verified ? 1 : 0,                      // verified (boolean to int)
      business.premium ? 1 : 0,                       // premium (boolean to int)
      'active'                                        // status
    ];

    await executeQuery(sql, params);
    console.log(`✅ Imported ${index + 1}/${businesses.length}: ${business.name} (${business.city})`);
  } catch (error) {
    console.error(`❌ Failed to import ${business.name}:`, error.message);
  }
}

async function main() {
  console.log('🗑️  Table cleared, starting import...\n');
  
  // Import businesses in batches to avoid overwhelming the API
  const batchSize = 5;
  for (let i = 0; i < businesses.length; i += batchSize) {
    const batch = businesses.slice(i, i + batchSize);
    const promises = batch.map((business, batchIndex) => 
      importBusiness(business, i + batchIndex)
    );
    
    await Promise.all(promises);
    
    // Small delay between batches
    if (i + batchSize < businesses.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('\n🎉 Import completed!');
  
  // Verify the import
  try {
    const count = await executeQuery('SELECT COUNT(*) as total FROM businesses');
    console.log(`📊 Total businesses in database: ${count[0].total}`);
    
    const categories = await executeQuery('SELECT DISTINCT category FROM businesses ORDER BY category');
    console.log(`📂 Categories: ${categories.map(c => c.category).join(', ')}`);
    
    const cities = await executeQuery('SELECT DISTINCT city FROM businesses ORDER BY city');
    console.log(`🏙️  Cities: ${cities.map(c => c.city).join(', ')}`);
  } catch (error) {
    console.error('Error during verification:', error.message);
  }
}

main().catch(console.error);
