// src/utils/subdomainParser.ts

import { SubdomainInfo } from '../types';

// Map cities to their states
const cityStateMap: Record<string, string> = {
  'dallas': 'Texas',
  'garland': 'Texas',
  'denver': 'Colorado',
  'austin': 'Texas',
  'houston': 'Texas',
  'frisco': 'Texas',
  'phoenix': 'Arizona',
  'chicago': 'Illinois',
  'atlanta': 'Georgia',
  'miami': 'Florida',
  'seattle': 'Washington',
  'portland': 'Oregon',
  'san-francisco': 'California',
  'los-angeles': 'California',
  'new-york': 'New York',
  'boston': 'Massachusetts',
  'philadelphia': 'Pennsylvania'
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

  // Check for services.near-me.us pattern (services homepage)
  if (hostname === 'services.near-me.us' || hostname.includes('services.near-me.us')) {
    return {
      category: 'All Services',
      city: 'All Cities',
      state: 'Nationwide',
      isServices: true
    };
  }

  // Check for water-refill.near-me.us pattern
  if (hostname === 'water-refill.near-me.us' || hostname.includes('water-refill.near-me.us')) {
    // Parse path for city: /city-name
    const pathParts = pathname.split('/').filter(part => part.length > 0);
    
    if (pathParts.length > 0) {
      const rawCity = pathParts[0];
      const city = formatCity(rawCity);
      const state = cityStateMap[rawCity.toLowerCase()] || 'Unknown State';
      
      return {
        category: 'Water Refill Stations',
        city,
        state,
        isWaterRefill: true,
        isPathBased: true
      };
    }
    
    // Default water refill page (no city specified)
    return {
      category: 'Water Refill Stations',
      city: 'All Cities',
      state: 'Nationwide',
      isWaterRefill: true,
      isPathBased: true
    };
  }

  // Parse subdomain: category.city.near-me.us
  const parts = hostname.split('.');
  
  if (parts.length >= 4 && parts[2] === 'near-me' && parts[3] === 'us') {
    const rawCategory = parts[0];
    const rawCity = parts[1];
    
    const category = formatCategory(rawCategory);
    const city = formatCity(rawCity);
    const state = cityStateMap[rawCity.toLowerCase()] || 'Unknown State';
    
    return { category, city, state };
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