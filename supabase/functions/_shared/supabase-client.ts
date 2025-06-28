// Shared Supabase client helper for Edge Functions
// Uses shared configuration to eliminate duplication with frontend

import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2.50.0";
import { defaultSupabaseConfig, validateSupabaseConfig, ENV_VARS } from "./supabase-config.ts";

let clientInstance: SupabaseClient | null = null;

/**
 * Get a configured Supabase client for Edge Functions
 * Uses shared configuration to ensure consistency with frontend
 */
export function getSupabaseClient(): SupabaseClient {
  if (!clientInstance) {
    const supabaseUrl = Deno.env.get(ENV_VARS.EDGE_FUNCTIONS.URL);
    const supabaseServiceKey = Deno.env.get(ENV_VARS.EDGE_FUNCTIONS.SERVICE_ROLE_KEY);

    // Validate configuration using shared validation logic
    validateSupabaseConfig({
      url: supabaseUrl!,
      serviceRoleKey: supabaseServiceKey!
    });

    clientInstance = createClient(supabaseUrl!, supabaseServiceKey!, defaultSupabaseConfig);
  }
  
  return clientInstance;
}
