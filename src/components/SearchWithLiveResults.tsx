import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Star } from 'lucide-react';

interface Business {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  category: string;
  city: string;
  neighborhood?: string;
  website?: string;
  description?: string;
}

interface SearchWithLiveResultsProps {
  businesses: Business[];
  category: string;
  city: string;
  onSearch: (query: string) => void;
  className?: string;
}

export default function SearchWithLiveResults({
  businesses,
  category,
  city,
  onSearch,
  className = ''
}: SearchWithLiveResultsProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Business[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = businesses.filter(business =>
        business.name.toLowerCase().includes(query.toLowerCase()) ||
        business.address.toLowerCase().includes(query.toLowerCase()) ||
        business.neighborhood?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, businesses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
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
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (business: Business) => {
    setQuery(business.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch(business.name);
    inputRef.current?.blur();
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(e.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          placeholder={`Search ${category} in ${city}...`}
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {suggestions.map((business, index) => (
            <div
              key={business.id}
              onClick={() => selectSuggestion(business)}
              className={`p-4 cursor-pointer transition-colors duration-150 ${
                index === selectedIndex
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              } ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {business.name}
                  </h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">{business.address}</span>
                  </div>
                  {business.neighborhood && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {business.neighborhood}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center ml-4 flex-shrink-0">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium text-gray-900">
                    {business.rating}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">
                    ({business.reviewCount})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}