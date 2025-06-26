# Dynamic Subdomain React Application with SEO

A React application that creates unique, SEO-optimized pages for different business categories and cities using dynamic subdomains.

## Features

- **Dynamic Subdomains**: `category.city.near-me.us` structure
- **SEO Optimized**: Unique HTML files with proper meta tags for each subdomain
- **Real-time Search**: Live search with suggestions
- **Supabase Integration**: Contact forms and business submissions stored in Supabase
- **Hybrid Data Strategy**: JSON for business listings (fast), Supabase for forms (persistent)
- **Mobile Responsive**: Optimized for all devices
- **Production Ready**: Cache busting, CDN optimization, and deployment ready
- **Authentication**: Business owner login and admin controls

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Database Setup

Your existing database schema is already compatible! The application will use your existing:

- `contact_messages` table for contact form submissions
- `business_submissions` table for business applications

**No migration needed** - the application works with your current schema.

### 4. Start Development

```bash
npm run dev
```

## Admin Setup

### Creating an Admin User

To create an admin user with full access to the admin settings:

```bash
npm run create-admin
```

Follow the prompts to enter your Supabase URL, service role key, and admin user details.

### Toggling Authentication Features

To enable or disable login functionality:

```bash
npm run toggle-auth
```

This script allows you to toggle authentication features without accessing the admin dashboard.

## Data Architecture

### Hybrid Data Strategy

The application uses a **hybrid data approach**:

- **Business Listings**: Served from JSON files (fast, static)
  - `src/data/businesses.json`
  - `src/data/services.json` 
  - `src/data/neighborhoods.json`

- **Form Submissions**: Stored in your existing Supabase tables (persistent, real data)
  - Contact form messages → `contact_messages` table
  - Business applications → `business_submissions` table

### Why Hybrid?

1. **Performance**: Business listings load instantly from JSON
2. **Real Data**: Form submissions are properly stored and managed in your existing database
3. **Scalability**: Easy to migrate business data to Supabase later
4. **Development**: Fast iteration without database dependencies for listings
5. **Compatibility**: Works with your existing database schema

## Supabase Integration

### Contact Forms

Contact form submissions are stored in your existing `contact_messages` table with:
- User information (name, email)
- Message details (subject, message)
- Context (category, city)
- Admin management (status, notes, resolution)

### Business Applications

Business submissions are stored in your existing `business_submissions` table with:
- Complete business information
- Services and hours
- Review workflow (pending → approved/rejected)
- Admin notes and tracking

### Authentication

User authentication is handled through Supabase Auth with:
- Email/password login for business owners
- Role-based access control
- Admin settings for enabling/disabling authentication

### Security

Your existing Row Level Security (RLS) policies are used:
- **Public insert** allowed for form submissions
- **User access** to their own submissions only
- **Admin access** to all data for management

## Development

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production with SEO
npm run build:production # Build with production optimizations
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run create-admin     # Create an admin user
npm run toggle-auth      # Toggle authentication features
```

### Adding New Content

1. **New Cities**: Add to `cityStateMap` in `src/utils/subdomainParser.ts`
2. **New Categories**: Add services to `src/data/services.json`
3. **New Businesses**: Add to `src/data/businesses.json`

### Environment Variables

Required for Supabase integration:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_AUTH_LOGIN_ENABLED=true
```

## Deployment

### Cloudflare Pages

1. Connect your repository to Cloudflare Pages
2. Set build command: `npm run build:production`
3. Set output directory: `dist`
4. Add environment variables in Cloudflare Pages dashboard
5. Configure custom domain with wildcard DNS

### Environment Variables in Production

Add these in your Cloudflare Pages dashboard:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_AUTH_LOGIN_ENABLED=true
```

## SEO Strategy

### Build-Time HTML Generation

Each subdomain gets a unique HTML file:
- `nail-salons.dallas.html` → "Best Nail Salons in Dallas, Texas"
- `auto-repair.denver.html` → "Best Auto Repair in Denver, Colorado"

### Cache Strategy

- **HTML Files**: 1 hour browser cache, 1 day CDN cache
- **Static Assets**: 1 year cache with immutable headers
- **API Endpoints**: No cache for real-time data

### Benefits

✅ **Perfect SEO**: Each subdomain has unique, descriptive titles  
✅ **Fast Performance**: Static HTML + React hydration  
✅ **Real Data**: Form submissions properly stored in your existing database  
✅ **Scalable**: Easy to add new cities and categories  
✅ **Production Ready**: Optimized for CDN deployment  
✅ **Compatible**: Works with your existing database schema

## Database Schema

### business_profiles

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | References auth.users |
| business_id | text | Business identifier |
| business_name | text | Business name |
| email | text | Contact email |
| role | text | 'owner', 'admin', or 'staff' |
| created_at | timestamptz | Creation timestamp |
| updated_at | timestamptz | Update timestamp |

### user_engagement_events

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| business_id | text | Business identifier |
| business_name | text | Business name |
| event_type | text | Type of engagement event |
| event_data | jsonb | Additional event data |
| timestamp | timestamptz | Event timestamp |
| ip_address | text | User IP address |
| user_session_id | text | Session identifier |
| created_at | timestamptz | Creation timestamp |

## Support

For questions or issues:
1. Check the documentation in the `docs/` folder
2. Review the code comments in the source files
3. Use the development panel for testing different configurations

## License

This project is licensed under the MIT License.