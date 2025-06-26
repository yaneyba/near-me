import { supabase } from './supabase';
import { User, Session } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// Types for authentication
export interface AuthUser {
  id: string;
  email: string;
  businessId?: string;
  businessName?: string;
  role?: 'owner' | 'admin' | 'staff';
}

// Auth feature flags
export interface AuthFeatureFlags {
  loginEnabled: boolean;
}

// Default auth feature flags
const DEFAULT_AUTH_FEATURES: AuthFeatureFlags = {
  loginEnabled: true
};

// Get auth feature flags from localStorage or environment variables
export const getAuthFeatureFlags = (): AuthFeatureFlags => {
  try {
    // Check if we have flags in localStorage (admin has set them)
    const savedFlags = localStorage.getItem('auth_feature_flags');
    if (savedFlags) {
      return JSON.parse(savedFlags);
    }
    
    // Otherwise use environment variables if available
    return {
      loginEnabled: import.meta.env.VITE_AUTH_LOGIN_ENABLED !== 'false'
    };
  } catch (error) {
    console.error('Error getting auth feature flags:', error);
    return DEFAULT_AUTH_FEATURES;
  }
};

// Set auth feature flags (admin only)
export const setAuthFeatureFlags = (flags: Partial<AuthFeatureFlags>): void => {
  try {
    const currentFlags = getAuthFeatureFlags();
    const updatedFlags = { ...currentFlags, ...flags };
    localStorage.setItem('auth_feature_flags', JSON.stringify(updatedFlags));
  } catch (error) {
    console.error('Error setting auth feature flags:', error);
  }
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  // Check if login is enabled
  const { loginEnabled } = getAuthFeatureFlags();
  if (!loginEnabled) {
    throw new Error('Login is currently disabled');
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Get current user
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return null;
  
  // Get user profile data from profiles table
  const { data: profile, error } = await supabase
    .from('business_profiles')
    .select('business_id, business_name, role')
    .eq('user_id', session.user.id)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user profile:', error);
  }
  
  return {
    id: session.user.id,
    email: session.user.email || '',
    businessId: profile?.business_id,
    businessName: profile?.business_name,
    role: profile?.role
  };
};

// Check if user is admin
export const isUserAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === 'admin';
};

// Custom hook for authentication state
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [authFeatures, setAuthFeatures] = useState<AuthFeatureFlags>(getAuthFeatureFlags());

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        
        if (session) {
          const user = await getCurrentUser();
          setUser(user);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Listen for auth feature flag changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_feature_flags') {
        setAuthFeatures(getAuthFeatureFlags());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    // Cleanup subscriptions
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { user, loading, session, authFeatures };
};