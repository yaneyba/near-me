//src/types/index.ts

/**
 * NEAR-ME PLATFORM TYPE DEFINITIONS
 * 
 * This file serves as the Single Source of Truth (SST) for all TypeScript types
 * used in the Near-Me platform. All types MUST match the database schema 
 * documented in docs/DATABASE-ENTITIES.md
 * 
 * Structure:
 * 1. Database Entities (Primary) - Match production database schema exactly
 * 2. Legacy Interfaces - For backward compatibility during refactoring
 * 3. Utility Types - Type guards, transformers, filters
 * 4. Configuration Types - For scaling system and subdomain management
 * 5. Application-specific Types - Business logic, analytics, etc.
 * 
 * Last updated: 2025-07-11
 * Database schema version: Based on nearme-db production schema
 */

/**
 * DATABASE ENTITIES - Single Source of Truth
 * These types MUST match the database schema in docs/DATABASE-ENTITIES.md
 * Last updated: 2025-07-11
 */

// JSON Data Structure (matches businesses.json file)
export interface BusinessData {
  id: string;                           // Business identifier from JSON
  name: string;                         // Business name
  category: string;                     // Business category (e.g., "auto-repair")
  city: string;                         // City slug (e.g., "denver")
  state: string;                        // Full state name (e.g., "Colorado")
  address: string;                      // Full street address
  phone: string;                        // Contact phone number
  website?: string | null;              // Business website URL
  rating: number;                       // Average rating (0.0-5.0)
  reviewCount: number;                  // Number of reviews (camelCase in JSON)
  description?: string | null;          // Business description
  services: string[];                   // Array of services offered
  neighborhood?: string | null;         // Neighborhood name
  hours?: Record<string, string>;       // Operating hours object
  image?: string | null;                // Primary image URL
  logo?: string | null;                 // Business logo URL
  verified?: boolean;                   // Verification status
  premium?: boolean;                    // Premium listing status
  established?: number | null;          // Year established
  parking?: string[] | null;            // Parking options
  amenities?: string[] | null;          // Available amenities
  bookingLinks?: string[] | null;       // Online booking links
}

// Core Business Entity (matches businesses table)
export interface Business {
  id: string;                           // Primary key (e.g., "auto-repair-denver-03")
  business_id: string;                  // Unique business identifier
  name: string;                         // Business name
  description?: string | null;          // Business description
  address?: string | null;              // Full street address
  city?: string | null;                 // City slug (e.g., "san-francisco")
  state?: string | null;                // State name
  zip_code?: string | null;             // ZIP/postal code
  phone?: string | null;                // Contact phone number
  email?: string | null;                // Business email
  website?: string | null;              // Business website URL
  category?: string | null;             // Business category (e.g., "nail-salons")
  services?: string[];                  // JSON array of services offered
  hours?: Record<string, string>;       // JSON object of operating hours
  rating?: number;                      // Average rating (0.0-5.0)
  review_count?: number;                // Number of reviews
  image?: string | null;                // Primary image path/URL
  logo_url?: string | null;             // Business logo URL
  established?: number | null;          // Year established
  verified?: boolean;                   // Verification status (0/1 in DB)
  premium?: boolean;                    // Premium listing status (0/1 in DB)
  status?: string;                      // Business status ('active', 'inactive')
  site_id?: string | null;              // Site/subdomain identifier
  latitude?: number | null;             // GPS latitude
  longitude?: number | null;            // GPS longitude
  created_at?: string;                  // Creation timestamp
  updated_at?: string;                  // Last update timestamp
}

// Business Submission Entity (matches business_submissions table)
export interface BusinessSubmissionDB {
  id: string;                           // Primary key
  business_name: string;                // Name of the business
  owner_name: string;                   // Business owner's name
  email: string;                        // Contact email
  phone: string;                        // Contact phone
  address: string;                      // Business address
  city: string;                         // City
  state: string;                        // State
  zip_code: string;                     // ZIP code
  category: string;                     // Business category
  website?: string | null;              // Website (optional)
  description?: string | null;          // Business description
  services?: string[];                  // JSON array of services
  hours?: Record<string, string>;       // JSON object of hours
  status: 'pending' | 'approved' | 'rejected'; // Submission status
  submitted_at?: string;                // Submission timestamp
  reviewed_at?: string | null;          // When admin reviewed
  reviewer_notes?: string | null;       // Admin notes
  site_id: string;                      // Originating site
  created_at?: string;                  // Creation timestamp
  updated_at?: string;                  // Last update timestamp
}

