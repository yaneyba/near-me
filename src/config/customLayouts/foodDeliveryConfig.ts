/**
 * Food Delivery Custom Layout Configuration
 * 
 * Example configuration for a food delivery service
 * with warm theming and food-specific messaging.
 */

import { CustomLayoutConfig } from '@/components/layouts/CustomLayout';

export const foodDeliveryConfig: CustomLayoutConfig = {
  // Branding
  brandName: 'FoodFinder',
  // logoComponent: FoodLogo, // Would be created later
  
  // Colors and theming (orange/red theme for food)
  primaryColor: 'orange-600',
  gradientFrom: 'orange-500',
  gradientTo: 'red-600',
  accentColor: 'orange-100',
  
  // Hero section content
  heroTitle: 'Delicious Food Delivered to Your Door',
  heroSubtitle: 'Discover amazing restaurants and cuisines in your area. Order from local favorites and get fresh meals delivered fast.',
  ctaText: 'Find Restaurants Near Me',
  searchPlaceholder: 'Search by restaurant, cuisine, or dish...',
  
  // Navigation items
  navItems: [
    { label: 'Restaurants', href: '/' },
    { label: 'Cuisines', href: '/cuisines' },
    { label: 'Deals', href: '/deals' },
    { label: 'Track Order', href: '/track' },
    // { label: 'Sign In', href: '/login' }
  ],
  
  // Statistics to display
  stats: [
    { value: '5,000+', label: 'Partner Restaurants' },
    { value: '30min', label: 'Avg. Delivery Time' },
    { value: '4.8★', label: 'Customer Rating' },
    { value: '$3.99', label: 'Starting Delivery Fee' }
  ],
  
  // Popular search suggestions
  popularSuggestions: [
    'Pizza',
    'Chinese Food',
    'Burgers',
    'Sushi',
    'Mexican Food',
    'Italian'
  ],
  
  // Category identifier
  categoryKey: 'food-delivery'
};
