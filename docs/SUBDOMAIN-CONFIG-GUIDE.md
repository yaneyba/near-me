# Subdomain Configuration Guide

This guide explains how to manage subdomain routing, city-state mappings, and special services using the configuration system.

## Overview

The subdomain configuration system is centralized in `src/config/subdomainExceptions.ts` and provides a maintainable way to manage:

- **City-to-State Mappings**: Maps cities to their states with support for aliases
- **Special Services**: Services that bypass normal validation (e.g., water-refill, services)
- **Blocked Subdomains**: Domains that should always redirect to the services homepage
- **Utility Functions**: Helper functions for managing the configuration

## Configuration Files

### Main Configuration: `src/config/subdomainExceptions.ts`

This file contains all the configuration data and utility functions.

### Used By: `src/utils/subdomainParser.ts`

The subdomain parser imports and uses the configuration to handle routing logic.

## City-State Mappings

### Structure

```typescript
export interface CityStateMapping {
  city: string;           // Primary city name (kebab-case)
  state: string;          // Full state name
  aliases?: string[];     // Alternative spellings/names
}
```

### Example

```typescript
{ 
  city: 'san-francisco', 
  state: 'California', 
  aliases: ['san-francisco', 'sanfrancisco', 'sf'] 
}
```

### Adding New Cities

To add a new city, add it to the `cityStateMappings` array:

```typescript
// Add to cityStateMappings array
{ 
  city: 'new-city', 
  state: 'State Name',
  aliases: ['newcity', 'nc'] // Optional
}
```

### Programmatic Addition

```typescript
import { addCityStateMapping } from '../config/subdomainExceptions';

addCityStateMapping({
  city: 'new-city',
  state: 'State Name',
  aliases: ['newcity']
});
```

## Special Services

### Structure

```typescript
export interface SpecialService {
  subdomain: string;      // Full subdomain (e.g., 'water-refill.near-me.us')
  category: string;       // Display category name
  isPathBased?: boolean;  // Uses path-based routing
  isWaterRefill?: boolean; // Water refill service flag
  isServices?: boolean;   // Main services directory flag
  description: string;    // Human-readable description
}
```

### Current Special Services

1. **Services Directory**: `services.near-me.us`
   - Main services homepage and fallback
   - `isServices: true`

2. **Water Refill**: `water-refill.near-me.us`
   - Path-based routing (e.g., `/dallas`)
   - `isWaterRefill: true`, `isPathBased: true`

### Adding New Special Services

```typescript
// Add to specialServices array
{
  subdomain: 'new-service.near-me.us',
  category: 'New Service Category',
  isPathBased: true,
  description: 'Description of the new service'
}
```

### Programmatic Addition

```typescript
import { addSpecialService } from '../config/subdomainExceptions';

addSpecialService({
  subdomain: 'new-service.near-me.us',
  category: 'New Service Category',
  description: 'New service description'
});
```

## Blocked Subdomains

### Purpose

Blocked subdomains always redirect to the services homepage. This prevents:
- Administrative subdomains from showing content
- Technical subdomains from being accessed
- Reserved subdomains from being used

### Current Blocked Subdomains

```typescript
'admin.near-me.us',
'api.near-me.us',
'www.near-me.us',
'mail.near-me.us',
'ftp.near-me.us',
'test.near-me.us',
'dev.near-me.us',
'staging.near-me.us'
```

### Adding New Blocked Subdomains

```typescript
// Add to blockedSubdomains array
'new-blocked.near-me.us'
```

### Programmatic Addition

```typescript
import { addBlockedSubdomain } from '../config/subdomainExceptions';

addBlockedSubdomain('new-blocked.near-me.us');
```

## Utility Functions

### City-State Functions

```typescript
// Get state from city name (supports aliases)
getCityState('san-francisco'); // Returns 'California'
getCityState('sf'); // Returns 'California' (alias)

// Check if city is supported
isSupportedCity('dallas'); // Returns true
isSupportedCity('unknown'); // Returns false

// Get all cities for a state
getCitiesForState('Texas'); // Returns ['dallas', 'austin', 'houston', ...]

// Get all supported states
getAllStates(); // Returns ['Arizona', 'California', 'Colorado', ...]

// Get all supported cities
getAllCities(); // Returns ['atlanta', 'austin', 'boston', ...]

// Search cities by partial name
searchCities('san'); // Returns cities containing 'san'
```

### Special Service Functions

```typescript
// Check if subdomain is a special service
isSpecialService('water-refill.near-me.us'); // Returns SpecialService object or null

// Check if subdomain is blocked
isBlockedSubdomain('admin.near-me.us'); // Returns true
```

## How Subdomain Routing Works

### 1. Development Environment
- `localhost` and `127.0.0.1` → Services homepage
- `stackblitz` domains → Services homepage

### 2. Blocked Subdomains
- Always redirect to services homepage
- Checked first before any other logic

### 3. Special Services
- Bypass normal validation
- Handle custom routing logic
- Support path-based routing

### 4. Standard Subdomain Pattern
- Format: `category.city.near-me.us`
- Must have actual business data to be valid
- Invalid combinations → Services homepage

### 5. Fallback
- Any unrecognized pattern → Services homepage

## Common Use Cases

### Adding a New City

1. **Add to Configuration**:
```typescript
// In cityStateMappings array
{ city: 'new-city', state: 'State Name' }
```

2. **Add Business Data**:
```json
// In src/data/businesses.json
{
  "category": "existing-category",
  "city": "new-city",
  "name": "Business Name",
  "address": "123 Main St",
  "phone": "555-0123"
}
```

3. **Test**: Visit `existing-category.new-city.near-me.us`

### Adding a New Special Service

1. **Add to Configuration**:
```typescript
// In specialServices array
{
  subdomain: 'my-service.near-me.us',
  category: 'My Service Category',
  isPathBased: true,
  description: 'My new service'
}
```

2. **Update Parser Logic** (if needed):
```typescript
// In subdomainParser.ts, add special handling if required
if (specialService.isMyService) {
  // Custom logic here
}
```

3. **Test**: Visit `my-service.near-me.us`

### Blocking a Subdomain

1. **Add to Configuration**:
```typescript
// In blockedSubdomains array
'blocked-subdomain.near-me.us'
```

2. **Test**: Visit `blocked-subdomain.near-me.us` → Should redirect to services

## Best Practices

1. **City Names**: Use kebab-case (e.g., `san-francisco`, `new-york`)
2. **Aliases**: Include common alternatives and abbreviations
3. **Documentation**: Update this guide when adding new configurations
4. **Testing**: Always test new configurations in development
5. **Validation**: Ensure business data exists for new city-category combinations

## Troubleshooting

### City Not Recognized
- Check if city is in `cityStateMappings`
- Verify spelling and format (kebab-case)
- Check if aliases are needed

### Subdomain Not Working
- Verify subdomain pattern: `category.city.near-me.us`
- Check if blocked in `blockedSubdomains`
- Ensure business data exists for the combination

### Special Service Not Working
- Check if added to `specialServices`
- Verify custom logic in `subdomainParser.ts`
- Check for conflicts with blocked subdomains

## Future Enhancements

1. **Admin Interface**: Web UI for managing configurations
2. **Database Storage**: Store configurations in Supabase
3. **Analytics**: Track subdomain usage and patterns
4. **Auto-Detection**: Automatically detect new cities from business data
5. **Validation**: Automated testing for subdomain configurations
