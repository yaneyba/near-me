import { IDataProvider, Business, ContactSubmission, BusinessSubmission, SubmissionResult, UserEngagementEvent, BusinessAnalytics } from '../types';
import { JsonDataProvider } from './JsonDataProvider';
import { SupabaseDataProvider } from './SupabaseDataProvider';

/**
 * Hybrid data provider that uses JSON for business data and Supabase for form submissions and tracking
 */
export class HybridDataProvider implements IDataProvider {
  private jsonProvider: JsonDataProvider;
  private supabaseProvider: SupabaseDataProvider;

  constructor() {
    this.jsonProvider = new JsonDataProvider();
    this.supabaseProvider = new SupabaseDataProvider();
  }

  // Use JSON provider for business data (fast, static)
  async getBusinesses(category: string, city: string): Promise<Business[]> {
    return this.jsonProvider.getBusinesses(category, city);
  }

  async getServices(category: string): Promise<string[]> {
    return this.jsonProvider.getServices(category);
  }

  async getNeighborhoods(city: string): Promise<string[]> {
    return this.jsonProvider.getNeighborhoods(city);
  }

  // Use Supabase for form submissions (persistent, real data)
  async submitContact(contactData: ContactSubmission): Promise<SubmissionResult> {
    return this.supabaseProvider.submitContact(contactData);
  }

  async submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult> {
    return this.supabaseProvider.submitBusiness(businessData);
  }

  // Use Supabase for engagement tracking (persistent analytics)
  async trackEngagement(event: UserEngagementEvent): Promise<void> {
    try {
      // Try Supabase first for persistent tracking
      await this.supabaseProvider.trackEngagement(event);
    } catch (error) {
      console.warn('Supabase tracking failed, falling back to JSON provider:', error);
      // Fallback to JSON provider for development
      await this.jsonProvider.trackEngagement(event);
    }
  }

  async getBusinessAnalytics(
    businessId: string, 
    period: 'day' | 'week' | 'month' | 'year',
    startDate?: Date,
    endDate?: Date
  ): Promise<BusinessAnalytics> {
    try {
      // Try Supabase first for persistent analytics
      return await this.supabaseProvider.getBusinessAnalytics(businessId, period, startDate, endDate);
    } catch (error) {
      console.warn('Supabase analytics failed, falling back to JSON provider:', error);
      // Fallback to JSON provider for development
      return await this.jsonProvider.getBusinessAnalytics(businessId, period, startDate, endDate);
    }
  }

  async getOverallAnalytics(
    period: 'day' | 'week' | 'month' | 'year' = 'week',
    startDate?: Date,
    endDate?: Date
  ): Promise<{
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
  }> {
    try {
      // Try Supabase first for real analytics from user_engagement_events
      return await this.supabaseProvider.getOverallAnalytics(period, startDate, endDate);
    } catch (error) {
      console.warn('Supabase overall analytics failed, falling back to JSON provider:', error);
      // Fallback to JSON provider for development
      return await this.jsonProvider.getOverallAnalytics(period, startDate, endDate);
    }
  }

  // Admin methods - delegate to Supabase provider
  async getBusinessSubmissions(): Promise<any[]> {
    return this.supabaseProvider.getBusinessSubmissions();
  }

  async getBusinessProfiles(): Promise<any[]> {
    return this.supabaseProvider.getBusinessProfiles();
  }

  async getContactMessages(): Promise<any[]> {
    return this.supabaseProvider.getContactMessages();
  }

  async getAllBusinesses(): Promise<any[]> {
    return this.supabaseProvider.getAllBusinesses();
  }

  async getAdminStats(): Promise<{
    pendingBusinesses: number;
    totalBusinesses: number;
    newMessages: number;
    totalUsers: number;
    premiumBusinesses: number;
  }> {
    return this.supabaseProvider.getAdminStats();
  }

  async approveBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    return this.supabaseProvider.approveBusinessSubmission(id, reviewerNotes);
  }

  async rejectBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    return this.supabaseProvider.rejectBusinessSubmission(id, reviewerNotes);
  }

  async resolveContactMessage(id: string, resolvedBy?: string, adminNotes?: string): Promise<void> {
    return this.supabaseProvider.resolveContactMessage(id, resolvedBy, adminNotes);
  }
}