// Senior Care World - All senior care related pages and routing
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SubdomainInfo } from '@/types';

// Import senior care pages
import { 
  HomePage as SeniorCareHomePage
} from '@/pages/senior-care';
import { LoginPage } from '@/pages/auth';

interface SeniorCareWorldProps {
  subdomainInfo: SubdomainInfo;
}

/**
 * Senior Care World 🏥
 * 
 * This handles everything related to senior care services:
 * - Finding care providers
 * - Service details
 * - City-specific listings
 * - Care resource information
 * 
 * All within the custom CareFinder branded layout
 */
const SeniorCareWorld: React.FC<SeniorCareWorldProps> = ({ subdomainInfo }) => {
  console.log('🏥 SeniorCareWorld starting...');
  console.log('SeniorCareWorld received subdomainInfo:', subdomainInfo);
  
  return (
    <Routes>
      {/* Home Routes */}
      <Route 
        path="/" 
        element={<SeniorCareHomePage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path="/home" 
        element={<SeniorCareHomePage subdomainInfo={subdomainInfo} />} 
      />
      
      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={<LoginPage />} 
      />
      
      {/* Catch all - redirect to home */}
      <Route 
        path="*" 
        element={<Navigate to="/" replace />} 
      />
    </Routes>
  );
};

export default SeniorCareWorld;
