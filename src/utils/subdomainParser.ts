// src/utils/subdomainParser.ts

import { SubdomainInfo } from '@/types';
import { isSpecialService, isBlockedSubdomain, cityStateMap } from '@/config/subdomainExceptions';

// Static valid combinations based on our database
const getValidCombinations = (): Set<string> => {
  const combinations = new Set<string>();
  
  // Known categories and cities from our database
  const categories = ['nail-salons', 'auto-repair'];
  const cities = ['frisco', 'garland', 'austin', 'chicago', 'denver', 'milwaukee', 'phoenix', 'san-francisco', 'seattle'];
  
  categories.forEach(category => {
    cities.forEach(city => {
      combinations.add(`${category}.${city}`);
    });
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
    // Check for dev query parameter to simulate subdomains
    const urlParams = new URLSearchParams(window.location.search);
    const devSubdomain = urlParams.get('subdomain');
    
    if (devSubdomain === 'water-refill') {
      return {
        category: 'Water Refill Stations',
        city: 'All Cities',
        state: 'Nationwide',
        isWaterRefill: true,
        isPathBased: true
      };
    }
    
    if (devSubdomain === 'senior-care') {
      return {
        category: 'Senior Care Services',
        city: 'All Cities',
        state: 'Nationwide',
        isSeniorCare: true,
        isPathBased: true
      };
    }
    
    if (devSubdomain === 'specialty-pet') {
      return {
        category: 'Specialty Pet Services',
        city: 'All Cities',
        state: 'Nationwide',
        isSpecialtyPet: true,
        isPathBased: true
      };
    }
    
    // Check for path-based water-refill routing on localhost
    if (pathname.startsWith('/water-refill')) {
      return {
        category: 'Water Refill Stations',
        city: 'All Cities',
        state: 'Nationwide',
        isWaterRefill: true,
        isPathBased: true
      };
    }
    
    // Check for path-based senior-care routing on localhost
    if (pathname.startsWith('/senior-care')) {
      return {
        category: 'Senior Care Services',
        city: 'All Cities',
        state: 'Nationwide',
        isSeniorCare: true,
        isPathBased: true
      };
    }
    
    // Check for path-based specialty-pet routing on localhost
    if (pathname.startsWith('/specialty-pet')) {
      return {
        category: 'Specialty Pet Services',
        city: 'All Cities',
        state: 'Nationwide',
        isSpecialtyPet: true,
        isPathBased: true
      };
    }
    
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
    
    if (specialService.isSeniorCare) {
      // Handle senior care path-based routing
      const pathParts = pathname.split('/').filter(part => part.length > 0);
      
      if (pathParts.length > 0) {
        const rawCity = pathParts[0];
        const city = formatCity(rawCity);
        const state = cityStateMap[rawCity.toLowerCase()] || 'Unknown State';
        
        return {
          category: specialService.category,
          city,
          state,
          isSeniorCare: true,
          isPathBased: true
        };
      }
      
      // Default senior care page (no city specified)
      return {
        category: specialService.category,
        city: 'All Cities',
        state: 'Nationwide',
        isSeniorCare: true,
        isPathBased: true
      };
    }
    
    if (specialService.isSpecialtyPet) {
      // Handle specialty pet path-based routing
      const pathParts = pathname.split('/').filter(part => part.length > 0);
      
      if (pathParts.length > 0) {
        const rawCity = pathParts[0];
        const city = formatCity(rawCity);
        const state = cityStateMap[rawCity.toLowerCase()] || 'Unknown State';
        
        return {
          category: specialService.category,
          city,
          state,
          isSpecialtyPet: true,
          isPathBased: true
        };
      }
      
      // Default specialty pet page (no city specified)
      return {
        category: specialService.category,
        city: 'All Cities',
        state: 'Nationwide',
        isSpecialtyPet: true,
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

  // Parse subdomain patterns
  const parts = hostname.split('.');
  
  // Pattern 1: category.city.near-me.us (4+ parts)
  if (parts.length >= 4 && parts[2] === 'near-me' && parts[3] === 'us') {
    const rawCategory = parts[0];
    const rawCity = parts[1];
    
    // Check if this is a valid combination with actual business data
    const isValid = isValidCombination(rawCategory, rawCity);
    
    if (isValid) {
      const category = formatCategory(rawCategory);
      const city = formatCity(rawCity);
      const state = cityStateMap[rawCity.toLowerCase()] || 'Unknown State';
      
      return { 
        category, 
        city, 
        state, 
        rawCategory, 
        rawCity 
      };
    }
    
    // Invalid combination - redirect to services page
    return {
      category: 'All Services',
      city: 'All Cities',
      state: 'Nationwide',
      isServices: true
    };
  }
  
  // Pattern 2: category.near-me.us (3 parts - category only, no city)
  if (parts.length === 3 && parts[1] === 'near-me' && parts[2] === 'us') {
    const rawCategory = parts[0];
    const validCategories = ['nail-salons', 'auto-repair'];
    
    if (validCategories.includes(rawCategory)) {
      const category = formatCategory(rawCategory);
      
      return {
        category,
        city: 'All Cities',
        state: 'Nationwide',
        rawCategory,
        isCategoryOnly: true
      };
    }
    
    // Invalid category - redirect to services page
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
  if (city === 'All Cities' && state === 'Nationwide') {
    return `Best ${category} | Find Local ${category} Near You`;
  }
  return `Best ${category} in ${city}, ${state}`;
};