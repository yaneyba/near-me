#!/usr/bin/env node

/**
 * Import business data from various sources (CSV, JSON, Google Places API)
 * Usage: node scripts/import-businesses.js <source-type> <file-or-query> [options]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BusinessImporter {
  constructor() {
    this.apiKey = process.env.GOOGLE_PLACES_API_KEY;
  }

  async importFromCSV(filePath) {
    console.log(`📂 Importing from CSV: ${filePath}`);
    
    // Basic CSV parser (you might want to use a library like csv-parser)
    const csvContent = fs.readFileSync(filePath, 'utf8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const businesses = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const business = {};
        
        headers.forEach((header, index) => {
          business[header] = values[index] || '';
        });
        
        businesses.push(this.normalizeBusinessData(business));
      }
    }
    
    return businesses;
  }

  async importFromJSON(filePath) {
    console.log(`📂 Importing from JSON: ${filePath}`);
    
    const jsonContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const businesses = Array.isArray(jsonContent) ? jsonContent : jsonContent.businesses || [];
    
    return businesses.map(b => this.normalizeBusinessData(b));
  }

  async importFromGooglePlaces(query, location = 'San Francisco, CA', radius = 25000) {
    console.log(`🔍 Searching Google Places: "${query}" near ${location}`);
    
    if (!this.apiKey) {
      throw new Error('GOOGLE_PLACES_API_KEY environment variable is required');
    }

    // This is a simplified example - you'd need to implement the actual Google Places API calls
    console.log('⚠️  Google Places API integration not implemented yet');
    console.log('📝 You would need to:');
    console.log('   1. Install Google Places API client');
    console.log('   2. Implement search and details API calls');
    console.log('   3. Transform Google Places data to our schema');
    
    return [];
  }

  normalizeBusinessData(rawData) {
    // Normalize field names to match our database schema
    const normalized = {
      name: rawData.name || rawData.business_name || '',
      description: rawData.description || rawData.about || '',
      phone: rawData.phone || rawData.phone_number || '',
      website: rawData.website || rawData.url || '',
      address: rawData.address || rawData.full_address || '',
      city: rawData.city || '',
      state: rawData.state || 'California',
      zip_code: rawData.zip_code || rawData.zipcode || null,
      latitude: rawData.latitude || rawData.lat || null,
      longitude: rawData.longitude || rawData.lng || null,
      rating: parseFloat(rawData.rating) || 4.0,
      review_count: parseInt(rawData.review_count) || 0,
      verified: rawData.verified === 'true' || rawData.verified === true,
      premium: rawData.premium === 'true' || rawData.premium === true,
      status: rawData.status || 'active',
      established: parseInt(rawData.established) || new Date().getFullYear()
    };

    // Handle hours (convert from various formats)
    if (rawData.hours) {
      if (typeof rawData.hours === 'string') {
        try {
          normalized.hours = JSON.parse(rawData.hours);
        } catch {
          normalized.hours = { monday: rawData.hours }; // Default to same hours every day
        }
      } else {
        normalized.hours = rawData.hours;
      }
    } else {
      normalized.hours = {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 5:00 PM',
        sunday: 'Closed'
      };
    }

    // Handle services
    if (rawData.services) {
      if (typeof rawData.services === 'string') {
        normalized.services = rawData.services.split(',').map(s => s.trim());
      } else {
        normalized.services = rawData.services;
      }
    } else {
      normalized.services = [];
    }

    return normalized;
  }

  async generateMigration(businesses, category, city) {
    console.log(`📝 Generating migration for ${businesses.length} businesses`);
    
    const migrationScript = path.join(__dirname, 'generate-migration.js');
    const tempDataFile = path.join(__dirname, '..', 'temp', `${category}-${city}-import.json`);
    
    // Ensure temp directory exists
    const tempDir = path.dirname(tempDataFile);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Write businesses to temp file
    fs.writeFileSync(tempDataFile, JSON.stringify(businesses, null, 2));
    
    // Generate migration
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    try {
      const { stdout } = await execAsync(`node ${migrationScript} ${category} ${city} ${tempDataFile}`);
      console.log(stdout);
    } finally {
      // Clean up temp file
      fs.unlinkSync(tempDataFile);
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: node scripts/import-businesses.js <source-type> <file-or-query> <category> <city>');
    console.error('');
    console.error('Source types:');
    console.error('  csv    - Import from CSV file');
    console.error('  json   - Import from JSON file');
    console.error('  places - Search Google Places API');
    console.error('');
    console.error('Examples:');
    console.error('  node scripts/import-businesses.js csv ./data/nail-salons.csv nail-salons frisco');
    console.error('  node scripts/import-businesses.js json ./data/restaurants.json restaurants downtown');
    console.error('  node scripts/import-businesses.js places "nail salons" nail-salons frisco');
    process.exit(1);
  }
  
  const [sourceType, fileOrQuery, category, city] = args;
  const importer = new BusinessImporter();
  
  try {
    let businesses = [];
    
    switch (sourceType) {
      case 'csv':
        businesses = await importer.importFromCSV(fileOrQuery);
        break;
      case 'json':
        businesses = await importer.importFromJSON(fileOrQuery);
        break;
      case 'places':
        businesses = await importer.importFromGooglePlaces(fileOrQuery);
        break;
      default:
        throw new Error(`Unknown source type: ${sourceType}`);
    }
    
    if (businesses.length === 0) {
      console.log('⚠️  No businesses found to import');
      return;
    }
    
    console.log(`✅ Imported ${businesses.length} businesses`);
    
    // Generate migration
    await importer.generateMigration(businesses, category, city);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main();
