/**
 * Specialty Pet Services Custom Layout Configuration
 * 
 * This configuration defines the branding, messaging, and UI elements
 * for the specialty pet services category (PetCare Pro).
 */

import { CustomLayoutConfig } from '@/components/layouts/CustomLayout';

export const specialtyPetConfig: CustomLayoutConfig = {
  // Branding
  brandName: 'PetCare Pro',
  // logoComponent: undefined, // Will use text-based brand name for now
  
  // Colors and theming (warm, friendly pet-focused theme)
  primaryColor: 'emerald-600',
  gradientFrom: 'emerald-500', 
  gradientTo: 'teal-600',
  accentColor: 'emerald-100',
  
  // Hero section content
  heroTitle: 'Find Expert Specialty Pet Services Near You',
  heroSubtitle: 'Discover professional pet care specialists in your area. From exotic veterinarians to pet grooming, training, and boarding - find the perfect care for your beloved companions.',
  ctaText: 'Find Pet Services',
  searchPlaceholder: 'Search by city, service type, or business name...',
  
  // Navigation items
  navItems: [
    { label: 'Find Services', href: '/' },
    { label: 'Pet Care', href: '/services' },
    { label: 'Resources', href: '/resources' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
    // { label: 'Sign In', href: '/login' }
  ],
  
  // Statistics to display
  stats: [
    { value: '800+', label: 'Verified Providers' },
    { value: '25+', label: 'Cities Served' },
    { value: '50+', label: 'Service Types' },
    { value: '99%', label: 'Happy Pet Parents' }
  ],
  
  // Popular search suggestions
  popularSuggestions: [
    'Exotic Veterinarian',
    'Pet Grooming',
    'Dog Training',
    'Pet Boarding',
    'Pet Photography',
    'Animal Behaviorist'
  ],
  
  // Category identifier
  categoryKey: 'specialty-pet'
};
