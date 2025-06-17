# Domain to Deployment: Action Use-Case Guide

## Overview
This guide covers the practical steps to deploy the dynamic subdomain React application from domain setup to live production.

## Prerequisites
- Domain ownership (e.g., `near-me.us`)
- DNS management access
- Hosting platform account (Netlify, Vercel, etc.)
- Git repository

## Step 1: Domain & DNS Configuration

### 1.1 Wildcard DNS Setup
Configure your DNS provider to handle wildcard subdomains:

```
Type: CNAME
Name: *
Value: your-deployment-url.netlify.app
TTL: 300 (5 minutes)
```

### 1.2 Root Domain Setup
```
Type: A
Name: @
Value: [Your hosting provider's IP]
TTL: 300
```

### 1.3 WWW Redirect
```
Type: CNAME  
Name: www
Value: near-me.us
TTL: 300
```

## Step 2: Build Configuration

### 2.1 Update Vite Config
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  base: '/'
});
```

### 2.2 Add Build Scripts
```json
// package.json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && netlify deploy --prod --dir=dist"
  }
}
```

## Step 3: Deployment Platform Setup

### 3.1 Netlify Configuration
Create `netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 3.2 Custom Domain Configuration
1. Go to Netlify Dashboard → Domain Settings
2. Add custom domain: `near-me.us`
3. Configure wildcard: `*.near-me.us`
4. Enable HTTPS/SSL certificate

## Step 4: Environment-Specific Configurations

### 4.1 Production Subdomain Parser
Ensure `subdomainParser.ts` handles production domains:
```typescript
export const parseSubdomain = (hostname: string = window.location.hostname): SubdomainInfo => {
  // Production: category.city.near-me.us
  const parts = hostname.split('.');
  
  if (parts.length >= 4 && parts[2] === 'near-me' && parts[3] === 'us') {
    const rawCategory = parts[0];
    const rawCity = parts[1];
    
    return {
      category: formatCategory(rawCategory),
      city: formatCity(rawCity),
      state: cityStateMap[rawCity] || 'Unknown State'
    };
  }
  
  // Fallback for root domain
  return { category: 'Nail Salons', city: 'Dallas', state: 'Texas' };
};
```

### 4.2 Remove Development Panel
Update `App.tsx` for production:
```typescript
// Only show dev panel in development
{process.env.NODE_ENV === 'development' && (
  <DevPanel ... />
)}
```

## Step 5: SEO & Performance Optimization

### 5.1 Meta Tags Setup
```html
<!-- index.html -->
<meta name="description" content="Find the best local businesses in your city">
<meta property="og:title" content="Best Local Businesses">
<meta property="og:description" content="Discover top-rated businesses in your area">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 5.2 Dynamic Title Updates
Ensure titles update correctly:
```typescript
// App.tsx
useEffect(() => {
  document.title = generateTitle(category, city, state);
}, [subdomainInfo]);
```

## Step 6: Data Management Strategy

### 6.1 Static JSON (Current)
- Pros: Fast, simple, no backend needed
- Cons: Manual updates, limited scalability
- Best for: MVP, small datasets

### 6.2 API Integration (Future)
```typescript
// Future: Replace JsonDataProvider with ApiDataProvider
class ApiDataProvider implements IDataProvider {
  async getBusinesses(category: string, city: string): Promise<Business[]> {
    const response = await fetch(`/api/businesses?category=${category}&city=${city}`);
    return response.json();
  }
}
```

## Step 7: Testing Subdomains

### 7.1 Local Testing
Add to `/etc/hosts`:
```
127.0.0.1 nail-salons.dallas.near-me.local
127.0.0.1 auto-repair.denver.near-me.local
```

### 7.2 Production Testing Checklist
- [ ] `nail-salons.dallas.near-me.us` loads correctly
- [ ] `auto-repair.denver.near-me.us` shows different content
- [ ] Root domain `near-me.us` has fallback content
- [ ] HTTPS works on all subdomains
- [ ] Page titles update dynamically
- [ ] Search functionality works per subdomain

## Step 8: Monitoring & Analytics

### 8.1 Add Analytics
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### 8.2 Error Monitoring
Consider adding Sentry or similar:
```bash
npm install @sentry/react
```

## Step 9: Scaling Considerations

### 9.1 Adding New Cities/Categories
1. Update `cityStateMap` in `subdomainParser.ts`
2. Add data to JSON files
3. No code deployment needed

### 9.2 Performance Optimization
- Enable gzip compression
- Implement lazy loading for images
- Add service worker for caching
- Consider CDN for static assets

## Step 10: Launch Checklist

### Pre-Launch
- [ ] DNS propagation complete (24-48 hours)
- [ ] SSL certificates active
- [ ] All test subdomains working
- [ ] Analytics configured
- [ ] Error monitoring active

### Post-Launch
- [ ] Monitor DNS resolution
- [ ] Check subdomain performance
- [ ] Verify search engine indexing
- [ ] Monitor error rates
- [ ] Test mobile responsiveness

## Common Issues & Solutions

### Issue: Subdomain not resolving
**Solution**: Check DNS propagation, verify wildcard CNAME setup

### Issue: HTTPS not working on subdomains
**Solution**: Ensure wildcard SSL certificate is configured

### Issue: Wrong content showing
**Solution**: Verify subdomain parsing logic, check data filtering

### Issue: Slow loading
**Solution**: Optimize images, enable compression, check bundle size

## Cost Considerations

### Netlify Pricing
- Free tier: 100GB bandwidth, 300 build minutes
- Pro: $19/month for higher limits
- Wildcard domains included in all plans

### Domain Costs
- `.us` domain: ~$10-15/year
- Wildcard SSL: Usually included with hosting

## Security Notes

- Validate subdomain inputs to prevent injection
- Sanitize user search queries
- Use HTTPS everywhere
- Implement rate limiting if adding APIs

This guide provides the complete path from domain purchase to production deployment for the dynamic subdomain application.