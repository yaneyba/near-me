import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, getAuthFeatureFlags } from '../../lib/auth';
import LoadingScreen from './LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { loginEnabled, registrationEnabled } = getAuthFeatureFlags();

  // Check if the current path is a disabled auth route
  const isDisabledAuthRoute = () => {
    const path = location.pathname;
    
    if (!loginEnabled) {
      // If login is disabled, block these routes
      if (path === '/login' || path === '/forgot-password' || path === '/reset-password') {
        return true;
      }
    }
    
    if (!registrationEnabled && path === '/register') {
      return true;
    }
    
    return false;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  // If trying to access a disabled auth route, redirect to home
  if (isDisabledAuthRoute()) {
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