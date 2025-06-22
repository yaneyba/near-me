import React, { useState, useEffect } from 'react';
import { Star, Phone, MapPin, Clock, ExternalLink, Globe, Filter, SortAsc, ChevronLeft, ChevronRight, Crown, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name' | 'premium'>('premium');
  const [filterBy, setFilterBy] = useState<'all' | 'premium' | 'top-rated' | 'most-reviewed'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  
  // Enhanced pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [paginatedBusinesses, setPaginatedBusinesses] = useState<Business[]>([]);
  const [showPageJump, setShowPageJump] = useState(false);
  const [jumpToPage, setJumpToPage] = useState('');

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
        case 'premium':
          filtered = filtered.filter(business => business.premium);
          break;
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
          case 'premium':
            // Premium businesses first, then by rating
            if (a.premium && !b.premium) return -1;
            if (!a.premium && b.premium) return 1;
            return b.rating - a.rating;
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
      setCurrentPage(1); // Reset to first page when filters change
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [businesses, searchQuery, sortBy, filterBy]);

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedBusinesses(filteredBusinesses.slice(startIndex, endIndex));
  }, [filteredBusinesses, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredBusinesses.length);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Smooth scroll to top of business listings
      const businessSection = document.getElementById('businesses');
      if (businessSection) {
        businessSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handlePageJump = () => {
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
      setJumpToPage('');
      setShowPageJump(false);
    }
  };

  const toggleServicesExpansion = (businessId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(businessId)) {
      newExpanded.delete(businessId);
    } else {
      newExpanded.add(businessId);
    }
    setExpandedServices(newExpanded);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    // Calculate start and end page numbers
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page button
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        buttons.push(
          <button
            key="jump-start"
            onClick={() => setShowPageJump(true)}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Jump to page"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium border transition-colors ${
            i === currentPage
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page button
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <button
            key="jump-end"
            onClick={() => setShowPageJump(true)}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Jump to page"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        );
      }
      
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  const renderServices = (business: Business) => {
    const isExpanded = expandedServices.has(business.id);
    const displayServices = isExpanded ? business.services : business.services.slice(0, 3);
    const hasMoreServices = business.services.length > 3;

    return (
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-900 mb-2">Services:</div>
        <div className="flex flex-wrap gap-1">
          {displayServices.map((service, index) => (
            <span
              key={index}
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                business.premium
                  ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                  : 'bg-blue-50 text-blue-700'
              }`}
            >
              {service}
            </span>
          ))}
          {hasMoreServices && (
            <button
              onClick={() => toggleServicesExpansion(business.id)}
              className={`inline-flex items-center px-2 py-1 text-xs font-medium transition-all duration-200 hover:bg-gray-100 rounded-full ${
                business.premium ? 'text-yellow-600 hover:text-yellow-700' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              {isExpanded ? (
                <>
                  Show less
                  <ChevronUp className="w-3 h-3 ml-1" />
                </>
              ) : (
                <>
                  +{business.services.length - 3} more
                  <ChevronDown className="w-3 h-3 ml-1" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

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
    const premiumCount = filteredBusinesses.filter(b => b.premium).length;
    
    if (searchQuery) {
      return `${total} result${total !== 1 ? 's' : ''} for "${searchQuery}"${premiumCount > 0 ? ` (${premiumCount} premium)` : ''}`;
    }
    return `${total} ${category.toLowerCase()} in ${city}${premiumCount > 0 ? ` (${premiumCount} premium)` : ''}`;
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
            {searchQuery ? 'Search Results' : `All ${category} in ${city}`}
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
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'reviews' | 'name' | 'premium')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="premium">Premium First</option>
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
                value="premium"
                checked={filterBy === 'premium'}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="mr-2"
              />
              <Crown className="w-4 h-4 mr-1 text-yellow-500" />
              Premium Only
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

      {/* Enhanced Pagination Info and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{filteredBusinesses.length}</span> results
          </div>
          
          {totalPages > 1 && (
            <div className="text-sm text-gray-500">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Items per page selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700 whitespace-nowrap">Show:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={6}>6 per page</option>
              <option value={9}>9 per page</option>
              <option value={12}>12 per page</option>
              <option value={18}>18 per page</option>
              <option value={24}>24 per page</option>
            </select>
          </div>

          {/* Quick page jump */}
          {totalPages > 10 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 whitespace-nowrap">Go to:</span>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePageJump()}
                  placeholder="Page"
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handlePageJump}
                  disabled={!jumpToPage || parseInt(jumpToPage) < 1 || parseInt(jumpToPage) > totalPages}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Go
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Business Grid with smooth transitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {paginatedBusinesses.map((business, index) => (
          <div
            key={business.id}
            className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border overflow-hidden relative ${
              business.premium 
                ? 'border-yellow-300 ring-2 ring-yellow-100' 
                : 'border-gray-100'
            }`}
            style={{
              animationDelay: `${index * 50}ms`,
              animation: 'fadeInUp 0.5s ease-out forwards'
            }}
          >
            {/* Premium Badge */}
            {business.premium && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                  <Crown className="w-3 h-3 mr-1" />
                  PREMIUM
                </div>
              </div>
            )}

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
                <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Match
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className={`text-xl font-bold leading-tight ${
                  business.premium ? 'text-yellow-700' : 'text-gray-900'
                }`}>
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
              
              {renderServices(business)}
              
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <a
                  href={`tel:${business.phone}`}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-center transition-colors duration-200 focus:ring-4 focus:outline-none ${
                    business.premium
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white focus:ring-yellow-300/50 shadow-lg'
                      : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300/50'
                  }`}
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

            {/* Premium Glow Effect */}
            {business.premium && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/5 to-orange-500/5 pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>

      {/* Enhanced Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </div>
            
            {/* Quick navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 text-sm text-gray-600 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-sm text-gray-600 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                Last
              </button>
            </div>
          </div>
          
          {/* Main pagination controls */}
          <div className="flex items-center">
            {/* Previous button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            <div className="flex">
              {renderPaginationButtons()}
            </div>

            {/* Next button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Page Jump Modal */}
      {showPageJump && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Jump to Page</h3>
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePageJump()}
                placeholder={`1-${totalPages}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <button
                onClick={handlePageJump}
                disabled={!jumpToPage || parseInt(jumpToPage) < 1 || parseInt(jumpToPage) > totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Go
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowPageJump(false);
                  setJumpToPage('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessListings;