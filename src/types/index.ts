//src/types/index.ts

export interface Business {
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
  description: string;
  services: string[];
  neighborhood: string;
  hours: {
    [key: string]: string;
  };
  image: string;
  premium: boolean;
  bookingLinks?: string[]; // New field for premium businesses
  latitude?: number; // New field for premium businesses
  longitude?: number; // New field for premium businesses
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

// New tracking interfaces
export interface UserEngagementEvent {
  id?: string;
  businessId: string;
  businessName: string;
  eventType: 'view' | 'phone_click' | 'website_click' | 'booking_click' | 'directions_click' | 'email_click' | 'hours_view' | 'services_expand' | 'photo_view';
  eventData?: {
    source?: string; // 'search', 'category', 'premium', 'related'
    searchQuery?: string;
    clickedUrl?: string;
    userAgent?: string;
    referrer?: string;
    sessionId?: string;
    deviceType?: 'mobile' | 'tablet' | 'desktop';
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
  getBusinesses(category: string, city: string): Promise<Business[]>;
  getServices(category: string): Promise<string[]>;
  getNeighborhoods(city: string): Promise<string[]>;
  submitContact(contactData: ContactSubmission): Promise<SubmissionResult>;
  submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult>;
  // New tracking methods
  trackEngagement(event: UserEngagementEvent): Promise<void>;
  getBusinessAnalytics(businessId: string, period: 'day' | 'week' | 'month' | 'year', startDate?: Date, endDate?: Date): Promise<BusinessAnalytics>;
  // Admin methods
  getBusinessSubmissions(): Promise<any[]>;
  getBusinessProfiles(): Promise<any[]>;
  getContactMessages(): Promise<any[]>;
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
}

export interface SubdomainInfo {
  category: string;
  city: string;
  state: string;
}

// Stripe related interfaces
export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  price: number;
  mode: 'subscription' | 'payment';
  interval?: 'month' | 'year';
  currency?: string;
}

export interface StripeCheckoutResult {
  success: boolean;
  message: string;
  url?: string;
  error?: string;
}

export interface StripeSubscription {
  id: string;
  status: string;
  current_period_end: number;
  product: {
    name: string;
    description: string;
  };
  price: {
    unit_amount: number;
    currency: string;
    recurring?: {
      interval: string;
    };
  };
  created: number;
}