# Scripts Directory

This directory contains automation scripts for managing the Near Me directory platform. These scripts handle deployment, data management, and production optimization tasks.

## 📋 Script Overview

### 🚀 Deployment & Infrastructure

```
╭─────────────────────────────────────────────────────────────────────────────────╮
│                              deploy-category.js                                 │
╰─────────────────────────────────────────────────────────────────────────────────╯
```

**Purpose**: Automated end-to-end deployment pipeline for new business categories.

**Usage**:
```bash
# Deploy a new category
node scripts/deploy-category.js <category> <city> [data-source]

# Rollback a deployment
node scripts/deploy-category.js rollback <category> <city>
```

**What it does**:
1. **Data Import**: Imports business data from CSV, JSON, or Google Places API
2. **Migration Generation**: Creates database migration files
3. **Database Migration**: Executes migration against Cloudflare D1
4. **Subdomain Setup**: Configures subdomain routing and DNS
5. **Routing Updates**: Updates application routing configuration
6. **Deployment Verification**: Tests database, API, and subdomain functionality

**Examples**:
```bash
node scripts/deploy-category.js nail-salons frisco ./data/nail-salons.csv
node scripts/deploy-category.js restaurants downtown ./data/restaurants.json
node scripts/deploy-category.js auto-repair oakland "auto repair shops"
node scripts/deploy-category.js rollback nail-salons frisco
```

```
╭─────────────────────────────────────────────────────────────────────────────────╮
│                             manage-subdomains.js                                │
╰─────────────────────────────────────────────────────────────────────────────────╯
```

**Purpose**: Manages subdomain configuration for different business categories and cities.

**Usage**:
```bash
# Add a new subdomain
node scripts/manage-subdomains.js add <category> [city]

# Remove a subdomain
node scripts/manage-subdomains.js remove <subdomain>

# List all subdomains
node scripts/manage-subdomains.js list

# Generate Cloudflare configuration
node scripts/manage-subdomains.js cloudflare
```

**What it does**:
- Creates subdomain configurations with SEO metadata
- Generates TypeScript configuration files
- Updates routing and header configurations
- Provides Cloudflare DNS setup instructions

**Examples**:
```bash
node scripts/manage-subdomains.js add nail-salons frisco
node scripts/manage-subdomains.js add restaurants
node scripts/manage-subdomains.js remove nail-salons-frisco
node scripts/manage-subdomains.js list
```

---

### 📊 Data Management

```
╭─────────────────────────────────────────────────────────────────────────────────╮
│                             business-importer.js                                │
╰─────────────────────────────────────────────────────────────────────────────────╯
```

**Purpose**: Imports business data from multiple sources into the database.

**Usage**:
```bash
node scripts/business-importer.js <source-type> <file-or-query> <category> <city>
```

**Source Types**:
- `csv` - Import from CSV file
- `json` - Import from JSON file
- `places` - Import from Google Places API search

**What it does**:
- Parses data from various formats
- Validates and normalizes business information
- Handles Google Places API integration
- Generates structured data for database insertion

```
╭─────────────────────────────────────────────────────────────────────────────────╮
│                           generate-migration.js                                 │
╰─────────────────────────────────────────────────────────────────────────────────╯
```

**Purpose**: Creates database migration files for new business data.

**Usage**:
```bash
node scripts/generate-migration.js <category> <city> [data-file.json]
```

**What it does**:
- Generates timestamped migration files
- Creates SQL INSERT statements for businesses
- Handles data sanitization and validation
- Organizes migrations by category and location

---

### 🏗️ Database Population

```
╭─────────────────────────────────────────────────────────────────────────────────╮
│                             populate-cities.js                                  │
╰─────────────────────────────────────────────────────────────────────────────────╯
```

**Purpose**: Extracts and populates the cities table from existing business data.

**Usage**:
```bash
node scripts/populate-cities.js
```

**What it does**:
- Queries unique cities from businesses table
- Creates proper city records with normalized IDs
- Handles city name formatting and deduplication

```
╭─────────────────────────────────────────────────────────────────────────────────╮
│                          populate-neighborhoods.js                              │
╰─────────────────────────────────────────────────────────────────────────────────╯
```

**Purpose**: Migrates neighborhood data from JSON files to the database.

**Usage**:
```bash
node scripts/populate-neighborhoods.js
```

