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
 * D1 Data Provider - Uses Cloudflare D1 database for all operations
 * This replaces Supabase as the primary data source
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
   * Execute a D1 query via Cloudflare Pages Function
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
   * Get businesses from D1 database
   */
  async getBusinesses(category: string, city: string): Promise<Business[]> {
    try {
      const sql = `
        SELECT 
          id, business_id, name, category,
          description, phone, website, address,
          city, state, zip_code, 
          image, logo_url, hours,
          verified, premium, created_at, updated_at,
          rating, review_count, established, status
        FROM businesses 
        WHERE LOWER(category) = LOWER(?) 
        AND LOWER(city) = LOWER(?)
        ORDER BY 
          premium DESC,
          verified DESC,
          name ASC
      `;

      const businesses = await this.executeQuery(sql, [category, city]);
      
      const mappedBusinesses = businesses.map((row: any) => ({
        id: row.id,
        business_id: row.business_id || row.id,
        name: row.name,
        description: row.description,
        address: row.address,
        city: row.city,
        state: row.state,
        zipCode: row.zip_code,
        phone: row.phone,
        email: row.email || '',
        website: row.website,
        category: row.category,
        services: row.services ? JSON.parse(row.services) : [],
        hours: row.hours ? JSON.parse(row.hours) : {},
        rating: row.rating || 0,
        reviewCount: row.review_count || 0,
        image: row.image,
        logoUrl: row.logo_url,
        established: row.established,
        verified: Boolean(row.verified),
        premium: Boolean(row.premium),
        status: 'active'
      }));
      
      return mappedBusinesses;
    } catch (error) {
      console.error('Failed to get businesses from D1:', error);
      return [];
    }
  }

  /**
   * Get services for a category from D1
   */
  async getServices(category: string): Promise<string[]> {
    try {
      const sql = `
        SELECT DISTINCT service 
        FROM services 
        WHERE LOWER(category) = LOWER(?)
        ORDER BY service ASC
      `;

      const services = await this.executeQuery(sql, [category]);
      return services.map((row: any) => row.service);
      return services.map((row: any) => row.service);
    } catch (error) {
      console.error('Failed to get services from D1:', error);
      return [];
    }
  }

  /**
   * Get neighborhoods for a city from D1
   */
  async getNeighborhoods(city: string): Promise<string[]> {
    try {
      const sql = `
        SELECT DISTINCT neighborhood_name as neighborhood 
        FROM neighborhoods 
        WHERE LOWER(city) = LOWER(?)
        ORDER BY neighborhood_name ASC
      `;

      const neighborhoods = await this.executeQuery(sql, [city]);
      return neighborhoods.map((row: any) => row.neighborhood);
      return neighborhoods.map((row: any) => row.neighborhood);
    } catch (error) {
      console.error('Failed to get neighborhoods from D1:', error);
      return [];
    }
  }

  /**
   * Submit contact form to D1
   */
  async submitContact(contactData: ContactSubmission): Promise<SubmissionResult> {
    const sql = `
      INSERT INTO contact_messages (
        id, name, email, subject, message, category, city, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'new', datetime('now'))
    `;

    const id = 'contact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    try {
      await this.executeQuery(sql, [
        id,
        contactData.name,
        contactData.email,
        contactData.subject || 'Contact Form Submission',
        contactData.message,
        contactData.category || null,
        contactData.city || null
      ]);

      let responseMessage = "Thank you for your message! We'll get back to you soon.";
      
      if (contactData.inquiryType === "business-listing") {
        responseMessage = `Thank you for your interest in listing "${contactData.businessName}" in our ${contactData.city} directory! Our team will review your request and contact you within 1-2 business days with next steps.`;
      }

      return {
        success: true,
        message: responseMessage,
        submissionId: id
      };
    } catch (error) {
      console.error('Failed to submit contact to D1:', error);
      return {
        success: false,
        message: "An error occurred while submitting your message. Please try again later.",
        errors: ["SUBMISSION_ERROR"]
      };
    }
  }

  /**
   * Submit business application to D1
   */
  async submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult> {
    const sql = `
      INSERT INTO business_submissions (
        id, business_name, owner_name, email, phone, address, city, state, 
        zip_code, category, website, description, services, hours, site_id, 
        status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))
    `;

    const id = 'biz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const siteId = `${businessData.category}.${businessData.city}`.toLowerCase().replace(/\s+/g, '-');
    const allServices = [...businessData.services, ...businessData.customServices];

    try {
      await this.executeQuery(sql, [
        id,
        businessData.businessName,
        businessData.ownerName,
        businessData.email,
        businessData.phone,
        businessData.address,
        businessData.city,
        businessData.state,
        businessData.zipCode,
        businessData.category,
        businessData.website || null,
        businessData.description || null,
        JSON.stringify(allServices),
        JSON.stringify(businessData.hours || {}),
        siteId
      ]);

      const responseMessage = `Thank you for submitting "${businessData.businessName}" to our ${businessData.city} ${businessData.category} directory! 

Your application is now under review. Here's what happens next:

1. **Review Process**: Our team will verify your business information within 2-3 business days
2. **Verification**: We may contact you to confirm details or request additional information
3. **Approval**: Once approved, your business will be live on our platform
4. **Notification**: You'll receive an email confirmation when your listing goes live

Your reference ID is: ${id.slice(0, 12)}

We'll contact you at ${businessData.email} with updates on your application status.`;

      return {
        success: true,
        message: responseMessage,
        submissionId: id
      };
    } catch (error) {
      console.error('Failed to submit business to D1:', error);
      return {
        success: false,
        message: "An error occurred while submitting your application. Please try again later.",
        errors: ["SUBMISSION_ERROR"]
      };
    }
  }

  /**
   * Track user engagement events in D1
   */
  async trackEngagement(event: UserEngagementEvent): Promise<void> {
    const sql = `
      INSERT INTO user_engagement_events (
        id, business_id, event_type, event_data, timestamp, user_agent, ip_address, session_id
      ) VALUES (?, ?, ?, ?, datetime('now'), ?, ?, ?)
    `;

    const id = 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    try {
      await this.executeQuery(sql, [
        id,
        event.businessId || null,
        event.eventType,
        JSON.stringify(event.eventData || {}),
        event.eventData?.userAgent || null,
        event.ipAddress || null,
        event.userSessionId || null
      ]);
    } catch (error) {
      console.error('Failed to track engagement in D1:', error);
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
