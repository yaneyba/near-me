/**
 * EV Charging Station Custom Layout Configuration
 * 
 * Example configuration for an electric vehicle charging station
 * category with green theming and EV-specific messaging.
 */

import { CustomLayoutConfig } from '@/components/layouts/CustomLayout';

export const evChargingConfig: CustomLayoutConfig = {
  // Branding
  brandName: 'ChargeFinder',
  // logoComponent: EvLogo, // Would be created later
  
  // Colors and theming (green theme for eco-friendly)
  primaryColor: 'green-600',
  gradientFrom: 'green-500',
  gradientTo: 'green-700',
  accentColor: 'green-100',
  
  // Hero section content
  heroTitle: 'Find EV Charging Stations Near You',
  heroSubtitle: 'Locate fast, reliable electric vehicle charging stations. Plan your route with confidence and keep your EV powered up.',
  ctaText: 'Find Charging Stations',
  searchPlaceholder: 'Search by location, charging network, or station type...',
  
  // Navigation items
  navItems: [
    { label: 'Find Stations', href: '/' },
    { label: 'Route Planner', href: '/plan-route' },
    { label: 'Networks', href: '/networks' },
    { label: 'About', href: '/about' },
    // { label: 'Sign In', href: '/login' }
  ],
  
  // Statistics to display
  stats: [
    { value: '15,000+', label: 'Charging Ports' },
    { value: '3,500+', label: 'Locations' },
    { value: '99.2%', label: 'Uptime' },
    { value: '45min', label: 'Avg. Charge Time' }
  ],
  
  // Popular search suggestions
  popularSuggestions: [
    'Tesla Supercharger',
    'ChargePoint',
    'EVgo',
    'Electrify America',
    'Blink Charging'
  ],
  
  // Category identifier
  categoryKey: 'ev-charging'
};
