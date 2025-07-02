import { IDataProvider, Business, ContactSubmission, BusinessSubmission, SubmissionResult, UserEngagementEvent, BusinessAnalytics } from '../types';
import businessesData from '../data/businesses.json';
import servicesData from '../data/services.json';
import neighborhoodsData from '../data/neighborhoods.json';

export class JsonDataProvider implements IDataProvider {
  private businesses: Business[] = businessesData;
  private services: Record<string, string[]> = servicesData;
  private neighborhoods: Record<string, string[]> = neighborhoodsData;
  private engagementEvents: UserEngagementEvent[] = []; // In-memory storage for development

  async getBusinesses(category: string, city: string): Promise<Business[]> {
    // Convert display format back to kebab-case for filtering
    const categoryKey = category.toLowerCase().replace(/\s+/g, '-');
    const cityKey = city.toLowerCase().replace(/\s+/g, '-');
    
    return this.businesses.filter(
      business => business.category === categoryKey && business.city === cityKey
    );
  }

  async getServices(category: string): Promise<string[]> {
    const categoryKey = category.toLowerCase().replace(/\s+/g, '-');
    return this.services[categoryKey] || [];
  }

  async getNeighborhoods(city: string): Promise<string[]> {
    const cityKey = city.toLowerCase().replace(/\s+/g, '-');
    return this.neighborhoods[cityKey] || [];
  }

  async submitContact(contactData: ContactSubmission): Promise<SubmissionResult> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validate required fields
      const errors: string[] = [];
      
      if (!contactData.name?.trim()) {
        errors.push('Name is required');
      }
      
      if (!contactData.email?.trim()) {
        errors.push('Email is required');
      } else if (!this.isValidEmail(contactData.email)) {
        errors.push('Invalid email format');
      }
      
      if (!contactData.subject?.trim()) {
        errors.push('Subject is required');
      }
      
      if (!contactData.message?.trim()) {
        errors.push('Message is required');
      }

      // Business name required for business listing inquiries
      if (contactData.inquiryType === 'business-listing' && !contactData.businessName?.trim()) {
        errors.push('Business name is required for business listing inquiries');
      }

      if (errors.length > 0) {
        return {
          success: false,
          message: 'Please correct the following errors:',
          errors
        };
      }

      // Simulate occasional failures for realistic testing
      if (Math.random() < 0.05) { // 5% failure rate
        return {
          success: false,
          message: 'Server temporarily unavailable. Please try again in a few minutes.',
          errors: ['TEMP_SERVER_ERROR']
        };
      }

