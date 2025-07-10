// src/utils/subdomainParser.ts

import { SubdomainInfo } from '../types';
import businessesData from '../data/businesses.json';
import { isSpecialService, isBlockedSubdomain, cityStateMap } from '../config/subdomainExceptions';

// Get valid combinations from business data
const getValidCombinations = (): Set<string> => {
  const combinations = new Set<string>();
  businessesData.forEach(business => {
    const key = `${business.category}.${business.city}`;
    combinations.add(key);
  });
  return combinations;
};

// Cache valid combinations for performance
const validCombinations = getValidCombinations();

// Check if a category-city combination has actual business data
const isValidCombination = (category: string, city: string): boolean => {
  const key = `${category}.${city}`;
  return validCombinations.has(key);
};

// Format category for display (convert kebab-case to Title Case)
const formatCategory = (category: string): string => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format city for display (convert kebab-case to Title Case)
const formatCity = (city: string): string => {
  return city
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const parseSubdomain = (hostname: string = window.location.hostname, pathname: string = window.location.pathname): SubdomainInfo => {
  // Handle localhost and development
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.includes('stackblitz')) {
    return {
      category: 'All Services',
      city: 'All Cities',
      state: 'Nationwide',
      isServices: true
    };
  }

  // Check for blocked subdomains first
  if (isBlockedSubdomain(hostname)) {
    return {
      category: 'All Services',
      city: 'All Cities',
      state: 'Nationwide',
      isServices: true
    };
  }

  // Check for special services
  const specialService = isSpecialService(hostname);
  if (specialService) {
    if (specialService.isWaterRefill) {
      // Handle water refill path-based routing
      const pathParts = pathname.split('/').filter(part => part.length > 0);
      
      if (pathParts.length > 0) {
        const rawCity = pathParts[0];
        const city = formatCity(rawCity);
        const state = cityStateMap[rawCity.toLowerCase()] || 'Unknown State';
        
        return {
          category: specialService.category,
          city,
          state,
          isWaterRefill: true,
          isPathBased: true
        };
      }
      
      // Default water refill page (no city specified)
      return {
        category: specialService.category,
        city: 'All Cities',
        state: 'Nationwide',
        isWaterRefill: true,
        isPathBased: true
      };
    }
    
    // Handle other special services
    return {
      category: specialService.category,
      city: 'All Cities',
      state: 'Nationwide',
      isServices: specialService.isServices || false,
      isPathBased: specialService.isPathBased || false
    };
  }

  // Parse subdomain: category.city.near-me.us
  const parts = hostname.split('.');
  
  if (parts.length >= 4 && parts[2] === 'near-me' && parts[3] === 'us') {
    const rawCategory = parts[0];
    const rawCity = parts[1];
    
    // Check if this is a valid combination with actual business data
    if (isValidCombination(rawCategory, rawCity)) {
      const category = formatCategory(rawCategory);
      const city = formatCity(rawCity);
      const state = cityStateMap[rawCity.toLowerCase()] || 'Unknown State';
      
      return { category, city, state };
    }
    
    // Invalid combination - redirect to services page
    return {
      category: 'All Services',
      city: 'All Cities',
      state: 'Nationwide',
      isServices: true
    };
  }

  // Fallback for any other hostname - redirect to services homepage
  return {
    category: 'All Services',
    city: 'All Cities',
    state: 'Nationwide',
    isServices: true
  };
};

export const generateTitle = (category: string, city: string, state: string): string => {
  return `Best ${category} in ${city}, ${state}`;
};