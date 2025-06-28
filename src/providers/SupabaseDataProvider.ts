import { supabase, type Database } from '../lib/supabase';
import { ContactSubmission, BusinessSubmission, SubmissionResult, UserEngagementEvent, BusinessAnalytics } from '../types';

export class SupabaseDataProvider {
  /**
   * Generate site_id as subdomain slug (category.city format)
   */
  private generateSiteId(category: string, city: string): string {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
    return `${categorySlug}.${citySlug}`;
  }

  /**
   * Submit contact form to Supabase using existing schema
   */
  async submitContact(contactData: ContactSubmission): Promise<SubmissionResult> {
    try {
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

      if (errors.length > 0) {
        return {
          success: false,
          message: 'Please correct the following errors:',
          errors
        };
      }

      // Insert into existing contact_messages table - only select ID
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject,
          message: contactData.message,
          category: contactData.category || null,
          city: contactData.city || null,
          status: 'new'
        })
        .select('id')  // ← Only get the ID we need
        .single();

      if (error) {
        console.error('Supabase error:', error);
        
        // User-friendly error messages for common issues
        if (error.message.includes('row-level security policy')) {
          return {
            success: false,
            message: 'Our system is currently experiencing technical difficulties. Please try again in a few minutes, or contact our support team directly for immediate assistance.',
            errors: ['TECHNICAL_DIFFICULTIES']
          };
        }
        
        if (error.code === 'PGRST116') {
          return {
            success: false,
            message: 'Server temporarily unavailable. Please try again in a few minutes.',
            errors: ['SERVER_UNAVAILABLE']
          };
        }
        
        // Generic friendly error for any other database issues
        return {
          success: false,
          message: 'We\'re experiencing technical difficulties at the moment. Please try again in a few minutes, or contact our support team if the issue persists.',
          errors: ['TECHNICAL_DIFFICULTIES']
        };
      }

      // Generate response message based on inquiry type
      let responseMessage = 'Thank you for your message! We\'ll get back to you soon.';
      
      if (contactData.inquiryType === 'business-listing') {
        responseMessage = `Thank you for your interest in listing "${contactData.businessName}" in our ${contactData.city} directory! Our team will review your request and contact you within 1-2 business days with next steps.`;
      } else if (contactData.inquiryType === 'partnership') {
        responseMessage = 'Thank you for your partnership inquiry! Our business development team will review your proposal and respond within 2-3 business days.';
      } else if (contactData.inquiryType === 'technical') {
        responseMessage = 'Thank you for reporting this technical issue. Our support team has been notified and will investigate immediately.';
      } else {
        responseMessage = `Thank you for contacting us about ${contactData.category?.toLowerCase()} in ${contactData.city}! We'll respond within 24 hours.`;
      }