// Business Profile Entity (matches business_profiles table)
export interface BusinessProfile {
  id: string;                           // Primary key
  user_id?: string | null;              // Associated user account
  business_id?: string | null;          // Reference to businesses table
  business_name: string;                // Business name
  email: string;                        // Business email
  phone?: string | null;                // Phone number
  address?: string | null;              // Address
  city?: string | null;                 // City
  state?: string | null;                // State
  zip_code?: string | null;             // ZIP code
  category?: string | null;             // Category
  website?: string | null;              // Website
  description?: string | null;          // Description
  services?: string[];                  // JSON array of services
  hours?: Record<string, string>;       // JSON object of hours
  role: string;                         // User role (default: 'owner')
  subscription_status: string;          // Subscription status
  stripe_customer_id?: string | null;   // Stripe integration
  stripe_subscription_id?: string | null;
  stripe_price_id?: string | null;
  premium?: boolean;                    // Premium status (0/1 in DB)
  subscription_start_date?: string | null;
  subscription_end_date?: string | null;
  trial_end_date?: string | null;
  site_id?: string | null;              // Site identifier
  created_at?: string;                  // Creation timestamp
  updated_at?: string;                  // Last update timestamp
}

// Contact Message Entity (matches contact_messages table)
export interface ContactMessage {
  id: string;                           // Primary key
  name: string;                         // Customer name
  email: string;                        // Customer email
  subject: string;                      // Message subject
  message: string;                      // Message content
  category?: string | null;             // Related category (optional)
  city?: string | null;                 // Related city (optional)
  status: 'new' | 'in_progress' | 'resolved'; // Message status
  admin_notes?: string | null;          // Internal admin notes
  resolved_at?: string | null;          // Resolution timestamp
  resolved_by?: string | null;          // Admin who resolved
  created_at?: string;                  // Creation timestamp
  updated_at?: string;                  // Last update timestamp
}

// User Engagement Event Entity (matches user_engagement_events table)
export interface UserEngagementEventDB {
  id: string;                           // Primary key
  business_id?: string | null;          // Reference to businesses table
  event_type: string;                   // Event type ('view', 'click', 'call', etc.)
  event_data?: Record<string, any>;     // JSON object with additional data
  timestamp?: string;                   // Event timestamp
  user_agent?: string | null;           // Browser/device info
  ip_address?: string | null;           // User IP (anonymized)
  session_id?: string | null;           // Session identifier
}

// Stripe Order Entity (matches stripe_orders table)
export interface StripeOrder {
  id: string;                           // Primary key
  business_profile_id?: string | null;  // Reference to business_profiles
  stripe_session_id: string;            // Stripe checkout session (unique)
  stripe_payment_intent_id?: string | null; // Stripe payment intent
  amount: number;                       // Amount in cents
  currency: string;                     // Currency code (default: 'usd')
  status: string;                       // Payment status (default: 'pending')
  metadata?: Record<string, any>;       // JSON metadata
  created_at?: string;                  // Creation timestamp
  updated_at?: string;                  // Last update timestamp
}

// Admin Settings Entity (matches admin_settings table)
export interface AdminSetting {
  id: string;                           // Primary key
  setting_key: string;                  // Setting identifier (unique)
  setting_value: any;                   // JSON value
  description?: string | null;          // Setting description
  created_at?: string;                  // Creation timestamp
  updated_at?: string;                  // Last update timestamp
}

// Neighborhood Entity (matches neighborhoods table)
export interface Neighborhood {
  id: string;                           // Primary key
  city: string;                         // City identifier
  neighborhood_name: string;            // Neighborhood name
  created_at?: string;                  // Creation timestamp
  updated_at?: string;                  // Last update timestamp
}

// Service Entity (matches services table)
export interface Service {
  id: string;                           // Primary key
  category: string;                     // Business category
  service: string;                      // Service name
  created_at?: string;                  // Creation timestamp
  updated_at?: string;                  // Last update timestamp
}

// Legacy interface for backward compatibility
export interface LegacyBusiness {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  website?: string | null;
  rating: number;
  reviewCount: number;
  description: string | null;
  services: string[];
  neighborhood?: string | null;
  hours: {
    [key: string]: string;
  };
  image: string;
  premium: boolean;
  bookingLinks?: string[];
  latitude?: number;
  longitude?: number;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: string;
  businessName?: string;
  preferredContact: string;
  urgency: string;
  category: string;
  city: string;
  state: string;
  submittedAt: Date;
}

