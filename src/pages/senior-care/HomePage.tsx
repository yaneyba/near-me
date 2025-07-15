/**
 * Senior Care Home Page
 * 
 * Main landing page for senior care services directory
 */

import React, { useEffect, useState } from 'react';
import { Layout as SeniorCareLayout } from '@/components/layouts/senior-care';
import { SubdomainInfo, Business } from '@/types';
import { DataProviderFactory } from '@/providers/DataProviderFactory';

interface SeniorCareHomePageProps {
  subdomainInfo: SubdomainInfo;
}

const SeniorCareHomePage: React.FC<SeniorCareHomePageProps> = ({ subdomainInfo }) => {
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
      const response = await dataProvider.getBusinesses('senior-care', subdomainInfo.city);
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

  if (loading) {
    return (
      <SeniorCareLayout 
        subdomainInfo={subdomainInfo}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        currentSearchQuery={searchQuery}
      >
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </SeniorCareLayout>
    );
  }

  if (error) {
    return (
      <SeniorCareLayout 
        subdomainInfo={subdomainInfo}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        currentSearchQuery={searchQuery}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={loadBusinesses}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
      onSearch={handleSearch}
      onClearSearch={handleClearSearch}
      currentSearchQuery={searchQuery}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {businesses.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No senior care providers found in {subdomainInfo.city}
            </h2>
            <p className="text-gray-600 mb-8">
              We're continuously adding new providers to our directory. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <div key={business.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {business.name}
                </h3>
                <p className="text-gray-600 mb-3">{business.description}</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>{business.address}</p>
                  {business.phone && <p>{business.phone}</p>}
                  {business.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">{business.rating} ({business.review_count} reviews)</span>
                    </div>
                  )}
                </div>
                {business.website && (
                  <a 
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </SeniorCareLayout>
  );
};

export default SeniorCareHomePage;
