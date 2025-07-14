import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { CACHE_CONFIG } from '@/lib/queryClient';
import { CacheKeys } from '@/lib/cacheKeys';

// Types
interface City {
  id: string;
  name: string;
  state: string;
  slug: string;
  businesses_count?: number;
}

// API function to fetch cities
const fetchCities = async (): Promise<City[]> => {
  const response = await fetch('/api/cities');
  if (!response.ok) {
    throw new Error(`Failed to fetch cities: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Custom hook for cities data with caching
export const useCities = (options?: Omit<UseQueryOptions<City[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: CacheKeys.cities(),
    queryFn: fetchCities,
    ...CACHE_CONFIG.cities,
    ...options,
  });
};

// Hook to get a specific city by slug
export const useCity = (citySlug: string, options?: Omit<UseQueryOptions<City | undefined, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: [...CacheKeys.cities(), 'detail', citySlug],
    queryFn: async () => {
      const cities = await fetchCities();
      return cities.find(city => city.slug === citySlug);
    },
    enabled: !!citySlug,
    ...CACHE_CONFIG.cities,
    ...options,
  });
};

// Hook to get cities by state
export const useCitiesByState = (state: string, options?: Omit<UseQueryOptions<City[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: [...CacheKeys.cities(), 'by-state', state],
    queryFn: async () => {
      const cities = await fetchCities();
      return cities.filter(city => city.state.toLowerCase() === state.toLowerCase());
    },
    enabled: !!state,
    ...CACHE_CONFIG.cities,
    ...options,
  });
};
