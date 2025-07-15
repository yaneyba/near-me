/**
 * Senior Care Custom Layout Configuration
 * 
 * This configuration defines the branding, messaging, and UI elements
 * for the senior care services category (CareFinder).
 */

import { CustomLayoutConfig } from '@/components/layouts/CustomLayout';

export const seniorCareConfig: CustomLayoutConfig = {
  // Branding
  brandName: 'CareFinder',
  // logoComponent: undefined, // Will use text-based brand name for now
  
  // Colors and theming (warm, caring purple/blue theme)
  primaryColor: 'blue-600',
  gradientFrom: 'blue-500', 
  gradientTo: 'blue-700',
  accentColor: 'blue-100',
  
  // Hero section content
  heroTitle: 'Find Trusted Senior Care Services Near You',
  heroSubtitle: 'Discover compassionate, professional senior care providers in your area. From assisted living to home care, find the right support for your loved ones.',
  ctaText: 'Find Care Services',
  searchPlaceholder: 'Search by city, service type, or care facility name...',
  
  // Navigation items
  navItems: [
    { label: 'Find Care', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Resources', href: '/resources' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ],
  
  // Statistics to display
  stats: [
    { value: '1,200+', label: 'Verified Providers' },
    { value: '35+', label: 'Cities Served' },
    { value: '24/7', label: 'Support Available' },
    { value: '95%', label: 'Family Satisfaction' }
  ],
  
  // Popular search suggestions
  popularSuggestions: [
    'Assisted Living',
    'Home Care Services', 
    'Memory Care',
    'Adult Day Care',
    'Skilled Nursing',
    'Respite Care'
  ],
  
  // Category identifier
  categoryKey: 'senior-care'
};
