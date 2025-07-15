# 🚀 Master Deployment Guide: A to Z

This comprehensive guide walks you through creating and deploying new sites for the Near Me directory platform. We support **3 types** of business category sites.

## 🎯 **The 3 Types of Sites**

### 1. **🏢 Business Services** (Default Layout)
- **Examples**: `nail-salons`, `auto-repair`, `restaurants`, `hair-salons`
- **Focus**: Traditional business directory with ratings, reviews, contact info
- **Features**: City-specific pages, business listings, contact details, hours
- **Layout**: `services` in subdomain-generation.json

### 2. **💧 Custom Layout** (Specialized Branding)
- **Examples**: `water-refill`, `ev-charging`, `public-wifi`
- **Focus**: Location-based services with custom branding and specialized UI
- **Features**: Map integration, custom branding, specialized messaging, unique layouts
- **Layout**: `water` (or other custom layouts) in subdomain-generation.json

### 3. **🍕 Food Delivery** (Future Layout)
- **Example**: `food-delivery`
- **Focus**: Restaurant/cuisine directory with delivery focus
- **Features**: Restaurant listings, cuisine types, delivery areas
- **Layout**: `food` in subdomain-generation.json (not fully implemented)

---

## 📋 **Prerequisites Checklist**

Before you begin, ensure you have:

```bash
✅ Node.js 18+ installed
✅ Wrangler CLI installed and authenticated
✅ Access to Cloudflare D1 database (nearme-db)
✅ Google Places API key (optional, for auto-import)
✅ Project cloned and dependencies installed
```

**Setup Commands**:
```bash
# Install dependencies
npm install

# Test Wrangler connection
wrangler d1 execute nearme-db --command "SELECT 1;" --remote

# Verify scripts work
node scripts/manage-subdomains.js list
```

---

## 🎯 **TYPE 1: Business Services Sites**

### **Step 1: Prepare Your Data**

Create a CSV or JSON file with your business data:

**CSV Format** (`data/nail-salons-frisco.csv`):
```csv
name,description,phone,website,address,city,state,zip_code,latitude,longitude,rating,review_count,verified,premium,status,established,hours,services
"Nail Palace","Full service nail salon","(469) 555-0123","https://nailpalace.com","123 Main St","Frisco","Texas","75034","33.1507","-96.8236","4.5","127","true","false","active","2018","{""monday"":""9:00 AM - 7:00 PM""}","manicure,pedicure,gel nails"
"Beauty Spot","Luxury nail care","(469) 555-0124","https://beautyspot.com","456 Oak Ave","Frisco","Texas","75035","33.1545","-96.8198","4.3","89","true","true","active","2020","{""monday"":""10:00 AM - 8:00 PM""}","manicure,pedicure,nail art"
```

**JSON Format** (`data/nail-salons-frisco.json`):
```json
[
  {
    "name": "Nail Palace",
    "description": "Full service nail salon",
    "phone": "(469) 555-0123",
    "website": "https://nailpalace.com",
    "address": "123 Main St",
    "city": "Frisco",
    "state": "Texas",
    "zip_code": "75034",
    "latitude": 33.1507,
    "longitude": -96.8236,
    "rating": 4.5,
    "review_count": 127,
    "verified": true,
    "premium": false,
    "status": "active",
    "established": 2018,
    "hours": {
      "monday": "9:00 AM - 7:00 PM",
      "tuesday": "9:00 AM - 7:00 PM",
      "wednesday": "9:00 AM - 7:00 PM",
      "thursday": "9:00 AM - 7:00 PM",
      "friday": "9:00 AM - 7:00 PM",
      "saturday": "10:00 AM - 6:00 PM",
      "sunday": "Closed"
    },
    "services": ["manicure", "pedicure", "gel nails", "nail art"]
  }
]
```

### **Step 2: Deploy the Complete Site**

**One Command Deployment**:
```bash
# Deploy with CSV data
node scripts/deploy-category.js nail-salons frisco ./data/nail-salons-frisco.csv

# Deploy with JSON data
node scripts/deploy-category.js nail-salons frisco ./data/nail-salons-frisco.json

# Deploy with Google Places search (requires API key)
node scripts/deploy-category.js nail-salons frisco "nail salons"
```

**What This Does Automatically**:
1. ✅ Imports your business data
2. ✅ Generates database migration files
3. ✅ Runs migration against Cloudflare D1
4. ✅ Creates subdomain configuration
5. ✅ Updates application routing
6. ✅ Verifies deployment works

### **Step 3: Verify Your Deployment**

```bash
# Test the API endpoint
curl "https://near-me.us/api/businesses?category=nail-salons&city=frisco"

# Check the subdomain (wait a few minutes for DNS propagation)
open https://nail-salons-frisco.near-me.us

# List all subdomains to confirm
node scripts/manage-subdomains.js list
```

---

## 💧 **TYPE 2: Custom Layout Sites**

### **Step 1: Prepare Custom Layout Data**

**CSV Format** (`data/water-stations-dallas.csv`):
```csv
name,description,phone,website,address,city,state,zip_code,latitude,longitude,rating,review_count,verified,premium,status,established,hours,services
"Central Park Water Station","Free water refill station","","","456 Central Park Dr","Dallas","Texas","75201","32.7767","-96.7970","4.8","45","true","false","active","2022","{""monday"":""24/7""}","water refill,filtered water"
"City Hall Fountain","Public water fountain with refill","","","1500 Marilla St","Dallas","Texas","75201","32.7767","-96.8003","4.2","23","true","false","active","2019","{""monday"":""6:00 AM - 10:00 PM""}","water refill"
```

### **Step 2: Deploy Custom Layout Site**

