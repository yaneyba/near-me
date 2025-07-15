# Custom Layout Deployment Guide

## Overview
This guide documents the complete process for creating and deploying new custom layout sites, based on lessons learned from the senior-care implementation.

## Architecture Overview

### CustomLayout System Components
1. **Configuration** (`src/config/customLayouts/`)
2. **React Components** (`src/components/layouts/[category]/`)
3. **Routing** (`src/components/routing/[Category]World.tsx`)
4. **Subdomain Detection** (`src/utils/subdomainParser.ts`)
5. **Build Generation** (`config/subdomain-generation.json`)

## Step-by-Step Deployment Process

### Phase 1: Configuration Setup
1. **Create Layout Config**
   ```typescript
   // src/config/customLayouts/[category]Config.ts
   export const [category]Config: CustomLayoutConfig = {
     branding: { /* theme colors, logo, name */ },
     hero: { /* headline, description, CTA */ },
     navigation: { /* menu items */ },
     footer: { /* links, contact */ },
     features: { /* special features */ },
     statistics: { /* category stats */ }
   };
   ```

2. **Update CustomLayout Registry**
   ```typescript
   // src/config/customLayouts/index.ts
   export const customLayoutConfigs = {
     '[category]': [category]Config,
     // ... existing configs
   };
   ```

### Phase 2: Component Creation
1. **Create Layout Component**
   ```typescript
   // src/components/layouts/[category]/Layout.tsx
   import { CustomLayout } from '../CustomLayout';
   import { [category]Config } from '../../../config/customLayouts/[category]Config';
   
   export const [Category]Layout = () => (
     <CustomLayout config={[category]Config} />
   );
   ```

2. **Create Index Exports**
   ```typescript
   // src/components/layouts/[category]/index.ts
   export { [Category]Layout } from './Layout';
   ```

### Phase 3: Routing Integration
1. **Create Category World Component**
   ```typescript
   // src/components/routing/[Category]World.tsx
   export const [Category]World = () => {
     const location = useLocation();
     
     if (location.pathname === '/') {
       return <[Category]HomePage />;
     }
     // ... additional routes
   };
   ```

2. **Update SubdomainInfo Type**
   ```typescript
   // src/types/subdomain.ts
   export interface SubdomainInfo {
     // ... existing properties
     is[Category]: boolean;
   }
   ```

3. **Update Subdomain Parser**
   ```typescript
   // src/utils/subdomainParser.ts
   const subdomainMappings = {
     '[category]': { 
       is[Category]: true,
       // ... other properties
     },
   };
   ```

4. **Update SmartDoor Routing**
   ```typescript
   // src/components/routing/SmartDoor.tsx
   if (subdomainInfo.is[Category]) {
     return <[Category]World />;
   }
   ```

### Phase 4: Subdomain Configuration
1. **Update Subdomain Generation Config**
   ```json
   // config/subdomain-generation.json
   {
     "layouts": {
       "[layout-group]": {
         "description": "[Category] services layout",
         "categories": ["[category]"],
         "generateHTML": true
       }
     }
   }
   ```

### Phase 5: Data Preparation & Migration

#### Critical Data Format Requirements
⚠️ **KEY LESSON**: Migration generator expects **JSON**, not CSV!

1. **Prepare Data in JSON Format**
   ```json
   // data/[category]-[city].json
   [
     {
       "name": "Business Name",
       "description": "Business description",
       "phone": "(555) 123-4567",
       "website": "https://example.com",
       "address": "123 Main St",
       "city": "CityName",
       "state": "State",
       "zip_code": "12345",
       "latitude": 12.3456,
       "longitude": -78.9012,
       "rating": 4.5,
       "review_count": 100,
       "verified": true,
       "premium": false,
       "status": "active",
       "established": 2020,
       "hours": {
         "monday": "9:00 AM - 5:00 PM",
         // ... other days
       },
       "services": ["Service 1", "Service 2"],
       "image_url": "/images/businesses/[category]-placeholder.svg"
     }
   ]
   ```

2. **Verify Database Schema Compatibility**
   ```bash
   # Check current schema
   wrangler d1 execute nearme-db --command="SELECT sql FROM sqlite_master WHERE type='table' AND name='businesses';" --remote
   ```

   Key schema fields:
   - `image_url` (NOT `image`)
   - `services` as JSON string
   - `hours` as JSON string
   - `verified`/`premium` as integers (0/1)

