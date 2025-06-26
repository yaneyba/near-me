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
}