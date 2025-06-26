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
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import Layout from './components/Layout';
import AuthGuard from './components/auth/AuthGuard';

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
          
          {/* Auth Routes - Accessible only when NOT logged in */}
          <Route 
            path="/login" 
            element={
              <AuthGuard requireAuth={false} redirectTo="/business-dashboard">
                <LoginPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/register" 
            element={
              <AuthGuard requireAuth={false} redirectTo="/business-dashboard">
                <RegisterPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <AuthGuard requireAuth={false} redirectTo="/business-dashboard">
                <ForgotPasswordPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <AuthGuard requireAuth={false} redirectTo="/business-dashboard">
                <ResetPasswordPage />
              </AuthGuard>
            } 
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
            path="/admin/settings" 
            element={
              <AuthGuard requireAuth={true}>
                <AdminSettingsPage />
              </AuthGuard>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;