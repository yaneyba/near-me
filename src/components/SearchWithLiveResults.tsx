import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Business } from '../types';

interface SearchWithLiveResultsProps {
  businesses: Business[];
  category: string;
  city: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

interface SearchSuggestion {
  type: 'business' | 'service' | 'neighborhood';
  text: string;
  business?: Business;
}

const SearchWithLiveResults: React.FC<SearchWithLiveResultsProps> = ({
  businesses,
  category,
  city,
  onSearch,
  placeholder = `Search ${category.toLowerCase()} in ${city}...`,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`recent-searches-${category}-${city}`);
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, [category, city]);

  // Generate suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay for realistic feel
    const timer = setTimeout(() => {
      const queryLower = query.toLowerCase();
      const newSuggestions: SearchSuggestion[] = [];

      // Business name matches
      businesses.forEach(business => {
        if (business.name.toLowerCase().includes(queryLower)) {
          newSuggestions.push({
            type: 'business',
            text: business.name,
            business
          });
        }
      });

      // Service matches
      const serviceMatches = new Set<string>();
      businesses.forEach(business => {
        business.services.forEach(service => {
          if (service.toLowerCase().includes(queryLower) && !serviceMatches.has(service)) {
            serviceMatches.add(service);
            newSuggestions.push({
              type: 'service',
              text: service
            });
          }
        });
      });

      // Neighborhood matches
      const neighborhoodMatches = new Set<string>();
      businesses.forEach(business => {
        if (business.neighborhood.toLowerCase().includes(queryLower) && !neighborhoodMatches.has(business.neighborhood)) {
          neighborhoodMatches.add(business.neighborhood);
          newSuggestions.push({
            type: 'neighborhood',
            text: business.neighborhood
          });
        }
      });

      // Limit suggestions and prioritize exact matches
      const sortedSuggestions = newSuggestions
        .sort((a, b) => {
          const aExact = a.text.toLowerCase().startsWith(queryLower);
          const bExact = b.text.toLowerCase().startsWith(queryLower);
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          return 0;
        })
        .slice(0, 8);

      setSuggestions(sortedSuggestions);
      setSelectedIndex(-1);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, businesses]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    
    // Real-time search feedback
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch(suggestion.text);
    saveRecentSearch(suggestion.text);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      saveRecentSearch(query);
      setShowSuggestions(false);
    }
  };

  const saveRecentSearch = (searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(`recent-searches-${category}-${city}`, JSON.stringify(updated));
  };

  const clearQuery = () => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    onSearch(searchTerm);
    setShowSuggestions(false);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'business':
        return '🏢';
      case 'service':
        return '⚙️';
      case 'neighborhood':
        return '📍';
      default:
        return '🔍';
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-800 font-medium">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-500"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={clearQuery}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Live Results Count */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-1 text-sm text-white/80 px-4 z-40">
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
              Searching...
            </div>
          ) : (
            <div>
              {suggestions.length > 0 ? (
                `${suggestions.length} suggestion${suggestions.length !== 1 ? 's' : ''} found`
              ) : query.length > 0 ? (
                'No suggestions found'
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-8 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
        >
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Clock className="w-4 h-4 mr-1" />
                Recent Searches
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          {!query && (
            <div className="p-4">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                Popular in {city}
              </div>
              <div className="space-y-1">
                {['Best rated', 'Near me', 'Open now', 'Reviews'].map((popular, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(popular)}
                    className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                  >
                    {popular}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Live Suggestions */}
          {query && suggestions.length > 0 && (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center ${
                    index === selectedIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <span className="text-lg mr-3">{getSuggestionIcon(suggestion.type)}</span>
                  <div className="flex-1">
                    <div className="text-gray-900">
                      {highlightMatch(suggestion.text, query)}
                    </div>
                    {suggestion.business && (
                      <div className="text-sm text-gray-500 mt-1">
                        {suggestion.business.neighborhood} • ⭐ {suggestion.business.rating}
                      </div>
                    )}
                    {suggestion.type === 'service' && (
                      <div className="text-sm text-gray-500 mt-1">
                        Service • {category}
                      </div>
                    )}
                    {suggestion.type === 'neighborhood' && (
                      <div className="text-sm text-gray-500 mt-1">
                        Area in {city}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results - Enhanced visibility */}
          {query && !isLoading && suggestions.length === 0 && (
            <div className="p-6 text-center text-gray-500 bg-gray-50 border-t border-gray-100">
              <div className="text-4xl mb-3">🔍</div>
              <div className="text-lg font-medium text-gray-700 mb-2">
                No suggestions found for "{query}"
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Try adjusting your search terms or browse our categories
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium">Suggestions:</p>
                <ul className="space-y-1">
                  <li>• Check your spelling</li>
                  <li>• Try more general terms</li>
                  <li>• Browse by neighborhood or service type</li>
                </ul>
              </div>
              <button
                onClick={clearQuery}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWithLiveResults;