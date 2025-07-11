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
    // Use current domain for API calls instead of hardcoded base URL
    // This ensures we don't have CORS issues with custom domains
    this.apiBaseUrl = window.location.origin;
    
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
