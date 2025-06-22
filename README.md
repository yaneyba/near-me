# Dynamic Subdomain React Application with SEO

A React application that creates unique, SEO-optimized pages for different business categories and cities using dynamic subdomains.

## SEO Solution

This project solves the common SPA SEO problem by generating subdomain-specific HTML files at build time, each with proper meta tags, Open Graph data, and structured data.

### How It Works

1. **Build Process**: `npm run build` generates unique HTML files for each subdomain combination
2. **SEO Meta Tags**: Each HTML file contains category and city-specific titles, descriptions, and keywords
3. **Subdomain Routing**: Cloudflare Pages serves the appropriate HTML file based on the subdomain
4. **Client-Side Hydration**: React takes over after the initial HTML load

### Example Generated Files

- `nail-salons.dallas.html` → "Best Nail Salons in Dallas, Texas (2+ Options)"
- `auto-repair.denver.html` → "Best Auto Repair in Denver, Colorado (2+ Options)"

### SEO Benefits

✅ **Proper Page Titles**: Each subdomain gets a unique, descriptive title
✅ **Meta Descriptions**: Location and category-specific descriptions
✅ **Open Graph Tags**: Social media sharing optimization
✅ **Structured Data**: JSON-LD for rich search results
✅ **Canonical URLs**: Proper URL canonicalization
✅ **Fast Loading**: Static HTML serves immediately from Cloudflare's global CDN, React hydrates

## Development

```bash
# Start development server
npm run dev

# Build with SEO optimization
npm run build

# Generate SEO HTML files only
npm run build:seo
```

## Deployment with Cloudflare Pages

The project is configured for Cloudflare Pages with automatic subdomain routing:

### Setup Steps

1. **Connect Repository to Cloudflare Pages:**
   - Go to Cloudflare Pages dashboard
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`

2. **Configure Custom Domain:**
   - Add custom domain: `near-me.us` in Cloudflare Pages
   - Configure wildcard DNS: `*` CNAME → `your-project.pages.dev`
   - SSL certificate is automatically provisioned

3. **Deploy:**
   - Push to main branch
   - Cloudflare Pages builds and deploys automatically

### Cloudflare Pages Advantages

🚀 **Global CDN**: 200+ locations worldwide for fast loading
🔒 **Built-in Security**: DDoS protection and SSL certificates
📊 **Analytics**: Built-in traffic and performance monitoring
💰 **Cost Effective**: Free tier with unlimited bandwidth

## Adding New Subdomains

1. Add business data to `src/data/businesses.json`
2. Run `npm run build:seo` to generate new HTML files
3. Update `public/_redirects` if needed
4. Deploy to Cloudflare Pages

## File Structure

```
dist/
├── index.html                    # Default SPA
├── nail-salons.dallas.html      # SEO-optimized for nail salons in Dallas
├── auto-repair.denver.html      # SEO-optimized for auto repair in Denver
├── subdomain-mapping.json       # Deployment reference
└── assets/                      # Vite build assets
```

## Features

### 🎯 **Dynamic Subdomains**
- `category.city.near-me.us` structure
- Automatic content filtering by location and category
- SEO-optimized for each combination

### 🔍 **Advanced Search**
- Real-time search with live suggestions
- Context-aware results within current subdomain
- Recent search history and popular searches

### ⭐ **Premium Listings**
- Featured business showcase
- Enhanced visibility for premium partners
- Special styling and placement

### 📱 **Responsive Design**
- Mobile-first approach
- Touch-friendly interface
- Optimized for all device sizes

### 🧭 **Smart Navigation**
- Breadcrumb navigation
- Category and city cross-linking
- Intuitive user flow

This approach provides excellent SEO without the complexity of full SSR while maintaining the benefits of a React SPA, all delivered through Cloudflare's global network for optimal performance.