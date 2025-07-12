import { 
  IDataProvider, 
  Business, 
  ContactSubmission, 
  BusinessSubmission, 
  SubmissionResult, 
  UserEngagementEventDB, 
  BusinessAnalytics 
} from '../types';

/**
 * D1 Data Provider - Thin wrapper around specialized API endpoints
 * This provides a consistent interface while delegating to optimized endpoints
 */
export class D1DataProvider implements IDataProvider {
  private apiBaseUrl: string;

  constructor() {
    // Use API base URL from environment variable
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    
    if (!this.apiBaseUrl) {
      throw new Error('VITE_API_BASE_URL not configured in environment variables.');
    }
    
    // Ensure we use D1 mode when configured
    const useD1 = import.meta.env.VITE_USE_D1;
    console.log('D1DataProvider - VITE_USE_D1:', useD1, typeof useD1);
    console.log('D1DataProvider - API Base URL:', this.apiBaseUrl);
    
    if (useD1 !== 'true') {
      console.warn('VITE_USE_D1 is not enabled. D1DataProvider may not work correctly.');
    }
  }

  /**
   * Execute a D1 query via generic API (used for admin functions)
   * @deprecated Use specialized endpoints for better performance
   */
  private async executeQuery(sql: string, params: any[] = []): Promise<any> {
    try {
      const apiKey = import.meta.env.VITE_D1_API_KEY;
      
      if (!apiKey) {
        throw new Error('VITE_D1_API_KEY not configured in environment variables.');
      }
      
      const response = await fetch(`${this.apiBaseUrl}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ sql, params })
      });

      if (!response.ok) {
        throw new Error(`D1 query failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('D1 executeQuery error:', error);
      throw error;
    }
  }

  /**
   * Get businesses from D1 database via specialized businesses API endpoint
   */
  async getBusinesses(category: string, city: string): Promise<Business[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/api/businesses?category=${encodeURIComponent(category)}&city=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch businesses: ${response.statusText}`);
      }

      const businesses = await response.json();
      
      // The API now returns data that matches our Business interface exactly
      return businesses as Business[];
    } catch (error) {
      console.error('Failed to get businesses from API:', error);
      return [];
    }
  }

  /**
   * Get services for a category via specialized services API endpoint
   */
  async getServices(category: string): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/api/services?category=${encodeURIComponent(category)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`);
      }

