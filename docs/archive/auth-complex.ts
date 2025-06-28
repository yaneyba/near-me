import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// Admin helper function - now uses environment variables
export const isAdminEmail = (email: string): boolean => {
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS;
  if (!adminEmails) {
    console.warn('VITE_ADMIN_EMAILS not set in environment variables');
    return false;
  }
  const emailList = adminEmails.split(',').map((e: string) => e.trim().toLowerCase());
  return emailList.includes(email.toLowerCase());
};

// Types for authentication - aligned with production schema
export interface AuthUser {
  id: string;
  email: string;
  businessId?: string;
  businessName?: string;
  businessProfileId?: string;
  role?: 'owner' | 'admin' | 'staff';
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  premium?: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeSubscriptionStatus?: string;
  currentPeriodEnd?: number;
  cancelAtPeriodEnd?: boolean;
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
  console.log('signIn called with email:', email);
  
  // Check if login is enabled
  const { loginEnabled } = getAuthFeatureFlags();
  if (!loginEnabled) {
    throw new Error('Login is currently disabled');
  }
  
  console.log('Login is enabled, proceeding with Supabase auth');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Supabase auth response:', { data: !!data, error: error?.message });
    
    if (error) {
      console.error('Supabase auth error:', error);
      throw error;
    }
    
    console.log('Login successful');
    return data;
  } catch (error) {
    console.error('signIn error:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Get current user - separated admin vs business logic
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    console.log('getCurrentUser: Starting...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('getCurrentUser: No session found');
      return null;
    }
    
    console.log('getCurrentUser: Session found for email:', session.user.email);
    
    // Check if this is an admin user first (by email)
    // Admins are NOT businesses and don't need business_profiles entries
    if (isAdminEmail(session.user.email || '')) {
      console.log('getCurrentUser: Admin user detected - returning admin data without business profile');
      return {
        id: session.user.id,
        email: session.user.email || '',
        role: 'admin',
        businessName: undefined, // Admins don't have business names
        businessId: undefined,
        businessProfileId: undefined,
        approvalStatus: undefined, // Admins don't need approval
        premium: false, // Admins don't have premium subscriptions
        stripeCustomerId: undefined,
        stripeSubscriptionId: undefined,
        stripePriceId: undefined,
        stripeSubscriptionStatus: undefined,
        currentPeriodEnd: undefined,
        cancelAtPeriodEnd: false
      };
    }
    
    console.log('getCurrentUser: Non-admin user - fetching business profile...');
    
    // For non-admin users, get business profile data
    const { data: profile, error } = await supabase
      .from('business_profiles')
      .select('id, business_id, business_name, role, approval_status, premium')
      .eq('user_id', session.user.id)
      .maybeSingle(); // Use maybeSingle to handle no results gracefully
    
    if (error) {
      console.error('Error fetching user profile:', error);
      // Return basic user data without profile for non-admin users
      return {
        id: session.user.id,
        email: session.user.email || '',
        role: undefined, // No role for users without profiles
        businessName: undefined,
        businessId: undefined,
        businessProfileId: undefined,
        approvalStatus: undefined,
        premium: false,
        stripeCustomerId: undefined,
        stripeSubscriptionId: undefined,
        stripePriceId: undefined,
        stripeSubscriptionStatus: undefined,
        currentPeriodEnd: undefined,
        cancelAtPeriodEnd: false
      };
    }
    
    console.log('getCurrentUser: Business profile fetched successfully');
    
    return {
      id: session.user.id,
      email: session.user.email || '',
      businessId: profile?.business_id,
      businessName: profile?.business_name,
      businessProfileId: profile?.id,
      role: profile?.role,
      approvalStatus: profile?.approval_status,
      premium: profile?.premium || false,
      // Stripe data not needed for basic auth flow
      stripeCustomerId: undefined,
      stripeSubscriptionId: undefined,
      stripePriceId: undefined,
      stripeSubscriptionStatus: undefined,
      currentPeriodEnd: undefined,
      cancelAtPeriodEnd: false
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Helper functions for business status checks
export const isUserApproved = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return user?.approvalStatus === 'approved';
  } catch (error) {
    console.error('Error checking approval status:', error);
    return false;
  }
};

export const isUserPremium = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return user?.premium === true;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

export const canUserSubscribe = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    // Only approved business owners can subscribe
    return user?.approvalStatus === 'approved' && user?.role === 'owner';
  } catch (error) {
    console.error('Error checking subscription eligibility:', error);
    return false;
  }
};

// Check if user is admin - use email-based detection, not business_profiles
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.email) {
      return false;
    }
    
    // Direct email check - admins are NOT businesses
    return isAdminEmail(session.user.email);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Synchronous admin check for immediate use
export const isCurrentUserAdmin = (): boolean => {
  // This can only work if we have the user data already loaded
  // Use this for UI decisions, use isUserAdmin() for authorization
  try {
    // Check if we have user data in localStorage or similar
    // For now, return false and rely on isUserAdmin() for actual checks
    return false;
  } catch (error) {
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