/// <reference types="vite/client" />
import React from 'react';

/**
 * AUTH SYSTEM - DISABLED/MOCK IMPLEMENTATION
 * 
 * This file provides a disabled authentication system that replaced the previous
 * Supabase-based authentication after Supabase was decommissioned from the application.
 * 
 * PURPOSE:
 * - Maintains API compatibility with existing components that expect auth functions
 * - Prevents breaking changes when removing Supabase dependencies
 * - Provides clear feedback that authentication is disabled
 * - Allows for future auth system implementation without changing component interfaces
 * 
 * CURRENT BEHAVIOR:
 * - All login attempts return "disabled" error messages
 * - All user checks return false/null (no authenticated users)
 * - All admin/owner checks return false (no privileged access)
 * - Feature flags still work based on environment variables
 * 
 * MIGRATION NOTES:
 * - Previous Supabase auth functions have been replaced with mock implementations
 * - Components using useAuth() will receive { user: null, loading: false }
 * - Login/signup forms will show "authentication disabled" messages
 * - Admin/owner protected routes will deny access (no authenticated users)
 * 
 * TO RE-ENABLE AUTH:
 * Replace this file with a new authentication implementation (e.g., Cloudflare Workers + D1,
 * Auth0, Firebase Auth, etc.) while maintaining the same interface signatures.
 */

export interface SimpleUser {
  id: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isOwner: boolean; // Business owner role
  businessId?: string; // Associated business ID
  businessName?: string; // Associated business name
  businessProfileId?: string; // Business profile identifier
  role?: string; // User role string ('admin', 'owner', etc.)
}

export interface AuthState {
  user: SimpleUser | null; // Currently authenticated user (always null in disabled state)
  loading: boolean; // Auth loading state (always false in disabled state)
}

// Simple feature flags (no complex database logic)
export interface AuthFeatureFlags {
  loginEnabled: boolean; // Whether login UI should be shown
  trackingEnabled?: boolean; // Whether analytics tracking is enabled
  adsEnabled?: boolean; // Whether ads should be displayed
}

// Disabled auth system - no Supabase dependencies
// All auth-related functions now return mock/disabled states

/**
 * MOCK USER ROLE CHECKS
 * These functions maintain compatibility with components that check user roles.
 * All return false since no users can be authenticated in the disabled state.
 */

// Mock implementation for compatibility
export function isAdminUser(_user: any): boolean {
  return false; // Auth disabled - no users can be admin
}

export function isSuperAdminUser(_user: any): boolean {
  return false; // Auth disabled - no users can be super admin
}

export function isOwnerUser(_user: any): boolean {
  return false; // Auth disabled - no users can be owners
}

/**
 * FEATURE FLAGS SYSTEM
 * Reads environment variables to determine which features are enabled.
 * This system still works even with auth disabled.
 */
// Simple feature flag checking
function getAuthFeatureFlags(): AuthFeatureFlags {
  const loginEnabled = import.meta.env.VITE_SETTINGS_AUTH_LOGIN_ENABLED === 'true';
  const trackingEnabled = import.meta.env.VITE_SETTINGS_ENABLE_TRACKING !== 'false';
  
  return {
    loginEnabled, // Whether to show login forms (disabled by default)
    trackingEnabled, // Whether to track user interactions (enabled by default)
  };
}

/**
 * REACT CONTEXT AND HOOKS
 * Provides auth state to React components while maintaining the same API
 * as the previous Supabase-based auth system.
 */

// Auth context and hooks (disabled/mock implementation)
const AuthContext = React.createContext<AuthState & { authFeatures: AuthFeatureFlags }>({
  user: null,
  loading: false,
  authFeatures: getAuthFeatureFlags()
});

/**
 * Main auth hook used by components
 * Returns disabled auth state but maintains API compatibility
 * 
 * @returns AuthState with user=null, loading=false, and feature flags
 */
// Simple disabled auth hook
export function useSimpleAuth() {
  const [authState] = React.useState<AuthState>({
    user: null, // No authenticated user
    loading: false // Not loading since auth is disabled
  });
  
  const authFeatures = React.useMemo(() => getAuthFeatureFlags(), []);

  return {
    ...authState,
    authFeatures
  };
}

/**
 * AUTHENTICATION FUNCTIONS
 * Mock implementations that return "disabled" messages for any auth attempts
 */

// Mock sign-in function
export async function signIn(_email: string, _password: string): Promise<{ user?: SimpleUser; error?: string }> {
  // Auth is disabled - return error message
  return {
    error: 'Authentication is currently disabled. Please contact the administrator.'
  };
}

// Mock sign-out function
export async function signOut(): Promise<void> {
  // No-op since auth is disabled
  console.log('Sign out requested, but auth is disabled');
}

/**
 * ACCESS CONTROL FUNCTIONS
 * These functions check user permissions but always return false in disabled state
 */

// Mock admin check functions for backwards compatibility
export function checkAdminAccess(_user: SimpleUser | null): boolean {
  return false; // Admin access disabled - no authenticated users
}

export function checkOwnerAccess(_user: SimpleUser | null): boolean {
  return false; // Owner access disabled - no authenticated users
}

/**
 * AUTH UTILITY FUNCTIONS
 * General auth utilities that maintain component compatibility
 */

// Auth utility functions (disabled)
export function requireAuth(): boolean {
  return false; // Auth not required since it's disabled
}

export function redirectToLogin(): void {
  console.log('Login redirect requested, but auth is disabled');
  // Could redirect to a "coming soon" page in the future
}

/**
 * EXPORTS AND ALIASES
 * Main exports that components use - maintains backward compatibility
 */

// Export the disabled auth hook as the main useAuth hook
export const useAuth = useSimpleAuth;

// Export AuthContext for any components that might need it
export { AuthContext };

/**
 * BACKWARD COMPATIBILITY FUNCTIONS
 * Additional mock functions to prevent breaking changes in existing components
 */

// Additional mock functions for backwards compatibility
export const getCurrentUser = (): SimpleUser | null => null; // No current user
export const getUserRole = (): string | undefined => undefined; // No user role
export const isUserAdmin = (): boolean => false; // No admin users
export const isUserSuperAdmin = (): boolean => false; // No super admin users
export const isUserOwner = (): boolean => false; // No owner users
export const hasRole = (_role: string): boolean => false; // No users with any role
export const hasAdminRole = (): boolean => false; // No admin role
export const hasSuperAdminRole = (): boolean => false; // No super admin role
export const hasOwnerRole = (): boolean => false; // No owner role
export { getAuthFeatureFlags }; // Re-export feature flags function

/**
 * SETTINGS MANAGEMENT
 * Mock implementation for database settings updates
 */
export const updateDatabaseSettings = async (_settings: Partial<AuthFeatureFlags>): Promise<boolean> => {
  console.log('Settings update requested, but auth is disabled');
  return false; // Settings updates disabled
};
