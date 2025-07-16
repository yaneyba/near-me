# Near Me Business Directory - React Application

A modern React application that creates SEO-optimized business directory pages with admin approval workflows and subscription management.

**Latest Update:** Production deployment with D1 database integration - January 2025

## ✨ Key Features

- **Business Approval Workflow**: Admin review system for business submissions
- **Stripe Subscription Integration**: Monthly subscriptions for business owners
- **Role-Based Authentication**: Admin and business owner dashboards
- **SEO Optimized**: Dynamic subdomain structure with unique meta tags
- **Real-time Search**: Live search with business suggestions
- **Mobile Responsive**: Optimized for all devices
- **Production Ready**: Built for scalable deployment

## 🚨 Adding New Subdomains

**IMPORTANT**: When creating new category subdomains, follow the complete checklist:

- 📋 **Full Guide**: [docs/NEW-SUBDOMAIN-CHECKLIST.md](docs/NEW-SUBDOMAIN-CHECKLIST.md)
- ⚡ **Quick Ref**: [SUBDOMAIN-QUICK-REF.md](SUBDOMAIN-QUICK-REF.md)

**Critical**: Must update middleware (`functions/_middleware.js`) or SEO will fail!

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file with your Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Site Configuration
VITE_SITE_ID=near-me-us

# Stripe Configuration (for subscriptions)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
VITE_STRIPE_SECRET_KEY=sk_test_your_secret_key
```

### 3. Database Setup

Apply the database migrations to set up the required tables:

```bash
# Option 1: Use Supabase CLI (if you have Docker)
supabase db reset

# Option 2: Manual SQL execution
# Copy SQL from supabase/migrations/ and run in Supabase SQL Editor
```

### 4. Start Development

```bash
npm run dev
```

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

### Business Approval Workflow

1. **Business Submission**: Businesses submit registration forms
2. **Admin Review**: Admins review submissions in dashboard
3. **Approval Process**: Approve/reject with notes
4. **Business Profile Creation**: Approved businesses get user accounts
5. **Subscription Management**: Business owners can manage Stripe subscriptions

### Database Schema

The application uses several key tables:

- **business_submissions**: Pending business registrations
- **business_profiles**: Approved businesses with user accounts
- **admin_settings**: System configuration (login enabled, etc.)
- **contact_messages**: Contact form submissions

### Role-Based Access

- **Admin Users**: Manage submissions, approve businesses, system settings
- **Business Owners**: Access dashboard, manage subscriptions, update profiles
- **Anonymous Users**: Submit businesses, contact forms

## 🔌 Supabase Integration

### Authentication & Authorization

- **Supabase Auth**: Email/password authentication
- **Row Level Security**: Database-level access control
- **Admin Detection**: Email-based admin identification
- **Role Management**: Admin vs business owner permissions

### Real-time Data

All form submissions and business data are stored in Supabase:
- Business registration submissions
- Contact form messages  
- User profiles and authentication
- Subscription status and billing

### Security Features

- RLS policies protect user data
- Admin-only access to sensitive operations
- Secure API endpoints for Stripe integration
- Environment-based configuration

## 🛠️ Development

### Available Scripts

```bash
npm run dev                    # Start development server
npm run build                  # Build for production with SEO
npm run build:production       # Build with optimizations
npm run preview               # Preview production build
npm run lint                  # Run ESLint

# Admin & Setup Scripts
npm run create-admin          # Create admin user
npm run create-business-owner # Create business owner
npm run toggle-auth          # Toggle authentication

# Testing & Data Scripts
npm run test:supabase        # Test Supabase connection
npm run add:samples          # Add sample data
```

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   └── ads/             # Advertisement components
├── pages/               # Page components
├── lib/                 # Utility libraries (auth, supabase)
├── providers/           # Data providers
├── types/               # TypeScript type definitions
├── utils/               # Helper utilities
└── data/                # Static business data (JSON)

supabase/
├── migrations/          # Database migrations
└── functions/           # Edge functions (Stripe webhooks)

docs/                    # Documentation
scripts/                 # Build and utility scripts
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
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
VITE_STRIPE_SECRET_KEY=sk_live_your_live_key
VITE_SITE_ID=near-me-us
```

### Database Migrations

Apply migrations to production database:

1. Copy SQL from `supabase/migrations/`
2. Execute in Supabase SQL Editor for production project
3. Verify tables and RLS policies are created correctly

## 📊 Key Database Tables

### business_submissions
Stores pending business registration requests:
- Business information (name, address, contact)
- Services and hours
- Approval status (pending/approved/rejected)
- Admin review notes

### business_profiles  
Approved businesses with user accounts:
- Links to Supabase Auth users
- Subscription status and Stripe data
- Business details and settings
- Role management (owner/admin)

### admin_settings
System configuration:
- Feature toggles (login enabled, ads enabled)
- Global settings and preferences
- Admin-controlled functionality

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
- Review and approve business submissions
- Manage business profiles and subscriptions
- View analytics and engagement data

### System Administration  
- Toggle authentication on/off
- Manage global settings
- Monitor form submissions
- Control feature availability

## 💰 Business Owner Features

### Dashboard Access
- View subscription status
- Manage billing and payments
- Update business profile
- Access engagement analytics

### Subscription Management
- Stripe-powered monthly subscriptions
- Automatic billing and renewals
- Cancel or modify subscriptions
- Usage tracking and limits

## 🔍 Troubleshooting

### Common Issues

1. **RLS Policy Errors**: Check Supabase RLS policies are applied
2. **Environment Variables**: Verify all required vars are set
3. **Migration Issues**: Ensure all migrations are applied in order
4. **Stripe Webhooks**: Configure webhook endpoints for subscription events

### Debug Tools

- Use browser dev tools for React debugging
- Check Supabase logs for database errors
- Monitor Stripe dashboard for payment issues
- Review Cloudflare logs for deployment problems

## 📚 Documentation

Comprehensive guides are available in the `docs/` folder:

- **ADMIN-GUIDE.md**: Complete admin functionality guide
- **ARCHITECTURE.md**: System architecture overview  
- **DEPLOYMENT-GUIDE.md**: Production deployment instructions
- **ADS-HOW-TO-GUIDE.md**: Advertisement integration
- **SEO-EXPLANATION.md**: SEO strategy and implementation

## 🤝 Support

For questions or issues:
1. Check documentation in `docs/` folder
2. Review error logs in browser console
3. Verify environment variables and database setup
4. Test with sample data using `npm run add:samples`

## 📄 License

This project is licensed under the MIT License.