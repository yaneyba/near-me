# Adding New Cities and Categories - Complete Guide

## Overview

This guide provides step-by-step instructions for adding new cities and categories to the dynamic subdomain system. Each new combination automatically generates SEO-optimized subdomains with proper meta tags, search functionality, and business listings.

## Adding a New City and Category (Example: HVAC in Atlanta)

### Step 1: Add City-State Mapping
**File:** `src/utils/subdomainParser.ts`

Add the new city to the `cityStateMap` object:

```typescript
const cityStateMap: Record<string, string> = {
  'dallas': 'Texas',
  'denver': 'Colorado',
  'austin': 'Texas',
  'houston': 'Texas',
  'frisco': 'Texas',
  'atlanta': 'Georgia', // ← Add this line
  // ... other cities
};
```

### Step 2: Add Category Services
**File:** `src/data/services.json`

Add the new category with its associated services:

```json
{
  "nail-salons": [
    "Manicures",
    "Pedicures",
    "Nail Art",
    "Gel Polish",
    "Acrylic Nails"
  ],
  "auto-repair": [
    "Oil Changes",
    "Brake Repair",
    "Engine Diagnostics",
    "Transmission Service"
  ],
  "hvac": [
    "Air Conditioning Repair",
    "Heating Repair", 
    "HVAC Installation",
    "Duct Cleaning",
    "Furnace Service",
    "AC Maintenance",
    "Heat Pump Service",
    "Thermostat Installation",
    "Indoor Air Quality",
    "Emergency HVAC"
  ]
}
```

### Step 3: Add City Neighborhoods (Optional)
**File:** `src/data/neighborhoods.json`

Add neighborhoods for the new city:

```json
{
  "dallas": [
    "Downtown",
    "Uptown",
    "Deep Ellum"
  ],
  "atlanta": [
    "Downtown",
    "Midtown", 
    "Buckhead",
    "Virginia Highland",
    "Little Five Points",
    "Inman Park",
    "Decatur",
    "Sandy Springs",
    "Roswell",
    "Alpharetta"
  ]
}
```

### Step 4: Add Business Data
**File:** `src/data/businesses.json`

Add HVAC businesses in Atlanta. Each business should follow this structure:

```json
{
  "id": "hvac-atlanta-1",
  "name": "Atlanta Air Experts",
  "category": "hvac",
  "city": "atlanta", 
  "state": "Georgia",
  "address": "123 Peachtree St, Atlanta, GA 30309",
  "phone": "(404) 555-0123",
  "website": "https://atlantaairexperts.com",
  "rating": 4.8,
  "reviewCount": 156,
  "description": "Professional HVAC services including air conditioning repair, heating installation, and emergency service. Serving Atlanta and surrounding areas with certified technicians.",
  "services": ["Air Conditioning Repair", "Heating Repair", "HVAC Installation"],
  "neighborhood": "Midtown",
  "hours": {
    "Monday": "7:00 AM - 6:00 PM",
    "Tuesday": "7:00 AM - 6:00 PM",
    "Wednesday": "7:00 AM - 6:00 PM", 
    "Thursday": "7:00 AM - 6:00 PM",
    "Friday": "7:00 AM - 6:00 PM",
    "Saturday": "8:00 AM - 4:00 PM",
    "Sunday": "Emergency Only"
  },
  "image": "https://images.pexels.com/photos/8092/pexels-photo.jpg",
  "premium": false
}
```

**Important Field Notes:**
- `id`: Unique identifier (use format: `category-city-number`)
- `category`: Must match the key in services.json (kebab-case)
- `city`: Must match the key in cityStateMap (kebab-case)
- `state`: Full state name (Title Case)
- `premium`: Set to `true` for featured businesses
- `image`: Use Pexels URLs for stock photos

### Step 5: Update Development Panel (Optional)
**File:** `src/components/DevPanel.tsx`

Add the new category and city to the development panel for testing:

```typescript
const categories = [
  'Nail Salons',
  'Auto Repair',
  'HVAC' // ← Add here
];

const cities = [
  'Dallas',
  'Denver', 
  'Austin',
  'Houston',
  'Frisco',
  'Atlanta' // ← Add here
];
```

### Step 6: Generate SEO Files
**Command:** `npm run build`

This automatically:
- Generates `hvac.atlanta.html` with proper SEO meta tags
- Creates unique title: "Best HVAC in Atlanta, Georgia (X+ Options)"
- Adds meta description with local keywords
- Includes structured data for search engines

### Step 7: Update Redirects
**File:** `public/_redirects`

Add the redirect rule for the new subdomain:

```
# Existing redirects
https://nail-salons.dallas.near-me.us/* /nail-salons.dallas.html 200!
https://auto-repair.denver.near-me.us/* /auto-repair.denver.html 200!

# New redirect
https://hvac.atlanta.near-me.us/* /hvac.atlanta.html 200!

# Fallback
/* /index.html 200
```

### Step 8: Update Robots.txt
**File:** `public/robots.txt`

Add the sitemap entry for the new subdomain:

```
# Existing sitemaps
Sitemap: https://nail-salons.dallas.near-me.us/sitemap.xml
Sitemap: https://auto-repair.denver.near-me.us/sitemap.xml

# New sitemap
Sitemap: https://hvac.atlanta.near-me.us/sitemap.xml
```

### Step 9: Test Locally
1. Run `npm run dev`
2. Use the development panel (settings icon) to switch to "HVAC" and "Atlanta"
3. Verify:
   - Business listings appear
   - Search functionality works
   - Services section shows HVAC services
   - Footer links update correctly