3. **Create Placeholder Assets**
   ```bash
   # Create images directory if needed
   mkdir -p public/images/businesses
   
   # Create SVG placeholder
   # public/images/businesses/[category]-placeholder.svg
   ```

### Phase 6: Database Migration
1. **Generate Migration**
   ```bash
   node scripts/generate-migration.js [category] [city] ./data/[category]-[city].json
   ```

2. **Apply Migration**
   ```bash
   wrangler d1 execute nearme-db --file=./migrations/d1/[timestamp]_data_[category]_businesses.sql --remote
   ```

3. **Verify Data**
   ```bash
   wrangler d1 execute nearme-db --command="SELECT name, city, category, rating FROM businesses WHERE category='[category]';" --remote
   ```

### Phase 7: Build & Deploy
1. **Build Project**
   ```bash
   npm run build
   ```

2. **Verify Generated Files**
   - `dist/[category].html` should be created
   - Check SEO meta tags and Open Graph data

## Common Pitfalls & Solutions

### 🚨 Data Format Issues
- **Problem**: CSV passed to migration generator
- **Solution**: Always convert to JSON first
- **Tool**: Use business-importer.js for CSV → JSON conversion

### 🚨 Schema Mismatches
- **Problem**: `image` vs `image_url` column names
- **Solution**: Always check database schema first
- **Fix**: Use sed to replace incorrect column names in migration

### 🚨 Routing Not Working
- **Problem**: Forgot to update SmartDoor or SubdomainInfo
- **Solution**: Follow all routing integration steps
- **Check**: Ensure subdomain detection logic is complete

### 🚨 Build Failures
- **Problem**: Missing exports or TypeScript errors
- **Solution**: Verify all index.ts exports and type definitions
- **Test**: Run `npm run build` early and often

## Automated Deployment Script Ideas

### Future Improvement: Single Command Deployment
```bash
# Proposed future command
node scripts/deploy-custom-layout.js [category] [city] [data-file.json] [config-options]

# This would:
# 1. Generate all configuration files
# 2. Create React components
# 3. Update routing
# 4. Process data and create migration
# 5. Apply to database
# 6. Update subdomain config
# 7. Build and verify
```

### Template Generation
Consider creating templates for:
- Layout configurations
- React components
- Routing components
- Migration data format

## Testing Checklist

### Pre-Deployment
- [ ] Configuration files created
- [ ] Components exported properly
- [ ] Routing updated in all locations
- [ ] Subdomain config updated
- [ ] Data in correct JSON format
- [ ] Database schema verified
- [ ] Placeholder assets created

### Post-Deployment
- [ ] Migration applied successfully
- [ ] Data query returns expected results
- [ ] Build completes without errors
- [ ] HTML file generated with correct meta tags
- [ ] Subdomain routing works locally

### Production Verification
- [ ] Subdomain resolves correctly
- [ ] API endpoints return data
- [ ] UI renders with custom branding
- [ ] SEO tags are correct
- [ ] Images load properly

## Key Files Modified

Every custom layout deployment touches these files:
1. `src/config/customLayouts/[category]Config.ts` (new)
2. `src/config/customLayouts/index.ts` (update)
3. `src/components/layouts/[category]/` (new directory)
4. `src/components/routing/[Category]World.tsx` (new)
5. `src/types/subdomain.ts` (update)
6. `src/utils/subdomainParser.ts` (update)
7. `src/components/routing/SmartDoor.tsx` (update)
8. `config/subdomain-generation.json` (update)
9. `data/[category]-[city].json` (new)
10. `public/images/businesses/[category]-placeholder.svg` (new)

## Time Estimates

- **Configuration & Components**: 30-45 minutes
- **Routing Integration**: 15-30 minutes  
- **Data Preparation**: 15-30 minutes (if starting with clean JSON)
- **Database Migration**: 10-15 minutes
- **Build & Verification**: 10-15 minutes

**Total**: ~1.5-2.5 hours for experienced developer

With automation scripts, this could be reduced to 15-30 minutes.
