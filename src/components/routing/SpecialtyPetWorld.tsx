// Specialty Pet World - All specialty pet service related pages and routing
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SubdomainInfo } from '@/types';

// Import specialty pet pages
import { HomePage as SpecialtyPetHomePage, ListPage as SpecialtyPetListPage } from '@/pages/specialty-pet';
import { LoginPage } from '@/pages/auth';

interface SpecialtyPetWorldProps {
  subdomainInfo: SubdomainInfo;
}

/**
 * Specialty Pet World 🐾
 * 
 * This handles everything related to specialty pet services:
 * - Finding pet care providers
 * - Service details
 * - City-specific listings
 * - Pet care resource information
 * 
 * All within the custom PetCare Pro branded layout
 */
const SpecialtyPetWorld: React.FC<SpecialtyPetWorldProps> = ({ subdomainInfo }) => {
  console.log('🐾 SpecialtyPetWorld starting...');
  console.log('SpecialtyPetWorld received subdomainInfo:', subdomainInfo);
  
  return (
    <Routes>
      {/* Home Routes */}
      <Route 
        path="/" 
        element={<SpecialtyPetHomePage subdomainInfo={subdomainInfo} />} 
      />
      <Route 
        path="/home" 
        element={<SpecialtyPetHomePage subdomainInfo={subdomainInfo} />} 
      />
      
      {/* Products Routes */}
      <Route 
        path="/products" 
        element={<SpecialtyPetListPage subdomainInfo={subdomainInfo} />} 
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

export default SpecialtyPetWorld;
