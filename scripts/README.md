# Scripts Directory

This directory contains essential utility scripts for the Near Me directory application.

## Core Scripts

### 🏗️ **Production & Build**

#### `generate-subdomain-html.js`
- **Purpose**: Generates static HTML files for SEO-optimized subdomain pages
- **Usage**: Automatically run during `npm run build`
- **Output**: Creates HTML files for each category subdomain (nail-salons.html, water-refill.html, etc.)
- **Features**: 
  - OpenGraph metadata for social sharing
  - Structured data for search engines
  - AquaFinder branding for water-refill pages

#### `optimize-production.js`
- **Purpose**: Post-build optimization for production deployment
- **Usage**: `npm run optimize:production`
- **Features**:
  - Generates build manifest with cache keys
  - Creates cache control headers
  - Deployment info generation

### 📊 **Database Management**

#### `generate-migration.js`
- **Purpose**: Creates database migration files for new business categories
- **Usage**: `npm run migration:generate <category> <city> [data-file.json]`
- **Example**: `npm run migration:generate nail-salons frisco ./data/nail-salons.json`
- **Output**: SQL migration files in `migrations/d1/` directory

#### `business-importer.js`
- **Purpose**: Import business data from various sources (CSV, JSON, Google Places API)
- **Usage**: `npm run import:businesses <source-type> <file-or-query> [options]`
- **Features**:
  - CSV file import
  - JSON file import  
  - Google Places API integration
  - Data validation and cleaning

#### `populate-cities.js`
- **Purpose**: Populate cities reference table
- **Usage**: `node scripts/populate-cities.js`
- **Features**: Adds city data for location filtering

#### `populate-neighborhoods.js`
- **Purpose**: Populate neighborhoods reference table
- **Usage**: `node scripts/populate-neighborhoods.js`
- **Features**: Adds neighborhood data for granular location filtering

#### `populate-services.js`
- **Purpose**: Populate services reference table
- **Usage**: `node scripts/populate-services.js`
- **Features**: Adds service category data

### 🌐 **Subdomain & Deployment**

#### `manage-subdomains.js`
- **Purpose**: Manage subdomain configuration for different business categories
- **Usage**: 
  - `npm run subdomain:add <category> [city]`
  - `npm run subdomain:remove <subdomain>`
  - `npm run subdomain:list`
  - `npm run subdomain:cloudflare`
- **Features**:
  - Add/remove subdomain configurations
  - Update site configuration files
  - Cloudflare DNS management integration

#### `deploy-category.js`
- **Purpose**: Automated deployment pipeline for new business categories
- **Usage**: 
  - `npm run deploy:category <category> <city> [data-source]`
  - `npm run rollback:category <category>`
- **Features**:
  - End-to-end category deployment
  - Data import, migration, and subdomain setup
  - Rollback functionality
  - Production deployment automation

## Script Dependencies

### Environment Variables Required:
- `GOOGLE_PLACES_API_KEY` - For Google Places API integration in business-importer.js
- `CLOUDFLARE_API_TOKEN` - For Cloudflare DNS management in manage-subdomains.js

### Database Access:
All database scripts use the corrected database name `nearme-db` with `--remote` flag:
```bash
wrangler d1 execute nearme-db --remote --file=./migrations/d1/migration.sql
```

## Common Workflows

### Adding a New Business Category:
1. **Generate Migration**: `npm run migration:generate <category> <city> [data-file]`
2. **Import Data**: `npm run import:businesses csv ./data/<category>-data.csv`
3. **Add Subdomain**: `npm run subdomain:add <category>`
4. **Deploy**: `npm run deploy:category <category> <city>`

### Build & Deploy:
1. **Development Build**: `npm run build`
2. **Production Build**: `npm run build:production`
3. **SEO Generation Only**: `npm run build:seo`

### Database Operations:
1. **Run Migration**: `npm run migration:run --file=./migrations/d1/<migration-file>.sql`
2. **Backup Database**: `npm run db:backup`
3. **Apply Migrations**: `npm run db:migrate`

## Notes

- All scripts are ES modules (use `import/export` syntax)
- Database scripts require `--remote` flag to access production database
- Scripts generate appropriate file structures and handle directory creation
- Error handling and validation included in all production scripts
- Logging and progress reporting for all operations

## Maintenance

Regular cleanup performed to remove:
- ❌ One-time migration/fix scripts
- ❌ Documentation-only summary scripts  
- ❌ Development/testing utilities
- ❌ Deprecated or unused functionality

Only production-essential and actively-used scripts are maintained in this directory.
