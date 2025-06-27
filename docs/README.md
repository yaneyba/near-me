# Documentation

This folder contains comprehensive documentation for the Near Me Business Directory application.

## 📋 Available Documentation

### Core System Guides
- **[ADMIN-GUIDE.md](./ADMIN-GUIDE.md)**: Complete admin functionality and user management
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: System architecture and technical overview
- **[DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)**: Production deployment instructions
- **[HOW-IT-WORKS.md](./HOW-IT-WORKS.md)**: Application functionality explanation

### Feature-Specific Guides
- **[BUSINESS-SUBMISSION-IMPLEMENTATION.md](./BUSINESS-SUBMISSION-IMPLEMENTATION.md)**: Business approval workflow
- **[ADS-HOW-TO-GUIDE.md](./ADS-HOW-TO-GUIDE.md)**: Advertisement integration setup
- **[DYNAMIC-SUBDOMAIN-GUIDE.md](./DYNAMIC-SUBDOMAIN-GUIDE.md)**: Subdomain system functionality
- **[USER-ENGAGEMENT-TRACKING-GUIDE.md](./USER-ENGAGEMENT-TRACKING-GUIDE.md)**: Analytics and tracking

### SEO & Content Management
- **[SEO-EXPLANATION.md](./SEO-EXPLANATION.md)**: SEO strategy and implementation
- **[SEO-SITEMAP-GUIDE.md](./SEO-SITEMAP-GUIDE.md)**: Sitemap generation and management
- **[ADDING-NEW-CITY-GUIDE.md](./ADDING-NEW-CITY-GUIDE.md)**: Adding new cities and regions
- **[ADDING-NEW-CONTENT-GUIDE.md](./ADDING-NEW-CONTENT-GUIDE.md)**: Content management procedures

### Database Reference
- **[PRODUCTION-DDL-REFERENCE.sql](./PRODUCTION-DDL-REFERENCE.sql)**: Complete database schema reference

## 🚀 Quick Start Guide

### For Administrators
1. **Setup**: Follow [ADMIN-GUIDE.md](./ADMIN-GUIDE.md) for user management
2. **Business Workflow**: Review [BUSINESS-SUBMISSION-IMPLEMENTATION.md](./BUSINESS-SUBMISSION-IMPLEMENTATION.md)
3. **Deployment**: Use [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) for production setup

### For Developers  
1. **Architecture**: Start with [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **System Overview**: Read [HOW-IT-WORKS.md](./HOW-IT-WORKS.md)
3. **Content Management**: Check [ADDING-NEW-CONTENT-GUIDE.md](./ADDING-NEW-CONTENT-GUIDE.md)

### For SEO/Marketing
1. **SEO Strategy**: Review [SEO-EXPLANATION.md](./SEO-EXPLANATION.md)
2. **Content Addition**: Follow [ADDING-NEW-CITY-GUIDE.md](./ADDING-NEW-CITY-GUIDE.md)
3. **Analytics**: Setup [USER-ENGAGEMENT-TRACKING-GUIDE.md](./USER-ENGAGEMENT-TRACKING-GUIDE.md)

## 🏗️ Project Architecture

```
src/
├── components/              # Reusable UI components
│   ├── auth/               # Authentication components
│   └── ads/                # Advertisement components
├── pages/                  # Page components (dashboards, forms)
├── lib/                    # Core libraries (auth, supabase)
├── providers/              # Data providers and factories
├── types/                  # TypeScript type definitions
├── utils/                  # Helper utilities and parsers
└── data/                   # Static business data (JSON)

supabase/
├── migrations/             # Database schema migrations
└── functions/              # Edge functions (webhooks)

docs/                       # This documentation folder
scripts/                    # Build and utility scripts
```

## ✨ Key Application Features

### Business Management
- **Approval Workflow**: Admin review and approval system
- **Subscription Management**: Stripe-powered monthly billing
- **Role-Based Access**: Admin and business owner dashboards
- **Real-time Forms**: Contact and business submission forms

### Technical Features
- **Authentication**: Supabase Auth with role management
- **Database**: PostgreSQL with Row Level Security
- **SEO Optimization**: Dynamic meta tags and sitemaps
- **Mobile Responsive**: Optimized for all devices
- **Performance**: Optimized builds and caching strategies

### Admin Tools
- **User Management**: Create and manage admin/business accounts
- **System Settings**: Toggle features and global configurations
- **Analytics**: Track user engagement and business metrics
- **Content Management**: Add cities, categories, and businesses

## 🔧 Development Tools

### Available Scripts
```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run lint               # Code linting

# Admin Tools  
npm run create-admin       # Create admin user
npm run create-business-owner  # Create business owner
npm run toggle-auth        # Toggle authentication

# Testing & Data
npm run test:supabase      # Test database connection
npm run add:samples        # Add sample data
```

### Environment Setup
- Configure Supabase credentials
- Set up Stripe for subscriptions
- Configure site settings and IDs
- Enable/disable features via environment variables

## 🎯 Common Use Cases

### Setting Up New Admin
1. Follow [ADMIN-GUIDE.md](./ADMIN-GUIDE.md)
2. Run `npm run create-admin`
3. Configure admin permissions

### Adding New Business Category
1. Review [ADDING-NEW-CONTENT-GUIDE.md](./ADDING-NEW-CONTENT-GUIDE.md)
2. Update data files and routing
3. Test with development panel

### Deploying to Production
1. Follow [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
2. Set environment variables
3. Apply database migrations
4. Configure DNS and CDN

## 📞 Support & Troubleshooting

### Getting Help
1. **Check Documentation**: Review relevant guides in this folder
2. **Code Comments**: Examine inline documentation in source files
3. **Debug Tools**: Use browser dev tools and Supabase logs
4. **Test Environment**: Use development panel for testing

### Common Issues
- **Authentication Problems**: Check RLS policies and environment variables
- **Database Errors**: Verify migrations are applied correctly
- **Deployment Issues**: Review build logs and environment configuration
- **Subscription Errors**: Check Stripe webhook configuration

### Debug Commands
```bash
npm run test:supabase:detailed    # Detailed database testing
node scripts/debug-env.cjs        # Environment variable checking
```

---

📚 **For detailed information on any topic, refer to the specific guide files listed above.**