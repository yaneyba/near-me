import React, { useState } from 'react';
import { CheckCircle, Search, Filter, TrendingUp, Users, Star } from 'lucide-react';

interface ServicesSectionProps {
  services: string[];
  category: string;
  city: string;
  onServiceFilter?: (service: string) => void;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ 
  services, 
  category, 
  city,
  onServiceFilter 
}) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  if (services.length === 0) return null;

  const handleServiceClick = (service: string) => {
    // Toggle selection
    const newSelection = selectedService === service ? null : service;
    setSelectedService(newSelection);
    
    // Call the filter callback if provided
    if (onServiceFilter) {
      onServiceFilter(newSelection || '');
    }

    // Smooth scroll to business listings
    const businessSection = document.getElementById('businesses');
    if (businessSection) {
      businessSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const clearFilter = () => {
    setSelectedService(null);
    if (onServiceFilter) {
      onServiceFilter('');
    }
  };

  // Get popular services (first 6) and remaining services
  const popularServices = services.slice(0, 6);
  const otherServices = services.slice(6);

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular {category} Services in {city}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Find the specific services you need from top-rated {category.toLowerCase()} in {city}
          </p>
          
          {/* Filter Status */}
          {selectedService && (
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Filter className="w-4 h-4 mr-2" />
              Filtering by: {selectedService}
              <button
                onClick={clearFilter}
                className="ml-3 text-blue-600 hover:text-blue-800 font-semibold"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Popular Services */}
        {popularServices.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Most Popular Services</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularServices.map((service, index) => (
                <button
                  key={index}
                  onClick={() => handleServiceClick(service)}
                  onMouseEnter={() => setHoveredService(service)}
                  onMouseLeave={() => setHoveredService(null)}
                  className={`group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border-2 text-left transform hover:-translate-y-1 ${
                    selectedService === service
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-100 hover:border-blue-200'
                  }`}
                >
                  {/* Popular Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      POPULAR
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 transition-colors ${
                      selectedService === service
                        ? 'bg-blue-500'
                        : hoveredService === service
                        ? 'bg-blue-100'
                        : 'bg-emerald-100'
                    }`}>
                      {selectedService === service ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Search className={`w-6 h-6 transition-colors ${
                          hoveredService === service ? 'text-blue-600' : 'text-emerald-600'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold mb-2 transition-colors ${
                        selectedService === service ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {service}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Find {category.toLowerCase()} specializing in {service.toLowerCase()} in {city}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="w-3 h-3 mr-1" />
                        <span>Multiple providers available</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 ${
                    hoveredService === service ? 'opacity-100' : ''
                  }`}></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Other Services */}
        {otherServices.length > 0 && (
          <div>
            <div className="flex items-center justify-center mb-6">
              <Star className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Additional Services</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {otherServices.map((service, index) => (
                <button
                  key={index}
                  onClick={() => handleServiceClick(service)}
                  onMouseEnter={() => setHoveredService(service)}
                  onMouseLeave={() => setHoveredService(null)}
                  className={`group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border text-left transform hover:-translate-y-0.5 ${
                    selectedService === service
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200'
                      : 'border-gray-100 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors ${
                      selectedService === service
                        ? 'bg-blue-500'
                        : hoveredService === service
                        ? 'bg-blue-100'
                        : 'bg-emerald-100'
                    }`}>
                      {selectedService === service ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Search className={`w-4 h-4 transition-colors ${
                          hoveredService === service ? 'text-blue-600' : 'text-emerald-600'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-medium transition-colors ${
                        selectedService === service ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {service}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Specific Service?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Use our search feature to find {category.toLowerCase()} 
              that offer exactly what you need in {city}.
            </p>
            <button
              onClick={() => {
                const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (searchInput) {
                  searchInput.focus();
                  searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Search All Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;