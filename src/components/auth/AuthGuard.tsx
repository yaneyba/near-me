import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { useAuth } from '../../lib/auth';

interface AuthGuardProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
  requireSuperAdmin?: boolean; // NEW
  requireOwner?: boolean; // NEW
  redirectTo?: string;
  fallbackComponent?: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  requireSuperAdmin = false, // NEW
  requireOwner = false, // NEW
  redirectTo = '/login',
  fallbackComponent
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
  if (requireAuth || requireSuperAdmin || requireOwner) {
    // Page requires some form of authentication
    if (!user) {
      // User not logged in, redirect to login
      if (!loginEnabled) {
        return <Navigate to="/" replace />;
      }
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check super admin requirement
    if (requireSuperAdmin && !user.isSuperAdmin) {
      return fallbackComponent || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <div className="text-red-600 text-4xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You need super administrator privileges to access this area.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => window.history.back()} 
                className="block w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Go Back
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Check owner requirement
    if (requireOwner && !user.isOwner) {
      return fallbackComponent || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <div className="text-orange-600 text-4xl mb-4">👔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Business Owner Access Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be a verified business owner to access this area.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => window.history.back()} 
                className="block w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Go Back
              </button>
              <button 
                onClick={() => window.location.href = '/business/apply'} 
                className="block w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Apply as Business Owner
              </button>
            </div>
          </div>
        </div>
      );
    }

    // User meets authentication requirements - allow access
    return <>{children}</>;
  } else {
    // Page doesn't require authentication
    if (!user) {
      // User not logged in - allow access to public pages
      return <>{children}</>;
    }
    
    // User is logged in but accessing a page that doesn't require auth
    // For auth-specific pages like login, redirect based on role
    if (location.pathname === '/login') {
      // Redirect based on user role hierarchy
      if (user.isSuperAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (user.isOwner) {
        return <Navigate to="/business/dashboard" replace />;
      } else if (user.isAdmin) {
        // Regular admins currently have no dashboard access
        return <Navigate to="/" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
    
    // For other public pages, allow access
    return <>{children}</>;
  }
};

// Convenience wrapper components for specific role requirements
export const SuperAdminGuard: React.FC<Omit<AuthGuardProps, 'requireSuperAdmin'>> = (props) => (
  <AuthGuard {...props} requireSuperAdmin={true} />
);

export const OwnerGuard: React.FC<Omit<AuthGuardProps, 'requireOwner'>> = (props) => (
  <AuthGuard {...props} requireOwner={true} />
);

export default AuthGuard;