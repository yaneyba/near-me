# Near Me Business Directory - React Application

A modern React application that creates SEO-optimized business directory pages with Cloudflare D1 database integration and real-time Slack notifications.

**Latest Update:** Slack notifications integration and documentation organization - July 2025

## ✨ Key Features

- **Cloudflare D1 Database**: High-performance SQLite database for business data
- **Slack Notifications**: Real-time notifications for form submissions and admin actions
- **SEO Optimized**: Dynamic subdomain structure with unique meta tags
- **Real-time Search**: Live search with business suggestions
- **Mobile Responsive**: Optimized for all devices
- **Production Ready**: Built for scalable Cloudflare Pages deployment
- **Admin Dashboard**: Business submission approval workflow
- **Automated Subdomain Management**: Dynamic category-based subdomain generation

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file with your configuration:

```env
# Database Configuration (Cloudflare D1)
DATABASE_NAME=nearme-db
DATABASE_ID=your-database-id

# Slack Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Google Places API (optional)
GOOGLE_PLACES_API_KEY=your_google_places_api_key

# Site Configuration
VITE_SITE_ID=near-me-us
```

### 3. Database Setup

Set up your Cloudflare D1 database:

```bash
# Create a new D1 database
wrangler d1 create nearme-db

# Apply migrations to remote database
wrangler d1 migrations apply nearme-db --remote

# Test database connection
wrangler d1 execute nearme-db --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
```

### 4. Start Development

```bash
npm run dev
```

## 🔔 Slack Notifications

The application sends real-time notifications to Slack for:
- New business submissions
- Contact form messages  
- Admin approval/rejection actions
- Business profile updates

Configure your Slack webhook URL in the environment variables. See `docs/SLACK_NOTIFICATIONS.md` for detailed setup instructions.

## 👨‍💼 Admin Setup

### Admin Dashboard Access

The admin dashboard provides tools for:
- Reviewing and approving business submissions
- Managing contact form messages
- Monitoring system performance
- Configuring application settings

### Business Approval Workflow

1. Business submits registration form
2. Slack notification sent to admin channel
3. Admin reviews submission in dashboard
4. Approval/rejection triggers additional Slack notifications
5. Approved businesses appear in public directory

## 👨‍💼 Admin Setup

### Admin User Creation

Create an admin user with full dashboard access:

```bash
npm run create-admin
```

### Business Owner Creation

Create business owner accounts:

```bash
npm run create-business-owner
```

### Authentication Controls

Toggle authentication features on/off:

```bash
npm run toggle-auth
```

## 🏗️ Application Architecture

### Business Workflow

1. **Business Submission**: Businesses submit registration forms via API
2. **Slack Notification**: Real-time notification sent to admin Slack channel
3. **Admin Review**: Admins review submissions in dashboard
4. **Approval Process**: Approve/reject with automated Slack notifications
5. **SEO Generation**: Approved businesses trigger subdomain HTML generation

### Database Schema

The application uses Cloudflare D1 (SQLite) with these key tables:

- **businesses**: All business listings with location and category data
- **business_submissions**: Pending business registrations awaiting approval
- **contact_messages**: Contact form submissions from users
- **cities**: City data for location-based filtering
- **neighborhoods**: Neighborhood data for precise location targeting
- **services**: Service categories and descriptions
- **products**: Product catalog for specialty businesses

### Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Cloudflare Functions (serverless)
- **Database**: Cloudflare D1 (SQLite-based)
- **Deployment**: Cloudflare Pages
- **Notifications**: Slack webhooks
- **SEO**: Static HTML generation for subdomains

## �️ Cloudflare D1 Integration

### Database Operations

```bash
# Connect to remote production database
wrangler d1 execute nearme-db --remote --command "SELECT * FROM businesses LIMIT 5;"

# Apply migrations
wrangler d1 migrations apply nearme-db --remote

# Backup database
wrangler d1 execute nearme-db --remote --command ".dump" > backup.sql

# Import data
node scripts/business-importer.js
```

### API Endpoints

All database operations go through Cloudflare Functions:
- `functions/api/businesses.ts` - Business CRUD operations
- `functions/api/cities.ts` - City data endpoints
- `functions/api/contact.ts` - Contact form handling with Slack notifications
- `functions/api/submit-business.ts` - Business submission with Slack notifications

### Performance Features

- **Edge Caching**: Cloudflare CDN for global performance
- **D1 Database**: High-performance SQLite with automatic scaling
- **Static Generation**: Pre-built HTML for SEO optimization
- **Function Optimization**: Serverless functions with minimal cold starts

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev                    # Start development server
npm run build                  # Build for production with SEO
npm run build:production       # Build with optimizations
npm run preview               # Preview production build
npm run lint                  # Run ESLint

# Database Management
npm run db:migrate            # Apply D1 migrations to remote database
npm run db:backup             # Backup remote database
npm run db:query              # Execute custom SQL queries

# Subdomain Management
npm run subdomain:add         # Add new subdomain
npm run subdomain:remove      # Remove subdomain
npm run subdomain:list        # List all subdomains
npm run subdomain:cloudflare  # Generate Cloudflare configuration

# Data Management
npm run import:businesses     # Import business data
npm run migration:generate    # Generate new migration file
npm run migration:run         # Run migrations on remote database

