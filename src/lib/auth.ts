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

// Sign up with email and password
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
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

// Reset password
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) throw error;
  return data;
};

// Update password
export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  
  if (error) throw error;
  return data;
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

// Custom hook for authentication state
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

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

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, session };
};