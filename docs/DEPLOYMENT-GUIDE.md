# Domain to Deployment: Cloudflare Pages Action Guide

## Overview
This guide covers the practical steps to deploy the dynamic subdomain React application from domain setup to live production using Cloudflare Pages.

## Prerequisites
- Domain ownership (e.g., `near-me.us`)
- Cloudflare account
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally

## Step 1: Domain & DNS Configuration

### 1.1 Add Domain to Cloudflare
1. Log into Cloudflare dashboard
2. Click "Add a Site"
3. Enter your domain: `near-me.us`
4. Choose a plan (Free plan works fine)
5. Update nameservers at your domain registrar

### 1.2 Wildcard DNS Setup
Configure DNS to handle wildcard subdomains:

```
Type: CNAME
Name: *
Target: your-project.pages.dev
Proxy status: Proxied (orange cloud)
TTL: Auto
```

### 1.3 Root Domain Setup
```
Type: CNAME
Name: @
Target: your-project.pages.dev
Proxy status: Proxied
TTL: Auto
```

### 1.4 WWW Redirect (Optional)
```
Type: CNAME  
Name: www
Target: near-me.us
Proxy status: Proxied
TTL: Auto
```

## Step 2: Repository Setup

### 2.1 Ensure Build Configuration
Verify your `package.json` has the correct scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build && node scripts/generate-subdomain-html.js",
    "build:seo": "node scripts/generate-subdomain-html.js",
    "preview": "vite preview"
  }
}
```

### 2.2 Verify _redirects File
Ensure `public/_redirects` exists with subdomain routing:
```
# Cloudflare Pages redirects for subdomain routing
https://nail-salons.dallas.near-me.us/* /nail-salons.dallas.html 200!
https://auto-repair.denver.near-me.us/* /auto-repair.denver.html 200!
https://nail-salons.austin.near-me.us/* /nail-salons.austin.html 200!

