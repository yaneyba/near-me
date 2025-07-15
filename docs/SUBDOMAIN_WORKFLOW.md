# Subdomain Management Workflow

## Overview
This document defines the clear, consistent workflow for managing subdomains in the Near Me application.

## Architecture Components

### 1. SmartDoor (Routing Brain)
- **Location:** `src/components/routing/SmartDoor.tsx`
- **Purpose:** Decides which "world" to show based on subdomain
- **Handles:** ALL subdomain routing (water-refill, business categories, services)

### 2. Subdomain Parser
- **Location:** `src/utils/subdomainParser.ts`
- **Purpose:** Analyzes the URL and determines subdomain type
- **Returns:** SubdomainInfo object with routing decisions

### 3. HTML Generation (SEO Layer)
- **Location:** `scripts/generate-subdomain-html.js`
- **Purpose:** Pre-generates static HTML files for better SEO
- **Optional:** Not required for functionality, only for performance

## Workflow for Adding/Managing Subdomains

### Step 1: Define What You Want
Before making any changes, decide:
- What subdomain? (e.g., `category.near-me.us` or `category.city.near-me.us`)
- What data should it show?
- Do you want pre-generated HTML for SEO?

### Step 2: Update Configuration
Edit: `config/subdomain-generation.json`
```json
{
  "supportedCategories": [
    "nail-salons",
    "auto-repair",
    "water-refill"  // Add here if you want it
  ],
  "generationRules": {
    "categoryOnly": {
      "enabled": true  // nail-salons.near-me.us
    },
    "categoryWithCity": {
      "enabled": false  // nail-salons.san-francisco.near-me.us
    }
  }
}
```

### Step 3: Test Routing (Always Works)
- SmartDoor automatically handles routing
- No code changes needed
- Just visit the URL and see if it routes correctly

### Step 4: Generate HTML (Optional SEO)
```bash
# Only generate what's in config
npm run build:with-seo

# Or just build without SEO generation
npm run build
```

### Step 5: Deploy
```bash
npm run build
wrangler pages deploy dist
```

## Current Status

### ✅ Working Subdomains (via SmartDoor)
- `nail-salons.near-me.us` - Routes to BusinessWorld
- `auto-repair.near-me.us` - Routes to BusinessWorld  
- `water-refill.near-me.us` - Routes to WaterRefillWorld

### ✅ HTML Generation (SEO)
- Currently generates: nail-salons, auto-repair (city combinations)
- Not generating: water-refill
- Controlled by: `config/subdomain-generation.json`

## Decision Framework

**For each subdomain, ask:**
1. **Does it need to work?** → SmartDoor handles it automatically
2. **Does it need SEO?** → Add to generation config
3. **Does it need data?** → Ensure API endpoints exist

## Next Steps

**You decide:**
1. Keep current setup (nail-salons, auto-repair with HTML generation)
2. Add water-refill to HTML generation for better SEO
3. Remove HTML generation entirely and rely on SmartDoor only

**The architecture is solid. You just need to decide what you want generated.**
