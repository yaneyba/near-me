/// <reference types="vite/client" />
import React from 'react';
import { supabase } from './supabase';

export interface SimpleUser {
  id: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isOwner: boolean; // ADDED
  businessId?: string;
  businessName?: string;
  businessProfileId?: string;
  role?: string; // Add role field.
}

export interface AuthState {
  user: SimpleUser | null;
  loading: boolean;
}

// Simple feature flags (no complex database logic)
export interface AuthFeatureFlags {
  loginEnabled: boolean;
  trackingEnabled?: boolean;
  adsEnabled?: boolean;
}

// Role-based admin check - simple and clean
export function isAdminUser(supabaseUser: any): boolean {
  // Check if user has admin role in metadata
  return supabaseUser.user_metadata?.role === 'admin';
}

// ADDED: Super admin check
export function isSuperAdminUser(supabaseUser: any): boolean {
  // Check the is_super_admin column from auth.users table
  return supabaseUser.is_super_admin === true;
}

// ADDED: Owner check
export function isOwnerUser(supabaseUser: any): boolean {
  // Check if user has owner role in metadata
  return supabaseUser.user_metadata?.role === 'owner';
}

// Helper function to create user object
function createUserFromSupabaseUser(supabaseUser: any): SimpleUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email!,
    isAdmin: isAdminUser(supabaseUser), // Use enhanced admin check
    isSuperAdmin: isSuperAdminUser(supabaseUser), // ADDED
    isOwner: isOwnerUser(supabaseUser), // ADDED
    role: supabaseUser.user_metadata?.role, // Store the role
    businessId: supabaseUser.user_metadata?.businessId,
    businessName: supabaseUser.user_metadata?.businessName,
    businessProfileId: supabaseUser.user_metadata?.businessProfileId
  };
}

export class SimpleAuth {
  private static instance: SimpleAuth;
  private authState: AuthState = { user: null, loading: true };
  private listeners: Array<(state: AuthState) => void> = [];

  static getInstance(): SimpleAuth {
    if (!SimpleAuth.instance) {
      SimpleAuth.instance = new SimpleAuth();
    }
    return SimpleAuth.instance;
  }

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth session error:', error);
        this.updateState({ user: null, loading: false });
        return;
      }

      if (session?.user) {
        const user = createUserFromSupabaseUser(session.user);
        this.updateState({ user, loading: false });
      } else {
        this.updateState({ user: null, loading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_, session) => {
        if (session?.user) {
          const user = createUserFromSupabaseUser(session.user);
          this.updateState({ user, loading: false });
        } else {
          this.updateState({ user: null, loading: false });
        }
      });

    } catch (error) {
      console.error('Auth initialization error:', error);
      this.updateState({ user: null, loading: false });
    }
  }

  private updateState(newState: AuthState) {
    this.authState = newState;
    this.listeners.forEach(listener => listener(newState));
  }

  getState(): AuthState {
    return this.authState;
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const user = createUserFromSupabaseUser(data.user);
        this.updateState({ user, loading: false });
        return { success: true };
      }

      return { success: false, error: 'No user returned' };
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }

  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
      this.updateState({ user: null, loading: false });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}

// Hook for React components
export function useSimpleAuth(): AuthState & {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  authFeatures: AuthFeatureFlags;
} {
  const auth = SimpleAuth.getInstance();
  const [state, setState] = React.useState(auth.getState());

  React.useEffect(() => {
    const unsubscribe = auth.subscribe(setState);
    return unsubscribe;
  }, [auth]);

  return {
    ...state,
    signIn: auth.signIn.bind(auth),
    signOut: auth.signOut.bind(auth),
    authFeatures: getAuthFeatureFlags()
  };
}

// Main hook alias for compatibility
export const useAuth = useSimpleAuth;

// Simple sign in function
export const signIn = async (email: string, password: string) => {
  const auth = SimpleAuth.getInstance();
  const result = await auth.signIn(email, password);
  if (!result.success) {
    throw new Error(result.error || 'Sign in failed');
  }
  return result;
};

// Simple sign out function  
export const signOut = async () => {
  const auth = SimpleAuth.getInstance();
  return auth.signOut();
};

// Get current user
export const getCurrentUser = (): SimpleUser | null => {
  const auth = SimpleAuth.getInstance();
  return auth.getState().user;
};

// Check user role specifically
export const getUserRole = (): string | undefined => {
  const user = getCurrentUser();
  return user?.role;
};

// Check if user has admin role specifically
export const isUserAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.isAdmin || false;
};

// ADDED: Check if current user is super admin
export const isUserSuperAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.isSuperAdmin || false;
};

// ADDED: Check if current user is owner
export const isUserOwner = (): boolean => {
  const user = getCurrentUser();
  return user?.isOwner || false;
};

// Check if user has specific role
export const hasRole = (role: string): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};

// Check if current user is admin (alternative method)
export const hasAdminRole = (): boolean => {
  return hasRole('admin');
};

// ADDED: Check if user has super admin role specifically
export const hasSuperAdminRole = (): boolean => {
  const user = getCurrentUser();
  return user?.isSuperAdmin || false;
};

// ADDED: Check if user has owner role specifically
export const hasOwnerRole = (): boolean => {
  const user = getCurrentUser();
  return user?.isOwner || false;
};

export const getAuthFeatureFlags = (): AuthFeatureFlags => {
  return {
    loginEnabled: import.meta.env.VITE_SETTINGS_AUTH_LOGIN_ENABLED !== 'false',
    trackingEnabled: import.meta.env.VITE_SETTINGS_ENABLE_TRACKING !== 'false',
    adsEnabled: import.meta.env.VITE_SETTINGS_ENABLE_ADS !== 'false'
  };
};

export const updateDatabaseSettings = async (settings: Partial<AuthFeatureFlags>): Promise<boolean> => {
  // For now, just log - we'll build this up later
  console.log('Settings update requested (simplified):', settings);
  return true;
};