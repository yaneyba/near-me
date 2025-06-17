import React, { useState, useEffect } from 'react';
import { Star, Phone, MapPin, Clock, ExternalLink, Globe, Filter, SortAsc } from 'lucide-react';
import { Business } from '../types';

interface BusinessListingsProps {
  businesses: Business[];
  category: string;
  city: string;
  searchQuery: string;
}

const BusinessListings: React.FC<BusinessListingsProps> = ({ 
  businesses, 
  category, 
  city, 
  searchQuery 
}) => {
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  const [filterBy, setFilterBy] = useState<'all' | 'top-rated' | 'most-reviewed'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Real-time filtering and sorting
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate processing delay for smooth UX
    const timer = setTimeout(() => {
      let filtered = businesses.filter(business => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          business.name.toLowerCase().includes(query) ||
          business.description.toLowerCase().includes(query) ||
          business.services.some(service => service.toLowerCase().includes(query)) ||
          business.neighborhood.toLowerCase().includes(query)
        );
      });

      // Apply filters
      switch (filterBy) {
        case 'top-rated':
          filtered = filtered.filter(business => business.rating >= 4.5);
          break;
        case 'most-reviewed':
          filtered = filtered.filter(business => business.reviewCount >= 100);
          break;
        default:
          break;
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'reviews':
            return b.reviewCount - a.reviewCount;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });

      setFilteredBusinesses(filtered);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [businesses, searchQuery, sortBy, filterBy]);

  const renderStars = (rating: number, reviewCount: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 font-medium">{rating}</span>
        <span className="ml-1 text-sm text-gray-500">({reviewCount} reviews)</span>
      </div>
    );
  };

  const getResultsText = () => {
    const total = filteredBusinesses.length;
    if (searchQuery) {
      return `${total} result${total !== 1 ? 's' : ''} for "${searchQuery}"`;
    }
    return `${total} ${category.toLowerCase()} in ${city}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding the best results...</p>
        </div>
      </div>
    );
  }

  if (filteredBusinesses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {searchQuery ? 'No businesses found matching your search' : `No ${category.toLowerCase()} found in ${city}`}
          </h2>
          <p className="text-gray-600 mb-6">
            {searchQuery ? 'Try adjusting your search terms or filters' : 'Check back soon for new listings'}
          </p>
          {searchQuery && (
            <div className="space-y-2 text-sm text-gray-500">
              <p>Suggestions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check your spelling</li>
                <li>Try more general terms</li>
                <li>Remove filters to see more results</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Results header with real-time feedback */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {searchQuery ? 'Search Results' : `Top ${category} in ${city}`}
          </h2>
          <p className="text-lg text-gray-600">
            {getResultsText()}
            {searchQuery && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Live Results
              </span>
            )}
          </p>
        </div>
        
        {/* Filters and Sort */}
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'reviews' | 'name')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="rating">Sort by Rating</option>
            <option value="reviews">Sort by Reviews</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="filter"
                value="all"
                checked={filterBy === 'all'}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="mr-2"
              />
              All Businesses
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="filter"
                value="top-rated"
                checked={filterBy === 'top-rated'}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="mr-2"
              />
              Top Rated (4.5+ stars)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="filter"
                value="most-reviewed"
                checked={filterBy === 'most-reviewed'}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="mr-2"
              />
              Most Reviewed (100+ reviews)
            </label>
          </div>
        </div>
      )}

      {/* Business Grid with smooth transitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBusinesses.map((business, index) => (
          <div
            key={business.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden"
            style={{
              animationDelay: `${index * 50}ms`,
              animation: 'fadeInUp 0.5s ease-out forwards'
            }}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-gray-900 border border-white/20">
                {business.neighborhood}
              </div>
              {searchQuery && (
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Match
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {business.name}
                </h3>
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 transition-colors p-1"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
              
              {renderStars(business.rating, business.reviewCount)}
              
              <p className="text-gray-600 mt-3 mb-4 leading-relaxed">
                {business.description}
              </p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <span>{business.address}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                  <a 
                    href={`tel:${business.phone}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {business.phone}
                  </a>
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Today: {business.hours.Monday}</div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-900 mb-2">Services:</div>
                <div className="flex flex-wrap gap-1">
                  {business.services.slice(0, 3).map((service, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {service}
                    </span>
                  ))}
                  {business.services.length > 3 && (
                    <span className="inline-block text-blue-600 px-2 py-1 text-xs font-medium">
                      +{business.services.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <a
                  href={`tel:${business.phone}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium text-center transition-colors duration-200 focus:ring-4 focus:ring-blue-300/50 focus:outline-none"
                >
                  Call Now
                </a>
                {business.website && (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 focus:ring-4 focus:ring-gray-300/50 focus:outline-none"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessListings;