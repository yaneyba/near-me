// Example: How to add new configurations to the subdomain system
// This demonstrates the programmatic API for adding new cities and services

import { 
  addCityStateMapping, 
  addSpecialService, 
  addBlockedSubdomain,
  getCityState,
  isSupportedCity,
  isSpecialService,
  isBlockedSubdomain
} from './subdomainExceptions';

console.log('🚀 Adding New Configurations\n');

// Example 1: Add a new city
console.log('📍 Adding New City:');
console.log(`Before: Portland supported = ${isSupportedCity('portland')}`);
console.log(`Before: Portland state = ${getCityState('portland')}`);

addCityStateMapping({
  city: 'portland',
  state: 'Oregon',
  aliases: ['pdx', 'portland-oregon']
});

console.log(`After: Portland supported = ${isSupportedCity('portland')}`);
console.log(`After: Portland state = ${getCityState('portland')}`);
console.log(`After: PDX (alias) state = ${getCityState('pdx')}`);

// Example 2: Add a new special service
console.log('\n🔧 Adding New Special Service:');
console.log(`Before: Pet grooming special = ${!!isSpecialService('pet-grooming.near-me.us')}`);

addSpecialService({
  subdomain: 'pet-grooming.near-me.us',
  category: 'Pet Grooming Services',
  isPathBased: true,
  description: 'Pet grooming services with city-based routing'
});

console.log(`After: Pet grooming special = ${!!isSpecialService('pet-grooming.near-me.us')}`);

// Example 3: Add a blocked subdomain
console.log('\n🚫 Adding Blocked Subdomain:');
console.log(`Before: Internal blocked = ${isBlockedSubdomain('internal.near-me.us')}`);

addBlockedSubdomain('internal.near-me.us');

console.log(`After: Internal blocked = ${isBlockedSubdomain('internal.near-me.us')}`);

console.log('\n✅ Configuration additions completed!');

// Example 4: How to use this in your application
console.log('\n📝 Usage in Application:');
console.log(`
// In your application code:
import { getCityState, addCityStateMapping } from '../config/subdomainExceptions';

// Add new city when user requests it
if (!isSupportedCity('new-city')) {
  addCityStateMapping({
    city: 'new-city',
    state: 'State Name',
    aliases: ['newcity']
  });
}

// Get city state for routing
const state = getCityState('new-city');
console.log(\`Routing to: \${state}\`);
`);

export {};
