import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { CACHE_CONFIG } from '@/lib/queryClient';
import { CacheKeys } from '@/lib/cacheKeys';

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  businesses_count?: number;
  icon?: string;
  featured?: boolean;
}

interface Service {
  id: string;
  name: string;
  category_id: string;
  slug: string;
  description?: string;
  businesses_count?: number;
}

interface Neighborhood {
  id: string;
  name: string;
  city: string;
  slug: string;
  description?: string;
  businesses_count?: number;
}

// API functions
const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch('/api/services');
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const fetchServices = async (): Promise<Service[]> => {
  const response = await fetch('/api/services');
  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

const fetchNeighborhoods = async (city?: string): Promise<Neighborhood[]> => {
  const url = city ? `/api/neighborhoods?city=${encodeURIComponent(city)}` : '/api/neighborhoods';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch neighborhoods: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Custom hooks with caching
export const useCategories = (options?: Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: CacheKeys.categories(),
    queryFn: fetchCategories,
    ...CACHE_CONFIG.categories,
    ...options,
  });
};

export const useServices = (options?: Omit<UseQueryOptions<Service[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: CacheKeys.services(),
    queryFn: fetchServices,
    ...CACHE_CONFIG.categories,
    ...options,
  });
};

export const useNeighborhoods = (
  city?: string,
  options?: Omit<UseQueryOptions<Neighborhood[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: CacheKeys.neighborhoods(city),
    queryFn: () => fetchNeighborhoods(city),
    ...CACHE_CONFIG.categories,
    ...options,
  });
};

// Hook to get featured categories
export const useFeaturedCategories = (options?: Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: [...CacheKeys.categories(), 'featured'],
    queryFn: async () => {
      const categories = await fetchCategories();
      return categories.filter(category => category.featured);
    },
    ...CACHE_CONFIG.categories,
    ...options,
  });
};

// Hook to get a specific category by slug
export const useCategory = (
  categorySlug: string,
  options?: Omit<UseQueryOptions<Category | undefined, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...CacheKeys.categories(), 'detail', categorySlug],
    queryFn: async () => {
      const categories = await fetchCategories();
      return categories.find(category => category.slug === categorySlug);
    },
    enabled: !!categorySlug,
    ...CACHE_CONFIG.categories,
    ...options,
  });
};
