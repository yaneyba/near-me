# Dynamic Subdomain React Application with SEO

A React application that creates unique, SEO-optimized pages for different business categories and cities using dynamic subdomains.

## SEO Solution

This project solves the common SPA SEO problem by generating subdomain-specific HTML files at build time, each with proper meta tags, Open Graph data, and structured data.

### How It Works

1. **Build Process**: `npm run build` generates unique HTML files for each subdomain combination
2. **SEO Meta Tags**: Each HTML file contains category and city-specific titles, descriptions, and keywords
3. **Subdomain Routing**: Netlify serves the appropriate HTML file based on the subdomain
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
✅ **Fast Loading**: Static HTML serves immediately, React hydrates

## Development

```bash
# Start development server
npm run dev

# Build with SEO optimization
npm run build

# Generate SEO HTML files only
npm run build:seo
```

## Deployment

The project is configured for Netlify with automatic subdomain routing:

1. Deploy to Netlify
2. Configure wildcard DNS: `*.near-me.us` → your-site.netlify.app
3. Add custom domain in Netlify dashboard
4. Enable wildcard SSL certificate

## Adding New Subdomains

1. Add business data to `src/data/businesses.json`
2. Run `npm run build:seo` to generate new HTML files
3. Update `netlify.toml` redirects if needed
4. Deploy

## File Structure

```
dist/
├── index.html                    # Default SPA
├── nail-salons.dallas.html      # SEO-optimized for nail salons in Dallas
├── auto-repair.denver.html      # SEO-optimized for auto repair in Denver
├── subdomain-mapping.json       # Deployment reference
└── assets/                      # Vite build assets
```

This approach provides excellent SEO without the complexity of full SSR while maintaining the benefits of a React SPA.