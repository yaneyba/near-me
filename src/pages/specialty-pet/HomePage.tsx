/**
 * Specialty Pet Home Page
 * 
 * Main landing page for specialty pet services directory
 */

import React, { useEffect, useState } from 'react';
import { SpecialtyPetLayout } from '@/components/layouts/specialty-pet';
import { SubdomainInfo, Business } from '@/types';
import { DataProviderFactory } from '@/providers/DataProviderFactory';

interface SpecialtyPetHomePageProps {
  subdomainInfo: SubdomainInfo;
}

const SpecialtyPetHomePage: React.FC<SpecialtyPetHomePageProps> = ({ subdomainInfo }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const dataProvider = DataProviderFactory.getProvider();
      const response = await dataProvider.getBusinesses('specialty-pet', subdomainInfo.city);
      setBusinesses(response);
    } catch (err) {
      setError('Failed to load specialty pet providers');
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

  if (loading) {
    return (
      <SpecialtyPetLayout 
        subdomainInfo={subdomainInfo}
        showSearchBar={true}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        currentSearchQuery={searchQuery}
      >
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading specialty pet services...</p>
          </div>
        </div>
      </SpecialtyPetLayout>
    );
  }

  if (error) {
    return (
      <SpecialtyPetLayout 
        subdomainInfo={subdomainInfo}
        showSearchBar={true}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        currentSearchQuery={searchQuery}
      >
        <div className="flex justify-center items-center min-h-96">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">⚠️</div>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={loadBusinesses}
              className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </SpecialtyPetLayout>
    );
  }

  return (
    <SpecialtyPetLayout 
      subdomainInfo={subdomainInfo}
      showSearchBar={true}
      onSearch={handleSearch}
      onClearSearch={handleClearSearch}
      currentSearchQuery={searchQuery}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {subdomainInfo.city === 'All Cities' 
              ? 'Specialty Pet Services Nationwide' 
              : `Specialty Pet Services in ${subdomainInfo.city}, ${subdomainInfo.state}`
            }
          </h2>
          <p className="text-gray-600">
            Found {businesses.length} specialist{businesses.length !== 1 ? 's' : ''} 
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Business Listings */}
        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? `No specialty pet services match "${searchQuery}" in this area.`
                : 'No specialty pet services are currently listed in this area.'
              }
            </p>
            {searchQuery && (
              <button 
                onClick={handleClearSearch}
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <div 
                key={business.id} 
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {business.name}
                </h3>
                {business.address && (
                  <p className="text-gray-600 text-sm mb-2">
                    📍 {business.address}
                  </p>
                )}
                {business.phone && (
                  <p className="text-gray-600 text-sm mb-2">
                    📞 {business.phone}
                  </p>
                )}
                {business.website && (
                  <a 
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 text-sm"
                  >
                    🌐 Visit Website
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </SpecialtyPetLayout>
  );
};

export default SpecialtyPetHomePage;
