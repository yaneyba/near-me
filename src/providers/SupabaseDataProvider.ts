import { supabase, supabaseAdmin } from "../lib/supabase";
import {
  ContactSubmission,
  BusinessSubmission,
  SubmissionResult,
  UserEngagementEvent,
  BusinessAnalytics,
} from "../types";

export class SupabaseDataProvider {
  /**
   * Generate site_id as subdomain slug (category.city format)
   */
  private generateSiteId(category: string, city: string): string {
    const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
    const citySlug = city.toLowerCase().replace(/\s+/g, "-");
    return `${categorySlug}.${citySlug}`;
  }

  /**
   * Submit contact form to Supabase using existing schema
   */
  async submitContact(
    contactData: ContactSubmission
  ): Promise<SubmissionResult> {
    try {
      // Validate required fields
      const errors: string[] = [];

      if (!contactData.name?.trim()) {
        errors.push("Name is required");
      }

      if (!contactData.email?.trim()) {
        errors.push("Email is required");
      } else if (!this.isValidEmail(contactData.email)) {
        errors.push("Invalid email format");
      }

      if (!contactData.subject?.trim()) {
        errors.push("Subject is required");
      }

      if (!contactData.message?.trim()) {
        errors.push("Message is required");
      }

      if (errors.length > 0) {
        return {
          success: false,
          message: "Please correct the following errors:",
          errors,
        };
      }

      // Insert into contact_messages table (works with current schema)
      const { data, error } = await supabase
        .from("contact_messages")
        .insert({
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject || "Contact Form Submission",
          message: contactData.message,
          category: contactData.category || null,
          city: contactData.city || null,
          status: "new",
          // Note: site_id not included since current schema doesn't have this field
        })
        .select("id") // ← Only get the ID we need
        .single();

      if (error) {
        console.error("Supabase error:", error);

        // User-friendly error messages for common issues
        if (error.message.includes("row-level security policy")) {
          return {
            success: false,
            message:
              "Our system is currently experiencing technical difficulties. Please try again in a few minutes, or contact our support team directly for immediate assistance.",
            errors: ["TECHNICAL_DIFFICULTIES"],
          };
        }

        if (error.code === "PGRST116") {
          return {
            success: false,
            message:
              "Server temporarily unavailable. Please try again in a few minutes.",
            errors: ["SERVER_UNAVAILABLE"],
          };
        }

        // Generic friendly error for any other database issues
        return {
          success: false,
          message:
            "We're experiencing technical difficulties at the moment. Please try again in a few minutes, or contact our support team if the issue persists.",
          errors: ["TECHNICAL_DIFFICULTIES"],
        };
      }

      // Generate response message based on inquiry type
      let responseMessage =
        "Thank you for your message! We'll get back to you soon.";

      if (contactData.inquiryType === "business-listing") {
        responseMessage = `Thank you for your interest in listing "${contactData.businessName}" in our ${contactData.city} directory! Our team will review your request and contact you within 1-2 business days with next steps.`;
      } else if (contactData.inquiryType === "partnership") {
        responseMessage =
          "Thank you for your partnership inquiry! Our business development team will review your proposal and respond within 2-3 business days.";
      } else if (contactData.inquiryType === "technical") {
        responseMessage =
          "Thank you for reporting this technical issue. Our support team has been notified and will investigate immediately.";
      } else {
        responseMessage = `Thank you for contacting us about ${contactData.category?.toLowerCase()} in ${
          contactData.city
        }! We'll respond within 24 hours.`;
      }

      return {
        success: true,
        message: responseMessage,
        submissionId: data.id,
      };
    } catch (error) {
      console.error("Error submitting contact form:", error);
      return {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
        errors: ["UNEXPECTED_ERROR"],
      };
    }
  }