// Legacy Business Submission interface for backward compatibility
export interface BusinessSubmission {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  category: string;
  website?: string;
  description: string;
  services: string[];
  customServices: string[];
  hours: {
    [key: string]: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  businessType: 'individual' | 'franchise' | 'chain';
  yearsInBusiness: string;
  employeeCount: string;
  specialOffers: string;
  submittedAt: Date;
}

export interface SubmissionResult {
  success: boolean;
  message: string;
  submissionId?: string;
  errors?: string[];
}

// Legacy tracking interface - use UserEngagementEventDB for new code
export interface UserEngagementEvent {
  id?: string;
  businessId: string;
  businessName: string;
  eventType: 'view' | 'phone_click' | 'website_click' | 'booking_click' | 'directions_click' | 'email_click' | 'hours_view' | 'services_expand' | 'photo_view';
  eventData?: {
    source?: string;
    searchQuery?: string;
    clickedUrl?: string;
    userAgent?: string;
    referrer?: string;
    sessionId?: string;
    deviceType?: 'mobile' | 'tablet' | 'desktop';
    sampleDataId?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
  timestamp: Date;
  ipAddress?: string;
  userSessionId: string;
}

export interface BusinessAnalytics {
  businessId: string;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
  metrics: {
    totalViews: number;
    uniqueViews: number;
    phoneClicks: number;
    websiteClicks: number;
    bookingClicks: number;
    directionsClicks: number;
    emailClicks: number;
    hoursViews: number;
    servicesExpands: number;
    photoViews: number;
    conversionRate: number; // (phone + booking + website clicks) / views
    engagementRate: number; // total interactions / views
  };
  topSources: Array<{
    source: string;
    views: number;
    percentage: number;
  }>;
  topSearchQueries: Array<{
    query: string;
    views: number;
    clicks: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  hourlyDistribution: Array<{
    hour: number;
    views: number;
    interactions: number;
  }>;
}

export interface IDataProvider {
  // Core business operations (using database-accurate types)
  getBusinesses(category: string, city: string): Promise<Business[]>;
  getServices(category: string): Promise<string[]>;
  getNeighborhoods(city: string): Promise<string[]>;
  
  // Form submissions (legacy compatibility)
  submitContact(contactData: ContactSubmission): Promise<SubmissionResult>;
  submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult>;
  
  // Tracking methods (use database-accurate types)
  trackEngagement(event: UserEngagementEventDB): Promise<void>;
  getBusinessAnalytics(businessId: string, period: 'day' | 'week' | 'month' | 'year', startDate?: Date, endDate?: Date): Promise<BusinessAnalytics>;
  
  // Overall analytics method
  getOverallAnalytics(period?: 'day' | 'week' | 'month' | 'year', startDate?: Date, endDate?: Date): Promise<{
    totalClickEvents: number;
    totalUniqueVisitors: number;
    averageConversionRate: number;
    activeBusinesses: number;
    topPerformingBusinesses: Array<{
      businessId: string;
      businessName: string;
      totalClicks: number;
      phoneClicks: number;
      websiteClicks: number;
      bookingClicks: number;
      conversionRate: number;
    }>;
    categoryBreakdown: Array<{
      category: string;
      totalClicks: number;
      uniqueVisitors: number;
      businesses: number;
    }>;
    deviceBreakdown: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
    clickTypeBreakdown: {
      phone: number;
      website: number;
      booking: number;
      directions: number;
      email: number;
    };
    peakHours: Array<{
      hour: number;
      totalClicks: number;
    }>;
  }>;
  
  // Admin methods (using database-accurate types)
  getBusinessSubmissions(): Promise<BusinessSubmissionDB[]>;
  getBusinessProfiles(): Promise<BusinessProfile[]>;
  getContactMessages(): Promise<ContactMessage[]>;
  getAllBusinesses(): Promise<Business[]>;
  getAdminStats(): Promise<{
    pendingBusinesses: number;
    totalBusinesses: number;
    newMessages: number;
    totalUsers: number;
    premiumBusinesses: number;
  }>;
  approveBusinessSubmission(id: string, reviewerNotes?: string): Promise<void>;
  rejectBusinessSubmission(id: string, reviewerNotes?: string): Promise<void>;
  resolveContactMessage(id: string, resolvedBy?: string, adminNotes?: string): Promise<void>;
  
