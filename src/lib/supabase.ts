import { createClient } from '@supabase/supabase-js';

// Use process.env for Node.js environments (like generate-sitemap.js)
// and import.meta.env for Vite environments (like the main app)
const supabaseUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY : process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env.local file and accessible to the current environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Persist session in local storage
    autoRefreshToken: true, // Automatically refresh token
    detectSessionInUrl: true // Detect session from URL (useful for OAuth)
  }
});

// Service role client for admin operations (bypasses RLS)
export const supabaseAdmin = supabaseServiceRoleKey ? createClient(
  supabaseUrl!,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
) : null;

// Helper functions
export const isAdminClientAvailable = (): boolean => {
  return supabaseAdmin !== null;
};