**What it does**:
- Reads from `src/data/neighborhoods.json`
- Creates neighborhood records linked to cities
- Generates normalized neighborhood IDs

```
╭─────────────────────────────────────────────────────────────────────────────────╮
│                            populate-services.js                                 │
╰─────────────────────────────────────────────────────────────────────────────────╯
```

**Purpose**: Migrates service categories from JSON files to the database.

**Usage**:
```bash
node scripts/populate-services.js
```

**What it does**:
- Reads from `src/data/services.json`
- Creates service records organized by category
- Generates normalized service IDs

---

### 🌐 Content Generation

```
╭─────────────────────────────────────────────────────────────────────────────────╮
│                         generate-subdomain-html.js                              │
╰─────────────────────────────────────────────────────────────────────────────────╯
```

**Purpose**: Generates static HTML files for subdomains with SEO optimization.

**Usage**:
```bash
node scripts/generate-subdomain-html.js
```

**What it does**:
- Reads configuration from `config/subdomain-generation.json`
- Generates SEO-optimized HTML pages for each subdomain
- Creates category-specific landing pages
- Handles metadata, structured data, and social media tags

---

### ⚡ Production Optimization

```
╭─────────────────────────────────────────────────────────────────────────────────╮
│                          optimize-production.js                                 │
╰─────────────────────────────────────────────────────────────────────────────────╯
```

**Purpose**: Post-build optimization for production deployment.

**Usage**:
```bash
node scripts/optimize-production.js
```

**What it does**:
- Generates build manifests with cache keys
- Creates cache control headers configuration
- Generates deployment information and metadata
- Optimizes files for CDN deployment

---

## 🔧 Prerequisites

### Environment Variables
```bash
# Required for Google Places API integration
GOOGLE_PLACES_API_KEY=your_api_key_here
```

### Dependencies
- **Node.js** 18+ with ES modules support
- **Wrangler CLI** for Cloudflare D1 database operations
- **jq** for JSON parsing in verification scripts
- **curl** for API testing

### Database
- Cloudflare D1 database named `nearme-db`
- Tables: `businesses`, `cities`, `neighborhoods`, `services`

## 📝 Common Workflows

### Adding a New Business Category
```bash
# 1. Deploy the category with data
node scripts/deploy-category.js nail-salons frisco ./data/nail-salons.csv

# 2. Verify the deployment
curl "https://near-me.us/api/businesses?category=nail-salons&city=frisco"

# 3. Check the subdomain
open https://nail-salons-frisco.near-me.us
```

### Setting Up Base Data
```bash
# 1. Populate cities from existing business data
node scripts/populate-cities.js

# 2. Add neighborhoods
node scripts/populate-neighborhoods.js

# 3. Add services
node scripts/populate-services.js
```

### Production Deployment
```bash
# 1. Build the application
npm run build

# 2. Optimize for production
node scripts/optimize-production.js

# 3. Deploy to Cloudflare Pages
npm run deploy
```

## 🚨 Troubleshooting

### Common Issues

**Database Connection Issues**:
```bash
# Test Wrangler connection
wrangler d1 execute nearme-db --command "SELECT 1;"
```

**Missing API Key**:
```bash
# Check environment variables
echo $GOOGLE_PLACES_API_KEY
```

**Permission Issues**:
```bash
# Make scripts executable
chmod +x scripts/*.js
```

### Rollback Procedures

**Rollback Category Deployment**:
```bash
node scripts/deploy-category.js rollback nail-salons frisco
```

**Manual Database Cleanup**:
```bash
wrangler d1 execute nearme-db --command "DELETE FROM businesses WHERE category = 'category-name' AND city = 'city-name';"
```

## 📚 File Dependencies

- **Configuration**: `src/config/subdomain-generation.json`
- **Data Sources**: `src/data/neighborhoods.json`, `src/data/services.json`
- **Migrations**: `migrations/d1/` directory
- **Generated Files**: `src/config/subdomains.ts`, `src/config/subdomains.json`

## 🔍 Script Relationships

```
deploy-category.js
├── business-importer.js    (data import)
├── generate-migration.js   (migration creation)
├── manage-subdomains.js    (subdomain setup)
└── (database execution)

manage-subdomains.js
└── generate-subdomain-html.js (HTML generation)

populate-*.js scripts
└── (database population from static data)
```

---

*Last updated: July 15, 2025*
*For technical support, refer to the main project README or documentation.*