# Fallback
/* /index.html 200
```

### 2.3 Test Build Locally
```bash
npm run build
```
Verify that HTML files are generated in `dist/` folder.

## Step 3: Cloudflare Pages Setup

### 3.1 Create Pages Project
1. Go to Cloudflare dashboard
2. Navigate to "Pages"
3. Click "Create a project"
4. Choose "Connect to Git"

### 3.2 Connect Repository
1. Authorize Cloudflare to access your Git provider
2. Select your repository
3. Choose the branch (usually `main` or `master`)

### 3.3 Configure Build Settings
```
Project name: near-me-directory (or your choice)
Production branch: main
Build command: npm run build
Build output directory: dist
Root directory: / (leave empty)
```

### 3.4 Environment Variables (if needed)
```
NODE_VERSION=18
```

### 3.5 Deploy
Click "Save and Deploy" - your first deployment will start automatically.

## Step 4: Custom Domain Configuration

### 4.1 Add Custom Domain
1. In your Cloudflare Pages project
2. Go to "Custom domains" tab
3. Click "Set up a custom domain"
4. Enter: `near-me.us`
5. Click "Continue"

### 4.2 Verify Domain
Cloudflare will automatically verify domain ownership since it's already in your Cloudflare account.

### 4.3 SSL Certificate
- Wildcard SSL certificate is automatically provisioned
- Usually takes 5-15 minutes to become active
- Covers `*.near-me.us` automatically

## Step 5: Testing Subdomains

### 5.1 Wait for DNS Propagation
- Initial setup: 5-15 minutes
- DNS changes: Up to 24 hours (usually much faster)

### 5.2 Test Subdomain URLs
```bash
# Test these URLs in your browser:
https://nail-salons.dallas.near-me.us
https://auto-repair.denver.near-me.us
https://nail-salons.austin.near-me.us
```

### 5.3 Verify SEO Tags
1. Right-click → "View Page Source"
2. Check for proper `<title>` tags
3. Verify meta descriptions
4. Confirm Open Graph tags

## Step 6: Production Optimization

### 6.1 Performance Settings
In Cloudflare dashboard:

**Speed → Optimization:**
- Auto Minify: Enable CSS, HTML, JS
- Brotli: Enable
- Early Hints: Enable

**Caching → Configuration:**
- Caching Level: Standard
- Browser Cache TTL: 4 hours
- Always Online: Enable

### 6.2 Security Settings
**SSL/TLS:**
- Encryption mode: Full (strict)
- Always Use HTTPS: Enable
- HSTS: Enable

**Security:**
- Security Level: Medium
- Bot Fight Mode: Enable
- Browser Integrity Check: Enable

## Step 7: SEO & Analytics Setup

### 7.1 Google Search Console
1. Add property: `near-me.us`
2. Verify ownership via DNS record
3. Submit sitemap: `https://near-me.us/sitemap.xml`
4. Add subdomain properties for major combinations

### 7.2 Google Analytics
```html
<!-- Add to index.html and generated HTML files -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 7.3 Cloudflare Web Analytics
1. In Cloudflare dashboard → Analytics → Web Analytics
2. Add site: `near-me.us`
3. Add beacon to your HTML files

## Step 8: Continuous Deployment

### 8.1 Automatic Deployments
- Push to main branch triggers automatic deployment
- Build logs available in Cloudflare Pages dashboard
- Rollback available if needed

### 8.2 Preview Deployments
- Pull requests create preview deployments
- Test changes before merging
- Unique URLs for each preview

### 8.3 Build Notifications
Set up notifications in Cloudflare Pages:
- Email notifications for build failures
- Webhook integration for Slack/Discord

## Step 9: Monitoring & Maintenance

### 9.1 Cloudflare Analytics
Monitor in Cloudflare dashboard:
- Page views by subdomain
- Geographic distribution
- Performance metrics
- Security events

### 9.2 Error Monitoring
**Cloudflare Logs:**
- Real-time logs available
- Filter by subdomain
- Monitor 404s and errors

**External Monitoring:**
- Consider Sentry for JavaScript errors
- UptimeRobot for availability monitoring

### 9.3 Performance Monitoring
- Core Web Vitals in Cloudflare
- PageSpeed Insights testing
- Real User Monitoring (RUM)

## Step 10: Scaling & Updates

### 10.1 Adding New Subdomains
1. Update business data in `src/data/businesses.json`
2. Run `npm run build:seo` locally to test
3. Add redirect rule to `public/_redirects`
4. Commit and push changes
5. Automatic deployment handles the rest

### 10.2 Content Updates
- Business data changes trigger automatic rebuilds
- SEO tags update automatically
- No manual intervention needed

### 10.3 Performance Optimization
- Monitor Cloudflare Analytics
- Optimize images using Cloudflare Images (paid feature)
- Use Cloudflare Workers for advanced logic (if needed)

## Troubleshooting Guide

### Common Issues

**Subdomain not resolving:**
- Check wildcard DNS record (`*` CNAME)
- Verify domain is active in Cloudflare
- Wait for DNS propagation (up to 24 hours)

**SSL certificate issues:**
- Check SSL/TLS encryption mode (use Full Strict)
- Verify custom domain is properly configured
- Wait for certificate provisioning (5-15 minutes)

**Wrong content showing:**
- Verify `_redirects` file format
- Check build output in Cloudflare Pages logs
- Purge cache in Cloudflare dashboard

**Build failures:**
- Check Node.js version (use 18+)
- Verify all dependencies are in package.json
- Review build logs in Cloudflare Pages

### Debug Commands

```bash
# Test build locally
npm run build

# Check generated files
ls -la dist/

# Test specific subdomain routing
curl -H "Host: nail-salons.dallas.near-me.us" https://your-project.pages.dev/

# Verify DNS
dig nail-salons.dallas.near-me.us
```

## Cost Considerations

### Cloudflare Pages Pricing
- **Free Tier:** 
  - 500 builds per month
  - Unlimited bandwidth
  - 100 custom domains
  - Basic DDoS protection

- **Pro Plan ($20/month):**
  - 5,000 builds per month
  - Advanced analytics
  - Priority support

### Domain Costs
- `.us` domain: ~$10-15/year
- Wildcard SSL: Included with Cloudflare

### Additional Features (Optional)
- Cloudflare Images: $1/month + usage
- Workers: $5/month + usage
- Advanced security features: Various pricing

## Security Best Practices

### Content Security Policy
Add to your HTML files:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline';">
```

### Rate Limiting
Configure in Cloudflare:
- API endpoints: 100 requests per minute
- Search functionality: 50 requests per minute
- Contact forms: 5 requests per minute

### Bot Protection
- Enable Bot Fight Mode
- Configure challenge pages
- Monitor bot traffic in analytics

## Launch Checklist

### Pre-Launch
- [ ] DNS propagation complete
- [ ] SSL certificates active
- [ ] All test subdomains working
- [ ] SEO tags verified
- [ ] Analytics configured
- [ ] Performance optimized

### Post-Launch
- [ ] Monitor DNS resolution
- [ ] Check subdomain performance
- [ ] Submit to search engines
- [ ] Monitor error rates
- [ ] Test mobile responsiveness
- [ ] Verify social sharing

## Success Metrics

### Week 1
- All subdomains resolving correctly
- Search engines discovering pages
- No critical errors in logs

### Month 1
- Google indexing subdomain pages
- Organic traffic starting to grow
- Core Web Vitals scores good

### Month 3
- Keyword rankings improving
- Steady organic traffic growth
- User engagement metrics positive

This comprehensive guide ensures your dynamic subdomain system launches successfully on Cloudflare Pages with optimal performance, security, and SEO benefits!