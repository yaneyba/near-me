import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { CACHE_CONFIG } from '@/lib/queryClient';
import { CacheKeys } from '@/lib/cacheKeys';

// Types
interface Business {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  address?: string;
  phone?: string;
  website?: string;
  description?: string;
  rating?: number;
  reviews_count?: number;
  verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface BusinessQueryParams {
  category?: string;
  city?: string;
  state?: string;
  limit?: number;
  offset?: number;
  verified?: boolean;
}

// API function to fetch businesses
const fetchBusinesses = async (params: BusinessQueryParams = {}): Promise<Business[]> => {
  const searchParams = new URLSearchParams();
  
  if (params.category) searchParams.append('category', params.category);
  if (params.city) searchParams.append('city', params.city);
  if (params.state) searchParams.append('state', params.state);
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.offset) searchParams.append('offset', params.offset.toString());
  if (params.verified !== undefined) searchParams.append('verified', params.verified.toString());
  
  const url = `/api/businesses${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch businesses: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// API function to fetch businesses by category
const fetchBusinessesByCategory = async (category: string): Promise<Business[]> => {
  const response = await fetch(`/api/businesses-by-category?category=${encodeURIComponent(category)}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch businesses by category: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Custom hook for businesses with caching
export const useBusinesses = (
  params: BusinessQueryParams = {},
  options?: Omit<UseQueryOptions<Business[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: CacheKeys.businesses(params),
    queryFn: () => fetchBusinesses(params),
    ...CACHE_CONFIG.businesses,
    ...options,
  });
};

// Custom hook for businesses by category with caching
export const useBusinessesByCategory = (
  category: string,
  options?: Omit<UseQueryOptions<Business[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: CacheKeys.businessesByCategory(category),
    queryFn: () => fetchBusinessesByCategory(category),
    enabled: !!category,
    ...CACHE_CONFIG.businesses,
    ...options,
  });
};

// Hook for businesses in a specific city and category (most common query)
export const useBusinessesByCityAndCategory = (
  city: string,
  category: string,
  options?: Omit<UseQueryOptions<Business[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: CacheKeys.businesses({ city, category }),
    queryFn: () => fetchBusinesses({ city, category }),
    enabled: !!(city && category),
    ...CACHE_CONFIG.businesses,
    ...options,
  });
};

// Hook for a single business detail
export const useBusinessDetail = (
  businessId: string,
  options?: Omit<UseQueryOptions<Business | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: CacheKeys.businessDetail(businessId),
    queryFn: async () => {
      const response = await fetch(`/api/business/${encodeURIComponent(businessId)}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch business detail: ${response.status} ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!businessId,
    ...CACHE_CONFIG.businesses,
    ...options,
  });
};
