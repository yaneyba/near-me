import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search as SearchIcon, X, Clock, TrendingUp } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'result';
  icon?: React.ReactNode;
}

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  showDropdown?: boolean;
  showRecentSearches?: boolean;
  showPopularSuggestions?: boolean;
  recentSearches?: string[];
  popularSuggestions?: string[];
  liveResults?: SearchSuggestion[];
  loading?: boolean;
  city?: string;
  variant?: 'default' | 'hero' | 'compact';
}

const Search: React.FC<SearchProps> = ({
  value,
  onChange,
  onSelect,
  onSubmit,
  placeholder = "Search...",
  className = "",
  showDropdown = true,
  showRecentSearches = true,
  showPopularSuggestions = true,
  recentSearches = [],
  popularSuggestions = [],
  liveResults = [],
  loading = false,
  city = "",
  variant = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  }, [onChange]);

  const handleInputFocus = useCallback(() => {
    if (showDropdown) {
      setIsOpen(true);
    }
  }, [showDropdown]);

  const handleInputBlur = useCallback(() => {
    // Delay closing to allow for clicks on dropdown items
    setTimeout(() => setIsOpen(false), 150);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    onChange(suggestion);
    if (onSelect) {
      onSelect(suggestion);
    }
    setIsOpen(false);
    inputRef.current?.blur();
  }, [onChange, onSelect]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && value.trim()) {
      onSubmit(value.trim());
    }
    setIsOpen(false);
    inputRef.current?.blur();
  }, [onSubmit, value]);

  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }, []);

  // Combine all suggestions
  const allSuggestions = [
    ...recentSearches.map(search => ({
      id: `recent-${search}`,
      text: search,
      type: 'recent' as const,
      icon: <Clock className="w-4 h-4 text-gray-400" />
    })),
    ...popularSuggestions.map(suggestion => ({
      id: `popular-${suggestion}`,
      text: suggestion,
      type: 'popular' as const,
      icon: <TrendingUp className="w-4 h-4 text-gray-400" />
    })),
    ...liveResults
  ];

  // Filter suggestions based on search value
  const filteredSuggestions = value.trim() 
    ? allSuggestions.filter(suggestion => 
        suggestion.text.toLowerCase().includes(value.toLowerCase())
      )
    : allSuggestions;

  // Show different content based on search state
  const showSuggestions = isOpen && showDropdown && (
    value.trim() === '' || filteredSuggestions.length > 0
  );

  // Variant-specific styling
  const getInputClassName = () => {
    const baseClasses = "w-full pl-10 pr-10 border focus:ring-2 focus:border-transparent transition-all duration-200";
    
    switch (variant) {
      case 'hero':
        return `${baseClasses} py-4 text-lg rounded-xl border-white/20 bg-white/10 text-white placeholder-white/70 focus:ring-white/30 focus:bg-white/20`;
      case 'compact':
        return `${baseClasses} py-2 text-sm rounded-lg border-gray-300 focus:ring-blue-500`;
      default:
        return `${baseClasses} py-3 rounded-lg border-gray-300 focus:ring-blue-500`;
    }
  };

  const getDropdownClassName = () => {
    const baseClasses = "absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto";
    
    switch (variant) {
      case 'hero':
        return `${baseClasses} rounded-xl mt-2 border-gray-100`;
      default:
        return `${baseClasses} rounded-lg mt-1`;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            variant === 'hero' ? 'text-white/70 w-5 h-5' : 'text-gray-400 w-4 h-4'
          }`} />
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={getInputClassName()}
            autoComplete="off"
          />
          
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                variant === 'hero' ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-gray-600'
              } transition-colors`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {showSuggestions && (
        <div ref={dropdownRef} className={getDropdownClassName()}>
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              Searching...
            </div>
          ) : (
            <div className="py-2">
              {/* Recent Searches */}
              {showRecentSearches && recentSearches.length > 0 && value.trim() === '' && (
                <div className="px-4 py-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Recent Searches
                  </div>
                  {recentSearches.slice(0, 3).map((search) => (
                    <button
                      key={`recent-${search}`}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full flex items-center gap-3 px-0 py-2 hover:bg-gray-50 rounded text-left transition-colors"
                    >
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700 truncate">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Suggestions */}
              {showPopularSuggestions && popularSuggestions.length > 0 && value.trim() === '' && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Popular in {city || 'Your Area'}
                  </div>
                  {popularSuggestions.slice(0, 5).map((suggestion) => (
                    <button
                      key={`popular-${suggestion}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 px-0 py-2 hover:bg-gray-50 rounded text-left transition-colors"
                    >
                      <TrendingUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700 truncate">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Live Results */}
              {value.trim() !== '' && filteredSuggestions.length > 0 && (
                <div className="px-4 py-2">
                  {filteredSuggestions.slice(0, 8).map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="w-full flex items-center gap-3 px-0 py-2 hover:bg-gray-50 rounded text-left transition-colors"
                    >
                      {suggestion.icon || <SearchIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                      <span className="text-gray-700 truncate">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {value.trim() !== '' && filteredSuggestions.length === 0 && (
                <div className="px-4 py-6 text-center text-gray-500">
                  <SearchIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm">No suggestions found</p>
                  <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