      // Generate submission ID
      const submissionId = `CONTACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // In a real implementation, this would:
      // 1. Save to database
      // 2. Send email notifications
      // 3. Create support tickets
      // 4. Trigger automated workflows
      console.log('Contact submission received:', {
        ...contactData,
        submissionId
      });

      // Determine response message based on inquiry type
      let responseMessage = 'Thank you for your message! We\'ll get back to you soon.';
      
      switch (contactData.inquiryType) {
        case 'business-listing':
          responseMessage = `Thank you for your interest in listing "${contactData.businessName}" in our ${contactData.city} directory! Our team will review your request and contact you within 1-2 business days with next steps.`;
          break;
        case 'partnership':
          responseMessage = 'Thank you for your partnership inquiry! Our business development team will review your proposal and respond within 2-3 business days.';
          break;
        case 'technical':
          responseMessage = 'Thank you for reporting this technical issue. Our support team has been notified and will investigate immediately.';
          break;
        case 'urgent':
          responseMessage = 'Your urgent inquiry has been received and prioritized. You can expect a response within 4 hours during business hours.';
          break;
        default:
          responseMessage = `Thank you for contacting us about ${contactData.category.toLowerCase()} in ${contactData.city}! We'll respond within 24 hours.`;
      }

      return {
        success: true,
        message: responseMessage,
        submissionId
      };

    } catch (error) {
      console.error('Error submitting contact form:', error);
      return {
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
        errors: ['UNEXPECTED_ERROR']
      };
    }
  }

  async submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Validate required fields
      const errors: string[] = [];
      
      if (!businessData.businessName?.trim()) {
        errors.push('Business name is required');
      }
      
      if (!businessData.ownerName?.trim()) {
        errors.push('Owner/Manager name is required');
      }
      
      if (!businessData.email?.trim()) {
        errors.push('Email is required');
      } else if (!this.isValidEmail(businessData.email)) {
        errors.push('Invalid email format');
      }
      
      if (!businessData.phone?.trim()) {
        errors.push('Phone number is required');
      }
      
      if (!businessData.address?.trim()) {
        errors.push('Address is required');
      }
      
      if (!businessData.city?.trim()) {
        errors.push('City is required');
      }
      
      if (!businessData.state?.trim()) {
        errors.push('State is required');
      }
      
      if (!businessData.zipCode?.trim()) {
        errors.push('ZIP code is required');
      }

      // Validate services
      const totalServices = businessData.services.length + businessData.customServices.length;
      if (totalServices === 0) {
        errors.push('At least one service must be selected or added');
      }

      // Validate business hours
      const hasValidHours = Object.values(businessData.hours).some(hours => 
        hours && hours.trim() && hours.toLowerCase() !== 'closed'
      );
      if (!hasValidHours) {
        errors.push('At least one day must have business hours specified');
      }

      if (errors.length > 0) {
        return {
          success: false,
          message: 'Please correct the following errors:',
          errors
        };
      }

      // Check for duplicate business (simplified check)
      const existingBusiness = this.businesses.find(business => 
        business.name.toLowerCase() === businessData.businessName.toLowerCase() &&
        business.city.toLowerCase() === businessData.city.toLowerCase().replace(/\s+/g, '-')
      );

      if (existingBusiness) {
        return {
          success: false,
          message: 'A business with this name already exists in this city. Please contact us if this is your business.',
          errors: ['DUPLICATE_BUSINESS']
        };
      }

      // Simulate occasional failures for realistic testing
      if (Math.random() < 0.03) { // 3% failure rate
        return {
          success: false,
          message: 'Our system is currently experiencing high volume. Please try again in a few minutes.',
          errors: ['HIGH_VOLUME']
        };
      }

      // Generate submission ID
      const submissionId = `BUSINESS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // In a real implementation, this would:
      // 1. Save to database with pending status
      // 2. Send confirmation email to business owner
      // 3. Notify admin team for review
      // 4. Create verification workflow
      // 5. Generate business profile draft
      console.log('Business submission received:', {
        ...businessData,
        submissionId,
        status: 'pending_review'
      });

      const responseMessage = `Thank you for submitting "${businessData.businessName}" to our ${businessData.city} ${businessData.category} directory! 

Your application is now under review. Here's what happens next:

1. **Review Process**: Our team will verify your business information within 2-3 business days
2. **Verification**: We may contact you to confirm details or request additional information
3. **Approval**: Once approved, your business will be live on our platform
4. **Notification**: You'll receive an email confirmation when your listing goes live

Your reference ID is: ${submissionId.slice(0, 12)}

