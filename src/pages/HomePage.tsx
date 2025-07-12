import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataProviderFactory } from '@/providers';
import { Business, SubdomainInfo } from '@/types';
import { generateTitle } from '@/utils/subdomainParser';
import { Hero, ServicesSection } from '@/components/shared/content';
import { PremiumListings, BusinessListings } from '@/components/shared/business';

interface HomePageProps {
  subdomainInfo: SubdomainInfo;
}

const HomePage: React.FC<HomePageProps> = ({ subdomainInfo }) => {
  const [searchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const dataProvider = DataProviderFactory.getProvider();

  // Update document title
  useEffect(() => {
    document.title = generateTitle(subdomainInfo.category, subdomainInfo.city, subdomainInfo.state);
  }, [subdomainInfo]);

  // Load data when subdomain info changes
  useEffect(() => {
    if (subdomainInfo.rawCategory && subdomainInfo.rawCity) {
      loadData(subdomainInfo.rawCategory, subdomainInfo.rawCity);
    } else if (subdomainInfo.category && subdomainInfo.city) {
      // Fallback to display format if raw values not available
      loadData(subdomainInfo.category, subdomainInfo.city);
    }
  }, [subdomainInfo]);

  const loadData = async (category: string, city: string) => {
    setLoading(true);
    try {
      // For services, use raw category if available, otherwise use the passed category
      const serviceCategory = subdomainInfo.rawCategory || category;
      
      const [businessData, serviceData] = await Promise.all([
        dataProvider.getBusinesses(category, city),
        dataProvider.getServices(serviceCategory)
      ]);
      
      setBusinesses(businessData);
      setServices(serviceData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setServiceFilter(''); // Clear service filter when searching
    // Smooth scroll to business listings section
    const businessSection = document.getElementById('businesses');
    if (businessSection && query) {
      businessSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleServiceFilter = (service: string) => {
    setServiceFilter(service);
    setSearchQuery(''); // Clear search query when filtering by service
  };

  // Combine search and service filter for business listings
  const getEffectiveSearchQuery = () => {
    if (serviceFilter) return serviceFilter;
    return searchQuery;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {subdomainInfo.category} in {subdomainInfo.city}...</p>
        </div>
      </div>
    );
  }

  // Check if there are premium businesses to show
  const hasPremiumBusinesses = businesses.some(business => business.premium);
  const effectiveQuery = getEffectiveSearchQuery();

  return (
    <>
      <Hero
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
        businesses={businesses}
        onSearch={handleSearch}
      />
      
      {/* Show Premium Listings section only if there are premium businesses and no active filters */}
      {hasPremiumBusinesses && !effectiveQuery && (
        <div id="premium">
          <PremiumListings
            businesses={businesses}
            category={subdomainInfo.category}
            city={subdomainInfo.city}
          />
        </div>
      )}
      
      <div id="businesses">
        <BusinessListings
          businesses={businesses}
          category={subdomainInfo.category}
          city={subdomainInfo.city}
          searchQuery={effectiveQuery}
        />
      </div>
      
      <div id="services">
        <ServicesSection
          services={services}
          category={subdomainInfo.category}
          city={subdomainInfo.city}
          onServiceFilter={handleServiceFilter}
        />
      </div>
    </>
  );
};

export default HomePage;