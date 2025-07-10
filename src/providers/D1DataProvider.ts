import { 
  IDataProvider, 
  Business, 
  ContactSubmission, 
  BusinessSubmission, 
  SubmissionResult, 
  UserEngagementEvent, 
  BusinessAnalytics 
} from '../types';

/**
 * D1 Data Provider - Thin wrapper around specialized API endpoints
 * This provides a consistent interface while delegating to optimized endpoints
 */
export class D1DataProvider implements IDataProvider {
  private apiBaseUrl: string;

  constructor() {
    // Get D1 configuration from environment
    this.apiBaseUrl = import.meta.env.VITE_D1_BASE_URL;
    
    if (!this.apiBaseUrl) {
      throw new Error('VITE_D1_BASE_URL not configured in environment variables.');
    }
    
    // Ensure we use D1 mode when configured
    const useD1 = import.meta.env.VITE_USE_D1;
    console.log('D1DataProvider - VITE_USE_D1:', useD1, typeof useD1);
    
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
        body: JSON.stringify({
          sql,
          params
        })
      });

      if (!response.ok) {
        throw new Error(`D1 Query failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(`D1 Error: ${result.error}`);
      }

      return result.data;
    } catch (error) {
      console.error('D1 Query Error:', error);
      throw error;
    }
  }

  /**
   * Get businesses from D1 database via specialized API endpoint
   */
  async getBusinesses(category: string, city: string): Promise<Business[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/businesses?category=${encodeURIComponent(category)}&city=${encodeURIComponent(city)}`);
      
      if (!response.ok) {
        throw new Error(`Businesses API failed: ${response.statusText}`);
      }

      const businesses = await response.json();
      return businesses; // The API already returns properly formatted Business objects
    } catch (error) {
      console.error('Failed to get businesses from API:', error);
      return [];
    }
  }

  /**
   * Get services for a category via specialized API endpoint
   */
  async getServices(category: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/services?category=${encodeURIComponent(category)}`);
      
      if (!response.ok) {
        throw new Error(`Services API failed: ${response.statusText}`);
      }

      const services = await response.json();
      return services; // The API already returns string array
    } catch (error) {
      console.error('Failed to get services from API:', error);
      return [];
    }
  }

  /**
   * Get neighborhoods for a city via specialized API endpoint
   */
  async getNeighborhoods(city: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/neighborhoods?city=${encodeURIComponent(city)}`);
      
      if (!response.ok) {
        throw new Error(`Neighborhoods API failed: ${response.statusText}`);
      }

      const neighborhoods = await response.json();
      return neighborhoods; // The API already returns string array
    } catch (error) {
      console.error('Failed to get neighborhoods from API:', error);
      return [];
    }
  }

  /**
   * Submit contact form via specialized API endpoint
   */
  async submitContact(contactData: ContactSubmission): Promise<SubmissionResult> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        throw new Error(`Contact API failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
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
   * Submit business application via specialized API endpoint
   */
  async submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/submit-business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(businessData)
      });

      if (!response.ok) {
        throw new Error(`Business submission API failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
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
   * Track user engagement events via specialized API endpoint
   */
  async trackEngagement(event: UserEngagementEvent): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/track-engagement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        console.warn(`Engagement tracking failed: ${response.statusText}`);
      }
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

  // Admin methods - delegate to D1 queries
  async getBusinessSubmissions(): Promise<any[]> {
    const sql = `
      SELECT * FROM business_submissions 
      ORDER BY created_at DESC
    `;
    
    try {
      return await this.executeQuery(sql);
    } catch (error) {
      console.error('Failed to get business submissions from D1:', error);
      return [];
    }
  }

  async getBusinessProfiles(): Promise<any[]> {
    const sql = `
      SELECT * FROM business_profiles 
      ORDER BY created_at DESC
    `;
    
    try {
      return await this.executeQuery(sql);
    } catch (error) {
      console.error('Failed to get business profiles from D1:', error);
      return [];
    }
  }

  async getContactMessages(): Promise<any[]> {
    const sql = `
      SELECT * FROM contact_messages 
      ORDER BY created_at DESC
    `;
    
    try {
      return await this.executeQuery(sql);
    } catch (error) {
      console.error('Failed to get contact messages from D1:', error);
      return [];
    }
  }

  async getAllBusinesses(): Promise<any[]> {
    const sql = `
      SELECT * FROM businesses 
      ORDER BY created_at DESC
    `;
    
    try {
      return await this.executeQuery(sql);
    } catch (error) {
      console.error('Failed to get all businesses from D1:', error);
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
      const [submissions, messages, businesses, profiles] = await Promise.all([
        this.executeQuery(`SELECT COUNT(*) as count FROM business_submissions WHERE status = 'pending'`),
        this.executeQuery(`SELECT COUNT(*) as count FROM contact_messages WHERE status = 'new'`),
        this.executeQuery(`SELECT COUNT(*) as count FROM businesses`),
        this.executeQuery(`SELECT COUNT(*) as count FROM business_profiles`)
      ]);

      return {
        pendingBusinesses: submissions[0]?.count || 0,
        totalBusinesses: businesses[0]?.count || 0,
        newMessages: messages[0]?.count || 0,
        totalUsers: profiles[0]?.count || 0,
        premiumBusinesses: 0 // TODO: Implement premium count
      };
    } catch (error) {
      console.error('Failed to get admin stats from D1:', error);
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
    const sql = `
      UPDATE business_submissions 
      SET status = 'approved', reviewed_at = datetime('now'), reviewer_notes = ?
      WHERE id = ?
    `;
    
    try {
      await this.executeQuery(sql, [reviewerNotes || null, id]);
    } catch (error) {
      console.error('Failed to approve business submission:', error);
      throw error;
    }
  }

  async rejectBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    const sql = `
      UPDATE business_submissions 
      SET status = 'rejected', reviewed_at = datetime('now'), reviewer_notes = ?
      WHERE id = ?
    `;
    
    try {
      await this.executeQuery(sql, [reviewerNotes || null, id]);
    } catch (error) {
      console.error('Failed to reject business submission:', error);
      throw error;
    }
  }

  async resolveContactMessage(id: string, resolvedBy?: string, adminNotes?: string): Promise<void> {
    const sql = `
      UPDATE contact_messages 
      SET status = 'resolved', resolved_at = datetime('now'), resolved_by = ?, admin_notes = ?
      WHERE id = ?
    `;
    
    try {
      await this.executeQuery(sql, [resolvedBy || null, adminNotes || null, id]);
    } catch (error) {
      console.error('Failed to resolve contact message:', error);
      throw error;
    }
  }

  /**
   * Clear sample engagement data (optional method)
   */
  async clearSampleEngagementData(sampleDataIdentifier: string): Promise<void> {
    const sql = `
      DELETE FROM user_engagement_events 
      WHERE event_data LIKE ?
    `;
    
    try {
      await this.executeQuery(sql, [`%${sampleDataIdentifier}%`]);
    } catch (error) {
      console.error('Failed to clear sample engagement data:', error);
      throw error;
    }
  }
}
