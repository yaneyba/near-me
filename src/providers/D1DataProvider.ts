import { 
  IDataProvider, 
  Business, 
  ContactSubmission, 
  BusinessSubmission, 
  SubmissionResult, 
  UserEngagementEventDB, 
  BusinessAnalytics 
} from '@/types';
import { ApiEndpoints, EndpointBuilder } from '@/config/endpoints';

/**
 * Optimized D1 Data Provider - Clean, efficient API wrapper
 * Focuses on consistency, error handling, and performance
 * 
 * ARCHITECTURE: Pure API client - all endpoints managed via ApiEndpoints enum
 * - No direct database queries (consistent API-first approach)
 * - Type-safe endpoint management with EndpointBuilder helpers
 * - Centralized error handling and response formatting
 * - Single source of truth for all data operations
 */
export class D1DataProvider implements IDataProvider {
  private readonly apiBaseUrl: string;
  private readonly apiKey: string;
  private readonly defaultHeaders: HeadersInit;

  constructor() {
    // In development, use empty string to make relative requests (proxy will handle routing)
    // In production, use the full API base URL
    this.apiBaseUrl = import.meta.env.DEV ? '' : this.getRequiredEnvVar('VITE_API_BASE_URL');
    this.apiKey = this.getRequiredEnvVar('VITE_D1_API_KEY');
    
    // Pre-configure headers
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };

