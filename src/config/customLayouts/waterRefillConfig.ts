/**
 * Water Refill Station Custom Layout Configuration
 * 
 * This configuration defines the branding, messaging, and UI elements
 * for the water refill stations category (AquaFinder).
 */

import { CustomLayoutConfig } from '@/components/layouts/CustomLayout';
import { Logo } from '@/components/water-refill';

export const waterRefillConfig: CustomLayoutConfig = {
  // Branding
  brandName: 'AquaFinder',
  logoComponent: Logo,
  
  // Colors and theming (blue theme for water)
  primaryColor: 'blue-600',
  gradientFrom: 'blue-500',
  gradientTo: 'blue-700',
  accentColor: 'blue-100',
  
  // Hero section content
  heroTitle: 'Find Quality Water Refill Stations Near You',
  heroSubtitle: 'Discover clean, affordable water refill locations in your area. Save money and reduce plastic waste with our comprehensive directory.',
  ctaText: 'Find Stations Near Me',
  searchPlaceholder: 'Search by city, zip code, or station name...',
  
  // Navigation items
  navItems: [
    { label: 'Find Stations', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Sign In', href: '/login' }
  ],
  
  // Statistics to display
  stats: [
    { value: '2,500+', label: 'Verified Stations' },
    { value: '50+', label: 'Cities Covered' },
    { value: '$0.25', label: 'Average Price/Gallon' },
    { value: '98%', label: 'Customer Satisfaction' }
  ],
  
  // Popular search suggestions
  popularSuggestions: [
    'Walmart Supercenter',
    'CVS Pharmacy', 
    'Kroger',
    'Target',
    'Whole Foods Market'
  ],
  
  // Category identifier
  categoryKey: 'water-refill'
};