  /**
   * Submit business application to Supabase using existing schema
   */
  async submitBusiness(
    businessData: BusinessSubmission
  ): Promise<SubmissionResult> {
    try {
      // Validate required fields
      const errors: string[] = [];

      if (!businessData.businessName?.trim()) {
        errors.push("Business name is required");
      }

      if (!businessData.ownerName?.trim()) {
        errors.push("Owner/Manager name is required");
      }

      if (!businessData.email?.trim()) {
        errors.push("Email is required");
      } else if (!this.isValidEmail(businessData.email)) {
        errors.push("Invalid email format");
      }

      if (!businessData.phone?.trim()) {
        errors.push("Phone number is required");
      }

      if (!businessData.address?.trim()) {
        errors.push("Address is required");
      }

      if (!businessData.city?.trim()) {
        errors.push("City is required");
      }

      if (!businessData.state?.trim()) {
        errors.push("State is required");
      }

      if (!businessData.zipCode?.trim()) {
        errors.push("ZIP code is required");
      }

      // Validate services
      const totalServices =
        businessData.services.length + businessData.customServices.length;
      if (totalServices === 0) {
        errors.push("At least one service must be selected or added");
      }

      if (errors.length > 0) {
        return {
          success: false,
          message: "Please correct the following errors:",
          errors,
        };
      }

      // Generate site_id as subdomain slug (category.city)
      const siteId = this.generateSiteId(
        businessData.category,
        businessData.city
      );

      // Check for duplicate business without using .single()
      const { data: existingBusinesses, error: checkError } = await supabase
        .from("business_submissions")
        .select("id")
        .eq("business_name", businessData.businessName)
        .eq("city", businessData.city)
        .eq("state", businessData.state);

      if (checkError) {
        console.error("Error checking for duplicate business:", checkError);
        // Continue with submission even if duplicate check fails
      }

      // Check if any existing businesses were found
      if (existingBusinesses && existingBusinesses.length > 0) {
        return {
          success: false,
          message:
            "A business with this name already exists in this city. Please contact us if this is your business.",
          errors: ["DUPLICATE_BUSINESS"],
        };
      }

      // Combine all services
      const allServices = [
        ...businessData.services,
        ...businessData.customServices,
      ];

      // Insert with ALL required fields including dynamic site_id
      const { data, error } = await supabase
        .from("business_submissions")
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
          hours: businessData.hours
          // status: "pending" as Database["public"]["Enums"]["submission_status"],
        })
        .select("id") // ← Only get the ID we need
        .single();

      if (error) {
        console.error("Supabase error:", error);

        // User-friendly error messages for common issues
        if (error.message.includes("row-level security policy")) {
          return {
            success: false,
            message:
              "Our system is currently experiencing technical difficulties. Please try again in a few minutes, or contact our support team directly for immediate assistance.",
            errors: ["TECHNICAL_DIFFICULTIES"],
          };
        }

        if (error.code === "PGRST116") {
          return {
            success: false,
            message:
              "Server temporarily unavailable. Please try again in a few minutes.",
            errors: ["SERVER_UNAVAILABLE"],
          };
        }

        if (error.code === "23505") {
          // Unique constraint violation
          return {
            success: false,
            message:
              "A business with this information already exists. Please contact us if this is your business.",
            errors: ["DUPLICATE_BUSINESS"],
          };
        }

        // Simulate occasional high volume error like JsonDataProvider
        if (Math.random() < 0.1) {
          // 10% chance to show high volume message
          return {
            success: false,
            message:
              "Our system is currently experiencing high volume. Please try again in a few minutes.",
            errors: ["HIGH_VOLUME"],
          };
        }

        // Generic friendly error for any other database issues
        return {
          success: false,
          message:
            "We're experiencing technical difficulties at the moment. Please try again in a few minutes, or contact our support team if the issue persists.",
          errors: ["TECHNICAL_DIFFICULTIES"],
        };
      }

      const responseMessage = `Thank you for submitting "${
        businessData.businessName
      }" to our ${businessData.city} ${businessData.category} directory! 

Your application is now under review. Here's what happens next:

1. **Review Process**: Our team will verify your business information within 2-3 business days
2. **Verification**: We may contact you to confirm details or request additional information
3. **Approval**: Once approved, your business will be live on our platform
4. **Notification**: You'll receive an email confirmation when your listing goes live

Your reference ID is: ${data.id.slice(0, 12)}

We'll contact you at ${
        businessData.email
      } with updates on your application status.`;