    // Validate D1 mode
    if (import.meta.env.VITE_USE_D1 !== 'true') {
      console.warn('D1DataProvider: VITE_USE_D1 is not enabled');
    }
  }

  private getRequiredEnvVar(name: string): string {
    const value = import.meta.env[name];
    if (!value) {
      throw new Error(`Required environment variable ${name} is not configured`);
    }
    return value;
  }

  /**
   * Generic API request handler with consistent error handling
   */
  private async apiRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      // Check if we're on a subdomain - if so, use relative URLs to go through middleware proxy
      const hostname = window.location.hostname;
      const isSubdomain = hostname.includes('.near-me.us') && !hostname.startsWith('near-me.us');
      
      // In development mode or on subdomain, use relative URLs (proxy/middleware will handle routing)
      const url = (isSubdomain || import.meta.env.DEV) ? endpoint : `${this.apiBaseUrl}${endpoint}`;
      
      // Debug logging
      console.log(`D1DataProvider: hostname=${hostname}, isSubdomain=${isSubdomain}, isDev=${import.meta.env.DEV}, url=${url}`);
      
      const response = await fetch(url, {
        headers: this.defaultHeaders,
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`D1DataProvider API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // ==========================================
  // PUBLIC DIRECTORY METHODS
  // ==========================================

  // ==========================================
  // PUBLIC DIRECTORY METHODS
  // ==========================================

  async getBusinesses(category: string, city: string): Promise<Business[]> {
    return this.apiRequest<Business[]>(EndpointBuilder.businessesWithParams(category, city));
  }

  async getBusinessesByCategory(category: string): Promise<Business[]> {
    // Use the main businesses endpoint without city parameter to get ALL businesses in category
    return this.apiRequest<Business[]>(EndpointBuilder.businessesWithParams(category));
  }

  async getServices(category: string): Promise<string[]> {
    return this.apiRequest<string[]>(EndpointBuilder.servicesWithCategory(category));
  }

  async getNeighborhoods(city: string): Promise<string[]> {
    return this.apiRequest<string[]>(EndpointBuilder.neighborhoodsWithCity(city));
  }

  async getCategories(): Promise<string[]> {
    // Consider making this an API call if categories become dynamic
    return [
      'nail-salons',
      'barbershops', 
      'auto-repair',
      'restaurants',
      'water-refill',
      'hair-salons',
      'coffee-shops',
      'dentists',
      'lawyers',
      'plumbers',
      'electricians',
      'gyms'
    ];
  }

  async getCities(): Promise<string[]> {
    try {
      const cities = await this.apiRequest<Array<{ name: string }>>(ApiEndpoints.CITIES);
      return cities.map(city => city.name);
    } catch (error) {
      console.error('Failed to get cities:', error);
      return [];
    }
  }

  async getCityStateMap(): Promise<Record<string, string>> {
    try {
      const cities = await this.apiRequest<Array<{ name: string; state: string }>>(
        EndpointBuilder.citiesWithState(true)
      );
      
      const cityStateMap: Record<string, string> = {};
      cities.forEach(city => {
        cityStateMap[city.name] = city.state;
      });
      
      return cityStateMap;
    } catch (error) {
      console.warn('Failed to get city-state mapping, using fallback');
      return this.getFallbackCityStateMap();
    }
  }

  private getFallbackCityStateMap(): Record<string, string> {
    return {
      'san-francisco': 'CA',
      'los-angeles': 'CA',
      'san-diego': 'CA',
      'san-jose': 'CA',
      'sacramento': 'CA',
      'phoenix': 'AZ',
      'las-vegas': 'NV',
      'denver': 'CO',
      'seattle': 'WA',
      'chicago': 'IL',
      'dallas': 'TX',
      'austin': 'TX',
      'miami': 'FL',
      'atlanta': 'GA',
      'boston': 'MA'
    };
  }

  async getKnownCombinations(): Promise<Array<{ category: string; city: string }>> {
    // This could be an API call if combinations become dynamic
    const categories = ['nail-salons', 'barbershops', 'auto-repair', 'restaurants'];
    const cities = ['san-francisco', 'los-angeles', 'chicago', 'dallas', 'miami'];
    
    const combinations: Array<{ category: string; city: string }> = [];
    categories.forEach(category => {
      cities.forEach(city => {
        combinations.push({ category, city });
      });
    });
    
    return combinations;
  }

  async getBusinessById(id: string): Promise<Business | null> {
    try {
      const business = await this.apiRequest<Business>(EndpointBuilder.businessById(id));
      return business;
    } catch (error) {
      console.error(`Failed to get business by ID ${id}:`, error);
      return null;
    }
  }

  async getWaterStationById(stationId: string): Promise<Business | null> {
    try {
      const station = await this.apiRequest<Business>(EndpointBuilder.waterStationById(stationId));
      return station;
    } catch (error) {
      console.error(`Failed to get water station by ID ${stationId}:`, error);
      return null;
    }
  }

  // ==========================================
  // SUBMISSION METHODS
  // ==========================================

  async submitContact(contactData: ContactSubmission): Promise<SubmissionResult> {
    try {
      const result = await this.apiRequest<SubmissionResult>(ApiEndpoints.CONTACT, {
        method: 'POST',
        body: JSON.stringify(contactData)
      });
      return result;
    } catch (error) {
      console.error('Contact submission failed:', error);
      return {
        success: false,
        message: "An error occurred while submitting your message. Please try again later.",
        errors: ["SUBMISSION_ERROR"]
      };
    }
  }

  async submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult> {
    try {
      const result = await this.apiRequest<SubmissionResult>(ApiEndpoints.SUBMIT_BUSINESS, {
        method: 'POST',
        body: JSON.stringify(businessData)
      });
      return result;
    } catch (error) {
      console.error('Business submission failed:', error);
      return {
        success: false,
        message: "An error occurred while submitting your application. Please try again later.",
        errors: ["SUBMISSION_ERROR"]
      };
    }
  }

  // ==========================================
  // ANALYTICS & TRACKING
  // ==========================================

  async trackEngagement(event: UserEngagementEventDB): Promise<void> {
    try {
      await this.apiRequest(ApiEndpoints.TRACK_ENGAGEMENT, {
        method: 'POST',
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.warn('Failed to track engagement:', error);
      // Don't throw - tracking failures shouldn't break user experience
    }
  }

  async getBusinessAnalytics(
    businessId: string,
    period: "day" | "week" | "month" | "year",
    startDate?: Date,
    endDate?: Date
  ): Promise<BusinessAnalytics> {
    try {
      // TODO: Implement real analytics queries
      return this.getMockAnalytics(businessId, period, startDate, endDate);
    } catch (error) {
      console.error('Failed to get business analytics:', error);
      return this.getMockAnalytics(businessId, period, startDate, endDate);
    }
  }

  async getOverallAnalytics(
    _period: "day" | "week" | "month" | "year" = "week",
    _startDate?: Date,
    _endDate?: Date
  ): Promise<any> {
    try {
      // TODO: Implement real overall analytics
      return this.getMockOverallAnalytics();
    } catch (error) {
      console.error('Failed to get overall analytics:', error);
      return this.getMockOverallAnalytics();
    }
  }

  // ==========================================
  // ADMIN METHODS (Specialized Endpoints)
  // ==========================================

  async getBusinessSubmissions(): Promise<any[]> {
    return this.apiRequest<any[]>(ApiEndpoints.ADMIN_BUSINESS_SUBMISSIONS);
  }

  async getBusinessProfiles(): Promise<any[]> {
    return this.apiRequest<any[]>(ApiEndpoints.ADMIN_BUSINESS_PROFILES);
  }

  async getContactMessages(): Promise<any[]> {
    return this.apiRequest<any[]>(ApiEndpoints.ADMIN_CONTACT_MESSAGES);
  }

  async getAllBusinesses(): Promise<any[]> {
    return this.apiRequest<any[]>(EndpointBuilder.adminBusinessesWithType('all'));
  }

  async getAdminStats(): Promise<{
    pendingBusinesses: number;
    totalBusinesses: number;
    newMessages: number;
    totalUsers: number;
    premiumBusinesses: number;
  }> {
    const stats = await this.apiRequest<any>(ApiEndpoints.ADMIN_STATS);
    return {
      pendingBusinesses: stats.pendingBusinesses || 0,
      totalBusinesses: stats.totalBusinesses || 0,
      newMessages: stats.newMessages || 0,
      totalUsers: stats.totalUsers || 0,
      premiumBusinesses: stats.premiumBusinesses || 0
    };
  }

  async approveBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    await this.apiRequest(ApiEndpoints.ADMIN_BUSINESS_SUBMISSIONS, {
      method: 'POST',
      body: JSON.stringify({
        action: 'approve',
        submissionId: id,
        reviewerNotes
      })
    });
  }

  async rejectBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    await this.apiRequest(ApiEndpoints.ADMIN_BUSINESS_SUBMISSIONS, {
      method: 'POST',
      body: JSON.stringify({
        action: 'reject',
        submissionId: id,
        reviewerNotes
      })
    });
  }

  async resolveContactMessage(id: string, resolvedBy?: string, adminNotes?: string): Promise<void> {
    await this.apiRequest(ApiEndpoints.ADMIN_CONTACT_MESSAGES, {
      method: 'POST',
      body: JSON.stringify({
        action: 'resolve',
        messageId: id,
        resolvedBy,
        adminNotes
      })
    });
  }

  async clearSampleEngagementData(sampleDataIdentifier: string): Promise<void> {
    await this.apiRequest(ApiEndpoints.ADMIN_ENGAGEMENT, {
      method: 'DELETE',
      body: JSON.stringify({
        action: 'clear-sample',
        identifier: sampleDataIdentifier
      })
    });
  }

  // ==========================================
  // FALLBACK AND STATISTICS METHODS
  // ==========================================

  async getFallbackCategories(): Promise<string[]> {
    // Return static fallback categories if API fails
    return [
      'nail-salons',
      'barbershops', 
      'auto-repair',
      'restaurants',
      'water-refill',
      'hair-salons',
      'coffee-shops',
      'dentists',
      'lawyers',
      'plumbers',
      'electricians',
      'gyms'
    ];
  }

  async getFallbackCities(): Promise<string[]> {
    // Return static fallback cities if API fails
    return [
      'san-francisco',
      'los-angeles',
      'san-diego',
      'san-jose',
      'sacramento',
      'phoenix',
      'las-vegas',
      'denver',
      'seattle',
      'chicago',
      'dallas',
      'austin',
      'miami',
      'atlanta',
      'boston'
    ];
  }

  async getStatistics(): Promise<{
    totalBusinesses: number;
    totalCategories: number;
    totalCities: number;
    premiumBusinesses: number;
    averageRating: string;
  }> {
    try {
      // Try to get real statistics from API
      const stats = await this.apiRequest<any>(ApiEndpoints.ADMIN_STATS);
      return {
        totalBusinesses: stats.totalBusinesses || 0,
        totalCategories: stats.totalCategories || 12,
        totalCities: stats.totalCities || 15,
        premiumBusinesses: stats.premiumBusinesses || 0,
        averageRating: stats.averageRating || '4.8'
      };
    } catch (error) {
      console.warn('Failed to get statistics, using fallback:', error);
      // Return fallback statistics
      return {
        totalBusinesses: 0,
        totalCategories: 12,
        totalCities: 15,
        premiumBusinesses: 0,
        averageRating: '4.8'
      };
    }
  }

  // ==========================================
  // PRIVATE HELPER METHODS
  // ==========================================

  private getMockAnalytics(
    businessId: string,
    period: "day" | "week" | "month" | "year",
    startDate?: Date,
    endDate?: Date
  ): BusinessAnalytics {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return {
      businessId,
      period,
      startDate: startDate || thirtyDaysAgo,
      endDate: endDate || now,
      metrics: {
        totalViews: 0,
        uniqueViews: 0,
        phoneClicks: 0,
        websiteClicks: 0,
        bookingClicks: 0,
        directionsClicks: 0,
        emailClicks: 0,
        hoursViews: 0,
        servicesExpands: 0,
        photoViews: 0,
        conversionRate: 0,
        engagementRate: 0
      },
      topSources: [],
      topSearchQueries: [],
      deviceBreakdown: { mobile: 0, tablet: 0, desktop: 0 },
      hourlyDistribution: []
    };
  }

  private getMockOverallAnalytics() {
    return {
      totalClickEvents: 0,
      totalUniqueVisitors: 0,
      averageConversionRate: 0,
      activeBusinesses: 0,
      topPerformingBusinesses: [],
      categoryBreakdown: [],
      deviceBreakdown: { mobile: 0, tablet: 0, desktop: 0 },
      clickTypeBreakdown: { phone: 0, website: 0, booking: 0, directions: 0, email: 0 },
      peakHours: []
    };
  }
}