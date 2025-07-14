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
  return (
    <Routes>
      {/* Main water refill homepage */}
      <Route 
        path="/" 
        element={<WaterRefillHomePage subdomainInfo={subdomainInfo} />} 
      />
      
      {/* All stations listing */}
      <Route 
        path="/stations" 
        element={<WaterRefillStationsPage subdomainInfo={subdomainInfo} />} 
      />
      
      {/* Individual station details */}
      <Route 
        path="/station/:stationId" 
        element={<WaterRefillDetailPage subdomainInfo={subdomainInfo} />} 
      />
      
      {/* Business-related pages */}
      <Route 
        path="/for-business" 
        element={<WaterRefillForBusinessPage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path="/business-owners" 
        element={<Navigate to="/for-business" replace />} 
      />
      
      {/* Information pages */}
      <Route 
        path="/about" 
        element={<WaterRefillAboutPage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path="/contact" 
        element={<WaterRefillContactPage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path="/privacy-policy" 
        element={<WaterRefillPrivacyPolicyPage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path="/terms-of-service" 
        element={<WaterRefillTermsOfServicePage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path="/sitemap" 
        element={<WaterRefillSitemapPage subdomainInfo={subdomainInfo} />} 
      />
      
      {/* Auth pages */}
      <Route 
        path="/login" 
        element={<LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={<LoginPage />} 
      />
      
      {/* City-specific water refill pages */}
      <Route 
        path="/:city" 
        element={<WaterRefillHomePage subdomainInfo={subdomainInfo} />} 
      />
    </Routes>
  );
};

export default WaterRefillWorld;
