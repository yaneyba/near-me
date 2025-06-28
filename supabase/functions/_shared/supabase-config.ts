// Shared Supabase client configuration
// This eliminates duplication while keeping frontend and Edge Functions separate

export interface SupabaseConfig {
  url: string;
  anonKey?: string;
  serviceRoleKey?: string;
  auth?: {
    autoRefreshToken: boolean;
    persistSession: boolean;
  };
}

/**
 * Default configuration for Supabase clients
 * This ensures consistent configuration across frontend and Edge Functions
 */
export const defaultSupabaseConfig = {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
};

/**
 * Validate Supabase configuration
 */
export function validateSupabaseConfig(config: SupabaseConfig): void {
  if (!config.url) {
    throw new Error("Missing SUPABASE_URL environment variable");
  }
  
  if (!config.anonKey && !config.serviceRoleKey) {
    throw new Error("Missing both SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY environment variables");
  }
}

/**
 * Environment variable names for different environments
 */
export const ENV_VARS = {
  // Frontend (Vite)
  FRONTEND: {
    URL: 'VITE_SUPABASE_URL',
    ANON_KEY: 'VITE_SUPABASE_ANON_KEY',
    SERVICE_ROLE_KEY: 'VITE_SUPABASE_SERVICE_ROLE_KEY'
  },
  // Edge Functions (Deno)
  EDGE_FUNCTIONS: {
    URL: 'SUPABASE_URL',
    SERVICE_ROLE_KEY: 'SUPABASE_SERVICE_ROLE_KEY'
  }
} as const;
