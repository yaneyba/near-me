import { WaterStation, WaterStationDetail } from './types';

export const transformBusinessToWaterStation = (business: any): WaterStation => {
  return {
    id: business.id,
    name: business.name,
    address: business.address || '',
    city: business.city || '',
    state: business.state || '',
    phone: business.phone || undefined,
    rating: business.rating || 0,
    priceRange: '', // Will be calculated or left empty if not available
    distance: '', // Will be calculated based on user location
    isOpen: false, // Will be determined by actual business hours
    hours: '', // Only show if we have real hours data
    amenities: [], // Only show real amenities from database
    lat: business.latitude || 0,
    lng: business.longitude || 0,
    image: business.image || undefined
  };
};

export const transformBusinessToWaterStationDetail = (business: any): WaterStationDetail => {
  return {
    id: business.id,
    name: business.name,
    address: business.address || '',
    city: business.city || '',
    state: business.state || '',
    zipCode: '', // Only use if we have real zip code data
    phone: business.phone || undefined,
    website: business.website || undefined,
    rating: business.rating || 0,
    reviewCount: business.review_count || 0,
    pricePerGallon: '', // Only show if we have real pricing data
    isOpen: false, // Only show if we can determine real hours
    hours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: ''
    },
    waterTypes: business.services || [], // Only real services from database
    amenities: [], // Only real amenities from database
    description: business.description || '',
    lat: business.latitude || 0,
    lng: business.longitude || 0,
    photos: business.image ? [business.image] : [], // Use the main image as the first photo
    image: business.image || undefined // Add the main image
  };
};
