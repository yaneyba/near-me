/**
 * API Endpoints Enum - Single source of truth for all API routes
 * Provides type safety and centralized endpoint management
 */
export enum ApiEndpoints {
  // Core business data endpoints
  BUSINESSES = '/api/businesses',
  BUSINESSES_BY_CATEGORY = '/api/businesses-by-category',
  SERVICES = '/api/services', 
  NEIGHBORHOODS = '/api/neighborhoods',
  CITIES = '/api/cities',

  // Individual business lookup endpoints
  BUSINESS_BY_ID = '/api/business',
  WATER_STATIONS = '/api/water-stations',

  // Submission endpoints
  CONTACT = '/api/contact',
  SUBMIT_BUSINESS = '/api/submit-business',
  
  // Analytics & tracking endpoints
  TRACK_ENGAGEMENT = '/api/track-engagement',

  // Admin endpoints
  ADMIN_BUSINESS_SUBMISSIONS = '/api/admin/business-submissions',
  ADMIN_BUSINESS_PROFILES = '/api/admin/business-profiles', 
  ADMIN_CONTACT_MESSAGES = '/api/admin/contact-messages',
  ADMIN_BUSINESSES = '/api/admin/businesses',
  ADMIN_STATS = '/api/admin/stats',
  ADMIN_ENGAGEMENT = '/api/admin/engagement',

  // Legacy/Direct query endpoint (for migration)
  QUERY = '/api/query'
}

/**
 * Helper functions for building dynamic endpoints
 */
export const EndpointBuilder = {
  /**
   * Build business by ID endpoint
   */
  businessById: (id: string) => `${ApiEndpoints.BUSINESS_BY_ID}/${id}`,
  
  /**
   * Build water station by ID endpoint  
   */
  waterStationById: (stationId: string) => `${ApiEndpoints.WATER_STATIONS}/${stationId}`,
  
  /**
   * Build businesses endpoint with query params
   */
  businessesWithParams: (category: string, city: string) => 
    `${ApiEndpoints.BUSINESSES}?${new URLSearchParams({ category, city })}`,
  
  /**
   * Build businesses by category endpoint (all cities)
   */
  businessesByCategory: (category: string) => 
    `${ApiEndpoints.BUSINESSES_BY_CATEGORY}?${new URLSearchParams({ category })}`,
  
  /**
   * Build services endpoint with category param
   */
  servicesWithCategory: (category: string) => 
    `${ApiEndpoints.SERVICES}?${new URLSearchParams({ category })}`,
  
  /**
   * Build neighborhoods endpoint with city param
   */
  neighborhoodsWithCity: (city: string) => 
    `${ApiEndpoints.NEIGHBORHOODS}?${new URLSearchParams({ city })}`,
  
  /**
   * Build cities endpoint with optional state inclusion
   */
  citiesWithState: (includeState: boolean = false) => 
    includeState ? `${ApiEndpoints.CITIES}?include_state=true` : ApiEndpoints.CITIES,
  
  /**
   * Build admin businesses endpoint with type param
   */
  adminBusinessesWithType: (type: string = 'all') => 
    `${ApiEndpoints.ADMIN_BUSINESSES}?type=${type}`
} as const;

/**
 * Type-safe endpoint validation
 */
export const validateEndpoint = (endpoint: string): boolean => {
  return Object.values(ApiEndpoints).includes(endpoint as ApiEndpoints);
};

/**
 * Get all available endpoints as an array
 */
export const getAllEndpoints = (): string[] => {
  return Object.values(ApiEndpoints);
};
