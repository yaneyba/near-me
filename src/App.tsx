import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProviderFactory } from './providers/DataProviderFactory';
import { parseSubdomain } from './utils/subdomainParser';
import { SubdomainInfo } from './types';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SitemapPage from './pages/SitemapPage';
import AddBusinessPage from './pages/AddBusinessPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import BusinessOwnersPage from './pages/BusinessOwnersPage';
import BusinessDashboardPage from './pages/BusinessDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import AuthGuard from './components/auth/AuthGuard';
import { useAuth } from './lib/auth';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/CheckoutCancelPage';
import AdminSettingsTest from './components/AdminSettingsTest';
import SimpleSettingsTest from './components/SimpleSettingsTest';
import { FallbackTest } from './components/FallbackTest';

function App() {
  // Configure the data provider factory
  React.useEffect(() => {
    DataProviderFactory.configure({
      type: 'hybrid', // Use hybrid provider (JSON for business data, Supabase for forms)
      // In production, you might configure:
      // type: 'api',
      // apiBaseUrl: 'https://api.near-me.us',
      // apiKey: process.env.REACT_APP_API_KEY,
      // timeout: 10000,
      // retryAttempts: 3
    });
  }, []);

  // Parse subdomain info once at app level
  const subdomainInfo: SubdomainInfo = parseSubdomain();
  const { user } = useAuth();

  // Redirect admin users to admin dashboard
  React.useEffect(() => {
    if (user?.role === 'admin' && window.location.pathname === '/') {
      window.location.href = '/admin/dashboard';
    }
  }, [user]);

  return (
    <Router>
      <Layout subdomainInfo={subdomainInfo}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage subdomainInfo={subdomainInfo} />} />
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
          <Route 
            path="/business-dashboard" 
            element={
              <AuthGuard requireAuth={true}>
                <BusinessDashboardPage />
              </AuthGuard>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AuthGuard requireAuth={true}>
                <AdminDashboardPage />
              </AuthGuard>
            } 
          />
          
          {/* Simple Settings Test Route (no auth required) */}
          <Route 
            path="/settings-test" 
            element={<SimpleSettingsTest />}
          />
          
          {/* Fallback Test Route (no auth required) */}
          <Route 
            path="/fallback-test" 
            element={<FallbackTest />}
          />
          
          {/* Admin Settings Test Route (temporary for testing) */}
          <Route 
            path="/admin/settings-test" 
            element={
              <AuthGuard requireAuth={true}>
                <AdminSettingsTest />
              </AuthGuard>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;