We'll contact you at ${businessData.email} with updates on your application status.`;

      return {
        success: true,
        message: responseMessage,
        submissionId
      };

    } catch (error) {
      console.error('Error submitting business application:', error);
      return {
        success: false,
        message: 'An unexpected error occurred while submitting your application. Please try again later.',
        errors: ['UNEXPECTED_ERROR']
      };
    }
  }

  /**
   * Track user engagement events (in-memory for development)
   */
  async trackEngagement(event: UserEngagementEvent): Promise<void> {
    try {
      // Add unique ID for in-memory storage
      const eventWithId = {
        ...event,
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      // Store in memory (in production, this would go to database)
      this.engagementEvents.push(eventWithId);

      // Log for development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Engagement tracked (JSON Provider):', {
          business: event.businessName,
          event: event.eventType,
          data: event.eventData
        });
      }

      // Keep only last 1000 events to prevent memory issues
      if (this.engagementEvents.length > 1000) {
        this.engagementEvents = this.engagementEvents.slice(-1000);
      }
    } catch (error) {
      console.error('Failed to track engagement:', error);
      // Don't throw error to avoid disrupting user experience
    }
  }

  /**
   * Get business analytics (from in-memory events for development)
   */
  async getBusinessAnalytics(
    businessId: string, 
    period: 'day' | 'week' | 'month' | 'year',
    startDate?: Date,
    endDate?: Date
  ): Promise<BusinessAnalytics> {
    try {
      // Calculate date range if not provided
      const end = endDate || new Date();
      let start = startDate;
      
      if (!start) {
        start = new Date();
        switch (period) {
          case 'day':
            start.setDate(start.getDate() - 1);
            break;
          case 'week':
            start.setDate(start.getDate() - 7);
            break;
          case 'month':
            start.setMonth(start.getMonth() - 1);
            break;
          case 'year':
            start.setFullYear(start.getFullYear() - 1);
            break;
        }
      }

      // Filter events for this business and time period
      const relevantEvents = this.engagementEvents.filter(event => 
        event.businessId === businessId &&
        event.timestamp >= start! &&
        event.timestamp <= end
      );

      // Process events to generate analytics
      return this.processEngagementEvents(relevantEvents, businessId, period, start, end);

    } catch (error) {
      console.error('Failed to get business analytics:', error);
      // Return empty analytics on error
      return this.getEmptyAnalytics(businessId, period, startDate || new Date(), endDate || new Date());
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
    // Calculate date range if not provided
    const end = endDate || new Date();
    let start = startDate;

    if (!start) {
      start = new Date();
      switch (period) {
        case 'day':
          start.setDate(start.getDate() - 1);
          break;
        case 'week':
          start.setDate(start.getDate() - 7);
          break;
        case 'month':
          start.setMonth(start.getMonth() - 1);
          break;
        case 'year':
          start.setFullYear(start.getFullYear() - 1);
          break;
      }
    }

    // Filter events for the time period (click events only)
    const relevantEvents = this.engagementEvents.filter(event => 
      event.timestamp >= start! && 
      event.timestamp <= end &&
      event.eventType.includes('_click')
    );

    // Mock implementation for development with sample data
    if (relevantEvents.length === 0) {
      return {
        totalClickEvents: 42,
        totalUniqueVisitors: 28,
        averageConversionRate: 65.5,
        activeBusinesses: 12,
        topPerformingBusinesses: [
          {
            businessId: 'mock-business-1',
            businessName: 'Sample Nail Salon',
            totalClicks: 15,
            phoneClicks: 8,
            websiteClicks: 5,
            bookingClicks: 2,
            conversionRate: 85.7
          },
          {
            businessId: 'mock-business-2', 
            businessName: 'Elite Auto Repair',
            totalClicks: 12,
            phoneClicks: 7,
            websiteClicks: 3,
            bookingClicks: 2,
            conversionRate: 75.0
          }
        ],
        categoryBreakdown: [
          {
            category: 'nail-salons',
            totalClicks: 25,
            uniqueVisitors: 18,
            businesses: 8
          },
          {
            category: 'auto-repair',
            totalClicks: 17,
            uniqueVisitors: 12,
            businesses: 4
          }
        ],
        deviceBreakdown: {
          mobile: 28,
          tablet: 5,
          desktop: 9
        },
        clickTypeBreakdown: {
          phone: 20,
          website: 12,
          booking: 6,
          directions: 3,
          email: 1
        },
        peakHours: [
          { hour: 14, totalClicks: 8 },
          { hour: 16, totalClicks: 6 },
          { hour: 11, totalClicks: 5 },
          { hour: 13, totalClicks: 4 },
          { hour: 15, totalClicks: 3 }
        ]
      };
    }

    // Process real events if available
    const uniqueSessionIds = new Set<string>();
    const businessMetrics = new Map<string, any>();
    const deviceBreakdown = { mobile: 0, tablet: 0, desktop: 0 };
    const clickTypeBreakdown = { phone: 0, website: 0, booking: 0, directions: 0, email: 0 };
    const hourlyMap = new Map<number, number>();

    relevantEvents.forEach(event => {
      if (event.userSessionId) {
        uniqueSessionIds.add(event.userSessionId);
      }

      const hour = new Date(event.timestamp).getHours();
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);

      // Track device types
      const deviceType = event.eventData?.deviceType || 'desktop';
      if (deviceType in deviceBreakdown) {
        deviceBreakdown[deviceType as keyof typeof deviceBreakdown]++;
      }

      // Track click types
      switch (event.eventType) {
        case 'phone_click':
          clickTypeBreakdown.phone++;
          break;
        case 'website_click':
          clickTypeBreakdown.website++;
          break;
        case 'booking_click':
          clickTypeBreakdown.booking++;
          break;
        case 'directions_click':
          clickTypeBreakdown.directions++;
          break;
        case 'email_click':
          clickTypeBreakdown.email++;
          break;
      }

      // Track business metrics
      if (!businessMetrics.has(event.businessId)) {
        businessMetrics.set(event.businessId, {
          businessName: event.businessName,
          totalClicks: 0,
          phoneClicks: 0,
          websiteClicks: 0,
          bookingClicks: 0
        });
      }

      const metric = businessMetrics.get(event.businessId);
      metric.totalClicks++;
      
      if (event.eventType === 'phone_click') metric.phoneClicks++;
      if (event.eventType === 'website_click') metric.websiteClicks++;
      if (event.eventType === 'booking_click') metric.bookingClicks++;
    });

    // Calculate results
    const totalClickEvents = Object.values(clickTypeBreakdown).reduce((sum, count) => sum + count, 0);
    const totalUniqueVisitors = uniqueSessionIds.size;
    const activeBusinesses = businessMetrics.size;

    const topPerformingBusinesses = Array.from(businessMetrics.entries())
      .map(([businessId, metric]) => ({
        businessId,
        businessName: metric.businessName,
        totalClicks: metric.totalClicks,
        phoneClicks: metric.phoneClicks,
        websiteClicks: metric.websiteClicks,
        bookingClicks: metric.bookingClicks,
        conversionRate: metric.totalClicks > 0 ? 
          ((metric.phoneClicks + metric.websiteClicks + metric.bookingClicks) / metric.totalClicks) * 100 : 0
      }))
      .sort((a, b) => b.totalClicks - a.totalClicks)
      .slice(0, 10);

    const averageConversionRate = topPerformingBusinesses.length > 0 ?
      topPerformingBusinesses.reduce((sum, b) => sum + b.conversionRate, 0) / topPerformingBusinesses.length : 0;

    const peakHours = Array.from(hourlyMap.entries())
      .map(([hour, totalClicks]) => ({ hour, totalClicks }))
      .sort((a, b) => b.totalClicks - a.totalClicks)
      .slice(0, 5);

    return {
      totalClickEvents,
      totalUniqueVisitors,
      averageConversionRate,
      activeBusinesses,
      topPerformingBusinesses,
      categoryBreakdown: [], // Could be enhanced with real category processing
      deviceBreakdown,
      clickTypeBreakdown,
      peakHours
    };
  }

  private processEngagementEvents(
    events: UserEngagementEvent[], 
    businessId: string, 
    period: 'day' | 'week' | 'month' | 'year',
    startDate: Date,
    endDate: Date
  ): BusinessAnalytics {
    const metrics = {
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
    };

    const uniqueSessionIds = new Set<string>();
    const sourceMap = new Map<string, number>();
    const searchQueryMap = new Map<string, { views: number; clicks: number }>();
    const deviceMap = { mobile: 0, tablet: 0, desktop: 0 };
    const hourlyMap = new Map<number, { views: number, interactions: number }>();

    // Process each event
    events.forEach(event => {
      const eventData = event.eventData || {};
      const hour = new Date(event.timestamp).getHours();
      
      // Initialize hourly data
      if (!hourlyMap.has(hour)) {
        hourlyMap.set(hour, { views: 0, interactions: 0 });
      }
      const hourlyData = hourlyMap.get(hour)!;

      // Track unique sessions
      if (event.userSessionId) {
        uniqueSessionIds.add(event.userSessionId);
      }

      // Count metrics by event type
      switch (event.eventType) {
        case 'view':
          metrics.totalViews++;
          hourlyData.views++;
          
          // Track sources
          const source = eventData.source || 'direct';
          sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
          
          // Track search queries
          if (eventData.searchQuery) {
            const existing = searchQueryMap.get(eventData.searchQuery) || { views: 0, clicks: 0 };
            existing.views++;
            searchQueryMap.set(eventData.searchQuery, existing);
          }
          break;
          
        case 'phone_click':
          metrics.phoneClicks++;
          hourlyData.interactions++;
          break;
          
        case 'website_click':
          metrics.websiteClicks++;
          hourlyData.interactions++;
          break;
          
        case 'booking_click':
          metrics.bookingClicks++;
          hourlyData.interactions++;
          break;
          
        case 'directions_click':
          metrics.directionsClicks++;
          hourlyData.interactions++;
          break;
          
        case 'email_click':
          metrics.emailClicks++;
          hourlyData.interactions++;
          break;
          
        case 'hours_view':
          metrics.hoursViews++;
          hourlyData.interactions++;
          break;
          
        case 'services_expand':
          metrics.servicesExpands++;
          hourlyData.interactions++;
          break;
          
        case 'photo_view':
          metrics.photoViews++;
          hourlyData.interactions++;
          break;
      }

      // Track device types
      const deviceType = eventData.deviceType || 'desktop';
      if (deviceType in deviceMap) {
        deviceMap[deviceType as keyof typeof deviceMap]++;
      }

      // Update search query clicks
      if (eventData.searchQuery && event.eventType !== 'view') {
        const existing = searchQueryMap.get(eventData.searchQuery) || { views: 0, clicks: 0 };
        existing.clicks++;
        searchQueryMap.set(eventData.searchQuery, existing);
      }
    });

    // Calculate derived metrics
    metrics.uniqueViews = uniqueSessionIds.size;
    const totalInteractions = metrics.phoneClicks + metrics.websiteClicks + metrics.bookingClicks;
    metrics.conversionRate = metrics.totalViews > 0 ? (totalInteractions / metrics.totalViews) * 100 : 0;
    
    const allInteractions = totalInteractions + metrics.directionsClicks + metrics.emailClicks + 
                           metrics.hoursViews + metrics.servicesExpands + metrics.photoViews;
    metrics.engagementRate = metrics.totalViews > 0 ? (allInteractions / metrics.totalViews) * 100 : 0;

    // Process top sources
    const topSources = Array.from(sourceMap.entries())
      .map(([source, views]) => ({
        source,
        views,
        percentage: metrics.totalViews > 0 ? (views / metrics.totalViews) * 100 : 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Process top search queries
    const topSearchQueries = Array.from(searchQueryMap.entries())
      .map(([query, data]) => ({
        query,
        views: data.views,
        clicks: data.clicks
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Process hourly distribution
    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
      const data = hourlyMap.get(hour) || { views: 0, interactions: 0 };
      return {
        hour,
        views: data.views,
        interactions: data.interactions
      };
    });

    return {
      businessId,
      period,
      startDate,
      endDate,
      metrics,
      topSources,
      topSearchQueries,
      deviceBreakdown: deviceMap,
      hourlyDistribution
    };
  }

  private getEmptyAnalytics(
    businessId: string, 
    period: 'day' | 'week' | 'month' | 'year',
    startDate: Date,
    endDate: Date
  ): BusinessAnalytics {
    return {
      businessId,
      period,
      startDate,
      endDate,
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
      hourlyDistribution: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        views: 0,
        interactions: 0
      }))
    };
  }

  // Admin methods - mock implementations for development
  async getAllBusinesses(): Promise<any[]> {
    // Return all businesses from the JSON data for admin view
    // Convert the Business objects to match the admin interface expectations
    return this.businesses.map(business => ({
      id: business.id,
      business_name: business.name,
      category: business.category,
      city: business.city,
      state: business.state,
      address: business.address,
      phone: business.phone,
      website: business.website,
      rating: business.rating,
      review_count: business.reviewCount,
      description: business.description,
      services: business.services,
      neighborhood: business.neighborhood,
      hours: business.hours,
      image: business.image,
      premium: business.premium,
      booking_links: business.bookingLinks,
      latitude: business.latitude,
      longitude: business.longitude,
      created_at: new Date().toISOString(), // Mock timestamp
      updated_at: new Date().toISOString(), // Mock timestamp
      approved: true, // All JSON businesses are considered approved
      approval_status: 'approved'
    }));
  }

  async getBusinessSubmissions(): Promise<any[]> {
    // Return mock data for development
    return [
      {
        id: 'mock-1',
        business_name: 'Mock Business 1',
        owner_name: 'John Doe',
        email: 'john@mockbusiness.com',
        phone: '555-0123',
        address: '123 Main St',
        city: 'Seattle',
        state: 'WA',
        zip_code: '98101',
        category: 'nail-salons',
        website: 'https://mockbusiness.com',
        description: 'A mock business for development',
        services: ['Manicure', 'Pedicure'],
        hours: { monday: '9:00 AM - 6:00 PM' },
        status: 'pending',
        submitted_at: new Date().toISOString(),
        reviewed_at: null,
        reviewer_notes: null,
        site_id: 'nail-salons.seattle'
      }
    ];
  }

  async getBusinessProfiles(): Promise<any[]> {
    // Return mock data for development
    return [
      {
        id: 'profile-1',
        user_id: 'user-1',
        business_name: 'Mock Business Profile',
        email: 'profile@mockbusiness.com',
        role: 'owner',
        approval_status: 'approved',
        premium: false,
        created_at: new Date().toISOString()
      }
    ];
  }

  async getContactMessages(): Promise<any[]> {
    // Return mock data for development
    return [
      {
        id: 'msg-1',
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Mock Contact Message',
        message: 'This is a mock contact message for development',
        category: 'nail-salons',
        city: 'Seattle',
        status: 'new',
        admin_notes: null,
        resolved_at: null,
        resolved_by: null,
        created_at: new Date().toISOString()
      }
    ];
  }

  async getAdminStats(): Promise<{
    pendingBusinesses: number;
    totalBusinesses: number;
    newMessages: number;
    totalUsers: number;
    premiumBusinesses: number;
  }> {
    // Return mock stats for development
    return {
      pendingBusinesses: 1,
      totalBusinesses: 1,
      newMessages: 1,
      totalUsers: 1,
      premiumBusinesses: 0
    };
  }

  async approveBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    console.log('Mock: Approving business submission', id, reviewerNotes);
    // Mock implementation - just log for development
  }

  async rejectBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    console.log('Mock: Rejecting business submission', id, reviewerNotes);
    // Mock implementation - just log for development
  }

  async resolveContactMessage(id: string, resolvedBy?: string, adminNotes?: string): Promise<void> {
    console.log('Mock: Resolving contact message', id, resolvedBy, adminNotes);
    // Mock implementation - just log for development
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
  }

  private isValidZipCode(zipCode: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  }
}