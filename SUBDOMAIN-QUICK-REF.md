# 🚨 QUICK REFERENCE: New Subdomain Files

**BEFORE creating any new subdomain, update these 5 files:**

## 1. Middleware (MOST CRITICAL)
**File**: `functions/_middleware.js`
**Add to**: `knownCategories` array and `categoryRedirects` object

## 2. HTML Generator  
**File**: `scripts/generate-subdomain-html.js`
**Add to**: `getCustomBranding()` function

## 3. Build Config
**File**: `config/subdomain-generation.json` 
**Add to**: Appropriate layout categories array

## 4. Special Services
**File**: `src/config/subdomainExceptions.ts`
**Add to**: `specialServices` array

## 5. React SEO Hook
**File**: `src/hooks/useSEO.ts`
**Add to**: `getSEOData()` switch statement

---

**⚠️ If you forget the middleware update, the subdomain will show generic "Near Me Directory" SEO instead of your custom branding!**

**✅ Test locally**: `http://localhost:3000?subdomain=your-new-category`
