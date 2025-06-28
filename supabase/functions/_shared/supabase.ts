// Simple Supabase client factory for Edge Functions
import { createClient } from "npm:@supabase/supabase-js@2.50.0";

export function getSupabaseClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