      return {
        success: true,
        message: responseMessage,
        submissionId: data.id,
      };
    } catch (error) {
      console.error("Error submitting business application:", error);
      return {
        success: false,
        message:
          "An unexpected error occurred while submitting your application. Please try again later.",
        errors: ["UNEXPECTED_ERROR"],
      };
    }
  }

  /**
   * Track user engagement events - CLICK EVENTS ONLY
   */
  async trackEngagement(event: UserEngagementEvent): Promise<void> {
    try {
      // Only track click events - filter out view events and other non-click events
      const clickEvents = [
        'phone_click',
        'website_click', 
        'booking_click',
        'directions_click',
        'email_click'
      ];

      // Skip tracking if this is not a click event
      if (!clickEvents.includes(event.eventType)) {
        return;
      }

      const { error } = await supabase.from("user_engagement_events").insert({
        business_id: event.businessId,
        business_name: event.businessName,
        event_type: event.eventType,
        event_data: event.eventData || {},
        timestamp: event.timestamp.toISOString(),
        ip_address: event.ipAddress || null,
        user_session_id: event.userSessionId,
      });

      if (error) {
        console.error("Error tracking engagement:", error);
        // Don't throw error to avoid disrupting user experience
      }
    } catch (error) {
      console.error("Failed to track engagement:", error);
      // Don't throw error to avoid disrupting user experience
    }
  }

  /**
   * Get business analytics
   */
  async getBusinessAnalytics(
    businessId: string,
    period: "day" | "week" | "month" | "year",
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
          case "day":
            start.setDate(start.getDate() - 1);
            break;
          case "week":
            start.setDate(start.getDate() - 7);
            break;
          case "month":
            start.setMonth(start.getMonth() - 1);
            break;
          case "year":
            start.setFullYear(start.getFullYear() - 1);
            break;
        }
      }

      // Get engagement events for the period
      const { data: events, error } = await supabase
        .from("user_engagement_events")
        .select("*")
        .eq("business_id", businessId)
        .gte("timestamp", start.toISOString())
        .lte("timestamp", end.toISOString())
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching analytics:", error);
        throw error;
      }

      // Process events to generate analytics
      const analytics = this.processEngagementEvents(
        events || [],
        businessId,
        period,
        start,
        end
      );
      return analytics;
    } catch (error) {
      console.error("Failed to get business analytics:", error);
      // Return empty analytics on error
      return this.getEmptyAnalytics(
        businessId,
        period,
        startDate || new Date(),
        endDate || new Date()
      );
    }
  }

  private processEngagementEvents(
    events: any[],
    businessId: string,
    period: "day" | "week" | "month" | "year",
    startDate: Date,
    endDate: Date
  ): BusinessAnalytics {
    // CLICK EVENTS ONLY - We only track and process click interactions
    const metrics = {
      totalViews: 0, // Not tracked - click events only
      uniqueViews: 0, // Based on unique sessions with clicks
      phoneClicks: 0,
      websiteClicks: 0,
      bookingClicks: 0,
      directionsClicks: 0,
      emailClicks: 0,
      hoursViews: 0, // Not tracked - click events only
      servicesExpands: 0, // Not tracked - click events only  
      photoViews: 0, // Not tracked - click events only
      conversionRate: 0, // Based on click distribution
      engagementRate: 0, // Based on clicks per session
    };

    const uniqueSessionIds = new Set<string>();
    const sourceMap = new Map<string, number>();
    const searchQueryMap = new Map<string, { views: number; clicks: number }>();
    const deviceMap = { mobile: 0, tablet: 0, desktop: 0 };
    const hourlyMap = new Map<
      number,
      { views: number; interactions: number }
    >();

    // Process each event
    events.forEach((event) => {
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

      // Count metrics by event type - CLICK EVENTS ONLY
      switch (event.event_type) {
        case "phone_click":
          metrics.phoneClicks++;
          hourlyData.interactions++;
          break;

        case "website_click":
          metrics.websiteClicks++;
          hourlyData.interactions++;
          break;

        case "booking_click":
          metrics.bookingClicks++;
          hourlyData.interactions++;
          break;

        case "directions_click":
          metrics.directionsClicks++;
          hourlyData.interactions++;
          break;

        case "email_click":
          metrics.emailClicks++;
          hourlyData.interactions++;
          break;

        // Skip all non-click events since we're only tracking clicks
        default:
          // No tracking for views, hours_view, services_expand, photo_view etc.
          break;
      }

      // Track device types for click events
      const deviceType = eventData.deviceType || "desktop";
      if (deviceType in deviceMap) {
        deviceMap[deviceType as keyof typeof deviceMap]++;
      }

      // Track sources for click events (where the click originated from)  
      const source = eventData.source || "direct";
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);

      // Update search query clicks (since we only track clicks now)
      if (eventData.searchQuery) {
        const existing = searchQueryMap.get(eventData.searchQuery) || {
          views: 0,
          clicks: 0,
        };
        existing.clicks++;
        searchQueryMap.set(eventData.searchQuery, existing);
      }
    });

    // Calculate derived metrics - CLICK EVENTS FOCUSED
    metrics.uniqueViews = uniqueSessionIds.size;
    
    // Total primary interactions (conversion-focused clicks)
    const totalInteractions =
      metrics.phoneClicks + metrics.websiteClicks + metrics.bookingClicks;
    
    // All click interactions
    const allInteractions =
      totalInteractions + metrics.directionsClicks + metrics.emailClicks;
    
    // Since we're only tracking clicks, conversion rate is based on click distribution
    // Phone, Website, and Booking clicks are considered "conversion" events
    metrics.conversionRate = allInteractions > 0 
      ? (totalInteractions / allInteractions) * 100 
      : 0;
      
    // Engagement rate is the variety of different click types per unique session
    metrics.engagementRate = metrics.uniqueViews > 0 
      ? (allInteractions / metrics.uniqueViews) * 100 
      : 0;

    // Process top sources - limited data since we only track clicks
    const topSources = Array.from(sourceMap.entries())
      .map(([source, clicks]) => ({
        source,
        views: 0, // No view tracking
        clicks,
        percentage: allInteractions > 0 ? (clicks / allInteractions) * 100 : 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Process top search queries - clicks only since we don't track views
    const topSearchQueries = Array.from(searchQueryMap.entries())
      .map(([query, data]) => ({
        query,
        views: 0, // No view tracking
        clicks: data.clicks,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Process hourly distribution - clicks only
    const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
      const data = hourlyMap.get(hour) || { views: 0, interactions: 0 };
      return {
        hour,
        views: 0, // No view tracking
        interactions: data.interactions, // Only click interactions
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
      hourlyDistribution,
    };
  }

  private getEmptyAnalytics(
    businessId: string,
    period: "day" | "week" | "month" | "year",
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
        engagementRate: 0,
      },
      topSources: [],
      topSearchQueries: [],
      deviceBreakdown: { mobile: 0, tablet: 0, desktop: 0 },
      hourlyDistribution: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        views: 0,
        interactions: 0,
      })),
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
      // Use admin client for admin operations
      const client = supabaseAdmin || supabase;
      const { data, error } = await client
        .from("business_submissions")
        .select(
          `
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
          submitted_at,
          reviewed_at,
          reviewer_notes,
          site_id,
          created_at,
          updated_at
        `
        )
        .order("submitted_at", { ascending: false });

      if (error) {
        console.error("Error fetching business submissions:", error);
        throw error;
      }

      // Add a computed status based on reviewed_at field
      return (data || []).map((submission) => ({
        ...submission,
        status: submission.reviewed_at ? "reviewed" : "pending", // Status based on whether it has been reviewed
      }));
    } catch (error) {
      console.error("Failed to get business submissions:", error);
      throw error;
    }
  }

  /**
   * Get all business profiles for admin dashboard
   */
  /**
   * Get all business profiles for admin dashboard
   */
  async getBusinessProfiles(): Promise<any[]> {
    try {
      // Use the RPC function to get business profiles with user roles
      const client = supabaseAdmin || supabase;
      const { data, error } = await client.rpc(
        "get_business_profiles_with_roles"
      );

      if (error) {
        console.error("Error fetching business profiles with roles:", error);

        // Fallback to basic query without roles if RPC function fails
        console.log("Falling back to basic business profiles query...");
        const { data: fallbackData, error: fallbackError } = await client
          .from("business_profiles")
          .select(
            `
          id,
          user_id,
          business_id,
          business_name,
          email,
          stripe_customer_id,
          stripe_subscription_id,
          stripe_price_id,
          premium,
          created_at,
          updated_at
        `
          )
          .order("created_at", { ascending: false });

        if (fallbackError) {
          console.error("Fallback query also failed:", fallbackError);
          throw fallbackError;
        }

        // Add default role information for fallback data
        return (fallbackData || []).map((profile) => ({
          ...profile,
          user_role: "owner", // Default role
          is_super_admin: false, // Default super admin status
        }));
      }

      return data || [];
    } catch (error) {
      console.error("Failed to get business profiles:", error);
      throw error;
    }
  }

  /**
   * Get all contact messages for admin dashboard (works with actual schema)
   */
  async getContactMessages(): Promise<any[]> {
    try {
      // Use admin client for admin operations
      const client = supabaseAdmin || supabase;
      const { data, error } = await client
        .from("contact_messages")
        .select(
          `
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
          created_at,
          updated_at
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching contact messages:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Failed to get contact messages:", error);
      throw error;
    }
  }

  /**
   * Get all businesses from the businesses table for admin dashboard
   */
  async getAllBusinesses(): Promise<any[]> {
    try {
      // Use admin client for admin operations
      const client = supabaseAdmin || supabase;
      const { data, error } = await client
        .from("businesses")
        .select(
          `
          id,
          business_id,
          name,
          description,
          address,
          phone,
          website,
          email,
          category,
          city,
          state,
          services,
          hours,
          rating,
          review_count,
          image,
          established,
          verified,
          site_id,
          status,
          premium,
          created_at,
          updated_at
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching businesses:", error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Failed to get businesses:", error);
      throw error;
    }
  }

  /**
   * Approve a business submission
   */
  async approveBusinessSubmission(
    id: string,
    reviewerNotes?: string
  ): Promise<void> {
    try {
      // Use admin client for admin operations
      const client = supabaseAdmin || supabase;

      // Get the submission data first
      const { data: submission, error: fetchError } = await client
        .from("business_submissions")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !submission) {
        console.error("Error fetching submission:", fetchError);
        throw new Error("Failed to find submission");
      }

      // Update the submission with review information
      const { error: updateError } = await client
        .from("business_submissions")
        .update({
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewerNotes || "Approved by admin",
        })
        .eq("id", id);

      if (updateError) {
        console.error("Error approving business submission:", updateError);
        throw updateError;
      }

      // Create business entry from submission
      await this.createBusinessFromSubmission(submission);
    } catch (error) {
      console.error("Failed to approve business submission:", error);
      throw error;
    }
  }

  /**
   * Reject a business submission
   */
  async rejectBusinessSubmission(
    id: string,
    reviewerNotes?: string
  ): Promise<void> {
    try {
      // Use admin client for admin operations
      const client = supabaseAdmin || supabase;
      const { error } = await client
        .from("business_submissions")
        .update({
          reviewed_at: new Date().toISOString(),
          reviewer_notes: reviewerNotes || "Rejected by admin",
        })
        .eq("id", id);

      if (error) {
        console.error("Error rejecting business submission:", error);
        throw error;
      }
    } catch (error) {
      console.error("Failed to reject business submission:", error);
      throw error;
    }
  }

  /**
   * Resolve a contact message
   */
  async resolveContactMessage(
    id: string,
    resolvedBy?: string,
    adminNotes?: string
  ): Promise<void> {
    try {
      // Use admin client for admin operations
      const client = supabaseAdmin || supabase;
      const { error } = await client
        .from("contact_messages")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy || "admin",
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        console.error("Error resolving contact message:", error);
        throw error;
      }
    } catch (error) {
      console.error("Failed to resolve contact message:", error);
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
      // Get counts in parallel - now includes both submissions and actual businesses
      const [submissions, profiles, messages, businesses] = await Promise.all([
        this.getBusinessSubmissions(),
        this.getBusinessProfiles(),
        this.getContactMessages(),
        this.getAllBusinesses(),
      ]);

      return {
        pendingBusinesses: submissions.filter(
          (s: any) => s.status === "pending"
        ).length,
        totalBusinesses: submissions.length + businesses.length, // Count both submissions and actual businesses
        newMessages: messages.filter((m: any) => m.status === "new").length, // Count only new messages
        totalUsers: profiles.length,
        premiumBusinesses: businesses.filter((b: any) => b.premium === true)
          .length, // Use 'premium' field not 'is_premium'
      };
    } catch (error) {
      console.error("Failed to get admin stats:", error);
      // Return empty stats on error
      return {
        pendingBusinesses: 0,
        totalBusinesses: 0,
        newMessages: 0,
        totalUsers: 0,
        premiumBusinesses: 0,
      };
    }
  }

  /**
   * Helper to create business entry from approved submission
   */
  private async createBusinessFromSubmission(submission: any): Promise<void> {
    try {
      // Use admin client for admin operations
      const client = supabaseAdmin || supabase;

      // Check if business already exists
      const { data: existingBusiness } = await client
        .from("businesses")
        .select("id")
        .eq("email", submission.email)
        .eq("name", submission.business_name)
        .single();

      if (existingBusiness) {
        console.log("Business already exists in directory");
        return;
      }

      // Normalize category to match database categories
      const normalizedCategory = this.normalizeCategoryForDatabase(submission.category);

      // Create business entry
      const { error: businessError } = await client.from("businesses").insert({
        business_id: `${normalizedCategory}-${submission.city}-${Date.now()}`
          .toLowerCase()
          .replace(/\s+/g, "-"),
        name: submission.business_name,
        description: submission.description,
        address: submission.address,
        phone: submission.phone,
        website: submission.website,
        email: submission.email,
        category: normalizedCategory,
        city: submission.city,
        state: submission.state,
        services: submission.services || [],
        hours: submission.hours,
        site_id: submission.site_id || "near-me-us",
        status: "active",
        premium: false,
        verified: false,
      });

      if (businessError) {
        console.error("Error creating business entry:", businessError);
        console.error("Submission category:", submission.category);
        console.error("Normalized category:", normalizedCategory);
        throw businessError;
      }

      console.log("Business entry created successfully");
    } catch (error) {
      console.error("Error creating business from submission:", error);
      throw error;
    }
  }

  /**
   * Normalize category names to match database categories
   */
  private normalizeCategoryForDatabase(category: string): string {
    if (!category) return "nail-salons"; // Default fallback
    
    // Map common category variations to database categories
    const categoryMap: Record<string, string> = {
      "nail salons": "nail-salons",
      "nail salon": "nail-salons", 
      "nail": "nail-salons",
      "nails": "nail-salons",
      "auto repair": "auto-repair",
      "automotive": "auto-repair",
      "car repair": "auto-repair",
      "auto": "auto-repair",
      "restaurants": "restaurants",
      "restaurant": "restaurants",
      "food": "restaurants",
      "beauty": "beauty-salons",
      "beauty salon": "beauty-salons",
      "beauty salons": "beauty-salons",
      "hair salon": "hair-salons",
      "hair salons": "hair-salons",
      "hair": "hair-salons",
      "fitness": "fitness-centers",
      "gym": "fitness-centers",
      "health": "healthcare",
      "medical": "healthcare",
      "dentist": "dentist",
      "dental": "dentist"
    };

    const normalizedInput = category.toLowerCase().trim();
    
    // Direct match
    if (categoryMap[normalizedInput]) {
      return categoryMap[normalizedInput];
    }
    
    // Convert spaces to dashes for database format
    const dashedCategory = normalizedInput.replace(/\s+/g, "-");
    
    // Return the dashed version or fallback to nail-salons
    return dashedCategory || "nail-salons";
  }
}
