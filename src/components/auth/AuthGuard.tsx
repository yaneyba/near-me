import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, isAdminEmail } from '../../lib/auth';
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
  const { user, loading, error, authFeatures } = useAuth();
  const location = useLocation();
  const [isStable, setIsStable] = useState(false);

  // Add a small delay to prevent flashing on initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsStable(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get login enabled from auth features
  const loginEnabled = authFeatures?.loginEnabled ?? true;

  // Show loading screen while authentication is being checked or during initial stabilization
  if (loading || !isStable) {
    return <LoadingScreen />;
  }

  // If there was an auth error, redirect to home
  if (error) {
    console.error('Authentication error:', error);
    return <Navigate to="/" replace />;
  }

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

  // If trying to access a disabled auth route, redirect to home
  if (isDisabledAuthRoute()) {
    // If it's the register path, redirect to add-business
    if (location.pathname === '/register') {
      return <Navigate to="/add-business" replace />;
    }
    
    // Otherwise redirect to home
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
      // User not logged in - allow access (e.g., login page)
      return <>{children}</>;
    }
    
    // User is logged in but accessing a page that doesn't require auth
    // Only redirect if we're NOT on the login page (allow users to access login to switch accounts)
    if (location.pathname === '/login') {
      // Allow access to login page for account switching
      return <>{children}</>;
    }
    
    // For other pages that don't require auth, redirect to appropriate dashboard
    if (user.role === 'admin' || isAdminEmail(user.email)) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'owner') {
      return <Navigate to="/business/dashboard" replace />;
    } else {
      // Default to business dashboard for other roles
      return <Navigate to="/business/dashboard" replace />;
    }
  }
};

export default AuthGuard;