import { SubdomainInfo } from '../types';

// Map cities to their states
const cityStateMap: Record<string, string> = {
  'dallas': 'Texas',
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

export const parseSubdomain = (hostname: string = window.location.hostname): SubdomainInfo => {
  // Handle localhost and development
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.includes('stackblitz')) {
    return {
      category: 'Nail Salons',
      city: 'Frisco',
      state: 'Texas'
    };
  }

  // Parse subdomain: category.city.near-me.us
  const parts = hostname.split('.');
  
  if (parts.length >= 4 && parts[2] === 'near-me' && parts[3] === 'us') {
    const rawCategory = parts[0];
    const rawCity = parts[1];
    
    const category = formatCategory(rawCategory);
    const city = formatCity(rawCity);
    const state = cityStateMap[rawCity] || 'Unknown State';
    
    return { category, city, state };
  }

  // Fallback for any other hostname
  return {
    category: 'Nail Salons',
    city: 'Frisco',
    state: 'Texas'
  };
};

export const generateTitle = (category: string, city: string, state: string): string => {
  return `Best ${category} in ${city}, ${state}`;
};