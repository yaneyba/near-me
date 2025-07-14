import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { CACHE_CONFIG } from '@/lib/queryClient';
import { CacheKeys } from '@/lib/cacheKeys';

// Types
interface WaterStation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  website?: string;
  hours?: string;
  amenities?: string[];
  rating?: number;
  reviews_count?: number;
  verified?: boolean;
  free?: boolean;
  bottle_fill?: boolean;
  gallon_fill?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface WaterStationQueryParams {
  city?: string;
  state?: string;
  zip_code?: string;
  free?: boolean;
  bottle_fill?: boolean;
  gallon_fill?: boolean;
  limit?: number;
  offset?: number;
}

// API functions
const fetchWaterStations = async (params: WaterStationQueryParams = {}): Promise<WaterStation[]> => {
  const searchParams = new URLSearchParams();
  
  if (params.city) searchParams.append('city', params.city);
  if (params.state) searchParams.append('state', params.state);
  if (params.zip_code) searchParams.append('zip_code', params.zip_code);
  if (params.free !== undefined) searchParams.append('free', params.free.toString());
  if (params.bottle_fill !== undefined) searchParams.append('bottle_fill', params.bottle_fill.toString());
  if (params.gallon_fill !== undefined) searchParams.append('gallon_fill', params.gallon_fill.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.offset) searchParams.append('offset', params.offset.toString());
  
  // Use the water-refill category to get water stations
  const url = `/api/businesses?category=water-refill${searchParams.toString() ? `&${searchParams.toString()}` : ''}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch water stations: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

const fetchWaterStationDetail = async (stationId: string): Promise<WaterStation | null> => {
  const response = await fetch(`/api/business/${encodeURIComponent(stationId)}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch water station detail: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Custom hooks for water refill stations
export const useWaterStations = (
  params: WaterStationQueryParams = {},
  options?: Omit<UseQueryOptions<WaterStation[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: CacheKeys.waterStations(params.city),
    queryFn: () => fetchWaterStations(params),
    ...CACHE_CONFIG.businesses, // Use business cache config since these are businesses
    ...options,
  });
};

// Hook for water stations in a specific city
export const useWaterStationsByCity = (
  city: string,
  options?: Omit<UseQueryOptions<WaterStation[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: CacheKeys.waterStations(city),
    queryFn: () => fetchWaterStations({ city }),
    enabled: !!city,
    ...CACHE_CONFIG.businesses,
    ...options,
  });
};

// Hook for a single water station detail
export const useWaterStationDetail = (
  stationId: string,
  options?: Omit<UseQueryOptions<WaterStation | null, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: CacheKeys.waterStationDetail(stationId),
    queryFn: () => fetchWaterStationDetail(stationId),
    enabled: !!stationId,
    ...CACHE_CONFIG.businesses,
    ...options,
  });
};

// Hook for free water stations only
export const useFreeWaterStations = (
  city?: string,
  options?: Omit<UseQueryOptions<WaterStation[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...CacheKeys.waterStations(city), 'free'],
    queryFn: () => fetchWaterStations({ city, free: true }),
    ...CACHE_CONFIG.businesses,
    ...options,
  });
};

// Hook for bottle fill stations
export const useBottleFillStations = (
  city?: string,
  options?: Omit<UseQueryOptions<WaterStation[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...CacheKeys.waterStations(city), 'bottle-fill'],
    queryFn: () => fetchWaterStations({ city, bottle_fill: true }),
    ...CACHE_CONFIG.businesses,
    ...options,
  });
};
