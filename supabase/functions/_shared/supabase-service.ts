// Shared Supabase service for Edge Functions
// This mirrors the SupabaseDataProvider logic but for Deno runtime

import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2.50.0";

export interface SupabaseService {
  updateBusinessProfile(id: string, updates: any): Promise<{ success: boolean; error?: string }>;
  getBusinessProfile(id: string): Promise<{ data: any; error?: string }>;
  getBusinessProfileByStripeCustomer(customerId: string): Promise<{ data: any; error?: string }>;
  getBusinessProfileByUserId(userId: string): Promise<{ data: any; error?: string }>;
  getStripeCustomer(businessProfileId: string): Promise<{ data: any; error?: string }>;
  createStripeCustomer(userId: string, businessProfileId: string, customerId: string): Promise<{ success: boolean; error?: string }>;
  createStripeSubscription(customerId: string, status?: string): Promise<{ success: boolean; error?: string }>;
  getStripeSubscription(customerId: string): Promise<{ data: any; error?: string }>;
  createStripeOrder(orderData: any): Promise<{ success: boolean; error?: string }>;
  updateBusinessProfileByStripeCustomer(customerId: string, updates: any): Promise<{ success: boolean; error?: string }>;
  getUserFromToken(token: string): Promise<{ data: any; error?: string }>;
}

export class EdgeSupabaseService implements SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  async updateBusinessProfile(id: string, updates: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("business_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        console.error("Error updating business profile:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Failed to update business profile:", error);
      return { success: false, error: errorMessage };
    }
  }

  async getBusinessProfile(id: string): Promise<{ data: any; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("business_profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching business profile:", error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Failed to get business profile:", error);
      return { data: null, error: errorMessage };
    }
  }

  async getBusinessProfileByStripeCustomer(customerId: string): Promise<{ data: any; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("business_profiles")
        .select("*")
        .eq("stripe_customer_id", customerId)
        .single();

      if (error) {
        console.error("Error fetching business profile by customer:", error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Failed to get business profile by customer:", error);
      return { data: null, error: errorMessage };
    }
  }

  async getBusinessProfileByUserId(userId: string): Promise<{ data: any; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("business_profiles")
        .select("id")
        .eq("user_id", userId)
        .is("deleted_at", null)
        .maybeSingle();

      if (error) {
        console.error("Error fetching business profile by user:", error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Failed to get business profile by user:", error);
      return { data: null, error: errorMessage };
    }
  }

  async getStripeCustomer(businessProfileId: string): Promise<{ data: any; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("stripe_customers")
        .select("customer_id")
        .eq("business_profile_id", businessProfileId)
        .is("deleted_at", null)
        .maybeSingle();

      if (error) {
        console.error("Error fetching stripe customer:", error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Failed to get stripe customer:", error);
      return { data: null, error: errorMessage };
    }
  }

  async createStripeCustomer(userId: string, businessProfileId: string, customerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("stripe_customers")
        .insert({
          user_id: userId,
          business_profile_id: businessProfileId,
          customer_id: customerId,
        });

      if (error) {
        console.error("Error creating stripe customer:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Failed to create stripe customer:", error);
      return { success: false, error: errorMessage };
    }
  }

  async createStripeSubscription(customerId: string, status = "not_started"): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("stripe_subscriptions")
        .insert({
          customer_id: customerId,
          status,
        });

      if (error) {
        console.error("Error creating stripe subscription:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Failed to create stripe subscription:", error);
      return { success: false, error: errorMessage };
    }
  }

  async getStripeSubscription(customerId: string): Promise<{ data: any; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("stripe_subscriptions")
        .select("status")
        .eq("customer_id", customerId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching stripe subscription:", error);
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Failed to get stripe subscription:", error);
      return { data: null, error: errorMessage };
    }
  }

  async createStripeOrder(orderData: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("stripe_orders")
        .insert(orderData);

      if (error) {
        console.error("Error creating stripe order:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Failed to create stripe order:", error);
      return { success: false, error: errorMessage };
    }
  }

  async updateBusinessProfileByStripeCustomer(customerId: string, updates: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("business_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq("stripe_customer_id", customerId);

      if (error) {
        console.error("Error updating business profile by customer:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Failed to update business profile by customer:", error);
      return { success: false, error: errorMessage };
    }
  }

  async getUserFromToken(token: string): Promise<{ data: any; error?: string }> {
    try {
      const {
        data: { user },
        error,
      } = await this.supabase.auth.getUser(token);

      if (error) {
        console.error("Error getting user from token:", error);
        return { data: null, error: error.message };
      }

      return { data: user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Failed to get user from token:", error);
      return { data: null, error: errorMessage };
    }
  }

  // Direct Supabase client access for complex operations (use sparingly)
  getClient(): SupabaseClient {
    return this.supabase;
  }
}

// Singleton instance
let serviceInstance: EdgeSupabaseService | null = null;

export function getSupabaseService(): EdgeSupabaseService {
  if (!serviceInstance) {
    serviceInstance = new EdgeSupabaseService();
  }
  return serviceInstance;
}