### Step 10: Deploy
1. Commit all changes to git:
   ```bash
   git add .
   git commit -m "Add HVAC category and Atlanta city"
   ```
2. Push to main branch:
   ```bash
   git push origin main
   ```
3. Cloudflare Pages automatically builds and deploys
4. New subdomain `hvac.atlanta.near-me.us` goes live with perfect SEO

## Adding Just a New City (to Existing Category)

If you want to add nail salons in a new city like Phoenix:

### Required Steps:
1. **Step 1**: Add `'phoenix': 'Arizona'` to cityStateMap
2. **Step 3**: Add Phoenix neighborhoods (optional)
3. **Step 4**: Add nail salon businesses in Phoenix
4. **Step 7**: Add redirect rule for `nail-salons.phoenix.near-me.us`
5. **Step 8**: Add sitemap entry
6. **Steps 9-10**: Test and deploy

### Skip These Steps:
- Step 2 (services already exist for nail-salons)
- Step 5 (category already in dev panel)

## Adding Just a New Category (to Existing City)

If you want to add restaurants in Dallas:

### Required Steps:
1. **Step 2**: Add "restaurants" services to services.json
2. **Step 4**: Add restaurant businesses in Dallas
3. **Step 5**: Add "Restaurants" to dev panel categories
4. **Step 7**: Add redirect rule for `restaurants.dallas.near-me.us`
5. **Step 8**: Add sitemap entry
6. **Steps 9-10**: Test and deploy

### Skip These Steps:
- Step 1 (Dallas already exists in cityStateMap)
- Step 3 (Dallas neighborhoods already exist)

## Bulk Adding Multiple Combinations

For adding many cities/categories at once:

1. **Plan your data structure** first
2. **Add all cities** to cityStateMap
3. **Add all categories** to services.json
4. **Add all neighborhoods** for new cities
5. **Bulk add business data** (can use spreadsheet then convert to JSON)
6. **Update dev panel** with all new options
7. **Generate and test** with `npm run build`
8. **Update redirects** for all new combinations
9. **Deploy once** with all changes

## SEO Benefits of Each New Addition

When you add HVAC in Atlanta, you automatically get:

### Perfect SEO Meta Tags
```html
<title>Best HVAC in Atlanta, Georgia (5+ Options)</title>
<meta name="description" content="Find top-rated HVAC services in Atlanta, Georgia. Compare 5+ local businesses, read reviews, get contact info, and book services online." />
<meta name="keywords" content="hvac atlanta, atlanta hvac, best hvac atlanta" />
```

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "HVAC in Atlanta, Georgia",
  "url": "https://hvac.atlanta.near-me.us/"
}
```

### Social Media Optimization
```html
<meta property="og:title" content="Best HVAC in Atlanta, Georgia" />
<meta property="og:description" content="Find top-rated HVAC services..." />
<meta property="og:url" content="https://hvac.atlanta.near-me.us/" />
```

## Quality Guidelines

### Business Data Quality
- **Accurate Information**: Verify phone numbers, addresses, hours
- **Unique Descriptions**: Write specific, helpful descriptions for each business
- **Relevant Services**: Only include services the business actually offers
- **Quality Images**: Use high-resolution, relevant stock photos from Pexels
- **Consistent Formatting**: Follow the exact JSON structure

### SEO Best Practices
- **Local Keywords**: Include city and state in business descriptions
- **Unique Content**: Each business should have a unique description
- **Complete Data**: Fill in all fields for better search visibility
- **Regular Updates**: Keep business information current

### Category Guidelines
- **Clear Service Lists**: Include 8-12 relevant services per category
- **Logical Grouping**: Services should be related and commonly searched
- **Local Relevance**: Consider what services are popular in each city
- **Search-Friendly**: Use terms people actually search for

## Troubleshooting

### Common Issues

**HTML files not generating:**
- Check business data format in `businesses.json`
- Ensure category and city use kebab-case
- Verify Node.js script has proper permissions
- Run `npm run build:seo` manually to test

**Wrong content showing:**
- Verify `_redirects` file format is correct
- Check that category/city match exactly between files
- Clear browser cache and test again
- Ensure DNS propagation is complete

**Search not working:**
- Verify business data includes searchable fields
- Check that services array is properly formatted
- Ensure category matches between businesses and services.json

**Footer links missing:**
- Check that business data exists for the category/city combination
- Verify the Footer component is reading data correctly
- Ensure category and city formatting is consistent

### Testing Checklist

Before deploying new content:

- [ ] Business data validates as proper JSON
- [ ] All required fields are present in business objects
- [ ] Category exists in services.json
- [ ] City exists in cityStateMap
- [ ] `npm run build` completes without errors
- [ ] Generated HTML files contain proper meta tags
- [ ] Development panel shows new options
- [ ] Search functionality works with new data
- [ ] Footer links update correctly
- [ ] Mobile responsiveness maintained

## Performance Considerations

### Build Time
- Each new combination adds ~1-2 seconds to build time
- 50+ combinations: ~2-3 minutes total build time
- 100+ combinations: Consider optimizing the build script

### File Size
- Each HTML file: ~3-5KB
- 100 combinations: ~500KB total
- Negligible impact on Cloudflare Pages

### SEO Impact
- New subdomains typically indexed within 1-2 weeks
- Submit sitemaps to Google Search Console for faster indexing
- Monitor search performance in analytics

This systematic approach ensures every new city and category addition maintains the same high-quality SEO optimization and user experience as the existing subdomains.