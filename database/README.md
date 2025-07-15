# Database Management Guide

## ⚠️ **CRITICAL: Always Use --remote Flag**

**This project uses REMOTE production database only. Local database will cause confusion and data loss.**

```bash
# ✅ CORRECT - Always use --remote
wrangler d1 execute nearme-db --remote --command "SELECT * FROM businesses;"

# ❌ WRONG - Creates/uses local database instead of production
wrangler d1 execute nearme-db --command "SELECT * FROM businesses;"
```

---

## Overview
This project uses **Cloudflare D1** (SQLite-based) as the primary database for the Near Me directory application.

## Database Connection Details

### Database ID
- **Production Database**: `86879c31-0686-4532-a66c-f310b89d7a27`
- **Name**: `nearme-db`

### Connection Methods

#### 1. Using Cloudflare Dashboard
- Navigate to: [Cloudflare Dashboard > Workers & Pages > D1](https://dash.cloudflare.com/86879c31068645326af310b89d7a27/workers/d1)
- Select database: `nearme-db`
- Use the built-in query console

#### 2. Using Wrangler CLI
```bash
# Connect to the REMOTE database (ALWAYS use --remote for this project)
wrangler d1 execute nearme-db --remote --command "SELECT name FROM sqlite_master WHERE type='table';"

# Run queries from file on REMOTE database
wrangler d1 execute nearme-db --remote --file=./database/queries/sample.sql

# Get database info (remote)
wrangler d1 info nearme-db

# ⚠️ IMPORTANT: Always use --remote flag to avoid local database confusion
```

#### 3. Using VS Code Extension
- Install: **Database Client JDBC** extension
- Use the `dbclient-*` tools available in the workspace

### Configuration Files

#### wrangler.toml
```toml
[[d1_databases]]
binding = "DB"
database_name = "nearme-db"
database_id = "86879c31-0686-4532-a66c-f310b89d7a27"
```

#### Environment Variables
- `DATABASE_URL`: Set in Cloudflare Pages environment
- `CLOUDFLARE_D1_TOKEN`: For API access (if needed)

## Database Schema

The current schema is documented in `database-schema.json` which contains:

### Core Tables
1. **businesses** - Main business directory data
2. **cities** - City reference data
3. **neighborhoods** - Neighborhood data
4. **services** - Service categories

### Business Management
5. **business_submissions** - New business applications
6. **business_profiles** - Business owner profiles
7. **contact_messages** - Customer inquiries

### System Tables
8. **admin_settings** - Application configuration
9. **user_engagement_events** - Analytics data
10. **stripe_orders** - Payment processing
11. **d1_migrations** - Database version control

## Common Operations

### Viewing Data
```sql
-- List all tables
SELECT name FROM sqlite_master WHERE type='table';

-- Check business count by category
SELECT category, COUNT(*) FROM businesses GROUP BY category;

-- View water refill stations
SELECT name, address, city FROM businesses WHERE category = 'water-refill';
```

### Schema Updates
```sql
-- Export current schema
.schema > database-schema.sql

-- Check table structure
PRAGMA table_info(businesses);
```

### Data Export/Import
```bash
# Export data (ALWAYS use --remote)
wrangler d1 execute nearme-db --remote --command ".dump" > backup.sql

# Import data (be careful! ALWAYS use --remote)
wrangler d1 execute nearme-db --remote --file=backup.sql
```

## API Integration

### D1DataProvider (src/providers/D1DataProvider.ts)
- Handles all database queries from the React application
- Uses fetch to call Cloudflare Functions
- Implements caching and error handling

### API Endpoints (functions/api/)
- `businesses.ts` - Business CRUD operations
- `cities.ts` - City data
- `water-stations/` - Water refill specific endpoints

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check Cloudflare D1 service status
   - Verify database ID in wrangler.toml

2. **Local vs Remote Database Confusion** ⚠️ **CRITICAL**
   - **Problem**: Wrangler tries to create/use local database instead of remote production database
   - **Symptoms**: Commands work but data doesn't appear in production, or "database not found" errors
   - **Solution**: Always use `--remote` flag with wrangler commands:
     ```bash
     # WRONG (creates/uses local DB)
     wrangler d1 execute nearme-db --command "SELECT * FROM businesses;"
     
     # CORRECT (uses remote production DB)
     wrangler d1 execute nearme-db --remote --command "SELECT * FROM businesses;"
     ```
   - **Rule**: For this project, ALWAYS use `--remote` flag unless explicitly testing locally

3. **Schema Changes Not Reflected**
   - Run migrations using wrangler with `--remote` flag
   - Clear application cache
   - Restart development server

4. **API 500 Errors**
   - Check function logs in Cloudflare dashboard
   - Verify SQL syntax in API functions
   - Check database binding configuration

### Debug Tools

1. **Database Client Extension**
   ```
   Use workspace commands:
   - dbclient-get-databases
   - dbclient-get-tables  
   - dbclient-execute-query
   ```

2. **Console Logging**
   ```javascript
   // In API functions
   console.log('Query:', query);
   console.log('Result:', result);
   ```

3. **Network Tab**
   - Check API request/response in browser dev tools
   - Look for CORS issues or malformed queries

## Migration Strategy

### Schema Changes
1. Create migration SQL file in `sql/migrations/`
2. Test on development database first
3. Apply to production using wrangler
4. Update `database-schema.json` documentation

### Data Updates
1. Always backup before major changes
2. Use transactions for multi-table updates
3. Test data integrity after changes

## Backup & Recovery

### Regular Backups
```bash
# Weekly backup (ALWAYS use --remote)
wrangler d1 execute nearme-db --remote --command ".dump" > "backup-$(date +%Y%m%d).sql"
```

### Recovery Process
1. Identify last known good backup
2. Create new database instance if needed
3. Import backup data
4. Update database ID in configuration
5. Deploy updated configuration

## Performance Optimization

### Indexing Strategy
- Primary keys on all tables (TEXT with UUID)
- Index on `businesses.category` for category queries
- Index on `businesses.city` for location queries
- Composite index on `(category, city)` for filtered searches

### Query Optimization
- Use LIMIT for paginated results
- Avoid SELECT * in production queries
- Use prepared statements for repeated queries
- Cache frequently accessed data

## Security Considerations

### Access Control
- Database binding only available to Cloudflare Functions
- No direct database access from client-side code
- API functions validate input and sanitize queries

### Data Protection
- No sensitive data stored in plain text
- Stripe data handled through secure webhooks
- User emails encrypted where required

---

## Quick Reference

### Database Access Commands
```bash
# Connect to database (REMOTE - production data)
wrangler d1 execute nearme-db --remote

# List tables (REMOTE)
wrangler d1 execute nearme-db --remote --command "SELECT name FROM sqlite_master WHERE type='table';"

# Get business count (REMOTE)
wrangler d1 execute nearme-db --remote --command "SELECT COUNT(*) as total FROM businesses;"

# Check water refill stations (REMOTE)
wrangler d1 execute nearme-db --remote --command "SELECT COUNT(*) as count FROM businesses WHERE category='water-refill';"

# ⚠️ CRITICAL: Always use --remote flag for this project to access production data
```

### Important File Locations
- Database config: `wrangler.toml`
- Schema documentation: `database/database-schema.json`
- API functions: `functions/api/`
- Data provider: `src/providers/D1DataProvider.ts`
- SQL scripts: `sql/`

This guide should prevent future connection struggles and provide a clear reference for database operations.
