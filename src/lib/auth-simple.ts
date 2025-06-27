import { supabase } from './supabase';
import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';

// Simple auth user interface
export interface AuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

// Check if user is admin by email
export const isAdminEmail = (email: string): boolean => {
  const adminEmails = ['yaneyba@finderhubs.com'];
  return adminEmails.includes(email);
};

// Simple sign in
export const signIn = async (email: string, password: string) => {
  console.log('🔐 Simple signIn called with email:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error('❌ Auth error:', error);
    throw error;
  }
  
  console.log('✅ Login successful');
  return data;
};

// Simple sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Get current authenticated user (simple version)
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }
    
    return {
      id: session.user.id,
      email: session.user.email || '',
      isAdmin: isAdminEmail(session.user.email || '')
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Check if current user is admin
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    return user?.isAdmin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Simple auth hook
export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log('🔄 useAuth: Initializing...');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📋 Initial session:', !!session);
        
        setSession(session);
        
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            isAdmin: isAdminEmail(session.user.email || '')
          };
          setUser(authUser);
          console.log('👤 User set:', authUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Error getting initial session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, !!session);
        
        setSession(session);
        
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            isAdmin: isAdminEmail(session.user.email || '')
          };
          setUser(authUser);
          console.log('👤 User updated:', authUser);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, session };
};
