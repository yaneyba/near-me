# Static File Generation - Data Sources & Process

**Last Updated**: July 12, 2025  
**Purpose**: Understand how generated static HTML files get their data and the complete build-to-runtime flow

## Overview

The Near-Me platform uses a **hybrid architecture** where static HTML files are generated at build time for SEO purposes, but real business data is fetched dynamically at runtime via React and API calls.

---

## Step 1: Build Time - Static Data Generation

### 1.1 Data Sources (Hardcoded in Script)

**File**: `scripts/generate-subdomain-html.js`

```javascript
// Static data for subdomain generation (matches DataProvider data)
const categories = ['nail-salons', 'barbershops', 'auto-repair', 'restaurants', 'water-refill'];
const cities = ['san-francisco', 'los-angeles', 'san-diego', 'san-jose', 'sacramento', 'phoenix', 'las-vegas', 'denver', 'seattle'];

// Known combinations from DataProvider
const knownCombinations = [
  { category: 'nail-salons', city: 'san-francisco' },
  { category: 'nail-salons', city: 'los-angeles' },
  { category: 'barbershops', city: 'san-francisco' },
  { category: 'barbershops', city: 'los-angeles' },
  { category: 'auto-repair', city: 'san-francisco' },
  { category: 'auto-repair', city: 'los-angeles' },
  { category: 'restaurants', city: 'san-francisco' },
  { category: 'restaurants', city: 'los-angeles' },
  { category: 'water-refill', city: 'san-francisco' }
];

// City-state mapping (matches DataProvider)
const cityStateMap = {
  'san-francisco': 'California',
  'los-angeles': 'California',
  'san-diego': 'California',
  // ... etc
};
```

### 1.2 Static Business Count (Fake for SEO)

```javascript
businessCount: 50 // Static count since we don't have dynamic business data
```

⚠️ **Important**: This "50+ Options" is **fake data** - used only for SEO meta tags!

### 1.3 HTML Generation Process

**Triggered by**: `npm run build` → `node scripts/generate-subdomain-html.js`

**Process**:
1. Loop through `knownCombinations`
2. Generate SEO-optimized HTML for each combo
3. Create meta tags with static data
4. Output files like `water-refill.san-francisco.html`

### 1.4 Generated Static Files Structure

**Example**: `dist/water-refill.san-francisco.html`

```html
<!doctype html>
<!-- Generated: 2025-07-12T22:45:03.197Z | Version: 1.0.0 | Cache: 1752360303197 -->
<html lang="en">
  <head>
    <!-- SEO Meta Tags (FROM STATIC DATA) -->
    <title>Best Water Refill in San Francisco, California (50+ Options)</title>
    <meta name="description" content="Find top-rated water refill in San Francisco, California. Compare 50+ local businesses..." />
    <meta name="keywords" content="water refill san francisco, san francisco water refill..." />
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="Best Water Refill in San Francisco, California (50+ Options)" />
    <meta property="og:description" content="Find top-rated water refill in San Francisco, California..." />
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Water Refill in San Francisco, California",
      "url": "https://water-refill.san-francisco.near-me.us/"
    }
    </script>
    
    <!-- Vite Build Assets -->
    <script type="module" crossorigin src="/assets/index-abc123.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-xyz789.css">
  </head>
  <body>
    <!-- EMPTY CONTAINER - React will fill this -->
    <div id="root"></div>
    
    <!-- Build Info -->
    <script>
      window.__BUILD_INFO__ = {
        time: "2025-07-12T22:45:03.197Z",
        version: "1.0.0",
        cache: "1752360303197"
      };
    </script>
  </body>
</html>
```

**Key Points**:
- ✅ Contains SEO meta tags with static data
- ✅ Empty `<div id="root"></div>` container
- ✅ References to compiled JavaScript/CSS assets
- ❌ **No actual business data** in the HTML

---

## Step 2: Runtime - React Hydration & URL Parsing

### 2.1 JavaScript Boot Process

When user visits `https://water-refill.san-francisco.near-me.us/`:

1. **Static HTML loads** (fast, from CDN)
2. **JavaScript bundle loads** (`/assets/index-abc123.js`)
3. **React app boots** and takes over the `<div id="root"></div>`

### 2.2 Subdomain Parsing

**File**: `src/utils/subdomainParser.ts`

```typescript
// Parses URL to extract category and city
parseSubdomain('water-refill.san-francisco.near-me.us')
// Returns:
{
  category: 'Water Refill Stations',
  city: 'San Francisco', 
  state: 'California',
  rawCategory: 'water-refill',
  rawCity: 'san-francisco',
  isWaterRefill: true
}
```

### 2.3 Component Initialization

**File**: `src/pages/water-refill/HomePage.tsx`

```tsx
const WaterRefillHomePage = ({ subdomainInfo }) => {
  const [featuredStations, setFeaturedStations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // This is where REAL data fetching happens
    loadFeaturedStations();
  }, [subdomainInfo.city]);
```

---

## Step 3: Runtime - Real Data Fetching

### 3.1 API Request Process

**From**: `src/pages/water-refill/HomePage.tsx`

