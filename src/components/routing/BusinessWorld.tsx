// Business World - All regular business directory pages and routing
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SubdomainInfo } from '@/types';

// Import business pages
import { 
  HomePage, 
  SitemapPage 
} from '@/pages/core';
import { 
  AboutPage, 
  ContactPage, 
  PrivacyPolicyPage, 
  TermsOfServicePage 
} from '@/pages/info';
import { 
  AddBusinessPage, 
  BusinessOwnersPage, 
  BusinessDashboardPage 
} from '@/pages/business';
import { AdminDashboardPage } from '@/pages/admin';
import { LoginPage } from '@/pages/auth';
import { 
  CheckoutSuccessPage, 
  CheckoutCancelPage 
} from '@/pages/payment';

// Import layout
import { SubdomainLayout } from '@/components/layouts';
import AuthGuard from '@/components/auth/AuthGuard';

interface BusinessWorldProps {
  subdomainInfo: SubdomainInfo;
}

/**
 * Business World 🏢
 * 
 * This handles everything related to regular business directories:
 * - Category + City combinations (lawyers.dallas.near-me.us)
 * - Business listings and details
 * - Business owner dashboards
 * - Admin functionality
 * - Payment processing
 */
export const BusinessWorld: React.FC<BusinessWorldProps> = ({ subdomainInfo }) => {
  return (
    <SubdomainLayout subdomainInfo={subdomainInfo}>
      <Routes>
        {/* 🏠 Main homepage for this category/city */}
        <Route 
          path="/" 
          element={<HomePage subdomainInfo={subdomainInfo} />} 
        />
        
        {/* 📄 Information pages */}
        <Route path="/about" element={<AboutPage subdomainInfo={subdomainInfo} />} />
        <Route path="/contact" element={<ContactPage subdomainInfo={subdomainInfo} />} />
        <Route path="/sitemap" element={<SitemapPage subdomainInfo={subdomainInfo} />} />
        <Route path="/sitemap-generator" element={<SitemapPage subdomainInfo={subdomainInfo} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        
        {/* 🏪 Business-related pages */}
        <Route path="/add-business" element={<AddBusinessPage subdomainInfo={subdomainInfo} />} />
        <Route path="/business-owners" element={<BusinessOwnersPage />} />
        
        {/* 💳 Payment pages */}
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
        
        {/* 🔐 Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/register" 
          element={<AuthGuard requireAuth={false} redirectTo="/add-business" />} 
        />
        
        {/* 🏢 Protected Business Routes */}
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
        <Route 
          path="/business-dashboard" 
          element={<Navigate to="/business/dashboard" replace />} 
        />
        
        {/* 👑 Admin Routes */}
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
  );
};

export default BusinessWorld;
