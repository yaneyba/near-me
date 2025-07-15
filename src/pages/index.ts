// Auth pages
export * from './auth';

// Business pages
export * from './business';

// Admin pages
export * from './admin';

// Payment pages
export * from './payment';

// Info pages
export * from './info';

// Core pages
export * from './core';

// Water refill pages (with aliases to avoid naming conflicts)
export {
  HomePage as WaterRefillHomePage,
  StationsPage,
  DetailPage as WaterRefillDetailPage,
  AboutPage as WaterRefillAboutPage,
  ContactPage as WaterRefillContactPage,
  ForBusinessPage as WaterRefillForBusinessPage,
  PrivacyPolicyPage as WaterRefillPrivacyPolicyPage,
  TermsOfServicePage as WaterRefillTermsOfServicePage,
  SitemapPage as WaterRefillSitemapPage
} from './water-refill';

// Senior Care Pages
export {
  HomePage as SeniorCareHomePage
} from './senior-care';
