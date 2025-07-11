import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProviderFactory } from '@/providers/DataProviderFactory';
import { parseSubdomain } from '@/utils/subdomainParser';
import { SubdomainInfo } from '@/types';
import HomePage from '@/pages/HomePage';
import ServicesHomePage from '@/pages/ServicesHomePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import SitemapPage from '@/pages/SitemapPage';
import AddBusinessPage from '@/pages/AddBusinessPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import BusinessOwnersPage from '@/pages/BusinessOwnersPage';
import BusinessDashboardPage from '@/pages/BusinessDashboardPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import LoginPage from '@/pages/LoginPage';
import { 
  HomePage as WaterRefillHomePage, 
  StationsPage as WaterRefillStationsPage, 
  DetailPage as WaterRefillDetailPage 
} from '@/pages/water-refill';
import { SubdomainLayout } from '@/components/layouts';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/lib/auth';
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage';
import CheckoutCancelPage from '@/pages/CheckoutCancelPage';

function App() {
  // Configure the data provider factory
  React.useEffect(() => {
    // For local development, always use JSON data
    // For production, use D1 when available
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1');
    const useD1 = !isLocalDev && import.meta.env.VITE_USE_D1 === 'true';
    const providerType = useD1 ? 'd1' : 'json';
    
    DataProviderFactory.configure({
      type: providerType,
      // D1 integration now fully operational with complete data
    });
    
    console.log(`Data provider configured: ${providerType} (localhost: ${isLocalDev}, VITE_USE_D1: ${import.meta.env.VITE_USE_D1})`);
  }, []);

  // Parse subdomain info once at app level
  const subdomainInfo: SubdomainInfo = parseSubdomain();
  const { user } = useAuth();

  // Redirect admin users to admin dashboard
  React.useEffect(() => {
    if (user?.isAdmin && window.location.pathname === '/') {
      window.location.href = '/admin/dashboard';
    }
  }, [user]);

  return (
    <Router>
      {subdomainInfo.isWaterRefill ? (
        /* Water Refill uses its own layout */
        <Routes>
          <Route 
            path="/" 
            element={<WaterRefillHomePage subdomainInfo={subdomainInfo} />} 
          />
          <Route 
            path="/stations" 
            element={<WaterRefillStationsPage subdomainInfo={subdomainInfo} />} 
          />
          <Route 
            path="/station/:stationId" 
            element={<WaterRefillDetailPage subdomainInfo={subdomainInfo} />} 
          />
          <Route 
            path="/:city" 
            element={<WaterRefillHomePage subdomainInfo={subdomainInfo} />} 
          />
        </Routes>
      ) : (
        /* All other pages use SubdomainLayout */
        <SubdomainLayout subdomainInfo={subdomainInfo}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                subdomainInfo.isServices ? 
                  <ServicesHomePage subdomainInfo={subdomainInfo} /> : 
                  <HomePage subdomainInfo={subdomainInfo} />
              } 
            />
          <Route path="/about" element={<AboutPage subdomainInfo={subdomainInfo} />} />
          <Route path="/contact" element={<ContactPage subdomainInfo={subdomainInfo} />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/sitemap-generator" element={<SitemapPage />} />
          <Route path="/add-business" element={<AddBusinessPage subdomainInfo={subdomainInfo} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/business-owners" element={<BusinessOwnersPage />} />
          
          {/* Checkout Routes */}
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
          
          {/* Auth Routes - Direct access to login */}
          <Route 
            path="/login" 
            element={<LoginPage />} 
          />
          
          {/* Redirect register to add-business */}
          <Route 
            path="/register" 
            element={<AuthGuard requireAuth={false} redirectTo="/add-business" />} 
          />
          
          {/* Protected Routes - Require authentication */}
          {/* Business Routes */}
          <Route 
            path="/business" 
            element={<Navigate to="/business/dashboard" replace />} 
          />
          
          <Route 
            path="/business/dashboard" 
            element={
              <AuthGuard requireAuth={true}>
                <BusinessDashboardPage />
              </AuthGuard>
            } 
          />
          
          {/* Legacy redirect for old business-dashboard URL */}
          <Route 
            path="/business-dashboard" 
            element={<Navigate to="/business/dashboard" replace />} 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={<Navigate to="/admin/dashboard" replace />} 
          />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <AuthGuard requireAuth={true}>
                <AdminDashboardPage />
              </AuthGuard>
            } 
          />
          </Routes>
        </SubdomainLayout>
      )}
    </Router>
  );
}

export default App;