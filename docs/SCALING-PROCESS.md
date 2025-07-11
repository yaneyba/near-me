# Scaling Process for Near-Me Platform

This document outlines the standardized process for adding new business categories and cities to the Near-Me platform.

## Quick Start - Adding a New Category

### Method 1: Automated Deployment (Recommended)
```bash
# Deploy with CSV data
npm run deploy:category restaurants downtown ./data/restaurants.csv

# Deploy with JSON data  
npm run deploy:category auto-repair oakland ./data/auto-repair.json

# Deploy with Google Places search
npm run deploy:category hair-salons sacramento "hair salons"
```

### Method 2: Manual Step-by-Step
```bash
# 1. Import business data
npm run import:businesses csv ./data/nail-salons.csv nail-salons frisco

# 2. Generate migration
npm run migration:generate nail-salons frisco ./temp/imported-data.json

# 3. Run migration
wrangler d1 execute nearme-db --file=./migrations/d1/[generated-file].sql --remote

# 4. Add subdomain
npm run subdomain:add nail-salons frisco

# 5. Verify deployment
curl "https://nail-salons-frisco.near-me.us/api/businesses?category=nail-salons&city=frisco"
```

## Scaling Architecture

### 1. Data Import Sources
- **CSV Files**: Standard business data exports
- **JSON Files**: Structured business data
- **Google Places API**: Automated discovery (requires API key)
- **Manual Entry**: Admin dashboard submission

### 2. Migration System
- **Automated SQL Generation**: Creates proper INSERT statements
- **Schema Validation**: Ensures data matches database structure
- **Rollback Support**: Can undo migrations if needed
- **Versioning**: Timestamped migration files

### 3. Subdomain Management
- **Dynamic Configuration**: Auto-generates subdomain configs
- **SEO Optimization**: Category-specific titles and descriptions
- **Cloudflare Integration**: Generates header configurations

### 4. Deployment Pipeline
```
Data Source → Import → Migration → Database → Subdomain → Verification
     ↓           ↓         ↓          ↓          ↓          ↓
   CSV/JSON  → Normalize → SQL     → D1      → Config  → API Test
```

## Available Commands

### Data Management
```bash
# Import from various sources
npm run import:businesses csv ./data/businesses.csv category city
npm run import:businesses json ./data/businesses.json category city
npm run import:businesses places "search query" category city

# Generate and run migrations
npm run migration:generate category city [data-file]
npm run migration:run --file=./migrations/d1/[file].sql

# Database operations
npm run db:migrate                    # Apply all pending migrations
npm run db:backup                     # Backup entire database
npm run db:query "SELECT * FROM..."  # Run custom query
```

### Subdomain Management
```bash
# Subdomain operations
npm run subdomain:add category [city]       # Add new subdomain
npm run subdomain:remove subdomain-name     # Remove subdomain
npm run subdomain:list                      # List all subdomains
npm run subdomain:cloudflare               # Generate Cloudflare config
```

### Deployment & Rollback
```bash
# Full category deployment
npm run deploy:category category city [data-source]

# Rollback if needed
npm run rollback:category category city
```

## Data Format Standards

### CSV Format
```csv
name,description,phone,website,address,city,state,rating,services
"Business Name","Description","(555) 123-4567","https://example.com","123 Main St","san-francisco","California",4.5,"Service 1,Service 2"
```

### JSON Format
```json
[
  {
    "name": "Business Name",
    "description": "Business description",
    "phone": "(555) 123-4567",
    "website": "https://example.com",
    "address": "123 Main St, City, CA 12345",
    "city": "san-francisco",
    "state": "California",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "hours": {
      "monday": "9:00 AM - 6:00 PM",
      "tuesday": "9:00 AM - 6:00 PM"
    },
    "services": ["Service 1", "Service 2"],
    "rating": 4.5,
    "review_count": 150,
    "verified": true,
    "established": 2020
  }
]
```

## Verification Checklist

After deploying a new category:

### ✅ Database Verification
```bash
# Check business count
wrangler d1 execute nearme-db --command="SELECT COUNT(*) FROM businesses WHERE category = 'CATEGORY' AND city = 'CITY';" --remote

# Sample data
wrangler d1 execute nearme-db --command="SELECT name, address FROM businesses WHERE category = 'CATEGORY' LIMIT 3;" --remote
```

### ✅ API Verification
```bash
# Test API endpoint
curl "https://near-me.us/api/businesses?category=CATEGORY&city=CITY"

# Check response structure
curl "https://near-me.us/api/businesses?category=CATEGORY&city=CITY" | jq '.[0] | keys'
```

### ✅ Subdomain Verification
```bash
# Test subdomain
curl "https://CATEGORY-CITY.near-me.us/"

# Check subdomain configuration
npm run subdomain:list | grep CATEGORY-CITY
```

## Scaling Considerations

### Performance
- **Database Indexing**: Ensure proper indexes on category/city columns
- **Caching**: Implement Redis/Cloudflare caching for popular endpoints
- **CDN**: Use Cloudflare CDN for static assets and API responses

### Monitoring
- **Error Tracking**: Monitor API error rates per category
- **Usage Analytics**: Track subdomain traffic and popular categories
- **Database Metrics**: Monitor D1 query performance and storage usage

### Maintenance
- **Data Quality**: Regular audits of business information accuracy
- **Image Management**: Automated image optimization and CDN delivery
- **SEO Updates**: Regular updates to category-specific SEO content

## Rollback Procedures

If a deployment fails or needs to be reversed:

```bash
# Automated rollback
npm run rollback:category category city

# Manual rollback steps
npm run subdomain:remove category-city
wrangler d1 execute nearme-db --command="DELETE FROM businesses WHERE category = 'CATEGORY' AND city = 'CITY';" --remote
```

## Best Practices

1. **Test Locally First**: Always test migrations on local database before production
2. **Backup Before Major Changes**: Use `npm run db:backup` before bulk operations
3. **Verify Data Quality**: Review imported data for completeness and accuracy
4. **Monitor After Deployment**: Check API responses and error rates post-deployment
5. **Document Changes**: Update this document when adding new features or processes

## Future Enhancements

- **Automated Data Validation**: Pre-import data quality checks
- **Bulk Operations**: Multi-category deployments in single command
- **Integration APIs**: Direct integration with business directory APIs
- **A/B Testing**: Support for testing different business categorizations
- **Analytics Dashboard**: Real-time monitoring of category performance
