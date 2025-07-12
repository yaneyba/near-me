import { WaterStation, WaterStationDetail } from './types';

export const transformBusinessToWaterStation = (business: any): WaterStation => {
  // Format hours for display
  const formatHours = (hoursObj: any): string => {
    if (!hoursObj || typeof hoursObj !== 'object') return '';
    
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayNamesCapital = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today];
    const todayNameCapital = dayNamesCapital[today];
    
    // Try both lowercase and capital case
    const todayHours = hoursObj[todayName] || hoursObj[todayNameCapital];
    if (todayHours) {
      return `Today: ${todayHours}`;
    }
    
    // If no hours for today, show Monday hours as fallback
    return hoursObj.monday || hoursObj.Monday ? `Mon: ${hoursObj.monday || hoursObj.Monday}` : '';
  };

  // Determine if currently open
  const isCurrentlyOpen = (hoursObj: any): boolean => {
    if (!hoursObj || typeof hoursObj !== 'object') return false;
    
    const now = new Date();
    const today = now.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayNamesCapital = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today];
    const todayNameCapital = dayNamesCapital[today];
    
    // Try both lowercase and capital case
    const todayHours = hoursObj[todayName] || hoursObj[todayNameCapital];
    if (!todayHours || todayHours.toLowerCase().includes('closed')) return false;
    
    // Simple check for "24 hours" or "open 24 hours"
    if (todayHours.toLowerCase().includes('24') || todayHours.toLowerCase().includes('always open')) {
      return true;
    }
    
    // For other cases, assume open during business hours (9 AM - 6 PM)
    const currentHour = now.getHours();
    return currentHour >= 9 && currentHour < 18;
  };

  return {
    id: business.id,
    name: business.name,
    address: business.address || '',
    city: business.city || '',
    state: business.state || '',
    phone: business.phone || undefined,
    rating: business.rating || 0,
    priceRange: business.pricing_info ? `$${business.pricing_info.per_gallon}/gal` : '',
    distance: '', // Will be calculated based on user location
    isOpen: isCurrentlyOpen(business.hours),
    hours: formatHours(business.hours),
    amenities: business.amenities || [],
    lat: business.latitude || 0,
    lng: business.longitude || 0,
    image: business.image || undefined
  };
};

export const transformBusinessToWaterStationDetail = (business: any): WaterStationDetail => {
  // Format detailed hours object
  const formatDetailedHours = (hoursObj: any) => {
    if (!hoursObj || typeof hoursObj !== 'object') {
      return {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: ''
      };
    }
    
    return {
      monday: hoursObj.monday || hoursObj.Monday || '',
      tuesday: hoursObj.tuesday || hoursObj.Tuesday || '',
      wednesday: hoursObj.wednesday || hoursObj.Wednesday || '',
      thursday: hoursObj.thursday || hoursObj.Thursday || '',
      friday: hoursObj.friday || hoursObj.Friday || '',
      saturday: hoursObj.saturday || hoursObj.Saturday || '',
      sunday: hoursObj.sunday || hoursObj.Sunday || ''
    };
  };

  // Determine if currently open
  const isCurrentlyOpen = (hoursObj: any): boolean => {
    if (!hoursObj || typeof hoursObj !== 'object') return false;
    
    const now = new Date();
    const today = now.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayNamesCapital = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today];
    const todayNameCapital = dayNamesCapital[today];
    
    // Try both lowercase and capital case
    const todayHours = hoursObj[todayName] || hoursObj[todayNameCapital];
    if (!todayHours || todayHours.toLowerCase().includes('closed')) return false;
    
    // Simple check for "24 hours" or "open 24 hours"
    if (todayHours.toLowerCase().includes('24') || todayHours.toLowerCase().includes('always open')) {
      return true;
    }
    
    // For other cases, assume open during business hours (9 AM - 6 PM)
    const currentHour = now.getHours();
    return currentHour >= 9 && currentHour < 18;
  };

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
    reviewCount: business.reviewCount || business.review_count || 0,
    pricePerGallon: business.pricing_info ? `$${business.pricing_info.per_gallon}/gallon` : '',
    isOpen: isCurrentlyOpen(business.hours),
    hours: formatDetailedHours(business.hours),
    waterTypes: business.water_types || business.services || [],
    amenities: business.amenities || [],
    description: business.description || '',
    lat: business.latitude || 0,
    lng: business.longitude || 0,
    photos: business.image ? [business.image] : [], // Use the main image as the first photo
    image: business.image || undefined // Add the main image
  };
};
