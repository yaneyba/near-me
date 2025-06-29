import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { useAuth } from '../../lib/auth';

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
  const { user, loading, authFeatures } = useAuth();
  const location = useLocation();

  // Get login enabled from auth features
  const loginEnabled = authFeatures?.loginEnabled ?? true;

  // Show loading screen while authentication is being checked
  if (loading) {
    return <LoadingScreen />;
  }

  // If login is disabled and trying to access login page, redirect to home
  if (!loginEnabled && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  // Handle authentication requirements
  if (requireAuth) {
    // Page requires authentication
    if (!user) {
      // User not logged in, redirect to login
      if (!loginEnabled) {
        return <Navigate to="/" replace />;
      }
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
    // User is logged in and page requires auth - allow access
    return <>{children}</>;
  } else {
    // Page doesn't require authentication
    if (!user) {
      // User not logged in - allow access to public pages
      return <>{children}</>;
    }
    
    // User is logged in but accessing a page that doesn't require auth
    // For auth-specific pages like login, redirect to dashboard
    if (location.pathname === '/login') {
      return user.isAdmin 
        ? <Navigate to="/admin/dashboard" replace />
        : <Navigate to="/business/dashboard" replace />;
    }
    
    // For other public pages, allow access
    return <>{children}</>;
  }
};

export default AuthGuard;