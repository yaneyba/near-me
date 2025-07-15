# Near Me Directory Documentation

## Essential Documentation

- **[README.md](README.md)** - Database management guide (⚠️ Always use --remote flag)
- **[SUBDOMAIN_WORKFLOW.md](SUBDOMAIN_WORKFLOW.md)** - Subdomain routing and management
- **[database-schema.json](../database/database-schema.json)** - Complete database structure and schema

## Quick Reference

### Database Operations
```bash
# Connect to remote production database
wrangler d1 execute nearme-db --remote --command "SELECT * FROM businesses;"

# List all tables
wrangler d1 execute nearme-db --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
```

### Project Structure
- **Frontend**: React + TypeScript + Vite
- **Backend**: Cloudflare Functions + D1 Database
- **Routing**: SmartDoor component handles all subdomain routing
- **SEO**: Static HTML generation for subdomains

### Key Files
- `scripts/generate-subdomain-html.js` - Static site generator
- `functions/api/` - API endpoints
- `src/components/routing/SmartDoor.tsx` - Routing logic

**Status**: ✅ Clean and minimal  
**Last Updated**: July 15, 2025
