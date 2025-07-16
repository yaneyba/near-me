/**
 * Senior Care List Page
 * 
 * Full service listing page for senior care providers directory
 */

import React, { useEffect, useState } from 'react';
import { Layout as SeniorCareLayout, SeniorCareBreadcrumb } from '@/components/layouts/senior-care';
import { SubdomainInfo, Business } from '@/types';
import { DataProviderFactory } from '@/providers/DataProviderFactory';
import { MapPin, Phone, Globe, Clock, Award } from 'lucide-react';

interface SeniorCareListPageProps {
  subdomainInfo: SubdomainInfo;
}

const SeniorCareListPage: React.FC<SeniorCareListPageProps> = ({ subdomainInfo }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');

  useEffect(() => {
    loadBusinesses();
  }, [selectedServiceType]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const dataProvider = DataProviderFactory.getProvider();
      
      // Apply simplified city filtering pattern
      // Use empty string for non-city paths like "All Cities", etc.
      const cityToUse = (subdomainInfo.city === 'All Cities' || subdomainInfo.city === 'Services') ? '' : subdomainInfo.city;
      
      const response = await dataProvider.getBusinesses('senior-care', cityToUse || '');
      setBusinesses(response);
    } catch (err) {
      setError('Failed to load senior care providers');
      console.error('Error loading businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search functionality
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    // TODO: Reset search results
  };

  // Filter businesses based on search query and service type
  const filteredBusinesses = businesses.filter(business => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.services?.some(service => 
        service.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    // Service type filter
    const matchesServiceType = selectedServiceType === '' ||
      business.services?.some(service => service === selectedServiceType);
    
    return matchesSearch && matchesServiceType;
  });

  // Get unique service types for filtering
  const serviceTypes = Array.from(new Set(
    businesses.flatMap(b => b.services || []).filter(Boolean)
  ));

  if (loading) {
    return (
      <SeniorCareLayout 
        subdomainInfo={subdomainInfo}
        showSearchBar={true}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        currentSearchQuery={searchQuery}
      >
        <SeniorCareBreadcrumb pageTitle="All Services" />
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading senior care providers...</p>
          </div>
        </div>
      </SeniorCareLayout>
    );
  }

  if (error) {
    return (
      <SeniorCareLayout 
        subdomainInfo={subdomainInfo}
        showSearchBar={true}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        currentSearchQuery={searchQuery}
      >
        <SeniorCareBreadcrumb pageTitle="All Services" />
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️</div>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={loadBusinesses}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </SeniorCareLayout>
    );
  }

  return (
    <SeniorCareLayout 
      subdomainInfo={subdomainInfo}
      showSearchBar={true}
      onSearch={handleSearch}
      onClearSearch={handleClearSearch}
      currentSearchQuery={searchQuery}
    >
      <SeniorCareBreadcrumb pageTitle="All Services" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Type Filter */}
        {serviceTypes.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedServiceType('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedServiceType === '' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Services
              </button>
              {serviceTypes.map((serviceType) => (
                <button
                  key={serviceType}
                  onClick={() => setSelectedServiceType(serviceType || '')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                    selectedServiceType === serviceType 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {serviceType}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredBusinesses.length === 0 
              ? 'No senior care providers found' 
              : `${filteredBusinesses.length} senior care provider${filteredBusinesses.length === 1 ? '' : 's'} found`
            }
            {searchQuery && ` for "${searchQuery}"`}
            {selectedServiceType && ` in ${selectedServiceType}`}
          </p>
        </div>

        {/* Business Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <div key={business.id} className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Business Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {business.name}
                    </h3>
                    {business.verified && (
                      <div className="flex items-center text-blue-600 text-sm">
                        <Award className="w-4 h-4 mr-1" />
                        Verified Provider
                      </div>
                    )}
                  </div>
                  {business.premium && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Premium
                    </span>
                  )}
                </div>

                {/* Description */}
                {business.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {business.description}
                  </p>
                )}

                {/* Services */}
                {business.services && business.services.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {business.services.slice(0, 3).map((service, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {service}
                        </span>
                      ))}
                      {business.services.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{business.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{business.address}, {business.city}, {business.state}</span>
                  </div>
                  
                  {business.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      <a href={`tel:${business.phone}`} className="hover:text-blue-600">
                        {business.phone}
                      </a>
                    </div>
                  )}
                  
                  {business.website && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                      <a 
                        href={business.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 truncate"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                {/* Hours */}
                {business.hours && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{typeof business.hours === 'string' ? business.hours : 'Call for hours'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBusinesses.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No senior care providers found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or service type filter.
            </p>
            {(searchQuery || selectedServiceType) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedServiceType('');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </SeniorCareLayout>
  );
};

export default SeniorCareListPage;
