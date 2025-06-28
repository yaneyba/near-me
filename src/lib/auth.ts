/// <reference types="vite/client" />
import React from 'react';
import { supabase } from './supabase';

export interface SimpleUser {
  id: string;
  email: string;
  isAdmin: boolean;
  businessId?: string;
  businessName?: string;
  businessProfileId?: string;
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

// Simple admin check - get from environment variables
function getAdminEmails(): string[] {
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS;
  if (!adminEmails) {
    console.warn('VITE_ADMIN_EMAILS not set in environment variables');
    return [];
  }
  return adminEmails.split(',').map((email: string) => email.trim().toLowerCase());
}

export function isAdminEmail(email: string): boolean {
  const adminEmails = getAdminEmails();
  return adminEmails.includes(email.toLowerCase());
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
        const user: SimpleUser = {
          id: session.user.id,
          email: session.user.email!,
          isAdmin: isAdminEmail(session.user.email!)
        };
        this.updateState({ user, loading: false });
      } else {
        this.updateState({ user: null, loading: false });
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const user: SimpleUser = {
            id: session.user.id,
            email: session.user.email!,
            isAdmin: isAdminEmail(session.user.email!)
          };
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
      console.log('🔐 Simple Auth: Starting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('🔐 Simple Auth: Supabase response:', { data: !!data, error });

      if (error) {
        console.error('🔐 Simple Auth: Sign in error:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('🔐 Simple Auth: User authenticated:', data.user.email);
        const user: SimpleUser = {
          id: data.user.id,
          email: data.user.email!,
          isAdmin: isAdminEmail(data.user.email!)
        };
        console.log('🔐 Simple Auth: Created user object:', user);
        this.updateState({ user, loading: false });
        return { success: true };
      }

      console.log('🔐 Simple Auth: No user returned');
      return { success: false, error: 'No user returned' };
    } catch (error) {
      console.error('🔐 Simple Auth: Sign in exception:', error);
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
export const getCurrentUser = async (): Promise<SimpleUser | null> => {
  const auth = SimpleAuth.getInstance();
  return auth.getState().user;
};

// Check if user is admin (simple version)
export const isUserAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.isAdmin || false;
};

export const getAuthFeatureFlags = (): AuthFeatureFlags => {
  return {
    loginEnabled: import.meta.env.VITE_SETTINGS_AUTH_LOGIN_ENABLED !== 'false',
    trackingEnabled: import.meta.env.VITE_SETTINGS_TRACKING_ENABLED !== 'false',
    adsEnabled: import.meta.env.VITE_SETTINGS_ENABLE_ADS !== 'false'
  };
};

export const updateDatabaseSettings = async (settings: Partial<AuthFeatureFlags>): Promise<boolean> => {
  // For now, just log - we'll build this up later
  console.log('Settings update requested (simplified):', settings);
  return true;
};