      return {
        success: true,
        message: responseMessage,
        submissionId: data.id
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

  /**
   * Submit business application to Supabase using existing schema
   */
  async submitBusiness(businessData: BusinessSubmission): Promise<SubmissionResult> {
    try {
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

      if (errors.length > 0) {
        return {
          success: false,
          message: 'Please correct the following errors:',
          errors
        };
      }

      // Generate site_id as subdomain slug (category.city)
      const siteId = this.generateSiteId(businessData.category, businessData.city);

      // Check for duplicate business without using .single()
      const { data: existingBusinesses, error: checkError } = await supabase
        .from('business_submissions')
        .select('id')
        .eq('business_name', businessData.businessName)
        .eq('city', businessData.city)
        .eq('state', businessData.state);

      if (checkError) {
        console.error('Error checking for duplicate business:', checkError);
        // Continue with submission even if duplicate check fails
      }

      // Check if any existing businesses were found
      if (existingBusinesses && existingBusinesses.length > 0) {
        return {
          success: false,
          message: 'A business with this name already exists in this city. Please contact us if this is your business.',
          errors: ['DUPLICATE_BUSINESS']
        };
      }

      // Combine all services
      const allServices = [...businessData.services, ...businessData.customServices];

      // Insert with ALL required fields including dynamic site_id
      const { data, error } = await supabase
        .from('business_submissions')
        .insert({
          business_name: businessData.businessName,
          owner_name: businessData.ownerName,
          email: businessData.email,
          phone: businessData.phone,
          address: businessData.address,
          city: businessData.city,
          state: businessData.state,
          zip_code: businessData.zipCode,
          category: businessData.category,
          site_id: siteId, // ← Just the subdomain slug: "auto-repair.denver"
          website: businessData.website || null,
          description: businessData.description || null,
          services: allServices,
          hours: businessData.hours,
          status: 'pending' as Database['public']['Enums']['submission_status']
        })
        .select('id')  // ← Only get the ID we need
        .single();

      if (error) {
        console.error('Supabase error:', error);
        
        // User-friendly error messages for common issues
        if (error.message.includes('row-level security policy')) {
          return {
            success: false,
            message: 'Our system is currently experiencing technical difficulties. Please try again in a few minutes, or contact our support team directly for immediate assistance.',
            errors: ['TECHNICAL_DIFFICULTIES']
          };
        }
        
        if (error.code === 'PGRST116') {
          return {
            success: false,
            message: 'Server temporarily unavailable. Please try again in a few minutes.',
            errors: ['SERVER_UNAVAILABLE']
          };
        }
        
        if (error.code === '23505') { // Unique constraint violation
          return {
            success: false,
            message: 'A business with this information already exists. Please contact us if this is your business.',
            errors: ['DUPLICATE_BUSINESS']
          };
        }
        
        // Simulate occasional high volume error like JsonDataProvider
        if (Math.random() < 0.1) { // 10% chance to show high volume message
          return {
            success: false,
            message: 'Our system is currently experiencing high volume. Please try again in a few minutes.',
            errors: ['HIGH_VOLUME']
          };
        }
        
        // Generic friendly error for any other database issues
        return {
          success: false,
          message: 'We\'re experiencing technical difficulties at the moment. Please try again in a few minutes, or contact our support team if the issue persists.',
          errors: ['TECHNICAL_DIFFICULTIES']
        };
      }

      const responseMessage = `Thank you for submitting "${businessData.businessName}" to our ${businessData.city} ${businessData.category} directory! 

Your application is now under review. Here's what happens next:

1. **Review Process**: Our team will verify your business information within 2-3 business days
2. **Verification**: We may contact you to confirm details or request additional information
3. **Approval**: Once approved, your business will be live on our platform
4. **Notification**: You'll receive an email confirmation when your listing goes live

Your reference ID is: ${data.id.slice(0, 12)}

We'll contact you at ${businessData.email} with updates on your application status.`;

      return {
        success: true,
        message: responseMessage,
        submissionId: data.id
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
   * Track user engagement events
   */
  async trackEngagement(event: UserEngagementEvent): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_engagement_events')
        .insert({
          business_id: event.businessId,
          business_name: event.businessName,
          event_type: event.eventType,
          event_data: event.eventData || {},
          timestamp: event.timestamp.toISOString(),
          ip_address: event.ipAddress || null,
          user_session_id: event.userSessionId
        });

      if (error) {
        console.error('Error tracking engagement:', error);
        // Don't throw error to avoid disrupting user experience
      }
    } catch (error) {
      console.error('Failed to track engagement:', error);
      // Don't throw error to avoid disrupting user experience
    }
  }

  /**
   * Get business analytics
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

      // Get engagement events for the period
      const { data: events, error } = await supabase
        .from('user_engagement_events')
        .select('*')
        .eq('business_id', businessId)
        .gte('timestamp', start.toISOString())
        .lte('timestamp', end.toISOString())
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching analytics:', error);
        throw error;
      }

      // Process events to generate analytics
      const analytics = this.processEngagementEvents(events || [], businessId, period, start, end);
      return analytics;

    } catch (error) {
      console.error('Failed to get business analytics:', error);
      // Return empty analytics on error
      return this.getEmptyAnalytics(businessId, period, startDate || new Date(), endDate || new Date());
    }
  }

  private processEngagementEvents(
    events: any[], 
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
    const hourlyMap = new Map<number, { views: number; interactions: number }>();

    // Process each event
    events.forEach(event => {
      const eventData = event.event_data || {};
      const hour = new Date(event.timestamp).getHours();
      
      // Initialize hourly data
      if (!hourlyMap.has(hour)) {
        hourlyMap.set(hour, { views: 0, interactions: 0 });
      }
      const hourlyData = hourlyMap.get(hour)!;

      // Track unique sessions
      if (event.user_session_id) {
        uniqueSessionIds.add(event.user_session_id);
      }

      // Count metrics by event type
      switch (event.event_type) {
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
      if (eventData.searchQuery && event.event_type !== 'view') {
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

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ===== ADMIN METHODS =====

  /**
   * Get all business submissions for admin dashboard
   */
  async getBusinessSubmissions(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('business_submissions')
        .select(`
          id,
          business_name,
          owner_name,
          email,
          phone,
          address,
          city,
          state,
          zip_code,
          category,
          website,
          description,
          services,
          hours,
          status,
          submitted_at,
          reviewed_at,
          reviewer_notes,
          site_id
        `)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching business submissions:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get business submissions:', error);
      throw error;
    }
  }

  /**
   * Get all business profiles for admin dashboard
   */
  async getBusinessProfiles(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select(`
          id,
          user_id,
          business_name,
          email,
          role,
          approval_status,
          premium,
          stripe_subscription_id,
          stripe_price_id,
          stripe_current_period_end,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching business profiles:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get business profiles:', error);
      throw error;
    }
  }

  /**
   * Get all contact messages for admin dashboard
   */
  async getContactMessages(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select(`
          id,
          name,
          email,
          subject,
          message,
          category,
          city,
          status,
          admin_notes,
          resolved_at,
          resolved_by,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contact messages:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get contact messages:', error);
      throw error;
    }
  }

  /**
   * Approve a business submission
   */
  async approveBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    try {
      // Get the submission data first
      const { data: submission, error: fetchError } = await supabase
        .from('business_submissions')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !submission) {
        console.error('Error fetching submission:', fetchError);
        throw new Error('Failed to find submission');
      }

      // Update the submission status
      const { error: updateError } = await supabase
        .from('business_submissions')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewerNotes || 'Approved by admin'
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error approving business submission:', updateError);
        throw updateError;
      }

