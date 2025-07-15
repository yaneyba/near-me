# Subdomain Quick Reference

## How It Works
1. **SmartDoor** (`src/components/routing/SmartDoor.tsx`) - Routes subdomains to the right component
2. **Static Generator** (`scripts/generate-subdomain-html.js`) - Creates SEO HTML files

## Current Subdomains
- `nail-salons.near-me.us` → BusinessWorld
- `auto-repair.near-me.us` → BusinessWorld  
- `water-refill.near-me.us` → WaterRefillWorld
- `senior-care.near-me.us` → SeniorCareWorld

## Adding New Subdomains
1. **For routing**: Nothing needed - SmartDoor handles it automatically
2. **For SEO**: Add to `config/subdomain-generation.json` and run `npm run build`

## Commands
```bash
# Generate static HTML files
npm run build

# Deploy
wrangler pages deploy dist
```

That's it. The system just works.
