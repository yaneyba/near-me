import { QueryClient } from '@tanstack/react-query';

// Cache configuration based on data type
const CACHE_CONFIG = {
  cities: {
    staleTime: 30 * 60 * 1000,     // 30 minutes - cities rarely change
    gcTime: 60 * 60 * 1000,        // 1 hour (replaces cacheTime)
    refetchOnWindowFocus: false,
    retry: 3,
  },
  businesses: {
    staleTime: 5 * 60 * 1000,      // 5 minutes - business data changes more frequently
    gcTime: 15 * 60 * 1000,        // 15 minutes (replaces cacheTime)
    refetchOnWindowFocus: true,
    retry: 2,
  },
  categories: {
    staleTime: 60 * 60 * 1000,     // 1 hour - categories rarely change
    gcTime: 24 * 60 * 60 * 1000,   // 24 hours (replaces cacheTime)
    refetchOnWindowFocus: false,
    retry: 3,
  },
  static: {
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - static data
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days (replaces cacheTime)
    refetchOnWindowFocus: false,
    retry: 1,
  }
};

// Create the query client with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default cache settings - conservative approach
      staleTime: 5 * 60 * 1000,    // 5 minutes
      gcTime: 15 * 60 * 1000,      // 15 minutes (replaces cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for network/server errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Export cache configurations for use in hooks
export { CACHE_CONFIG };

// Helper function to create query keys
export const createQueryKey = (type: string, params?: Record<string, any>) => {
  const baseKey: (string | Record<string, any>)[] = [type];
  if (params) {
    // Sort params to ensure consistent cache keys
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, any>);
    baseKey.push(sortedParams);
  }
  return baseKey;
};

// Cache invalidation helpers
export const invalidateBusinesses = () => {
  queryClient.invalidateQueries({ queryKey: ['businesses'] });
};

export const invalidateCities = () => {
  queryClient.invalidateQueries({ queryKey: ['cities'] });
};

export const invalidateCategories = () => {
  queryClient.invalidateQueries({ queryKey: ['categories'] });
};