  // Sample data management
  clearSampleEngagementData?(sampleDataIdentifier: string): Promise<void>;
}

/**
 * UTILITY TYPES AND TRANSFORMERS
 * For converting between database entities and legacy interfaces
 */

// Database to Legacy transformers
export type BusinessToLegacy = (business: Business) => LegacyBusiness;
export type LegacyToBusiness = (legacy: LegacyBusiness) => Business;

// Type guards for runtime type checking
export function isBusinessDB(obj: any): obj is Business {
  return obj && typeof obj.id === 'string' && typeof obj.business_id === 'string';
}

export function isBusinessSubmissionDB(obj: any): obj is BusinessSubmissionDB {
  return obj && typeof obj.id === 'string' && typeof obj.business_name === 'string';
}

export function isContactMessageDB(obj: any): obj is ContactMessage {
  return obj && typeof obj.id === 'string' && typeof obj.name === 'string' && typeof obj.email === 'string';
}

// Database entity creation helpers
export type CreateBusiness = Omit<Business, 'id' | 'created_at' | 'updated_at'>;
export type UpdateBusiness = Partial<Omit<Business, 'id' | 'created_at' | 'updated_at'>>;

export type CreateBusinessSubmission = Omit<BusinessSubmissionDB, 'id' | 'created_at' | 'updated_at' | 'submitted_at' | 'reviewed_at'>;
export type UpdateBusinessSubmission = Partial<Omit<BusinessSubmissionDB, 'id' | 'created_at' | 'updated_at'>>;

export type CreateContactMessage = Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>;
export type UpdateContactMessage = Partial<Omit<ContactMessage, 'id' | 'created_at' | 'updated_at'>>;

export type CreateUserEngagementEvent = Omit<UserEngagementEventDB, 'id' | 'timestamp'>;

// Database query filters
export interface BusinessFilters {
  category?: string;
  city?: string;
  state?: string;
  status?: string;
  verified?: boolean;
  premium?: boolean;
  site_id?: string;
}

export interface BusinessSubmissionFilters {
  status?: 'pending' | 'approved' | 'rejected';
  category?: string;
  city?: string;
  site_id?: string;
  submitted_after?: string;
  submitted_before?: string;
}

export interface ContactMessageFilters {
  status?: 'new' | 'in_progress' | 'resolved';
  category?: string;
  city?: string;
  created_after?: string;
  created_before?: string;
}

// Migration and scaling types
export interface MigrationRecord {
  id: string;
  filename: string;
  category: string;
  city: string;
  business_count: number;
  status: 'pending' | 'applied' | 'failed';
  created_at: string;
  applied_at?: string | null;
  rollback_info?: string | null;
}

export interface CategoryConfig {
  slug: string;
  name: string;
  description: string;
  keywords: string[];
  icon: string;
  color: string;
  enabled: boolean;
}

export interface CityConfig {
  slug: string;
  name: string;
  state: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timezone: string;
  population: number;
  enabled: boolean;
}

export interface SubdomainConfig {
  subdomain: string;
  category: string;
  city: string | null;
  enabled: boolean;
  title: string;
  description: string;
  keywords: string[];
  created: string;
}

// Subdomain parsing result interface
export interface SubdomainInfo {
  category: string;                     // Display category name
  city: string;                         // Display city name  
  state: string;                        // Display state name
  rawCategory?: string;                 // Raw category from URL (kebab-case)
  rawCity?: string;                     // Raw city from URL (kebab-case)
  isServices?: boolean;                 // Is this the services homepage
  isWaterRefill?: boolean;              // Is this a water refill subdomain
  isPathBased?: boolean;                // Uses path-based routing instead of subdomain
}

// Configuration Types - For scaling system and subdomain management

// Stripe Types
export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  price: number;
  mode: 'subscription' | 'payment';
  interval?: 'month' | 'year';
  currency: string;
}

export interface StripeSubscription {
  id: string;
  status: string;
  current_period_end: number;
  current_period_start: number;
  product: StripeProduct;
  cancel_at_period_end: boolean;
  created: number;
  price: {
    unit_amount: number;
    currency: string;
    recurring?: {
      interval: string;
    };
  };
}

export interface StripeCheckoutResult {
  success: boolean;
  message?: string;
  error?: string;
  sessionId?: string;
  url?: string;
}