# Deployment
npm run deploy:category       # Deploy category-specific changes
npm run deploy:staging        # Deploy to staging environment
npm run deploy:production     # Deploy to production with optimizations
```

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── routing/         # Smart routing components
│   ├── shared/          # Shared UI components
│   └── water-refill/    # Water refill specific components
├── pages/               # Page components
├── providers/           # Data providers (D1DataProvider)
├── types/               # TypeScript type definitions
├── utils/               # Helper utilities
├── hooks/               # Custom React hooks
└── data/                # Static business data (JSON)

functions/
├── api/                 # Cloudflare Functions API endpoints
│   ├── admin/          # Admin-specific endpoints
│   ├── business/       # Business management endpoints
│   └── water-stations/ # Water refill station endpoints
├── utils/              # Utility functions (Slack notifications)
└── types.ts            # TypeScript types for functions

database/
├── migrations/         # D1 database migrations
├── database-schema.json # Schema documentation
└── local-schema.sql    # Local development schema

docs/                   # Documentation
├── SLACK_NOTIFICATIONS.md
├── DEPLOYMENT-GUIDE.md
├── DATABASE_README.md
└── SUBDOMAIN_WORKFLOW.md

scripts/                # Build and utility scripts
├── generate-subdomain-html.js
├── manage-subdomains.js
├── business-importer.js
└── optimize-production.js
```

## 🚀 Deployment

### Cloudflare Pages Setup

1. **Connect Repository**: Link your GitHub repo to Cloudflare Pages
2. **Build Settings**:
   - Build command: `npm run build:production`
   - Output directory: `dist`
3. **Environment Variables**: Add in Cloudflare dashboard
4. **Custom Domain**: Configure with wildcard DNS for subdomains

### Production Environment Variables

```env
# Database Configuration
DATABASE_NAME=nearme-db
DATABASE_ID=your-production-database-id

# Slack Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/PRODUCTION/WEBHOOK

# Google Places API
GOOGLE_PLACES_API_KEY=your_production_google_places_api_key

# Site Configuration
VITE_SITE_ID=near-me-us
```

### Database Migrations

Apply migrations to production database:

```bash
# Apply all pending migrations
wrangler d1 migrations apply nearme-db --remote

# Create a new migration
npm run migration:generate

# Check migration status
wrangler d1 migrations list nearme-db --remote
```

## 📊 Key Database Tables

### businesses
Main business directory with approved listings:
- Business information (name, address, contact details)
- Category and service classifications
- Location data (city, neighborhood, coordinates)
- Hours, pricing, and operational details

### business_submissions
Pending business registration requests:
- Submitted business information awaiting approval
- Admin review notes and status tracking
- Slack notification triggers for new submissions

### contact_messages
Contact form submissions from users:
- User inquiries and feedback
- Admin resolution tracking
- Slack notification integration

### cities
Location data for filtering and routing:
- City names and state information
- Business count statistics
- SEO-optimized slugs for URL generation

### neighborhoods
Precise location targeting:
- Neighborhood names within cities
- Geographic boundaries and coordinates
- Local business density data

### services
Service categories and descriptions:
- Category definitions and hierarchies
- SEO metadata for category pages
- Service-specific configuration data

## 🎯 SEO Strategy

### Dynamic HTML Generation

Each business category/city combination gets optimized HTML:
- `nail-salons.dallas.html` → "Best Nail Salons in Dallas, Texas"  
- `auto-repair.denver.html` → "Best Auto Repair in Denver, Colorado"

### Performance Optimization

- **Static HTML**: Pre-generated for instant loading
- **React Hydration**: Interactive functionality after load
- **CDN Friendly**: Optimized for edge caching
- **Meta Tags**: Unique titles and descriptions per page

## 📋 Admin Features

### Business Management
- Review and approve business submissions via dashboard
- Receive real-time Slack notifications for new submissions
- Manage business profiles and data quality
- Monitor engagement and analytics

### Subdomain Management
- Add new category-city subdomain combinations
- Generate SEO-optimized HTML for each subdomain
- Manage Cloudflare configuration for routing
- Monitor subdomain performance and traffic

### System Administration
- Configure Slack notification settings
- Manage database migrations and backups
- Monitor API endpoint performance
- Control feature availability and settings

## � Business Owner Features

### Business Listings
- Submit business information for approval
- Update business profiles and details
- Manage business hours and contact information
- Upload photos and business descriptions

### Analytics Dashboard
- View business listing performance
- Monitor customer engagement metrics
- Track search rankings and visibility
- Access detailed analytics reports

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Errors**: 
   - Always use `--remote` flag with wrangler commands
   - Check Cloudflare D1 service status
   - Verify database ID in wrangler.toml

2. **Slack Notifications Not Working**:
   - Verify SLACK_WEBHOOK_URL environment variable
   - Check webhook URL format and permissions
   - Test webhook using curl or Postman

3. **Subdomain Generation Issues**:
   - Check subdomain configuration in config/subdomain-generation.json
   - Verify HTML generation script permissions
   - Ensure Cloudflare DNS propagation time

4. **API Function Errors**:
   - Check function logs in Cloudflare dashboard
   - Verify database binding configuration
   - Test API endpoints directly

### Debug Tools

- Use browser dev tools for React debugging
- Check Cloudflare Function logs for backend errors
- Monitor D1 database query performance
- Review Cloudflare Pages deployment logs
- Test API endpoints using curl or Postman

## 📚 Documentation

Comprehensive guides are available in the `docs/` folder:

- **SLACK_NOTIFICATIONS.md**: Slack integration setup and configuration
- **DEPLOYMENT-GUIDE.md**: Production deployment instructions
- **DATABASE_README.md**: Database management and operations guide
- **SUBDOMAIN_WORKFLOW.md**: Subdomain creation and management
- **CUSTOM-SPECIALTY-SITE-GUIDE.md**: Creating specialty business sites
- **SCRIPTS_README.md**: Build and utility script documentation

## 🤝 Support

For questions or issues:
1. Check documentation in `docs/` folder
2. Review error logs in browser console and Cloudflare dashboard
3. Verify environment variables and database connection
4. Test API endpoints using the provided scripts
5. Check Slack notifications setup and webhook configuration

## 📄 License

This project is licensed under the MIT License.