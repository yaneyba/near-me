#!/usr/bin/env node

/**
 * Process water refill TSV data and convert to JSON format for import
 * Usage: node scripts/process-water-refill-tsv.js <input-tsv-file>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseOpeningHours(openingHoursString) {
  if (!openingHoursString || openingHoursString === '') {
    return {
      "Monday": "Hours not available",
      "Tuesday": "Hours not available", 
      "Wednesday": "Hours not available",
      "Thursday": "Hours not available",
      "Friday": "Hours not available",
      "Saturday": "Hours not available",
      "Sunday": "Hours not available"
    };
  }
  
  try {
    return JSON.parse(openingHoursString);
  } catch (e) {
    console.warn('Failed to parse opening hours:', openingHoursString);
    return {
      "Monday": "Hours not available",
      "Tuesday": "Hours not available", 
      "Wednesday": "Hours not available",
      "Thursday": "Hours not available",
      "Friday": "Hours not available",
      "Saturday": "Hours not available",
      "Sunday": "Hours not available"
    };
  }
}

function parseTypes(typesString) {
  if (!typesString || typesString === '') {
    return ["Water Refill Station"];
  }
  
  try {
    const types = JSON.parse(typesString);
    return Array.isArray(types) ? types : [typesString];
  } catch (e) {
    return [typesString];
  }
}

function generateBusinessId(name, index) {
  const cleanName = name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30);
  return `water-refill-sf-${String(index + 1).padStart(3, '0')}-${cleanName}`;
}

function getCityFromAddress(address) {
  if (address.includes('San Francisco')) return 'san-francisco';
  if (address.includes('South San Francisco')) return 'south-san-francisco';
  if (address.includes('Daly City')) return 'daly-city';
  if (address.includes('Pacifica')) return 'pacifica';
  return 'san-francisco'; // default
}

function getServicesFromType(types) {
  const typeArray = Array.isArray(types) ? types : [types];
  const services = [];
  
  typeArray.forEach(type => {
    switch (type.toLowerCase()) {
      case 'drinking water fountain':
        services.push('Free Water Fountain', 'Bottle Filling');
        break;
      case 'water purification company':
        services.push('Water Purification', 'Custom Filtration', 'Water Testing');
        break;
      case 'bottled water supplier':
        services.push('Water Refill', 'Gallon Containers', 'Bulk Water');
        break;
      case 'grocery store':
        services.push('Water Refill', 'Grocery Shopping', 'Bulk Discounts');
        break;
      default:
        services.push('Water Refill');
    }
  });
  
  return [...new Set(services)]; // Remove duplicates
}

function getWaterTypes(types) {
  const typeArray = Array.isArray(types) ? types : [types];
  
  if (typeArray.some(t => t.toLowerCase().includes('purification'))) {
    return ['Reverse Osmosis', 'Filtered Water', 'Purified Water'];
  }
  
  if (typeArray.some(t => t.toLowerCase().includes('fountain'))) {
    return ['Filtered Tap Water'];
  }
  
  return ['Filtered Water', 'Purified Water'];
}

function getAmenities(types, hasPhone, hasWebsite) {
  const amenities = [];
  
  if (hasPhone) amenities.push('Phone Support');
  if (hasWebsite) amenities.push('Online Information');
  
  const typeArray = Array.isArray(types) ? types : [types];
  
  if (typeArray.some(t => t.toLowerCase().includes('fountain'))) {
    amenities.push('Free Access', 'Bottle Filling');
  } else {
    amenities.push('Credit Card Accepted', 'Quality Filtration');
  }
  
  amenities.push('Clean Environment');
  
  return amenities;
}

function processTSVToJSON(tsvFilePath) {
  const content = fs.readFileSync(tsvFilePath, 'utf8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split('\t').map(h => h.replace(/\r/g, '').trim()); // Clean headers
  
  console.log('📊 Processing TSV file with headers:', headers);
  console.log(`📝 Found ${lines.length - 1} data rows\n`);
  
  const businesses = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t').map(v => v.replace(/\r/g, '').trim()); // Clean values
    const row = {};
    
    // Map values to headers
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    // Parse and transform the data
    const types = parseTypes(row.types);
    const hours = parseOpeningHours(row.openingHours);
    const services = getServicesFromType(types);
    const waterTypes = getWaterTypes(types);
    const amenities = getAmenities(types, !!row.phoneNumber, !!row.website);
    
    const business = {
      id: generateBusinessId(row.title, i - 1),
      business_id: generateBusinessId(row.title, i - 1),
      name: row.title,
      category: 'water-refill',
      city: getCityFromAddress(row.address),
      state: 'California',
      address: row.address,
      phone: row.phoneNumber || null,
      website: row.website || null,
      description: `${types.join(', ')} offering quality water services in the San Francisco Bay Area.`,
      
      // Basic business info
      rating: parseFloat(row.rating) || 4.0,
      reviewCount: parseInt(row.ratingCount) || 0,
      image: row.thumbnailUrl || null,
      verified: true, // Since this is scraped from Google Places
      premium: false,
      status: 'active',
      established: 2020, // Default
      
      // Location
      latitude: parseFloat(row.latitude) || null,
      longitude: parseFloat(row.longitude) || null,
      
      // Operating hours
      hours: hours,
      
      // Services
      services: services,
      
      // Water-specific data (for future schema enhancement)
      water_types: waterTypes,
      amenities: amenities,
      verification_status: 'verified',
      pricing_info: {
        per_gallon: 0.50, // Default pricing
        currency: 'USD',
        payment_methods: ['Cash', 'Credit Card']
      },
      
      // Google Places data
      google_places_id: row.placeId || null,
      google_cid: row.cid || null
    };
    
    businesses.push(business);
    console.log(`✅ Processed: ${business.name} (${business.city})`);
  }
  
  return businesses;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node scripts/process-water-refill-tsv.js <input-tsv-file>');
    process.exit(1);
  }
  
  const tsvFilePath = args[0];
  
  if (!fs.existsSync(tsvFilePath)) {
    console.error(`Error: File not found: ${tsvFilePath}`);
    process.exit(1);
  }
  
  console.log('🚀 Starting water refill TSV processing...\n');
  
  try {
    const businesses = processTSVToJSON(tsvFilePath);
    
    // Write JSON output
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'water-refill-businesses.json');
    fs.writeFileSync(outputPath, JSON.stringify(businesses, null, 2));
    
    console.log(`\n🎉 Processing complete!`);
    console.log(`📊 Processed ${businesses.length} water refill stations`);
    console.log(`📄 Output written to: ${outputPath}`);
    
    // Generate summary
    const cities = [...new Set(businesses.map(b => b.city))];
    const types = [...new Set(businesses.flatMap(b => b.services))];
    
    console.log(`\n📈 Summary:`);
    console.log(`   Cities: ${cities.join(', ')}`);
    console.log(`   Average Rating: ${(businesses.reduce((sum, b) => sum + b.rating, 0) / businesses.length).toFixed(1)}`);
    console.log(`   Service Types: ${types.length} unique services`);
    
  } catch (error) {
    console.error('❌ Error processing TSV file:', error.message);
    process.exit(1);
  }
}

main();
