import { createClient } from '@supabase/supabase-js';

// These will be set via environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
          hours: any | null;
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
          event_data: any | null;
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
    };
    Enums: {
      submission_status: 'pending' | 'approved' | 'rejected';
    };
  };
}