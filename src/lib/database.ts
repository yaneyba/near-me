// Type definitions for better type safety
export interface BusinessHours {
  [day: string]: {
    open: string;
    close: string;
    closed?: boolean;
  } | null;
}

export interface EventData {
  [key: string]: unknown;
}

export interface AdminSettingValue {
  [key: string]: unknown;
}

// Database types matching your existing schema with submission_status enum
export interface Database {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          category: string | null;
          city: string | null;
          status: string | null;
          admin_notes: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          category?: string | null;
          city?: string | null;
          status?: string | null;
          admin_notes?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          category?: string | null;
          city?: string | null;
          status?: string | null;
          admin_notes?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      business_submissions: {
        Row: {
          id: string;
          business_name: string;
          owner_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          category: string;
          website: string | null;
          description: string | null;
          services: string[] | null;
          hours: BusinessHours | null;
          status: Database['public']['Enums']['submission_status'] | null;
          submitted_at: string | null;
          reviewed_at: string | null;
          reviewer_notes: string | null;
          site_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          business_name: string;
          owner_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          category: string;
          website?: string | null;
          description?: string | null;
          services?: string[] | null;
          hours?: any | null;
          status?: Database['public']['Enums']['submission_status'] | null;
          submitted_at?: string | null;
          reviewed_at?: string | null;
          reviewer_notes?: string | null;
          site_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          business_name?: string;
          owner_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          category?: string;
          website?: string | null;
          description?: string | null;
          services?: string[] | null;
          hours?: any | null;
          status?: Database['public']['Enums']['submission_status'] | null;
          submitted_at?: string | null;
          reviewed_at?: string | null;
          reviewer_notes?: string | null;
          site_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      user_engagement_events: {
        Row: {
          id: string;
          business_id: string;
          business_name: string;
          event_type: string;
          event_data: EventData | null;
          timestamp: string;
          ip_address: string | null;
          user_session_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          business_name: string;
          event_type: string;
          event_data?: any | null;
          timestamp?: string;
          ip_address?: string | null;
          user_session_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          business_id?: string;
          business_name?: string;
          event_type?: string;
          event_data?: any | null;
          timestamp?: string;
          ip_address?: string | null;
          user_session_id?: string;
          created_at?: string | null;
        };
      };
      business_profiles: {
        Row: {
          id: string;
          user_id: string;
          business_id: string | null;
          business_name: string;
          email: string;
          role: string;
          approval_status: string | null;
          approved_at: string | null;
          approved_by: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          stripe_price_id: string | null;
          stripe_current_period_end: number | null;
          stripe_subscription_status: string | null;
          cancel_at_period_end: boolean | null;
          premium: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_id?: string | null;
          business_name: string;
          email: string;
          role?: string;
          approval_status?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          stripe_current_period_end?: number | null;
          stripe_subscription_status?: string | null;
          cancel_at_period_end?: boolean | null;
          premium?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_id?: string | null;
          business_name?: string;
          email?: string;
          role?: string;
          approval_status?: string | null;
          approved_at?: string | null;
          approved_by?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          stripe_price_id?: string | null;
          stripe_current_period_end?: number | null;
          stripe_subscription_status?: string | null;
          cancel_at_period_end?: boolean | null;
          premium?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      businesses: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          description: string | null;
          address: string;
          phone: string | null;
          website: string | null;
          email: string | null;
          rating: number | null;
          review_count: number | null;
          category: string;
          city: string;
          state: string;
          services: string[] | null;
          verified: boolean | null;
          hours: BusinessHours | null;
          image: string | null;
          established: number | null;
          site_id: string;
          status: string | null;
          premium: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          description?: string | null;
          address: string;
          phone?: string | null;
          website?: string | null;
          email?: string | null;
          rating?: number | null;
          review_count?: number | null;
          category: string;
          city: string;
          state: string;
          services?: string[] | null;
          verified?: boolean | null;
          hours?: any | null;
          image?: string | null;
          established?: number | null;
          site_id?: string;
          status?: string | null;
          premium?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          description?: string | null;
          address?: string;
          phone?: string | null;
          website?: string | null;
          email?: string | null;
          rating?: number | null;
          review_count?: number | null;
          category?: string;
          city?: string;
          state?: string;
          services?: string[] | null;
          verified?: boolean | null;
          hours?: any | null;
          image?: string | null;
          established?: number | null;
          site_id?: string;
          status?: string | null;
          premium?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      admin_settings: {
        Row: {
          id: string;
          key: string;
          value: AdminSettingValue;
          description: string | null;
          created_at: string | null;
          updated_at: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          key: string;
          value: AdminSettingValue;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          key?: string;
          value?: any;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          updated_by?: string | null;
        };
      };
    };
    Enums: {
      submission_status: 'pending' | 'approved' | 'rejected';
    };
  };
}