```bash
# Deploy water refill stations (uses custom layout)
node scripts/deploy-category.js water-refill dallas ./data/water-stations-dallas.csv

# Deploy EV charging stations (would use custom layout)
node scripts/deploy-category.js ev-charging austin ./data/ev-charging-austin.csv
```

**Special Features for Custom Layout Sites**:
- Uses specialized branding (e.g., AquaFinder for water-refill)
- Map-focused interface
- Custom messaging and UI elements
- Specialized availability indicators

### **Step 3: Verify Custom Layout Deployment**

```bash
# Test custom layout API
curl "https://near-me.us/api/businesses?category=water-refill&city=dallas"

# Check the custom layout subdomain
open https://water-refill-dallas.near-me.us
```

---

## 🍕 **TYPE 3: Food Delivery** (Future Implementation)

### **Planned Structure**:

**CSV Format** (`data/restaurants-austin.csv`):
```csv
name,description,phone,website,address,city,state,zip_code,latitude,longitude,rating,review_count,verified,premium,status,established,hours,services
"Pizza Corner","Best pizza in Austin","(512) 555-0123","https://pizzacorner.com","789 Congress Ave","Austin","Texas","78701","30.2672","-97.7431","4.6","234","true","true","active","2017","{""monday"":""11:00 AM - 11:00 PM""}","pizza,delivery,takeout"
```

**Deployment** (when implemented):
```bash
node scripts/deploy-category.js food-delivery austin ./data/restaurants-austin.csv
```

---

## 🔧 **Manual Step-by-Step Process**

If you prefer to understand each step individually:

### **Step 1: Import Data Only**
```bash
node scripts/business-importer.js csv ./data/your-data.csv your-category your-city
```

### **Step 2: Generate Migration**
```bash
node scripts/generate-migration.js your-category your-city ./data/your-data.json
```

### **Step 3: Run Database Migration**
```bash
# Find your migration file
ls migrations/d1/

# Run the migration
wrangler d1 execute nearme-db --file=./migrations/d1/YOUR_MIGRATION_FILE.sql --remote
```

### **Step 4: Add Subdomain**
```bash
node scripts/manage-subdomains.js add your-category your-city
```

### **Step 5: Generate Static HTML**
```bash
node scripts/generate-subdomain-html.js
```

### **Step 6: Build and Deploy**
```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

---

## 🚨 **Troubleshooting Common Issues**

### **Database Connection Problems**
```bash
# Test connection
wrangler d1 execute nearme-db --command "SELECT 1;" --remote

# Check auth
wrangler auth list

# Re-authenticate if needed
wrangler auth login
```

### **Data Import Fails**
```bash
# Check your CSV/JSON format
head -5 ./data/your-data.csv

# Validate required fields: name, address, city
```

### **Subdomain Not Working**
```bash
# Check subdomain was created
node scripts/manage-subdomains.js list

# Verify DNS propagation (can take 5-10 minutes)
nslookup your-category-your-city.near-me.us

# Check Cloudflare Pages deployment
```

### **API Returns No Data**
```bash
# Test database directly
wrangler d1 execute nearme-db --command "SELECT COUNT(*) FROM businesses WHERE category = 'your-category' AND city = 'your-city';" --remote

# Check API endpoint
curl "https://near-me.us/api/businesses?category=your-category&city=your-city"
```

---

## 🔄 **Rollback Process**

If something goes wrong:

```bash
# Rollback entire deployment
node scripts/deploy-category.js rollback your-category your-city

# Manual cleanup if needed
wrangler d1 execute nearme-db --command "DELETE FROM businesses WHERE category = 'your-category' AND city = 'your-city';" --remote

# Remove subdomain
node scripts/manage-subdomains.js remove your-category-your-city
```

---

## 📊 **Real-World Examples**

### **Example 1: Nail Salons in Frisco**
```bash
# 1. Create data file
# data/nail-salons-frisco.csv (see format above)

# 2. Deploy
node scripts/deploy-category.js nail-salons frisco ./data/nail-salons-frisco.csv

# 3. Verify
curl "https://near-me.us/api/businesses?category=nail-salons&city=frisco"
open https://nail-salons-frisco.near-me.us
```

### **Example 2: Auto Repair in Plano**
```bash
# 1. Deploy
node scripts/deploy-category.js auto-repair plano ./data/auto-repair-plano.csv

# 2. Verify
open https://auto-repair-plano.near-me.us
```

### **Example 3: Water Stations in Dallas (Custom Layout)**
```bash
# 1. Deploy
node scripts/deploy-category.js water-refill dallas ./data/water-stations-dallas.csv

# 2. Verify
open https://water-refill-dallas.near-me.us
```

---

## 🎯 **Quick Start Checklist**

For a new business category site:

```bash
□ 1. Prepare data file (CSV or JSON)
□ 2. Run: node scripts/deploy-category.js <category> <city> <data-file>
□ 3. Wait 5-10 minutes for DNS propagation
□ 4. Test: curl "https://near-me.us/api/businesses?category=<category>&city=<city>"
□ 5. Visit: https://<category>-<city>.near-me.us
□ 6. Done! 🎉
```

---

## 📚 **Additional Resources**

- **Scripts Documentation**: [`scripts/README.md`](scripts/README.md)
- **API Documentation**: [`docs/API-ENDPOINTS-REFERENCE.md`](docs/API-ENDPOINTS-REFERENCE.md)
- **Architecture Overview**: [`docs/DATA-FLOW-ARCHITECTURE.md`](docs/DATA-FLOW-ARCHITECTURE.md)

---

*Last updated: July 15, 2025*
*Need help? Check the troubleshooting section or review the scripts documentation.*
