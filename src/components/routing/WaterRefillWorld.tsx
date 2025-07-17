// Water Refill World - All water refill related pages and routing
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SubdomainInfo } from '@/types';

// Import water refill pages
import { 
  HomePage as WaterRefillHomePage, 
  StationsPage as WaterRefillStationsPage, 
  DetailPage as WaterRefillDetailPage,
  AboutPage as WaterRefillAboutPage,
  ContactPage as WaterRefillContactPage,
  ForBusinessPage as WaterRefillForBusinessPage,
  BusinessSubmissionPage as WaterRefillBusinessSubmissionPage,
  PrivacyPolicyPage as WaterRefillPrivacyPolicyPage,
  TermsOfServicePage as WaterRefillTermsOfServicePage,
  SitemapPage as WaterRefillSitemapPage
} from '@/pages/water-refill';
import { LoginPage } from '@/pages/auth';

interface WaterRefillWorldProps {
  subdomainInfo: SubdomainInfo;
}

/**
 * Water Refill World 💧
 * 
 * This handles everything related to water refill stations:
 * - Finding stations
 * - Station details
 * - City-specific listings
 * - Business registration for water stations
 */
export const WaterRefillWorld: React.FC<WaterRefillWorldProps> = ({ subdomainInfo }) => {
  console.log('💧 WaterRefillWorld starting with subdomainInfo:', subdomainInfo);
  
  // Determine the base path for routes
  // For subdomain-based routing (water-refill.near-me.us or ?subdomain=water-refill), basePath should be empty
  // For path-based routing (near-me.us/water-refill), basePath should be '/water-refill'
  const isSubdomainBased = window.location.hostname.startsWith('water-refill.') || 
                            window.location.hostname.endsWith('.localhost') || 
                            new URLSearchParams(window.location.search).get('subdomain') === 'water-refill';
  const basePath = isSubdomainBased ? '' : '/water-refill';
  console.log('🛤️ WaterRefillWorld basePath:', basePath, '(subdomain-based:', isSubdomainBased, ')');
  
  return (
    <Routes>
      {/* Main water refill homepage */}
      <Route 
        path={`${basePath}/`} 
        element={<WaterRefillHomePage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path={`${basePath}`} 
        element={<WaterRefillHomePage subdomainInfo={subdomainInfo} />} 
      />
      
      {/* All stations listing */}
      <Route 
        path={`${basePath}/stations`} 
        element={<WaterRefillStationsPage subdomainInfo={subdomainInfo} />} 
      />
      
      {/* Individual station details */}
      <Route 
        path={`${basePath}/station/:stationId`} 
        element={<WaterRefillDetailPage subdomainInfo={subdomainInfo} />} 
      />
      
      {/* Business-related pages */}
      <Route 
        path="/for-business" 
        element={<WaterRefillForBusinessPage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path="/submit-business" 
        element={<WaterRefillBusinessSubmissionPage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path="/business-owners" 
        element={<Navigate to="/for-business" replace />} 
      />
      
      {/* Information pages */}
      <Route 
        path={`${basePath}/about`} 
        element={<WaterRefillAboutPage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path={`${basePath}/contact`} 
        element={<WaterRefillContactPage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path={`${basePath}/privacy-policy`} 
        element={<WaterRefillPrivacyPolicyPage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path={`${basePath}/terms-of-service`} 
        element={<WaterRefillTermsOfServicePage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path={`${basePath}/sitemap`} 
        element={<WaterRefillSitemapPage subdomainInfo={subdomainInfo} />} 
      />
      
      {/* Auth pages */}
      <Route 
        path={`${basePath}/login`} 
        element={<LoginPage />} 
      />
      <Route 
        path={`${basePath}/signup`} 
        element={<LoginPage />} 
      />
      
      {/* Specific city routes for water refill - only allow known cities */}
      <Route 
        path={`${basePath}/san-francisco`} 
        element={<WaterRefillHomePage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path={`${basePath}/los-angeles`} 
        element={<WaterRefillHomePage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path={`${basePath}/chicago`} 
        element={<WaterRefillHomePage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path={`${basePath}/dallas`} 
        element={<WaterRefillHomePage subdomainInfo={subdomainInfo} />} 
      />
      
      {/* 404 handler for invalid paths */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
              <p className="text-gray-600 mb-6">This water refill page doesn't exist.</p>
              <a href="/" className="text-blue-600 hover:text-blue-800">← Back to Water Refill Directory</a>
            </div>
          </div>
        } 
      />
    </Routes>
  );
};

export default WaterRefillWorld;
