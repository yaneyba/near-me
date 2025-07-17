// src/utils/subdomainParser.ts

import { SubdomainInfo } from '@/types';
import { isSpecialService, isBlockedSubdomain, cityStateMap } from '@/config/subdomainExceptions';

// Define the two fundamental site architectures
export type SiteType = 'CITY_BUSINESS' | 'CATEGORY_PRODUCT';

// Site type configuration
const SITE_TYPE_CONFIG = {
  'water-refill': 'CITY_BUSINESS' as SiteType,     // Location-based water refill stations
  'senior-care': 'CITY_BUSINESS' as SiteType,      // Location-based senior care services
  'specialty-pet': 'CATEGORY_PRODUCT' as SiteType  // E-commerce pet products marketplace
} as const;

// Get site type for a service
const getSiteType = (specialService: any): SiteType | null => {
  if (specialService.isWaterRefill) return SITE_TYPE_CONFIG['water-refill'];
  if (specialService.isSeniorCare) return SITE_TYPE_CONFIG['senior-care'];
  if (specialService.isSpecialtyPet) return SITE_TYPE_CONFIG['specialty-pet'];
  return null;
};

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

// Parse CITY_BUSINESS sites (water-refill, senior-care)
// URL pattern: domain.com/city-name shows businesses in that city
const parseCitiesBusinessesSite = (specialService: any, pathname: string): SubdomainInfo => {
  const pathParts = pathname.split('/').filter(part => part.length > 0);
  
  // Ignore non-city paths like "api", "admin", etc.
  const nonCityPaths = ['api', 'admin', 'auth', 'search', 'services', 'stations'];
  
  if (pathParts.length > 0) {
    const rawCity = pathParts[0];
    
    // Check if this is a real city, not a route path
    if (!nonCityPaths.includes(rawCity.toLowerCase()) && cityStateMap[rawCity.toLowerCase()]) {
      const city = formatCity(rawCity);
      const state = cityStateMap[rawCity.toLowerCase()];
      
      return {
        category: specialService.category,
        city,
        state,
        isWaterRefill: specialService.isWaterRefill,
        isSeniorCare: specialService.isSeniorCare,
        isPathBased: true
      };
    }
  }
  
  // Default page (no city specified or non-city path)
  return {
    category: specialService.category,
    city: 'All Cities',
    state: 'Nationwide',
    isWaterRefill: specialService.isWaterRefill,
    isSeniorCare: specialService.isSeniorCare,
    isPathBased: true
  };
};

// Parse CATEGORY_PRODUCT sites (specialty-pet)
// URL pattern: domain.com/products shows all products, domain.com/city-name shows products from vendors in that city
const parseCategoriesProductsSite = (specialService: any, pathname: string): SubdomainInfo => {
  // For e-commerce sites, we don't parse cities from paths by default
  // /products = show all products from all vendors/cities
  // /categories = browse by product categories
  // Only actual city names in the path would filter by vendor location
  
  const pathParts = pathname.split('/').filter(part => part.length > 0);
  
  // E-commerce routes that should NOT be treated as cities
  const ecommerceRoutes = ['products', 'categories', 'vendors', 'cart', 'checkout', 'api', 'admin', 'auth', 'search'];
  
  if (pathParts.length > 0) {
    const firstPath = pathParts[0];
    
    // If it's an e-commerce route, show all products/vendors
    if (ecommerceRoutes.includes(firstPath.toLowerCase())) {
      return {
        category: specialService.category,
        city: 'All Cities',
        state: 'Nationwide',
        isSpecialtyPet: true,
        isPathBased: true
      };
    }
    
    // If it's a real city name, filter by vendor location
    if (cityStateMap[firstPath.toLowerCase()]) {
      const city = formatCity(firstPath);
      const state = cityStateMap[firstPath.toLowerCase()];
      
      return {
        category: specialService.category,
        city,
        state,
        isSpecialtyPet: true,
        isPathBased: true
      };
    }
  }
  
  // Default specialty pet page (no path or unrecognized path)
  return {
    category: specialService.category,
    city: 'All Cities',
    state: 'Nationwide',
    isSpecialtyPet: true,
    isPathBased: true
  };
};

export const parseSubdomain = (hostname: string = window.location.hostname, pathname: string = window.location.pathname): SubdomainInfo => {
  // Handle localhost and development (including subdomain.localhost format)
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.includes('stackblitz') || hostname.endsWith('.localhost')) {
    
    // Handle subdomain.localhost format (e.g., water-refill.localhost:5173)
    if (hostname.endsWith('.localhost')) {
      const parts = hostname.split('.');
      if (parts.length >= 2) {
        const subdomain = parts[0];
        
        if (subdomain === 'water-refill') {
          return {
            category: 'Water Refill Stations',
            city: 'All Cities',
            state: 'Nationwide',
            isWaterRefill: true,
            isPathBased: true
          };
        }
        
        if (subdomain === 'senior-care') {
          return {
            category: 'Senior Care Services',
            city: 'All Cities',
            state: 'Nationwide',
            isSeniorCare: true,
            isPathBased: true
          };
        }
        
        if (subdomain === 'specialty-pet') {
          return {
            category: 'Specialty Pet Services',
            city: 'All Cities',
            state: 'Nationwide',
            isSpecialtyPet: true,
            isPathBased: true
          };
        }
      }
    }
    
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
    // Use site type to determine parsing strategy
    const siteType = getSiteType(specialService);
    
    switch (siteType) {
      case 'CITY_BUSINESS':
        // Cities-businesses model: water-refill, senior-care
        return parseCitiesBusinessesSite(specialService, pathname);
        
      case 'CATEGORY_PRODUCT':
        // Categories-products-vendors model: specialty-pet
        return parseCategoriesProductsSite(specialService, pathname);
        
      default:
        // Handle other special services
        return {
          category: specialService.category,
          city: 'All Cities',
          state: 'Nationwide',
          isServices: specialService.isServices || false,
          isPathBased: specialService.isPathBased || false
        };
    }
  }

  // Parse subdomain patterns
  const parts = hostname.split('.');
  
  // Pattern: category.near-me.us with optional /city path
  if (parts.length === 3 && parts[1] === 'near-me' && parts[2] === 'us') {
    const rawCategory = parts[0];
    
    // Extract city from path
    const pathParts = pathname.split('/').filter(part => part.length > 0);
    const rawCity = pathParts.length > 0 ? pathParts[0] : null;
    
    if (rawCity) {
      // Category + City path: nail-salons.near-me.us/dallas
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
      
      // Invalid city for this category - redirect to category page
      const category = formatCategory(rawCategory);
      return {
        category,
        city: 'All Cities',
        state: 'Nationwide',
        rawCategory,
        isCategoryOnly: true
      };
    } else {
      // Category only: nail-salons.near-me.us (no city in path)
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