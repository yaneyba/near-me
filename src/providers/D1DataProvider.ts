import { 
  IDataProvider, 
  Business, 
  ContactSubmission, 
  BusinessSubmission, 
  SubmissionResult, 
  UserEngagementEventDB, 
  BusinessAnalytics 
} from '@/types';

/**
 * Optimized D1 Data Provider - Clean, efficient API wrapper
 * Focuses on consistency, error handling, and performance
 */
export class D1DataProvider implements IDataProvider {
  private readonly apiBaseUrl: string;
  private readonly apiKey: string;
  private readonly defaultHeaders: HeadersInit;

  constructor() {
    // Validate environment variables upfront
    this.apiBaseUrl = this.getRequiredEnvVar('VITE_API_BASE_URL');
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
      const url = `${this.apiBaseUrl}${endpoint}`;
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

  /**
   * SQL query execution for admin/complex operations
   */
  private async executeQuery<T>(sql: string, params: any[] = []): Promise<T> {
    return this.apiRequest<T>('/api/query', {
      method: 'POST',
      body: JSON.stringify({ sql, params })
    });
  }

  // ==========================================
  // PUBLIC DIRECTORY METHODS
  // ==========================================

  async getBusinesses(category: string, city: string): Promise<Business[]> {
    const params = new URLSearchParams({ category, city });
    return this.apiRequest<Business[]>(`/api/businesses?${params}`);
  }

  async getServices(category: string): Promise<string[]> {
    const params = new URLSearchParams({ category });
    return this.apiRequest<string[]>(`/api/services?${params}`);
  }

  async getNeighborhoods(city: string): Promise<string[]> {
    const params = new URLSearchParams({ city });
    return this.apiRequest<string[]>(`/api/neighborhoods?${params}`);
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
    const result = await this.executeQuery<{ data: Array<{ name: string }> }>(
      'SELECT name FROM cities ORDER BY display_name ASC'
    );
    return result.data?.map(row => row.name) || [];
  }

  async getCityStateMap(): Promise<Record<string, string>> {
    try {
      const result = await this.executeQuery<{ data: Array<{ name: string; state: string }> }>(
        'SELECT name, state FROM cities WHERE state IS NOT NULL ORDER BY name ASC'
      );
      
      const cityStateMap: Record<string, string> = {};
      result.data?.forEach(row => {
        cityStateMap[row.name] = row.state;
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
      const business = await this.apiRequest<Business>(`/api/business/${id}`);
      return business;
    } catch (error) {
      console.error(`Failed to get business by ID ${id}:`, error);
      return null;
    }
  }

  async getWaterStationById(stationId: string): Promise<Business | null> {
    try {
      const station = await this.apiRequest<Business>(`/api/water-stations/${stationId}`);
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
      await this.executeQuery(
        `INSERT INTO contact_messages (
          name, email, phone, business_name, subject, message, 
          category, city, state, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'))`,
        [
          contactData.name,
          contactData.email,
          contactData.phone || null,
          contactData.businessName || null,
          contactData.subject,
          contactData.message,
          contactData.category,
          contactData.city,
          contactData.state
        ]
      );

      return {
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
        errors: []
      };
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
      await this.executeQuery(
        `INSERT INTO business_submissions (
          business_name, owner_name, email, phone, website, category, 
          address, city, state, zip_code, description, 
          services, custom_services, hours, social_media,
          business_type, years_in_business, employee_count, special_offers,
          submission_date, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 'pending')`,
        [
          businessData.businessName,
          businessData.ownerName,
          businessData.email,
          businessData.phone,
          businessData.website || null,
          businessData.category,
          businessData.address,
          businessData.city,
          businessData.state,
          businessData.zipCode,
          businessData.description,
          JSON.stringify(businessData.services),
          JSON.stringify(businessData.customServices),
          JSON.stringify(businessData.hours),
          JSON.stringify(businessData.socialMedia),
          businessData.businessType,
          businessData.yearsInBusiness,
          businessData.employeeCount,
          businessData.specialOffers
        ]
      );

      return {
        success: true,
        message: "Thank you for your business submission! We'll review it and get back to you within 48 hours.",
        errors: []
      };
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
      await this.executeQuery(
        `INSERT INTO user_engagement_events (
          business_id, event_type, event_data, timestamp, user_agent, ip_address, session_id
        ) VALUES (?, ?, ?, datetime('now'), ?, ?, ?)`,
        [
          event.business_id,
          event.event_type,
          JSON.stringify(event.event_data || {}),
          event.user_agent,
          event.ip_address,
          event.session_id
        ]
      );
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
    period: "day" | "week" | "month" | "year" = "week",
    startDate?: Date,
    endDate?: Date
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
    return this.apiRequest<any[]>('/api/admin/business-submissions');
  }

  async getBusinessProfiles(): Promise<any[]> {
    return this.apiRequest<any[]>('/api/admin/business-profiles');
  }

  async getContactMessages(): Promise<any[]> {
    return this.apiRequest<any[]>('/api/admin/contact-messages');
  }

  async getAllBusinesses(): Promise<any[]> {
    return this.apiRequest<any[]>('/api/admin/businesses?type=all');
  }

  async getAdminStats(): Promise<{
    pendingBusinesses: number;
    totalBusinesses: number;
    newMessages: number;
    totalUsers: number;
    premiumBusinesses: number;
  }> {
    const stats = await this.apiRequest<any>('/api/admin/stats');
    return {
      pendingBusinesses: stats.pendingBusinesses || 0,
      totalBusinesses: stats.totalBusinesses || 0,
      newMessages: stats.newMessages || 0,
      totalUsers: stats.totalUsers || 0,
      premiumBusinesses: stats.premiumBusinesses || 0
    };
  }

  async approveBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    await this.apiRequest('/api/admin/business-submissions', {
      method: 'POST',
      body: JSON.stringify({
        action: 'approve',
        submissionId: id,
        reviewerNotes
      })
    });
  }

  async rejectBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    await this.apiRequest('/api/admin/business-submissions', {
      method: 'POST',
      body: JSON.stringify({
        action: 'reject',
        submissionId: id,
        reviewerNotes
      })
    });
  }

  async resolveContactMessage(id: string, resolvedBy?: string, adminNotes?: string): Promise<void> {
    await this.apiRequest('/api/admin/contact-messages', {
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
    await this.apiRequest('/api/admin/engagement', {
      method: 'DELETE',
      body: JSON.stringify({
        action: 'clear-sample',
        identifier: sampleDataIdentifier
      })
    });
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