# New Subdomain Deployment Checklist

## 🚨 CRITICAL: Complete ALL Steps When Adding New Subdomains

This checklist ensures proper SEO, routing, and functionality for new category subdomains.

## Required Files to Update

### 1. ✅ Static HTML Generation (`scripts/generate-subdomain-html.js`)
**Location**: `/scripts/generate-subdomain-html.js`

Add custom branding to the `getCustomBranding()` function:

```javascript
function getCustomBranding(categoryUrl) {
  const customBranding = {
    // ... existing entries ...
    'your-new-category': {
      brandName: 'YourBrand Name',
      title: 'SEO Optimized Title | Brand Name',
      description: 'Compelling description with keywords for SEO',
      keywords: 'keyword1, keyword2, keyword3, long-tail keywords',
      canonicalUrl: 'https://your-new-category.near-me.us/',
      businessOwnerText: 'List Your Business'
    }
  };
}
```

### 2. ✅ Middleware Routing (`functions/_middleware.js`)
**Location**: `/functions/_middleware.js`

**CRITICAL**: Add your category to BOTH arrays:

```javascript
// Line ~64: Add to knownCategories array
const knownCategories = ['nail-salons', 'auto-repair', 'water-refill', 'senior-care', 'specialty-pet', 'your-new-category'];

// Line ~86: Add to categoryRedirects object
const categoryRedirects = {
  'nail-salons': 'https://nail-salons.near-me.us',
  'auto-repair': 'https://auto-repair.near-me.us',
  'water-refill': 'https://water-refill.near-me.us',
  'senior-care': 'https://senior-care.near-me.us',
  'specialty-pet': 'https://specialty-pet.near-me.us',
  'your-new-category': 'https://your-new-category.near-me.us'
};
```

### 3. ✅ Subdomain Configuration (`config/subdomain-generation.json`)
**Location**: `/config/subdomain-generation.json`

Add your category to the appropriate layout:

```json
{
  "layouts": {
    "your-layout": {
      "description": "Description of your layout",
      "categories": [
        "your-new-category"
      ],
      "generateHTML": true
    }
  }
}
```

### 4. ✅ Special Services (`src/config/subdomainExceptions.ts`)
**Location**: `/src/config/subdomainExceptions.ts`

Add to the `specialServices` array:

```typescript
export const specialServices: SpecialService[] = [
  // ... existing entries ...
  {
    subdomain: 'your-new-category.near-me.us',
    category: 'Your Category Name',
    isPathBased: true,
    isYourCategory: true, // Add new boolean flag
    description: 'Description for your new category'
  }
];
```

### 5. ✅ SEO Hook (`src/hooks/useSEO.ts`)
**Location**: `/src/hooks/useSEO.ts`

Add your category to the `getSEOData()` function:

```typescript
function getSEOData(subdomainInfo: SubdomainInfo): SEOData {
  const category = subdomainInfo.category;
  
  switch (category) {
    // ... existing cases ...
    case 'your-new-category':
      return {
        title: 'SEO Optimized Title | Brand Name',
        description: 'Compelling description with keywords for SEO',
        keywords: 'keyword1, keyword2, keyword3, long-tail keywords',
        canonicalUrl: 'https://your-new-category.near-me.us/',
        ogImage: '/og-your-new-category.png'
      };
  }
}
```

## Deployment Process

### Step 1: Update All Files
- ✅ Update `scripts/generate-subdomain-html.js`
- ✅ Update `functions/_middleware.js` (**MOST CRITICAL**)
- ✅ Update `config/subdomain-generation.json`
- ✅ Update `src/config/subdomainExceptions.ts`
- ✅ Update `src/hooks/useSEO.ts`

### Step 2: Create Custom Assets (Optional)
- Create Open Graph image: `/public/og-your-new-category.png` (1200x630px)
- Create favicon variations if needed

### Step 3: Build and Test
```bash
npm run build
npx serve dist -p 3000
# Test: http://localhost:3000?subdomain=your-new-category
```

### Step 4: Deploy
```bash
npx wrangler pages deploy dist
git add .
git commit -m "Add new subdomain: your-new-category"
git push origin main
```

### Step 5: Verify SEO
Visit `https://your-new-category.near-me.us` and verify:
- ✅ Custom title appears (not "Near Me Directory")
- ✅ Custom description in meta tags
- ✅ Proper Open Graph tags
- ✅ Site loads with correct layout/styling

## Common Mistakes to Avoid

### ❌ Mistake #1: Forgetting Middleware Update
**Symptom**: Generic "Near Me Directory" title shows instead of custom SEO
**Cause**: Middleware not serving static HTML file, falling back to React app
**Fix**: Add category to `knownCategories` array in middleware

### ❌ Mistake #2: Case Sensitivity Issues
**Symptom**: Subdomain detection not working
**Cause**: Inconsistent casing between files
**Fix**: Use consistent kebab-case everywhere (`your-new-category`)

### ❌ Mistake #3: Missing SEO Hook Entry
**Symptom**: Static HTML has correct SEO, but React app overrides it
**Cause**: `useSEO.ts` doesn't have entry for new category
**Fix**: Add switch case in `getSEOData()` function

### ❌ Mistake #4: Incorrect JSON Syntax
**Symptom**: Build fails or configuration not loading
**Cause**: Invalid JSON in `subdomain-generation.json`
**Fix**: Validate JSON syntax, ensure proper commas and brackets

## Testing Checklist

Before deploying to production:

- [ ] Local build completes without errors
- [ ] Static HTML file generated in `/dist/your-new-category.html`
- [ ] Middleware serves correct HTML file locally
- [ ] SEO meta tags appear correctly in generated HTML
- [ ] React app SEO hook works with `?subdomain=your-new-category`
- [ ] Custom styling/layout loads properly
- [ ] Open Graph image displays correctly

## Emergency Fixes

If a new subdomain shows generic SEO after deployment:

1. **Quick Fix**: Add to middleware `knownCategories` array
2. **Deploy immediately**: `npm run build && npx wrangler pages deploy dist`
3. **Full Fix**: Complete all checklist items above
4. **Verify**: Check live URL shows custom SEO within 5 minutes

## File Dependencies

```
New Subdomain Requires Updates To:
├── scripts/generate-subdomain-html.js (Custom branding)
├── functions/_middleware.js (Routing - CRITICAL)
├── config/subdomain-generation.json (Build config)
├── src/config/subdomainExceptions.ts (Special services)
├── src/hooks/useSEO.ts (React SEO)
└── public/og-your-new-category.png (Optional OG image)
```

## Historical Issues

**Date**: July 16, 2025
**Issue**: specialty-pet.near-me.us showed generic SEO
**Root Cause**: Missing from middleware `knownCategories`
**Lesson**: Middleware is the most critical file - it controls which HTML file gets served

---

**💡 Pro Tip**: Keep this checklist handy and check off each item when adding new subdomains. The middleware update is the most critical step that's easy to forget!
