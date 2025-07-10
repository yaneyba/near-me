// Test file to verify the subdomain configuration system
// Run this with: node -r ts-node/register src/config/test-config.ts

import { 
  getCityState, 
  isSupportedCity, 
  getAllStates, 
  getAllCities,
  searchCities,
  isSpecialService,
  isBlockedSubdomain,
  cityStateMap 
} from './subdomainExceptions';

console.log('🧪 Testing Subdomain Configuration System\n');

// Test city-state mappings
console.log('📍 Testing City-State Mappings:');
console.log(`Dallas → ${getCityState('dallas')}`);
console.log(`San Francisco → ${getCityState('san-francisco')}`);
console.log(`SF (alias) → ${getCityState('sf')}`);
console.log(`Unknown City → ${getCityState('unknown-city')}`);

// Test city support
console.log('\n✅ Testing City Support:');
console.log(`Dallas supported: ${isSupportedCity('dallas')}`);
console.log(`Unknown supported: ${isSupportedCity('unknown')}`);

// Test state/city queries
console.log('\n🗺️ Testing State/City Queries:');
console.log(`States count: ${getAllStates().length}`);
console.log(`Cities count: ${getAllCities().length}`);
console.log(`Sample states: ${getAllStates().slice(0, 5).join(', ')}`);

// Test city search
console.log('\n🔍 Testing City Search:');
const sanResults = searchCities('san');
console.log(`Cities containing 'san': ${sanResults.map(r => r.city).join(', ')}`);

// Test special services
console.log('\n🔧 Testing Special Services:');
console.log(`Water refill special: ${!!isSpecialService('water-refill.near-me.us')}`);
console.log(`Services special: ${!!isSpecialService('services.near-me.us')}`);
console.log(`Unknown special: ${!!isSpecialService('unknown.near-me.us')}`);

// Test blocked subdomains
console.log('\n🚫 Testing Blocked Subdomains:');
console.log(`Admin blocked: ${isBlockedSubdomain('admin.near-me.us')}`);
console.log(`API blocked: ${isBlockedSubdomain('api.near-me.us')}`);
console.log(`Valid blocked: ${isBlockedSubdomain('nail-salons.dallas.near-me.us')}`);

// Test backward compatibility
console.log('\n🔄 Testing Backward Compatibility:');
console.log(`cityStateMap['dallas']: ${cityStateMap['dallas']}`);
console.log(`cityStateMap['san-francisco']: ${cityStateMap['san-francisco']}`);

console.log('\n✅ All tests completed!');
