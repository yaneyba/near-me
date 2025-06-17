import React from 'react';
import { Star, Phone, MapPin, Clock, ExternalLink, Globe } from 'lucide-react';
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
  const filteredBusinesses = businesses.filter(business => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      business.name.toLowerCase().includes(query) ||
      business.description.toLowerCase().includes(query) ||
      business.services.some(service => service.toLowerCase().includes(query)) ||
      business.neighborhood.toLowerCase().includes(query)
    );
  });

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

  if (filteredBusinesses.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {searchQuery ? 'No businesses found matching your search' : `No ${category.toLowerCase()} found in ${city}`}
          </h2>
          <p className="text-gray-600">
            {searchQuery ? 'Try adjusting your search terms' : 'Check back soon for new listings'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Top {category} in {city}
          {searchQuery && (
            <span className="block text-xl text-gray-600 mt-2">
              Results for "{searchQuery}"
            </span>
          )}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the best {category.toLowerCase()} in {city} with verified reviews and ratings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBusinesses.map((business) => (
          <div
            key={business.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden"
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