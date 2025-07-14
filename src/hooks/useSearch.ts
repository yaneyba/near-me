import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseSearchOptions {
  enableUrlParams?: boolean;
  scrollTargetId?: string;
}

interface UseSearchReturn {
  searchQuery: string;
  serviceFilter: string;
  handleSearch: (query: string) => void;
  handleServiceFilter: (service: string) => void;
  getEffectiveSearchQuery: () => string;
  clearSearch: () => void;
}

export const useSearch = (options: UseSearchOptions = {}): UseSearchReturn => {
  const { enableUrlParams = false, scrollTargetId = 'businesses' } = options;
  
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    enableUrlParams ? (searchParams.get('search') || '') : ''
  );
  const [serviceFilter, setServiceFilter] = useState<string>('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setServiceFilter(''); // Clear service filter when searching
    
    // Smooth scroll to target section if query exists and element is found
    if (query) {
      const targetSection = document.getElementById(scrollTargetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleServiceFilter = (service: string) => {
    setServiceFilter(service);
    setSearchQuery(''); // Clear search query when filtering by service
  };

  // Combine search and service filter - prioritize service filter
  const getEffectiveSearchQuery = () => {
    return serviceFilter || searchQuery;
  };

  const clearSearch = () => {
    setSearchQuery('');
    setServiceFilter('');
  };

  return {
    searchQuery,
    serviceFilter,
    handleSearch,
    handleServiceFilter,
    getEffectiveSearchQuery,
    clearSearch,
  };
};