```tsx
const loadFeaturedStations = async () => {
  try {
    const cityToUse = subdomainInfo?.city || 'All Cities';
    let allBusinesses = [];
    
    if (cityToUse === 'All Cities') {
      // Single efficient query: SELECT * WHERE category = 'water-refill'
      allBusinesses = await dataProvider.getBusinessesByCategory('water-refill');
    } else {
      // City-specific query: SELECT * WHERE category = 'water-refill' AND city = 'san-francisco'
      allBusinesses = await dataProvider.getBusinesses('water-refill', cityToUse);
    }
    
    // Transform and display REAL data
    const featured = allBusinesses
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3)
      .map(transformBusinessToWaterStation);
    
    setFeaturedStations(featured);
  } catch (error) {
    console.error('Error loading featured stations:', error);
  }
};
```

### 3.2 Data Provider Flow

**File**: `src/providers/D1DataProvider.ts`

```tsx
// Makes HTTP request to Cloudflare Functions
async getBusinesses(category: string, city: string): Promise<Business[]> {
  return this.apiRequest<Business[]>(
    EndpointBuilder.businessesWithParams(category, city)
  );
}

// Single query for all cities
async getBusinessesByCategory(category: string): Promise<Business[]> {
  return this.apiRequest<Business[]>(
    EndpointBuilder.businessesByCategory(category)
  );
}
```

### 3.3 API Endpoint Processing

**File**: `functions/api/businesses.ts` (city-specific)

```typescript
const query = `
  SELECT 
    id, business_id, name, category, description, phone, website, address,
    city, state, zip_code, rating, review_count, verified, premium
  FROM businesses 
  WHERE LOWER(category) = LOWER(?) 
  AND LOWER(city) = LOWER(?)
  AND status = 'active'
  ORDER BY premium DESC, verified DESC, rating DESC, name ASC
`;

const result = await env.DB.prepare(query).bind(category, city).all();
```

**File**: `functions/api/businesses-by-category.ts` (all cities)

```typescript
const query = `
  SELECT 
    id, business_id, name, category, description, phone, website, address,
    city, state, zip_code, rating, review_count, verified, premium
  FROM businesses 
  WHERE LOWER(category) = LOWER(?)
  AND status = 'active'
  ORDER BY premium DESC, verified DESC, rating DESC, name ASC
`;

const result = await env.DB.prepare(query).bind(category).all();
```

### 3.4 Database Response & Rendering

1. **D1 Database** returns real business records
2. **API endpoint** transforms data and returns JSON
3. **React component** receives real data
4. **UI updates** with actual business cards, ratings, addresses, etc.

---

## Complete Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              STEP 1: BUILD TIME                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 1. Hardcoded data arrays (categories, cities, combinations)                    │
│ 2. Static business count (50+ - FAKE for SEO)                                  │
│ 3. HTML generation with meta tags                                              │
│ 4. Output: water-refill.san-francisco.html (SEO shell only)                   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              STEP 2: RUNTIME BOOT                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 1. User visits URL: water-refill.san-francisco.near-me.us                     │
│ 2. Static HTML loads (fast, from CDN)                                          │
│ 3. JavaScript bundle loads and React boots                                     │
│ 4. SubdomainParser extracts: category='water-refill', city='san-francisco'    │
│ 5. HomePage component initializes with subdomainInfo                           │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              STEP 3: REAL DATA                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 1. useEffect triggers loadFeaturedStations()                                   │
│ 2. DataProvider makes API call: /api/businesses?category=water-refill&city=... │
│ 3. Cloudflare Function queries D1 Database                                     │
│ 4. Real business records returned (names, ratings, addresses, etc.)            │
│ 5. React renders actual WaterStationCard components                            │
│ 6. User sees REAL data (not the fake "50+ Options")                           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Insights

### ✅ What Static Files Provide
- **Fast initial load** (SEO shell)
- **Search engine optimization** (meta tags, structured data)
- **Social media previews** (Open Graph)
- **Performance benefits** (cached HTML)

### ❌ What Static Files DON'T Provide
- **Real business data** (that comes from database)
- **Accurate business counts** ("50+" is fake)
- **Dynamic content** (React handles that)
- **User interactions** (JavaScript handles that)

### 🔄 Hybrid Architecture Benefits
1. **SEO**: Search engines see optimized meta tags immediately
2. **Performance**: Fast HTML shell loads first
3. **UX**: Real data loads progressively via React
4. **Caching**: Static files can be CDN cached forever
5. **Flexibility**: Dynamic content updates without rebuilds

### 🚀 Future Optimizations
- Consider server-side rendering (SSR) for real data in HTML
- Implement incremental static regeneration (ISR)
- Add loading states during data fetching
- Cache API responses for better performance

---

## Related Files

- **Build Script**: `scripts/generate-subdomain-html.js`
- **Package.json**: `"build": "vite build && node scripts/generate-subdomain-html.js"`
- **Data Provider**: `src/providers/D1DataProvider.ts`
- **API Endpoints**: `functions/api/businesses.ts`, `functions/api/businesses-by-category.ts`
- **Homepage**: `src/pages/water-refill/HomePage.tsx`
- **Subdomain Parser**: `src/utils/subdomainParser.ts`
- **Generated Files**: `dist/*.html` (e.g., `water-refill.san-francisco.html`)
