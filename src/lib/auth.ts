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
  trackingEnabled?: boolean;
}

// Default auth feature flags
const DEFAULT_AUTH_FEATURES: AuthFeatureFlags = {
  loginEnabled: true,
  trackingEnabled: true
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
      loginEnabled: import.meta.env.VITE_AUTH_LOGIN_ENABLED !== 'false',
      trackingEnabled: import.meta.env.VITE_TRACKING_ENABLED !== 'false'
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

// Get settings from database
export const getSettingsFromDatabase = async (): Promise<AuthFeatureFlags> => {
  try {
    const { data: loginSetting, error: loginError } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'login_enabled')
      .maybeSingle();
    
    const { data: trackingSetting, error: trackingError } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'tracking_enabled')
      .maybeSingle();
    
    if (loginError || trackingError) {
      console.error('Error fetching settings:', loginError || trackingError);
      return DEFAULT_AUTH_FEATURES;
    }
    
    return {
      loginEnabled: loginSetting?.value === 'true' ?? DEFAULT_AUTH_FEATURES.loginEnabled,
      trackingEnabled: trackingSetting?.value === 'true' ?? DEFAULT_AUTH_FEATURES.trackingEnabled
    };
  } catch (error) {
    console.error('Error getting settings from database:', error);
    return DEFAULT_AUTH_FEATURES;
  }
};

// Update settings in database (admin only)
export const updateDatabaseSettings = async (settings: Partial<AuthFeatureFlags>): Promise<boolean> => {
  try {
    const updates = [];
    
    if (settings.loginEnabled !== undefined) {
      updates.push(
        supabase
          .from('admin_settings')
          .update({ value: String(settings.loginEnabled) })
          .eq('key', 'login_enabled')
      );
    }
    
    if (settings.trackingEnabled !== undefined) {
      updates.push(
        supabase
          .from('admin_settings')
          .update({ value: String(settings.trackingEnabled) })
          .eq('key', 'tracking_enabled')
      );
    }
    
    await Promise.all(updates);
    
    // Also update local storage for immediate effect
    setAuthFeatureFlags(settings);
    
    return true;
  } catch (error) {
    console.error('Error updating database settings:', error);
    return false;
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
  try {
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
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Check if user is admin
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return user?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Custom hook for authentication state
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [authFeatures, setAuthFeatures] = useState<AuthFeatureFlags>(getAuthFeatureFlags());
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if Supabase is properly configured
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
          console.error('Supabase configuration missing. Check your .env file.');
          setError(new Error('Supabase configuration missing'));
          setLoading(false);
          return;
        }
        
        const user = await getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Error getting initial session:', error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          setSession(session);
          
          if (session) {
            const user = await getCurrentUser();
            setUser(user);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setError(error instanceof Error ? error : new Error('Unknown error'));
        } finally {
          setLoading(false);
        }
      }
    );

    // Listen for auth feature flag changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_feature_flags') {
        setAuthFeatures(getAuthFeatureFlags());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    // Fetch settings from database periodically
    const fetchDatabaseSettings = async () => {
      try {
        const dbSettings = await getSettingsFromDatabase();
        setAuthFeatures(prev => ({...prev, ...dbSettings}));
        
        // Update localStorage to match database
        setAuthFeatureFlags(dbSettings);
      } catch (error) {
        console.error('Error fetching database settings:', error);
      }
    };
    
    // Initial fetch
    fetchDatabaseSettings();
    
    // Set up interval to check for settings changes
    const interval = setInterval(fetchDatabaseSettings, 60000); // Check every minute

    // Cleanup subscriptions
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return { user, loading, session, authFeatures, error };
};