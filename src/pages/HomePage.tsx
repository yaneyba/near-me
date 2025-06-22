import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JsonDataProvider } from '../providers/JsonDataProvider';
import { Business, SubdomainInfo } from '../types';
import { generateTitle } from '../utils/subdomainParser';
import Hero from '../components/Hero';
import PremiumListings from '../components/PremiumListings';
import BusinessListings from '../components/BusinessListings';
import ServicesSection from '../components/ServicesSection';

interface HomePageProps {
  subdomainInfo: SubdomainInfo;
}

const HomePage: React.FC<HomePageProps> = ({ subdomainInfo }) => {
  const [searchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);
  
  const dataProvider = new JsonDataProvider();

  // Update document title
  useEffect(() => {
    document.title = generateTitle(subdomainInfo.category, subdomainInfo.city, subdomainInfo.state);
  }, [subdomainInfo]);

  // Load data when subdomain info changes
  useEffect(() => {
    if (subdomainInfo.category && subdomainInfo.city) {
      loadData(subdomainInfo.category, subdomainInfo.city);
    }
  }, [subdomainInfo]);

  const loadData = async (category: string, city: string) => {
    setLoading(true);
    try {
      const [businessData, serviceData] = await Promise.all([
        dataProvider.getBusinesses(category, city),
        dataProvider.getServices(category)
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
    // Smooth scroll to business listings section
    const businessSection = document.getElementById('businesses');
    if (businessSection && query) {
      businessSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

  return (
    <>
      <Hero
        category={subdomainInfo.category}
        city={subdomainInfo.city}
        state={subdomainInfo.state}
        businesses={businesses}
        onSearch={handleSearch}
      />
      
      {/* Show Premium Listings section only if there are premium businesses and no search query */}
      {hasPremiumBusinesses && !searchQuery && (
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
          searchQuery={searchQuery}
        />
      </div>
      
      <div id="services">
        <ServicesSection
          services={services}
          category={subdomainInfo.category}
          city={subdomainInfo.city}
        />
      </div>
    </>
  );
};

export default HomePage;