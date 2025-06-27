import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import AdminSettingsPage from './pages/AdminSettingsPage';
import Layout from './components/Layout';
import AuthGuard from './components/auth/AuthGuard';
import { useAuth } from './lib/auth';

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

  // Get auth context
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

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
          
          {/* Business Owners Page - Redirect admins to admin settings */}
          <Route 
            path="/business-owners" 
            element={
              isAdmin ? <Navigate to="/admin/settings" replace /> : <BusinessOwnersPage />
            } 
          />
          
          {/* Auth Routes - Accessible only when NOT logged in */}
          <Route 
            path="/login" 
            element={
              <AuthGuard requireAuth={false} redirectTo={isAdmin ? "/admin/settings" : "/business-dashboard"}>
                <LoginPage />
              </AuthGuard>
            } 
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
                {isAdmin ? <Navigate to="/admin/settings" replace /> : <BusinessDashboardPage />}
              </AuthGuard>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <AuthGuard requireAuth={true}>
                {isAdmin ? <AdminDashboardPage /> : <Navigate to="/business-dashboard" replace />}
              </AuthGuard>
            } 
          />
          
          <Route 
            path="/admin/settings" 
            element={
              <AuthGuard requireAuth={true}>
                {isAdmin ? <AdminSettingsPage /> : <Navigate to="/business-dashboard" replace />}
              </AuthGuard>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;