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
  adsEnabled?: boolean;
}

// Get auth feature flags from localStorage or environment variables (synchronous fallback)
// Get environment variable based fallback settings
export const getEnvironmentFallbackSettings = (): AuthFeatureFlags => {
  return {
    loginEnabled: import.meta.env.VITE_SETTINGS_AUTH_LOGIN_ENABLED !== 'false',
    trackingEnabled: import.meta.env.VITE_SETTINGS_TRACKING_ENABLED !== 'false',
    adsEnabled: import.meta.env.VITE_SETTINGS_ENABLE_ADS !== 'false'
  };
};

export const getAuthFeatureFlags = (): AuthFeatureFlags => {
  try {
    // Check if we have flags in localStorage (admin has set them)
    const savedFlags = localStorage.getItem('auth_feature_flags');
    if (savedFlags) {
      const parsed = JSON.parse(savedFlags);
      // Verify the saved flags have valid values, otherwise fall back to env
      if (typeof parsed.loginEnabled === 'boolean' && 
          typeof parsed.trackingEnabled === 'boolean' &&
          typeof parsed.adsEnabled === 'boolean') {
        return parsed;
      }
    }
    
    // Fall back to environment variables if localStorage is empty or invalid
    return getEnvironmentFallbackSettings();
  } catch (error) {
    console.error('Error getting auth feature flags, using environment fallback:', error);
    return getEnvironmentFallbackSettings();
  }
};

// Get auth feature flags with database priority (async)
export const getAuthFeatureFlagsAsync = async (): Promise<AuthFeatureFlags> => {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database timeout after 2 seconds')), 2000);
    });
    
    // Race between database call and timeout
    const dbSettings = await Promise.race([
      getSettingsFromDatabase(),
      timeoutPromise
    ]);
    
    // Cache the database settings in localStorage for faster access
    localStorage.setItem('auth_feature_flags', JSON.stringify(dbSettings));
    
    return dbSettings;
  } catch (error) {
    console.warn('Database settings unavailable, using environment variables:', error instanceof Error ? error.message : String(error));
    
    // Clear localStorage cache if database is unavailable to force env var usage
    try {
      localStorage.removeItem('auth_feature_flags');
    } catch (storageError) {
      // Ignore localStorage errors
    }
    
    // Fallback directly to environment variables for reliability
    return getEnvironmentFallbackSettings();
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
    
    const { data: adsSetting, error: adsError } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'ads_enabled')
      .maybeSingle();
    
    if (loginError || trackingError || adsError) {
      console.error('Error fetching settings:', loginError || trackingError || adsError);
      return getEnvironmentFallbackSettings();
    }
    
    // Handle jsonb values - they could be boolean, string, or null
    const parseSettingValue = (setting: any, defaultValue: boolean): boolean => {
      if (!setting || setting.value === null || setting.value === undefined) {
        return defaultValue;
      }
      
      // Handle different possible value types in jsonb
      if (typeof setting.value === 'boolean') {
        return setting.value;
      }
      
      if (typeof setting.value === 'string') {
        return setting.value.toLowerCase() === 'true';
      }
      
      return defaultValue;
    };
    
    const envFallback = getEnvironmentFallbackSettings();
    return {
      loginEnabled: parseSettingValue(loginSetting, envFallback.loginEnabled),
      trackingEnabled: parseSettingValue(trackingSetting, envFallback.trackingEnabled ?? true),
      adsEnabled: parseSettingValue(adsSetting, envFallback.adsEnabled ?? false)
    };
  } catch (error) {
    console.error('Error getting settings from database:', error);
    return getEnvironmentFallbackSettings();
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
    
    if (settings.adsEnabled !== undefined) {
      updates.push(
        supabase
          .from('admin_settings')
          .update({ value: String(settings.adsEnabled) })
          .eq('key', 'ads_enabled')
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
    // Get initial session and auth features
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
        
        // Start with fallback settings immediately to prevent hanging
        const fallbackSettings = getAuthFeatureFlags();
        setAuthFeatures(fallbackSettings);
        
        const user = await getCurrentUser();
        setUser(user);
        
        // Load database settings in background after auth is complete
        setTimeout(async () => {
          try {
            const dbSettings = await getAuthFeatureFlagsAsync();
            setAuthFeatures(dbSettings);
          } catch (bgError) {
            // Keep fallback settings if database fails
          }
        }, 100);
        
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