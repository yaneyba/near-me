# 🚀 Simple Deployment Guide

This guide shows you how to create and deploy new business directory sites for the Near Me platform.

## 📊 **Step-by-Step Flowchart**

```
┌─────────────────────────────────────────────────────────────┐
│                    🎯 WHAT DO YOU WANT?                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
              ┌───────▼───────┐
              │  Business     │
              │  Directory?   │◄─── 90% of users want this
              │  (nail salon, │
              │   auto repair,│
              │   restaurant) │
              └───────┬───────┘
                      │ YES
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  📝 STEP 1: CREATE DATA                     │
│                                                             │
│  Create file: data/nail-salons-frisco.csv                   │
│                                                             │
│  name,description,address,city,phone                        │
│  "Nail Palace","Full service","123 Main St","Frisco","555"  │
│  "Beauty Spot","Luxury care","456 Oak Ave","Frisco","556"   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  ⚡ STEP 2: ONE COMMAND                      │
│                                                             │
│  node scripts/deploy-category.js nail-salons frisco \       │
│       ./data/nail-salons-frisco.csv                         │
│                                                             │
│  This does EVERYTHING automatically:                        │
│  ✅ Imports data        ✅ Creates database                 │
│  ✅ Sets up subdomain   ✅ Builds site                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   ⏱️ STEP 3: WAIT & VISIT                   │
│                                                             │
│  Wait: 5-10 minutes for DNS                                 │
│  Visit: https://nail-salons-frisco.near-me.us               │
│                                                             │
│  🎉 DONE! Your site is live!                                │
└─────────────────────────────────────────────────────────────┘
```

### 💧 **Special Case: Custom Branding**

```
┌─────────────────────────────────────────────────────────────┐
│  Need special branding? (water stations, EV charging, etc)  │
└─────────────────────┬───────────────────────────────────────┘
                      │ YES
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Use same steps but with water-refill:                      │
│                                                             │
│  node scripts/deploy-category.js water-refill dallas \      │
│       ./data/water-stations-dallas.csv                      │
│                                                             │
│  Result: https://water-refill-dallas.near-me.us             │
│  (Blue AquaFinder theme with map focus)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 **Two Types of Sites**

### 1. **🏢 Business Services** (Most Common)
- **Examples**: `nail-salons`, `auto-repair`, `restaurants`, `hair-salons`
- **What it is**: Traditional business directory with listings, ratings, and contact info
- **Best for**: Any type of business or service

### 2. **💧 Custom Layout** (Special Categories)
- **Examples**: `water-refill` (live)
- **What it is**: Location-based services with custom branding and specialized UI
- **Best for**: Services that need unique branding or map-focused interfaces

---

## 📋 **Detailed Steps**

### ✅ **STEP 1: Prepare Your Data**

Create a CSV file with your business data. **Required columns**: `name`, `address`, `city`

**Minimal Example** (`data/nail-salons-frisco.csv`):
```csv
name,address,city
"Nail Palace","123 Main St","Frisco"
"Beauty Spot","456 Oak Ave","Frisco"
```

**Full Example** (optional extra columns):
```csv
name,description,phone,website,address,city,state,zip_code,latitude,longitude,rating,review_count
"Nail Palace","Full service nail salon","(469) 555-0123","https://nailpalace.com","123 Main St","Frisco","Texas","75034","33.1507","-96.8236","4.5","127"
"Beauty Spot","Luxury nail care","(469) 555-0124","https://beautyspot.com","456 Oak Ave","Frisco","Texas","75035","33.1545","-96.8198","4.3","89"
```

### ✅ **STEP 2: Deploy**

**One command does everything:**
```bash
node scripts/deploy-category.js nail-salons frisco ./data/nail-salons-frisco.csv
```

**What happens automatically:**
1. ✅ Reads your CSV file
2. ✅ Imports data to database  
3. ✅ Creates subdomain configuration
4. ✅ Generates static HTML pages
5. ✅ Deploys to Cloudflare

### ✅ **STEP 3: Wait & Visit**

1. **Wait**: 5-10 minutes for DNS propagation
2. **Visit**: `https://nail-salons-frisco.near-me.us`
3. **Done!** 🎉 Your site is live

---

## 🔍 **Verify It Worked**

```bash
# Check if subdomain was created
node scripts/manage-subdomains.js list

# Test the API
curl "https://near-me.us/api/businesses?category=nail-salons&city=frisco"

# Should show your businesses in JSON format
```

---

## 💧 **Custom Layout Sites (Advanced)**

> **Only use this if you need special branding.** Most business directories should use the quick start above.

Currently supported: **Water Refill Stations**

### Example: Water Stations

```bash
# Deploy water refill stations (special blue-themed layout)
node scripts/deploy-category.js water-refill dallas ./data/water-stations-dallas.csv
```

**Data format is the same as regular businesses.** The difference is the special branded UI.

---

## 🔧 **Prerequisites**

Before deploying, make sure you have:

```bash
# Install dependencies
npm install

# Test database connection
wrangler d1 execute nearme-db --command "SELECT 1;" --remote

# Check scripts work
node scripts/manage-subdomains.js list
```

---

## 🚨 **Troubleshooting**

### Site not loading?
```bash
# Check if subdomain was created
node scripts/manage-subdomains.js list

# Wait 5-10 minutes for DNS propagation
```

### No data showing?
```bash
# Test the API directly
curl "https://near-me.us/api/businesses?category=YOUR-CATEGORY&city=YOUR-CITY"
```

### Database errors?
```bash
# Re-authenticate with Cloudflare
wrangler auth login

# Test connection
wrangler d1 execute nearme-db --command "SELECT 1;" --remote
```

---

## 📝 **Real Examples**

### Nail Salons in Frisco
```bash
# 1. Create your data file: data/nail-salons-frisco.csv
# 2. Deploy
node scripts/deploy-category.js nail-salons frisco ./data/nail-salons-frisco.csv
# 3. Visit: https://nail-salons-frisco.near-me.us
```

### Auto Repair in Plano  
```bash
node scripts/deploy-category.js auto-repair plano ./data/auto-repair-plano.csv
# Visit: https://auto-repair-plano.near-me.us
```

### Water Stations in Dallas (Custom Layout)
```bash
node scripts/deploy-category.js water-refill dallas ./data/water-stations-dallas.csv
# Visit: https://water-refill-dallas.near-me.us
```

---

## 📚 **Need More Help?**

- **Scripts Guide**: [`scripts/README.md`](scripts/README.md)
- **Custom Layouts**: [`docs/CUSTOM-LAYOUT-GUIDE.md`](docs/CUSTOM-LAYOUT-GUIDE.md)
- **All Documentation**: [`docs/README.md`](docs/README.md)

---

*Last updated: July 15, 2025*
