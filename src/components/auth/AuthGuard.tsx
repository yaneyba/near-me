import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, getAuthFeatureFlags } from '../../lib/auth';
import LoadingScreen from './LoadingScreen';

interface AuthGuardProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  const { loginEnabled } = getAuthFeatureFlags();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // 5 second timeout
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Check if the current path is a disabled auth route
  const isDisabledAuthRoute = () => {
    const path = location.pathname;
    
    if (!loginEnabled) {
      // If login is disabled, block these routes
      if (path === '/login') {
        return true;
      }
    }
    
    // Handle register path - redirect to add-business
    if (path === '/register') {
      return true;
    }
    
    return false;
  };

  // If loading timed out, redirect to home
  if (loadingTimeout) {
    console.error('Authentication loading timed out');
    return <Navigate to="/" replace />;
  }

  // Show loading screen for a reasonable time
  if (loading && !loadingTimeout) {
    return <LoadingScreen />;
  }

  // If there was an auth error, redirect to home
  if (error) {
    console.error('Authentication error:', error);
    return <Navigate to="/" replace />;
  }

  // If trying to access a disabled auth route, redirect to home
  if (isDisabledAuthRoute()) {
    // If it's the register path, redirect to add-business
    if (location.pathname === '/register') {
      return <Navigate to="/add-business" replace />;
    }
    
    // Otherwise redirect to home
    return <Navigate to="/" replace />;
  }

  if (requireAuth && !user) {
    // If login is disabled and auth is required, redirect to home instead of login
    if (!loginEnabled) {
      return <Navigate to="/" replace />;
    }
    
    // Otherwise redirect to login page but save the current location
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    // If we're on a page that doesn't require auth but user is logged in
    // (like login page), redirect to dashboard
    return <Navigate to="/business-dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;