// Test script to verify subdomain parser logic
const { parseSubdomain } = require('./dist/assets/index-1F91JkiK.js');

// Test cases
const testCases = [
  { hostname: 'ss.near-me.us', expected: 'services' },
  { hostname: 'unknown.near-me.us', expected: 'services' },
  { hostname: 'invalid.test.near-me.us', expected: 'services' },
  { hostname: 'nail-salons.dallas.near-me.us', expected: 'valid' },
  { hostname: 'auto-repair.denver.near-me.us', expected: 'valid' },
];

console.log('Testing subdomain parser logic...');

testCases.forEach(({ hostname, expected }) => {
  console.log(`\nTesting: ${hostname}`);
  console.log(`Expected: ${expected}`);
  
  // Mock window.location for testing
  const mockLocation = {
    hostname: hostname,
    pathname: '/'
  };
  
  try {
    // This would require actual implementation to test
    console.log('Test would require actual subdomain parsing logic');
  } catch (error) {
    console.log('Error:', error.message);
  }
});
