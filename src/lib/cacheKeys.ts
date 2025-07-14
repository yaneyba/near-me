// Centralized cache key definitions to prevent cache key conflicts
// and ensure consistency across the application

export const CACHE_KEYS = {
  // Cities data - rarely changes
  CITIES: 'cities',
  
  // Business-related queries
  BUSINESSES: 'businesses',
  BUSINESSES_BY_CATEGORY: 'businesses-by-category',
  BUSINESS_DETAIL: 'business-detail',
  
  // Categories and services
  CATEGORIES: 'categories',
  SERVICES: 'services',
  NEIGHBORHOODS: 'neighborhoods',
  
  // Water refill specific
  WATER_STATIONS: 'water-stations',
  WATER_STATION_DETAIL: 'water-station-detail',
  
  // Search and query results
  SEARCH_RESULTS: 'search-results',
  QUERY_RESULTS: 'query-results',
  
  // Static data
  SITE_INFO: 'site-info',
  CONFIG: 'config',
} as const;

// Type-safe cache key creators
export const CacheKeys = {
  cities: () => [CACHE_KEYS.CITIES],
  
  businesses: (params: { category?: string; city?: string; limit?: number; offset?: number }) => 
    [CACHE_KEYS.BUSINESSES, params],
  
  businessesByCategory: (category: string) => 
    [CACHE_KEYS.BUSINESSES_BY_CATEGORY, { category }],
  
  businessDetail: (id: string) => 
    [CACHE_KEYS.BUSINESS_DETAIL, { id }],
  
  categories: () => [CACHE_KEYS.CATEGORIES],
  
  services: () => [CACHE_KEYS.SERVICES],
  
  neighborhoods: (city?: string) => 
    [CACHE_KEYS.NEIGHBORHOODS, city ? { city } : {}],
  
  waterStations: (city?: string) => 
    [CACHE_KEYS.WATER_STATIONS, city ? { city } : {}],
  
  waterStationDetail: (id: string) => 
    [CACHE_KEYS.WATER_STATION_DETAIL, { id }],
  
  searchResults: (query: string, filters?: Record<string, any>) => 
    [CACHE_KEYS.SEARCH_RESULTS, { query, ...filters }],
  
  queryResults: (category: string, city: string, params?: Record<string, any>) => 
    [CACHE_KEYS.QUERY_RESULTS, { category, city, ...params }],
  
  siteInfo: () => [CACHE_KEYS.SITE_INFO],
  
  config: (type?: string) => 
    [CACHE_KEYS.CONFIG, type ? { type } : {}],
};

// Cache key validation helpers
export const isCacheKey = (key: unknown): key is string => {
  return typeof key === 'string' && Object.values(CACHE_KEYS).includes(key as any);
};

export const validateCacheKey = (key: any[]): boolean => {
  return Array.isArray(key) && key.length > 0 && isCacheKey(key[0]);
};
