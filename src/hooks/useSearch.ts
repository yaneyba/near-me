import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseSearchOptions {
  enableUrlParams?: boolean;
  scrollTargetId?: string;
  debounceMs?: number;
}

interface UseSearchReturn {
  searchQuery: string;
  debouncedSearchQuery: string;
  serviceFilter: string;
  effectiveSearchQuery: string;
  handleSearch: (query: string) => void;
  handleServiceFilter: (service: string) => void;
  getEffectiveSearchQuery: () => string;
  clearSearch: () => void;
  isSearching: boolean;
}

export const useSearch = (options: UseSearchOptions = {}): UseSearchReturn => {
  const { enableUrlParams = false, scrollTargetId = 'businesses', debounceMs = 500 } = options;
  
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    enableUrlParams ? (searchParams.get('search') || '') : ''
  );
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce the search query
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set searching state if query is different
    if (searchQuery !== debouncedSearchQuery) {
      setIsSearching(true);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchQuery, debounceMs]);

  // Separate effect for scrolling (only when debounced query changes)
  useEffect(() => {
    if (debouncedSearchQuery && scrollTargetId) {
      const targetSection = document.getElementById(scrollTargetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [debouncedSearchQuery, scrollTargetId]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setServiceFilter(''); // Clear service filter when searching
  }, []);

  const handleServiceFilter = useCallback((service: string) => {
    setServiceFilter(service);
    setSearchQuery(''); // Clear search query when filtering by service
  }, []);

  // Compute effective search query as a memoized value
  const effectiveSearchQuery = useMemo(() => {
    return serviceFilter || debouncedSearchQuery;
  }, [serviceFilter, debouncedSearchQuery]);

  // Memoized function version (for backwards compatibility)
  const getEffectiveSearchQuery = useCallback(() => {
    return effectiveSearchQuery;
  }, [effectiveSearchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setServiceFilter('');
    setIsSearching(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    searchQuery,
    debouncedSearchQuery,
    serviceFilter,
    effectiveSearchQuery,
    handleSearch,
    handleServiceFilter,
    getEffectiveSearchQuery,
    clearSearch,
    isSearching,
  };
};