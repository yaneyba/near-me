// Simple Supabase client helper for Edge Functions
// This does NOT duplicate SupabaseDataProvider functionality

import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2.50.0";

let clientInstance: SupabaseClient | null = null;

/**
 * Get a configured Supabase client for Edge Functions
 * This is just a client factory - business logic should be in SupabaseDataProvider
 */
export function getSupabaseClient(): SupabaseClient {
  if (!clientInstance) {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    clientInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  
  return clientInstance;
}