      // Create business entry from submission
      await this.createBusinessFromSubmission(submission);
    } catch (error) {
      console.error('Failed to approve business submission:', error);
      throw error;
    }
  }

  /**
   * Reject a business submission
   */
  async rejectBusinessSubmission(id: string, reviewerNotes?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('business_submissions')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewerNotes || 'Rejected by admin'
        })
        .eq('id', id);

      if (error) {
        console.error('Error rejecting business submission:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to reject business submission:', error);
      throw error;
    }
  }

  /**
   * Resolve a contact message
   */
  async resolveContactMessage(id: string, resolvedBy?: string, adminNotes?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy || 'admin',
          admin_notes: adminNotes
        })
        .eq('id', id);

      if (error) {
        console.error('Error resolving contact message:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to resolve contact message:', error);
      throw error;
    }
  }

  /**
   * Get admin dashboard statistics
   */
  async getAdminStats(): Promise<{
    pendingBusinesses: number;
    totalBusinesses: number;
    newMessages: number;
    totalUsers: number;
    premiumBusinesses: number;
  }> {
    try {
      // Get counts in parallel
      const [submissions, profiles, messages] = await Promise.all([
        this.getBusinessSubmissions(),
        this.getBusinessProfiles(),
        this.getContactMessages()
      ]);

      return {
        pendingBusinesses: submissions.filter(s => s.status === 'pending').length,
        totalBusinesses: submissions.length,
        newMessages: messages.filter(m => m.status === 'new').length,
        totalUsers: profiles.length,
        premiumBusinesses: profiles.filter(p => p.premium === true).length
      };
    } catch (error) {
      console.error('Failed to get admin stats:', error);
      // Return empty stats on error
      return {
        pendingBusinesses: 0,
        totalBusinesses: 0,
        newMessages: 0,
        totalUsers: 0,
        premiumBusinesses: 0
      };
    }
  }

  /**
   * Helper to create business entry from approved submission
   */
  private async createBusinessFromSubmission(submission: any): Promise<void> {
    try {
      // Check if business already exists
      const { data: existingBusiness } = await supabase
        .from('businesses')
        .select('id')
        .eq('email', submission.email)
        .eq('name', submission.business_name)
        .single();

      if (existingBusiness) {
        console.log('Business already exists in directory');
        return;
      }

      // Create business entry
      const { error: businessError } = await supabase
        .from('businesses')
        .insert({
          business_id: `${submission.city.toLowerCase().replace(/\s+/g, '-')}-${submission.business_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: submission.business_name,
          description: submission.description,
          address: submission.address,
          phone: submission.phone,
          website: submission.website,
          email: submission.email,
          category: submission.category,
          city: submission.city,
          state: submission.state,
          services: submission.services || [],
          hours: submission.hours,
          site_id: submission.site_id || 'near-me-us',
          status: 'active',
          verified: true
        });

      if (businessError) {
        console.error('Error creating business entry:', businessError);
        throw businessError;
      }

      console.log('Business entry created successfully');
    } catch (error) {
      console.error('Error creating business from submission:', error);
      throw error;
    }
  }
}