      const services = await response.json();
      return services as string[];
    } catch (error) {
      console.error('Failed to get services from API:', error);
      return [];
    }
  }

  /**
   * Get neighborhoods for a city via specialized neighborhoods API endpoint
   */
  async getNeighborhoods(city: string): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/api/neighborhoods?city=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch neighborhoods: ${response.statusText}`);
      }

      const neighborhoods = await response.json();
      return neighborhoods as string[];
    } catch (error) {
      console.error('Failed to get neighborhoods from API:', error);
      return [];
    }
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    return [
      'nail-salons',
      'barbershops', 
      'auto-repair',
      'restaurants',
      'water-refill'
    ];
  }

  /**
   * Get all cities via direct database query
   */
  async getCities(): Promise<string[]> {
    try {
      const sql = `
        SELECT name 
        FROM cities 
        ORDER BY display_name ASC
      `;
      
      const result = await this.executeQuery(sql, []);
      return (result.data || []).map((row: any) => row.name);
    } catch (error) {
      console.error('Failed to get cities from API:', error);
      throw error;
    }
  }

  /**
   * Get city to state mapping from database
   */
  async getCityStateMap(): Promise<Record<string, string>> {
    try {
      const sql = `
        SELECT name, state 
        FROM cities 
        WHERE state IS NOT NULL
        ORDER BY name ASC
      `;
      
      const result = await this.executeQuery(sql, []);
      const cityStateMap: Record<string, string> = {};
      
      (result.data || []).forEach((row: any) => {
        cityStateMap[row.name] = row.state;
      });
      
      return cityStateMap;
    } catch (error) {
      console.error('Failed to get city-state mapping from API:', error);
      // Fallback to hardcoded values if database query fails
      return {
        'san-francisco': 'CA',
        'los-angeles': 'CA',
        'san-diego': 'CA',
        'san-jose': 'CA',
        'sacramento': 'CA',
        'phoenix': 'AZ',
        'las-vegas': 'NV',
        'denver': 'CO',
        'seattle': 'WA'
      };
    }
  }

  /**
   * Get known category-city combinations
   */
  async getKnownCombinations(): Promise<Array<{ category: string; city: string }>> {
    return [
      { category: 'nail-salons', city: 'san-francisco' },
      { category: 'nail-salons', city: 'los-angeles' },
      { category: 'barbershops', city: 'san-francisco' },
      { category: 'barbershops', city: 'los-angeles' },
      { category: 'auto-repair', city: 'san-francisco' },
      { category: 'auto-repair', city: 'los-angeles' },
      { category: 'restaurants', city: 'san-francisco' },
      { category: 'restaurants', city: 'los-angeles' },
      { category: 'water-refill', city: 'san-francisco' }
    ];
  }

  /**
   * Submit contact form via query endpoint
   */
  async submitContact(contactData: ContactSubmission): Promise<SubmissionResult> {
    try {
      const sql = `
        INSERT INTO contact_messages (
          name, email, phone, business_name, subject, message, 
          category, city, state, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'))
      `;
      
      await this.executeQuery(sql, [
        contactData.name,
        contactData.email,
        contactData.phone || null,
        contactData.businessName || null,
        contactData.subject,
        contactData.message,
        contactData.category,
        contactData.city,
        contactData.state
      ]);

      return {
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
        errors: []
      };
    } catch (error) {
      console.error('Failed to submit contact via API:', error);
      return {
        success: false,
        message: "An error occurred while submitting your message. Please try again later.",
        errors: ["SUBMISSION_ERROR"]
      };
    }
  }

  /**
   * Submit business application via query endpoint
   */
  async submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult> {
    try {
      const sql = `
        INSERT INTO business_submissions (
          business_name, owner_name, email, phone, website, category, 
          address, city, state, zip_code, description, 
          services, custom_services, hours, social_media,
          business_type, years_in_business, employee_count, special_offers,
          submission_date, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 'pending')
      `;
      
      await this.executeQuery(sql, [
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
      ]);

      return {
        success: true,
        message: "Thank you for your business submission! We'll review it and get back to you within 48 hours.",
        errors: []
      };
    } catch (error) {
      console.error('Failed to submit business via API:', error);
      return {
        success: false,
        message: "An error occurred while submitting your application. Please try again later.",
        errors: ["SUBMISSION_ERROR"]
      };
    }
  }

  /**
   * Track user engagement events via query endpoint
   */
  async trackEngagement(event: UserEngagementEventDB): Promise<void> {
    try {
      const sql = `
        INSERT INTO user_engagement_events (
          business_id, event_type, event_data, timestamp, user_agent, ip_address, session_id
        ) VALUES (?, ?, ?, datetime('now'), ?, ?, ?)
      `;
      
      await this.executeQuery(sql, [
        event.business_id,
        event.event_type,
        JSON.stringify(event.event_data || {}),
        event.user_agent,
        event.ip_address,
        event.session_id
      ]);
    } catch (error) {
      console.warn('Failed to track engagement via API:', error);
      // Don't throw error for tracking failures
    }
  }

  /**
   * Get business analytics from D1
   */
  async getBusinessAnalytics(
    _businessId: string,
    _period: "day" | "week" | "month" | "year",
    _startDate?: Date,
    _endDate?: Date
  ): Promise<BusinessAnalytics> {
    // For now, return mock analytics - can be implemented later
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return {
      businessId: _businessId,
      period: _period,
      startDate: _startDate || thirtyDaysAgo,
      endDate: _endDate || now,
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

  /**
   * Get overall analytics across all businesses
   */
  async getOverallAnalytics(
    _period: "day" | "week" | "month" | "year" = "week",
    _startDate?: Date,
    _endDate?: Date
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
    // For now, return mock analytics - can be implemented later
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

  // Admin methods - delegate to specialized admin endpoints
  async getBusinessSubmissions(): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/admin/business-submissions`);
      if (!response.ok) {
        throw new Error(`Business submissions API failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get business submissions from API:', error);
      return [];
    }
  }

  async getBusinessProfiles(): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/admin/business-profiles`);
      if (!response.ok) {
        throw new Error(`Business profiles API failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get business profiles from API:', error);
      return [];
    }
  }

  async getContactMessages(): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/admin/contact-messages`);
      if (!response.ok) {
        throw new Error(`Contact messages API failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get contact messages from API:', error);
      return [];
    }
  }

  async getAllBusinesses(): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/admin/businesses?type=all`);
      if (!response.ok) {
        throw new Error(`All businesses API failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get all businesses from API:', error);
      return [];
    }
  }

  async getAdminStats(): Promise<{
    pendingBusinesses: number;
    totalBusinesses: number;
    newMessages: number;
    totalUsers: number;
    premiumBusinesses: number;
  }> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/admin/stats`);
      if (!response.ok) {
        throw new Error(`Admin stats API failed: ${response.statusText}`);
      }
      const stats = await response.json();
      return {
        pendingBusinesses: stats.pendingBusinesses || 0,
        totalBusinesses: stats.totalBusinesses || 0,
        newMessages: stats.newMessages || 0,
        totalUsers: stats.totalUsers || 0,
        premiumBusinesses: stats.premiumBusinesses || 0
      };
    } catch (error) {
      console.error('Failed to get admin stats from API:', error);
      return {
        pendingBusinesses: 0,
        totalBusinesses: 0,
        newMessages: 0,
        totalUsers: 0,
        premiumBusinesses: 0
      };
    }
  }

  async approveBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/admin/business-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          submissionId: id,
          reviewerNotes
        })
      });

      if (!response.ok) {
        throw new Error(`Approve business submission API failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to approve business submission:', error);
      throw error;
    }
  }

  async rejectBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/admin/business-submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          submissionId: id,
          reviewerNotes
        })
      });

      if (!response.ok) {
        throw new Error(`Reject business submission API failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to reject business submission:', error);
      throw error;
    }
  }

  async resolveContactMessage(id: string, resolvedBy?: string, adminNotes?: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/admin/contact-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'resolve',
          messageId: id,
          resolvedBy,
          adminNotes
        })
      });

      if (!response.ok) {
        throw new Error(`Resolve contact message API failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to resolve contact message:', error);
      throw error;
    }
  }

  /**
   * Clear sample engagement data (optional method) - delegates to engagement endpoint
   */
  async clearSampleEngagementData(sampleDataIdentifier: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/admin/engagement`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'clear-sample',
          identifier: sampleDataIdentifier
        })
      });

      if (!response.ok) {
        throw new Error(`Clear engagement data API failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to clear sample engagement data via API:', error);
      throw error;
    }
  }
}
