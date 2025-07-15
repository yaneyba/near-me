# Custom Layout Quick Deploy Checklist

## Pre-Flight Check
- [ ] Have business data in **JSON format** (not CSV!)
- [ ] Verified database schema uses `image_url` not `image`
- [ ] Created placeholder SVG image in `public/images/businesses/`
- [ ] Chose unique category name (kebab-case)

## 🚀 Rapid Deployment Steps

### 1. Config & Components (5-10 min)
```bash
# Create config file
touch src/config/customLayouts/[category]Config.ts

# Create component directory
mkdir -p src/components/layouts/[category]

# Create routing component  
touch src/components/routing/[Category]World.tsx
```

### 2. Update Core Files (10-15 min)
- [ ] `src/config/customLayouts/index.ts` - Add to registry
- [ ] `src/types/subdomain.ts` - Add `is[Category]: boolean`
- [ ] `src/utils/subdomainParser.ts` - Add subdomain mapping
- [ ] `src/components/routing/SmartDoor.tsx` - Add routing condition
- [ ] `config/subdomain-generation.json` - Add category to layout

### 3. Data & Migration (10-15 min)
```bash
# Generate migration (JSON input only!)
node scripts/generate-migration.js [category] [city] ./data/[category]-[city].json

# Apply to database
wrangler d1 execute nearme-db --file=./migrations/d1/[timestamp]_*.sql --remote

# Verify data
wrangler d1 execute nearme-db --command="SELECT name FROM businesses WHERE category='[category]';" --remote
```

### 4. Build & Test (5 min)
```bash
# Build project
npm run build

# Check generated file exists
ls dist/[category].html
```

## 🐛 Quick Fixes for Common Issues

### "image column doesn't exist"
```bash
sed -i '' 's/image,/image_url,/g' migrations/d1/[migration-file].sql
```

### "Unexpected token" (JSON parse error)
- **Cause**: Passed CSV to migration generator
- **Fix**: Convert CSV to JSON first or use business-importer.js

### TypeScript errors
```bash
# Check exports
grep -r "export.*[Category]" src/components/layouts/[category]/
```

### Subdomain not routing
- Check SmartDoor has `if (subdomainInfo.is[Category])`
- Verify subdomainParser has mapping entry
- Ensure SubdomainInfo type has property

## 📋 Data Format Template

```json
[
  {
    "name": "Business Name",
    "description": "Brief description",
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
      "monday": "9:00 AM - 5:00 PM"
    },
    "services": ["Service 1", "Service 2"],
    "image_url": "/images/businesses/[category]-placeholder.svg"
  }
]
```

## ⚡ Speed Tips

1. **Copy existing config** - Start with similar category config, find/replace
2. **Batch file creation** - Create all files before editing content
3. **Use VS Code multi-cursor** - Edit multiple similar lines at once
4. **Test early, test often** - Run `npm run build` after each major step
5. **Keep terminal open** - Don't close wrangler sessions, reuse them

## 🎯 Success Metrics

- [ ] `npm run build` completes without errors
- [ ] `dist/[category].html` exists with correct title
- [ ] Database query returns expected business count
- [ ] No TypeScript compilation errors
- [ ] Subdomain mapping exists in parser

## Time Target: 30-45 minutes end-to-end
