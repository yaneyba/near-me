import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseSearchSuggestionsReturn {
  recentSearches: string[];
  popularSuggestions: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchSuggestions = (city?: string): UseSearchSuggestionsReturn => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('water-refill-recent-searches');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 5)); // Keep only last 5
        }
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  // Add a new recent search
  const addRecentSearch = useCallback((query: string) => {
    if (!query.trim()) return;

    setRecentSearches(prev => {
      const trimmedQuery = query.trim();
      // Remove if already exists and add to front
      const filtered = prev.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase());
      const newSearches = [trimmedQuery, ...filtered].slice(0, 5);
      
      // Save to localStorage
      try {
        localStorage.setItem('water-refill-recent-searches', JSON.stringify(newSearches));
      } catch (error) {
        console.error('Error saving recent searches:', error);
      }
      
      return newSearches;
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('water-refill-recent-searches');
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  }, []);

  // Popular suggestions based on city or general
  const popularSuggestions = useMemo(() => {
    const basePopular = [
      'Best rated',
      'Near me',
      'Open now',
      'Reviews',
      '24 hours'
    ];

    if (city && city !== 'All Cities') {
      return [
        `Popular in ${city}`,
        ...basePopular
      ];
    }

    return basePopular;
  }, [city]);

  return {
    recentSearches,
    popularSuggestions,
    addRecentSearch,
    clearRecentSearches
  };
};
